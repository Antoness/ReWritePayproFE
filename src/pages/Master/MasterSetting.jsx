import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel,
  Stack, Chip, IconButton, Tab, Tabs, CircularProgress, Grid, Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Tune as TuneIcon,
  Settings as SettingsIcon,
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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const INITIAL_GENERAL_SETTINGS = [
  { id: 1, settingKey: 'SPT21.DIR.NAME', value: 'SULIST', numberVal: '', createdDate: '2024-06-05 13:26:45.0', createdBy: 'System', modifyDate: '2024-06-05 13:26:45.0', modifyBy: 'Staff HRD' },
  { id: 2, settingKey: 'SPT21.DIR.NPWP', value: '12345', numberVal: '', createdDate: '2023-10-31 05:48:43.0', createdBy: 'System', modifyDate: '2023-10-31 05:48:43.0', modifyBy: 'SPV HRD' },
  { id: 3, settingKey: 'Test', value: '123', numberVal: '', createdDate: '2026-05-28 09:12:10.0', createdBy: 'SPV HRD', modifyDate: '2026-05-28 09:13:26.0', modifyBy: 'Staff HRD' },
  { id: 4, settingKey: 'test_Staff', value: '1234staff', numberVal: '', createdDate: '2026-05-28 09:16:15.0', createdBy: 'Staff HRD', modifyDate: '', modifyBy: '' },
  { id: 5, settingKey: 'Widya', value: 'A2', numberVal: '', createdDate: '2025-12-29 15:23:06.0', createdBy: 'SPV HRD', modifyDate: '2025-12-29 15:29:22.0', modifyBy: 'Staff HRD' }
];

