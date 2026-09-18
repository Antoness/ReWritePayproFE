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
   * **Collapsible Row:** Semua tabel yang memiliki banyak kolom wajib mengimplementasikan prop `renderCollapsibleRow` dengan format **Minimal Linear**.
   * **Modal / Dialog:** Wajib menggunakan `<CustomModal />` dari `src/components/Common/CustomModal.jsx`.
   * **Dialog Konfirmasi:** Wajib menggunakan `<CustomConfirmDialog />` dari `src/components/Common/CustomConfirmDialog.jsx`.
   * **Notifikasi / Toast:** Wajib menggunakan `<CustomSnackbar />` dari `src/components/Common/CustomSnackbar.jsx`.
   * **Dropdown / Select:** Wajib menggunakan `<SearchableSelect />` dari `src/components/Common/SearchableSelect.jsx`.

---

## 🎨 2. THEME & COLOR COMPLIANCE
1. Gunakan semantic color tokens MUI (`primary.main`, `success.main`, `error.main`, `background.paper`, `text.secondary`, `divider`).
2. Hindari hardcoded color hex seperti `#ffffff` atau `#000000` pada background container.
3. Seluruh komponen harus mendukung Dark Mode dan Light Mode secara otomatis.

---

## 🛡️ 3. RESILIENT NETWORK & AUTH HANDLING
1. Error status non-401 (seperti 404, 500, unmapped mock endpoint) dilarang memicu `localStorage.clear()` atau auto-logout global.
2. Setiap request API menyertakan header `Authorization: Bearer <token>`.
