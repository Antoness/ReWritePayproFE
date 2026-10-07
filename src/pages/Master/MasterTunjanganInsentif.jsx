import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel,
  Stack, Chip, IconButton, Tooltip, CircularProgress, Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Tune as TuneIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ReceiptLong as ReceiptLongIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import { useCascadingDropdowns } from '../../hooks/useCascadingDropdowns';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export default function MasterTunjanganInsentif() {
  const { user } = useSelector((state) => state.auth);
  const userPosition = user?.position?.toUpperCase()?.trim() || '';
  const userPrivilege = user?.privilage?.toUpperCase()?.trim() || '';
  const isAdmin = userPrivilege === 'ADMIN' || userPosition === 'ADMIN' || userPosition === 'IT' || userPosition.includes('MANAJER');

  const [payrollComponents, setPayrollComponents] = useState([]);
  const [loadingComponents, setLoadingComponents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  const [openComponentModal, setOpenComponentModal] = useState(false);
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Cascading dropdown data
  const [ddCombinations, setDdCombinations] = useState([]);

  // Form values for filter dropdowns (cascading)
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');

  const emptyComponentForm = {
    name: '', type: 'TUNJANGAN', taxGroup: 'TAX',
    calcMethod: 'FIXED_VALUE', defaultValue: ''
  };
  const [componentForm, setComponentForm] = useState(emptyComponentForm);
  const [componentErrors, setComponentErrors] = useState({ name: false, defaultValue: false });

  const cascaded = useCascadingDropdowns(ddCombinations, {
    division: filterDivision,
    unit: filterUnit,
    position: filterPosition,
    employeeType: filterEmployeeType,
    branch: ''
  });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const fetchDropdownCombinations = useCallback(() => {
    axios.get(`${API_URL}/api/master-employee/dropdowns`, { headers: getAuthHeader() })
      .then(res => {
        if (res.data && res.data.combinations) {
          setDdCombinations(res.data.combinations);
        }
      })
      .catch(err => console.error('Failed to fetch dropdown combinations:', err));
  }, []);

  const fetchComponents = useCallback(() => {
    setLoadingComponents(true);
    axios.get(`${API_URL}/api/v1/payroll-components`, { headers: getAuthHeader() })
      .then(res => setPayrollComponents(res.data || []))
      .catch(err => {
        console.error('Failed to fetch payroll components:', err);
        showSnackbar('Gagal memuat data komponen payroll', 'error');
      })
      .finally(() => setLoadingComponents(false));
  }, []);

  useEffect(() => {
    fetchDropdownCombinations();
    fetchComponents();
  }, [fetchDropdownCombinations, fetchComponents]);

  const resetFilterDropdowns = () => {
    setFilterDivision('');
    setFilterUnit('');
    setFilterPosition('');
    setFilterEmployeeType('');
  };

  const handleOpenAddComponent = () => {
    setComponentForm(emptyComponentForm);
    setComponentErrors({ name: false, defaultValue: false });
    resetFilterDropdowns();
    setIsEditingComponent(false);
    setOpenComponentModal(true);
  };

  const handleOpenEditComponent = (comp) => {
    setSelectedComponent(comp);
    setComponentForm({
      name: comp.name,
      type: comp.type || 'TUNJANGAN',
      taxGroup: comp.taxGroup || 'TAX',
      calcMethod: comp.calcMethod || 'FIXED_VALUE',
      defaultValue: comp.defaultValue || '',
    });
    setFilterDivision(comp.applyToDivision || '');
    setFilterUnit(comp.applyToUnitName || '');
    setFilterPosition(comp.applyToPosition || '');
    setFilterEmployeeType(comp.applyToEmployeeType || '');
    setComponentErrors({ name: false, defaultValue: false });
    setIsEditingComponent(true);
    setOpenComponentModal(true);
  };

  const handleSaveComponent = () => {
    const isValEmpty = componentForm.defaultValue === '';
    if (!componentForm.name.trim() || isValEmpty) {
      setComponentErrors({ name: !componentForm.name.trim(), defaultValue: isValEmpty });
      return;
    }
    const payload = {
      name: componentForm.name,
      type: componentForm.type,
      taxGroup: componentForm.taxGroup,
      calcMethod: componentForm.calcMethod,
      defaultValue: Number(componentForm.defaultValue),
      applyToDivision: filterDivision || null,
      applyToUnitName: filterUnit || null,
      applyToPosition: filterPosition || null,
      applyToEmployeeType: filterEmployeeType || null,
      createdBy: user?.nama || user?.fullName || user?.username || 'Admin',
      modifiedBy: user?.nama || user?.fullName || user?.username || 'Admin',
    };
    const req = isEditingComponent
      ? axios.put(`${API_URL}/api/v1/payroll-components/${selectedComponent.id}`, payload, { headers: getAuthHeader() })
      : axios.post(`${API_URL}/api/v1/payroll-components`, payload, { headers: getAuthHeader() });

    req.then(() => {
      showSnackbar(isEditingComponent ? 'Komponen berhasil diupdate!' : 'Komponen berhasil ditambahkan!');
      setOpenComponentModal(false);
      fetchComponents();
    }).catch(err => {
      console.error(err);
      showSnackbar('Gagal menyimpan komponen.', 'error');
    });
  };

  const handleDeleteComponent = (comp) => {
    setConfirmDialog({
      open: true,
      title: 'Hapus Komponen Payroll',
      message: `Apakah Anda yakin ingin menghapus komponen: "${comp.name}"?`,
      onConfirm: () => {
        axios.delete(`${API_URL}/api/v1/payroll-components/${comp.id}?deletedBy=${user?.nama || user?.fullName || 'Admin'}`,
          { headers: getAuthHeader() })
          .then(() => {
            setConfirmDialog(c => ({ ...c, open: false }));
            showSnackbar('Komponen berhasil dihapus!');
            fetchComponents();
          })
          .catch(() => {
            setConfirmDialog(c => ({ ...c, open: false }));
            showSnackbar('Gagal menghapus komponen.', 'error');
          });
      }
    });
  };

  const filteredPayrollComponents = payrollComponents.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.applyToDivision || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (page - 1) * pageSize;
  const paginatedComponents = filteredPayrollComponents.slice(startIndex, startIndex + pageSize);

  const countTunjangan = payrollComponents.filter(c => c.type === 'TUNJANGAN').length;
  const countInsentif = payrollComponents.filter(c => c.type === 'INSENTIF').length;

  const renderApplyTo = (comp) => {
    const tags = [];
    if (comp.applyToDivision) tags.push(`Div: ${comp.applyToDivision}`);
    if (comp.applyToPosition) tags.push(`Pos: ${comp.applyToPosition}`);
    if (comp.applyToUnitName) tags.push(`Unit: ${comp.applyToUnitName}`);
    if (comp.applyToEmployeeType) tags.push(`Type: ${comp.applyToEmployeeType}`);
    if (tags.length === 0) return <Chip label="Semua Karyawan" size="small" variant="outlined" sx={{ borderRadius: '6px' }} />;
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {tags.map(t => <Chip key={t} label={t} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.7rem', borderRadius: '4px' }} />)}
      </Box>
    );
  };

  const payrollColumns = [
    { id: 'no', label: 'No', render: (row, i) => startIndex + i + 1 },
    {
      id: 'name',
      label: 'Nama Komponen',
      render: (r) => <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>{r.name}</Typography>
    },
    {
      id: 'type',
      label: 'Kategori',
      render: (r) => (
        <Chip
          label={r.type === 'TUNJANGAN' ? 'Tunjangan' : 'Insentif'}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.7rem',
            borderRadius: '6px',
            bgcolor: r.type === 'TUNJANGAN' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(124, 58, 237, 0.1)',
            color: r.type === 'TUNJANGAN' ? '#2563eb' : '#7c3aed'
          }}
        />
      )
    },
    {
      id: 'taxGroup',
      label: 'Tax Group',
      render: (r) => (
        <Chip
          label={r.taxGroup === 'TAX' ? 'Tax' : 'Non-Tax'}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.7rem',
            borderRadius: '6px',
            bgcolor: r.taxGroup === 'TAX' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: r.taxGroup === 'TAX' ? '#d97706' : '#10b981'
          }}
        />
      )
    },
    {
      id: 'calcMethod',
      label: 'Metode',
      render: (r) => r.calcMethod === 'FIXED_VALUE' ? 'Fixed (Nominal)' : 'Percentage (%)'
    },
    {
      id: 'defaultValue',
      label: 'Default Value',
      render: (r) => {
        const val = Number(r.defaultValue || 0);
        return (
          <Typography sx={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace' }}>
            {r.calcMethod === 'PERCENTAGE' ? `${val}%` : `Rp ${val.toLocaleString('id-ID')}`}
          </Typography>
        );
      }
    },
    { id: 'applyTo', label: 'Berlaku Untuk', render: (r) => renderApplyTo(r) },
    {
      id: 'actions',
      label: 'Aksi',
      align: 'center',
      render: (r) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="Edit Komponen">
            <IconButton
              size="small"
              onClick={() => handleOpenEditComponent(r)}
              sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.2)' }, borderRadius: '8px' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus Komponen">
            <IconButton
              size="small"
              onClick={() => handleDeleteComponent(r)}
              sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' }, borderRadius: '8px' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* 1. Header Banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{
          width: 52,
          height: 52,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05))',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TuneIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Master Konfigurasi Tunjangan & Insentif
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Pengaturan komponen tunjangan, insentif, kelompok pajak, dan kriteria penempatan karyawan
          </Typography>
        </Box>
      </Box>

      {/* 2. Top KPI Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: 'rgba(71, 85, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
              <TuneIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Komponen</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{payrollComponents.length} Komponen</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <AccountBalanceWalletIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Komponen Tunjangan</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563eb' }}>{countTunjangan} Komponen</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <ReceiptLongIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Komponen Insentif</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#7c3aed' }}>{countInsentif} Komponen</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <CheckCircleIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Sinkronisasi</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>Tersinkron</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. Search Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField 
              placeholder="Cari nama komponen atau divisi..." 
              fullWidth 
              size="small" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ 
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> 
              }} 
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={() => setSearchQuery('')}
              sx={{
                borderRadius: 2,
                height: 40,
                color: 'text.secondary',
                borderColor: 'divider',
                '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' }
              }}
            >
              <RefreshIcon fontSize="small" />
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 4. Action Toolbar DIRECTLY ABOVE DataTable */}
      <Box sx={{ p: 2, mb: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Daftar Komponen Tunjangan & Insentif
          </Typography>
          <Chip 
            label={`${filteredPayrollComponents.length} Data`} 
            size="small" 
            sx={{ bgcolor: 'action.hover', fontWeight: 700, borderRadius: '6px' }} 
          />
        </Stack>

        {isAdmin && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleOpenAddComponent}
            sx={{ 
              bgcolor: '#1e293b', 
              '&:hover': { bgcolor: '#0f172a' }, 
              borderRadius: 2, 
              textTransform: 'none', 
              fontWeight: 700, 
              height: 40
            }}
          >
            + TAMBAH KOMPONEN
          </Button>
        )}
      </Box>

      {/* 5. Main Data Table */}
      <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }} elevation={0}>
        {loadingComponents ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : (
          <DataTable 
            columns={payrollColumns} 
            data={paginatedComponents} 
            loading={false}
            page={page} 
            pageSize={pageSize}
            totalElements={filteredPayrollComponents.length}
            totalPages={Math.ceil(filteredPayrollComponents.length / pageSize) || 1}
            onPageChange={setPage} 
            onPageSizeChange={(sz) => { setPageSize(sz); setPage(1); }} 
          />
        )}
      </Paper>

      {/* MODAL: Add/Edit Payroll Component */}
      <CustomModal 
        open={openComponentModal} 
        onClose={() => setOpenComponentModal(false)}
        title={isEditingComponent ? 'Edit Komponen Payroll' : 'Tambah Komponen Payroll Baru'}
        maxWidth="sm"
      >
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField 
            label="Nama Komponen *" 
            fullWidth 
            size="small" 
            placeholder="Contoh: Tunjangan Kehadiran, Insentif Shift"
            value={componentForm.name}
            onChange={(e) => setComponentForm({ ...componentForm, name: e.target.value })}
            error={componentErrors.name} 
            helperText={componentErrors.name ? 'Nama komponen wajib diisi' : ''} 
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select 
                value={componentForm.type} 
                label="Kategori"
                onChange={(e) => setComponentForm({ ...componentForm, type: e.target.value })}
              >
                <MenuItem value="TUNJANGAN">Tunjangan</MenuItem>
                <MenuItem value="INSENTIF">Insentif</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Tax Group</InputLabel>
              <Select 
                value={componentForm.taxGroup} 
                label="Tax Group"
                onChange={(e) => setComponentForm({ ...componentForm, taxGroup: e.target.value })}
              >
                <MenuItem value="TAX">Tax (Kena Pajak)</MenuItem>
                <MenuItem value="NON_TAX">Non-Tax (Bebas Pajak)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Metode Kalkulasi</InputLabel>
              <Select 
                value={componentForm.calcMethod} 
                label="Metode Kalkulasi"
                onChange={(e) => setComponentForm({ ...componentForm, calcMethod: e.target.value })}
              >
                <MenuItem value="FIXED_VALUE">Fixed Value (Nominal Tetap)</MenuItem>
                <MenuItem value="PERCENTAGE">Percentage (% Gaji Pokok)</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              label={componentForm.calcMethod === 'PERCENTAGE' ? 'Default Value (%) *' : 'Default Value (Rp) *'} 
              fullWidth 
              size="small" 
              type="number"
              placeholder={componentForm.calcMethod === 'PERCENTAGE' ? '5' : '100000'}
              value={componentForm.defaultValue}
              onChange={(e) => setComponentForm({ ...componentForm, defaultValue: e.target.value })}
              error={componentErrors.defaultValue} 
              helperText={componentErrors.defaultValue ? 'Default value wajib diisi' : ''} 
            />
          </Box>

          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', pt: 1 }}>
            Kriteria Penempatan (Opsional — Kosongkan untuk semua karyawan)
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <SearchableSelect
              label="Divisi / Client"
              value={filterDivision}
              options={cascaded.divisions.map(d => ({ value: d, label: d }))}
              onChange={(val) => { setFilterDivision(val); setFilterUnit(''); setFilterPosition(''); }}
              placeholder="Semua Divisi"
            />
            <SearchableSelect
              label="Unit Kerja"
              value={filterUnit}
              options={cascaded.units.map(u => ({ value: u, label: u }))}
              onChange={(val) => setFilterUnit(val)}
              placeholder="Semua Unit"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <SearchableSelect
              label="Posisi / Jabatan"
              value={filterPosition}
              options={cascaded.positions.map(p => ({ value: p, label: p }))}
              onChange={(val) => setFilterPosition(val)}
              placeholder="Semua Posisi"
            />
            <SearchableSelect
              label="Tipe Karyawan"
              value={filterEmployeeType}
              options={cascaded.employeeTypes.map(t => ({ value: t, label: t }))}
              onChange={(val) => setFilterEmployeeType(val)}
              placeholder="Semua Tipe"
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleSaveComponent}
              sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' }, borderRadius: 2, px: 4, fontWeight: 700, textTransform: 'none' }}
            >
              {isEditingComponent ? 'UPDATE' : 'SIMPAN'}
            </Button>
          </Box>
        </Stack>
      </CustomModal>

      <CustomConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(c => ({ ...c, open: false }))}
      />

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      />
    </Box>
  );
}
