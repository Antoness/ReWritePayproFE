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
  Badge as BadgeIcon,
  Percent as PercentIcon
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

// Seed Data matching legacy system screenshot
const INITIAL_POSISI_DATA = [
  { id: 1, jenisPekerjaan: 'ADMINISTRASI', posisiPekerjaan: 'STAFF ADMINISTRASI', posisiClient: 'ADMINISTRASI KANWIL-HUKUM - P000054', standarisasiUpah: '110%' },
  { id: 2, jenisPekerjaan: 'ADMINISTRASI', posisiPekerjaan: 'STAFF ADMINISTRASI', posisiClient: 'ADMINISTRASI CABANG-APK - P000056', standarisasiUpah: '110%' },
  { id: 3, jenisPekerjaan: 'ADMINISTRASI', posisiPekerjaan: 'STAFF ADMINISTRASI', posisiClient: 'ADMINISTRASI KANWIL-SERVICE QUALITY WILAYAH - P000057', standarisasiUpah: '110%' },
  { id: 4, jenisPekerjaan: 'ADMINISTRASI', posisiPekerjaan: 'STAFF ADMINISTRASI', posisiClient: 'ADMINISTRASI KANWIL-SENTRA LAYANAN AREA - P000050', standarisasiUpah: '110%' },
  { id: 5, jenisPekerjaan: 'ADMINISTRASI', posisiPekerjaan: 'STAFF ADMINISTRASI', posisiClient: 'ADMINISTRASI KANWIL-SENTRA BISNIS UMKM & SME - P000209', standarisasiUpah: '120%' },
  { id: 6, jenisPekerjaan: 'ADMINISTRASI', posisiPekerjaan: 'STAFF ADMINISTRASI', posisiClient: 'ADMINISTRASI KANWIL-SENTRA BISNIS KOMERSIAL - P000007', standarisasiUpah: '120%' },
  { id: 7, jenisPekerjaan: 'ADMINISTRASI', posisiPekerjaan: 'STAFF ADMINISTRASI', posisiClient: 'ADMINISTRASI KANWIL-SEKRETARIAT (DHCM) - P000215', standarisasiUpah: '110%' },
  { id: 8, jenisPekerjaan: 'ADMINISTRASI', posisiPekerjaan: 'STAFF ADMINISTRASI', posisiClient: 'ADMINISTRASI KANWIL-SEKRETARIAT - P000211', standarisasiUpah: '110%' },
  { id: 9, jenisPekerjaan: 'ADMINISTRASI', posisiPekerjaan: 'STAFF ADMINISTRASI', posisiClient: 'ADMINISTRASI KANWIL-PROJECT SME - P000048', standarisasiUpah: '120%' },
  { id: 10, jenisPekerjaan: 'ADMINISTRASI', posisiPekerjaan: 'STAFF ADMINISTRASI', posisiClient: 'ADMINISTRASI KANWIL-PENGEMBANGAN SDM - P000051', standarisasiUpah: '110%' },
  { id: 11, jenisPekerjaan: 'CUSTOMER SERVICE', posisiPekerjaan: 'CUSTOMER SERVICE OFFICER', posisiClient: 'CS KANWIL-OPERASIONAL - P000102', standarisasiUpah: '115%' },
  { id: 12, jenisPekerjaan: 'TELLER', posisiPekerjaan: 'TELLER SERVICE', posisiClient: 'TELLER CABANG UTAMA - P000105', standarisasiUpah: '110%' },
  { id: 13, jenisPekerjaan: 'SECURITY', posisiPekerjaan: 'SECURITY GUARD', posisiClient: 'SECURITY KANTOR PUSAT - P000120', standarisasiUpah: '100%' },
  { id: 14, jenisPekerjaan: 'DRIVER', posisiPekerjaan: 'OPERATIONAL DRIVER', posisiClient: 'DRIVER DIREKSI - P000130', standarisasiUpah: '105%' }
];

