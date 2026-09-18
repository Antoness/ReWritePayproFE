# 🧮 04 - BUSINESS LOGIC FORMULAS (FRONTEND)

Dokumen ini berisi rumus acuan kalkulasi cepat untuk validasi input form, preview nominal, dan kalkulasi slip di sisi klien (Frontend).

---

## 1. Format Currency & Angka Indonesia
- Format Rupiah: `Rp ${nominal.toLocaleString('id-ID')}`
- Input nominal gaji/tunjangan wajib diformat dengan separator ribuan titik (`.`).

---

## 2. Preview Kalkulasi Uang Kompensasi PKWT
- **Formula:**
```javascript
const hitungPreviewKompensasi = (gajiPokok, durasiBulan) => {
  if (!gajiPokok || !durasiBulan) return 0;
  return Math.round((durasiBulan / 12) * gajiPokok);
};
```

---

## 3. Preview Kalkulasi PPh 21 TER
- Menentukan tarif persentase TER berdasarkan Kategori PTKP (A, B, C) dan layer nominal penghasilan bruto sebulan.
- **Formula:**
```javascript
const hitungPreviewPph21 = (brutoSebulan, tarifTerPersen) => {
  return Math.round(brutoSebulan * (tarifTerPersen / 100));
};
```
