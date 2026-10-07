import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel,
  Stack, Grid, IconButton, Tooltip, Chip, Checkbox, Avatar, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  History as HistoryIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  GetApp as ExportIcon,
  Edit as EditIcon,
  CloudUpload as UploadIcon,
  PauseCircle as PauseCircleIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  PendingActions as PendingActionsIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  CalendarMonth as CalendarMonthIcon,
  Assignment as AssignmentIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Description as DescriptionIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

// Fallback Initial Data
const INITIAL_HOLD_RECORDS = [
  {
    id: 1,
    nik: 'D8210663',
    nama: 'POPI ANGRAINI',
    periodePenggajian: 'December 2026',
    division: 'Tax, Accounting & Biz Plan',
    unitName: 'Accounting',
    statusKetenagakerjaan: 'PKWT',
    namaBank: 'BCA',
    cabangBank: 'KCP Thamrin',
    norek: '7310291023',
    thpHold: 12096913,
    keterangan: 'Karyawan tanpa data rekening awal',
    tanggalRelease: '2026-07-23',
    statusApprovalRelease: 'Approved',
    fileUploadName: 'MoM Sistem Payroll - 08 April 2026.pdf',
    fileUrl: '',
    payrollDate: '2026-12-25',
    position: 'Supervisor',
    branch: 'JAKARTA'
  },
  {
    id: 2,
    nik: 'D0000331',
    nama: 'Pegawai Dummy 331',
    periodePenggajian: 'December 2026',
    division: 'Business Development',
    unitName: 'Laku Pandai',
    statusKetenagakerjaan: 'PKWT',
    namaBank: 'BCA',
    cabangBank: 'KCP Kebon Jeruk',
    norek: '',
    thpHold: 1637831,
    keterangan: 'Karyawan tanpa data rekening',
    tanggalRelease: '',
    statusApprovalRelease: 'New',
    fileUploadName: '',
    fileUrl: '',
    payrollDate: '2026-12-25',
    position: 'Supervisor',
    branch: 'Bogor'
  }
];

