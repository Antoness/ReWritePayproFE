# 🚀 PAYPRO V.6 (FRESH REVAMP) - AI CODING GUIDELINES & ARCHITECTURE

## 🤖 1. AI SYSTEM INSTRUCTIONS (CORE RULES)
Kamu adalah AI asisten developer utama untuk project **Paypro V.6**. Saat menerima perintah (*prompt*) untuk membuat atau memodifikasi modul, kamu **WAJIB MUTLAK** mematuhi aturan berikut:

1. **JANGAN TRANSLATE KODE LAMA 1:1:** Jika user memberikan kode *legacy* (seperti Stored Procedure yang panjang, struktur tabel dengan puluhan kolom `tunjangan_x`, atau tabel `_buffer` / `_sales` / `_service`), **TIDAK BOLEH** disalin persis. Refactor menggunakan pendekatan dinamis (JSONB) dan asinkron (RabbitMQ).
2. **MODULAR MONOLITH ARCHITECTURE:** Sistem ini BUKAN Microservices. Semua berjalan dalam **SATU** aplikasi Spring Boot dan **SATU** database PostgreSQL. Namun, kode wajib dipisah secara *Domain-Driven* menggunakan *package* yang ketat (contoh: `com.dika.paypro.corehr`, `com.dika.paypro.payroll`, `com.dika.paypro.tax`). Domain tidak boleh saling *query* database secara langsung (Gunakan pemanggilan `@Service` internal).
3. **PERTAHANKAN KODE EKSISTING:** Modul `Login`, `User Management`, `Master UMK`, `Master TER`, `Master PTKP`, `Master PKP`, dan `Master Employee` sudah dibangun. Gunakan *entity* dan *service* tersebut, cukup sesuaikan alurnya dengan arsitektur event-driven jika diperlukan.
4. **FRONTEND (REACT JS) REUSABLE COMPONENT:** Wajib menggunakan *Reusable Components* yang sudah ada di *project*. Dilarang keras membuat komponen UI dasar dari awal kecuali diminta secara spesifik.
5. **HAPUS TABEL BUFFER / TEMP / TAMPUNGAN:** Dilarang membuat proses yang melakukan `INSERT` ke tabel sementara di PostgreSQL. Semua data *upload* massal (Excel) atau tarikan API eksternal **WAJIB** dilempar sebagai payload ke **RabbitMQ**, diproses oleh `@RabbitListener` (Worker) di latar belakang, lalu disimpan langsung ke tabel utama (menghindari database *lagging/deadlock*).

---

## 🏗️ 2. ARCHITECTURE & TECH STACK
* **Frontend:** React JS
* **Backend:** Java Spring Boot (Modular Monolith)
* **Database:** PostgreSQL (Driver: `org.postgresql.Driver`, Dialect: `PostgreSQLDialect`)
* **Message Broker:** RabbitMQ (Penanganan asinkron & Batch Processing)

### 📌 STANDARISASI BUSINESS LOGIC
* **Jabatan (Position):** Saat `SAVE/UPDATE` karyawan, kolom `position` wajib dimanipulasi menjadi format **UPPERCASE** di layer Spring Boot.
* **Username Generation:** Pembuatan `username` diambil otomatis dari kata pertama (First Name) pada atribut `fullname`.
* **Dynamic Components (JSONB):** Dilarang membuat kolom statis untuk tunjangan/potongan di tabel Payroll. Gunakan satu kolom `dynamic_components` bertipe **JSONB** di PostgreSQL untuk memfasilitasi puluhan project (*Client*) yang dinamis.

---

## 💾 3. DATABASE SCHEMAS (CONSOLIDATED POSTGRESQL)

Struktur tabel membuang puluhan tabel *legacy* dan disatukan menjadi entitas yang solid:

### A. Module: Core HR (`schema: public`)
* **`employees` (Single Source of Truth):** Penggabungan regular, sales, dan service.
  * `nik` (VARCHAR PK)
  * `id_number` (VARCHAR)
  * `full_name` (VARCHAR)
  * `employee_type` (VARCHAR) -> PKWT, PKWTT, MITRA
  * `employee_category` (VARCHAR) -> REGULER, SALES, SERVICE
  * `position` (VARCHAR UPPERCASE)
  * `division`, `unit_name`, `branch_code` (VARCHAR)
  * `is_active` (BOOLEAN)
