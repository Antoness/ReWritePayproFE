import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel,
  Stack, Grid, IconButton, Tooltip, Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';

// Initial Mock Data for Master Banks
const INITIAL_BANKS = [
  { id: 1, namaBank: 'STANDARD CHARTERED BANK', kodeSwift: 'SCBLIDJX', kodeBi: '0500306', status: 'Aktif', createdBy: 'SPV HRD', createdDate: '2026-07-29T10:00:00' },
  { id: 2, namaBank: 'PT BANK PEMBANGUNAN DAERAH PAPUA', kodeSwift: 'PDIJIDJ1', kodeBi: '1320019', status: 'Aktif', createdBy: 'SPV HRD', createdDate: '2026-07-29T10:15:00' },
  { id: 3, namaBank: 'PT BANK PEMBANGUNAN DAERAH NTT', kodeSwift: 'PDNTIDJA', kodeBi: '1300013', status: 'Aktif', createdBy: 'System', createdDate: '2026-07-29T10:30:00' },
  { id: 4, namaBank: 'PT BANK PEMBANGUNAN DAERAH MALUKU DAN MALUKU UTARA', kodeSwift: 'PDMLIDJ1', kodeBi: '1310016', status: 'Aktif', createdBy: 'System', createdDate: '2026-07-29T10:45:00' },
  { id: 5, namaBank: 'PT BANK PEMBANGUNAN DAERAH LAMPUNG', kodeSwift: 'PDLPIDJ1', kodeBi: '1210051', status: 'Aktif', createdBy: 'System', createdDate: '2026-07-29T11:00:00' }
];

// Initial Mock Data for Bank Aliases
const INITIAL_ALIASES = [
  { id: 1, bankId: 1, nama: 'SC Bank', status: 'Aktif', createdBy: 'SPV HRD', createdDate: '2026-07-29T10:05:00' },
  { id: 2, bankId: 1, nama: 'StanChart', status: 'Aktif', createdBy: 'System', createdDate: '2026-07-29T10:06:00' },
  { id: 3, bankId: 2, nama: 'Bank Papua', status: 'Aktif', createdBy: 'SPV HRD', createdDate: '2026-07-29T10:20:00' }
];

