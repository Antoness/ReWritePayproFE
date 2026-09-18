# 🎨 02 - UI/UX DESIGN SYSTEM & STANDARDS

Dokumen ini mendefinisikan standar resmi **Collapsible Minimal Linear DataTable** dan komponen antarmuka PayPro V.6.

---

## 1. STANDAR COLLAPSIBLE MINIMAL LINEAR (MAXIMIZED)
Untuk mencegah horizontal scrollbar saat sidebar terbuka pada resolusi laptop (1280px / 1366px):

### A. Baris Utama (7-9 Kolom Inti):
- `select` (checkbox 40px)
- `nik` (Chip monospace 95px)
- `name` (Typography bold dengan tooltip & text-ellipsis)
- `employeeType` (Chip 75px)
- `division` (Typography dengan tooltip & text-ellipsis)
- `unitName` (Typography dengan tooltip & text-ellipsis)
- `position` (Typography dengan tooltip & text-ellipsis)
- `branch` (85px)
- `status` / `statusSlip` (Chip status)

### B. Top Header Profile Strip:
Saat baris dibuka, tampilkan bar horizontal rapi:
- Avatar dengan inisial nama (`Avatar` MUI).
- Nama Karyawan (bold), Chip NIK monospace, Chip Tipe kepegawaian, Subtitle Posisi + Cabang.
- Tombol Aksi Cepat di sisi kanan (misalnya *Cetak Slip*, *Edit*, *Hapus*).

### C. 3 Kolom Linier Responsif (`xs=12, sm=6, lg=4`):
- **Kolom 1:** Info Kepegawaian & Penempatan / Kontrak.
- **Kolom 2:** Parameter Pajak / Status / Detail Komponen.
- **Kolom 3:** Highlight Banner Utama (misal: Take Home Pay, Total Kompensasi, Potongan PPh 21) dengan aksen background lembut dan border halus.

---

## 2. STANDAR MODAL, DIALOG & TOAST
- **Modal Input:** Menggunakan `<CustomModal />` dengan `maxWidth="sm"` atau `"md"`.
- **Dialog Konfirmasi:** Menggunakan `<CustomConfirmDialog />` sebelum melakukan delete, approve, atau reject data.
- **Feedback Toast:** Menggunakan `<CustomSnackbar />` untuk feedback sukses/gagal.
