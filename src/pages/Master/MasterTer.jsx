import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select, FormControl,
  Stack, Grid, IconButton, Dialog, DialogTitle, DialogContent, Alert
} from '@mui/material';
import {
  History as HistoryIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
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

  // Fetch dropdown years dari DB — HANYA isi list, tidak override selected year
  const fetchDropdowns = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-ter/dropdowns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedYears = response.data.years || [];

      // Pastikan tahun sekarang SELALU ada di list meski tidak ada di DB
      const currentYear = new Date().getFullYear().toString();
      if (!fetchedYears.includes(currentYear)) {
        fetchedYears.unshift(currentYear);
      }

      setYears(fetchedYears);
    } catch (err) {
      console.error('Error fetching TER dropdowns:', err);
      // Fallback: minimal tampilkan tahun sekarang
      setYears([new Date().getFullYear().toString()]);
    }
  };

  // Fetch upload dropdown years (NOW s/d +5 tahun)
  const fetchUploadYears = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-ter/upload-years`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedYears = response.data.years || [];
      setUploadYears(fetchedYears);
      // Default ke tahun sekarang
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

      setTerData(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      console.error('Error fetching TER data:', err);
      showSnackbar('Gagal mengambil data TER', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dropdown sekali saat mount
  useEffect(() => {
    fetchDropdowns();
  }, []);

  // Reset ke page 1 saat year berubah (filter baru)
  useEffect(() => {
    if (year) setPage(1);
  }, [year]);

  // Fetch data saat page/pageSize berubah (juga dipicu oleh reset page di atas)
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
        showSnackbar(response.data.message, 'success');
        setOpenUpload(false);
        setUploadFile(null);
        setUploadYear('');
        fetchTerData(); // refresh tabel
      } else {
        showSnackbar(response.data.message, 'error');
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
        showSnackbar(response.data.message, 'success');
        fetchTerData(); // Refresh tabel
      } else {
        showSnackbar(response.data.message, 'error');
      }
    } catch (err) {
      console.error('Error update status:', err);
      showSnackbar('Gagal update status tahun aktif', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  const columns = [
    { id: 'Ter', label: 'Ter' },
    { id: 'NilaiMin', label: 'Nilai Min' },
    { id: 'NilaiMax', label: 'Nilai Max' },
    { id: 'Persen', label: 'Persen' },
    { id: 'Tahun', label: 'Tahun' },
    { 
      id: 'Status', 
      label: 'Status', 
      render: (row) => {
        const isInactive = row.Status === 'TIDAK ACTIVE';
        return (
          <Button 
            disabled
            sx={{ 
              borderRadius: '20px', 
              background: isInactive ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '2px 12px', 
              fontWeight: 800, 
              fontSize: '10px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textTransform: 'uppercase',
              '&.Mui-disabled': { color: 'white', background: isInactive ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }
            }}
          >
            {row.Status}
          </Button>
        );
      }
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Master TER</Typography>
        <Typography variant="body2" color="text.secondary">Kelola data Tarif Efektif Rata-rata (TER) PPh 21</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 4, bgcolor: '#f1f5f9' }} elevation={0}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1 }}>
            <Select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined" 
            onClick={() => { setOpenUpload(true); fetchUploadYears(); }}
            sx={{ borderRadius: '8px', fontWeight: 800, color: '#3b82f6', borderColor: '#3b82f6', height: '40px' }}
          >
            UPLOAD DATA
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleUpdateStatusTahunActive}
            disabled={updateLoading}
            sx={{ borderRadius: '8px', fontWeight: 800, color: '#3b82f6', borderColor: '#3b82f6', height: '40px' }}
          >
            {updateLoading ? 'Updating...' : 'Update Status Tahun Active'}
          </Button>

          <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600, fontStyle: 'italic' }}>
            * Pilih Tahun yang akan Di Update
          </Typography>
        </Stack>
      </Paper>

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
      <CustomModal open={openUpload} onClose={() => setOpenUpload(false)} title="Upload Master TER" maxWidth="sm">
          <Stack spacing={3} sx={{ mt: 1 }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>Format Template</Typography>
                <Typography variant="caption" color="text.secondary">Gunakan format excel yang sesuai sebelum upload.</Typography>
              </Box>
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />} 
                onClick={handleDownloadTemplate}
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, borderColor: '#3b82f6', color: '#3b82f6' }}
              >
                Download Template
              </Button>
            </Box>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>Tahun TER</Typography>
                  <FormControl fullWidth size="small">
                    <Select 
                      displayEmpty 
                      value={uploadYear} 
                      onChange={(e) => setUploadYear(e.target.value)}
                      sx={{ bgcolor: 'white', borderRadius: 1 }}
                    >
                      <MenuItem value="" disabled>(Pilih Tahun)</MenuItem>
                      {uploadYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>File Data TER (.xls / .xlsx)</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField 
                      type="file" 
                      size="small" 
                      fullWidth
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      inputProps={{ accept: ".xls,.xlsx" }}
                      sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 1 } }} 
                    />
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      onClick={handleUpload}
                      sx={{ px: 3, borderRadius: 1, fontWeight: 600, boxShadow: 'none' }}
                      disabled={!uploadFile || !uploadYear || uploadLoading}
                    >
                      {uploadLoading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Alert 
              icon={<InfoIcon fontSize="inherit" />} 
              severity="info" 
              sx={{ borderRadius: 2, '& .MuiAlert-message': { width: '100%' } }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Kriteria Penginputan Data:</Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Box component="span" sx={{ width: 4, height: 4, bgcolor: 'info.main', borderRadius: '50%', mr: 1 }} />
                Kolom yang wajib diisi: <strong style={{ margin: '0 4px' }}>Semua Field Wajib Isi</strong>
              </Typography>
            </Alert>
          </Stack>
      </CustomModal>

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
