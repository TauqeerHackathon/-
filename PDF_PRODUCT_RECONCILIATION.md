# PDF Product Reconciliation Report — Kanhaiya Aushadhi Bhandar

**Verification Date**: 2026-11-27
**Source of Truth**: Official 2-page Kanhaiya Aushadhi Bhandar stock-list PDF (35 source groups: Section A `A01–A20`, Section B `B01–B07`, Section C `C01–C08`).

## Summary Verification Metrics

| Metric | Verified Result |
| --- | --- |
| Total Source PDF Groups Expected | 35 (Section A: 20, Section B: 7, Section C: 8) |
| Total Source PDF Groups Covered | 35 / 35 |
| Missing PDF Source Groups | 0 |
| Total Individual Item Occurrences in PDF | 112 |
| Deduplicated Cross-Section Canonical Records | 1 (`जटामांसी` merged across `A16` Page 1 and `C07` Page 2 -> `kab-canonical-jatamansi`) |
| Total Canonical Products in Database | 111 |
| Products with Explicit Sub-Variants | 7 products (14 explicit variants) |
| Featured Products Flagged | 12 |
| Unauthorized Added Products | 0 |
| Duplicate Slugs / Duplicate Records | 0 |
| Unverified Botanical Names Claimed | 0 (94 `pending`, 17 `ambiguous` flagged for expert review) |
| Invented Prices / Pack Sizes / Stock Claims | 0 (all set to `Contact for Price` & `Confirm Availability`) |
| Mineral / Chemical Caution Items Flagged | 8 |
| Total Elevated Caution / Non-Consumable Items | 34 |
| Reconciliation Status | **PASSED (0 discrepancies)** |

## Explicit Product Variants Verification

| Canonical Product | Slug | PDF Group | Verified Variants |
| --- | --- | --- | --- |
| सूखा आंवला (Dried Amla (Whole & Pieces)) | `sukha-amla` | A03, A03 | साबुत (Whole (Sabut)), कली (Deseeeded Pieces (Kali)) |
| बहेड़ा (Baheda (Whole & Peel)) | `baheda` | A04, A04 | साबुत (Whole (Sabut)), छिलका (Outer Peel (Chilka)) |
| अश्वगंधा (Ashwagandha (Nagauri Root & Powder)) | `ashwagandha` | A08, A08 | नागौरी जड़ (Nagauri Root (Jad)), चूर्ण (Powder (Churna)) |
| गिलोय (Giloy (Dried Stem & Powder)) | `giloy` | A09, A09 | सूखी डंडी (Dried Stem (Sukhi Dandi)), चूर्ण (Powder (Churna)) |
| मुलेठी (Mulethi (Stick & Powder)) | `mulethi` | A10, A10 | लकड़ी (Root Stick (Lakdi)), पाउडर (Powder) |
| इंद्रजौ (Indrajau (Sweet & Bitter)) | `indrajau` | A20, A20 | मीठा (Sweet (Meetha)), कड़वा (Bitter (Kadwa)) |
| हींग (Hing (Asafoetida — Lump & Powder)) | `hing` | B05, B05 | डली (Lump / Resin (Dali)), पाउडर (Powder) |

## Deduplication Record

- **जटामांसी (Jatamansi)** — Canonical ID `kab-canonical-jatamansi`, Slug `jatamansi`: Appears in both **Group A16** (Page 1, Section A — प्रमुख एवं विशेष जड़ी-बूटियां) and **Group C07** (Page 2, Section C — पूजा एवं हवन सामग्री). Stored as a single canonical product record preserving both PDF source references (`A16`, `C07`) and associated with `ayurvedic-herbs`, `herbal-roots-barks`, `natural-hair-care`, and `pooja-havan-materials`.

## Ambiguous Botanical Names Flagged for Expert Verification (17 Items)

