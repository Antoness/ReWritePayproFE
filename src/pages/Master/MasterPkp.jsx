import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Grid, IconButton, Chip, Tooltip
} from '@mui/material';
import {
  History as HistoryIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Percent as PercentIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Update as UpdateIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8080';

const MasterPkp = () => {
  const { user } = useSelector((state) => state.auth);
  const userPos = user?.position?.toUpperCase()?.trim() || '';
  const isSpv = userPos.includes('SPV') || userPos.includes('SUPERVISOR');

  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pkpData, setPkpData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [openHistory, setOpenHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyTotalElements, setHistoryTotalElements] = useState(0);

  const [addForm, setAddForm] = useState({ value: '', tax: '', taxTanpaNpwp: '' });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({ value: false, tax: false, taxTanpaNpwp: false });
  const [editErrors, setEditErrors] = useState({ value: false, tax: false, taxTanpaNpwp: false });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', action: null, payload: null });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const formatNominal = (value) => {
    if (!value) return '';
    const number = String(value).replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const fetchPkpData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', page - 1);
      params.append('size', pageSize);

      const response = await axios.get(`${API_URL}/api/master-pkp/list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPkpData(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching PKP data:', err);
      showSnackbar('Gagal memuat data PKP', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ---- ADD ----
  const handleSaveAdd = () => {
    const newErrors = { value: false, tax: false, taxTanpaNpwp: false };
    let hasError = false;

    const rawValue = addForm.value.replace(/\./g, '').replace(/,/g, '');
    if (!rawValue || parseInt(rawValue) === 0) { newErrors.value = true; hasError = true; }
    if (!addForm.tax.trim()) { newErrors.tax = true; hasError = true; }
    if (!addForm.taxTanpaNpwp.trim()) { newErrors.taxTanpaNpwp = true; hasError = true; }

    setErrors(newErrors);
    if (hasError) { showSnackbar('Mohon isi semua field dengan benar!', 'error'); return; }

    setConfirmDialog({
      open: true,
      title: 'Konfirmasi Tambah PKP',
      message: 'Apakah Anda yakin ingin menambahkan data PKP ini?',
      action: 'ADD',
      payload: { value: rawValue, tax: addForm.tax, taxTanpaNpwp: addForm.taxTanpaNpwp }
    });
  };

  // ---- UPDATE ----
  const handleUpdate = () => {
    const newErrors = { value: false, tax: false, taxTanpaNpwp: false };
    let hasError = false;
    const rawValue = String(selectedRow?.value || '').replace(/\./g, '').replace(/,/g, '');

    if (!rawValue || parseInt(rawValue) === 0) { newErrors.value = true; hasError = true; }
    if (!selectedRow?.tax?.trim()) { newErrors.tax = true; hasError = true; }
    if (!selectedRow?.taxTanpaNpwp?.trim()) { newErrors.taxTanpaNpwp = true; hasError = true; }

    setEditErrors(newErrors);
    if (hasError) { showSnackbar('Mohon isi semua field dengan benar!', 'error'); return; }

    setConfirmDialog({
      open: true,
      title: 'Konfirmasi Update PKP',
      message: 'Apakah Anda yakin ingin memperbarui data PKP ini?',
      action: 'UPDATE',
      payload: { id: selectedRow.id, value: rawValue, tax: selectedRow.tax, taxTanpaNpwp: selectedRow.taxTanpaNpwp }
    });
  };

  // ---- EXECUTE ----
  const executeAction = async () => {
    try {
      const token = localStorage.getItem('token');
      const { action, payload } = confirmDialog;
      const url = action === 'ADD' ? `${API_URL}/api/master-pkp/add` : `${API_URL}/api/master-pkp/update`;

      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showSnackbar(response.data.message || 'Operasi berhasil', 'success');
        if (action === 'ADD') {
          setOpenAdd(false);
          setAddForm({ value: '', tax: '', taxTanpaNpwp: '' });
        } else {
          setOpenEdit(false);
        }
        setConfirmDialog({ open: false, title: '', message: '', action: null, payload: null });
        fetchPkpData();
      } else {
        showSnackbar(response.data.message || 'Operasi gagal', 'error');
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    } catch (err) {
      console.error(`Error executing ${confirmDialog.action}:`, err);
      showSnackbar(`${confirmDialog.action} gagal. Kesalahan server.`, 'error');
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  // ---- HISTORY ----
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-pkp/history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: historySearch,
          page: historyPage - 1,
          size: historyPageSize
        }
      });

      if (response.data && response.data.content) {
        setHistoryData(response.data.content);
        setHistoryTotalPages(response.data.totalPages);
        setHistoryTotalElements(response.data.totalElements);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      showSnackbar('Gagal mengambil history PKP', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchPkpData();
  }, [page, pageSize]);

  useEffect(() => {
    if (openHistory) fetchHistory();
  }, [historyPage, historyPageSize, openHistory]);

  // Derived KPI values
  const totalLayers = totalElements || pkpData.length;
  const lowestTax = pkpData.length > 0 ? pkpData[0]?.tax : '5%';
  const highestTax = pkpData.length > 0 ? pkpData[pkpData.length - 1]?.tax : '35%';

  // ---- HISTORY COLUMNS ----
  const historyColumns = [
    {
      id: 'value',
      label: 'Value',
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
          {row.value && row.value !== '-' ? `Rp ${formatNominal(String(row.value))}` : '-'}
        </Typography>
      )
    },
    {
      id: 'valueUpdate',
      label: 'Value Update',
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap', color: row.valueUpdate && row.valueUpdate !== '-' ? '#10b981' : 'inherit' }}>
          {row.valueUpdate && row.valueUpdate !== '-' ? `Rp ${formatNominal(String(row.valueUpdate))}` : '-'}
        </Typography>
      )
    },
    { id: 'tax', label: 'Tax' },
    { id: 'taxUpdate', label: 'Tax Update', render: (row) => row.taxUpdate || '-' },
    { id: 'nTax', label: 'Tax (Tanpa NPWP)', render: (row) => row.nTax || '-' },
    { id: 'nTaxUpdate', label: 'Tax (Tanpa NPWP) Update', render: (row) => row.nTaxUpdate || '-' },
    { id: 'createdBy', label: 'Created By' },
    {
      id: 'createdDate',
      label: 'Created Date',
      render: (row) => row.createdDate ? new Date(row.createdDate).toLocaleString('id-ID') : '-'
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.status || '-'}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.7rem',
            bgcolor: row.status === 'ADD' ? '#ecfdf5' : '#eff6ff',
            color: row.status === 'ADD' ? '#059669' : '#2563eb',
            borderRadius: '6px'
          }}
        />
      )
    },
  ];

  // ---- MAIN TABLE COLUMNS ----
  const columns = [
    {
      id: 'value',
      label: 'Batas Nilai PKP (Lapisan)',
      render: (row) => (
        <Typography sx={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace', fontSize: '0.875rem' }}>
          Rp {row.value ? formatNominal(String(row.value)) : '-'}
        </Typography>
      )
    },
    { 
      id: 'tax', 
      label: 'Tarif Pajak (NPWP)',
      render: (row) => (
        <Chip 
          label={row.tax ? (row.tax.includes('%') ? row.tax : `${(parseFloat(row.tax) * 100).toFixed(0)}%`) : '-'} 
          size="small" 
          sx={{ fontWeight: 700, bgcolor: '#eff6ff', color: '#1d4ed8', borderRadius: '6px' }}
        />
      )
    },
    { 
      id: 'taxTanpaNpwp', 
      label: 'Tarif Non-NPWP',
      render: (row) => (
        <Chip 
          label={row.taxTanpaNpwp ? (row.taxTanpaNpwp.includes('%') ? row.taxTanpaNpwp : `${(parseFloat(row.taxTanpaNpwp) * 100).toFixed(0)}%`) : '-'} 
          size="small" 
          sx={{ fontWeight: 700, bgcolor: '#fef2f2', color: '#dc2626', borderRadius: '6px' }}
        />
      )
    },
    { id: 'createdBy', label: 'Created By' },
    {
      id: 'createdDate',
      label: 'Created Date',
      render: (row) => row.createdDate ? new Date(row.createdDate).toLocaleString('id-ID') : '-'
    },
    { id: 'updateBy', label: 'Update By', render: (row) => row.updateBy || '-' },
    {
      id: 'updateDate',
      label: 'Update Date',
      render: (row) => row.updateDate ? new Date(row.updateDate).toLocaleString('id-ID') : '-'
    },
    ...(isSpv ? [{
      id: 'actions',
      label: 'Aksi',
      align: 'center',
      render: (row) => (
        <Tooltip title="Edit PKP">
          <IconButton
            size="small"
            onClick={() => {
              setSelectedRow({ ...row, value: formatNominal(String(row.value)) });
              setEditErrors({ value: false, tax: false, taxTanpaNpwp: false });
              setOpenEdit(true);
            }}
            sx={{ bgcolor: '#eff6ff', color: '#3b82f6', '&:hover': { bgcolor: '#dbeafe' }, borderRadius: '8px' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )
    }] : [])
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{
          width: 52,
          height: 52,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)'
        }}>
          <PercentIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Master PKP
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Kelola data tarif progresif Penghasilan Kena Pajak (PPh 21)
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <AccountBalanceIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Lapisan PKP</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{totalLayers} Layer</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <PercentIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Tarif Terendah</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{lowestTax || '5%'}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <TrendingUpIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Tarif Tertinggi</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{highestTax || '35%'}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <UpdateIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Regulasi</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>UU HPP Aktif</Typography>
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
              placeholder="Cari nominal atau tarif PKP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchPkpData(); } }}
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
                onClick={() => { setPage(1); fetchPkpData(); }}
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
                onClick={() => { setSearch(''); setPage(1); }}
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
            Data Tarif Pajak Progresif
          </Typography>
          <Chip label={`${totalElements} Tarif Terdaftar`} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 700, borderRadius: '6px' }} />
        </Stack>

        <Stack direction="row" spacing={1.5}>
          {isSpv && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setAddForm({ value: '', tax: '', taxTanpaNpwp: '' });
                setErrors({ value: false, tax: false, taxTanpaNpwp: false });
                setOpenAdd(true);
              }}
              sx={{
                bgcolor: '#3b82f6',
                '&:hover': { bgcolor: '#2563eb' },
                borderRadius: '10px',
                fontWeight: 700,
                boxShadow: 'none'
              }}
            >
              + TAMBAH PKP
            </Button>
          )}

          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => {
              setOpenHistory(true);
              fetchHistory();
            }}
            sx={{
              borderRadius: '10px',
              fontWeight: 700,
              color: 'text.primary',
              borderColor: 'divider',
              '&:hover': { borderColor: 'text.primary' }
            }}
          >
            LOG HISTORY
          </Button>
        </Stack>
      </Paper>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={pkpData}
        page={page}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={loading}
      />

      {/* Modal Add PKP */}
      <CustomModal open={openAdd} onClose={() => setOpenAdd(false)} title="Tambah Layer PKP Baru" maxWidth="xs">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Batas Nominal PKP (Rp)</Typography>
            <TextField
              fullWidth size="small"
              placeholder="Contoh: 60.000.000"
              value={addForm.value}
              onChange={(e) => {
                setAddForm({ ...addForm, value: formatNominal(e.target.value) });
                if (e.target.value) setErrors(prev => ({ ...prev, value: false }));
              }}
              error={errors.value}
              helperText={errors.value ? "Nominal tidak boleh kosong" : ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Tarif Pajak NPWP (Contoh: 0.05 atau 5%)</Typography>
            <TextField
              fullWidth size="small"
              placeholder="Contoh: 0.05"
              value={addForm.tax}
              onChange={(e) => {
                setAddForm({ ...addForm, tax: e.target.value });
                if (e.target.value) setErrors(prev => ({ ...prev, tax: false }));
              }}
              error={errors.tax}
              helperText={errors.tax ? "Tarif tidak boleh kosong" : ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Tarif Non-NPWP (Contoh: 0.06 atau 6%)</Typography>
            <TextField
              fullWidth size="small"
              placeholder="Contoh: 0.06"
              value={addForm.taxTanpaNpwp}
              onChange={(e) => {
                setAddForm({ ...addForm, taxTanpaNpwp: e.target.value });
                if (e.target.value) setErrors(prev => ({ ...prev, taxTanpaNpwp: false }));
              }}
              error={errors.taxTanpaNpwp}
              helperText={errors.taxTanpaNpwp ? "Tarif Non-NPWP tidak boleh kosong" : ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSaveAdd}
              sx={{ px: 4, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, color: 'white', fontWeight: 700, borderRadius: '8px', boxShadow: 'none' }}
            >
              SIMPAN
            </Button>
          </Box>
        </Stack>
      </CustomModal>

      {/* Modal Edit PKP */}
      <CustomModal open={openEdit} onClose={() => setOpenEdit(false)} title="Edit Layer PKP" maxWidth="xs">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Batas Nominal PKP (Rp)</Typography>
            <TextField
              fullWidth size="small"
              value={selectedRow?.value ? formatNominal(String(selectedRow.value)) : ''}
              onChange={(e) => {
                setSelectedRow({ ...selectedRow, value: formatNominal(e.target.value) });
                if (e.target.value) setEditErrors(prev => ({ ...prev, value: false }));
              }}
              error={editErrors.value}
              helperText={editErrors.value ? "Nominal tidak boleh kosong" : ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Tarif Pajak NPWP</Typography>
            <TextField
              fullWidth size="small"
              value={selectedRow?.tax || ''}
              onChange={(e) => {
                setSelectedRow({ ...selectedRow, tax: e.target.value });
                if (e.target.value) setEditErrors(prev => ({ ...prev, tax: false }));
              }}
              error={editErrors.tax}
              helperText={editErrors.tax ? "Tarif tidak boleh kosong" : ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Tarif Non-NPWP</Typography>
            <TextField
              fullWidth size="small"
              value={selectedRow?.taxTanpaNpwp || ''}
              onChange={(e) => {
                setSelectedRow({ ...selectedRow, taxTanpaNpwp: e.target.value });
                if (e.target.value) setEditErrors(prev => ({ ...prev, taxTanpaNpwp: false }));
              }}
              error={editErrors.taxTanpaNpwp}
              helperText={editErrors.taxTanpaNpwp ? "Tarif Non-NPWP tidak boleh kosong" : ''}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>

          {isSpv && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
              <Button
                variant="contained"
                onClick={handleUpdate}
                sx={{ px: 4, bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, color: 'white', fontWeight: 700, borderRadius: '8px', boxShadow: 'none' }}
              >
                UPDATE
              </Button>
            </Box>
          )}
        </Stack>
      </CustomModal>

      {/* Modal History Log */}
      <CustomModal open={openHistory} onClose={() => setOpenHistory(false)} title="Log History Perubahan PKP" maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center', mt: 1 }}>
          <TextField
            size="small"
            placeholder="Cari history..."
            value={historySearch}
            onChange={(e) => setHistorySearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchHistory()}
            sx={{ width: 280, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setHistoryPage(1);
              fetchHistory();
            }}
            sx={{ height: '40px', bgcolor: '#1e293b', '&:hover': { bgcolor: '#0f172a' }, color: 'white', borderRadius: '8px', fontWeight: 700, boxShadow: 'none' }}
          >
            Cari
          </Button>
        </Box>
        <DataTable
          columns={historyColumns}
          data={historyData || []}
          page={historyPage}
          pageSize={historyPageSize}
          totalElements={historyTotalElements}
          totalPages={historyTotalPages}
          onPageChange={setHistoryPage}
          onPageSizeChange={setHistoryPageSize}
          loading={historyLoading}
        />
      </CustomModal>

      {/* Confirmation Dialog */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={executeAction}
        type={confirmDialog.action === 'Delete' ? 'error' : 'info'}
      />

      {/* Snackbar */}
      <CustomSnackbar 
        open={snackbar.open} 
        message={snackbar.message} 
        severity={snackbar.severity} 
        onClose={handleCloseSnackbar} 
      />
    </Box>
  );
};

export default MasterPkp;
