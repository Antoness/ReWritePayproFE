import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel,
  Stack, Grid, IconButton, Tooltip, Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

  // Handle Search Trigger on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setKeyword(search);
      setPage(1);
    }
  };

  // Reset search when input is empty
  const handleSearchChange = (val) => {
    setSearch(val);
    if (val === '') {
      setKeyword('');
      setPage(1);
    }
  };

  // Bank Form Submission
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

  // Alias Form Submission
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

  // Helper function to bypass case sensitivity check for BCA validation in FE
  const isBca = (name) => {
    return name ? name.trim().toLowerCase() === 'bca' : false;
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Master Swift Code
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Kelola kode SWIFT bank dan alias nama bank
        </Typography>
      </Box>

      {/* Main card */}
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', mb: 4 }} elevation={0}>
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          {/* Search bar */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <TextField
              size="small"
              placeholder="Cari Nama Bank, Swift, BI..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ width: 280 }}
            />
            <Button
              variant="contained"
              onClick={() => { setKeyword(search); setPage(1); }}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              SEARCH
            </Button>
          </Stack>

          {/* Add Button */}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setBankForm({ namaBank: '', swiftCode: '', kodeBi: '', status: 'Aktif' });
              setBankErrors({ namaBank: false, swiftCode: false, kodeBi: false });
              setOpenAdd(true);
            }}
            sx={{ borderRadius: 2, color: '#3b82f6', borderColor: '#3b82f6', textTransform: 'none', fontWeight: 700 }}
          >
            +ADD
          </Button>
        </Stack>

        {/* Data Table */}
        <DataTable
          columns={[
            { id: 'no', label: 'No', render: (row, i) => ((page - 1) * pageSize) + i + 1 },
            { id: 'namaBank', label: 'Nama Bank' },
            { id: 'swiftCode', label: 'Kode SWIFT', render: (row) => row.swiftCode || '-' },
            { id: 'kodeBi', label: 'Kode BI' },
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
                    borderRadius: 1.5
                  }}
                />
              )
            },
            {
              id: 'actions',
              label: 'Aksi',
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
                    sx={{ color: '#3b82f6' }}
                  >
                    <EditIcon sx={{ fontSize: 18 }} />
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
      </Paper>

      {/* Add Bank Modal */}
      <CustomModal open={openAdd} onClose={() => setOpenAdd(false)} title="Add Bank">
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Nama Bank"
            fullWidth
            required
            value={bankForm.namaBank}
            onChange={(e) => setBankForm({ ...bankForm, namaBank: e.target.value })}
            error={bankErrors.namaBank}
            helperText={bankErrors.namaBank ? 'Nama Bank tidak boleh kosong' : ''}
          />
          <TextField
            label="Kode SWIFT"
            fullWidth
            required={bankForm.namaBank.trim().toLowerCase() !== 'bca'}
            value={bankForm.swiftCode}
            onChange={(e) => setBankForm({ ...bankForm, swiftCode: e.target.value })}
            error={bankErrors.swiftCode}
            helperText={bankErrors.swiftCode ? 'Kode SWIFT tidak boleh kosong (kecuali bank BCA)' : ''}
          />
          <TextField
            label="Kode BI"
            fullWidth
            required
            value={bankForm.kodeBi}
            onChange={(e) => setBankForm({ ...bankForm, kodeBi: e.target.value })}
            error={bankErrors.kodeBi}
            helperText={bankErrors.kodeBi ? 'Kode BI tidak boleh kosong' : ''}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenAdd(false)}
              sx={{ borderRadius: 2, color: '#64748b', borderColor: '#cbd5e1', textTransform: 'none', fontWeight: 700 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddBankSubmit}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              ADD
            </Button>
          </Stack>
        </Stack>
      </CustomModal>

      {/* Edit Bank & Alias Modal */}
      <CustomModal open={openEdit} onClose={() => setOpenEdit(false)} title="Edit Bank & Alias" maxWidth="md">
        <Stack spacing={4}>
          {/* Upper Section: Master Bank Details */}
          <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
              Master Bank Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Nama Bank"
                  size="small"
                  fullWidth
                  required
                  value={bankForm.namaBank}
                  onChange={(e) => setBankForm({ ...bankForm, namaBank: e.target.value })}
                  error={bankErrors.namaBank}
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
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Kode BI"
                  size="small"
                  fullWidth
                  required
                  value={bankForm.kodeBi}
                  onChange={(e) => setBankForm({ ...bankForm, kodeBi: e.target.value })}
                  error={bankErrors.kodeBi}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={bankForm.status}
                    label="Status"
                    onChange={(e) => setBankForm({ ...bankForm, status: e.target.value })}
                  >
                    <MenuItem value="Aktif">Aktif</MenuItem>
                    <MenuItem value="Non Aktif">Non Aktif</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleUpdateBankSubmit}
                sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
              >
                UPDATE MASTER
              </Button>
            </Box>
          </Paper>

          {/* Lower Section: Bank Alias List */}
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Bank Alias List
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
                sx={{ borderRadius: 2, color: '#3b82f6', borderColor: '#3b82f6', textTransform: 'none', fontWeight: 700 }}
              >
                +ADD
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
                        borderRadius: 1.5
                      }}
                    />
                  )
                },
                {
                  id: 'actions',
                  label: 'Aksi',
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
                      sx={{ color: '#3b82f6' }}
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
      <CustomModal open={openAddAlias} onClose={() => setOpenAddAlias(false)} title="Add Bank Alias">
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Nama Alias"
            fullWidth
            required
            value={aliasForm.namaAlias}
            onChange={(e) => setAliasForm({ ...aliasForm, namaAlias: e.target.value })}
            error={aliasErrors.namaAlias}
            helperText={aliasErrors.namaAlias ? 'Nama alias tidak boleh kosong' : ''}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenAddAlias(false)}
              sx={{ borderRadius: 2, color: '#64748b', borderColor: '#cbd5e1', textTransform: 'none', fontWeight: 700 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddAliasSubmit}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              ADD
            </Button>
          </Stack>
        </Stack>
      </CustomModal>

      {/* Sub-modal: Edit Alias */}
      <CustomModal open={openEditAlias} onClose={() => setOpenEditAlias(false)} title="Edit Bank Alias">
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Nama Alias"
            fullWidth
            required
            value={aliasForm.namaAlias}
            onChange={(e) => setAliasForm({ ...aliasForm, namaAlias: e.target.value })}
            error={aliasErrors.namaAlias}
            helperText={aliasErrors.namaAlias ? 'Nama alias tidak boleh kosong' : ''}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={aliasForm.status}
              label="Status"
              onChange={(e) => setAliasForm({ ...aliasForm, status: e.target.value })}
            >
              <MenuItem value="Aktif">Aktif</MenuItem>
              <MenuItem value="Non Aktif">Non Aktif</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenEditAlias(false)}
              sx={{ borderRadius: 2, color: '#64748b', borderColor: '#cbd5e1', textTransform: 'none', fontWeight: 700 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateAliasSubmit}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              UPDATE
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
