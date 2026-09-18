import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, IconButton, Tooltip, Grid, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  ReceiptLong as ReceiptLongIcon,
  Tune as TuneIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function MasterSettingAssign() {
  const { user, token } = useSelector((state) => state.auth);
  const authToken = token || localStorage.getItem('token');
  const userPosition = user?.position?.toUpperCase()?.trim() || '';
  const isSpv = (userPosition.includes('SUPERVISOR') || userPosition.includes('SPV')) && !userPosition.includes('MANAJER');

  // Main list state
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [kpi, setKpi] = useState({ totalSettings: 0, totalSpt: 0, totalCustom: 0, statusConfig: 'Aktif' });

  // Notifications & Dialogs
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  // Add / Edit Modal State
  const [openAddSigned, setOpenAddSigned] = useState(false);
  const [openEditSigned, setOpenEditSigned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [signedForm, setSignedForm] = useState({ settingKey: '', value: '', numberVal: '' });
  const [signedErrors, setSignedErrors] = useState({ settingKey: false, value: false });

  // Log History Modal State
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyTotalElements, setHistoryTotalElements] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const getHeaders = useCallback(() => {
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
  }, [authToken]);

  // Fetch Main Settings Data
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/master-signed`, {
        headers: getHeaders(),
        params: {
          search: searchQuery || undefined,
          page,
          size: pageSize
        }
      });

      if (res.data && res.data.data) {
        setSettings(res.data.data);
        setTotalElements(res.data.totalElements || res.data.data.length);
        setTotalPages(res.data.totalPages || 1);
        if (res.data.kpi) {
          setKpi(res.data.kpi);
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      // Fallback: don't wipe data abruptly
      showSnackbar(err.response?.data?.message || 'Gagal memuat data master settings', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page, pageSize, getHeaders]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Fetch History Logs
  const fetchHistoryLogs = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/master-signed/history`, {
        headers: getHeaders(),
        params: {
          search: historySearch || undefined,
          page: historyPage,
          size: historyPageSize
        }
      });

      if (res.data && res.data.data) {
        setHistoryList(res.data.data);
        setHistoryTotalElements(res.data.totalElements || res.data.data.length);
        setHistoryTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching history logs:', err);
      showSnackbar('Gagal memuat riwayat log history', 'error');
    } finally {
      setHistoryLoading(false);
    }
  }, [historySearch, historyPage, historyPageSize, getHeaders]);

  useEffect(() => {
    if (openHistoryModal) {
      fetchHistoryLogs();
    }
  }, [openHistoryModal, fetchHistoryLogs]);

  // Open Add Modal
  const handleOpenAddSigned = () => {
    setSignedForm({ settingKey: '', value: '', numberVal: '' });
    setSignedErrors({ settingKey: false, value: false });
    setOpenAddSigned(true);
  };

  // Handle Save (Add) Setting
  const handleSaveSigned = async () => {
    const keyTrimmed = signedForm.settingKey.trim();
    const valTrimmed = signedForm.value.trim();

    if (!keyTrimmed || !valTrimmed) {
      setSignedErrors({ settingKey: !keyTrimmed, value: !valTrimmed });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        settingKey: keyTrimmed,
        settingValue: valTrimmed,
        settingNumber: signedForm.numberVal ? parseInt(signedForm.numberVal, 10) || null : null
      };

      const res = await axios.post(`${API_URL}/api/v1/master-signed`, payload, {
        headers: getHeaders()
      });

      if (res.data && res.data.success) {
        showSnackbar(res.data.message || 'Setting key berhasil ditambahkan!');
        setOpenAddSigned(false);
        fetchSettings();
      }
    } catch (err) {
      console.error('Error adding setting:', err);
      showSnackbar(err.response?.data?.message || err.response?.data?.error || 'Gagal menambahkan setting key', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditSigned = (s) => {
    setSelectedSetting(s);
    setSignedForm({
      settingKey: s.settingKey || '',
      value: s.settingValue || s.value || '',
      numberVal: s.settingNumber !== null && s.settingNumber !== undefined ? String(s.settingNumber) : (s.numberVal || '')
    });
    setSignedErrors({ settingKey: false, value: false });
    setOpenEditSigned(true);
  };

  // Handle Update Setting
  const handleUpdateSigned = async () => {
    const keyTrimmed = signedForm.settingKey.trim();
    const valTrimmed = signedForm.value.trim();

    if (!keyTrimmed || !valTrimmed) {
      setSignedErrors({ settingKey: !keyTrimmed, value: !valTrimmed });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        settingKey: keyTrimmed,
        settingValue: valTrimmed,
        settingNumber: signedForm.numberVal ? parseInt(signedForm.numberVal, 10) || null : null
      };

      const idOrKey = selectedSetting.id || selectedSetting.settingKey;
      const res = await axios.put(`${API_URL}/api/v1/master-signed/${encodeURIComponent(idOrKey)}`, payload, {
        headers: getHeaders()
      });

      if (res.data && res.data.success) {
        showSnackbar(res.data.message || 'Setting key berhasil diupdate!');
        setOpenEditSigned(false);
        fetchSettings();
      }
    } catch (err) {
      console.error('Error updating setting:', err);
      showSnackbar(err.response?.data?.message || err.response?.data?.error || 'Gagal mengupdate setting key', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Setting
  const handleDeleteSigned = (setting) => {
    const idOrKey = setting.id || setting.settingKey;
    setConfirmDialog({
      open: true,
      title: 'Hapus Setting Key',
      message: `Apakah Anda yakin ingin menghapus setting key: "${setting.settingKey}"?`,
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${API_URL}/api/v1/master-signed/${encodeURIComponent(idOrKey)}`, {
            headers: getHeaders()
          });
          setConfirmDialog((c) => ({ ...c, open: false }));
          showSnackbar(res.data?.message || 'Setting key berhasil dihapus!');
          fetchSettings();
        } catch (err) {
          console.error('Error deleting setting:', err);
          showSnackbar(err.response?.data?.message || 'Gagal menghapus setting key', 'error');
        }
      }
    });
  };

  const startIndex = (page - 1) * pageSize;

  const generalColumns = [
    { id: 'no', label: 'No', render: (row, i) => startIndex + i + 1 },
    {
      id: 'settingKey',
      label: 'Setting Key',
      render: (r) => (
        <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main', fontSize: '0.85rem' }}>
          {r.settingKey}
        </Typography>
      )
    },
    {
      id: 'settingValue',
      label: 'Value',
      render: (r) => <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.settingValue || r.value || '-'}</Typography>
    },
    {
      id: 'settingNumber',
      label: 'Number / Kode',
      render: (r) => {
        const val = r.settingNumber !== null && r.settingNumber !== undefined ? r.settingNumber : r.numberVal;
        return val ? (
          <Chip label={val} size="small" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.75rem', bgcolor: 'action.hover' }} />
        ) : '-';
      }
    },
    {
      id: 'createdDate',
      label: 'Created Date',
      render: (r) => {
        const d = r.createdDate || r.created_date;
        return d ? String(d).replace('T', ' ').substring(0, 19) : '-';
      }
    },
    { id: 'createdBy', label: 'Created By', render: (r) => r.createdBy || r.created_by || '-' },
    {
      id: 'modifyDate',
      label: 'Modify Date',
      render: (r) => {
        const d = r.modifyDate || r.modify_date;
        return d ? String(d).replace('T', ' ').substring(0, 19) : '-';
      }
    },
    { id: 'modifyBy', label: 'Modify By', render: (r) => r.modifyBy || r.modify_by || '-' },
    {
      id: 'actions',
      label: 'Aksi',
      align: 'center',
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="Edit Setting">
            <IconButton
              size="small"
              onClick={() => handleOpenEditSigned(row)}
              disabled={isSpv}
              sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.2)' }, borderRadius: '8px' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus Setting">
            <IconButton
              size="small"
              onClick={() => handleDeleteSigned(row)}
              disabled={isSpv}
              sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' }, borderRadius: '8px' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  const historyColumns = [
    { id: 'no', label: 'No', render: (row, i) => (historyPage - 1) * historyPageSize + i + 1 },
    {
      id: 'actionDate',
      label: 'Waktu Log',
      render: (r) => (r.actionDate ? String(r.actionDate).replace('T', ' ').substring(0, 19) : '-')
    },
    {
      id: 'settingKey',
      label: 'Setting Key',
      render: (r) => (
        <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main', fontSize: '0.8rem' }}>
          {r.settingKey}
        </Typography>
      )
    },
    {
      id: 'actionType',
      label: 'Aksi',
      render: (r) => {
        let color = 'default';
        if (r.actionType === 'CREATE') color = 'success';
        else if (r.actionType === 'UPDATE') color = 'primary';
        else if (r.actionType === 'DELETE') color = 'error';

        return <Chip label={r.actionType} size="small" color={color} sx={{ fontWeight: 700, fontSize: '0.7rem' }} />;
      }
    },
    {
      id: 'oldValue',
      label: 'Nilai Lama',
      render: (r) => <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{r.oldValue || '-'}</Typography>
    },
    {
      id: 'newValue',
      label: 'Nilai Baru',
      render: (r) => <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{r.newValue || '-'}</Typography>
    },
    {
      id: 'actionBy',
      label: 'User Eksekutor',
      render: (r) => r.actionBy || '-'
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* 1. Header Banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(59,130,246,0.05))',
            color: '#2563eb',
            border: '1px solid rgba(37,99,235,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <SettingsIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Master Setting Assign & System Parameter
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Pengaturan konfigurasi parameter global sistem, format penomoran SPT, dan key assign
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setOpenHistoryModal(true)}
            sx={{
              borderRadius: 2,
              height: 40,
              fontWeight: 700,
              textTransform: 'none',
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
            }}
          >
            LOG HISTORY
          </Button>

          {!isSpv && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddSigned}
              sx={{
                bgcolor: '#1e293b',
                '&:hover': { bgcolor: '#0f172a' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                height: 40
              }}
            >
              + TAMBAH SETTING
            </Button>
          )}
        </Stack>
      </Box>

      {/* 2. Top KPI Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: 'rgba(71, 85, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
              <SettingsIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Parameter</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{kpi.totalSettings || totalElements} Parameter</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <ReceiptLongIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Parameter SPT</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563eb' }}>{kpi.totalSpt || 0} Parameter</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <TuneIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Parameter Custom</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#7c3aed' }}>{kpi.totalCustom || 0} Parameter</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 46, height: 46, borderRadius: 2.5, bgcolor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <CheckCircleIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Konfigurasi</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>{kpi.statusConfig || 'Aktif'}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. Search Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField 
              placeholder="Cari setting key atau value parameter..." 
              fullWidth 
              size="small" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              InputProps={{ 
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> 
              }} 
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                setPage(1);
              }}
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
            Daftar Parameter Sistem & Setting Assign
          </Typography>
          <Chip 
            label={`${totalElements} Data`} 
            size="small" 
            sx={{ bgcolor: 'action.hover', fontWeight: 700, borderRadius: '6px' }} 
          />
        </Stack>
      </Box>

      {/* 5. Main Data Table */}
      <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }} elevation={0}>
        <DataTable 
          columns={generalColumns} 
          data={settings} 
          loading={loading}
          page={page} 
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={setPage} 
          onPageSizeChange={(sz) => { setPageSize(sz); setPage(1); }} 
        />
      </Paper>

      {/* Add Modal */}
      <CustomModal open={openAddSigned} onClose={() => setOpenAddSigned(false)} title="Tambah Parameter Sistem Baru" maxWidth="xs">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField 
            label="Setting Key *" 
            fullWidth 
            size="small" 
            placeholder="Contoh: SPT21.SIGNER.TITLE"
            value={signedForm.settingKey}
            onChange={(e) => setSignedForm({ ...signedForm, settingKey: e.target.value })}
            error={signedErrors.settingKey} 
            helperText={signedErrors.settingKey ? 'Setting key wajib diisi' : ''} 
          />
          <TextField 
            label="Value *" 
            fullWidth 
            size="small" 
            placeholder="Nilai parameter"
            value={signedForm.value}
            onChange={(e) => setSignedForm({ ...signedForm, value: e.target.value })}
            error={signedErrors.value} 
            helperText={signedErrors.value ? 'Value wajib diisi' : ''} 
          />
          <TextField 
            label="Number / Kode (Opsional)" 
            fullWidth 
            size="small" 
            placeholder="Nomor referensi atau kode angka"
            value={signedForm.numberVal}
            onChange={(e) => setSignedForm({ ...signedForm, numberVal: e.target.value })}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleSaveSigned}
              disabled={submitting}
              sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' }, borderRadius: 2, px: 4, fontWeight: 700, textTransform: 'none' }}
            >
              {submitting ? <CircularProgress size={20} color="inherit" /> : 'SIMPAN'}
            </Button>
          </Box>
        </Stack>
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal open={openEditSigned} onClose={() => setOpenEditSigned(false)} title="Edit Parameter Sistem" maxWidth="xs">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField 
            label="Setting Key *" 
            fullWidth 
            size="small" 
            value={signedForm.settingKey}
            onChange={(e) => setSignedForm({ ...signedForm, settingKey: e.target.value })}
            error={signedErrors.settingKey} 
            helperText={signedErrors.settingKey ? 'Setting key wajib diisi' : ''} 
          />
          <TextField 
            label="Value *" 
            fullWidth 
            size="small" 
            value={signedForm.value}
            onChange={(e) => setSignedForm({ ...signedForm, value: e.target.value })}
            error={signedErrors.value} 
            helperText={signedErrors.value ? 'Value wajib diisi' : ''} 
          />
          <TextField 
            label="Number / Kode" 
            fullWidth 
            size="small" 
            value={signedForm.numberVal}
            onChange={(e) => setSignedForm({ ...signedForm, numberVal: e.target.value })} 
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleUpdateSigned}
              disabled={submitting}
              sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' }, borderRadius: 2, px: 4, fontWeight: 700, textTransform: 'none' }}
            >
              {submitting ? <CircularProgress size={20} color="inherit" /> : 'UPDATE'}
            </Button>
          </Box>
        </Stack>
      </CustomModal>

      {/* Log History Audit Modal */}
      <Dialog
        open={openHistoryModal}
        onClose={() => setOpenHistoryModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'rgba(37,99,235,0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HistoryIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Riwayat Perubahan & Audit Log</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Catatan histori penambahan, perubahan nilai, dan penghapusan setting</Typography>
            </Box>
          </Stack>
          <IconButton size="small" onClick={() => setOpenHistoryModal(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 2.5 }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Cari riwayat berdasarkan key, nilai, atau user..."
              value={historySearch}
              onChange={(e) => {
                setHistorySearch(e.target.value);
                setHistoryPage(1);
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              }}
            />
          </Box>

          <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }} elevation={0}>
            <DataTable
              columns={historyColumns}
              data={historyList}
              loading={historyLoading}
              page={historyPage}
              pageSize={historyPageSize}
              totalElements={historyTotalElements}
              totalPages={historyTotalPages}
              onPageChange={setHistoryPage}
              onPageSizeChange={(sz) => { setHistoryPageSize(sz); setHistoryPage(1); }}
            />
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, py: 1.5 }}>
          <Button onClick={() => setOpenHistoryModal(false)} sx={{ fontWeight: 700, textTransform: 'none', color: 'text.secondary' }}>
            TUTUP
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((c) => ({ ...c, open: false }))}
      />

      {/* Snackbar Alert */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
}
