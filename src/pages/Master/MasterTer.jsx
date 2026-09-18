import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Grid, IconButton, Chip, Alert, Tooltip
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  InfoOutlined as InfoIcon,
  CheckCircle as CheckCircleIcon,
  DateRange as DateRangeIcon,
  Category as CategoryIcon,
  TableChart as TableChartIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8080';

const MasterTer = () => {
  const { user } = useSelector((state) => state.auth);

  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [terData, setTerData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown: init kosong, diisi dari API
  const [years, setYears] = useState([]);

  // Modal States
  const [openUpload, setOpenUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadYear, setUploadYear] = useState('');
  const [uploadYears, setUploadYears] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // Fetch dropdown years dari DB
  const fetchDropdowns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-ter/dropdowns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedYears = response.data.years || [];

      const currentYear = new Date().getFullYear().toString();
      if (!fetchedYears.includes(currentYear)) {
        fetchedYears.unshift(currentYear);
      }

      setYears(fetchedYears);
    } catch (err) {
      console.error('Error fetching TER dropdowns:', err);
      setYears([new Date().getFullYear().toString()]);
    }
  };

  // Fetch upload dropdown years
  const fetchUploadYears = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-ter/upload-years`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedYears = response.data.years || [];
      setUploadYears(fetchedYears);
      const currentYear = new Date().getFullYear().toString();
      if (fetchedYears.includes(currentYear)) setUploadYear(currentYear);
      else if (fetchedYears.length > 0) setUploadYear(fetchedYears[0]);
    } catch (err) {
      console.error('Error fetching upload years:', err);
    }
  };

  const fetchTerData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (year) params.append('year', year);
      params.append('page', page - 1);
      params.append('size', pageSize);

      const response = await axios.get(`${API_URL}/api/master-ter/list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTerData(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching TER data:', err);
      showSnackbar('Gagal mengambil data TER', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (year) setPage(1);
  }, [year]);

  useEffect(() => {
    if (year) fetchTerData();
  }, [year, page, pageSize]);

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-ter/template`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Template_TER.xls');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showSnackbar('Template berhasil di-download', 'success');
    } catch (err) {
      console.error('Error downloading template:', err);
      showSnackbar('Gagal download template', 'error');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadYear) return;
    setUploadLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('year', uploadYear);

      const response = await axios.post(`${API_URL}/api/master-ter/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        showSnackbar(response.data.message || 'Upload berhasil', 'success');
        setOpenUpload(false);
        setUploadFile(null);
        setUploadYear('');
        fetchTerData();
      } else {
        showSnackbar(response.data.message || 'Upload gagal', 'error');
      }
    } catch (err) {
      console.error('Error uploading TER:', err);
      showSnackbar('Upload gagal. Terjadi kesalahan server.', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleUpdateStatusTahunActive = async () => {
    if (!year) {
      showSnackbar('Pilih tahun terlebih dahulu', 'warning');
      return;
    }
    setUpdateLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/master-ter/update-status?year=${year}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        showSnackbar(response.data.message || 'Status tahun berhasil diperbarui', 'success');
        fetchTerData();
      } else {
        showSnackbar(response.data.message || 'Gagal update status', 'error');
      }
    } catch (err) {
      console.error('Error update status:', err);
      showSnackbar('Gagal update status tahun aktif', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatNominal = (value) => {
    if (!value && value !== 0) return '-';
    const number = String(value).replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const columns = [
    { 
      id: 'Ter', 
      label: 'Kategori TER',
      render: (row) => (
        <Chip 
          label={`TER ${row.Ter}`} 
          size="small" 
          sx={{ 
            fontWeight: 800, 
            bgcolor: row.Ter === 'A' ? '#eff6ff' : row.Ter === 'B' ? '#ecfdf5' : '#f5f3ff', 
            color: row.Ter === 'A' ? '#1d4ed8' : row.Ter === 'B' ? '#059669' : '#7c3aed',
            borderRadius: '6px' 
          }} 
        />
      )
    },
    { 
      id: 'NilaiMin', 
      label: 'Penghasilan Bruto Min',
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8125rem' }}>
          Rp {formatNominal(row.NilaiMin)}
        </Typography>
      )
    },
    { 
      id: 'NilaiMax', 
      label: 'Penghasilan Bruto Max',
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8125rem' }}>
          {row.NilaiMax === '999999999999' || row.NilaiMax === 999999999999 ? 'Diatas Nilai Min' : `Rp ${formatNominal(row.NilaiMax)}`}
        </Typography>
      )
    },
    { 
      id: 'Persen', 
      label: 'Tarif Efektif (%)',
      render: (row) => (
        <Typography sx={{ fontWeight: 700, color: '#10b981' }}>
          {row.Persen ? (String(row.Persen).includes('%') ? row.Persen : `${row.Persen}%`) : '0%'}
        </Typography>
      )
    },
    { 
      id: 'Tahun', 
      label: 'Tahun Pajak',
      render: (row) => (
        <Chip label={row.Tahun} size="small" sx={{ fontWeight: 700, bgcolor: 'action.hover', borderRadius: '6px' }} />
      )
    },
    { 
      id: 'Status', 
      label: 'Status Aktif', 
      render: (row) => {
        const isInactive = row.Status === 'TIDAK ACTIVE';
        return (
          <Chip 
            label={row.Status || 'ACTIVE'} 
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: '0.75rem',
              bgcolor: isInactive ? '#fef2f2' : '#ecfdf5',
              color: isInactive ? '#dc2626' : '#059669',
              borderRadius: '6px'
            }}
          />
        );
      }
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{
          width: 52,
          height: 52,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 16px -4px rgba(2, 132, 199, 0.4)'
        }}>
          <CalculateIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Master TER (Tarif Efektif Rata-Rata)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Kelola tabel tarif TER PPh 21 Kategori A, B, dan C berdasarkan PP 58/2023 & PMK 168/2023
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <DateRangeIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Tahun Pajak Terpilih</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{year || '2026'}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <TableChartIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Baris Tarif TER</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{totalElements} Baris</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <CategoryIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Kategori TER</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>A / B / C</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <CheckCircleIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Regulasi</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>PP 58 / 2023</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <SearchableSelect
              label="Tahun Pajak"
              options={years.map(y => ({ value: y, label: `Tahun ${y}` }))}
              value={year}
              onChange={(val) => setYear(val)}
              placeholder="Pilih Tahun"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => { setPage(1); fetchTerData(); }}
              sx={{
                bgcolor: '#1e293b',
                '&:hover': { bgcolor: '#0f172a' },
                borderRadius: '10px',
                height: '40px',
                fontWeight: 700,
                boxShadow: 'none'
              }}
            >
              FILTER TAHUN
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Toolbar Directly Above Table */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: '14px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }} elevation={0}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Tabel Tarif Efektif Rata-Rata ({year})
          </Typography>
          <Chip label={`${totalElements} Data`} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 700, borderRadius: '6px' }} />
        </Stack>

        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Button 
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadTemplate}
            sx={{
              borderRadius: '10px',
              fontWeight: 700,
              color: 'text.primary',
              borderColor: 'divider',
              '&:hover': { borderColor: 'text.primary' },
              height: '40px'
            }}
          >
            TEMPLATE EXCEL
          </Button>

          <Button 
            variant="contained" 
            startIcon={<CloudUploadIcon />}
            onClick={() => { setOpenUpload(true); fetchUploadYears(); }}
            sx={{ 
              borderRadius: '10px', 
              fontWeight: 700, 
              bgcolor: '#3b82f6', 
              '&:hover': { bgcolor: '#2563eb' },
              boxShadow: 'none',
              height: '40px'
            }}
          >
            UPLOAD DATA
          </Button>
          
          <Button 
            variant="contained" 
            onClick={handleUpdateStatusTahunActive}
            disabled={updateLoading}
            sx={{ 
              borderRadius: '10px', 
              fontWeight: 700, 
              bgcolor: '#10b981', 
              '&:hover': { bgcolor: '#059669' },
              boxShadow: 'none',
              height: '40px'
            }}
          >
            {updateLoading ? 'MEMPROSES...' : `SET TAHUN ${year} AKTIF`}
          </Button>
        </Stack>
      </Paper>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={terData}
        page={page}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={loading}
      />

      {/* Modal Upload Master TER */}
      <CustomModal open={openUpload} onClose={() => setOpenUpload(false)} title="Upload Master TER (Excel)" maxWidth="sm">
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'action.hover', borderRadius: '12px', border: '1px dashed', borderColor: 'divider' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>Format Template TER</Typography>
              <Typography variant="caption" color="text.secondary">Gunakan format excel standar sebelum mengunggah berkas.</Typography>
            </Box>
            <Button 
              variant="outlined" 
              startIcon={<DownloadIcon />} 
              onClick={handleDownloadTemplate}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, borderColor: '#3b82f6', color: '#3b82f6' }}
            >
              Download Template
            </Button>
          </Box>

          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: '12px', bgcolor: 'background.paper' }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>Target Tahun Pajak</Typography>
                <SearchableSelect
                  options={uploadYears.map(y => ({ value: y, label: `Tahun ${y}` }))}
                  value={uploadYear}
                  onChange={(val) => setUploadYear(val)}
                  placeholder="Pilih Tahun Upload"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>File Excel (.xls / .xlsx)</Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <TextField 
                    type="file" 
                    size="small" 
                    fullWidth
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    inputProps={{ accept: ".xls,.xlsx" }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} 
                  />
                  <Button 
                    variant="contained" 
                    startIcon={<CloudUploadIcon />}
                    onClick={handleUpload}
                    sx={{ px: 3, borderRadius: '8px', fontWeight: 700, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, boxShadow: 'none' }}
                    disabled={!uploadFile || !uploadYear || uploadLoading}
                  >
                    {uploadLoading ? 'Mengunggah...' : 'Upload'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Alert 
            icon={<InfoIcon fontSize="inherit" />} 
            severity="info" 
            sx={{ borderRadius: '12px', '& .MuiAlert-message': { width: '100%' } }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Kriteria Penginputan Data:</Typography>
            <Typography variant="body2">
              Pastikan kolom <strong>Ter (A/B/C)</strong>, <strong>NilaiMin</strong>, <strong>NilaiMax</strong>, dan <strong>Persen</strong> terisi lengkap tanpa format simbol mata uang pada file Excel.
            </Typography>
          </Alert>
        </Stack>
      </CustomModal>

      {/* Snackbar */}
      <CustomSnackbar 
        open={snackbar.open} 
        message={snackbar.message} 
        severity={snackbar.severity} 
        onClose={handleCloseSnackbar} 
      />
    </Box>
  );
};

export default MasterTer;
