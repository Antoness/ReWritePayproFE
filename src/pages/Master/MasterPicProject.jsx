import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Paper, Grid, TextField, Button, Stack, Checkbox, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, Snackbar, Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Close as CloseIcon,
  Cancel as CancelIcon,
  AssignmentInd as AssignmentIndIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  AccountTree as AccountTreeIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import SearchableSelect from '../../components/Common/SearchableSelect';
import DataTable from '../../components/Common/DataTable';
import { useCascadingDropdowns } from '../../hooks/useCascadingDropdowns';
import CustomModal from '../../components/Common/CustomModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const MasterPicProject = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [user, setUser] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [dropdowns, setDropdowns] = useState({ combinations: [] });
  const [users, setUsers] = useState([]);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  
  // Assign State
  const [assignUser, setAssignUser] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modal State
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [picUtama, setPicUtama] = useState('');
  const [picTambahan, setPicTambahan] = useState('');
  const [picTambahanList, setPicTambahanList] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchDropdowns();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filterDivision, filterUnit, filterPosition, filterBranch]);

  const fetchDropdowns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/master-employee/dropdowns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && Object.keys(res.data).length > 0) {
        setDropdowns(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch dropdowns:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/users?size=1000`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (res.data && res.data.content) {
        const validUsers = res.data.content
          .map(u => u.username || u.fullname || u.name || '')
          .filter(name => name !== '');
        setUsers(validUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      // Fallback
      setUsers(['stafftester', 'Staff HRD', 'teststaff']);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const payload = {
        search,
        division: filterDivision,
        unitName: filterUnit,
        position: filterPosition,
        branch: filterBranch
      };
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/master-pic-project/list?page=${page - 1}&size=${pageSize}`, payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'fullname': user?.username || 'Staff HRD',
          'role': user?.role || user?.privilege || 'SPV'
        }
      });
      setData(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch (error) {
      console.error('Error fetching data', error);
      setSnackbar({ open: true, message: 'Gagal mengambil data', severity: 'error' });
    }
    setLoading(false);
  };

  const mainDropdowns = useCascadingDropdowns(dropdowns.combinations || [], { 
    division: filterDivision, 
    unit: filterUnit, 
    position: filterPosition, 
    branch: filterBranch 
  });
  const divisions = mainDropdowns.divisions || [];
  const units = mainDropdowns.units || [];
  const positions = mainDropdowns.positions || [];
  const branches = mainDropdowns.branches || [];

  const handleSelectAll = () => {
    if (selectedIds.length === data.length && data.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(d => d.id));
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleOpenEdit = async (row) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/master-pic-project/${row.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const detail = res.data;
      setEditData(detail);
      setPicUtama(detail.picUtama || '');
      setPicTambahanList(detail.picTambahanList || []);
      setOpenEdit(true);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Gagal mengambil detail data', severity: 'error' });
    }
  };

  const handleAddPicTambahan = () => {
    if (picTambahan && !picTambahanList.includes(picTambahan)) {
      setPicTambahanList([...picTambahanList, picTambahan]);
      setPicTambahan('');
    }
  };

  const handleRemovePicTambahan = (user) => {
    setPicTambahanList(picTambahanList.filter(u => u !== user));
  };

  const columns = [
    { 
      id: 'checkbox', 
      label: <Checkbox size="small" checked={selectedIds.length === data.length && data.length > 0} onChange={handleSelectAll} />, 
      render: (row) => (
        <Checkbox 
          size="small" 
          checked={selectedIds.includes(row.id)}
          onChange={() => handleSelectOne(row.id)}
        />
      )
    },
    { id: 'division', label: 'Division', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.division}</Typography> },
    { id: 'unit', label: 'Unit', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.unit}</Typography> },
    { id: 'position', label: 'Position', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.position}</Typography> },
    { id: 'branch', label: 'Branch', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.branch}</Typography> },
    { id: 'employeeType', label: 'Employee Type', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.employeeType}</Typography> },
    { 
      id: 'pic', 
      label: 'PIC Project', 
      render: (row) => row.pic ? (
        <Chip label={row.pic} size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', fontWeight: 700, fontSize: '0.75rem' }} />
      ) : (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Belum di-assign</Typography>
      )
    },
    { 
      id: 'actions', 
      label: '', 
      render: (row) => (
        <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}>
          <EditIcon fontSize="small" />
        </IconButton>
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
            <AssignmentIndIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Master PIC Project
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
              Penugasan dan pemetaan PIC (Person in Charge) untuk setiap divisi, unit kerja, dan proyek
            </Typography>
          </Box>
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
            <AccountTreeIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Total Data
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {totalElements} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>records</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Pemetaan project
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
            <PeopleIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Total PIC User
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {users.length} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>user</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Siap ditugaskan
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
              Wilayah penempatan
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
              onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchData(); } }}
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
                onClick={() => { setPage(1); fetchData(); }}
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
            <SearchableSelect freeSolo={true} placeholder="(Division)" options={divisions} value={filterDivision} onChange={setFilterDivision} />
            <SearchableSelect freeSolo={true} placeholder="(Unit)" options={units} value={filterUnit} onChange={setFilterUnit} />
            <SearchableSelect freeSolo={true} placeholder="(Position)" options={positions} value={filterPosition} onChange={setFilterPosition} />
            <SearchableSelect freeSolo={true} placeholder="(Branch)" options={branches} value={filterBranch} onChange={setFilterBranch} />
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
            Penugasan PIC:
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
              (Pilih checklist baris untuk assign PIC)
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Box sx={{ width: 220 }}>
            <SearchableSelect 
              placeholder="(Pilih PIC User)" 
              options={users} 
              value={assignUser} 
              onChange={setAssignUser} 
            />
          </Box>
          <Button 
            variant="contained" 
            disabled={selectedIds.length === 0 || !assignUser}
            onClick={async () => {
              if (selectedIds.length === 0) {
                setSnackbar({ open: true, message: 'Pilih data terlebih dahulu', severity: 'warning' });
                return;
              }
              if (!assignUser) {
                setSnackbar({ open: true, message: 'Pilih user terlebih dahulu', severity: 'warning' });
                return;
              }
              try {
                const token = localStorage.getItem('token');
                await axios.post(`${API_URL}/api/master-pic-project/assign`, {
                  ids: selectedIds,
                  pic: assignUser
                }, {
                  headers: { 
                    'Authorization': `Bearer ${token}`,
                    'fullname': user?.username || 'Staff HRD'
                  }
                });
                setSnackbar({ open: true, message: `Berhasil Assign PIC ke ${selectedIds.length} data`, severity: 'success' });
                setSelectedIds([]);
                setAssignUser('');
                fetchData();
              } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: 'Gagal Assign User', severity: 'error' });
              }
            }}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              fontWeight: 700, 
              borderRadius: 2.5,
              textTransform: 'none', 
              px: 2.5,
              height: 40,
              '&:hover': { bgcolor: 'primary.dark' } 
            }}
          >
            ASSIGN PIC ({selectedIds.length})
          </Button>
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
      />

      {/* Edit Modal */}
      <CustomModal open={openEdit} onClose={() => setOpenEdit(false)} title="Detail PIC Project" maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ width: 100, fontWeight: 600, fontSize: '0.85rem' }}>Division</Typography>
                  <TextField size="small" fullWidth value={editData?.division || ''} InputProps={{ readOnly: true }} sx={{ bgcolor: '#f8fafc' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ width: 100, fontWeight: 600, fontSize: '0.85rem' }}>Unit Name</Typography>
                  <TextField size="small" fullWidth value={editData?.unit || ''} InputProps={{ readOnly: true }} sx={{ bgcolor: '#f8fafc' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ width: 100, fontWeight: 600, fontSize: '0.85rem' }}>Position</Typography>
                  <TextField size="small" fullWidth value={editData?.position || ''} InputProps={{ readOnly: true }} sx={{ bgcolor: '#f8fafc' }} />
                </Box>
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ width: 100, fontWeight: 600, fontSize: '0.85rem' }}>Employee Type</Typography>
                  <TextField size="small" fullWidth value={editData?.employeeType || ''} InputProps={{ readOnly: true }} sx={{ bgcolor: '#f8fafc' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ width: 100, fontWeight: 600, fontSize: '0.85rem' }}>Branch</Typography>
                  <TextField size="small" fullWidth value={editData?.branch || ''} InputProps={{ readOnly: true }} sx={{ bgcolor: '#f8fafc' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ width: 100, fontWeight: 600, fontSize: '0.85rem' }}>Pic Utama</Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <SearchableSelect options={users} value={picUtama} onChange={setPicUtama} />
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {/* Pic Tambahan Section */}
          <Box sx={{ mt: 4 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>Pic Tambahan</Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ width: 250 }}>
                <SearchableSelect placeholder="(Pilih User)" options={users} value={picTambahan} onChange={setPicTambahan} />
              </Box>
              <Button 
                variant="contained" 
                onClick={handleAddPicTambahan}
                sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', boxShadow: 'none', fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#dbeafe', boxShadow: 'none' } }}
              >
                Add
              </Button>
            </Stack>

            {/* Pic Tambahan Table */}
            <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
              <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                <Typography sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.85rem' }}>user</Typography>
              </Box>
              {picTambahanList.length > 0 ? (
                picTambahanList.map((user, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderBottom: index < picTambahanList.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                    <Typography sx={{ fontSize: '0.85rem' }}>{user}</Typography>
                    <IconButton size="small" color="error" onClick={() => handleRemovePicTambahan(user)}>
                      <CancelIcon />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#94a3b8' }}>Belum ada Pic Tambahan</Typography>
                </Box>
              )}
            </Box>
          </Box>
      
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, width: '100%', mt: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => setOpenEdit(false)}
          sx={{ px: 3, borderRadius: 1.5 }}
        >
          Tutup
        </Button>
        <Button 
          variant="contained" 
          onClick={async () => {
            try {
              const token = localStorage.getItem('token');
              await axios.put(`${API_URL}/api/master-pic-project/${editData.id}`, {
                picUtama,
                picTambahanList
              }, {
                headers: { 
                  'Authorization': `Bearer ${token}`,
                  'fullname': user?.username || 'Staff HRD'
                }
              });
              setSnackbar({ open: true, message: 'Berhasil Update Pic', severity: 'success' });
              setOpenEdit(false);
              fetchData();
            } catch (error) {
              console.error(error);
              setSnackbar({ open: true, message: 'Gagal Update Pic', severity: 'error' });
            }
          }}
          sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', boxShadow: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { bgcolor: '#dbeafe', boxShadow: 'none' } }}
        >
          UPDATE
        </Button>
      </Box>
    </CustomModal>
      
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MasterPicProject;
