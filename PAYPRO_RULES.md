# 🚀 PAYPRO V.6 (FRONTEND) - MASTER ARCHITECTURE & CODING RULES

Dokumen ini adalah **panduan baku & blueprint arsitektur terlengkap** untuk frontend developer dan AI dalam membangun, merawat, dan mengembangkan UI/UX di PayPro agar siap komersial (**B2B SaaS Ready**).

---

## 💎 1. ATURAN UTAMA: REUSABLE COMPONENTS & KONSISTENSI UI/UX MUTLAK

> [!IMPORTANT]
> **DILARANG MENYALIN DESAIN DARI FOTO SISTEM LAMA (LEGACY UI):**
> * Foto atau screenshot dari aplikasi lama **HANYA DIGUNAKAN UNTUK MEMAHAMI FLOW BISNIS DAN NAMA FIELD/KOLOM DATA**, **BUKAN** sebagai referensi desain visual, warna, atau layout.
> * Tampilan jadul/kuno dari sistem lama **DILARANG KERAS** dibawa ke PayPro V.6.

### Standar Keseragaman Total (UI Uniformity):
1. **Wajib Reusable Components:** Seluruh modul baru (Kertas Kerja Jasa, Kompensasi, PIC BPJS, Service, Sales, dll.) **WAJIB 100% MENGGUNAKAN KOMPONEN RESMI YANG SUDAH ADA**:
   * **Tabel Data:** Wajib menggunakan `<DataTable />` dari `src/components/Common/DataTable.jsx` (lengkap dengan search, pagination, sort, dan dark mode). Dilarang membuat styling tabel manual dari awal.
   * **Dropdown & Select (Searchable):** Wajib menggunakan `<SearchableSelect />` dari `src/components/Common/SearchableSelect.jsx` (lengkap dengan fitur search saat mengetik, support opsi string maupun object `{ label, value }`, auto-clear, dark/light theme, dan responsive). **Dilarang memakai MUI `<Select>` standar tanpa fitur pencarian untuk data filter/dropdown yang dinamis atau berjumlah banyak.**
   * **Modal & Dialog:** Wajib menggunakan `<CustomModal />` dari `src/components/Common/CustomModal.jsx` dan `<CustomConfirmDialog />`.
   * **Notifikasi / Feedback:** Wajib menggunakan `<CustomSnackbar />` dari `src/components/Common/CustomSnackbar.jsx` untuk alert sukses, warning, dan error.
2. **Keseragaman Gaya & Visual (No Ad-Hoc Styles):**
   * **Button Style:** Menggunakan standar Material-UI Button dengan `borderRadius: 2` (atau `10px`), `fontWeight: 700`, padding standar, dan Icon resmi dari `@mui/icons-material`.
   * **Color Palette:** Wajib menggunakan palet tema terpusat (Primary `#3b82f6`, Secondary `#6366f1`, Success `#10b981`, Warning `#f59e0b`, Error `#ef4444`). **Dilarang memakai warna aneh atau tidak seragam.**
   * **Dark & Light Mode:** Seluruh halaman, modal, card, dan tabel wajib mendukung mode gelap (Dark Mode) dan terang (Light Mode) secara otomatis melalui `ThemeContext.jsx` tanpa teks yang tidak terbaca atau background pecah.
   * **Status Badges:** Menggunakan `<Chip size="small" />` dengan aturan warna semantik:
     * `DRAFT` / `NEW` $\rightarrow$ Default/Abu-abu
     * `REQUEST_APPROVAL` / `PENDING` $\rightarrow$ Warning/Kuning-Oranye
     * `APPROVED` / `PROCESSED` / `PAID` $\rightarrow$ Success/Hijau
     * `REJECTED` $\rightarrow$ Error/Merah (dilengkapi Hover Tooltip catatan penolakan)

---

