import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Grid, IconButton, Dialog, DialogTitle, DialogContent, Alert, CircularProgress, Tooltip, InputAdornment
} from '@mui/material';
import {
  History as HistoryIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Remove as RemoveIcon,
  CalendarMonth as LiburIcon,
  EventBusy as EventBusyIcon,
  EventAvailable as EventAvailableIcon,
  Today as TodayIcon,
  Search as SearchIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const MasterLibur = () => {
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [liburData, setLiburData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown States
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
    { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
    { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  // Modal States
  const [openHistory, setOpenHistory] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, payload: null, title: '', message: '' });

  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyTotalElements, setHistoryTotalElements] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-holiday/history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: historyPage, size: historyPageSize }
      });
      setHistoryData(response.data.content || response.data.data || []);
      setHistoryTotalPages(response.data.totalPages || 1);
      setHistoryTotalElements(response.data.totalElements || response.data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching history:", error);
      showSnackbar("Gagal memuat history", "error");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (openHistory) {
      fetchHistory();
    }
  }, [openHistory, historyPage, historyPageSize]);

  const [formData, setFormData] = useState({
    tanggal: '',
    keterangan: ''
  });

  const [uploadFile, setUploadFile] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Progress states
  const [isUploadingInBackground, setIsUploadingInBackground] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [backgroundProcessName, setBackgroundProcessName] = useState('');
  const [isProgressMinimized, setIsProgressMinimized] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({ tanggal: false, keterangan: false });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // Dummy Data for Preview (To be replaced with actual API call)
  useEffect(() => {
    fetchLiburData();
  }, [page, pageSize, year, month]);

  const fetchLiburData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-holiday`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: year || undefined,
          month: month || undefined,
          keyword: search || undefined,
          page: page,
          size: pageSize
        }
      });
      setLiburData(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalItems);
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Gagal memuat data libur", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdd = async () => {
    let newErrors = { tanggal: false, keterangan: false };
    let hasError = false;

    if (!formData.tanggal) { newErrors.tanggal = true; hasError = true; }
    if (!formData.keterangan.trim()) { newErrors.keterangan = true; hasError = true; }

    setErrors(newErrors);
    if (hasError) {
      showSnackbar("Please fill all required fields", 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/master-holiday`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          fullname: user?.username || 'Staff HRD'
        }
      });
      showSnackbar("Data Libur added successfully");
      setOpenAdd(false);
      setFormData({ tanggal: '', keterangan: '' });
      fetchLiburData();
    } catch (error) {
      console.error(error);
      showSnackbar("Gagal menambah data", 'error');
    }
  };

  const handleSaveEdit = async () => {
    let newErrors = { tanggal: false, keterangan: false };
    let hasError = false;

    if (!formData.tanggal) { newErrors.tanggal = true; hasError = true; }
    if (!formData.keterangan.trim()) { newErrors.keterangan = true; hasError = true; }

    setErrors(newErrors);
    if (hasError) {
      showSnackbar("Please fill all required fields", 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/master-holiday/${selectedRow.id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          fullname: user?.username || 'Staff HRD'
        }
      });
      showSnackbar("Data Libur updated successfully");
      setOpenEdit(false);
      fetchLiburData();
    } catch (error) {
      console.error(error);
      showSnackbar("Gagal update data", 'error');
    }
  };

  const handleDelete = (row) => {
    setConfirmDialog({
      open: true,
      action: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${API_URL}/api/master-holiday/${row.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          showSnackbar("Data deleted successfully");
          fetchLiburData();
        } catch (error) {
          console.error(error);
          showSnackbar("Gagal menghapus data", 'error');
        }
      },
      title: "Delete Data Libur",
      message: `Are you sure you want to delete ${row.keterangan}?`
    });
  };

  const handleDownloadTemplate = () => {
    setIsDownloading(true);
    import('xlsx').then(XLSX => {
      const ws = XLSX.utils.json_to_sheet([{ Tanggal: '', Keterangan: '' }]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.writeFile(wb, "Template_Master_Libur.xlsx");
      setIsDownloading(false);
    }).catch(() => {
      setIsDownloading(false);
      showSnackbar("Gagal mendownload template", "error");
    });
  };

  const handleProcessUpload = async () => {
    if (!uploadFile) return;
    
    setSelectedFileName(uploadFile.name);
    setBackgroundProcessName('Proses Upload Data...');
    setIsUploadingInBackground(true);
    setUploadProgress(0);
    setIsProgressMinimized(false);
    
    const fileToUpload = uploadFile;
    setUploadFile(null);
    setOpenUpload(false);
    showSnackbar('File sedang diproses di background...', 'info');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const response = await axios.post(`${API_URL}/api/master-holiday/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted === 100 ? 99 : percentCompleted);
          }
        }
      });

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploadingInBackground(false);
        if (response.data && response.data.success) {
          showSnackbar(response.data.message || 'Proses upload data master libur berhasil!', 'success');
        } else {
          showSnackbar(response.data?.message || 'Gagal memproses file', 'error');
        }
        fetchLiburData(); // refresh data
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploadingInBackground(false);
        showSnackbar(error.response?.data?.error || error.response?.data?.message || 'Gagal memproses upload', 'error');
      }, 1000);
    }
  };

  const executeAction = async () => {
    const { action } = confirmDialog;
    setConfirmDialog({ ...confirmDialog, open: false });
    
    if (typeof action === 'function') {
      await action();
    }
  };

  const columns = [
    {
      id: 'no',
      label: 'No',
      align: 'center',
      render: (row, index) => ((page - 1) * pageSize) + index + 1
    },
    {
      id: 'tanggal',
      label: 'Tanggal Libur',
      render: (row) => {
        if (!row.tanggal) return '-';
        const d = new Date(row.tanggal);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const formatted = d.toLocaleDateString('id-ID', options);
        return (
          <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary' }}>
            {formatted}
          </Typography>
        );
      }
    },
    {
      id: 'keterangan',
      label: 'Keterangan',
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: 'text.primary' }}>
          {row.keterangan || '-'}
        </Typography>
      )
    },
    {
      id: 'createdDate',
      label: 'Created Date',
      render: (row) => (
        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
          {row.createdDate || '-'}
        </Typography>
      )
    },
    {
      id: 'createdBy',
      label: 'Created By',
      render: (row) => (
        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
          {row.createdBy || '-'}
        </Typography>
      )
    },
    {
      id: 'modifyDate',
      label: 'Modify Date',
      render: (row) => (
        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
          {row.modifyDate || '-'}
        </Typography>
      )
    },
    {
      id: 'modifyBy',
      label: 'Modify By',
      render: (row) => (
        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
          {row.modifyBy || '-'}
        </Typography>
      )
    },
    {
      id: 'action',
      label: 'Aksi',
      align: 'center',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'center' }}>
          <Tooltip title="Edit Data Libur" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRow(row);
                setFormData({ tanggal: row.tanggal, keterangan: row.keterangan });
                setErrors({ tanggal: false, keterangan: false });
                setOpenEdit(true);
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
          <Tooltip title="Hapus Data Libur" arrow>
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
            <LiburIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Master Libur
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
              Kelola data master hari libur nasional, cuti bersama, dan kalender operasional kerja
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons Header */}
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => {
              setHistoryPage(1);
              fetchHistory();
              setOpenHistory(true);
            }}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2,
              py: 0.85,
              borderColor: 'primary.main',
              color: 'primary.main',
              fontSize: '0.82rem',
              '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.06)' }
            }}
          >
            LOG HISTORY
          </Button>

          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => {
              setUploadFile(null);
              setOpenUpload(true);
            }}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2,
              py: 0.85,
              borderColor: 'primary.main',
              color: 'primary.main',
              fontSize: '0.82rem',
              '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.06)' }
            }}
          >
            UPLOAD MASTER LIBUR
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setFormData({ tanggal: '', keterangan: '' });
              setErrors({ tanggal: false, keterangan: false });
              setOpenAdd(true);
            }}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              py: 0.95,
              bgcolor: 'primary.main',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
              fontSize: '0.82rem',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            ADD +
          </Button>
        </Box>
      </Box>

      {/* FILTER & SEARCH PANEL */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr auto auto' }, gap: 1.5, alignItems: 'center' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Cari Keterangan Libur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPage(1);
                fetchLiburData();
              }
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
            placeholder="(Tahun)"
            value={year}
            onChange={(val) => setYear(val || '')}
            options={years}
          />
          <SearchableSelect
            placeholder="(Bulan)"
            value={month}
            onChange={(val) => setMonth(val || '')}
            options={months}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={() => { setPage(1); fetchLiburData(); }}
            sx={{
              bgcolor: '#1e293b',
              color: 'white',
              '&:hover': { bgcolor: '#0f172a' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              height: '40px'
            }}
          >
            SEARCH
          </Button>
          <Button
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={() => {
              setSearch('');
              setYear(new Date().getFullYear().toString());
              setMonth('');
              setPage(1);
            }}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              height: '40px',
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' }
            }}
          >
            Reset
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <DataTable
          columns={columns}
          data={liburData}
          loading={loading}
          page={page}
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </Paper>

      {/* Add Modal */}
      <CustomModal open={openAdd} onClose={() => setOpenAdd(false)} title="Add Libur" maxWidth="sm">
        <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>Tanggal</Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                error={errors.tanggal}
                helperText={errors.tanggal ? "Tanggal is required" : ""}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>Keterangan</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                error={errors.keterangan}
                helperText={errors.keterangan ? "Keterangan is required" : ""}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
          </Stack>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenAdd(false)} sx={{ borderRadius: 2, color: '#64748b', borderColor: '#cbd5e1', fontWeight: 700 }}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveAdd} sx={{ borderRadius: 2, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, fontWeight: 700 }}>SAVE</Button>
          </Box>
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal open={openEdit} onClose={() => setOpenEdit(false)} title="Edit Libur" maxWidth="sm">
        <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>Tanggal</Typography>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                error={errors.tanggal}
                helperText={errors.tanggal ? "Tanggal is required" : ""}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>Keterangan</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.keterangan}
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                error={errors.keterangan}
                helperText={errors.keterangan ? "Keterangan is required" : ""}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
          </Stack>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenEdit(false)} sx={{ borderRadius: 2, color: '#64748b', borderColor: '#cbd5e1', fontWeight: 700 }}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveEdit} sx={{ borderRadius: 2, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, fontWeight: 700 }}>UPDATE</Button>
          </Box>
      </CustomModal>

      {/* Upload Modal */}
      <CustomModal open={openUpload} onClose={() => setOpenUpload(false)} title="Upload Master Libur" maxWidth="sm">
        <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>File</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="outlined" component="label" sx={{ borderRadius: 2, textTransform: 'none', color: '#10b981', borderColor: '#10b981' }}>
                  Choose File
                  <input type="file" hidden accept=".xlsx,.xls,.csv" onChange={(e) => setUploadFile(e.target.files[0])} />
                </Button>
                <Typography variant="body2" color="text.secondary">
                  {uploadFile ? uploadFile.name : 'No file chosen'}
                </Typography>
              </Stack>
            </Box>
            
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Kriteria penginputan data :</Typography>
              <Typography variant="body2">1. Untuk tanggal di isi dengan format "dd/mm/yyyy" seperti "01/01/2001"</Typography>
              <Typography variant="body2">2. Keterangan di isi dengan "Nama Hari" contoh "Senin"</Typography>
              <Typography variant="body2">3. Untuk hari libur nasional keterangan di isi dengan format "Nama Hari;Keterangan", Contoh "Senin;Tahun Baru"</Typography>
            </Alert>
          </Stack>
          <Box sx={{ mt: 4, display: 'flex', width: '100%' }}>
            <Button variant="outlined" startIcon={isDownloading ? <CircularProgress size={20} /> : <DownloadIcon />} disabled={isDownloading} onClick={handleDownloadTemplate} sx={{ borderRadius: 2, mr: 'auto', color: '#10b981', borderColor: '#10b981', fontWeight: 600 }}>
              Download Template
            </Button>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => { setOpenUpload(false); setUploadFile(null); }} sx={{ borderRadius: 2, color: '#64748b', borderColor: '#cbd5e1', fontWeight: 700 }}>Cancel</Button>
              <Button variant="contained" disabled={!uploadFile} onClick={handleProcessUpload} sx={{ borderRadius: 2, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, fontWeight: 700, textTransform: 'none' }}>Process</Button>
            </Stack>
          </Box>
      </CustomModal>

      {/* History Modal */}
      <CustomModal open={openHistory} onClose={() => setOpenHistory(false)} title="Log History" maxWidth="md">
        <DataTable
            columns={[
              { id: 'no', label: 'No', render: (row, i) => ((historyPage - 1) * historyPageSize) + i + 1 },
              { id: 'status', label: 'Status', render: (row) => row.status || '' },
              { id: 'bulanLibur', label: 'Tanggal', render: (row) => {
                if (!row.bulanLibur) return '';
                const parts = row.bulanLibur.split('-');
                if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                return row.bulanLibur;
              }},
              { id: 'hari', label: 'Keterangan', render: (row) => row.hari || '' },
              { id: 'createdBy', label: 'Created By' },
              { id: 'createdDate', label: 'Created Date', render: (row) => row.createdDate ? new Date(row.createdDate).toLocaleString('id-ID') : '' }
            ]}
            data={historyData}
            loading={historyLoading}
            page={historyPage}
            pageSize={historyPageSize}
            totalElements={historyTotalElements}
            totalPages={historyTotalPages}
            onPageChange={setHistoryPage}
            onPageSizeChange={(size) => {
              setHistoryPageSize(size);
              setHistoryPage(1);
            }}
          />
      </CustomModal>

      <CustomConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={executeAction}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
      <CustomSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} />

      {/* Floating Progress Bar Service */}
      {isUploadingInBackground && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            width: isProgressMinimized ? 'auto' : 320,
            bgcolor: 'white',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: '1px solid #cbd5e1',
            borderRadius: 3,
            p: isProgressMinimized ? 1.5 : 2,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          {isProgressMinimized ? (
            <Tooltip title="Click to expand process details" placement="left">
              <Box
                onClick={() => setIsProgressMinimized(false)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.9 }
                }}
              >
                <CircularProgress variant="determinate" value={uploadProgress} size={20} sx={{ color: '#3b82f6' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {backgroundProcessName} {uploadProgress}%
                </Typography>
              </Box>
            </Tooltip>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {backgroundProcessName}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => setIsProgressMinimized(true)} sx={{ color: '#64748b' }}>
                    <RemoveIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => setIsUploadingInBackground(false)} sx={{ color: '#ef4444' }}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  File: {selectedFileName}
                </Typography>
                <Box sx={{ width: '100%', bgcolor: '#e2e8f0', borderRadius: 1.5, height: 6, overflow: 'hidden', position: 'relative' }}>
                  <Box
                    sx={{
                      width: `${uploadProgress}%`,
                      bgcolor: '#3b82f6',
                      height: '100%',
                      borderRadius: 1.5,
                      transition: 'width 0.4s ease'
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 700, display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {uploadProgress === 100 ? 'Completed' : 'Processing...'} {uploadProgress}%
                </Typography>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MasterLibur;
