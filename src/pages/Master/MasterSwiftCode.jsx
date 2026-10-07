import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel,
  Stack, Grid, IconButton, Tooltip, Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  SwapHoriz as SwapHorizIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

const MasterSwiftCode = () => {
  const { user } = useSelector((state) => state.auth);

  // Main list states
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  // Form states for Bank
  const [bankForm, setBankForm] = useState({
    namaBank: '',
    swiftCode: '',
    kodeBi: '',
    status: 'Aktif'
  });
  const [bankErrors, setBankErrors] = useState({
    namaBank: false,
    swiftCode: false,
    kodeBi: false
  });

  // Alias states
  const [aliases, setAliases] = useState([]);
  const [aliasLoading, setAliasLoading] = useState(false);
  const [aliasPage, setAliasPage] = useState(1);
  const [aliasPageSize, setAliasPageSize] = useState(10);
  const [aliasTotalElements, setAliasTotalElements] = useState(0);
  const [aliasTotalPages, setAliasTotalPages] = useState(1);

  // Sub-modal states for Alias
  const [openAddAlias, setOpenAddAlias] = useState(false);
  const [openEditAlias, setOpenEditAlias] = useState(false);
  const [selectedAlias, setSelectedAlias] = useState(null);
  const [aliasForm, setAliasForm] = useState({
    namaAlias: '',
    status: 'Aktif'
  });
  const [aliasErrors, setAliasErrors] = useState({
    namaAlias: false
  });

  // Confirm dialog and snackbar
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-bank`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          keyword: keyword || undefined,
          page,
          size: pageSize
        }
      });
      if (response.data) {
        setBanks(response.data.data || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      showSnackbar('Gagal mengambil data bank', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAliases = async (bankId) => {
    if (!bankId) return;
    setAliasLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-bank/${bankId}/alias`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: aliasPage,
          size: aliasPageSize
        }
      });
      if (response.data) {
        setAliases(response.data.data || []);
        setAliasTotalElements(response.data.totalElements || 0);
        setAliasTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch aliases:', error);
      showSnackbar('Gagal mengambil data alias bank', 'error');
    } finally {
      setAliasLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, [page, pageSize, keyword]);

  useEffect(() => {
    if (selectedBank) {
      fetchAliases(selectedBank.id);
    }
  }, [selectedBank, aliasPage, aliasPageSize]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setKeyword(search);
      setPage(1);
    }
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    if (val === '') {
      setKeyword('');
      setPage(1);
    }
  };

  const validateBankForm = () => {
    const errors = {
      namaBank: !bankForm.namaBank.trim(),
      swiftCode: !bankForm.swiftCode.trim() && !(bankForm.namaBank.trim().toLowerCase() === 'bca'),
      kodeBi: !bankForm.kodeBi.trim()
    };
    setBankErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleAddBankSubmit = async () => {
    if (!validateBankForm()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/master-bank`, bankForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Berhasil menambahkan bank baru', 'success');
      setOpenAdd(false);
      setBankForm({ namaBank: '', swiftCode: '', kodeBi: '', status: 'Aktif' });
      fetchBanks();
    } catch (error) {
      console.error('Failed to add bank:', error);
      showSnackbar(error.response?.data?.error || 'Gagal menambahkan bank', 'error');
    }
  };

  const handleUpdateBankSubmit = async () => {
    if (!validateBankForm() || !selectedBank) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/master-bank/${selectedBank.id}`, bankForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Berhasil memperbarui data bank', 'success');
      setOpenEdit(false);
      setSelectedBank(null);
      fetchBanks();
    } catch (error) {
      console.error('Failed to update bank:', error);
      showSnackbar(error.response?.data?.error || 'Gagal memperbarui bank', 'error');
    }
  };

  const validateAliasForm = () => {
    const errors = {
      namaAlias: !aliasForm.namaAlias.trim()
    };
    setAliasErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleAddAliasSubmit = async () => {
    if (!validateAliasForm() || !selectedBank) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/master-bank/${selectedBank.id}/alias`, aliasForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Berhasil menambahkan alias bank', 'success');
      setOpenAddAlias(false);
      setAliasForm({ namaAlias: '', status: 'Aktif' });
      setAliasPage(1);
      fetchAliases(selectedBank.id);
    } catch (error) {
      console.error('Failed to add alias:', error);
      showSnackbar(error.response?.data?.error || 'Gagal menambahkan alias', 'error');
    }
  };

  const handleUpdateAliasSubmit = async () => {
    if (!validateAliasForm() || !selectedAlias || !selectedBank) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/master-bank/alias/${selectedAlias.id}`, aliasForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Berhasil memperbarui alias bank', 'success');
      setOpenEditAlias(false);
      setSelectedAlias(null);
      fetchAliases(selectedBank.id);
    } catch (error) {
      console.error('Failed to update alias:', error);
      showSnackbar(error.response?.data?.error || 'Gagal memperbarui alias', 'error');
    }
  };

  const formatDateTime = (dt) => {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('id-ID');
  };

  const activeCount = banks.filter(b => b.status === 'Aktif').length;
  const inactiveCount = banks.filter(b => b.status !== 'Aktif').length;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{
          width: 52,
          height: 52,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)'
        }}>
          <AccountBalanceIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Master Swift Code & Bank
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Kelola kode SWIFT bank, kode BI kliring, dan alias nama rekening payroll
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca' }}>
              <AccountBalanceIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Bank Terdaftar</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{totalElements} Bank</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <CheckCircleIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Bank Aktif</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>{activeCount} Bank</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <CancelIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Bank Non-Aktif</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{inactiveCount} Bank</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <SwapHorizIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Sistem Kliring</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>BI-FAST / SKN</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Cari Nama Bank, Kode SWIFT, Kode BI..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1.5}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => { setKeyword(search); setPage(1); }}
                sx={{
                  bgcolor: '#1e293b',
                  '&:hover': { bgcolor: '#0f172a' },
                  borderRadius: '10px',
                  height: '40px',
                  fontWeight: 700,
                  boxShadow: 'none'
                }}
              >
                SEARCH
              </Button>
              <Button
                variant="outlined"
                onClick={() => { setSearch(''); setKeyword(''); setPage(1); }}
                sx={{
                  borderRadius: '10px',
                  height: '40px',
                  color: 'text.secondary',
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'text.primary' }
                }}
              >
                <RefreshIcon fontSize="small" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Action Toolbar Directly Above Table */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: '14px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }} elevation={0}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Daftar Kode SWIFT & Bank
          </Typography>
          <Chip label={`${totalElements} Bank`} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 700, borderRadius: '6px' }} />
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setBankForm({ namaBank: '', swiftCode: '', kodeBi: '', status: 'Aktif' });
            setBankErrors({ namaBank: false, swiftCode: false, kodeBi: false });
            setOpenAdd(true);
          }}
          sx={{
            borderRadius: '10px',
            fontWeight: 700,
            bgcolor: '#3b82f6',
            '&:hover': { bgcolor: '#2563eb' },
            boxShadow: 'none'
          }}
        >
          + TAMBAH BANK
        </Button>
      </Paper>

      {/* Data Table */}
      <DataTable
        columns={[
          { id: 'no', label: 'No', render: (row, i) => ((page - 1) * pageSize) + i + 1 },
          { 
            id: 'namaBank', 
            label: 'Nama Bank',
            render: (row) => <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{row.namaBank}</Typography>
          },
          { 
            id: 'swiftCode', 
            label: 'Kode SWIFT', 
            render: (row) => (
              <Chip 
                label={row.swiftCode || '-'} 
                size="small" 
                sx={{ fontFamily: 'monospace', fontWeight: 700, bgcolor: 'action.hover', borderRadius: '6px' }} 
              />
            )
          },
          { 
            id: 'kodeBi', 
            label: 'Kode BI',
            render: (row) => (
              <Typography sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.kodeBi || '-'}</Typography>
            )
          },
          {
            id: 'tanggal',
            label: 'Tanggal Input / Update',
            render: (row) => formatDateTime(row.tanggalInputUpdate)
          },
          {
            id: 'pic',
            label: 'PIC Input / Update',
            render: (row) => row.picInputUpdate || '-'
          },
          {
            id: 'status',
            label: 'Status',
            render: (row) => (
              <Chip
                label={row.status}
                size="small"
                sx={{
                  bgcolor: row.status === 'Aktif' ? '#ecfdf5' : '#fef2f2',
                  color: row.status === 'Aktif' ? '#059669' : '#dc2626',
                  fontWeight: 700,
                  borderRadius: '6px'
                }}
              />
            )
          },
          {
            id: 'actions',
            label: 'Aksi',
            align: 'center',
            render: (row) => (
              <Tooltip title="Edit Bank & Alias">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedBank(row);
                    setBankForm({
                      namaBank: row.namaBank,
                      swiftCode: row.swiftCode || '',
                      kodeBi: row.kodeBi,
                      status: row.status
                    });
                    setBankErrors({ namaBank: false, swiftCode: false, kodeBi: false });
                    setAliasPage(1);
                    setOpenEdit(true);
                  }}
                  sx={{ bgcolor: '#eff6ff', color: '#3b82f6', '&:hover': { bgcolor: '#dbeafe' }, borderRadius: '8px' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )
          }
        ]}
        data={banks}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      {/* Add Bank Modal */}
      <CustomModal open={openAdd} onClose={() => setOpenAdd(false)} title="Tambah Data Bank Baru">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Nama Bank"
            fullWidth
            size="small"
            required
            placeholder="Contoh: BANK CENTRAL ASIA"
            value={bankForm.namaBank}
            onChange={(e) => setBankForm({ ...bankForm, namaBank: e.target.value })}
            error={bankErrors.namaBank}
            helperText={bankErrors.namaBank ? 'Nama Bank tidak boleh kosong' : ''}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField
            label="Kode SWIFT"
            fullWidth
            size="small"
            required={bankForm.namaBank.trim().toLowerCase() !== 'bca'}
            placeholder="Contoh: CENAIDJA"
            value={bankForm.swiftCode}
            onChange={(e) => setBankForm({ ...bankForm, swiftCode: e.target.value })}
            error={bankErrors.swiftCode}
            helperText={bankErrors.swiftCode ? 'Kode SWIFT tidak boleh kosong (kecuali bank BCA)' : ''}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField
            label="Kode BI Kliring"
            fullWidth
            size="small"
            required
            placeholder="Contoh: 014"
            value={bankForm.kodeBi}
            onChange={(e) => setBankForm({ ...bankForm, kodeBi: e.target.value })}
            error={bankErrors.kodeBi}
            helperText={bankErrors.kodeBi ? 'Kode BI tidak boleh kosong' : ''}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenAdd(false)}
              sx={{ borderRadius: '8px', color: 'text.secondary', borderColor: 'divider', textTransform: 'none', fontWeight: 700 }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleAddBankSubmit}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: '8px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
            >
              SIMPAN
            </Button>
          </Stack>
        </Stack>
      </CustomModal>

      {/* Edit Bank & Alias Modal */}
      <CustomModal open={openEdit} onClose={() => setOpenEdit(false)} title="Edit Bank & Konfigurasi Alias" maxWidth="md">
        <Stack spacing={3}>
          {/* Upper Section: Master Bank Details */}
          <Paper sx={{ p: 2.5, borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 2 }}>
              Informasi Master Bank
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  label="Nama Bank"
                  size="small"
                  fullWidth
                  required
                  value={bankForm.namaBank}
                  onChange={(e) => setBankForm({ ...bankForm, namaBank: e.target.value })}
                  error={bankErrors.namaBank}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Kode SWIFT"
                  size="small"
                  fullWidth
                  required={bankForm.namaBank.trim().toLowerCase() !== 'bca'}
                  value={bankForm.swiftCode}
                  onChange={(e) => setBankForm({ ...bankForm, swiftCode: e.target.value })}
                  error={bankErrors.swiftCode}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Kode BI Kliring"
                  size="small"
                  fullWidth
                  required
                  value={bankForm.kodeBi}
                  onChange={(e) => setBankForm({ ...bankForm, kodeBi: e.target.value })}
                  error={bankErrors.kodeBi}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={bankForm.status}
                    label="Status"
                    onChange={(e) => setBankForm({ ...bankForm, status: e.target.value })}
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="Aktif">Aktif</MenuItem>
                    <MenuItem value="Non Aktif">Non Aktif</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2.5 }}>
              <Button
                variant="contained"
                onClick={handleUpdateBankSubmit}
                sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: '8px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
              >
                UPDATE BANK
              </Button>
            </Box>
          </Paper>

          {/* Lower Section: Bank Alias List */}
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Daftar Alias Nama Bank
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  setAliasForm({ namaAlias: '', status: 'Aktif' });
                  setAliasErrors({ namaAlias: false });
                  setOpenAddAlias(true);
                }}
                sx={{ borderRadius: '8px', color: '#3b82f6', borderColor: '#3b82f6', textTransform: 'none', fontWeight: 700 }}
              >
                + TAMBAH ALIAS
              </Button>
            </Box>

            <DataTable
              columns={[
                { id: 'no', label: 'No', render: (row, i) => ((aliasPage - 1) * aliasPageSize) + i + 1 },
                { id: 'namaAlias', label: 'Nama Alias' },
                {
                  id: 'tanggal',
                  label: 'Tanggal Input',
                  render: (row) => formatDateTime(row.createdDate)
                },
                {
                  id: 'pic',
                  label: 'PIC',
                  render: (row) => row.createdBy || '-'
                },
                {
                  id: 'status',
                  label: 'Status',
                  render: (row) => (
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        bgcolor: row.status === 'Aktif' ? '#ecfdf5' : '#fef2f2',
                        color: row.status === 'Aktif' ? '#059669' : '#dc2626',
                        fontWeight: 700,
                        borderRadius: '6px'
                      }}
                    />
                  )
                },
                {
                  id: 'actions',
                  label: 'Aksi',
                  align: 'center',
                  render: (row) => (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedAlias(row);
                        setAliasForm({
                          namaAlias: row.namaAlias,
                          status: row.status
                        });
                        setAliasErrors({ namaAlias: false });
                        setOpenEditAlias(true);
                      }}
                      sx={{ bgcolor: '#eff6ff', color: '#3b82f6', '&:hover': { bgcolor: '#dbeafe' }, borderRadius: '8px' }}
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )
                }
              ]}
              data={aliases}
              loading={aliasLoading}
              page={aliasPage}
              pageSize={aliasPageSize}
              totalElements={aliasTotalElements}
              totalPages={aliasTotalPages}
              onPageChange={setAliasPage}
              onPageSizeChange={(size) => {
                setAliasPageSize(size);
                setAliasPage(1);
              }}
            />
          </Stack>
        </Stack>
      </CustomModal>

      {/* Sub-modal: Add Alias */}
      <CustomModal open={openAddAlias} onClose={() => setOpenAddAlias(false)} title="Tambah Alias Nama Bank">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Nama Alias"
            fullWidth
            size="small"
            required
            placeholder="Contoh: BCA CABANG JAKARTA"
            value={aliasForm.namaAlias}
            onChange={(e) => setAliasForm({ ...aliasForm, namaAlias: e.target.value })}
            error={aliasErrors.namaAlias}
            helperText={aliasErrors.namaAlias ? 'Nama alias tidak boleh kosong' : ''}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenAddAlias(false)}
              sx={{ borderRadius: '8px', color: 'text.secondary', borderColor: 'divider', textTransform: 'none', fontWeight: 700 }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleAddAliasSubmit}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: '8px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
            >
              SIMPAN ALIAS
            </Button>
          </Stack>
        </Stack>
      </CustomModal>

      {/* Sub-modal: Edit Alias */}
      <CustomModal open={openEditAlias} onClose={() => setOpenEditAlias(false)} title="Edit Alias Nama Bank">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Nama Alias"
            fullWidth
            size="small"
            required
            value={aliasForm.namaAlias}
            onChange={(e) => setAliasForm({ ...aliasForm, namaAlias: e.target.value })}
            error={aliasErrors.namaAlias}
            helperText={aliasErrors.namaAlias ? 'Nama alias tidak boleh kosong' : ''}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={aliasForm.status}
              label="Status"
              onChange={(e) => setAliasForm({ ...aliasForm, status: e.target.value })}
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="Aktif">Aktif</MenuItem>
              <MenuItem value="Non Aktif">Non Aktif</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenEditAlias(false)}
              sx={{ borderRadius: '8px', color: 'text.secondary', borderColor: 'divider', textTransform: 'none', fontWeight: 700 }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateAliasSubmit}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: '8px', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}
            >
              UPDATE ALIAS
            </Button>
          </Stack>
        </Stack>
      </CustomModal>

      {/* Global Alerts & Dialogs */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default MasterSwiftCode;
