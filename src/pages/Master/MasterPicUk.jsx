import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Box, Typography, Paper, Grid, TextField, Button, Stack, Chip, Checkbox, IconButton,
  Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
  Search as SearchIcon, Add as AddIcon, Edit as EditIcon, 
  GetApp as ExportIcon, CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon, Close as CloseIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  History as HistoryIcon,
  Percent as PercentIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Tune as TuneIcon
} from '@mui/icons-material';
import SearchableSelect from '../../components/Common/SearchableSelect';
import DataTable from '../../components/Common/DataTable';
import CustomModal from '../../components/Common/CustomModal';
import { useCascadingDropdowns } from '../../hooks/useCascadingDropdowns';
import { useDynamicClientDropdowns } from '../../hooks/useDynamicClientDropdowns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

const MasterPicUk = () => {
  const { user } = useSelector((state) => state.auth || {});

  // Filters State
  const [search, setSearch] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterModeUk, setFilterModeUk] = useState('');

  // Dropdown Hooks
  const { divisions, units, positions, employeeTypes, branches } = useDynamicClientDropdowns({
    division: filterDivision, unit: filterUnit, position: filterPosition, employeeType: filterEmployeeType
  });

  const modeUkOptions = ["MODE_1", "MODE_2", "MODE_3"];

  // Table State
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  
  // History Modal State
  const [openHistory, setOpenHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyTotalElements, setHistoryTotalElements] = useState(0);
  
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilterDivision, setHistoryFilterDivision] = useState('');
  const [historyFilterBranch, setHistoryFilterBranch] = useState('');
  const [historyFilterUnit, setHistoryFilterUnit] = useState('');
  const [historyFilterPosition, setHistoryFilterPosition] = useState('');
  const [historyFilterEmployeeType, setHistoryFilterEmployeeType] = useState('');
  const [historyFilterModeUk, setHistoryFilterModeUk] = useState('');

  // Action State
  const [assignModeUk, setAssignModeUk] = useState('');
  const [updateMfee, setUpdateMfee] = useState('');
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = `${API_URL}/api/master-pic-uk/list?page=${page - 1}&size=${pageSize}`;
      const payload = {
        search,
        division: filterDivision,
        unitName: filterUnit,
        position: filterPosition,
        branch: filterBranch,
        employeeType: filterEmployeeType,
        modeUk: filterModeUk
      };
      
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'fullname': user?.username || 'Staff HRD',
        'role': user?.privilege || (user?.position?.includes('SPV') ? 'SPV' : 'STAFF')
      };

      const response = await axios.post(endpoint, payload, { headers });
      
      if (response.data && response.data.content) {
        setData(response.data.content);
        setTotalElements(response.data.totalElements);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Gagal mengambil data dari server', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filterDivision, filterUnit, filterPosition, filterBranch, filterEmployeeType, filterModeUk]);

  const fetchHistoryData = async () => {
    setHistoryLoading(true);
    try {
      const payload = {
        search: historySearch,
        division: historyFilterDivision,
        branch: historyFilterBranch,
        unitName: historyFilterUnit,
        position: historyFilterPosition,
        employeeType: historyFilterEmployeeType,
        modeUk: historyFilterModeUk
      };
      
      const endpoint = `${API_URL}/api/master-pic-uk/history-log?page=${historyPage}&size=${historyPageSize}`;
      
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'fullname': user?.username || 'Staff HRD',
        'role': user?.privilege || (user?.position?.includes('SPV') ? 'SPV' : 'STAFF')
      };

      const response = await axios.post(endpoint, payload, { headers });
      if (response.data && response.data.content) {
        setHistoryData(response.data.content);
        setHistoryTotalElements(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      setSnackbar({ open: true, message: 'Gagal mengambil data history dari server', severity: 'error' });
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (openHistory) {
      fetchHistoryData();
    }
  }, [openHistory, historyPage, historyPageSize, historyFilterDivision, historyFilterBranch, historyFilterUnit, historyFilterPosition, historyFilterEmployeeType, historyFilterModeUk]);

  const handleSearchClick = () => {
    setPage(1);
    fetchData();
  };

  const handleSelectAllPage = () => {
    const allIdsOnPage = data.map(d => d.id);
    const newSelected = [...new Set([...selectedIds, ...allIdsOnPage])];
    setSelectedIds(newSelected);
  };

  const handleUnselectAllPage = () => {
    const allIdsOnPage = data.map(d => d.id);
    const newSelected = selectedIds.filter(id => !allIdsOnPage.includes(id));
    setSelectedIds(newSelected);
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAssign = async () => {
    if (selectedIds.length === 0) {
      setSnackbar({ open: true, message: 'Silakan pilih data terlebih dahulu', severity: 'warning' });
      return;
    }
    if (!assignModeUk) {
      setSnackbar({ open: true, message: 'Pilih Mode Hitung terlebih dahulu', severity: 'warning' });
      return;
    }
    
    try {
      const endpoint = `${API_URL}/api/master-pic-uk/assign`;
      const payload = {
        ids: selectedIds,
        assignModeUk: assignModeUk
      };
      const token = localStorage.getItem('token');
      await axios.post(endpoint, payload, { headers: { 'Authorization': `Bearer ${token}` } });
      
      setSnackbar({ open: true, message: `Berhasil Assign Mode Hitung ke ${selectedIds.length} data`, severity: 'success' });
      setSelectedIds([]);
      setAssignModeUk('');
      fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Gagal melakukan Assign', severity: 'error' });
    }
  };

  const handleUpdateMfee = async () => {
    if (selectedIds.length === 0) {
      setSnackbar({ open: true, message: 'Silakan pilih data terlebih dahulu', severity: 'warning' });
      return;
    }
    if (!updateMfee) {
      setSnackbar({ open: true, message: 'Isi Manajemen Fee terlebih dahulu', severity: 'warning' });
      return;
    }
    
    try {
      const endpoint = `${API_URL}/api/master-pic-uk/request-update-mfee`;
      const payload = {
        ids: selectedIds,
        updateMfee: parseFloat(updateMfee)
      };
      const token = localStorage.getItem('token');
      await axios.post(endpoint, payload, { 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'fullname': user?.username || 'Staff HRD'
        } 
      });
      
      setSnackbar({ open: true, message: `Berhasil Update MFee (Waiting Approval) untuk ${selectedIds.length} data`, severity: 'success' });
      setSelectedIds([]);
      setUpdateMfee('');
      fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Gagal melakukan Update MFee', severity: 'error' });
    }
  };

  const handleApprove = async () => {
    if (selectedIds.length === 0) {
      setSnackbar({ open: true, message: 'Silakan pilih data terlebih dahulu', severity: 'warning' });
      return;
    }
    try {
      const endpoint = `${API_URL}/api/master-pic-uk/approve-mfee`;
      const token = localStorage.getItem('token');
      await axios.post(endpoint, { ids: selectedIds }, { headers: { 'Authorization': `Bearer ${token}` } });
      setSnackbar({ open: true, message: `Berhasil Approve ${selectedIds.length} data`, severity: 'success' });
      setSelectedIds([]);
      fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Gagal melakukan Approve', severity: 'error' });
    }
  };

  const handleReject = async () => {
    if (selectedIds.length === 0) {
      setSnackbar({ open: true, message: 'Silakan pilih data terlebih dahulu', severity: 'warning' });
      return;
    }
    try {
      const endpoint = `${API_URL}/api/master-pic-uk/reject-mfee`;
      const token = localStorage.getItem('token');
      await axios.post(endpoint, { ids: selectedIds }, { headers: { 'Authorization': `Bearer ${token}` } });
      setSnackbar({ open: true, message: `Berhasil Reject ${selectedIds.length} data`, severity: 'success' });
      setSelectedIds([]);
      fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: 'Gagal melakukan Reject', severity: 'error' });
    }
  };

  const isAllSelected = data.length > 0 && data.every(d => selectedIds.includes(d.id));
  const isSomeSelected = data.some(d => selectedIds.includes(d.id)) && !isAllSelected;

  const columns = [
    {
      id: 'select',
      label: (
        <Checkbox 
          size="small"
          checked={isAllSelected}
          indeterminate={isSomeSelected}
          onChange={(e) => {
            if (e.target.checked) {
              handleSelectAllPage();
            } else {
              handleUnselectAllPage();
            }
          }}
        />
      ),
      render: (row) => (
        <Checkbox 
          size="small" 
          checked={selectedIds.includes(row.id)} 
          onChange={() => toggleSelect(row.id)} 
        />
      )
    },
    { id: 'division', label: 'Division' },
    { id: 'unit', label: 'Unit' },
    { id: 'position', label: 'Position' },
    { id: 'branch', label: 'Branch' },
    { id: 'employeeType', label: 'Employee Type' },
    { 
      id: 'modeUk', 
      label: 'Mode UK',
      render: (row) => row.modeUk ? (
        <Chip label={row.modeUk} size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', fontWeight: 700, fontSize: '0.75rem' }} />
      ) : '-'
    },
    { 
      id: 'mfee', 
      label: 'Manajemen Fee',
      render: (row) => row.mfee ? <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{row.mfee}%</Typography> : '-'
    },
    { 
      id: 'approval', 
      label: 'Approval Manajemen Fee',
      render: (row) => {
        if (!row.approval) return null;
        if (row.approval === 'Approved' || row.approval === 'APPROVED') {
          return <Chip label="Approved" size="small" sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '0.72rem' }} />;
        }
        if (row.approval === 'REJECT' || row.approval === 'REJECTED') {
          return <Chip label="Rejected" size="small" sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700, fontSize: '0.72rem' }} />;
        }
        if (row.approval === 'Waiting Approval' || row.approval === 'PENDING') {
          return <Chip label="Waiting Approval" size="small" sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 700, fontSize: '0.72rem' }} />;
        }
        return <Chip label={row.approval} size="small" sx={{ fontWeight: 700 }} />;
      }
    }
  ];

  const historyColumns = [
    { id: 'division', label: 'Division', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.division}</Typography> },
    { id: 'unit', label: 'Unit', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.unit}</Typography> },
    { id: 'position', label: 'Position', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.position}</Typography> },
    { id: 'branch', label: 'Branch', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.branch}</Typography> },
    { id: 'employeeType', label: 'Employee Type', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.employeeType}</Typography> },
    { id: 'modeUk', label: 'mode_uk', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.modeUk}</Typography> },
    { id: 'mfee', label: 'Persen Manajemen Fee', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.mfee ? `${row.mfee}%` : ''}</Typography> },
    { id: 'mfeeUkOld', label: 'Persen Manajemen Fee Lama', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.mfeeUkOld ? `${row.mfeeUkOld}%` : ''}</Typography> },
    { id: 'createdDate', label: 'Created Date', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.createdDate}</Typography> },
    { id: 'createdBy', label: 'Created By', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.createdBy}</Typography> },
    { 
      id: 'approval', 
      label: 'Approval', 
      render: (row) => {
        if (!row.approval) return '';
        if (row.approval === 'APPROVED') {
          return <Chip label="Approved" size="small" sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700 }} />;
        }
        if (row.approval === 'REJECT') {
          return <Chip label="Rejected" size="small" sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700 }} />;
        }
        if (row.approval === 'Waiting Approval') {
          return <Chip label="Waiting" size="small" sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 700 }} />;
        }
        return <Chip label={row.approval} size="small" />;
      }
    },
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
            <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Master Uang Kompensasi
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
              Kelola penugasan Mode UK dan persentase Manajemen Fee kompensasi
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {(user?.privilege === 'SPV' || user?.position?.includes('SPV') || user?.position?.includes('IT')) && (
            <Button 
              variant="outlined" 
              startIcon={<HistoryIcon />}
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
              onClick={() => setOpenHistory(true)}
            >
              LOG HISTORY MFEE
            </Button>
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
            <AccountBalanceWalletIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Total Data
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {totalElements} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>records</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Data kompensasi unit
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
            <BusinessIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Division Aktif
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {divisions.length} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>divisi</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Terdaftar dalam sistem
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
            <PercentIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Mode UK Terdaftar
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              3 <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>skema</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              MODE_1, 2 & 3
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
            <CheckCircleIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Branch Coverage
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {branches.length} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>cabang</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Cakupan wilayah
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
              size="small" 
              fullWidth
              placeholder="Cari Division, Unit, Posisi, Branch..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchClick(); }}
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
                onClick={handleSearchClick}
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
                  setFilterDivision('');
                  setFilterUnit('');
                  setFilterPosition('');
                  setFilterBranch('');
                  setFilterEmployeeType('');
                  setFilterModeUk('');
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' }, gap: 1.5 }}>
            <SearchableSelect freeSolo={true} placeholder="(Division)" options={divisions} value={filterDivision} onChange={setFilterDivision} />
            <SearchableSelect freeSolo={true} placeholder="(Unit)" options={units} value={filterUnit} onChange={setFilterUnit} />
            <SearchableSelect freeSolo={true} placeholder="(Position)" options={positions} value={filterPosition} onChange={setFilterPosition} />
            <SearchableSelect freeSolo={true} placeholder="(Branch)" options={branches} value={filterBranch} onChange={setFilterBranch} />
            <SearchableSelect freeSolo={true} placeholder="(Employee Type)" options={employeeTypes} value={filterEmployeeType} onChange={setFilterEmployeeType} />
            <SearchableSelect freeSolo={true} placeholder="(Mode Uk)" options={modeUkOptions} value={filterModeUk} onChange={setFilterModeUk} />
          </Box>
        </Stack>
      </Paper>

      {/* ACTION TOOLBAR DIRECTLY ABOVE DATATABLE */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          px: 2,
          mb: 2,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.4)' : '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Aksi Kompensasi:
          </Typography>
          {selectedIds.length > 0 ? (
            <Chip
              label={`${selectedIds.length} data dipilih`}
              size="small"
              color="primary"
              sx={{ fontWeight: 700, fontSize: '0.75rem', borderRadius: 2 }}
            />
          ) : (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              (Pilih checklist baris untuk eksekusi aksi)
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Box sx={{ width: 180 }}>
            <SearchableSelect 
              freeSolo={true}
              placeholder="(Pilih Mode Hitung)" 
              options={modeUkOptions} 
              value={assignModeUk} 
              onChange={setAssignModeUk} 
            />
          </Box>
          <Button 
            variant="contained" 
            disabled={selectedIds.length === 0 || !assignModeUk}
            onClick={handleAssign}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              fontWeight: 700, 
              borderRadius: 2.5, 
              textTransform: 'none', 
              px: 2,
              height: 40,
              '&:hover': { bgcolor: 'primary.dark' } 
            }}
          >
            Assign Mode ({selectedIds.length})
          </Button>
          
          <Box sx={{ width: 130 }}>
            <TextField
              size="small"
              placeholder="MFee (%)"
              value={updateMfee}
              onChange={(e) => setUpdateMfee(e.target.value.replace(/[^0-9.]/g, ''))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'white' } }}
            />
          </Box>
          <Button 
            variant="outlined" 
            disabled={selectedIds.length === 0 || !updateMfee}
            onClick={handleUpdateMfee}
            sx={{ 
              fontWeight: 700, 
              borderRadius: 2.5, 
              textTransform: 'none', 
              px: 2,
              height: 40,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' } 
            }}
          >
            Update MFee
          </Button>

          {(user?.privilege === 'SPV' || user?.position?.includes('SPV') || user?.position?.includes('IT')) && (
            <>
              <Button 
                variant="contained" 
                disabled={selectedIds.length === 0}
                onClick={handleApprove}
                sx={{ 
                  bgcolor: '#10b981', 
                  color: 'white', 
                  fontWeight: 700, 
                  borderRadius: 2.5, 
                  textTransform: 'none', 
                  px: 2,
                  height: 40,
                  '&:hover': { bgcolor: '#059669' } 
                }}
              >
                Approve
              </Button>
              <Button 
                variant="contained" 
                disabled={selectedIds.length === 0}
                onClick={handleReject}
                sx={{ 
                  bgcolor: '#ef4444', 
                  color: 'white', 
                  fontWeight: 700, 
                  borderRadius: 2.5, 
                  textTransform: 'none', 
                  px: 2,
                  height: 40,
                  '&:hover': { bgcolor: '#dc2626' } 
                }}
              >
                Reject
              </Button>
            </>
          )}
        </Stack>
      </Paper>

      {/* DATA TABLE */}
      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={Math.ceil(totalElements / pageSize) || 1}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        headerBg="#f8fafc"
        headerColor="#1e293b"
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Modal History Log */}
      <CustomModal open={openHistory} onClose={() => setOpenHistory(false)} title="Log History" maxWidth="xl">
          <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', mt: 1 }}>
            <TextField 
              size="small" 
              placeholder="Search..." 
              value={historySearch} 
              onChange={(e) => setHistorySearch(e.target.value)} 
              sx={{ width: 250 }} 
            />
            <Button 
              variant="contained" 
              size="small" 
              onClick={() => {
                setHistoryPage(0);
                fetchHistoryData();
              }}
              sx={{ height: '36px', bgcolor: '#f1f5f9', color: '#1e293b', boxShadow: 'none', border: '1px solid #cbd5e1', '&:hover': { bgcolor: '#e2e8f0', boxShadow: 'none' } }}
            >
              Search
            </Button>
          </Box>
          
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 2, gap: 1 }}>
            <SearchableSelect freeSolo={true} placeholder="(Division)" value={historyFilterDivision} onChange={setHistoryFilterDivision} options={divisions} minWidth={160} />
            <SearchableSelect freeSolo={true} placeholder="(Unit)" value={historyFilterUnit} onChange={setHistoryFilterUnit} options={units} minWidth={160} />
            <SearchableSelect freeSolo={true} placeholder="(Position)" value={historyFilterPosition} onChange={setHistoryFilterPosition} options={positions} minWidth={160} />
            <SearchableSelect freeSolo={true} placeholder="(Branch)" value={historyFilterBranch} onChange={setHistoryFilterBranch} options={branches} minWidth={160} />
            <SearchableSelect freeSolo={true} placeholder="(Employee Type)" value={historyFilterEmployeeType} onChange={setHistoryFilterEmployeeType} options={employeeTypes} minWidth={160} />
            <SearchableSelect freeSolo={true} placeholder="(Mode Uk)" value={historyFilterModeUk} onChange={setHistoryFilterModeUk} options={modeUkOptions} minWidth={160} />
          </Stack>
          
          <DataTable 
            columns={historyColumns} 
            data={historyData} 
            page={historyPage} 
            pageSize={historyPageSize} 
            totalElements={historyTotalElements} 
            totalPages={Math.ceil(historyTotalElements / historyPageSize) || 1} 
            onPageChange={setHistoryPage} 
            onPageSizeChange={setHistoryPageSize} 
            loading={historyLoading}
          />
      </CustomModal>
    </Box>
  );
};

export default MasterPicUk;