const MasterSwiftCode = () => {
  const { user } = useSelector((state) => state.auth);

  // Core States (Purely Frontend/Mock)
  const [banksList, setBanksList] = useState(INITIAL_BANKS);
  const [aliasesList, setAliasesList] = useState(INITIAL_ALIASES);

  // Main list states
  const [filteredBanks, setFilteredBanks] = useState([]);
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
    kodeSwift: '',
    kodeBi: '',
    status: 'Aktif'
  });
  const [bankErrors, setBankErrors] = useState({
    namaBank: false,
    kodeSwift: false,
    kodeBi: false
  });

  // Alias states
  const [filteredAliases, setFilteredAliases] = useState([]);
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
    nama: '',
    status: 'Aktif'
  });
  const [aliasErrors, setAliasErrors] = useState({
    nama: false
  });

  // Confirm dialog and snackbar
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Sync / Filter Banks locally
  useEffect(() => {
    setLoading(true);
    let result = [...banksList];
    if (keyword) {
      const kw = keyword.toLowerCase();
      result = result.filter(b => 
        b.namaBank.toLowerCase().includes(kw) || 
        b.kodeSwift.toLowerCase().includes(kw) || 
        b.kodeBi.toLowerCase().includes(kw)
      );
    }
    
    // Pagination simulation
    const startIndex = (page - 1) * pageSize;
    const paginated = result.slice(startIndex, startIndex + pageSize);
    
    setFilteredBanks(paginated);
    setTotalElements(result.length);
    setTotalPages(Math.ceil(result.length / pageSize) || 1);
    setLoading(false);
  }, [banksList, page, pageSize, keyword]);

  // Sync / Filter Aliases locally
  useEffect(() => {
    if (!selectedBank) return;
    setAliasLoading(true);
    let result = aliasesList.filter(a => a.bankId === selectedBank.id);
    
    const startIndex = (aliasPage - 1) * aliasPageSize;
    const paginated = result.slice(startIndex, startIndex + aliasPageSize);
    
    setFilteredAliases(paginated);
    setAliasTotalElements(result.length);
    setAliasTotalPages(Math.ceil(result.length / aliasPageSize) || 1);
    setAliasLoading(false);
  }, [aliasesList, selectedBank, aliasPage, aliasPageSize]);

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
      kodeSwift: !bankForm.kodeSwift.trim(),
      kodeBi: !bankForm.kodeBi.trim()
    };
    setBankErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleAddBankSubmit = () => {
    if (!validateBankForm()) return;
    
    const newBank = {
      id: Date.now(),
      namaBank: bankForm.namaBank.toUpperCase(),
      kodeSwift: bankForm.kodeSwift.toUpperCase(),
      kodeBi: bankForm.kodeBi,
      status: 'Aktif',
      createdBy: user?.fullname || 'System',
      createdDate: new Date().toISOString()
    };

    setBanksList([newBank, ...banksList]);
    showSnackbar('Berhasil menambahkan bank baru (Mock)', 'success');
    setOpenAdd(false);
    setBankForm({ namaBank: '', kodeSwift: '', kodeBi: '', status: 'Aktif' });
  };

  const handleUpdateBankSubmit = () => {
    if (!validateBankForm() || !selectedBank) return;
    
    const updated = banksList.map(b => {
      if (b.id === selectedBank.id) {
        return {
          ...b,
          namaBank: bankForm.namaBank.toUpperCase(),
          kodeSwift: bankForm.kodeSwift.toUpperCase(),
          kodeBi: bankForm.kodeBi,
          status: bankForm.status,
          modifyBy: user?.fullname || 'System',
          modifyDate: new Date().toISOString()
        };
      }
      return b;
    });

    setBanksList(updated);
    showSnackbar('Berhasil memperbarui data bank (Mock)', 'success');
    setOpenEdit(false);
    setSelectedBank(null);
  };

  const handleDeleteBankClick = (row) => {
    setConfirmDialog({
      open: true,
      title: 'Hapus Bank',
      message: `Apakah Anda yakin ingin menghapus bank ${row.namaBank}? Semua alias bank yang terhubung juga akan dihapus.`,
      onConfirm: () => {
        setBanksList(banksList.filter(b => b.id !== row.id));
        setAliasesList(aliasesList.filter(a => a.bankId !== row.id));
        showSnackbar('Berhasil menghapus bank (Mock)', 'success');
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  // Alias Form Submission
  const validateAliasForm = () => {
    const errors = {
      nama: !aliasForm.nama.trim()
    };
    setAliasErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleAddAliasSubmit = () => {
    if (!validateAliasForm() || !selectedBank) return;

    const newAlias = {
      id: Date.now(),
      bankId: selectedBank.id,
      nama: aliasForm.nama,
      status: 'Aktif',
      createdBy: user?.fullname || 'System',
      createdDate: new Date().toISOString()
    };

    setAliasesList([newAlias, ...aliasesList]);
    showSnackbar('Berhasil menambahkan alias bank (Mock)', 'success');
    setOpenAddAlias(false);
    setAliasForm({ nama: '', status: 'Aktif' });
    setAliasPage(1);
  };

  const handleUpdateAliasSubmit = () => {
    if (!validateAliasForm() || !selectedAlias || !selectedBank) return;

    const updated = aliasesList.map(a => {
      if (a.id === selectedAlias.id) {
        return {
          ...a,
          nama: aliasForm.nama,
          status: aliasForm.status,
          modifyBy: user?.fullname || 'System',
          modifyDate: new Date().toISOString()
        };
      }
      return a;
    });

    setAliasesList(updated);
    showSnackbar('Berhasil memperbarui alias bank (Mock)', 'success');
    setOpenEditAlias(false);
    setSelectedAlias(null);
  };

  const handleDeleteAliasClick = (aliasRow) => {
    setConfirmDialog({
      open: true,
      title: 'Hapus Alias',
      message: `Apakah Anda yakin ingin menghapus alias ${aliasRow.nama}?`,
      onConfirm: () => {
        setAliasesList(aliasesList.filter(a => a.id !== aliasRow.id));
        showSnackbar('Berhasil menghapus alias (Mock)', 'success');
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const formatDateTime = (dt) => {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('id-ID');
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
              setBankForm({ namaBank: '', kodeSwift: '', kodeBi: '', status: 'Aktif' });
              setBankErrors({ namaBank: false, kodeSwift: false, kodeBi: false });
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
            { id: 'kodeSwift', label: 'Kode SWIFT' },
            { id: 'kodeBi', label: 'Kode BI' },
            {
              id: 'tanggal',
              label: 'Tanggal Input / Update',
              render: (row) => formatDateTime(row.modifyDate || row.createdDate)
            },
            {
              id: 'pic',
              label: 'PIC Input / Update',
              render: (row) => row.modifyBy || row.createdBy || '-'
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
                        kodeSwift: row.kodeSwift,
                        kodeBi: row.kodeBi,
                        status: row.status
                      });
                      setBankErrors({ namaBank: false, kodeSwift: false, kodeBi: false });
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
          data={filteredBanks}
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
            required
            value={bankForm.kodeSwift}
            onChange={(e) => setBankForm({ ...bankForm, kodeSwift: e.target.value })}
            error={bankErrors.kodeSwift}
            helperText={bankErrors.kodeSwift ? 'Kode SWIFT tidak boleh kosong' : ''}
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
                  required
                  value={bankForm.kodeSwift}
                  onChange={(e) => setBankForm({ ...bankForm, kodeSwift: e.target.value })}
                  error={bankErrors.kodeSwift}
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
                  setAliasForm({ nama: '', status: 'Aktif' });
                  setAliasErrors({ nama: false });
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
                { id: 'nama', label: 'Nama Alias' },
                {
                  id: 'tanggal',
                  label: 'Tanggal Input',
                  render: (row) => formatDateTime(row.modifyDate || row.createdDate)
                },
                {
                  id: 'pic',
                  label: 'PIC',
                  render: (row) => row.modifyBy || row.createdBy || '-'
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
                          nama: row.nama,
                          status: row.status
                        });
                        setAliasErrors({ nama: false });
                        setOpenEditAlias(true);
                      }}
                      sx={{ color: '#3b82f6' }}
                    >
                      <EditIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  )
                }
              ]}
              data={filteredAliases}
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
            value={aliasForm.nama}
            onChange={(e) => setAliasForm({ ...aliasForm, nama: e.target.value })}
            error={aliasErrors.nama}
            helperText={aliasErrors.nama ? 'Nama alias tidak boleh kosong' : ''}
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
            value={aliasForm.nama}
            onChange={(e) => setAliasForm({ ...aliasForm, nama: e.target.value })}
            error={aliasErrors.nama}
            helperText={aliasErrors.nama ? 'Nama alias tidak boleh kosong' : ''}
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