## 🔒 2. STANDAR REGISTRASI MENU & ROUTING (3-STEP REGISTRATION)
Setiap menu baru **WAJIB** melalui 3 langkah registrasi:
1. **Daftarkan di `MENU_STRUCTURE` ([RoleManagement.jsx](file:///Users/pt-dika/Documents/Documents%20-%20MacBook%20Air%20PT-DIKA%20%282%29%20-%201/PAYROLL/PAYPRO%20NEW/frontend/src/pages/UserManagement/RoleManagement.jsx)):**
   * Gunakan key unik berformat UPPERCASE (contoh: `MENU_MASTER_UMK`, `KOMPENSASI_RETRIEVE`).
2. **Daftarkan di Sidebar ([Layout.jsx](file:///Users/pt-dika/Documents/Documents%20-%20MacBook%20Air%20PT-DIKA%20%282%29%20-%201/PAYROLL/PAYPRO%20NEW/frontend/src/components/Layout.jsx)):**
   * Gunakan key yang sama persis untuk mapping dinamis dan icon sidebar.
3. **Daftarkan di Routing ([App.jsx](file:///Users/pt-dika/Documents/Documents%20-%20MacBook%20Air%20PT-DIKA%20%282%29%20-%201/PAYROLL/PAYPRO%20NEW/frontend/src/App.jsx)):**
   * Bungkus komponen rute dengan `<ProtectedRoute permission="KEY">`.

---

## 🛡️ 3. ROUTE GUARDING & PERMISSION CHECKING
1. **Proteksi URL Bar:**
   * `ProtectedRoute` di `App.jsx` memvalidasi `permissions` user dari Redux/API.
   * Jika user mengetik URL yang tidak diizinkan di address bar browser, sistem otomatis menampilkan layar **403 — Akses Dibatasi** ([Forbidden.jsx](file:///Users/pt-dika/Documents/Documents%20-%20MacBook%20Air%20PT-DIKA%20%282%29%20-%201/PAYROLL/PAYPRO%20NEW/frontend/src/pages/Forbidden.jsx)).
2. **Smooth Transition (Anti-Flicker):**
   * `ProtectedRoute` menggunakan state `isPermissionsLoaded` agar tidak menampilkan pesan 403 sesaat (*flicker*) saat data permissions sedang dimuat dari server.
3. **Button Authorization:**
   * Sembunyikan atau non-aktifkan tombol aksi jika user tidak memiliki permission terkait (`userPermissions.includes('ACTION_KEY')`).

---

## 👥 4. UPLINER APPROVAL & WORKFLOW UI
1. **Automatic Backend Filtering:**
   * Tampilan tabel menyesuaikan otomatis dengan role user dari token login tanpa perlu tombol filter inbox manual.
2. **Reject Modal & Reason:**
   * Tombol **Reject** wajib memunculkan dialog form alasan penolakan (*Reject Reason*) agar tercatat ke history data.
3. **Status Badges & Tooltips:**
   * Data yang ditolak menampilkan chip merah dengan *Hover Tooltip* berisi alasan penolakan.

---

## 🌐 5. API SERVICE & REDUX PERSISTENCE
1. **Centralized Axios (`src/services/api.js`):**
   * Menyisipkan token JWT otomatis di setiap request header.
   * Interceptor response tidak boleh melakukan logout otomatis pada error data biasa untuk mencegah user terlempar ke halaman login secara tidak sengaja.
2. **Redux Store (`src/store/slices/authSlice.js`):**
   * Menyimpan session user, `companyId`, `position`, `privilege`, dan `permissions`.
   * Sinkronisasi data permission ke `localStorage` untuk akses instan.

---

## 📋 6. END-TO-END DEVELOPER CHECKLIST (FRONTEND)
Saat menambahkan halaman/fitur baru (misal: Kertas Kerja Jasa):
- [ ] 1. Buat halaman di `src/pages/<Module>/<PageName>.jsx` menggunakan **DataTable** & **Design System PayPro V.6**.
- [ ] 2. Pastikan tampilan 100% seragam (warna, border, icon, button style) dan mendukung **Dark Mode & Light Mode**.
- [ ] 3. Daftarkan permission key di `MENU_STRUCTURE` (`RoleManagement.jsx`).
- [ ] 4. Daftarkan menu & icon di `Layout.jsx` sidebar.
- [ ] 5. Daftarkan route di `App.jsx` dengan `<ProtectedRoute permission="...">`.
- [ ] 6. Hubungkan ke `src/services/api.js` dengan feedback notifikasi (`CustomSnackbar`).