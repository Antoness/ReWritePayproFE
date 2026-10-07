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
  Domain as DomainIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Seed Data matching legacy system screenshot
const INITIAL_UNIT_KERJA_DATA = [
  {
    id: 1,
    kodeOrange: '1667',
    kpWilayah: 'KANTOR PUSAT',
    divisi: 'ACCOUNTING & TAX DIVISION',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'A',
    namaUnitKerja: 'KANTOR PUSAT - ACCOUNTING & TAX DIVISION - 1667',
    kodeCabang: '0998',
    rccPembayaran: '060',
    singkatanDivisi: 'ATX',
    kodeSlid: ''
  },
  {
    id: 2,
    kodeOrange: '1761',
    kpWilayah: 'KANTOR PUSAT',
    divisi: 'ACCOUNTING & TAX DIVISION',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'B',
    namaUnitKerja: 'KANTOR PUSAT - TAX SUBDIVISION - 1761',
    kodeCabang: '0998',
    rccPembayaran: '060',
    singkatanDivisi: 'ATX',
    kodeSlid: ''
  },
  {
    id: 3,
    kodeOrange: '1332',
    kpWilayah: 'KANTOR PUSAT',
    divisi: 'ACCOUNTING & TAX DIVISION',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'D',
    namaUnitKerja: 'KANTOR PUSAT - TAX PLANNING & POLICY BUREAU - 1332',
    kodeCabang: '0998',
    rccPembayaran: '060',
    singkatanDivisi: 'ATX',
    kodeSlid: ''
  },
  {
    id: 4,
    kodeOrange: '1762',
    kpWilayah: 'KANTOR PUSAT',
    divisi: 'ACCOUNTING & TAX DIVISION',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'D',
    namaUnitKerja: 'KANTOR PUSAT - TAX COMPLIANCE & REPORTING BUREAU - 1762',
    kodeCabang: '0998',
    rccPembayaran: '060',
    singkatanDivisi: 'ATX',
    kodeSlid: ''
  },
  {
    id: 5,
    kodeOrange: '1763',
    kpWilayah: 'KANTOR PUSAT',
    divisi: 'ACCOUNTING & TAX DIVISION',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'D',
    namaUnitKerja: 'KANTOR PUSAT - ACCOUNTING POLICY BUREAU - 1763',
    kodeCabang: '0998',
    rccPembayaran: '060',
    singkatanDivisi: 'ATX',
    kodeSlid: ''
  },
  {
    id: 6,
    kodeOrange: '1670',
    kpWilayah: 'KANTOR PUSAT',
    divisi: 'ACCOUNTING & TAX DIVISION',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'D',
    namaUnitKerja: 'KANTOR PUSAT - REGULATORY REPORTING BUREAU - 1670',
    kodeCabang: '0998',
    rccPembayaran: '060',
    singkatanDivisi: 'ATX',
    kodeSlid: ''
  },
  {
    id: 7,
    kodeOrange: '1540',
    kpWilayah: 'KANTOR PUSAT',
    divisi: 'ACCOUNTING & TAX DIVISION',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'D',
    namaUnitKerja: 'KANTOR PUSAT - INTEGRATED MANAGEMENT REPORTING BUREAU - 1540',
    kodeCabang: '0998',
    rccPembayaran: '060',
    singkatanDivisi: 'ATX',
    kodeSlid: ''
  },
  {
    id: 8,
    kodeOrange: '1539',
    kpWilayah: 'KANTOR PUSAT',
    divisi: 'ACCOUNTING & TAX DIVISION',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'D',
    namaUnitKerja: 'KANTOR PUSAT - FINANCE CONTROL BUREAU - 1539',
    kodeCabang: '0998',
    rccPembayaran: '060',
    singkatanDivisi: 'ATX',
    kodeSlid: ''
  },
  {
    id: 9,
    kodeOrange: '1387',
    kpWilayah: 'KANTOR PUSAT',
    divisi: 'ANTI FRAUD BUREAU',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'A',
    namaUnitKerja: 'KANTOR PUSAT - ANTI FRAUD BUREAU - 1387',
    kodeCabang: '0998',
    rccPembayaran: '080',
    singkatanDivisi: 'BAF',
    kodeSlid: ''
  },
  {
    id: 10,
    kodeOrange: '1388',
    kpWilayah: 'KANTOR PUSAT',
    divisi: 'COMMERCIAL & SME BANKING DIVISION (DCE)',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'A',
    namaUnitKerja: 'KANTOR PUSAT - COMMERCIAL & SME BANKING DIVISION (DCE) - 1388',
    kodeCabang: '0998',
    rccPembayaran: '050',
    singkatanDivisi: 'DCE',
    kodeSlid: ''
  }
];

