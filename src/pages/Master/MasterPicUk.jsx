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
  Cancel as CancelIcon, Close as CloseIcon
} from '@mui/icons-material';
import SearchableSelect from '../../components/Common/SearchableSelect';
import DataTable from '../../components/Common/DataTable';
import CustomModal from '../../components/Common/CustomModal';
import { useCascadingDropdowns } from '../../hooks/useCascadingDropdowns';
import { useDynamicClientDropdowns } from '../../hooks/useDynamicClientDropdowns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
    { id: 'modeUk', label: 'Mode UK' },
    { 
      id: 'mfee', 
      label: 'Manajemen Fee',
      render: (row) => row.mfee ? `${row.mfee} %` : ''
    },
    { 
      id: 'approval', 
      label: 'Approval Manajemen Fee',
      render: (row) => {
        if (!row.approval) return null;
        if (row.approval === 'Approved') {
          return <Chip label="Approved" size="small" sx={{ bgcolor: 'blue', color: 'white', fontWeight: 'bold' }} />;
        }
        if (row.approval === 'REJECT') {
          return <Chip label="REJECT" size="small" sx={{ bgcolor: 'red', color: 'white', fontWeight: 'bold' }} />;
        }
        if (row.approval === 'Waiting Approval') {
          return <Chip label="Waiting" size="small" sx={{ bgcolor: 'orange', color: 'white', fontWeight: 'bold' }} />;
        }
        return <Chip label={row.approval} size="small" />;
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
    { id: 'mfee', label: 'Persen Manajeme Fee', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.mfee ? `${row.mfee}` : ''}</Typography> },
    { id: 'mfeeUkOld', label: 'Persen Manajemen Fee Lama', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.mfeeUkOld ? `${row.mfeeUkOld}` : ''}</Typography> },
    { id: 'createdDate', label: 'Created Date', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.createdDate}</Typography> },
    { id: 'createdBy', label: 'Created By', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.createdBy}</Typography> },
    { 
      id: 'approval', 
      label: 'Approval', 
      render: (row) => {
        if (!row.approval) return '';
        if (row.approval === 'APPROVED') {
          return <Chip label="Approved" size="small" sx={{ bgcolor: 'blue', color: 'white' }} />;
        }
        if (row.approval === 'REJECT') {
          return <Chip label="REJECT" size="small" sx={{ bgcolor: 'red', color: 'white' }} />;
        }
        if (row.approval === 'Waiting Approval') {
          return <Chip label="Waiting" size="small" sx={{ bgcolor: 'orange', color: 'white' }} />;
        }
        return <Chip label={row.approval} size="small" />;
      }
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Master Uang Kompensasi</Typography>
        <Typography variant="body2" color="text.secondary">Kelola Master Uang Kompensasi & Manajemen Fee</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 4, bgcolor: '#f1f5f9' }} elevation={0}>
        <Stack spacing={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField 
                size="small" 
                fullWidth 
                placeholder="Cari..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ bgcolor: 'white', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#1e293b', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { bgcolor: '#0f172a' } }}
                  onClick={handleSearchClick}
                >
                  SEARCH
                </Button>
                {(user?.privilege === 'SPV' || user?.position?.includes('SPV') || user?.position?.includes('IT')) && (
                  <Button 
                    variant="outlined" 
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', color: '#1e293b', borderColor: '#1e293b' }}
                    onClick={() => setOpenHistory(true)}
                  >
                    Log History MFee
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            <SearchableSelect freeSolo={true} placeholder="(Division)" options={divisions} value={filterDivision} onChange={setFilterDivision} minWidth={160} />
            <SearchableSelect freeSolo={true} placeholder="(Unit)" options={units} value={filterUnit} onChange={setFilterUnit} minWidth={160} />
            <SearchableSelect freeSolo={true} placeholder="(Position)" options={positions} value={filterPosition} onChange={setFilterPosition} minWidth={160} />
            <SearchableSelect freeSolo={true} placeholder="(Branch)" options={branches} value={filterBranch} onChange={setFilterBranch} minWidth={160} />
            <SearchableSelect freeSolo={true} placeholder="(Employee Type)" options={employeeTypes} value={filterEmployeeType} onChange={setFilterEmployeeType} minWidth={160} />
            <SearchableSelect freeSolo={true} placeholder="(Mode Uk)" options={modeUkOptions} value={filterModeUk} onChange={setFilterModeUk} minWidth={160} />
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 4, bgcolor: '#f1f5f9' }} elevation={0}>
        <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <SearchableSelect 
              freeSolo={true}
              placeholder="(Pilih Mode Hitung)" 
              options={modeUkOptions} 
              value={assignModeUk} 
              onChange={setAssignModeUk} 
              minWidth={220}
            />
            <Button 
              variant="contained" 
              onClick={handleAssign}
              sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', boxShadow: 'none', fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#dbeafe', boxShadow: 'none' } }}
            >
              Assign
            </Button>
            
            {(user?.privilege === 'SPV' || user?.position?.includes('SPV') || user?.position?.includes('IT')) && (
              <>
                <Button 
                  variant="contained" 
                  onClick={handleApprove}
                  sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', boxShadow: 'none', fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#dbeafe', boxShadow: 'none' } }}
                >
                  APPROVE
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleReject}
                  sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', boxShadow: 'none', fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#dbeafe', boxShadow: 'none' } }}
                >
                  REJECT
                </Button>
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>Manajemen Fee (%)</Typography>
            <TextField 
              size="small" 
              sx={{ width: 120, bgcolor: 'white', borderRadius: '8px' }} 
              value={updateMfee}
              onChange={(e) => setUpdateMfee(e.target.value.replace(/[^0-9.]/g, ''))}
            />
            <Button 
              variant="outlined" 
              onClick={handleUpdateMfee}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
            >
              UPDATE
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={Math.ceil(totalElements / pageSize)}
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
          
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
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
