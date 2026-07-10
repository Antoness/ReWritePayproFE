import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  CircularProgress
} from '@mui/material';
import {
  History as HistoryIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
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
    if (hasError) { showSnackbar('Please fill all required fields correctly!', 'error'); return; }

    setConfirmDialog({
      open: true,
      title: 'Confirm Add',
      message: 'Are you sure you want to add this PKP data?',
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
    if (hasError) { showSnackbar('Please fill all required fields correctly!', 'error'); return; }

    setConfirmDialog({
      open: true,
      title: 'Confirm Update',
      message: 'Are you sure you want to update this PKP data?',
      action: 'UPDATE',
      payload: { id: selectedRow.id, value: rawValue, tax: selectedRow.tax, taxTanpaNpwp: selectedRow.taxTanpaNpwp }
    });
  };

  // ---- EXECUTE (Called after Yes on confirm dialog) ----
  const executeAction = async () => {
    try {
      const token = localStorage.getItem('token');
      const { action, payload } = confirmDialog;
      const url = action === 'ADD' ? `${API_URL}/api/master-pkp/add` : `${API_URL}/api/master-pkp/update`;

      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showSnackbar(response.data.message, 'success');
        if (action === 'ADD') {
          setOpenAdd(false);
          setAddForm({ value: '', tax: '', taxTanpaNpwp: '' });
        } else {
          setOpenEdit(false);
        }
        setConfirmDialog({ open: false, title: '', message: '', action: null, payload: null });
        fetchPkpData();
      } else {
        showSnackbar(response.data.message, 'error');
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    } catch (err) {
      console.error(`Error executing ${confirmDialog.action}:`, err);
      showSnackbar(`${confirmDialog.action} failed. Server error.`, 'error');
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

  // ---- HISTORY COLUMNS ----
  const historyColumns = [
    {
      id: 'value',
      label: 'Value',
      render: (row) => (
        <Typography sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
          {row.value && row.value !== '-' ? `Rp ${formatNominal(String(row.value))}` : '-'}
        </Typography>
      )
    },
    {
      id: 'valueUpdate',
      label: 'Value Update',
      render: (row) => (
        <Typography sx={{ fontWeight: 500, whiteSpace: 'nowrap', color: row.valueUpdate && row.valueUpdate !== '-' ? '#16a34a' : 'inherit' }}>
          {row.valueUpdate && row.valueUpdate !== '-' ? `Rp ${formatNominal(String(row.valueUpdate))}` : '-'}
        </Typography>
      )
    },
    { id: 'tax',         label: 'Tax' },
    { id: 'taxUpdate',   label: 'Tax Update',            render: (row) => row.taxUpdate   || '-' },
    { id: 'nTax',        label: 'Tax (Tanpa NPWP)',      render: (row) => row.nTax        || '-' },
    { id: 'nTaxUpdate',  label: 'Tax (Tanpa NPWP) Update', render: (row) => row.nTaxUpdate  || '-' },
    { id: 'createdBy',   label: 'Created By' },
    {
      id: 'createdDate',
      label: 'Created Date',
      render: (row) => row.createdDate ? new Date(row.createdDate).toLocaleString('id-ID') : '-'
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.75rem',
            px: 1.5, py: 0.4,
            borderRadius: '12px',
            display: 'inline-block',
            bgcolor: row.status === 'ADD' ? '#dcfce7' : '#dbeafe',
            color:   row.status === 'ADD' ? '#16a34a' : '#1d4ed8',
          }}
        >
          {row.status || '-'}
        </Typography>
      )
    },
  ];

  // ---- MAIN TABLE COLUMNS ----
  const columns = [
    {
      id: 'value',
      label: 'Value',
      render: (row) => (
        <Typography sx={{ fontWeight: 500 }}>
          Rp {row.value ? formatNominal(String(row.value)) : '-'}
        </Typography>
      )
    },
    { id: 'tax', label: 'Tax' },
    { id: 'taxTanpaNpwp', label: 'Tax (Tanpa NPWP)' },
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
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setSelectedRow({ ...row, value: formatNominal(String(row.value)) });
            setEditErrors({ value: false, tax: false, taxTanpaNpwp: false });
            setOpenEdit(true);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )
    }] : [])
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Master PKP</Typography>
        <Typography variant="body2" color="text.secondary">Kelola data Penghasilan Kena Pajak</Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 4, bgcolor: '#f1f5f9' }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search PKP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchPkpData(); } }}
              sx={{ bgcolor: 'white', borderRadius: '8px' }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setPage(1);
                fetchPkpData();
              }}
              sx={{ bgcolor: '#1e293b', borderRadius: '8px', height: '40px', fontWeight: 600 }}
            >
              SEARCH
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              {isSpv && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setAddForm({ value: '', tax: '', taxTanpaNpwp: '' });
                    setErrors({ value: false, tax: false, taxTanpaNpwp: false });
                    setOpenAdd(true);
                  }}
                  sx={{ borderRadius: '8px', fontWeight: 800, color: '#3b82f6', borderColor: '#3b82f6', borderWidth: '2px', '&:hover': { borderWidth: '2px' } }}
                >
                  ADD
                </Button>
              )}

              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => {
                  setOpenHistory(true);
                  fetchHistory();
                }}
                sx={{ borderRadius: '8px', fontWeight: 600, color: '#1e293b', borderColor: '#cbd5e1' }}
              >
                LOG HISTORY
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

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

      {/* Dialog Add */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: '#3b82f6', color: 'white', py: 1, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Add PKP</Typography>
          <IconButton onClick={() => setOpenAdd(false)} size="small" sx={{ color: 'white' }}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Value (Nominal)</Typography>
              <TextField
                fullWidth size="small"
                placeholder="Contoh: 60,000,000"
                value={addForm.value}
                onChange={(e) => {
                  setAddForm({ ...addForm, value: formatNominal(e.target.value) });
                  if (e.target.value) setErrors(prev => ({ ...prev, value: false }));
                }}
                error={errors.value}
                helperText={errors.value ? "[Value] can't be empty" : ''}
              />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Tax</Typography>
              <TextField
                fullWidth size="small"
                placeholder="Contoh: 0.05"
                value={addForm.tax}
                onChange={(e) => {
                  setAddForm({ ...addForm, tax: e.target.value });
                  if (e.target.value) setErrors(prev => ({ ...prev, tax: false }));
                }}
                error={errors.tax}
                helperText={errors.tax ? "[Tax] can't be empty" : ''}
              />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Tax (Tanpa NPWP)</Typography>
              <TextField
                fullWidth size="small"
                placeholder="Contoh: 0.08"
                value={addForm.taxTanpaNpwp}
                onChange={(e) => {
                  setAddForm({ ...addForm, taxTanpaNpwp: e.target.value });
                  if (e.target.value) setErrors(prev => ({ ...prev, taxTanpaNpwp: false }));
                }}
                error={errors.taxTanpaNpwp}
                helperText={errors.taxTanpaNpwp ? "[Tax Tanpa NPWP] can't be empty" : ''}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSaveAdd}
                sx={{ px: 4, bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 700, border: '1px solid #cbd5e1', boxShadow: 'none', '&:hover': { bgcolor: '#e2e8f0' } }}
              >
                SAVE
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: '#3b82f6', color: 'white', py: 1, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Edit PKP</Typography>
          <IconButton onClick={() => setOpenEdit(false)} size="small" sx={{ color: 'white' }}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Value (Nominal)</Typography>
              <TextField
                fullWidth size="small"
                value={selectedRow?.value ? formatNominal(String(selectedRow.value)) : ''}
                onChange={(e) => {
                  setSelectedRow({ ...selectedRow, value: formatNominal(e.target.value) });
                  if (e.target.value) setEditErrors(prev => ({ ...prev, value: false }));
                }}
                error={editErrors.value}
                helperText={editErrors.value ? "[Value] can't be empty" : ''}
              />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Tax</Typography>
              <TextField
                fullWidth size="small"
                value={selectedRow?.tax || ''}
                onChange={(e) => {
                  setSelectedRow({ ...selectedRow, tax: e.target.value });
                  if (e.target.value) setEditErrors(prev => ({ ...prev, tax: false }));
                }}
                error={editErrors.tax}
                helperText={editErrors.tax ? "[Tax] can't be empty" : ''}
              />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Tax (Tanpa NPWP)</Typography>
              <TextField
                fullWidth size="small"
                value={selectedRow?.taxTanpaNpwp || ''}
                onChange={(e) => {
                  setSelectedRow({ ...selectedRow, taxTanpaNpwp: e.target.value });
                  if (e.target.value) setEditErrors(prev => ({ ...prev, taxTanpaNpwp: false }));
                }}
                error={editErrors.taxTanpaNpwp}
                helperText={editErrors.taxTanpaNpwp ? "[Tax Tanpa NPWP] can't be empty" : ''}
              />
            </Box>

            {isSpv && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  sx={{ px: 4, bgcolor: '#f1f5f9', color: '#1e293b', fontWeight: 700, border: '1px solid #cbd5e1', boxShadow: 'none', '&:hover': { bgcolor: '#e2e8f0' } }}
                >
                  UPDATE
                </Button>
              </Box>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Dialog Log History */}
      <Dialog open={openHistory} onClose={() => setOpenHistory(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: '#3b82f6', color: 'white', py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>History PKP</Typography>
          <IconButton onClick={() => setOpenHistory(false)} size="small" sx={{ color: 'white' }}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', mt: 1 }}>
            <TextField
              size="small"
              placeholder="Search..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchHistory()}
              sx={{ width: 250 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setHistoryPage(1);
                fetchHistory();
              }}
              sx={{ height: '36px', bgcolor: '#f1f5f9', color: '#1e293b', boxShadow: 'none', border: '1px solid #cbd5e1', '&:hover': { bgcolor: '#e2e8f0' } }}
            >
              Search
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
        </DialogContent>
      </Dialog>

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
