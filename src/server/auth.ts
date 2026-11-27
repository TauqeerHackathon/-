import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { claimInitialAdminPassword, getAdminAuthRow } from './db';

const SIGNING_KEY = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const revokedTokens = new Set<string>();

// Simple in-memory sliding-window rate limiter per IP & bucket
const rateBuckets = new Map<string, number[]>();

export function createRateLimiter(bucketName: string, maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${bucketName}:${ip}`;
    const now = Date.now();
    const history = (rateBuckets.get(key) ?? []).filter((ts) => now - ts < windowMs);
    if (history.length >= maxRequests) {
      res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
      return;
    }
    history.push(now);
    rateBuckets.set(key, history);
    next();
  };
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt ?? crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { hash: derived, salt: actualSalt };
}

export function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function getAdminAuthStatus(): {
  needsFirstRunSetup: boolean;
  configuredViaEnv: boolean;
} {
  const envPass = (process.env.ADMIN_PASSWORD || '').trim();
  if (envPass.length > 0) {
    return { needsFirstRunSetup: false, configuredViaEnv: true };
  }
  const row = getAdminAuthRow();
  return { needsFirstRunSetup: !row, configuredViaEnv: false };
}

const ENV_COMPARE_SALT = crypto.randomBytes(16).toString('hex');

export function verifyAdminPassword(candidate: string): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  const envPass = (process.env.ADMIN_PASSWORD || '').trim();
  if (envPass.length > 0) {
    // Environment variable passcode always overrides any claimed fallback hash
    const expected = hashPassword(envPass, ENV_COMPARE_SALT).hash;
    const provided = hashPassword(candidate, ENV_COMPARE_SALT).hash;
    return safeEqualStrings(expected, provided);
  }

  const row = getAdminAuthRow();
  if (!row) return false;
  const provided = hashPassword(candidate, row.salt).hash;
  return safeEqualStrings(row.password_hash, provided);
}

export function setupInitialAdmin(password: string): { ok: boolean; error?: string } {
  const status = getAdminAuthStatus();
  if (status.configuredViaEnv) {
    return { ok: false, error: 'Admin password is already configured via environment settings.' };
  }
  if (!status.needsFirstRunSetup) {
    return { ok: false, error: 'Initial admin setup has already been completed.' };
  }
  if (!password || password.length < 8) {
    return { ok: false, error: 'Please choose an administrator password with at least 8 characters.' };
  }
  const { hash, salt } = hashPassword(password);
  const claimed = claimInitialAdminPassword(hash, salt);
  if (!claimed) {
    return { ok: false, error: 'Initial admin setup has already been completed.' };
  }
  return { ok: true };
}

export function issueAdminToken(): { token: string; expiresAt: string } {
  const exp = Date.now() + TOKEN_TTL_MS;
  const nonce = crypto.randomBytes(12).toString('hex');
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp, nonce })).toString('base64url');
  const sig = crypto.createHmac('sha256', SIGNING_KEY).update(payload).digest('base64url');
  return {
    token: `${payload}.${sig}`,
    expiresAt: new Date(exp).toISOString(),
  };
}

export function verifyAdminToken(token: string): boolean {
  if (!token || revokedTokens.has(token)) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', SIGNING_KEY).update(payload).digest('base64url');
  if (!safeEqualStrings(sig, expectedSig)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    if (parsed.role !== 'admin') return false;
    if (!parsed.exp || Date.now() > parsed.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export function revokeAdminToken(token: string): void {
  if (token) revokedTokens.add(token);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Administrator authentication required.' });
    return;
  }
  const token = authHeader.slice(7).trim();
  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }
  next();
}
