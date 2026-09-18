# 🔌 03 - API CONSUMPTION & CLIENT INTEGRATION

Dokumen ini mendefinisikan standar integrasi Axios, state management, dan format komunikasi frontend ke backend Spring Boot.

---

## 1. Client Instance & Auth Headers
- Seluruh HTTP request wajib menyertakan token dari Redux / LocalStorage:
```javascript
const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

## 2. Standard Pagination & Filtering
- Pagination dikirim dengan 0-indexed page (`page - 1`) dan `size`.
- Parameter pencarian menggunakan query params:
```javascript
const params = new URLSearchParams({
  page: String(page - 1),
  size: String(pageSize),
  search: searchQuery || '',
  division: filterDivision || '',
  branch: filterBranch || ''
});
```

---

## 3. Error Handling Policy
- Cegah force-logout jika response berstatus 404, 500, atau timeout.
- Hanya lakukan logout jika response eksplisit 401 Unauthorized dengan token expired.
- Tampilkan feedback user-friendly via `<CustomSnackbar />`.
