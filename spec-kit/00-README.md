# 📦 PAYPRO V.6 (FRONTEND) - MASTER SPEC-KIT

Dokumen ini adalah panduan spesifikasi arsitektur antarmuka, reusable components, dan integrasi API untuk **Frontend PayPro V.6 (React, Vite & Material-UI)**.

---

## 📂 Struktur Dokumen Spec-Kit Frontend

| File | Deskripsi & Cakupan |
|---|---|
| [01-ARCHITECTURE-RULES.md](file:///Users/pt-dika/Documents/Documents%20-%20MacBook%20Air%20PT-DIKA%20(2)%20-%201/PAYROLL/PAYPRO%20NEW/frontend/spec-kit/01-ARCHITECTURE-RULES.md) | Blueprint arsitektur frontend, aturan reusable components, pencegahan auto-logout, dan struktur state management. |
| [02-UI-UX-STANDARDS.md](file:///Users/pt-dika/Documents/Documents%20-%20MacBook%20Air%20PT-DIKA%20(2)%20-%201/PAYROLL/PAYPRO%20NEW/frontend/spec-kit/02-UI-UX-STANDARDS.md) | Standar resmi **Collapsible Minimal Linear DataTable**, Material-UI theme tokens, dialogs, dan dark mode compliance. |
| [03-API-CONSUMPTION.md](file:///Users/pt-dika/Documents/Documents%20-%20MacBook%20Air%20PT-DIKA%20(2)%20-%201/PAYROLL/PAYPRO%20NEW/frontend/spec-kit/03-API-CONSUMPTION.md) | Standar Axios instance, penanganan JWT token, pagination query, dan resilient network error handling. |
| [04-BUSINESS-LOGIC-FORMULAS.md](file:///Users/pt-dika/Documents/Documents%20-%20MacBook%20Air%20PT-DIKA%20(2)%20-%201/PAYROLL/PAYPRO%20NEW/frontend/spec-kit/04-BUSINESS-LOGIC-FORMULAS.md) | Rumus kalkulasi instan untuk client-side preview, validasi input nominal, dan format slip gaji/kompensasi. |

---

## 💡 Panduan untuk AI & Developer
Saat membuat halaman atau komponen baru di frontend:
1. Wajib menggunakan komponen resmi di `src/components/Common/` (`DataTable`, `CustomModal`, `CustomSnackbar`, `CustomConfirmDialog`, `SearchableSelect`).
2. Setiap tabel data yang memiliki banyak kolom wajib menggunakan pola **Collapsible Minimal Linear**.
3. Pastikan `npm run build` sukses 0 error sebelum menyelesaikan tugas.
