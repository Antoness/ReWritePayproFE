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
  FamilyRestroom as FamilyRestroomIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Groups as GroupsIcon,
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

const MasterPtkp = () => {
  const { user } = useSelector((state) => state.auth);
  const userPos = user?.position?.toUpperCase()?.trim() || '';
  const isSpv = userPos.includes('SPV') || userPos.includes('SUPERVISOR');

  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [ptkpData, setPtkpData] = useState([]);
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
  
  const [addForm, setAddForm] = useState({
    tipe: '',
    nominal: ''
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({ tipe: false, nominal: false });
  const [editErrors, setEditErrors] = useState({ tipe: false, nominal: false });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', action: null, payload: null });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const formatNominal = (value) => {
    if (!value) return '';
    const number = String(value).replace(/\D/g, '');
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const fetchPtkpData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', page - 1);
      params.append('size', pageSize);

      const response = await axios.get(`${API_URL}/api/master-ptkp/list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPtkpData(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching PTKP data:', err);
      showSnackbar('Gagal memuat data PTKP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdd = () => {
    let newErrors = { tipe: false, nominal: false };
    let hasError = false;

    if (!addForm.tipe.trim()) {
      newErrors.tipe = true;
      hasError = true;
    }
    
    const rawNominal = addForm.nominal.replace(/\./g, '').replace(/,/g, '');
    if (!rawNominal || parseInt(rawNominal) === 0) {
      newErrors.nominal = true;
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) {
      showSnackbar("Mohon isi semua field dengan benar!", 'error');
      return;
    }

    const payload = {
      tipe: addForm.tipe,
      nominal: rawNominal
    };

    setConfirmDialog({
      open: true,
      title: 'Konfirmasi Tambah PTKP',
      message: 'Apakah Anda yakin ingin menambahkan data PTKP ini?',
      action: 'ADD',
      payload: payload
    });
  };

  const handleUpdate = () => {
    let newErrors = { tipe: false, nominal: false };
    let hasError = false;
    const rawNominal = String(selectedRow.nominal).replace(/\./g, '').replace(/,/g, '');
    
    if (!selectedRow.tipe?.trim()) {
      newErrors.tipe = true;
      hasError = true;
    }
    if (!rawNominal || parseInt(rawNominal) === 0) {
      newErrors.nominal = true;
      hasError = true;
    }

    setEditErrors(newErrors);
    if (hasError) {
      showSnackbar("Mohon isi semua field dengan benar!", 'error');
      return;
    }

    const payload = {
      id: selectedRow.id,
      tipe: selectedRow.tipe,
      nominal: rawNominal
    };

    setConfirmDialog({
      open: true,
      title: 'Konfirmasi Update PTKP',
      message: 'Apakah Anda yakin ingin memperbarui data PTKP ini?',
      action: 'UPDATE',
      payload: payload
    });
  };

  const executeAction = async () => {
    try {
      const token = localStorage.getItem('token');
      const { action, payload } = confirmDialog;
      const url = action === 'ADD' ? `${API_URL}/api/master-ptkp/add` : `${API_URL}/api/master-ptkp/update`;

      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showSnackbar(response.data.message || 'Operasi berhasil', 'success');
        if (action === 'ADD') {
          setOpenAdd(false);
          setAddForm({ tipe: '', nominal: '' });
        } else {
          setOpenEdit(false);
        }
        setConfirmDialog({ open: false, title: '', message: '', action: null, payload: null });
        fetchPtkpData();
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

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/master-ptkp/history`, {
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
      showSnackbar('Gagal mengambil history PTKP', 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchPtkpData();
  }, [page, pageSize]);

  useEffect(() => {
    if (openHistory) fetchHistory();
  }, [historyPage, historyPageSize, openHistory]);

  const historyColumns = [
    { id: 'tipe', label: 'Tipe PTKP', render: (row) => <Typography sx={{ fontWeight: 700 }}>{row.tipe}</Typography> },
    { id: 'nominal', label: 'Nominal', render: (row) => row.nominal ? `Rp ${formatNominal(String(row.nominal))}` : 'Rp -' },
    { id: 'nominalUpdate', label: 'Nominal Update', render: (row) => row.nominalUpdate ? `Rp ${formatNominal(String(row.nominalUpdate))}` : 'Rp -' },
    { id: 'createdBy', label: 'Created By' },
    { id: 'createdDate', label: 'Created Date', render: (row) => row.createdDate ? new Date(row.createdDate).toLocaleString('id-ID') : '-' },
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

  const columns = [
    { 
      id: 'tipe', 
      label: 'Golongan PTKP', 
      render: (row) => (
        <Chip 
          label={row.tipe} 
          size="small" 
          sx={{ fontWeight: 800, bgcolor: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', fontSize: '0.8125rem' }} 
        />
      )
    },
    { 
      id: 'nominal', 
      label: 'Nominal PTKP Tahunan', 
      render: (row) => (
        <Typography sx={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace', fontSize: '0.875rem' }}>
          Rp {formatNominal(String(row.nominal))}
        </Typography>
      )
    },
    { id: 'createdBy', label: 'Created By' },
    { id: 'createdDate', label: 'Created Date', render: (row) => row.createdDate ? new Date(row.createdDate).toLocaleString('id-ID') : '-' },
    { id: 'updateBy', label: 'Update By', render: (row) => row.updateBy || '-' },
    { id: 'updateDate', label: 'Update Date', render: (row) => row.updateDate ? new Date(row.updateDate).toLocaleString('id-ID') : '-' },
    ...(isSpv ? [{
      id: 'actions', label: 'Aksi', align: 'center', render: (row) => (
        <Tooltip title="Edit PTKP">
          <IconButton 
            size="small" 
            onClick={() => {
              setSelectedRow({ ...row, nominal: formatNominal(String(row.nominal)) });
              setEditErrors({ tipe: false, nominal: false });
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
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.4)'
        }}>
          <FamilyRestroomIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Master PTKP
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Kelola data status Penghasilan Tidak Kena Pajak (PTKP PPh 21)
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <GroupsIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Golongan PTKP</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{totalElements || ptkpData.length} Golongan</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>PTKP Dasar (TK/0)</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>Rp 54.000.000</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <FamilyRestroomIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>PTKP Tertinggi (K/3)</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>Rp 72.000.000</Typography>
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
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>PMK-101 Aktif</Typography>
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
              placeholder="Cari golongan (misal: TK/0, K/1, K/2)..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchPtkpData(); } }}
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
                onClick={() => {
                  setPage(1);
                  fetchPtkpData();
                }} 
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
            Daftar Golongan & Tarif PTKP
          </Typography>
          <Chip label={`${totalElements} Data Terdaftar`} size="small" sx={{ bgcolor: 'action.hover', fontWeight: 700, borderRadius: '6px' }} />
        </Stack>

        <Stack direction="row" spacing={1.5}>
          {isSpv && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => {
                setAddForm({ tipe: '', nominal: '' });
                setErrors({ tipe: false, nominal: false });
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
              + TAMBAH PTKP
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
        data={ptkpData}
        page={page}
        pageSize={pageSize}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        loading={loading}
      />

      {/* Modal Add PTKP */}
      <CustomModal open={openAdd} onClose={() => setOpenAdd(false)} title="Tambah Golongan PTKP Baru" maxWidth="xs">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Golongan PTKP (Contoh: TK/0, K/1, K/2, K/3)</Typography>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Contoh: TK/0"
              value={addForm.tipe}
              onChange={(e) => {
                setAddForm({ ...addForm, tipe: e.target.value.toUpperCase() });
                if (e.target.value) setErrors(prev => ({ ...prev, tipe: false }));
              }}
              error={errors.tipe}
              helperText={errors.tipe ? "Tipe golongan wajib diisi" : ""}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Nominal PTKP Tahunan (Rp)</Typography>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="Contoh: 54.000.000"
              value={addForm.nominal}
              onChange={(e) => {
                setAddForm({ ...addForm, nominal: formatNominal(e.target.value) });
                if (e.target.value) setErrors(prev => ({ ...prev, nominal: false }));
              }}
              error={errors.nominal}
              helperText={errors.nominal ? "Nominal tidak boleh kosong" : ""}
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

      {/* Modal Edit PTKP */}
      <CustomModal open={openEdit} onClose={() => setOpenEdit(false)} title="Edit Golongan PTKP" maxWidth="xs">
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Golongan PTKP</Typography>
            <TextField 
              fullWidth 
              size="small" 
              value={selectedRow?.tipe || ''}
              onChange={(e) => {
                setSelectedRow({ ...selectedRow, tipe: e.target.value.toUpperCase() });
                if (e.target.value) setEditErrors(prev => ({ ...prev, tipe: false }));
              }}
              error={editErrors.tipe}
              helperText={editErrors.tipe ? "Tipe golongan wajib diisi" : ""}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Nominal PTKP Tahunan (Rp)</Typography>
            <TextField 
              fullWidth 
              size="small" 
              value={selectedRow?.nominal ? formatNominal(String(selectedRow.nominal)) : ''}
              onChange={(e) => {
                setSelectedRow({ ...selectedRow, nominal: formatNominal(e.target.value) });
                if (e.target.value) setEditErrors(prev => ({ ...prev, nominal: false }));
              }}
              error={editErrors.nominal}
              helperText={editErrors.nominal ? "Nominal tidak boleh kosong" : ""}
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
      <CustomModal open={openHistory} onClose={() => setOpenHistory(false)} title="Log History Perubahan PTKP" maxWidth="lg">
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

      {/* Confirm Dialog */}
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

export default MasterPtkp;
