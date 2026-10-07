import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, InputAdornment, IconButton,
  Checkbox, Pagination, Stack, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, MenuItem, Avatar, CircularProgress, Select, FormControl, InputLabel,
  Snackbar, Alert
} from '@mui/material';
import {
  Search as SearchIcon, Add as AddIcon, Edit as EditIcon, VpnKey as ResetPasswordIcon,
  PlaylistAddCheck as ApprovalIcon, Delete as DeleteIcon, Close as CloseIcon,
  Badge as NikIcon, Person as NameIcon, Email as EmailIcon, AccountCircle as UserIcon,
  Work as PositionIcon, Business as DivisionIcon, SupervisorAccount as UplinerIcon,
  VerifiedUser as StatusIcon, Download as DownloadIcon, Refresh as RefreshIcon, AccountTree as AccountTreeIcon, Warning as WarningIcon, CloudUpload as CloudUploadIcon, Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import SearchableSelect from '../../components/Common/SearchableSelect';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8085';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openApprovalModal, setOpenApprovalModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserNik, setSelectedUserNik] = useState('');

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: '', data: null });

  // Approval Data State
  const [potentialUpliners, setPotentialUpliners] = useState([]);
  const [existingUpliners, setExistingUpliners] = useState([]);
  const [selectedUpliner, setSelectedUpliner] = useState('');

  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    nik: '', fullName: '', email: '', username: '', password: '',
    position: '', division: '', upliner: '', status: 'ACTIVE'
  });

  const fetchUsers = async (searchTerm = '', currentPage = 1, size = pageSize) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        params: { search: searchTerm, page: currentPage - 1, size: size }
      });
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const [rolesList, setRolesList] = useState([]);

  const fetchRolesList = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/roles`);
      setRolesList(response.data || []);
    } catch (error) {
      console.error('Error fetching roles list:', error);
    }
  };

  useEffect(() => {
    fetchUsers(search, page, pageSize);
    fetchRolesList();
  }, [page, pageSize]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers(search, 1, pageSize);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAdd = () => {
    setEditMode(false);
    setFormData({
      nik: '', fullName: '', email: '', username: '', password: '',
      position: '', division: '', upliner: '', status: 'ACTIVE'
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditMode(true);
    setSelectedUserId(user.id);
    setFormData({
      nik: user.nik || '', fullName: user.fullName || '', email: user.email || '', username: user.username || '',
      password: '', position: user.position || '', division: user.division || '', upliner: user.upliner || '', status: user.status || 'ACTIVE'
    });
    setOpenModal(true);
  };

  const handleOpenApproval = async (user) => {
    setSelectedUserId(user.id);
    setSelectedUserNik(user.nik);
    setSelectedUpliner('');
    try {
      const resPotential = await axios.get(`${API_URL}/api/users/potential-upliners/${user.nik}`);
      setPotentialUpliners(resPotential.data);
      const resExisting = await axios.get(`${API_URL}/api/users/existing-upliners/${user.nik}`);
      setExistingUpliners(resExisting.data);
      setOpenApprovalModal(true);
    } catch (error) {
      showMessage('Gagal mengambil data approval', 'error');
    }
  };

  const handleSaveUpliner = async () => {
    if (!selectedUpliner) {
      showMessage('Pilih Upliner !', 'warning');
      return;
    }
    if (existingUpliners.some(u => u.nik === selectedUpliner)) {
      showMessage('Data upliner dengan nik tersebut sudah ada', 'error');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/users/add-upliner`, {
        nik: selectedUserNik,
        nikUpliner: selectedUpliner
      });
      showMessage(response.data.message, 'success');
      setSelectedUpliner('');
      const resExisting = await axios.get(`${API_URL}/api/users/existing-upliners/${selectedUserNik}`);
      setExistingUpliners(resExisting.data);
    } catch (error) {
      showMessage(error.response?.data?.message || 'Gagal menyimpan upliner', 'error');
    }
  };

  // Logic Reset Password via Checklist
  const handleResetPassword = () => {
    if (selected.length === 0) {
      showMessage('Pilih user yang ingin di-reset password-nya!', 'warning');
      return;
    }
    setConfirmDialog({ open: true, type: 'RESET_PASSWORD', data: selected });
  };

  const confirmDeleteUpliner = (nikUpliner) => {
    setConfirmDialog({ open: true, type: 'UPLINER', data: nikUpliner });
  };

  const handleConfirmDelete = async () => {
    const { type, data } = confirmDialog;
    try {
      if (type === 'UPLINER') {
        const response = await axios.delete(`${API_URL}/api/users/delete-upliner`, {
          params: { nik: selectedUserNik, nikUpliner: data }
        });
        showMessage(response.data.message, 'success');
        const resExisting = await axios.get(`${API_URL}/api/users/existing-upliners/${selectedUserNik}`);
        setExistingUpliners(resExisting.data);
      } else if (type === 'RESET_PASSWORD') {
        const response = await axios.post(`${API_URL}/api/users/reset-password`, { ids: data });
        showMessage(response.data.message, 'success');
        setSelected([]); // Clear selection after reset
      }
    } catch (error) {
      showMessage('Gagal melakukan aksi', 'error');
    } finally {
      setConfirmDialog({ open: false, type: '', data: null });
    }
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await axios.put(`${API_URL}/api/users/${selectedUserId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/users`, formData);
      }
      setOpenModal(false);
      fetchUsers(search, page, pageSize);
      showMessage('User berhasil disimpan', 'success');
    } catch (error) {
      showMessage('Gagal menyimpan data user', 'error');
    }
  };

  const handleSelectAll = (e) => setSelected(e.target.checked ? users.map((n) => n.id) : []);
  const handleSelectOne = (id) => {
    const idx = selected.indexOf(id);
    setSelected(idx === -1 ? [...selected, id] : selected.filter(i => i !== id));
  };

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, totalElements);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>User Management</Typography>
          <Typography variant="body2" color="text.secondary">Kelola data pengguna dan hierarki approval sistem Payroll</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ borderRadius: '12px', py: 1.2, px: 3 }}>Add New User</Button>
      </Box>

      {/* Toolbar Search & Reset */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 4 }} elevation={0} className="glass-card">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, alignItems: 'center' }}>
          <Box>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Search..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
              slotProps={{ 
                input: { 
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    </InputAdornment>
                  ), 
                  sx: { borderRadius: '10px', bgcolor: 'white' } 
                } 
              }} 
            />
          </Box>
          <Box>
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="contained" onClick={handleSearch} sx={{ bgcolor: '#1e293b', color: 'white', borderRadius: '10px', px: 3 }}>Search</Button>
              <Button 
                variant="outlined" 
                color="warning" 
                startIcon={<ResetPasswordIcon />} 
                onClick={handleResetPassword}
                sx={{ borderRadius: '10px', fontWeight: 600, opacity: selected.length === 0 ? 0.6 : 1 }}
              >
                Reset Password ({selected.length})
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', minHeight: '400px' }} elevation={0}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  indeterminate={selected.length > 0 && selected.length < users.length}
                  checked={users.length > 0 && selected.length === users.length}
                  onChange={handleSelectAll} 
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>NIK</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>User Details</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Position/Division</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Upliner & Approval</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={7} align="center" sx={{ py: 10 }}><CircularProgress size={40} /></TableCell></TableRow> : users.map((user) => (
              <TableRow key={user.id} hover selected={selected.indexOf(user.id) !== -1}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.indexOf(user.id) !== -1} onChange={() => handleSelectOne(user.id)} />
                </TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 700 }}>{user.nik}</Typography></TableCell>
                <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}><Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light' }}>{user.fullName?.[0]}</Avatar><Box><Typography variant="body2" sx={{ fontWeight: 600 }}>{user.fullName}</Typography><Typography variant="caption" color="text.secondary">@{user.username}</Typography></Box></Box></TableCell>
                <TableCell><Typography variant="body2">{user.position}</Typography><Typography variant="caption" color="text.secondary">{user.division}</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{user.upliner || '-'}</Typography><Typography variant="caption" sx={{ color: 'primary.main', display: 'block', maxWidth: '200px' }}>{user.uplinerApproval || 'No Approval Set'}</Typography></TableCell>
                <TableCell><Chip label={user.status} size="small" color={user.status === 'ACTIVE' ? 'success' : 'default'} /></TableCell>
                <TableCell align="right"><Stack direction="row" spacing={1} justifyContent="flex-end"><IconButton size="small" onClick={() => handleOpenEdit(user)} color="primary"><EditIcon fontSize="small" /></IconButton><IconButton size="small" onClick={() => handleOpenApproval(user)} color="secondary"><ApprovalIcon fontSize="small" /></IconButton></Stack></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">Show Page :</Typography>
            <Select size="small" value={pageSize} onChange={handlePageSizeChange} sx={{ height: '32px' }}><MenuItem value={10}>10</MenuItem><MenuItem value={50}>50</MenuItem><MenuItem value={100}>100</MenuItem><MenuItem value={500}>500</MenuItem><MenuItem value={1000}>1000</MenuItem></Select>
            <Typography variant="body2">Showing {totalElements === 0 ? 0 : startEntry} to {endEntry} of {totalElements} entries</Typography>
          </Stack>
          <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" shape="rounded" />
        </Box>
      </TableContainer>

      {/* Modal Add/Edit */}
      <Dialog 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        maxWidth="sm" 
        fullWidth 
        disableRestoreFocus
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <DialogTitle component="div" sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
          <Typography component="div" sx={{ fontWeight: 800, fontSize: '1.2rem' }}>{editMode ? 'Update User Account' : 'Create New User Account'}</Typography>
          <IconButton onClick={() => setOpenModal(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField fullWidth label="NIK" value={formData.nik} onChange={(e) => setFormData({ ...formData, nik: e.target.value })} />
            <TextField fullWidth label="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            <TextField fullWidth label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <TextField fullWidth label="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            <TextField fullWidth label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <TextField select fullWidth label="Position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })}>
              {rolesList.length === 0 ? (
                <>
                  <MenuItem value="Manajer">Manajer</MenuItem>
                  <MenuItem value="SPV">SPV</MenuItem>
                  <MenuItem value="Staff">Staff</MenuItem>
                </>
              ) : (
                rolesList.map((r) => (
                  <MenuItem key={r.id} value={r.name}>
                    {r.name}
                  </MenuItem>
                ))
              )}
            </TextField>
            <TextField fullWidth label="Division" value={formData.division} onChange={(e) => setFormData({ ...formData, division: e.target.value })} />
            <TextField select fullWidth label="Upliner" value={formData.upliner} onChange={(e) => setFormData({ ...formData, upliner: e.target.value })}><MenuItem value="">None</MenuItem><MenuItem value="admin">Admin</MenuItem><MenuItem value="SPV HRD">SPV HRD</MenuItem></TextField>
            {editMode && (
              <TextField select fullWidth label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}><MenuItem value="ACTIVE">ACTIVE</MenuItem><MenuItem value="INACTIVE">INACTIVE</MenuItem></TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>{editMode ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Modal Add User Approval */}
      <Dialog 
        open={openApprovalModal} 
        onClose={() => { setOpenApprovalModal(false); fetchUsers(search, page, pageSize); }} 
        maxWidth="sm" 
        fullWidth 
        disableRestoreFocus
        slotProps={{ paper: { sx: { borderRadius: 4 } } }}
      >
        <DialogTitle component="div" sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
          <Typography component="div" sx={{ fontWeight: 800, fontSize: '1.2rem' }}>Add User Approval</Typography>
          <IconButton onClick={() => { setOpenApprovalModal(false); fetchUsers(search, page, pageSize); }} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', mt: 1 }}>
            <Box sx={{ flex: 1 }}>
              <SearchableSelect
                placeholder="Pilih Upliner Approval..."
                label="Upliner Approval"
                value={selectedUpliner}
                onChange={(val) => setSelectedUpliner(val || '')}
                options={potentialUpliners.map((u) => ({
                  label: `${u.nik} - ${u.fullName}`,
                  value: u.nik
                }))}
              />
            </Box>
            <Button variant="contained" onClick={handleSaveUpliner} sx={{ px: 4, height: '40px' }}>Save</Button>
          </Box>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f1f5f9' }}><TableRow><TableCell sx={{ fontWeight: 700 }}>No</TableCell><TableCell sx={{ fontWeight: 700 }}>NIK</TableCell><TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell><TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell></TableRow></TableHead>
              <TableBody>
                {existingUpliners.length === 0 ? <TableRow><TableCell colSpan={4} align="center" sx={{ py: 2 }}>No Approval Set</TableCell></TableRow> : existingUpliners.map((row, index) => (
                  <TableRow key={row.nik} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.nik}</TableCell>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell align="center"><IconButton size="small" onClick={() => confirmDeleteUpliner(row.nik)} color="error"><CancelIcon fontSize="small" /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}><Button onClick={() => { setOpenApprovalModal(false); fetchUsers(search, page, pageSize); }} variant="outlined" size="small">Close</Button></DialogActions>
      </Dialog>

      <CustomConfirmDialog
        open={confirmDialog.open}
        title={`Konfirmasi ${confirmDialog.type === 'RESET_PASSWORD' ? 'Reset Password' : 'Hapus'}`}
        message={confirmDialog.type === 'RESET_PASSWORD' 
          ? `Apakah Anda yakin ingin me-reset password untuk ${confirmDialog.data?.length || 0} user? Password akan diset berdasarkan Tanggal Lahir (jika ada).`
          : 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.'}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={handleConfirmDelete}
        confirmText="Ya, Lanjutkan"
        cancelText="Batal"
        type={confirmDialog.type === 'RESET_PASSWORD' ? 'warning' : 'error'}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UserList;