* **`clients`:**
  * `client_id` (VARCHAR PK), `division`, `unit_name`, `tax_method` (GROSS/NETT)

### B. Module: Payroll Engine (`schema: public`)
* **`payroll_transactions`:** Penggabungan tabel transaksi *legacy*.
  * `payroll_id` (VARCHAR PK) -> Format: PRL-YYYYMM-NIK
  * `nik` (VARCHAR)
  * `payroll_type` (VARCHAR) -> REGULER, SALES, SERVICE, KERTAS_KERJA
  * `periode_bulan` (VARCHAR), `periode_tahun` (VARCHAR)
  * `basic_salary` (NUMERIC)
  * **`dynamic_components` (JSONB) -> Struktur: `[{"code": "...", "name": "...", "amount": 0, "type": "EARNING/DEDUCTION", "is_taxable": true/false}]`**
  * `gross_salary` (NUMERIC), `net_salary` (NUMERIC)
  * `status_data` (VARCHAR) -> NEW, REQUEST_APPROVAL, APPROVED, RETURNED, PROCESSED, PAID

### C. Module: Tax & Compliance (`schema: public`)
* **`tax_calculations`:** Hasil perhitungan PPh21 dari Cortex/Tax Logic.
  * `tax_id` (VARCHAR PK), `payroll_id` (VARCHAR), `nik` (VARCHAR)
  * `ptkp_status` (VARCHAR), `dpp` (NUMERIC), `ter_category` (VARCHAR), `pph21_amount` (NUMERIC)

### D. Audit Trail
* **`audit_logs`:** Pengganti puluhan tabel `history_x`.
  * `log_id` (BIGSERIAL PK), `entity_name` (VARCHAR), `entity_id` (VARCHAR)
  * `action_type` (VARCHAR), `old_values` (JSONB), `new_values` (JSONB)
  * `created_by` (VARCHAR), `created_at` (TIMESTAMP)

---

## ⚙️ 4. INTERNAL FLOW & RABBITMQ CONTRACTS

Karena ini adalah Modular Monolith, komunikasi antar-domain terjadi di dalam internal Spring Boot, namun untuk proses berat wajib melalui RabbitMQ.

### FLOW 1: Sinkronisasi Karyawan (Get Data HRIS)
1. **React JS:** Memanggil API trigger `POST /api/v1/hris/sync`.
2. **Spring Boot (API):** Mengambil data dari HRIS Eksternal, lalu mempublikasikan array data karyawan ke RabbitMQ Queue: `q.hr.employee.sync`. Merespon React dengan `202 Accepted`.
3. **Worker (Listener):** Menerima pesan, melakukan normalisasi (Uppercase Position, Username), lalu melakukan *Batch Insert/Update* ke tabel `employees`. 

### FLOW 2: Kalkulasi Gaji (Request Payroll) & Pajak
1. **React JS:** SPV menekan tombol proses, memanggil API `POST /api/v1/payroll/calculate`.
2. **Spring Boot (Payroll Module):** Melempar instruksi hitung ke RabbitMQ Queue: `q.payroll.calculate`. Merespon `202 Accepted`.
3. **Worker Payroll:** - Mengambil data dari `employees`.
   - Mengagregasi komponen gaji dinamis (Gapok + Tunjangan Tetap/Tidak Tetap) berdasarkan setup *Client*.
   - Menyusun JSONB array dan memisahkan nilai `is_taxable`.
   - *Internal Service Call:* Memanggil `@Service` milik Tax Module `taxService.calculatePph21(dpp, ptkp_status)`.
   - *Tax Module* menghitung berdasarkan data tabel TER/PTKP dan mengembalikan nominal PPh21.
   - *Worker Payroll* menginjeksi komponen PPh21 ke dalam `dynamic_components` JSONB, menghitung `net_salary` (THP), dan menyimpan ke `payroll_transactions`.

### FLOW 3: Render Slip Gaji / View Payroll (Frontend)
1. **React JS:** GET `/api/v1/payroll/transactions/{payroll_id}`
2. **Spring Boot:** Mengembalikan JSON yang berisi langsung struktur `dynamic_components`.
3. **React JS:** Melakukan *mapping* array `dynamic_components` di UI tanpa perlu parsing kolom yang kaku.

---
**END OF RULES**