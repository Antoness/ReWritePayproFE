import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select, FormControl,
  Stack, Grid, IconButton, Chip, Dialog, DialogTitle, DialogContent, Alert
} from '@mui/material';
import {
  History as HistoryIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  PlayArrow as PlayArrowIcon,
  InfoOutlined as InfoIcon,
  AccountBalance as AccountBalanceIcon,
  Search as SearchIcon,
  LocationCity as LocationCityIcon,
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8080';

const MasterUmk = () => {
  const { user } = useSelector((state) => state.auth);
  const userPos = user?.position?.toUpperCase()?.trim() || '';
  const isSpv = userPos === 'SPV' || userPos === 'SUPERVISOR';

  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [status, setStatus] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [umkData, setUmkData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown States
  const [dropdowns, setDropdowns] = useState({
    branches: [],
    statuses: [],
    years: []
  });

  // Modal States
  const [openHistory, setOpenHistory] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [nominalRequest, setNominalRequest] = useState('');
  
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, payload: null, title: '', message: '' });

  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalElements, setHistoryTotalElements] = useState(0);

  const [addForm, setAddForm] = useState({
    branch: '',
    nominal: '',
    tahun: new Date().getFullYear().toString()
  });

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadYear, setUploadYear] = useState('');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({ branch: false, nominal: false, nominalRequest: false });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const formatNominal = (value) => {
    if (!value) return '';
    const number = value.replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  // Mock data UMK
  const data = [
    { id: 1, branch: 'JAKARTA', tahun: '2026', nominal: '5,067,381', status: 'ACTIVE' },
    { id: 2, branch: 'BEKASI', tahun: '2026', nominal: '5,343,430', status: 'ACTIVE' },
    { id: 3, branch: 'TANGERANG', tahun: '2026', nominal: '4,510,487', status: 'INACTIVE' },
  ];

  // Fetch UMK Data
  const fetchUmkData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (branch) params.append('branch', branch);
      if (status) params.append('status', status);
      if (year) params.append('year', year);
      params.append('page', page - 1);
      params.append('size', pageSize);

      const response = await axios.get(`${API_URL}/api/master-umk/list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUmkData(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      console.error('Error fetching UMK data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-umk/history`, {
        params: { 
          search: historySearch, 
          page: historyPage - 1, 
          size: historyPageSize 
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryData(response.data.content);
      setHistoryTotalPages(response.data.totalPages);
      setHistoryTotalElements(response.data.totalElements);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSaveAdd = () => {
    let newErrors = { branch: false, nominal: false, nominalRequest: false };
    let hasError = false;

    // 1. Validasi Branch Kosong
    if (!addForm.branch.trim()) {
      newErrors.branch = true;
      hasError = true;
      showSnackbar("[Branch] can't be empty!", 'error');
    }

    // 2. Validasi Nominal Kosong / 0
    const rawNominal = addForm.nominal.replace(/\./g, '').replace(/,/g, '');
    if (!rawNominal || parseInt(rawNominal) === 0) {
      newErrors.nominal = true;
      hasError = true;
      if (!newErrors.branch) showSnackbar("[Nominal] can't be empty!", 'error');
    }

    setErrors(newErrors);
    if (hasError) return;

    setConfirmDialog({
      open: true,
      title: 'Confirm Save',
      message: 'Are you sure you want to save this new UMK data?',
      action: 'ADD',
      payload: {
        branch: addForm.branch,
        nominal: rawNominal,
        tahun: parseInt(addForm.tahun)
      }
    });
  };

  const handleUpdate = (action) => {
    if (action === 'REQUEST' || action === 'UPDATE') {
      const valToCheck = action === 'UPDATE' ? selectedRow.Nominal : nominalRequest;
      const rawNominalReq = String(valToCheck).replace(/\./g, '').replace(/,/g, '');
      if (!rawNominalReq || parseInt(rawNominalReq) === 0) {
        setErrors(prev => ({ ...prev, nominalRequest: true }));
        showSnackbar(`${action === 'UPDATE' ? 'Nominal' : 'Nominal Request'} can't be empty!`, 'error');
        return;
      }
    }
    
    setErrors(prev => ({ ...prev, nominalRequest: false }));

    setConfirmDialog({
      open: true,
      title: `Confirm ${action}`,
      message: `Are you sure you want to ${action.toLowerCase()} this UMK data?`,
      action: action,
      payload: {
        id: selectedRow.id,
        action: action,
        branch: selectedRow.Branch,
        tahun: parseInt(selectedRow.Tahun),
        nominalRequest: action === 'UPDATE' ? String(selectedRow.Nominal).replace(/\./g, '').replace(/,/g, '') : String(nominalRequest).replace(/\./g, '').replace(/,/g, '')
      }
    });
  };

  const executeAction = async () => {
    const { action, payload } = confirmDialog;
    setConfirmDialog({ ...confirmDialog, open: false });
    
    try {
      const token = localStorage.getItem('token');
      const url = action === 'ADD' ? `${API_URL}/api/master-umk/add` : `${API_URL}/api/master-umk/update`;
      
      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showSnackbar(response.data.message, 'success');
        if (action === 'ADD') {
          setOpenAdd(false);
          setAddForm({ branch: '', nominal: '', tahun: new Date().getFullYear().toString() });
        } else {
          setOpenEdit(false);
        }
        fetchUmkData();
      } else {
        showSnackbar(response.data.message, 'error');
      }
    } catch (err) {
      console.error(`Error performing action:`, err);
      showSnackbar('Action failed. Please try again.', 'error');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-umk/template`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Template_Umk.xls');
      document.body.appendChild(link);
      link.click();
      link.remove();
      showSnackbar('Template downloaded successfully', 'success');
    } catch (err) {
      console.error('Error downloading template:', err);
      showSnackbar('Failed to download template', 'error');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadYear) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('year', uploadYear);

      const response = await axios.post(`${API_URL}/api/master-umk/upload`, formData, {
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
        fetchUmkData(); // refresh data
      } else {
        // Show validation message from backend
        showSnackbar(response.data.message, 'error');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      showSnackbar('Upload failed. Server error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch history when pagination changes
  useEffect(() => {
    if (openHistory) fetchHistory();
  }, [historyPage, historyPageSize]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/master-umk/dropdowns`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDropdowns(response.data);
        
        const currentYear = new Date().getFullYear().toString();
        if (response.data.years && !response.data.years.includes(currentYear)) {
          setDropdowns(prev => ({...prev, years: [currentYear, ...prev.years]}));
        }
      } catch (err) {
        console.error('Error fetching dropdowns:', err);
      }
    };
    fetchDropdowns();
  }, []);

  // Reset ke page 1 saat filter berubah
  useEffect(() => {
    setPage(1);
  }, [branch, status, year]);

  // Re-fetch data when filters or pagination change
  useEffect(() => {
    fetchUmkData();
  }, [branch, status, year, page, pageSize]);

  const columns = [
    { id: 'Branch', label: 'Branch' },
    { id: 'Tahun', label: 'Tahun' },
    { id: 'Nominal', label: 'Nominal', render: (row) => <Typography sx={{ color: 'primary.main', fontWeight: 700 }}>Rp {row.Nominal}</Typography> },
    { 
      id: 'Status', 
      label: 'Status', 
      render: (row) => {
        const status = row.Status;
        if (!status) return null;
        
        let bgColor = '';
        let color = 'white';
        
        if (status === 'REQUEST') {
          bgColor = 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
          color = 'black';
        } else if (status === 'APPROVED') {
          bgColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        } else if (status === 'REJECTED') {
          bgColor = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
        } else {
          return <Typography variant="caption" sx={{ fontWeight: 700 }}>{status}</Typography>;
        }

        return (
          <Button 
            disabled
            sx={{ 
              borderRadius: '20px', 
              background: bgColor, 
              color: color, 
              border: 'none', 
              padding: '2px 12px', 
              fontWeight: 800, 
              fontSize: '10px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              width: '90px',
              textTransform: 'uppercase',
              '&.Mui-disabled': { color: color, background: bgColor }
            }}
          >
            {status}
          </Button>
        );
      }
    },
    ...(isSpv ? [{ 
      id: 'actions', label: 'Actions', align: 'right', render: (row) => (
        <IconButton 
          size="small" 
          color="primary"
          onClick={() => {
            setSelectedRow(row);
            setNominalRequest(row.Nominal);
            setOpenEdit(true);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )
    }] : [])
  ];

  const historyColumns = [
    { id: 'branch', label: 'Branch' },
    { id: 'tahun', label: 'Tahun' },
    { id: 'nominal', label: 'Nominal' },
    { id: 'nominalUpdate', label: 'Nominal Update' },
    { id: 'createdDate', label: 'Created Date', render: (row) => row.createdDate?.substring(0, 10) },
    { id: 'createdBy', label: 'Created By' },
    { id: 'approval', label: 'Approval' },
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
            <AccountBalanceIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Master UMK
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
              Kelola data Upah Minimum Kabupaten/Kota (UMK) sesuai wilayah branch dan periode tahun
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => {
              setOpenHistory(true);
              fetchHistory();
            }}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              py: 1,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            LOG HISTORY
          </Button>

          {isSpv && (
            <>
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => setOpenUpload(true)}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 2.5,
                  py: 1,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' }
                }}
              >
                UPLOAD DATA
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAdd(true)}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 2.5,
                  py: 1,
                  bgcolor: 'primary.main',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                ADD UMK
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* TOP KPI SUMMARY CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
            <LocationCityIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Total Data
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {totalElements || umkData.length} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>records</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Data UMK wilayah
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <AccountBalanceIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Branch Terdaftar
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {dropdowns.branches?.length || 0} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>cabang</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Cakupan wilayah
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <CheckCircleIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Status Approval
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {status || 'ALL'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Status data terpilih
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <CalendarMonthIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Tahun UMK
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {year || new Date().getFullYear()}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Periode berlaku
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* FILTER PANEL */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3.5,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}
      >
        <Stack spacing={2}>
          {/* Row 1: Search, SEARCH button, CLEAR button */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto' }, gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Cari Branch atau Wilayah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchUmkData(); } }}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc'
                }
              }}
            />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                variant="contained"
                onClick={() => { setPage(1); fetchUmkData(); }}
                sx={{
                  bgcolor: '#1e293b',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 3,
                  height: 40,
                  '&:hover': { bgcolor: '#0f172a' }
                }}
              >
                SEARCH
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearch('');
                  setBranch('');
                  setStatus('');
                  setYear(new Date().getFullYear().toString());
                  setPage(1);
                }}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  height: 40,
                  px: 2.5,
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                CLEAR
              </Button>
            </Stack>
          </Box>

          {/* Row 2: Cascading SearchableSelect Filters */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
            <SearchableSelect 
              placeholder="(Branch)"
              value={branch}
              onChange={setBranch}
              options={dropdowns.branches}
            />
            <SearchableSelect 
              placeholder="(Status)"
              value={status}
              onChange={setStatus}
              options={dropdowns.statuses}
            />
            <SearchableSelect 
              placeholder="(Year)"
              value={year}
              onChange={setYear}
              options={dropdowns.years}
            />
          </Box>
        </Stack>
      </Paper>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={umkData}
        page={page}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={loading}
      />

      {/* Modal Request Edit Nominal */}
      <CustomModal open={openEdit} onClose={() => setOpenEdit(false)} title="Request Edit Nominal" maxWidth="sm">
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 150, fontWeight: 600 }}>Branch</Typography>
              <TextField 
                fullWidth 
                size="small" 
                value={selectedRow?.Branch || ''} 
                onChange={(e) => setSelectedRow({...selectedRow, Branch: e.target.value.toUpperCase()})}
                sx={{ bgcolor: 'white' }} 
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 150, fontWeight: 600 }}>Nominal</Typography>
              <TextField 
                fullWidth 
                size="small" 
                value={selectedRow?.Nominal || ''} 
                onChange={(e) => setSelectedRow({...selectedRow, Nominal: formatNominal(e.target.value)})}
                sx={{ bgcolor: 'white' }} 
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 150, fontWeight: 600 }}>Tahun</Typography>
              <FormControl fullWidth size="small">
                <Select 
                  value={selectedRow?.Tahun || ''} 
                  onChange={(e) => setSelectedRow({...selectedRow, Tahun: e.target.value})}
                  sx={{ bgcolor: 'white' }}
                >
                  {dropdowns.years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ width: 150, fontWeight: 600 }}>Nominal Request</Typography>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Masukkan nominal..." 
                value={nominalRequest}
                onChange={(e) => {
                  setNominalRequest(formatNominal(e.target.value));
                  if (e.target.value) setErrors(prev => ({ ...prev, nominalRequest: false }));
                }}
                error={errors.nominalRequest}
                helperText={errors.nominalRequest ? "Nominal request cannot be empty" : ""}
                sx={{ bgcolor: 'white' }} 
              />
              
              {selectedRow?.approval === 'APPROVED' ? (
                <Box sx={{ minWidth: 120, display: 'flex', justifyContent: 'center' }}>
                  <Typography sx={{ color: '#22c55e', fontWeight: 800, fontSize: '1.5rem' }}>✔</Typography>
                </Box>
              ) : !isSpv ? (
                <Button 
                  variant="contained" 
                  onClick={() => handleUpdate('REQUEST')}
                  sx={{ minWidth: 120, bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 700, border: '1px solid #cbd5e1', boxShadow: 'none' }}
                >
                  REQUEST
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="contained" 
                    onClick={() => handleUpdate('APPROVE')}
                    sx={{ minWidth: 100, bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 700, border: '1px solid #cbd5e1', boxShadow: 'none' }}
                  >
                    APPROVE
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => handleUpdate('REJECT')}
                    sx={{ minWidth: 100, bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 700, border: '1px solid #cbd5e1', boxShadow: 'none' }}
                  >
                    REJECT
                  </Button>
                </Stack>
              )}
            </Box>

            {isSpv && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={() => handleUpdate('UPDATE')}
                  sx={{ px: 4, bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 700, border: '1px solid #cbd5e1', boxShadow: 'none', '&:hover': { bgcolor: '#e2e8f0' } }}
                >
                  UPDATE
                </Button>
              </Box>
            )}
          </Stack>
      </CustomModal>

      <CustomModal open={openAdd} onClose={() => setOpenAdd(false)} title="Add UMK Reff" maxWidth="sm">
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 120, fontWeight: 600 }}>Branch</Typography>
              <TextField 
                fullWidth 
                size="small" 
                sx={{ bgcolor: 'white' }} 
                value={addForm.branch}
                onChange={(e) => {
                  setAddForm({ ...addForm, branch: e.target.value.toUpperCase() });
                  if (e.target.value) setErrors(prev => ({ ...prev, branch: false }));
                }}
                error={errors.branch}
                helperText={errors.branch ? "Branch cannot be empty" : ""}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 120, fontWeight: 600 }}>Nominal</Typography>
              <TextField 
                fullWidth 
                size="small" 
                sx={{ bgcolor: 'white' }} 
                value={addForm.nominal}
                onChange={(e) => {
                  setAddForm({ ...addForm, nominal: formatNominal(e.target.value) });
                  if (e.target.value) setErrors(prev => ({ ...prev, nominal: false }));
                }}
                error={errors.nominal}
                helperText={errors.nominal ? "Nominal cannot be empty" : ""}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ width: 120, fontWeight: 600 }}>Tahun</Typography>
              <FormControl fullWidth size="small">
                <Select 
                  value={addForm.tahun} 
                  onChange={(e) => setAddForm({ ...addForm, tahun: e.target.value })}
                >
                  {dropdowns.years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleSaveAdd}
                sx={{ px: 4, bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 700, border: '1px solid #cbd5e1', boxShadow: 'none', '&:hover': { bgcolor: '#e2e8f0' } }}
              >
                SAVE
              </Button>
            </Box>
          </Stack>
      </CustomModal>

      {/* Modal Upload Master UMK */}
      <CustomModal open={openUpload} onClose={() => setOpenUpload(false)} title="Upload Master UMK" maxWidth="sm">
          <Stack spacing={3} sx={{ mt: 1 }}>
            
            {/* Template Download Section */}
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
                Download .xls
              </Button>
            </Box>

            {/* Upload Area */}
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>Tahun UMK</Typography>
                  <FormControl fullWidth size="small">
                    <Select 
                      displayEmpty 
                      value={uploadYear} 
                      onChange={(e) => setUploadYear(e.target.value)}
                      sx={{ bgcolor: 'white', borderRadius: 1 }}
                    >
                      <MenuItem value="" disabled>(Pilih Tahun)</MenuItem>
                      {dropdowns.years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>File Data UMK (.xls / .xlsx)</Typography>
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
                      disabled={!uploadFile || !uploadYear || loading}
                    >
                      {loading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Criteria Alert */}
            <Alert 
              icon={<InfoIcon fontSize="inherit" />} 
              severity="info" 
              sx={{ borderRadius: 2, '& .MuiAlert-message': { width: '100%' } }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Kriteria Penginputan Data:</Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Box component="span" sx={{ width: 4, height: 4, bgcolor: 'info.main', borderRadius: '50%', mr: 1 }} />
                Kolom wajib diisi: <strong style={{ margin: '0 4px' }}>Area</strong> dan <strong style={{ margin: '0 4px' }}>Nominal</strong>
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box component="span" sx={{ width: 4, height: 4, bgcolor: 'info.main', borderRadius: '50%', mr: 1, mt: 1 }} />
                Penulisan nominal <strong>hanya angka</strong>. Tidak boleh ada huruf/karakter khusus (! @ # $ % dll)
              </Typography>
            </Alert>
          </Stack>
      </CustomModal>

      {/* Modal History Log */}
      <CustomModal open={openHistory} onClose={() => setOpenHistory(false)} title="Log History" maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', mt: 1 }}>
            <TextField 
              size="small" 
              placeholder="Search..." 
              value={historySearch} 
              onChange={(e) => setHistorySearch(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && fetchHistory()}
              sx={{ width: 250 }} 
            />
            <Button 
              variant="contained" 
              size="small" 
              onClick={() => {
                setHistoryPage(1);
                fetchHistory();
              }}
              sx={{ height: '36px', bgcolor: '#f1f5f9', color: '#1e293b', boxShadow: 'none', border: '1px solid #cbd5e1', '&:hover': { bgcolor: '#e2e8f0' } }}
            >
              Search
            </Button>
          </Box>
          <DataTable 
            columns={historyColumns} 
            data={historyData || []} 
            page={historyPage} 
            pageSize={historyPageSize} 
            totalElements={historyTotalElements} 
            totalPages={historyTotalPages} 
            onPageChange={setHistoryPage} 
            onPageSizeChange={setHistoryPageSize} 
            loading={historyLoading}
          />
      </CustomModal>

      {/* Confirmation Dialog */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={executeAction}
        type={confirmDialog.action === 'Delete' ? 'error' : 'info'}
      />

      <CustomSnackbar 
        open={snackbar.open} 
        message={snackbar.message} 
        severity={snackbar.severity} 
        onClose={handleCloseSnackbar} 
      />
    </Box>
  );
};

export default MasterUmk;
