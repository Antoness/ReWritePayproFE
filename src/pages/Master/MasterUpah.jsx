import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Stack, IconButton, Tooltip, InputAdornment, Chip, Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  RestartAlt as ResetIcon,
  PriceCheck as PriceCheckIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Initial Seed / Mock Data based on exact business requirements from legacy system
const INITIAL_MASTER_UPAH_DATA = [
  { id: 1, lokasiUnitKerja: 'MENARA BCA / LANTAI 16', jaboStatus: 'JABO', upahMinimum: 5729876, tahun: '2026' },
  { id: 2, lokasiUnitKerja: 'BCA WISMA ASIA I / LANTAI 17', jaboStatus: 'JABO', upahMinimum: 5729876, tahun: '2026' },
  { id: 3, lokasiUnitKerja: 'BCA WISMA ASIA I / LANTAI 18', jaboStatus: 'JABO', upahMinimum: 5729876, tahun: '2026' },
  { id: 4, lokasiUnitKerja: 'BCA WISMA ASIA II / LANTAI 12', jaboStatus: 'JABO', upahMinimum: 5729876, tahun: '2026' },
  { id: 5, lokasiUnitKerja: 'BCA WISMA ASIA II / LANTAI 12A', jaboStatus: 'JABO', upahMinimum: 5729876, tahun: '2026' },
  { id: 6, lokasiUnitKerja: 'BCA WISMA ASIA II / LANTAI 12B', jaboStatus: 'JABO', upahMinimum: 5729876, tahun: '2026' },
  { id: 7, lokasiUnitKerja: 'BCA WISMA ASIA II / LANTAI 15', jaboStatus: 'JABO', upahMinimum: 5729876, tahun: '2026' },
  { id: 8, lokasiUnitKerja: 'BCA WISMA ASIA II / LANTAI 16', jaboStatus: 'JABO', upahMinimum: 5729876, tahun: '2026' },
  { id: 9, lokasiUnitKerja: 'BCA WISMA ASIA II / LANTAI 7', jaboStatus: 'JABO', upahMinimum: 5729876, tahun: '2026' },
  { id: 10, lokasiUnitKerja: 'BCA WISMA ASIA II / LANTAI 9', jaboStatus: 'JABO', upahMinimum: 5729876, tahun: '2026' },
  { id: 11, lokasiUnitKerja: 'BCA KCU SURABAYA / LANTAI 3', jaboStatus: 'NON JABO', upahMinimum: 4725000, tahun: '2026' },
  { id: 12, lokasiUnitKerja: 'BCA KCU BANDUNG / ASIA AFRIKA', jaboStatus: 'NON JABO', upahMinimum: 4200000, tahun: '2026' },
  { id: 13, lokasiUnitKerja: 'BCA KCU SEMARANG / PEMUDA', jaboStatus: 'NON JABO', upahMinimum: 3300000, tahun: '2026' },
  { id: 14, lokasiUnitKerja: 'MENARA BCA / LANTAI 16', jaboStatus: 'JABO', upahMinimum: 5350000, tahun: '2025' },
  { id: 15, lokasiUnitKerja: 'BCA WISMA ASIA I / LANTAI 17', jaboStatus: 'JABO', upahMinimum: 5350000, tahun: '2025' },
];

const JABO_OPTIONS = [
  { label: 'JABO', value: 'JABO' },
  { label: 'NON JABO', value: 'NON JABO' }
];