const MasterPosisi = () => {
  // Main Data States
  const [dataList, setDataList] = useState(INITIAL_POSISI_DATA);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosisi, setFilterPosisi] = useState('');
  const [filterUnitKerja, setFilterUnitKerja] = useState('');

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
    jenisPekerjaan: '',
    posisiPekerjaan: '',
    posisiClient: '',
    standarisasiUpah: ''
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

  // Feedback Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch initial data from Backend if available, fallback to seed data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/master-posisi`, {
        headers: getAuthHeader()
      });
      if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        setDataList(response.data.data);
      }
    } catch (err) {
      console.warn('API master-posisi not available or error, using local dataset:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Dropdown Options
  const uniquePosisiOptions = useMemo(() => {
    const list = Array.from(new Set(dataList.map((item) => item.jenisPekerjaan || item.posisiPekerjaan).filter(Boolean)));
    return list.map((pos) => ({ label: pos, value: pos }));
  }, [dataList]);

  const uniqueUnitKerjaOptions = useMemo(() => {
    const list = Array.from(new Set(dataList.map((item) => item.posisiClient).filter(Boolean)));
    return list.map((uk) => ({ label: uk, value: uk }));
  }, [dataList]);

  // Filtered & Paginated Data
  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        (item.jenisPekerjaan && item.jenisPekerjaan.toLowerCase().includes(query)) ||
        (item.posisiPekerjaan && item.posisiPekerjaan.toLowerCase().includes(query)) ||
        (item.posisiClient && item.posisiClient.toLowerCase().includes(query)) ||
        (item.standarisasiUpah && item.standarisasiUpah.toLowerCase().includes(query));

      const matchesPosisi =
        !filterPosisi ||
        item.jenisPekerjaan === filterPosisi ||
        item.posisiPekerjaan === filterPosisi;

      const matchesUnitKerja =
        !filterUnitKerja ||
        (item.posisiClient && item.posisiClient.includes(filterUnitKerja));

      return matchesSearch && matchesPosisi && matchesUnitKerja;
    });
  }, [dataList, searchQuery, filterPosisi, filterUnitKerja]);

  const totalElements = filteredData.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterPosisi('');
    setFilterUnitKerja('');
    setPage(1);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData({
      id: null,
      jenisPekerjaan: '',
      posisiPekerjaan: '',
      posisiClient: '',
      standarisasiUpah: ''
    });
    setOpenAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (row) => {
    setFormData({
      id: row.id,
      jenisPekerjaan: row.jenisPekerjaan || '',
      posisiPekerjaan: row.posisiPekerjaan || '',
      posisiClient: row.posisiClient || '',
      standarisasiUpah: row.standarisasiUpah ? String(row.standarisasiUpah).replace('%', '') : ''
    });
    setOpenEditModal(true);
  };

  // Save Add Data
  const handleSaveAdd = async () => {
    if (!formData.jenisPekerjaan.trim() || !formData.posisiClient.trim() || !formData.standarisasiUpah.trim()) {
      showSnackbar('Mohon lengkapi kolom Jenis Pekerjaan, Posisi Client, dan Standarisasi Upah!', 'error');
      return;
    }

    const formattedUpah = formData.standarisasiUpah.includes('%') 
      ? formData.standarisasiUpah 
      : `${formData.standarisasiUpah}%`;

    const newItem = {
      id: Date.now(),
      jenisPekerjaan: formData.jenisPekerjaan.toUpperCase().trim(),
      posisiPekerjaan: formData.posisiPekerjaan.toUpperCase().trim(),
      posisiClient: formData.posisiClient.toUpperCase().trim(),
      standarisasiUpah: formattedUpah
    };

    try {
      await axios.post(`${API_URL}/api/master-posisi`, newItem, { headers: getAuthHeader() });
    } catch (err) {
      console.warn('API post failed, updating local state:', err.message);
    }

    setDataList((prev) => [newItem, ...prev]);
    showSnackbar('Data Master Posisi berhasil ditambahkan!', 'success');
    setOpenAddModal(false);
  };

  // Save Edit Data
  const handleSaveEdit = async () => {
    if (!formData.jenisPekerjaan.trim() || !formData.posisiClient.trim() || !formData.standarisasiUpah.trim()) {
      showSnackbar('Mohon lengkapi kolom yang berbintang (*)!', 'error');
      return;
    }

    const formattedUpah = formData.standarisasiUpah.includes('%') 
      ? formData.standarisasiUpah 
      : `${formData.standarisasiUpah}%`;

    const updatedItem = {
      ...formData,
      jenisPekerjaan: formData.jenisPekerjaan.toUpperCase().trim(),
      posisiPekerjaan: formData.posisiPekerjaan.toUpperCase().trim(),
      posisiClient: formData.posisiClient.toUpperCase().trim(),
      standarisasiUpah: formattedUpah
    };

    try {
      await axios.put(`${API_URL}/api/master-posisi/${formData.id}`, updatedItem, { headers: getAuthHeader() });
    } catch (err) {
      console.warn('API put failed, updating local state:', err.message);
    }

    setDataList((prev) => prev.map((item) => (item.id === formData.id ? updatedItem : item)));
    showSnackbar('Data Master Posisi berhasil diperbarui!', 'success');
    setOpenEditModal(false);
  };

  // Handle Delete with Confirmation Dialog
  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      title: 'Hapus Data Master Posisi',
      message: `Apakah Anda yakin ingin menghapus posisi "${row.posisiClient}" (${row.jenisPekerjaan})?`,
      action: async () => {
        try {
          await axios.delete(`${API_URL}/api/master-posisi/${row.id}`, { headers: getAuthHeader() });
        } catch (err) {
          console.warn('API delete failed, updating local state:', err.message);
        }
        setDataList((prev) => prev.filter((item) => item.id !== row.id));
        showSnackbar('Data Master Posisi berhasil dihapus!', 'success');
      }
    });
  };

  // Download Excel Template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Jenis Pekerjaan': 'ADMINISTRASI',
        'Posisi Pekerjaan': 'STAFF ADMINISTRASI',
        'Posisi Client': 'ADMINISTRASI KANWIL-HUKUM - P000054',
        'Standarisasi Upah': 110
      },
      {
        'Jenis Pekerjaan': 'ADMINISTRASI',
        'Posisi Pekerjaan': 'STAFF ADMINISTRASI',
        'Posisi Client': 'ADMINISTRASI KANWIL-SENTRA BISNIS UMKM & SME - P000209',
        'Standarisasi Upah': 120
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Master Posisi');
    XLSX.writeFile(wb, 'Template_Master_Posisi.xlsx');
    showSnackbar('Template Master Posisi berhasil diunduh!', 'info');
  };

  // Handle Upload Excel
  const handleProcessUpload = () => {
    if (!uploadFile) {
      showSnackbar('Pilih file Excel / CSV terlebih dahulu!', 'warning');
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
          jenisPekerjaan: (row['Jenis Pekerjaan'] || row['jenisPekerjaan'] || '').toString().toUpperCase().trim(),
          posisiPekerjaan: (row['Posisi Pekerjaan'] || row['posisiPekerjaan'] || '').toString().toUpperCase().trim(),
          posisiClient: (row['Posisi Client'] || row['posisiClient'] || '').toString().toUpperCase().trim(),
          standarisasiUpah: row['Standarisasi Upah'] ? `${row['Standarisasi Upah']}%` : '100%'
        }));

        setDataList((prev) => [...newParsedData, ...prev]);
        showSnackbar(`Berhasil mengunggah & memproses ${newParsedData.length} data Master Posisi!`, 'success');
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
      render: (row, idx) => (page - 1) * pageSize + idx + 1
    },
    {
      id: 'jenisPekerjaan',
      label: 'Jenis Pekerjaan',
      render: (row) => (
        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.primary' }}>
          {row.jenisPekerjaan || '-'}
        </Typography>
      )
    },
    {
      id: 'posisiPekerjaan',
      label: 'Posisi Pekerjaan',
      render: (row) => (
        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
          {row.posisiPekerjaan || '-'}
        </Typography>
      )
    },
    {
      id: 'posisiClient',
      label: 'Posisi Client',
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'text.primary' }}>
          {row.posisiClient || '-'}
        </Typography>
      )
    },
    {
      id: 'standarisasiUpah',
      label: 'Standarisasi Upah',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.standarisasiUpah || '-'}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.75rem',
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
            <BadgeIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Master Posisi
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
              Standarisasi jabatan, posisi pekerjaan, dan persentase upah tenaga kerja
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
            UPLOAD MASTER POSISI
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
          {/* Row 1: Search & Filter Dropdowns */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 2fr 2fr auto auto' }, gap: 1.5, alignItems: 'center' }}>
            <TextField
              placeholder="Search jenis pekerjaan, posisi, posisi client..."
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
              placeholder="(Posisi)"
              value={filterPosisi}
              options={uniquePosisiOptions}
              onChange={(val) => {
                setFilterPosisi(val || '');
                setPage(1);
              }}
            />

            <SearchableSelect
              placeholder="(Unit Kerja)"
              value={filterUnitKerja}
              options={uniqueUnitKerjaOptions}
              onChange={(val) => {
                setFilterUnitKerja(val || '');
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
                onClick={handleResetFilters}
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
        title="ADD Master Posisi"
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
              Jenis Pekerjaan *
            </Typography>
            <TextField
              placeholder="Contoh: ADMINISTRASI"
              size="small"
              fullWidth
              value={formData.jenisPekerjaan}
              onChange={(e) => setFormData((prev) => ({ ...prev, jenisPekerjaan: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Posisi Pekerjaan
            </Typography>
            <TextField
              placeholder="Contoh: STAFF ADMINISTRASI"
              size="small"
              fullWidth
              value={formData.posisiPekerjaan}
              onChange={(e) => setFormData((prev) => ({ ...prev, posisiPekerjaan: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Posisi Client *
            </Typography>
            <TextField
              placeholder="Contoh: ADMINISTRASI KANWIL-HUKUM - P000054"
              size="small"
              fullWidth
              value={formData.posisiClient}
              onChange={(e) => setFormData((prev) => ({ ...prev, posisiClient: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Standarisasi Upah *
            </Typography>
            <TextField
              placeholder="Contoh: 110 (untuk 110%)"
              size="small"
              fullWidth
              type="number"
              value={formData.standarisasiUpah}
              onChange={(e) => setFormData((prev) => ({ ...prev, standarisasiUpah: e.target.value }))}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }
              }}
            />
          </Box>
        </Stack>
      </CustomModal>

      {/* EDIT MODAL */}
      <CustomModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        title="EDIT Master Posisi"
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
              Jenis Pekerjaan *
            </Typography>
            <TextField
              placeholder="Contoh: ADMINISTRASI"
              size="small"
              fullWidth
              value={formData.jenisPekerjaan}
              onChange={(e) => setFormData((prev) => ({ ...prev, jenisPekerjaan: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Posisi Pekerjaan
            </Typography>
            <TextField
              placeholder="Contoh: STAFF ADMINISTRASI"
              size="small"
              fullWidth
              value={formData.posisiPekerjaan}
              onChange={(e) => setFormData((prev) => ({ ...prev, posisiPekerjaan: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Posisi Client *
            </Typography>
            <TextField
              placeholder="Contoh: ADMINISTRASI KANWIL-HUKUM - P000054"
              size="small"
              fullWidth
              value={formData.posisiClient}
              onChange={(e) => setFormData((prev) => ({ ...prev, posisiClient: e.target.value }))}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Standarisasi Upah *
            </Typography>
            <TextField
              placeholder="Contoh: 110 (untuk 110%)"
              size="small"
              fullWidth
              type="number"
              value={formData.standarisasiUpah}
              onChange={(e) => setFormData((prev) => ({ ...prev, standarisasiUpah: e.target.value }))}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }
              }}
            />
          </Box>
        </Stack>
      </CustomModal>

      {/* UPLOAD MODAL */}
      <CustomModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        title="UPLOAD MASTER POSISI"
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
            Nilai pada kolom <strong>Standarisasi Upah</strong> harus diinput dalam bentuk angka murni (contoh: <strong>110</strong> untuk 110%), tanpa menggunakan format desimal atau simbol persen.
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
              onClick={() => document.getElementById('posisi-file-input').click()}
            >
              <input
                id="posisi-file-input"
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

export default MasterPosisi;