- **आंबा हल्दी (Amba Haldi (Amiya Haldi))** [`A06`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **चोट सज्जी / सज्जी खार (Chot Sajji / Sajji Khar)** [`A07`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **बड़ा गोखरू (Bada Gokhru (Large Gokhru))** [`A14`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **चिरायता (Chirayata)** [`A15`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **ब्राह्मी (Brahmi)** [`A16`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **शंखपुष्पी (Shankhpushpi)** [`A16`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **रासना (Rasna)** [`A18`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **सुरंजन (Suranjan)** [`A18`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **इंद्रजौ (Indrajau (Sweet & Bitter))** [`A20, A20`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **शाह जीरा (Shah Jeera (Royal Cumin / Caraway))** [`B02`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **दालचीनी (Dalchini (Cinnamon Bark))** [`B03`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **विदारीकंद (Vidarikand)** [`C02`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **अकरकरा (Akarkara)** [`C02`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **रतनजोत (Ratanjot)** [`C04`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **सुगंधबाला (Sugandhbala)** [`C05`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **लोबान (Loban (Benzoin / Frankincense Resin))** [`C07`] — `botanicalStatus: ambiguous`, `botanicalName: null`
- **राल (Raal (Sal Tree Resin / Dammar))** [`C07`] — `botanicalStatus: ambiguous`, `botanicalName: null`

## Heightened Safety & Caution Classification (34 Items)

- **टेसू के फूल (Tesu Flowers (Palash Pushp))** [`A05`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **चोट सज्जी / सज्जी खार (Chot Sajji / Sajji Khar)** [`A07`] — Tier: `mineral_chemical` | Note: Traditional Pansari Mineral / Chemical — Requires Safety & Intended-Use Verification
- **गिलोय (Giloy (Dried Stem & Powder))** [`A09, A09`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **मुलेठी (Mulethi (Stick & Powder))** [`A10, A10`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **सनाय पत्ती (Sanay Leaves (Senna Patti))** [`A13`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **चिरायता (Chirayata)** [`A15`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **कुटकी (Kutki)** [`A15`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **कालमेघ (Kalmegh)** [`A15`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **गुड़मार (Gudmar)** [`A17`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **सुरंजन (Suranjan)** [`A18`] — Tier: `caution_herb` | Note: High-Caution Traditional Botanical — Variety (Meetha/Kadwa) & Professional Guidance Required
- **बाकुची (Bakuchi)** [`A19`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **इंद्रजौ (Indrajau (Sweet & Bitter))** [`A20, A20`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **कौंच बीज (Kaunch Beej (Velvet Bean Seeds))** [`C02`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **अकरकरा (Akarkara)** [`C02`] — Tier: `caution_herb` | Note: Traditional Raw Herb — Professional Guidance Recommended
- **रीठा (Reetha (Soapnut))** [`C04`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **शिकाकाई (Shikakai)** [`C04`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **मेहंदी पत्ती (Mehndi Patti (Henna Leaves))** [`C04`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **रतनजोत (Ratanjot)** [`C04`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **मुल्तानी मिट्टी (Multani Mitti (Fuller’s Earth))** [`C05`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **लाल चंदन (Lal Chandan (Red Sandalwood))** [`C05`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **सफेद चंदन (Safed Chandan (White Sandalwood))** [`C05`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **सुहागा (Suhaga (Borax — Traditional Pansari Mineral))** [`C06`] — Tier: `mineral_chemical` | Note: Traditional Pansari Mineral / Chemical — Requires Safety & Intended-Use Verification
- **सफेद फिटकरी (Safed Fitkari (White Alum))** [`C06`] — Tier: `mineral_chemical` | Note: Traditional Pansari Mineral / Chemical — Requires Safety & Intended-Use Verification
- **लाल फिटकरी (Lal Fitkari (Red Alum))** [`C06`] — Tier: `mineral_chemical` | Note: Traditional Pansari Mineral / Chemical — Requires Safety & Intended-Use Verification
- **नौसादर (Nausadar (Sal Ammoniac — Traditional Mineral))** [`C06`] — Tier: `mineral_chemical` | Note: Traditional Pansari Mineral / Chemical — Requires Safety & Intended-Use Verification
- **यवक्षार (Yavakshar (Traditional Barley Alkali))** [`C06`] — Tier: `mineral_chemical` | Note: Traditional Pansari Mineral / Chemical — Requires Safety & Intended-Use Verification
- **गेरू (Geru (Red Ochre))** [`C06`] — Tier: `mineral_chemical` | Note: Traditional Pansari Mineral / Chemical — Requires Safety & Intended-Use Verification
- **हवन सामग्री (Havan Samagri)** [`C07`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **भीमसेनी कपूर (Bhimseni Kapur (Camphor))** [`C07`] — Tier: `mineral_chemical` | Note: Traditional Pansari Mineral / Chemical — Requires Safety & Intended-Use Verification
- **लोबान (Loban (Benzoin / Frankincense Resin))** [`C07`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **भैंसा गूगल (Bhainsa Guggul (Guggul Resin))** [`C07`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **राल (Raal (Sal Tree Resin / Dammar))** [`C07`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **रुद्राक्ष (Rudraksh (Rudraksha Beads))** [`C08`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material
- **जनेऊ (Janeu (Sacred Thread))** [`C08`] — Tier: `non_consumable` | Note: External / Ritual / Non-Consumable Traditional Material

## Complete Group-by-Group Reconciliation Matrix (All 35 Groups)

| Group ID | PDF Section | Page | PDF Items | Matched Canonical Records | Status | Mapped Products & Variants |
| --- | --- | --- | --- | --- | --- | --- |
| A01 | Section A | Page 1 | 1 | 1 | Verified | छोटी हरड़ (Chhoti Harad (Jangi Harad)) |
| A02 | Section A | Page 1 | 1 | 1 | Verified | बड़ी हरड़ (Badi Harad (Peeli Harad)) |
| A03 | Section A | Page 1 | 1 | 1 | Verified | सूखा आंवला (Dried Amla (Whole & Pieces)) [साबुत / कली] *(canonical shared across A03 + A03)* |
| A04 | Section A | Page 1 | 1 | 1 | Verified | बहेड़ा (Baheda (Whole & Peel)) [साबुत / छिलका] *(canonical shared across A04 + A04)* |
| A05 | Section A | Page 1 | 1 | 1 | Verified | टेसू के फूल (Tesu Flowers (Palash Pushp)) |
| A06 | Section A | Page 1 | 1 | 1 | Verified | आंबा हल्दी (Amba Haldi (Amiya Haldi)) |
| A07 | Section A | Page 1 | 1 | 1 | Verified | चोट सज्जी / सज्जी खार (Chot Sajji / Sajji Khar) |
| A08 | Section A | Page 1 | 1 | 1 | Verified | अश्वगंधा (Ashwagandha (Nagauri Root & Powder)) [नागौरी जड़ / चूर्ण] *(canonical shared across A08 + A08)* |
| A09 | Section A | Page 1 | 1 | 1 | Verified | गिलोय (Giloy (Dried Stem & Powder)) [सूखी डंडी / चूर्ण] *(canonical shared across A09 + A09)* |
| A10 | Section A | Page 1 | 1 | 1 | Verified | मुलेठी (Mulethi (Stick & Powder)) [लकड़ी / पाउडर] *(canonical shared across A10 + A10)* |
| A11 | Section A | Page 1 | 2 | 2 | Verified | पीली शतावरी (Peeli Shatavari (Yellow Shatavari)); सफेद शतावरी (Safed Shatavari (White Shatavari)) |
| A12 | Section A | Page 1 | 1 | 1 | Verified | अर्जुन की छाल (Arjun Bark (Arjun Ki Chaal)) |
| A13 | Section A | Page 1 | 2 | 2 | Verified | इसबगोल भूसी (Isabgol Husk (Isabgol Bhusi)); सनाय पत्ती (Sanay Leaves (Senna Patti)) |
| A14 | Section A | Page 1 | 2 | 2 | Verified | बड़ा गोखरू (Bada Gokhru (Large Gokhru)); छोटा गोखरू (Chhota Gokhru (Small Gokhru)) |
| A15 | Section A | Page 1 | 3 | 3 | Verified | चिरायता (Chirayata); कुटकी (Kutki); कालमेघ (Kalmegh) |
| A16 | Section A | Page 1 | 3 | 3 | Verified | ब्राह्मी (Brahmi); शंखपुष्पी (Shankhpushpi); जटामांसी (Jatamansi) *(canonical shared across A16 + C07)* |
| A17 | Section A | Page 1 | 3 | 3 | Verified | गुड़मार (Gudmar); जामुन गुठली (Jamun Seed (Jamun Guthli)); विजयसार (Vijaysar (Vijayasar Wood)) |
| A18 | Section A | Page 1 | 3 | 3 | Verified | निर्गुंडी (Nirgundi); रासना (Rasna); सुरंजन (Suranjan) |
| A19 | Section A | Page 1 | 3 | 3 | Verified | मंजिष्ठा (Manjistha); अनंतमूल (Anantmool); बाकुची (Bakuchi) |
| A20 | Section A | Page 1 | 3 | 3 | Verified | काकड़ासिंगी (Kakdasingi); भारंगी (Bharangi); इंद्रजौ (Indrajau (Sweet & Bitter)) [मीठा / कड़वा] *(canonical shared across A20 + A20)* |
| B01 | Section B | Page 2 | 4 | 4 | Verified | अजवाइन (Ajwain (Carom Seeds)); सौंफ (Saunf (Fennel Seeds)); मेथी (Methi (Fenugreek Seeds)); कलौंजी (Kalonji (Nigella Seeds)) |
| B02 | Section B | Page 2 | 4 | 4 | Verified | जीरा (Jeera (Cumin Seeds)); शाह जीरा (Shah Jeera (Royal Cumin / Caraway)); काली मिर्च (Kali Mirch (Black Pepper)); लौंग (Laung (Cloves)) |
| B03 | Section B | Page 2 | 4 | 4 | Verified | छोटी इलायची (Chhoti Elaichi (Green Cardamom)); बड़ी इलायची (Badi Elaichi (Black Cardamom)); दालचीनी (Dalchini (Cinnamon Bark)); तेजपत्ता (Tejpatta (Indian Bay Leaf)) |
| B04 | Section B | Page 2 | 5 | 5 | Verified | सोंठ (Sonth (Dry Ginger)); साबुत हल्दी (Sabut Haldi (Whole Turmeric)); जायफल (Jaiphal (Nutmeg)); जावित्री (Javitri (Mace)); पीपली (Peepli (Long Pepper)) |
| B05 | Section B | Page 2 | 3 | 3 | Verified | चकरी फूल (Chakri Phool (Star Anise)); हींग (Hing (Asafoetida — Lump & Powder)) [डली / पाउडर] *(canonical shared across B05 + B05)*; अनारदाना (Anardana (Dried Pomegranate Seeds)) |
| B06 | Section B | Page 2 | 6 | 6 | Verified | अलसी (Alsi (Flax Seeds)); चिया (Chia Seeds); कद्दू के बीज (Pumpkin Seeds (Kaddu Ke Beej)); खरबूज मगज (Muskmelon Seeds (Kharbuj Magaj)); तरबूज मगज (Watermelon Seeds (Tarbuj Magaj)); खसखस (Khaskhas (Poppy Seeds)) |
| B07 | Section B | Page 2 | 4 | 4 | Verified | धागे वाली मिश्री (Dhage Wali Mishri (Thread Rock Sugar)); सेंधा नमक (Sendha Namak (Rock Salt)); काला नमक (Kala Namak (Black Salt)); समुद्री नमक (Samudri Namak (Sea Salt)) |
| C01 | Section C | Page 2 | 5 | 5 | Verified | बबूल गोंद (Babool Gond (Acacia Gum)); गोंद कतीरा (Gond Katira (Tragacanth Gum)); कमरकस (Kamarkas (Palash Gum)); लोध्र (Lodhra Bark); अशोक छाल (Ashok Chaal (Ashoka Bark)) |
| C02 | Section C | Page 2 | 6 | 6 | Verified | सफेद मूसली (Safed Musli); काली मूसली (Kali Musli); कौंच बीज (Kaunch Beej (Velvet Bean Seeds)); विदारीकंद (Vidarikand); अकरकरा (Akarkara); तालमखाना (Talmakhana) |
| C03 | Section C | Page 2 | 5 | 5 | Verified | मखाना (Makhana (Fox Nuts)); छुहारा (Chhuhara (Dry Dates)); अंजीर (Anjeer (Dried Figs)); बीज वाला मुनक्का (Seeded Munakka (Large Raisins)); केसर (Kesar (Saffron)) |
| C04 | Section C | Page 2 | 6 | 6 | Verified | रीठा (Reetha (Soapnut)); शिकाकाई (Shikakai); भृंगराज (Bhringraj); मेहंदी पत्ती (Mehndi Patti (Henna Leaves)); रतनजोत (Ratanjot); नागरमोथा (Nagarmotha) |
| C05 | Section C | Page 2 | 6 | 6 | Verified | मुल्तानी मिट्टी (Multani Mitti (Fuller’s Earth)); लाल चंदन (Lal Chandan (Red Sandalwood)); सफेद चंदन (Safed Chandan (White Sandalwood)); गुलाब पत्ती (Gulab Patti (Dried Rose Petals)); खस (Khas (Vetiver Root)); सुगंधबाला (Sugandhbala) |
| C06 | Section C | Page 2 | 6 | 6 | Verified | सुहागा (Suhaga (Borax — Traditional Pansari Mineral)); सफेद फिटकरी (Safed Fitkari (White Alum)); लाल फिटकरी (Lal Fitkari (Red Alum)); नौसादर (Nausadar (Sal Ammoniac — Traditional Mineral)); यवक्षार (Yavakshar (Traditional Barley Alkali)); गेरू (Geru (Red Ochre)) |
| C07 | Section C | Page 2 | 6 | 6 | Verified | जटामांसी (Jatamansi) *(canonical shared across A16 + C07)*; हवन सामग्री (Havan Samagri); भीमसेनी कपूर (Bhimseni Kapur (Camphor)); लोबान (Loban (Benzoin / Frankincense Resin)); भैंसा गूगल (Bhainsa Guggul (Guggul Resin)); राल (Raal (Sal Tree Resin / Dammar)) |
| C08 | Section C | Page 2 | 7 | 7 | Verified | काला तिल (Kala Til (Black Sesame Seeds)); सफेद तिल (Safed Til (White Sesame Seeds)); जौ (Jau (Whole Barley)); पीली सरसों (Peeli Sarson (Yellow Mustard Seeds)); कमल गट्टा (Kamal Gatta (Lotus Seeds)); रुद्राक्ष (Rudraksh (Rudraksha Beads)); जनेऊ (Janeu (Sacred Thread)) |