const YEAR_OPTIONS = [
  { label: '2027', value: '2027' },
  { label: '2026', value: '2026' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' }
];

const MasterUpah = () => {
  // Main Data States
  const [dataList, setDataList] = useState(INITIAL_MASTER_UPAH_DATA);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLokasi, setFilterLokasi] = useState('');
  const [filterJabo, setFilterJabo] = useState('');
  const [filterTahun, setFilterTahun] = useState('2026');

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: null,
    lokasiUnitKerja: '',
    jaboStatus: 'JABO',
    upahMinimum: '',
    tahun: '2026'
  });

  // Upload Form State
  const [uploadTahun, setUploadTahun] = useState('2026');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null
  });

  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // Fetch data from API
  const fetchMasterUpah = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/master/upah`, { headers: getAuthHeader() });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setDataList(res.data);
      }
    } catch (err) {
      console.warn('Using seed Master Upah data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterUpah();
  }, []);

  // Dynamic unique list of Lokasi for SearchableSelect filter
  const uniqueLokasiOptions = useMemo(() => {
    const list = Array.from(new Set(dataList.map((item) => item.lokasiUnitKerja).filter(Boolean))).sort();
    return list.map((loc) => ({ label: loc, value: loc }));
  }, [dataList]);

  // Filtered & Paginated Data
  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.lokasiUnitKerja && item.lokasiUnitKerja.toLowerCase().includes(q)) ||
        String(item.upahMinimum).includes(q) ||
        (item.jaboStatus && item.jaboStatus.toLowerCase().includes(q)) ||
        (item.tahun && String(item.tahun).includes(q));

      const matchLokasi = !filterLokasi || item.lokasiUnitKerja === filterLokasi;
      const matchJabo = !filterJabo || item.jaboStatus === filterJabo;
      const matchTahun = !filterTahun || item.tahun === filterTahun;

      return matchSearch && matchLokasi && matchJabo && matchTahun;
    });
  }, [dataList, searchQuery, filterLokasi, filterJabo, filterTahun]);

  const totalElements = filteredData.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page, pageSize]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterLokasi('');
    setFilterJabo('');
    setFilterTahun('');
    setPage(1);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      id: null,
      lokasiUnitKerja: '',
      jaboStatus: 'JABO',
      upahMinimum: '',
      tahun: new Date().getFullYear().toString()
    });
    setOpenAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (row) => {
    setFormData({
      id: row.id,
      lokasiUnitKerja: row.lokasiUnitKerja || '',
      jaboStatus: row.jaboStatus || 'JABO',
      upahMinimum: row.upahMinimum || '',
      tahun: row.tahun || '2026'
    });
    setOpenEditModal(true);
  };

  // Save new record
  const handleSaveAdd = async () => {
    if (!formData.lokasiUnitKerja.trim()) {
      showSnackbar('Lokasi Unit Kerja wajib diisi!', 'warning');
      return;
    }
    if (!formData.upahMinimum || isNaN(Number(formData.upahMinimum))) {
      showSnackbar('Upah Minimum wajib diisi dengan nominal angka valid!', 'warning');
      return;
    }

    const newItem = {
      id: Date.now(),
      lokasiUnitKerja: formData.lokasiUnitKerja.trim().toUpperCase(),
      jaboStatus: formData.jaboStatus || 'JABO',
      upahMinimum: Number(formData.upahMinimum),
      tahun: formData.tahun || new Date().getFullYear().toString()
    };

    try {
      const res = await axios.post(`${API_URL}/api/master/upah`, newItem, { headers: getAuthHeader() });
      if (res.data) {
        setDataList((prev) => [res.data, ...prev]);
      } else {
        setDataList((prev) => [newItem, ...prev]);
      }
    } catch (err) {
      setDataList((prev) => [newItem, ...prev]);
    }
    setOpenAddModal(false);
    showSnackbar('Data Upah Minimum Kertas Kerja berhasil ditambahkan!', 'success');
  };

  // Save updated record
  const handleSaveEdit = async () => {
    if (!formData.lokasiUnitKerja.trim()) {
      showSnackbar('Lokasi Unit Kerja wajib diisi!', 'warning');
      return;
    }
    if (!formData.upahMinimum || isNaN(Number(formData.upahMinimum))) {
      showSnackbar('Upah Minimum wajib diisi angka valid!', 'warning');
      return;
    }

    const updatedItem = {
      ...formData,
      lokasiUnitKerja: formData.lokasiUnitKerja.trim().toUpperCase(),
      jaboStatus: formData.jaboStatus,
      upahMinimum: Number(formData.upahMinimum),
      tahun: formData.tahun
    };

    try {
      const res = await axios.put(`${API_URL}/api/master/upah/${formData.id}`, updatedItem, { headers: getAuthHeader() });
      if (res.data) {
        setDataList((prev) => prev.map((item) => (item.id === formData.id ? res.data : item)));
      } else {
        setDataList((prev) => prev.map((item) => (item.id === formData.id ? updatedItem : item)));
      }
    } catch (err) {
      setDataList((prev) => prev.map((item) => (item.id === formData.id ? updatedItem : item)));
    }
    setOpenEditModal(false);
    showSnackbar('Data Upah Minimum Kertas Kerja berhasil diperbarui!', 'success');
  };

  // Delete confirmation
  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      title: 'Hapus Upah Minimum',
      message: `Apakah Anda yakin ingin menghapus data lokasi "${row.lokasiUnitKerja}" tahun ${row.tahun}?`,
      action: async () => {
        try {
          await axios.delete(`${API_URL}/api/master/upah/${row.id}`, { headers: getAuthHeader() });
        } catch (err) {
          console.warn('Delete fallback:', err.message);
        }
        setDataList((prev) => prev.filter((item) => item.id !== row.id));
        showSnackbar('Data berhasil dihapus!', 'success');
      }
    });
  };

  // Download Template Excel/CSV
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'KETERANGAN LOKASI UNIT KERJA (GEDUNG - LANTAI)': 'MENARA BCA / LANTAI 16',
        'KETERANGAN LOKASI UNIT KERJA (JABO/NON JABO)': 'JABO',
        'UPAH MINIMUM': 5729876,
        'TAHUN': '2026'
      },
      {
        'KETERANGAN LOKASI UNIT KERJA (GEDUNG - LANTAI)': 'BCA KCU SURABAYA / LANTAI 3',
        'KETERANGAN LOKASI UNIT KERJA (JABO/NON JABO)': 'NON JABO',
        'UPAH MINIMUM': 4725000,
        'TAHUN': '2026'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Master Upah');
    XLSX.writeFile(wb, 'Template_Master_Upah.xlsx');
    showSnackbar('Template master upah berhasil didownload!', 'info');
  };

  // Process file upload
  const handleProcessUpload = () => {
    if (!uploadFile) {
      showSnackbar('Silakan pilih file terlebih dahulu!', 'warning');
      return;
    }

    setUploadLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        if (!json || json.length === 0) {
          showSnackbar('File kosong atau format tidak sesuai!', 'error');
          setUploadLoading(false);
          return;
        }

        const newParsedData = json.map((row, idx) => ({
          id: Date.now() + idx,
          lokasiUnitKerja: (row['KETERANGAN LOKASI UNIT KERJA (GEDUNG - LANTAI)'] || row['lokasiUnitKerja'] || '').toString().toUpperCase().trim(),
          jaboStatus: (row['KETERANGAN LOKASI UNIT KERJA (JABO/NON JABO)'] || row['jaboStatus'] || 'JABO').toString().toUpperCase().trim(),
          upahMinimum: Number(row['UPAH MINIMUM'] || row['upahMinimum'] || 0),
          tahun: (row['TAHUN'] || row['tahun'] || uploadTahun).toString().trim()
        }));

        setDataList((prev) => [...newParsedData, ...prev]);
        showSnackbar(`Berhasil mengunggah & memproses ${newParsedData.length} data Master Upah!`, 'success');
        setOpenUploadModal(false);
        setUploadFile(null);
      } catch (err) {
        showSnackbar('Gagal memproses file Excel: ' + err.message, 'error');
      } finally {
        setUploadLoading(false);
      }
    };
    reader.readAsArrayBuffer(uploadFile);
  };

  // Format currency helper (Rp 5.729.876)
  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return 'Rp 0';
    return `Rp ${Number(val).toLocaleString('id-ID')}`;
  };

  // Table Columns Definition
  const columns = [
    {
      id: 'no',
      label: 'No',
      align: 'center',
      render: (row, index) => (page - 1) * pageSize + index + 1
    },
    {
      id: 'lokasiUnitKerja',
      label: 'Lokasi Unit Kerja (Gedung - Lantai)',
      render: (row) => (
        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.primary' }}>
          {row.lokasiUnitKerja || '-'}
        </Typography>
      )
    },
    {
      id: 'jaboStatus',
      label: 'Zonasi Unit Kerja',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.jaboStatus || 'JABO'}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.75rem',
            bgcolor: row.jaboStatus === 'NON JABO' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            color: row.jaboStatus === 'NON JABO' ? '#d97706' : '#2563eb',
            borderRadius: 1.5,
            px: 0.5
          }}
        />
      )
    },
    {
      id: 'upahMinimum',
      label: 'Upah Minimum',
      align: 'right',
      render: (row) => (
        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace', color: 'text.primary' }}>
          {formatCurrency(row.upahMinimum)}
        </Typography>
      )
    },
    {
      id: 'tahun',
      label: 'Tahun',
      align: 'center',
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.secondary' }}>
          {row.tahun || '-'}
        </Typography>
      )
    },
    {
      id: 'actions',
      label: 'Aksi',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'center' }}>
          <Tooltip title="Edit Data" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEdit(row);
              }}
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                borderRadius: 1.5,
                p: 0.75,
                '&:hover': { bgcolor: '#10b981', color: 'white' }
              }}
            >
              <EditIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus Data" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row);
              }}
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                borderRadius: 1.5,
                p: 0.75,
                '&:hover': { bgcolor: '#ef4444', color: 'white' }
              }}
            >
              <DeleteIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {/* PAGE HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
            }}
          >
            <PriceCheckIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Master Upah
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
              Konfigurasi dan standardisasi upah minimum kertas kerja berdasarkan lokasi gedung, lantai, dan zonasi
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons Header */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => {
              setUploadFile(null);
              setOpenUploadModal(true);
            }}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              py: 1,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.06)' }
            }}
          >
            UPLOAD MASTER UPAH
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              py: 1,
              bgcolor: 'primary.main',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            ADD +
          </Button>
        </Box>
      </Box>

      {/* FILTER & ACTIONS PANEL */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <Stack spacing={2}>
          {/* Row: Search & Filter Dropdowns */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '3fr 2fr 1.5fr 1.5fr auto auto' }, gap: 1.5, alignItems: 'center' }}>
            <TextField
              placeholder="Search lokasi, upah, zonasi..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }
              }}
            />

            <SearchableSelect
              placeholder="(Lokasi Unit Kerja)"
              value={filterLokasi}
              options={uniqueLokasiOptions}
              onChange={(val) => {
                setFilterLokasi(val || '');
                setPage(1);
              }}
            />

            <SearchableSelect
              placeholder="(JABO/NONJABO)"
              value={filterJabo}
              options={JABO_OPTIONS}
              onChange={(val) => {
                setFilterJabo(val || '');
                setPage(1);
              }}
            />

            <SearchableSelect
              placeholder="(Tahun)"
              value={filterTahun}
              options={YEAR_OPTIONS}
              onChange={(val) => {
                setFilterTahun(val || '');
                setPage(1);
              }}
            />

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => setPage(1)}
              sx={{
                bgcolor: '#1e293b',
                color: 'white',
                '&:hover': { bgcolor: '#0f172a' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: 2.5,
                height: '40px'
              }}
            >
              SEARCH
            </Button>

            <Tooltip title="Reset Filter" arrow>
              <IconButton
                onClick={handleClearFilters}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  height: '40px',
                  width: '40px'
                }}
              >
                <ResetIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Paper>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={paginatedData}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
        }}
      />

      {/* ADD MODAL */}
      <CustomModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        title="ADD Master Upah"
        maxWidth="sm"
        actions={
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', width: '100%' }}>
            <Button
              variant="outlined"
              onClick={() => setOpenAddModal(false)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAdd}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: 3
              }}
            >
              SAVE
            </Button>
          </Box>
        }
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Lokasi Unit Kerja *
            </Typography>
            <TextField
              placeholder="Contoh: MENARA BCA / LANTAI 16"
              size="small"
              fullWidth
              value={formData.lokasiUnitKerja}
              onChange={(e) => setFormData((prev) => ({ ...prev, lokasiUnitKerja: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Zonasi JABO / NON JABO *
            </Typography>
            <SearchableSelect
              placeholder="Pilih Jabo / Non Jabo"
              value={formData.jaboStatus}
              options={JABO_OPTIONS}
              onChange={(val) => setFormData((prev) => ({ ...prev, jaboStatus: val || 'JABO' }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Upah Minimum (Rp) *
            </Typography>
            <TextField
              placeholder="Contoh: 5729876"
              size="small"
              type="number"
              fullWidth
              value={formData.upahMinimum}
              onChange={(e) => setFormData((prev) => ({ ...prev, upahMinimum: e.target.value }))}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>
                }
              }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Tahun *
            </Typography>
            <SearchableSelect
              placeholder="Pilih Tahun"
              value={formData.tahun}
              options={YEAR_OPTIONS}
              onChange={(val) => setFormData((prev) => ({ ...prev, tahun: val || '2026' }))}
            />
          </Box>
        </Stack>
      </CustomModal>

      {/* EDIT MODAL */}
      <CustomModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title="EDIT Master Upah"
        maxWidth="sm"
        actions={
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', width: '100%' }}>
            <Button
              variant="outlined"
              onClick={() => setOpenEditModal(false)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveEdit}
              sx={{
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: 3
              }}
            >
              UPDATE
            </Button>
          </Box>
        }
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {formData.id && (
            <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                ID Data: #{formData.id}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Lokasi Unit Kerja *
            </Typography>
            <TextField
              placeholder="Contoh: MENARA BCA / LANTAI 16"
              size="small"
              fullWidth
              value={formData.lokasiUnitKerja}
              onChange={(e) => setFormData((prev) => ({ ...prev, lokasiUnitKerja: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Zonasi JABO / NON JABO *
            </Typography>
            <SearchableSelect
              placeholder="Pilih Jabo / Non Jabo"
              value={formData.jaboStatus}
              options={JABO_OPTIONS}
              onChange={(val) => setFormData((prev) => ({ ...prev, jaboStatus: val || 'JABO' }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Upah Minimum (Rp) *
            </Typography>
            <TextField
              placeholder="Contoh: 5729876"
              size="small"
              type="number"
              fullWidth
              value={formData.upahMinimum}
              onChange={(e) => setFormData((prev) => ({ ...prev, upahMinimum: e.target.value }))}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>
                }
              }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Tahun *
            </Typography>
            <SearchableSelect
              placeholder="Pilih Tahun"
              value={formData.tahun}
              options={YEAR_OPTIONS}
              onChange={(val) => setFormData((prev) => ({ ...prev, tahun: val || '2026' }))}
            />
          </Box>
        </Stack>
      </CustomModal>

      {/* UPLOAD MODAL */}
      <CustomModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        title="UPLOAD MASTER UPAH KERTAS KERJA"
        maxWidth="sm"
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadTemplate}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Template Upload
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenUploadModal(false)}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                onClick={handleProcessUpload}
                disabled={uploadLoading || !uploadFile}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3
                }}
              >
                {uploadLoading ? 'Memproses...' : 'Upload & Process'}
              </Button>
            </Box>
          </Box>
        }
      >
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
            <strong>Kriteria penginputan data:</strong><br />
            Pastikan kolom <strong>Upah Minimum</strong> diisi dengan nominal angka murni tanpa titik atau simbol Rp. File Excel / CSV harus sesuai dengan struktur kolom template.
          </Alert>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Pilih Tahun Berlaku *
            </Typography>
            <SearchableSelect
              placeholder="Pilih Tahun"
              value={uploadTahun}
              options={YEAR_OPTIONS}
              onChange={(val) => setUploadTahun(val || '2026')}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              File Excel / CSV *
            </Typography>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: uploadFile ? 'primary.main' : 'divider',
                bgcolor: uploadFile ? 'action.hover' : 'background.paper',
                borderRadius: 2.5,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
              }}
              onClick={() => document.getElementById('upah-file-input').click()}
            >
              <input
                id="upah-file-input"
                type="file"
                accept=".csv, .xlsx, .xls"
                style={{ display: 'none' }}
                onChange={(e) => setUploadFile(e.target.files[0] || null)}
              />
              <CloudUploadIcon sx={{ fontSize: 40, color: uploadFile ? 'primary.main' : 'text.secondary', mb: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {uploadFile ? uploadFile.name : 'Klik untuk memilih file excel/csv'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                Mendukung format .xlsx, .xls, atau .csv sesuai template
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CustomModal>

      {/* CONFIRM DIALOG */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={() => {
          if (confirmDialog.action) confirmDialog.action();
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }}
      />

      {/* SNACKBAR */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default MasterUpah;