export default function MasterSetting({ defaultTab = 0 }) {
  const { user } = useSelector((state) => state.auth);
  const userPosition = user?.position?.toUpperCase()?.trim() || '';
  const userPrivilege = user?.privilage?.toUpperCase()?.trim() || '';
  const isAdmin = userPrivilege === 'ADMIN' || userPosition === 'ADMIN' || userPosition === 'IT' || userPosition.includes('MANAJER');
  const isSpv = (userPosition.includes('SUPERVISOR') || userPosition.includes('SPV')) && !userPosition.includes('MANAJER');

  const [tabValue, setTabValue] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setTabValue(defaultTab);
  }, [defaultTab]);

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // Tab 1: General Settings state
  const [generalSettings, setGeneralSettings] = useState(INITIAL_GENERAL_SETTINGS);
  const [openAddSigned, setOpenAddSigned] = useState(false);
  const [openEditSigned, setOpenEditSigned] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [signedForm, setSignedForm] = useState({ settingKey: '', value: '', numberVal: '' });
  const [signedErrors, setSignedErrors] = useState({ settingKey: false, value: false });

  // Tab 2: Payroll Components state
  const [payrollComponents, setPayrollComponents] = useState([]);
  const [loadingComponents, setLoadingComponents] = useState(false);
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
  }, [fetchDropdownCombinations]);

  useEffect(() => {
    if (tabValue === 1 && isAdmin) fetchComponents();
  }, [tabValue, isAdmin, fetchComponents]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchQuery('');
    setPage(1);
  };

  // Tab 1: General Settings handlers
  const handleOpenAddSigned = () => {
    setSignedForm({ settingKey: '', value: '', numberVal: '' });
    setSignedErrors({ settingKey: false, value: false });
    setOpenAddSigned(true);
  };

  const handleSaveSigned = () => {
    if (!signedForm.settingKey.trim() || !signedForm.value.trim()) {
      setSignedErrors({ settingKey: !signedForm.settingKey.trim(), value: !signedForm.value.trim() });
      return;
    }
    setGeneralSettings([{
      id: Date.now(), settingKey: signedForm.settingKey, value: signedForm.value, numberVal: signedForm.numberVal,
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      createdBy: user?.nama || 'User', modifyDate: '', modifyBy: ''
    }, ...generalSettings]);
    setOpenAddSigned(false);
    showSnackbar('Setting key berhasil ditambahkan!');
  };

  const handleOpenEditSigned = (s) => {
    setSelectedSetting(s);
    setSignedForm({ settingKey: s.settingKey, value: s.value, numberVal: s.numberVal || '' });
    setSignedErrors({ settingKey: false, value: false });
    setOpenEditSigned(true);
  };

  const handleUpdateSigned = () => {
    if (!signedForm.settingKey.trim() || !signedForm.value.trim()) {
      setSignedErrors({ settingKey: !signedForm.settingKey.trim(), value: !signedForm.value.trim() });
      return;
    }
    setGeneralSettings(generalSettings.map(s => s.id === selectedSetting.id
      ? { ...s, settingKey: signedForm.settingKey, value: signedForm.value, numberVal: signedForm.numberVal,
          modifyDate: new Date().toISOString().replace('T', ' ').substring(0, 19), modifyBy: user?.nama || 'User' }
      : s));
    setOpenEditSigned(false);
    showSnackbar('Setting key berhasil diupdate!');
  };

  const handleDeleteSigned = (setting) => {
    setConfirmDialog({
      open: true, title: 'Hapus Setting Key',
      message: `Apakah Anda yakin ingin menghapus setting key: ${setting.settingKey}?`,
      onConfirm: () => {
        setGeneralSettings(generalSettings.filter(s => s.id !== setting.id));
        setConfirmDialog(c => ({ ...c, open: false }));
        showSnackbar('Setting key berhasil dihapus!');
      }
    });
  };

  // Tab 2: Payroll Component handlers
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
      createdBy: user?.nama || user?.username || 'Admin',
      modifiedBy: user?.nama || user?.username || 'Admin',
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
      open: true, title: 'Hapus Komponen Payroll',
      message: `Apakah Anda yakin ingin menghapus komponen: "${comp.name}"?`,
      onConfirm: () => {
        axios.delete(`${API_URL}/api/v1/payroll-components/${comp.id}?deletedBy=${user?.nama || 'Admin'}`,
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

  // Filtered & Paginated data
  const filteredGeneralSettings = generalSettings.filter(s =>
    s.settingKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.value.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPayrollComponents = payrollComponents.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.applyToDivision || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (page - 1) * pageSize;
  const paginatedSettings = filteredGeneralSettings.slice(startIndex, startIndex + pageSize);
  const paginatedComponents = filteredPayrollComponents.slice(startIndex, startIndex + pageSize);

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

  const generalColumns = [
    { id: 'no', label: 'No', render: (row, i) => i + 1 },
    { id: 'settingKey', label: 'Setting Key', render: (r) => <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'text.primary' }}>{r.settingKey}</Typography> },
    { id: 'value', label: 'Value', render: (r) => <Typography sx={{ fontWeight: 600 }}>{r.value}</Typography> },
    { id: 'createdDate', label: 'Created Date', render: (r) => r.createdDate || '-' },
    { id: 'createdBy', label: 'Created By', render: (r) => r.createdBy || '-' },
    { id: 'modifyDate', label: 'Modify Date', render: (r) => r.modifyDate || '-' },
    { id: 'modifyBy', label: 'Modify By', render: (r) => r.modifyBy || '-' },
    {
      id: 'actions', label: 'Aksi', align: 'center',
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="Edit Setting">
            <IconButton size="small" onClick={() => handleOpenEditSigned(row)} disabled={isSpv}
              sx={{ bgcolor: '#eff6ff', color: '#3b82f6', '&:hover': { bgcolor: '#dbeafe' }, borderRadius: '8px' }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus Setting">
            <IconButton size="small" onClick={() => handleDeleteSigned(row)} disabled={isSpv}
              sx={{ bgcolor: '#fef2f2', color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' }, borderRadius: '8px' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  const payrollColumns = [
    { id: 'no', label: 'No', render: (row, i) => i + 1 },
    { id: 'name', label: 'Nama Komponen', render: (r) => <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{r.name}</Typography> },
    {
      id: 'type', label: 'Kategori',
      render: (r) => (
        <Chip label={r.type === 'TUNJANGAN' ? 'Tunjangan' : 'Insentif'} size="small"
          sx={{ fontWeight: 700, fontSize: '0.7rem', borderRadius: '6px',
            bgcolor: r.type === 'TUNJANGAN' ? '#dbeafe' : '#ede9fe',
            color: r.type === 'TUNJANGAN' ? '#1d4ed8' : '#7c3aed' }} />
      )
    },
    {
      id: 'taxGroup', label: 'Tax Group',
      render: (r) => (
        <Chip label={r.taxGroup === 'TAX' ? 'Tax' : 'Non-Tax'} size="small"
          sx={{ fontWeight: 700, fontSize: '0.7rem', borderRadius: '6px',
            bgcolor: r.taxGroup === 'TAX' ? '#fef9c3' : '#dcfce7',
            color: r.taxGroup === 'TAX' ? '#b45309' : '#15803d' }} />
      )
    },
    { id: 'calcMethod', label: 'Metode', render: (r) => r.calcMethod === 'FIXED_VALUE' ? 'Fixed (Nominal)' : 'Percentage (%)' },
    {
      id: 'defaultValue', label: 'Default Value',
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
      id: 'actions', label: 'Aksi', align: 'center',
      render: (r) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="Edit Komponen">
            <IconButton size="small" onClick={() => handleOpenEditComponent(r)}
              sx={{ bgcolor: '#eff6ff', color: '#3b82f6', '&:hover': { bgcolor: '#dbeafe' }, borderRadius: '8px' }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus Komponen">
            <IconButton size="small" onClick={() => handleDeleteComponent(r)}
              sx={{ bgcolor: '#fef2f2', color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' }, borderRadius: '8px' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{
          width: 52,
          height: 52,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 16px -4px rgba(71, 85, 105, 0.4)'
        }}>
          <TuneIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Master Konfigurasi & Setting
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Pengaturan parameter global penggajian, SPT, dan konfigurasi komponen payroll
          </Typography>
        </Box>
      </Box>

      {/* KPI Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b' }}>
              <SettingsIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Parameter</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{generalSettings.length} Parameter</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Komponen Tunjangan</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {payrollComponents.filter(c => c.type === 'TUNJANGAN').length} Komponen
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <ReceiptLongIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Komponen Insentif</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {payrollComponents.filter(c => c.type === 'INSENTIF').length} Komponen
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <CheckCircleIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Sinkronisasi</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>Tersinkron</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs Switcher */}
      <Paper sx={{ p: 0.5, mb: 3, borderRadius: '14px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'inline-flex' }} elevation={0}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{
            minHeight: '40px',
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': {
              minHeight: '40px',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: 'text.secondary',
              px: 3,
              '&.Mui-selected': {
                bgcolor: '#1e293b',
                color: '#ffffff'
              }
            }
          }}
        >
          <Tab label="Setting Assign & System Parameter" />
          {isAdmin && <Tab label="Tunjangan & Insentif Config" />}
        </Tabs>
      </Paper>

      {/* Search Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField 
              placeholder={tabValue === 0 ? "Cari setting key atau value..." : "Cari nama komponen atau divisi..."} 
              fullWidth 
              size="small" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{ 
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> 
              }} 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                onClick={() => setSearchQuery('')}
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
            {tabValue === 0 ? 'Daftar Parameter Sistem Penggajian' : 'Daftar Komponen Tunjangan & Insentif'}
          </Typography>
          <Chip 
            label={`${tabValue === 0 ? filteredGeneralSettings.length : filteredPayrollComponents.length} Data`} 
            size="small" 
            sx={{ bgcolor: 'action.hover', fontWeight: 700, borderRadius: '6px' }} 
          />
        </Stack>

        <Box>
          {tabValue === 0 && !isSpv && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleOpenAddSigned}
              sx={{ 
                bgcolor: '#3b82f6', 
                '&:hover': { bgcolor: '#2563eb' }, 
                borderRadius: '10px', 
                textTransform: 'none', 
                fontWeight: 700, 
                boxShadow: 'none'
              }}
            >
              + TAMBAH SETTING
            </Button>
          )}
          {tabValue === 1 && isAdmin && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleOpenAddComponent}
              sx={{ 
                bgcolor: '#10b981', 
                '&:hover': { bgcolor: '#059669' }, 
                borderRadius: '10px', 
                textTransform: 'none', 
                fontWeight: 700, 
                boxShadow: 'none'
              }}
            >
              + TAMBAH KOMPONEN
            </Button>
          )}
        </Box>
      </Paper>

      {/* Data Table */}
      {tabValue === 0 ? (
        <DataTable 
          columns={generalColumns} 
          data={paginatedSettings} 
          loading={false}
          page={page} 
          pageSize={pageSize}
          totalElements={filteredGeneralSettings.length}
          totalPages={Math.ceil(filteredGeneralSettings.length / pageSize) || 1}
          onPageChange={setPage} 
          onPageSizeChange={(sz) => { setPageSize(sz); setPage(1); }} 
        />
      ) : (
        loadingComponents
          ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          : <DataTable 
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

      {/* TAB 1 MODALS */}
      <CustomModal open={openAddSigned} onClose={() => setOpenAddSigned(false)} title="Tambah Parameter Sistem Baru" maxWidth="xs">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField 
            label="Setting Key" 
            fullWidth 
            size="small" 
            placeholder="Contoh: SPT21.SIGNER.TITLE"
            value={signedForm.settingKey}
            onChange={(e) => setSignedForm({ ...signedForm, settingKey: e.target.value })}
            error={signedErrors.settingKey} 
            helperText={signedErrors.settingKey ? 'Setting key wajib diisi' : ''} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField 
            label="Value" 
            fullWidth 
            size="small" 
            placeholder="Nilai parameter"
            value={signedForm.value}
            onChange={(e) => setSignedForm({ ...signedForm, value: e.target.value })}
            error={signedErrors.value} 
            helperText={signedErrors.value ? 'Value wajib diisi' : ''} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleSaveSigned}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: '8px', px: 4, fontWeight: 700, textTransform: 'none', boxShadow: 'none' }}
            >
              SIMPAN
            </Button>
          </Box>
        </Stack>
      </CustomModal>

      <CustomModal open={openEditSigned} onClose={() => setOpenEditSigned(false)} title="Edit Parameter Sistem" maxWidth="xs">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField 
            label="Setting Key" 
            fullWidth 
            size="small" 
            value={signedForm.settingKey}
            onChange={(e) => setSignedForm({ ...signedForm, settingKey: e.target.value })}
            error={signedErrors.settingKey} 
            helperText={signedErrors.settingKey ? 'Setting key wajib diisi' : ''} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField 
            label="Number / Kode" 
            fullWidth 
            size="small" 
            value={signedForm.numberVal}
            onChange={(e) => setSignedForm({ ...signedForm, numberVal: e.target.value })} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField 
            label="Value" 
            fullWidth 
            size="small" 
            value={signedForm.value}
            onChange={(e) => setSignedForm({ ...signedForm, value: e.target.value })}
            error={signedErrors.value} 
            helperText={signedErrors.value ? 'Value wajib diisi' : ''} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleUpdateSigned}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: '8px', px: 4, fontWeight: 700, textTransform: 'none', boxShadow: 'none' }}
            >
              UPDATE
            </Button>
          </Box>
        </Stack>
      </CustomModal>

      {/* TAB 2 MODAL: Add/Edit Payroll Component */}
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select 
                value={componentForm.type} 
                label="Kategori"
                onChange={(e) => setComponentForm({ ...componentForm, type: e.target.value })}
                sx={{ borderRadius: '8px' }}
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
                sx={{ borderRadius: '8px' }}
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
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="FIXED_VALUE">Fixed Value (Nominal Tetap)</MenuItem>
                <MenuItem value="PERCENTAGE">Percentage (% Gaji Pokok)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={componentForm.calcMethod === 'PERCENTAGE' ? 'Default Rate (%)' : 'Default Value (Rp)'}
              fullWidth 
              size="small" 
              type="number" 
              value={componentForm.defaultValue}
              onChange={(e) => setComponentForm({ ...componentForm, defaultValue: e.target.value })}
              error={componentErrors.defaultValue} 
              helperText={componentErrors.defaultValue ? 'Wajib diisi' : ''} 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>

          {/* BERLAKU UNTUK (Cascading Dropdowns) */}
          <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: '12px', p: 2, bgcolor: 'action.hover' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1.5 }}>
              BERLAKU UNTUK (Opsional — biarkan kosong jika berlaku untuk semua karyawan)
            </Typography>
            <Stack spacing={1.5}>
              <SearchableSelect
                label="Division"
                options={[{ value: '', label: 'Semua Division' }, ...cascaded.divisions.map(d => ({ value: d, label: d }))]}
                value={filterDivision}
                onChange={(val) => {
                  setFilterDivision(val);
                  setFilterUnit('');
                  setFilterPosition('');
                  setFilterEmployeeType('');
                }}
                placeholder="Pilih Division"
              />

              <SearchableSelect
                label="Unit Name"
                options={[{ value: '', label: 'Semua Unit' }, ...cascaded.units.map(u => ({ value: u, label: u }))]}
                value={filterUnit}
                onChange={(val) => {
                  setFilterUnit(val);
                  setFilterPosition('');
                  setFilterEmployeeType('');
                }}
                placeholder="Pilih Unit Name"
              />

              <SearchableSelect
                label="Position"
                options={[{ value: '', label: 'Semua Position' }, ...cascaded.positions.map(p => ({ value: p, label: p }))]}
                value={filterPosition}
                onChange={(val) => {
                  setFilterPosition(val);
                  setFilterEmployeeType('');
                }}
                placeholder="Pilih Position"
              />

              <SearchableSelect
                label="Employee Type"
                options={[{ value: '', label: 'Semua Employee Type' }, ...cascaded.employeeTypes.map(t => ({ value: t, label: t }))]}
                value={filterEmployeeType}
                onChange={(val) => setFilterEmployeeType(val)}
                placeholder="Pilih Employee Type"
              />
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleSaveComponent}
              sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, borderRadius: '8px', px: 4, fontWeight: 700, textTransform: 'none', boxShadow: 'none' }}
            >
              {isEditingComponent ? 'UPDATE' : 'SIMPAN'}
            </Button>
          </Box>
        </Stack>
      </CustomModal>

      {/* Snackbar & Confirm */}
      <CustomSnackbar 
        open={snackbar.open} 
        message={snackbar.message} 
        severity={snackbar.severity}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))} 
      />
      <CustomConfirmDialog 
        open={confirmDialog.open} 
        title={confirmDialog.title} 
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm} 
        onClose={() => setConfirmDialog(c => ({ ...c, open: false }))} 
      />
    </Box>
  );
}