const MasterHold = () => {
  const { user } = useSelector((state) => state.auth);
  const isStaff = user?.position?.toUpperCase()?.trim() === 'STAFF';

  // State Main Page
  const [records, setRecords] = useState(INITIAL_HOLD_RECORDS);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(INITIAL_HOLD_RECORDS.length);
  const [totalPages, setTotalPages] = useState(1);

  // KPI Summary State
  const [kpi, setKpi] = useState({
    totalHoldCount: INITIAL_HOLD_RECORDS.length,
    totalThpHold: 13734744,
    pendingReleaseCount: 0,
    approvedCount: 1,
    rejectedCount: 0
  });

  // Filters State
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState('');
  const [unit, setUnit] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [month, setMonth] = useState('12'); // Default December
  const [year, setYear] = useState('2026'); // Default 2026

  // Dynamic Filter Options
  const [filterOptions, setFilterOptions] = useState({
    divisions: ['Tax, Accounting & Biz Plan', 'Business Development', 'Benih Berkah Berseri'],
    units: ['Accounting', 'Laku Pandai', 'Tax', 'Benih Berkah Berseri'],
    positions: ['Supervisor', 'Staff', 'Field Officer'],
    branches: ['JAKARTA', 'Bogor', 'SUBANG'],
    employeeTypes: ['PKWT', 'PKWTT', 'MITRA'],
    months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    years: ['2026', '2025', '2024'],
    approvalStatuses: ['New', 'Pending Approval', 'Approved', 'Rejected']
  });

  // Modal States
  const [openHistory, setOpenHistory] = useState(false);
  const [openRelease, setOpenRelease] = useState(false);
  const [openRejectReason, setOpenRejectReason] = useState(false);
  const [openCancelReason, setOpenCancelReason] = useState(false);
  const [reasonText, setReasonText] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Release Form State
  const [releaseForm, setReleaseForm] = useState({
    fileName: '',
    keterangan: '',
    tanggalRelease: new Date().toISOString().split('T')[0]
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [formErrors, setFormErrors] = useState({ keterangan: false });

  // History State
  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyDivision, setHistoryDivision] = useState('');
  const [historyUnit, setHistoryUnit] = useState('');
  const [historyPosition, setHistoryPosition] = useState('');
  const [historyBranch, setHistoryBranch] = useState('');
  const [historyEmployeeType, setHistoryEmployeeType] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyTotalElements, setHistoryTotalElements] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);

  // SnackBar & Confirm Dialog
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
    { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
    { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];
  const years = ['2024', '2025', '2026', '2027', '2028'];

  // Fetch filter options from backend
  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/v1/master-hold/filter-options`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setFilterOptions(prev => ({
          ...prev,
          ...response.data
        }));
      }
    } catch (err) {
      console.warn("Using local filter options fallback:", err.message);
    }
  };

  // Fetch main list
  const fetchHoldRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/v1/master-hold`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: search || undefined,
          division: division || undefined,
          unitName: unit || undefined,
          employeeType: employeeType || undefined,
          status: approvalStatus || undefined,
          month: month || undefined,
          year: year || undefined,
          page,
          size: pageSize
        }
      });
      if (response.data) {
        setRecords(response.data.data || []);
        setTotalElements(response.data.totalElements || 0);
        setTotalPages(response.data.totalPages || 1);
        if (response.data.kpi) {
          setKpi(response.data.kpi);
        }
      }
    } catch (error) {
      console.warn("Backend API for Master Hold not ready, using mock fallback.");
      let filtered = INITIAL_HOLD_RECORDS.filter(r => {
        const matchesSearch = !search || r.nik.toLowerCase().includes(search.toLowerCase()) || r.nama.toLowerCase().includes(search.toLowerCase());
        const matchesDivision = !division || r.division === division;
        const matchesUnit = !unit || r.unitName === unit;
        const matchesEmpType = !employeeType || r.statusKetenagakerjaan.toLowerCase() === employeeType.toLowerCase();
        const matchesStatus = !approvalStatus || r.statusApprovalRelease === approvalStatus;
        return matchesSearch && matchesDivision && matchesUnit && matchesEmpType && matchesStatus;
      });
      setRecords(filtered);
      setTotalElements(filtered.length);
      setTotalPages(Math.ceil(filtered.length / pageSize) || 1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch history logs
  const fetchHistoryLogs = async () => {
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/v1/master-hold/history`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: historySearch || undefined,
          division: historyDivision || undefined,
          unitName: historyUnit || undefined,
          position: historyPosition || undefined,
          branch: historyBranch || undefined,
          employeeType: historyEmployeeType || undefined,
          page: historyPage,
          size: historyPageSize
        }
      });
      if (response.data) {
        setHistoryLogs(response.data.data || []);
        setHistoryTotalElements(response.data.totalElements || 0);
        setHistoryTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.warn("Backend History API error:", error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchHoldRecords();
  }, [page, pageSize, month, year]);

  useEffect(() => {
    if (openHistory) {
      fetchHistoryLogs();
    }
  }, [openHistory, historyPage, historyPageSize]);

  // Main UI Handlers
  const handleSearch = () => {
    setPage(1);
    fetchHoldRecords();
  };

  const handleExport = async () => {
    try {
      showSnackbar('Mengunduh file Excel...', 'info');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/v1/master-hold/export-excel`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: search || undefined,
          division: division || undefined,
          unitName: unit || undefined,
          employeeType: employeeType || undefined,
          status: approvalStatus || undefined,
          month: month || undefined,
          year: year || undefined
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Master_Hold_Export_${month}_${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showSnackbar('Export Excel berhasil!', 'success');
    } catch (err) {
      console.error("Export Error:", err);
      showSnackbar('Gagal melakukan export Excel', 'error');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(records.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(x => x !== id));
    }
  };

  // Cancel Hold with Reason (Child Form: reason_cancel_hold)
  const handleOpenCancelModal = () => {
    if (selectedIds.length === 0) return;
    setReasonText('');
    setOpenCancelReason(true);
  };

  const handleConfirmCancelHold = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/v1/master-hold/cancel`, {
        ids: selectedIds,
        reason: reasonText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Berhasil membatalkan status hold gaji', 'success');
      setOpenCancelReason(false);
      setSelectedIds([]);
      fetchHoldRecords();
    } catch (err) {
      console.warn("API Error, updating local state fallback");
      setRecords(records.filter(r => !selectedIds.includes(r.id)));
      showSnackbar('Berhasil membatalkan status hold gaji (Fallback)', 'success');
      setOpenCancelReason(false);
      setSelectedIds([]);
    }
  };

  // Approve Release (Direct / Batch)
  const handleApproveHold = () => {
    if (selectedIds.length === 0) return;
    setConfirmDialog({
      open: true,
      title: 'Approve Release Salary',
      message: `Apakah Anda yakin ingin menyetujui pelepasan hold gaji untuk ${selectedIds.length} karyawan terpilih?`,
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, open: false });
        try {
          const token = localStorage.getItem('token');
          await axios.post(`${API_URL}/api/v1/master-hold/approve`, { ids: selectedIds }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          showSnackbar('Berhasil menyetujui pelepasan hold gaji', 'success');
          setSelectedIds([]);
          fetchHoldRecords();
        } catch (err) {
          console.warn("API Error fallback:", err);
          setRecords(records.map(r => {
            if (selectedIds.includes(r.id)) {
              return { ...r, statusApprovalRelease: 'Approved' };
            }
            return r;
          }));
          showSnackbar('Berhasil menyetujui pelepasan hold gaji (Fallback)', 'success');
          setSelectedIds([]);
        }
      }
    });
  };

  // Reject Release with Reason (Child Form: reason_reject_release)
  const handleOpenRejectModal = () => {
    if (selectedIds.length === 0) return;
    setReasonText('');
    setOpenRejectReason(true);
  };

  const handleConfirmRejectRelease = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/v1/master-hold/reject`, {
        ids: selectedIds,
        reason: reasonText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Berhasil menolak pelepasan hold gaji', 'success');
      setOpenRejectReason(false);
      setSelectedIds([]);
      fetchHoldRecords();
    } catch (err) {
      console.warn("API Error fallback:", err);
      setRecords(records.map(r => {
        if (selectedIds.includes(r.id)) {
          return { ...r, statusApprovalRelease: 'Rejected' };
        }
        return r;
      }));
      showSnackbar('Berhasil menolak pelepasan hold gaji (Fallback)', 'success');
      setOpenRejectReason(false);
      setSelectedIds([]);
    }
  };

  const handleEditClick = (row) => {
    setSelectedRecord(row);
    setReleaseForm({
      fileName: row.fileUploadName || '',
      keterangan: row.keterangan || '',
      tanggalRelease: row.tanggalRelease || new Date().toISOString().split('T')[0]
    });
    setUploadFile(null);
    setFormErrors({ keterangan: false });
    setOpenRelease(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setReleaseForm({ ...releaseForm, fileName: file.name });
    }
  };

  const handleReleaseSubmit = async () => {
    if (!releaseForm.keterangan.trim()) {
      setFormErrors({ keterangan: true });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('keterangan', releaseForm.keterangan);
      formData.append('tanggalRelease', releaseForm.tanggalRelease);
      if (uploadFile) {
        formData.append('file', uploadFile);
      }

      await axios.post(`${API_URL}/api/v1/master-hold/release/${selectedRecord.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      showSnackbar('Berhasil mengajukan release hold gaji', 'success');
      setOpenRelease(false);
      fetchHoldRecords();
    } catch (err) {
      console.warn("API Error, simulating update locally on mock data");
      setRecords(records.map(r => {
        if (r.id === selectedRecord.id) {
          return {
            ...r,
            tanggalRelease: releaseForm.tanggalRelease,
            keterangan: releaseForm.keterangan,
            fileUploadName: releaseForm.fileName,
            statusApprovalRelease: 'Pending Approval'
          };
        }
        return r;
      }));
      showSnackbar('Detail release berhasil disimpan (Fallback)', 'success');
      setOpenRelease(false);
    }
  };

  const formatCurrency = (val) => {
    return 'Rp ' + (Number(val) || 0).toLocaleString('id-ID');
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, minHeight: '100vh' }}>
      {/* HEADER SECTION */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                bgcolor: '#ef4444',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              <PauseCircleIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Master Hold
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
            Manajemen penahanan dan persetujuan pelepasan data pembayaran gaji karyawan
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setOpenHistory(true)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              py: 1,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            LOG HISTORY
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExport}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              py: 1,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            EXPORT
          </Button>
        </Box>
      </Box>

      {/* TOP KPI SUMMARY CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <PauseCircleIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Total Data Hold
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {kpi.totalHoldCount} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>karyawan</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Gaji tertahan
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Total THP Hold
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981', lineHeight: 1.2 }}>
              {formatCurrency(kpi.totalThpHold)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Nominal tertahan
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <PendingActionsIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Pending Release
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#f59e0b', lineHeight: 1.2 }}>
              {kpi.pendingReleaseCount} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>karyawan</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Menunggu approval
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <CheckCircleIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Approved Release
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#3b82f6', lineHeight: 1.2 }}>
              {kpi.approvedCount} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>karyawan</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Siap ditransfer
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* FILTER PANEL */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Stack spacing={2}>
          {/* Row 1: Search & Actions */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Cari NIK / Nama Karyawan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                flex: 1,
                minWidth: '240px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc'
                }
              }}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                )
              }}
            />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  bgcolor: '#1e293b',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 3,
                  height: 40,
                  '&:hover': { bgcolor: '#0f172a' }
                }}
              >
                SEARCH
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearch('');
                  setDivision('');
                  setUnit('');
                  setEmployeeType('');
                  setApprovalStatus('');
                  setMonth('12');
                  setYear('2026');
                  setPage(1);
                }}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  height: 40,
                  px: 2.5,
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                CLEAR
              </Button>
            </Stack>
          </Box>

          {/* Row 2: Cascading SearchableSelect Filters */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
            <SearchableSelect
              placeholder="(Division)"
              value={division}
              onChange={setDivision}
              options={filterOptions.divisions || []}
            />
            <SearchableSelect
              placeholder="(Unit)"
              value={unit}
              onChange={setUnit}
              options={filterOptions.units || []}
            />
            <SearchableSelect
              placeholder="(Status Ketenagakerjaan)"
              value={employeeType}
              onChange={setEmployeeType}
              options={filterOptions.employeeTypes || []}
            />
            <SearchableSelect
              placeholder="(Status Approval)"
              value={approvalStatus}
              onChange={setApprovalStatus}
              options={filterOptions.approvalStatuses || []}
            />
          </Box>

          {/* Row 3: Month & Year Selector */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', pt: 1, borderTop: '1px dashed', borderColor: 'divider', flexWrap: 'wrap' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Periode Hold:
              </Typography>
            </Stack>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setPage(1);
                }}
                sx={{ borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}
              >
                {months.map((m) => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setPage(1);
                }}
                sx={{ borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc' }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Paper>

      {/* DATA TABLE SECTION */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden'
        }}
      >
        {/* Table Top Action Bar */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexWrap: 'wrap',
            gap: 1.5,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fbfcfd'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Daftar Gaji Tertahan (Hold)
            </Typography>
            <Chip
              label={`${totalElements} Data`}
              size="small"
              sx={{ fontWeight: 700, bgcolor: 'action.hover', fontSize: '0.75rem', borderRadius: '6px' }}
            />
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            {isStaff ? (
              <Button
                variant="contained"
                color="error"
                size="small"
                disabled={selectedIds.length === 0}
                onClick={handleOpenCancelModal}
                sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700, px: 2.5, py: 0.8 }}
              >
                Cancel Hold ({selectedIds.length})
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="small"
                  disabled={selectedIds.length === 0}
                  onClick={handleApproveHold}
                  sx={{
                    borderRadius: 2.5,
                    bgcolor: '#10b981',
                    color: 'white',
                    px: 2.5,
                    py: 0.8,
                    '&:hover': { bgcolor: '#059669' },
                    textTransform: 'none',
                    fontWeight: 700
                  }}
                >
                  Approve Release ({selectedIds.length})
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  disabled={selectedIds.length === 0}
                  onClick={handleOpenRejectModal}
                  sx={{
                    borderRadius: 2.5,
                    bgcolor: '#ef4444',
                    color: 'white',
                    px: 2.5,
                    py: 0.8,
                    '&:hover': { bgcolor: '#dc2626' },
                    textTransform: 'none',
                    fontWeight: 700
                  }}
                >
                  Reject Release ({selectedIds.length})
                </Button>
              </>
            )}
          </Stack>
        </Box>

        <DataTable
          columns={[
            {
              id: 'select',
              width: '40px',
              align: 'center',
              headerRender: () => (
                <Checkbox
                  size="small"
                  checked={records.length > 0 && selectedIds.length === records.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < records.length}
                  onChange={handleSelectAll}
                />
              ),
              render: (row) => (
                <Checkbox
                  size="small"
                  checked={selectedIds.includes(row.id)}
                  onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                />
              )
            },
            {
              id: 'nik',
              label: 'NIK',
              width: '95px',
              render: (row) => (
                <Chip label={row.nik} size="small" sx={{ fontFamily: 'monospace', fontWeight: 700, bgcolor: 'action.hover', borderRadius: '6px', fontSize: '0.75rem' }} />
              )
            },
            {
              id: 'nama',
              label: 'Nama Karyawan',
              render: (row) => (
                <Tooltip title={row.nama} arrow>
                  <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                    {row.nama}
                  </Typography>
                </Tooltip>
              )
            },
            {
              id: 'statusKetenagakerjaan',
              label: 'Tipe',
              width: '75px',
              render: (row) => (
                <Chip label={row.statusKetenagakerjaan || 'PKWT'} size="small" sx={{ fontWeight: 600, borderRadius: '6px', fontSize: '0.72rem' }} />
              )
            },
            {
              id: 'division',
              label: 'Divisi',
              render: (row) => (
                <Tooltip title={row.division || '-'} arrow>
                  <Typography sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>
                    {row.division || '-'}
                  </Typography>
                </Tooltip>
              )
            },
            {
              id: 'unitName',
              label: 'Unit Name',
              render: (row) => (
                <Tooltip title={row.unitName || '-'} arrow>
                  <Typography sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>
                    {row.unitName || '-'}
                  </Typography>
                </Tooltip>
              )
            },
            {
              id: 'branch',
              label: 'Branch',
              width: '85px',
              render: (row) => (
                <Typography sx={{ fontSize: '0.8rem' }}>{row.branch || '-'}</Typography>
              )
            },
            {
              id: 'statusApprovalRelease',
              label: 'Status Release',
              width: '120px',
              align: 'center',
              render: (row) => {
                let bgcolor = 'rgba(59, 130, 246, 0.12)';
                let color = '#2563eb';
                if (row.statusApprovalRelease === 'Approved') {
                  bgcolor = 'rgba(16, 185, 129, 0.12)';
                  color = '#059669';
                } else if (row.statusApprovalRelease === 'Pending Approval') {
                  bgcolor = 'rgba(245, 158, 11, 0.12)';
                  color = '#d97706';
                } else if (row.statusApprovalRelease === 'Rejected') {
                  bgcolor = 'rgba(239, 68, 68, 0.12)';
                  color = '#dc2626';
                }
                return (
                  <Chip
                    label={row.statusApprovalRelease || 'New'}
                    size="small"
                    sx={{ bgcolor, color, fontWeight: 800, fontSize: '0.72rem', borderRadius: '6px', height: 22 }}
                  />
                );
              }
            },
            {
              id: 'expand',
              label: '',
              width: '40px',
              align: 'center',
              render: (row, rowIndex, isExpanded, toggleExpand) => (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (toggleExpand) toggleExpand();
                  }}
                  sx={{
                    color: isExpanded ? 'primary.main' : 'text.secondary',
                    bgcolor: isExpanded ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    transition: 'all 0.2s',
                    p: 0.5,
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: 'primary.main'
                    }
                  }}
                >
                  {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                </IconButton>
              )
            }
          ]}
          data={records}
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
          renderCollapsibleRow={(row) => {
            const isApproved = row.statusApprovalRelease === 'Approved';

            return (
              <Box sx={{ width: '100%', py: 1.5, px: { xs: 1, sm: 2 } }}>
                {/* Top Header Profile Strip */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    pb: 1.5,
                    mb: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: '#ef4444',
                        color: '#fff',
                        fontWeight: 700,
                        width: 38,
                        height: 38,
                        fontSize: '0.95rem'
                      }}
                    >
                      {row.nama ? row.nama.charAt(0) : 'H'}
                    </Avatar>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.95rem' }}>
                          {row.nama}
                        </Typography>
                        <Chip
                          label={row.nik}
                          size="small"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            bgcolor: 'action.hover'
                          }}
                        />
                        <Chip
                          label={row.statusKetenagakerjaan || 'PKWT'}
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                        />
                      </Stack>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {row.position || 'Staff'} • {row.division} ({row.branch})
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditClick(row)}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        borderRadius: '8px',
                        borderColor: '#d97706',
                        color: '#d97706',
                        '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.08)', borderColor: '#b45309' }
                      }}
                    >
                      Form Release Hold
                    </Button>
                  </Stack>
                </Box>

                {/* 3 Minimal Linear Columns */}
                <Grid container spacing={2.5}>
                  {/* Column 1: Info Rekening Bank & Alasan */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <Box sx={{ p: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1.5 }}>
                        Informasi Rekening Bank
                      </Typography>
                      <Stack spacing={1.2}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Nama Bank</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.namaBank || '-'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Cabang Bank</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.cabangBank || '-'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Nomor Rekening</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                            {row.norek || <Box component="span" sx={{ color: 'error.main', fontStyle: 'italic' }}>Belum ada data</Box>}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Keterangan / Alasan Hold</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.keterangan || '-'}</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Column 2: Status & Riwayat Release */}
                  <Grid item xs={12} sm={6} lg={4}>
                    <Box sx={{ p: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1.5 }}>
                        Status & Tanggal Release
                      </Typography>
                      <Stack spacing={1.2}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Status Approval</Typography>
                          <Box sx={{ mt: 0.2 }}>
                            <Chip
                              label={row.statusApprovalRelease || 'New'}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                bgcolor: isApproved ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                color: isApproved ? '#059669' : '#d97706'
                              }}
                            />
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Tanggal Release</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.tanggalRelease || '-'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Dokumen Bukti Lampiran</Typography>
                          {row.fileUploadName ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <DescriptionIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {row.fileUploadName}
                              </Typography>
                              {row.fileUrl && (
                                <Tooltip title="Buka Dokumen Bukti">
                                  <IconButton
                                    size="small"
                                    onClick={() => window.open(`${API_URL}${row.fileUrl}`, '_blank')}
                                    sx={{ color: 'primary.main', p: 0.5 }}
                                  >
                                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Tidak ada lampiran</Typography>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Column 3: Highlight THP Hold Banner */}
                  <Grid item xs={12} sm={12} lg={4}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.04)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Take Home Pay Tertahan
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#b91c1c', mt: 0.5 }}>
                          {formatCurrency(row.thpHold)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                          Periode: {row.periodePenggajian || 'December 2026'}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1.5, pt: 1, borderTop: '1px dashed rgba(239, 68, 68, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Status Gaji:</Typography>
                        <Chip label={row.statusApprovalRelease === 'Approved' ? 'SIAP DITRANSFER' : 'TERTAHAN'} size="small" color={row.statusApprovalRelease === 'Approved' ? 'success' : 'error'} sx={{ fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            );
          }}
        />
      </Paper>

      {/* MODAL: LOG HISTORY (history_hold) */}
      <CustomModal open={openHistory} onClose={() => setOpenHistory(false)} title="History Hold" maxWidth="lg">
        <Stack spacing={2.5}>
          {/* Filter Bar Inside History Modal */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
            <TextField
              size="small"
              placeholder="Search NIK / Nama..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchHistoryLogs()}
              InputProps={{ startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} /> }}
            />
            <SearchableSelect
              placeholder="(Division)"
              value={historyDivision}
              onChange={setHistoryDivision}
              options={filterOptions.divisions || []}
            />
            <SearchableSelect
              placeholder="(Unit)"
              value={historyUnit}
              onChange={setHistoryUnit}
              options={filterOptions.units || []}
            />
            <SearchableSelect
              placeholder="(Position)"
              value={historyPosition}
              onChange={setHistoryPosition}
              options={filterOptions.positions || []}
            />
          </Box>

          <DataTable
            columns={[
              { id: 'nik', label: 'NIK', width: '90px' },
              { id: 'name', label: 'Nama' },
              { id: 'division', label: 'Division' },
              { id: 'unitName', label: 'Unit Name' },
              { id: 'employeeType', label: 'Status TK', width: '90px' },
              { id: 'position', label: 'Position' },
              { id: 'branch', label: 'Branch' },
              {
                id: 'thp',
                label: 'THP Hold',
                align: 'right',
                render: (row) => formatCurrency(row.thp)
              },
              {
                id: 'status',
                label: 'Status Log',
                render: (row) => (
                  <Chip
                    label={row.status || row.actionType || 'Log'}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      bgcolor: row.status === 'Approved' ? '#dcfce7' : '#f1f5f9',
                      color: row.status === 'Approved' ? '#15803d' : '#475569'
                    }}
                  />
                )
              },
              { id: 'dilakukanOleh', label: 'Dilakukan Oleh' },
              { id: 'actionNote', label: 'Keterangan', render: (row) => row.actionNote || '-' },
              { id: 'tanggal', label: 'Tanggal' }
            ]}
            data={historyLogs}
            loading={historyLoading}
            page={historyPage}
            pageSize={historyPageSize}
            totalElements={historyTotalElements}
            totalPages={historyTotalPages}
            onPageChange={setHistoryPage}
            onPageSizeChange={(size) => {
              setHistoryPageSize(size);
              setHistoryPage(1);
            }}
          />
        </Stack>
      </CustomModal>

      {/* MODAL: DETAIL RELEASE & PROOF UPLOAD (detail_hold / upload_release_data) */}
      <CustomModal open={openRelease} onClose={() => setOpenRelease(false)} title="Detail Release" maxWidth="sm">
        {selectedRecord && (
          <Stack spacing={2.5}>
            {/* Read-only snapshot */}
            <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc' }} elevation={0}>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">NIK</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedRecord.nik}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nama</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedRecord.nama}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Division</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.division}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Unit Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.unitName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Kode Bank</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.namaBank || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nomor Rekening</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRecord.norek || '-'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">THP Hold</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#ef4444' }}>{formatCurrency(selectedRecord.thpHold)}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Inputs Section */}
            <TextField
              label="Nama File Dokumen Bukti"
              fullWidth
              size="small"
              value={releaseForm.fileName}
              disabled
              placeholder="Pilih file untuk mengisi lampiran bukti..."
            />

            {/* File Selector */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                sx={{ borderRadius: 2, textTransform: 'none', color: '#6366f1', borderColor: '#cbd5e1' }}
              >
                Choose File
                <input type="file" hidden accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
              </Button>
              <Typography variant="caption" color="text.secondary">
                {uploadFile ? `Selected: ${uploadFile.name}` : 'Format yang didukung: PDF, PNG, JPG, JPEG'}
              </Typography>
            </Stack>

            <TextField
              label="Keterangan / Alasan Release"
              fullWidth
              multiline
              rows={3}
              required
              value={releaseForm.keterangan}
              onChange={(e) => setReleaseForm({ ...releaseForm, keterangan: e.target.value })}
              error={formErrors.keterangan}
              helperText={formErrors.keterangan ? 'Keterangan wajib diisi' : ''}
            />

            <TextField
              label="Tanggal Release"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={releaseForm.tanggalRelease}
              onChange={(e) => setReleaseForm({ ...releaseForm, tanggalRelease: e.target.value })}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1.5 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenRelease(false)}
                sx={{ borderRadius: 2, color: '#64748b', borderColor: '#cbd5e1', textTransform: 'none', fontWeight: 700 }}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                onClick={handleReleaseSubmit}
                sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
              >
                Simpan Release
              </Button>
            </Stack>
          </Stack>
        )}
      </CustomModal>

      {/* MODAL: REASON REJECT RELEASE (reason_reject_release) */}
      <Dialog open={openRejectReason} onClose={() => setOpenRejectReason(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>
          Alasan Penolakan Release Hold
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Masukkan alasan penolakan untuk {selectedIds.length} data karyawan terpilih:
          </Typography>
          <TextField
            autoFocus
            label="Alasan Penolakan (Reject Reason)"
            multiline
            rows={3}
            fullWidth
            required
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenRejectReason(false)} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Batal
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmRejectRelease}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          >
            Tolak Release
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL: REASON CANCEL HOLD (reason_cancel_hold) */}
      <Dialog open={openCancelReason} onClose={() => setOpenCancelReason(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1rem', pb: 1 }}>
          Alasan Pembatalan Hold
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Masukkan alasan pembatalan status hold untuk {selectedIds.length} data karyawan terpilih:
          </Typography>
          <TextField
            autoFocus
            label="Alasan Pembatalan (Cancel Reason)"
            multiline
            rows={3}
            fullWidth
            required
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenCancelReason(false)} sx={{ textTransform: 'none', color: 'text.secondary' }}>
            Batal
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancelHold}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          >
            Batalkan Hold
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Snackbar & Confirm Dialog */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
      <CustomConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </Box>
  );
};

export default MasterHold;