const MasterUnitKerjaPenempatan = () => {
  // Main Data States
  const [dataList, setDataList] = useState(INITIAL_UNIT_KERJA_DATA);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterKpWilayah, setFilterKpWilayah] = useState('');

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
    kodeOrange: '',
    kpWilayah: 'KANTOR PUSAT',
    divisi: '',
    kcuInduk: 'KANTOR PUSAT',
    urutanUnitKerja: 'A',
    namaUnitKerja: '',
    kodeCabang: '0998',
    rccPembayaran: '',
    singkatanDivisi: '',
    kodeSlid: ''
  });

  // Upload Form State
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

  // Fetch initial data from API if available
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/master/unit-kerja-penempatan`, {
        headers: getAuthHeader()
      });
      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        setDataList(response.data.data);
      }
    } catch (err) {
      console.warn('API unit-kerja-penempatan not available, using local dataset:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Dynamic unique options for filters
  const uniqueDivisiOptions = useMemo(() => {
    const list = Array.from(new Set(dataList.map((item) => item.divisi).filter(Boolean))).sort();
    return list.map((d) => ({ label: d, value: d }));
  }, [dataList]);

  const uniqueKpOptions = useMemo(() => {
    const list = Array.from(new Set(dataList.map((item) => item.kpWilayah).filter(Boolean))).sort();
    return list.map((kp) => ({ label: kp, value: kp }));
  }, [dataList]);

  // Filtered & Paginated Data
  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.kodeOrange && item.kodeOrange.toLowerCase().includes(q)) ||
        (item.kpWilayah && item.kpWilayah.toLowerCase().includes(q)) ||
        (item.divisi && item.divisi.toLowerCase().includes(q)) ||
        (item.kcuInduk && item.kcuInduk.toLowerCase().includes(q)) ||
        (item.namaUnitKerja && item.namaUnitKerja.toLowerCase().includes(q)) ||
        (item.kodeCabang && item.kodeCabang.toLowerCase().includes(q)) ||
        (item.rccPembayaran && item.rccPembayaran.toLowerCase().includes(q)) ||
        (item.singkatanDivisi && item.singkatanDivisi.toLowerCase().includes(q));

      const matchDivisi = !filterDivisi || item.divisi === filterDivisi;
      const matchKp = !filterKpWilayah || item.kpWilayah === filterKpWilayah;

      return matchSearch && matchDivisi && matchKp;
    });
  }, [dataList, searchQuery, filterDivisi, filterKpWilayah]);

  const totalElements = filteredData.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page, pageSize]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterDivisi('');
    setFilterKpWilayah('');
    setPage(1);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      id: null,
      kodeOrange: '',
      kpWilayah: 'KANTOR PUSAT',
      divisi: '',
      kcuInduk: 'KANTOR PUSAT',
      urutanUnitKerja: 'A',
      namaUnitKerja: '',
      kodeCabang: '0998',
      rccPembayaran: '',
      singkatanDivisi: '',
      kodeSlid: ''
    });
    setOpenAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (row) => {
    setFormData({
      id: row.id,
      kodeOrange: row.kodeOrange || '',
      kpWilayah: row.kpWilayah || '',
      divisi: row.divisi || '',
      kcuInduk: row.kcuInduk || '',
      urutanUnitKerja: row.urutanUnitKerja || '',
      namaUnitKerja: row.namaUnitKerja || '',
      kodeCabang: row.kodeCabang || '',
      rccPembayaran: row.rccPembayaran || '',
      singkatanDivisi: row.singkatanDivisi || '',
      kodeSlid: row.kodeSlid || ''
    });
    setOpenEditModal(true);
  };

  // Save new record
  const handleSaveAdd = async () => {
    if (!formData.kodeOrange.trim() || !formData.divisi.trim() || !formData.namaUnitKerja.trim()) {
      showSnackbar('Mohon lengkapi kolom yang berbintang (*)!', 'error');
      return;
    }

    const newItem = {
      id: Date.now(),
      kodeOrange: formData.kodeOrange.trim().toUpperCase(),
      kpWilayah: formData.kpWilayah.trim().toUpperCase(),
      divisi: formData.divisi.trim().toUpperCase(),
      kcuInduk: formData.kcuInduk.trim().toUpperCase(),
      urutanUnitKerja: formData.urutanUnitKerja.trim().toUpperCase(),
      namaUnitKerja: formData.namaUnitKerja.trim().toUpperCase(),
      kodeCabang: formData.kodeCabang.trim().toUpperCase(),
      rccPembayaran: formData.rccPembayaran.trim().toUpperCase(),
      singkatanDivisi: formData.singkatanDivisi.trim().toUpperCase(),
      kodeSlid: formData.kodeSlid.trim().toUpperCase()
    };

    try {
      await axios.post(`${API_URL}/api/master/unit-kerja-penempatan`, newItem, { headers: getAuthHeader() });
    } catch (err) {
      console.warn('API post fallback to local state:', err.message);
    }

    setDataList((prev) => [newItem, ...prev]);
    setOpenAddModal(false);
    showSnackbar('Unit Kerja Penempatan berhasil ditambahkan!', 'success');
  };

  // Save updated record
  const handleSaveEdit = async () => {
    if (!formData.kodeOrange.trim() || !formData.divisi.trim() || !formData.namaUnitKerja.trim()) {
      showSnackbar('Mohon lengkapi kolom yang berbintang (*)!', 'error');
      return;
    }

    const updatedItem = {
      ...formData,
      kodeOrange: formData.kodeOrange.trim().toUpperCase(),
      kpWilayah: formData.kpWilayah.trim().toUpperCase(),
      divisi: formData.divisi.trim().toUpperCase(),
      kcuInduk: formData.kcuInduk.trim().toUpperCase(),
      urutanUnitKerja: formData.urutanUnitKerja.trim().toUpperCase(),
      namaUnitKerja: formData.namaUnitKerja.trim().toUpperCase(),
      kodeCabang: formData.kodeCabang.trim().toUpperCase(),
      rccPembayaran: formData.rccPembayaran.trim().toUpperCase(),
      singkatanDivisi: formData.singkatanDivisi.trim().toUpperCase(),
      kodeSlid: formData.kodeSlid.trim().toUpperCase()
    };

    try {
      await axios.put(`${API_URL}/api/master/unit-kerja-penempatan/${formData.id}`, updatedItem, { headers: getAuthHeader() });
    } catch (err) {
      console.warn('API put fallback to local state:', err.message);
    }

    setDataList((prev) => prev.map((item) => (item.id === formData.id ? updatedItem : item)));
    setOpenEditModal(false);
    showSnackbar('Unit Kerja Penempatan berhasil diperbarui!', 'success');
  };

  // Delete confirmation
  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      title: 'Hapus Unit Kerja Penempatan',
      message: `Apakah Anda yakin ingin menghapus Unit Kerja "${row.namaUnitKerja}" (${row.kodeOrange})?`,
      action: async () => {
        try {
          await axios.delete(`${API_URL}/api/master/unit-kerja-penempatan/${row.id}`, { headers: getAuthHeader() });
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
        'Kode Orange': '1667',
        'KP Dan Wilayah': 'KANTOR PUSAT',
        'Divisi': 'ACCOUNTING & TAX DIVISION',
        'KCU Induk': 'KANTOR PUSAT',
        'Unit Kerja Penempatan': 'A',
        'Nama Unit Kerja Penempatan': 'KANTOR PUSAT - ACCOUNTING & TAX DIVISION - 1667',
        'Kode Cabang': '0998',
        'RCC Pembayaran': '060',
        'Singkatan Divisi': 'ATX',
        'Kode SLID': ''
      },
      {
        'Kode Orange': '1387',
        'KP Dan Wilayah': 'KANTOR PUSAT',
        'Divisi': 'ANTI FRAUD BUREAU',
        'KCU Induk': 'KANTOR PUSAT',
        'Unit Kerja Penempatan': 'A',
        'Nama Unit Kerja Penempatan': 'KANTOR PUSAT - ANTI FRAUD BUREAU - 1387',
        'Kode Cabang': '0998',
        'RCC Pembayaran': '080',
        'Singkatan Divisi': 'BAF',
        'Kode SLID': ''
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Unit Kerja');
    XLSX.writeFile(wb, 'Template_Master_Unit_Kerja_Penempatan.xlsx');
    showSnackbar('Template unit kerja penempatan berhasil didownload!', 'info');
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
          kodeOrange: (row['Kode Orange'] || row['kodeOrange'] || '').toString().toUpperCase().trim(),
          kpWilayah: (row['KP Dan Wilayah'] || row['kpWilayah'] || '').toString().toUpperCase().trim(),
          divisi: (row['Divisi'] || row['divisi'] || '').toString().toUpperCase().trim(),
          kcuInduk: (row['KCU Induk'] || row['kcuInduk'] || '').toString().toUpperCase().trim(),
          urutanUnitKerja: (row['Unit Kerja Penempatan'] || row['urutanUnitKerja'] || '').toString().toUpperCase().trim(),
          namaUnitKerja: (row['Nama Unit Kerja Penempatan'] || row['namaUnitKerja'] || '').toString().toUpperCase().trim(),
          kodeCabang: (row['Kode Cabang'] || row['kodeCabang'] || '').toString().toUpperCase().trim(),
          rccPembayaran: (row['RCC Pembayaran'] || row['rccPembayaran'] || '').toString().toUpperCase().trim(),
          singkatanDivisi: (row['Singkatan Divisi'] || row['singkatanDivisi'] || '').toString().toUpperCase().trim(),
          kodeSlid: (row['Kode SLID'] || row['kodeSlid'] || '').toString().toUpperCase().trim()
        }));

        setDataList((prev) => [...newParsedData, ...prev]);
        showSnackbar(`Berhasil mengunggah & memproses ${newParsedData.length} data Unit Kerja!`, 'success');
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

  // Table Columns Definition
  const columns = [
    {
      id: 'no',
      label: 'No',
      align: 'center',
      render: (row, index) => (page - 1) * pageSize + index + 1
    },
    {
      id: 'kodeOrange',
      label: 'Kode Orange',
      render: (row) => (
        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace', color: 'primary.main' }}>
          {row.kodeOrange || '-'}
        </Typography>
      )
    },
    {
      id: 'kpWilayah',
      label: 'KP & Wilayah',
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.primary' }}>
          {row.kpWilayah || '-'}
        </Typography>
      )
    },
    {
      id: 'divisi',
      label: 'Divisi',
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.secondary' }}>
          {row.divisi || '-'}
        </Typography>
      )
    },
    {
      id: 'kcuInduk',
      label: 'KCU Induk',
      render: (row) => (
        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
          {row.kcuInduk || '-'}
        </Typography>
      )
    },
    {
      id: 'namaUnitKerja',
      label: 'Nama Unit Kerja Penempatan',
      render: (row) => (
        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.primary' }}>
          {row.namaUnitKerja || '-'}
        </Typography>
      )
    },
    {
      id: 'kodeCabang',
      label: 'Cabang',
      align: 'center',
      render: (row) => (
        <Typography sx={{ fontSize: '0.78rem', fontFamily: 'monospace' }}>
          {row.kodeCabang || '-'}
        </Typography>
      )
    },
    {
      id: 'rccPembayaran',
      label: 'RCC',
      align: 'center',
      render: (row) => (
        <Typography sx={{ fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 600 }}>
          {row.rccPembayaran || '-'}
        </Typography>
      )
    },
    {
      id: 'singkatanDivisi',
      label: 'Singkatan',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.singkatanDivisi || '-'}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.72rem',
            bgcolor: 'rgba(59, 130, 246, 0.1)',
            color: '#2563eb',
            borderRadius: 1.5,
            px: 0.5
          }}
        />
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
            <DomainIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Master Unit Kerja Penempatan
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
              Standardisasi data unit kerja penempatan, kode orange, divisi, KCU induk, dan RCC pembayaran
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
            UPLOAD UNIT KERJA
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '3fr 2fr 2fr auto auto' }, gap: 1.5, alignItems: 'center' }}>
            <TextField
              placeholder="Search kode orange, unit kerja, divisi, RCC, cabang..."
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
              placeholder="(Divisi)"
              value={filterDivisi}
              options={uniqueDivisiOptions}
              onChange={(val) => {
                setFilterDivisi(val || '');
                setPage(1);
              }}
            />

            <SearchableSelect
              placeholder="(KP / Wilayah)"
              value={filterKpWilayah}
              options={uniqueKpOptions}
              onChange={(val) => {
                setFilterKpWilayah(val || '');
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
        title="ADD Unit Kerja Penempatan"
        maxWidth="md"
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
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Kode Orange *
            </Typography>
            <TextField
              placeholder="Contoh: 1667"
              size="small"
              fullWidth
              value={formData.kodeOrange}
              onChange={(e) => setFormData((prev) => ({ ...prev, kodeOrange: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              KP / Wilayah *
            </Typography>
            <TextField
              placeholder="Contoh: KANTOR PUSAT"
              size="small"
              fullWidth
              value={formData.kpWilayah}
              onChange={(e) => setFormData((prev) => ({ ...prev, kpWilayah: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Divisi / Wilayah *
            </Typography>
            <TextField
              placeholder="Contoh: ACCOUNTING & TAX DIVISION"
              size="small"
              fullWidth
              value={formData.divisi}
              onChange={(e) => setFormData((prev) => ({ ...prev, divisi: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              KCU Induk *
            </Typography>
            <TextField
              placeholder="Contoh: KANTOR PUSAT"
              size="small"
              fullWidth
              value={formData.kcuInduk}
              onChange={(e) => setFormData((prev) => ({ ...prev, kcuInduk: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Urutan Unit Kerja
            </Typography>
            <TextField
              placeholder="Contoh: A, B, D"
              size="small"
              fullWidth
              value={formData.urutanUnitKerja}
              onChange={(e) => setFormData((prev) => ({ ...prev, urutanUnitKerja: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Nama Unit Kerja Penempatan *
            </Typography>
            <TextField
              placeholder="Contoh: KANTOR PUSAT - ACCOUNTING & TAX DIVISION - 1667"
              size="small"
              fullWidth
              value={formData.namaUnitKerja}
              onChange={(e) => setFormData((prev) => ({ ...prev, namaUnitKerja: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Kode Cabang
            </Typography>
            <TextField
              placeholder="Contoh: 0998"
              size="small"
              fullWidth
              value={formData.kodeCabang}
              onChange={(e) => setFormData((prev) => ({ ...prev, kodeCabang: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              RCC Pembayaran
            </Typography>
            <TextField
              placeholder="Contoh: 060"
              size="small"
              fullWidth
              value={formData.rccPembayaran}
              onChange={(e) => setFormData((prev) => ({ ...prev, rccPembayaran: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Singkatan Divisi
            </Typography>
            <TextField
              placeholder="Contoh: ATX"
              size="small"
              fullWidth
              value={formData.singkatanDivisi}
              onChange={(e) => setFormData((prev) => ({ ...prev, singkatanDivisi: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Kode SLID
            </Typography>
            <TextField
              placeholder="Contoh: SLID-001"
              size="small"
              fullWidth
              value={formData.kodeSlid}
              onChange={(e) => setFormData((prev) => ({ ...prev, kodeSlid: e.target.value }))}
            />
          </Box>
        </Box>
      </CustomModal>

      {/* EDIT MODAL */}
      <CustomModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title="EDIT Unit Kerja Penempatan"
        maxWidth="md"
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
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
          {formData.id && (
            <Box sx={{ gridColumn: '1 / -1', p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                ID Data: #{formData.id}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Kode Orange *
            </Typography>
            <TextField
              placeholder="Contoh: 1667"
              size="small"
              fullWidth
              value={formData.kodeOrange}
              onChange={(e) => setFormData((prev) => ({ ...prev, kodeOrange: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              KP / Wilayah *
            </Typography>
            <TextField
              placeholder="Contoh: KANTOR PUSAT"
              size="small"
              fullWidth
              value={formData.kpWilayah}
              onChange={(e) => setFormData((prev) => ({ ...prev, kpWilayah: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Divisi / Wilayah *
            </Typography>
            <TextField
              placeholder="Contoh: ACCOUNTING & TAX DIVISION"
              size="small"
              fullWidth
              value={formData.divisi}
              onChange={(e) => setFormData((prev) => ({ ...prev, divisi: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              KCU Induk *
            </Typography>
            <TextField
              placeholder="Contoh: KANTOR PUSAT"
              size="small"
              fullWidth
              value={formData.kcuInduk}
              onChange={(e) => setFormData((prev) => ({ ...prev, kcuInduk: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Urutan Unit Kerja
            </Typography>
            <TextField
              placeholder="Contoh: A, B, D"
              size="small"
              fullWidth
              value={formData.urutanUnitKerja}
              onChange={(e) => setFormData((prev) => ({ ...prev, urutanUnitKerja: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Nama Unit Kerja Penempatan *
            </Typography>
            <TextField
              placeholder="Contoh: KANTOR PUSAT - ACCOUNTING & TAX DIVISION - 1667"
              size="small"
              fullWidth
              value={formData.namaUnitKerja}
              onChange={(e) => setFormData((prev) => ({ ...prev, namaUnitKerja: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Kode Cabang
            </Typography>
            <TextField
              placeholder="Contoh: 0998"
              size="small"
              fullWidth
              value={formData.kodeCabang}
              onChange={(e) => setFormData((prev) => ({ ...prev, kodeCabang: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              RCC Pembayaran
            </Typography>
            <TextField
              placeholder="Contoh: 060"
              size="small"
              fullWidth
              value={formData.rccPembayaran}
              onChange={(e) => setFormData((prev) => ({ ...prev, rccPembayaran: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Singkatan Divisi
            </Typography>
            <TextField
              placeholder="Contoh: ATX"
              size="small"
              fullWidth
              value={formData.singkatanDivisi}
              onChange={(e) => setFormData((prev) => ({ ...prev, singkatanDivisi: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Kode SLID
            </Typography>
            <TextField
              placeholder="Contoh: SLID-001"
              size="small"
              fullWidth
              value={formData.kodeSlid}
              onChange={(e) => setFormData((prev) => ({ ...prev, kodeSlid: e.target.value }))}
            />
          </Box>
        </Box>
      </CustomModal>

      {/* UPLOAD MODAL */}
      <CustomModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        title="UPLOAD UNIT KERJA PENEMPATAN"
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
            Pastikan kolom <strong>Kode Orange</strong> dan <strong>Nama Unit Kerja</strong> terisi lengkap. File Excel / CSV harus sesuai dengan kolom template.
          </Alert>

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
              onClick={() => document.getElementById('uk-file-input').click()}
            >
              <input
                id="uk-file-input"
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

export default MasterUnitKerjaPenempatan;
