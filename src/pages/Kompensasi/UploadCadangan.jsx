import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Grid, Chip, Checkbox, Tooltip, IconButton, Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  UploadFile as UploadFileIcon,
  CloudUpload as CloudUploadIcon,
  Warning as ErrorIcon,
  Delete as DeleteIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  CalendarMonth as CalendarMonthIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_CADANGAN_DATA = [
  {
    id: 1,
    nik: 'D8240100',
    name: 'TEDI RAMDANI',
    division: 'Benih Berkah Berseri',
    unitName: 'Benih Berkah Berseri',
    position: 'Field Officer',
    branch: 'SUBANG',
    employeeType: 'PKWT',
    salary: 10000000,
    nominalCadangan: 200000,
    periodePenggajian: 'November-2026',
    periodeRelease: 'December-2026'
  },
  {
    id: 2,
    nik: 'D8240101',
    name: 'SITI AMINAH',
    division: 'Benih Berkah Berseri',
    unitName: 'Benih Berkah Berseri',
    position: 'Admin Staff',
    branch: 'SUBANG',
    employeeType: 'PKWT',
    salary: 8000000,
    nominalCadangan: 160000,
    periodePenggajian: 'November-2026',
    periodeRelease: 'December-2026'
  },
  {
    id: 3,
    nik: 'D8240102',
    name: 'BUDI SANTOSO',
    division: 'Benih Berkah Berseri',
    unitName: 'Benih Berkah Berseri',
    position: 'Sales Representative',
    branch: 'SUBANG',
    employeeType: 'PKWT',
    salary: 9000000,
    nominalCadangan: 180000,
    periodePenggajian: 'November-2026',
    periodeRelease: 'December-2026'
  }
];

const INITIAL_GAGAL_DATA = [
  {
    id: 101,
    nik: 'D8240105',
    name: 'AHMAD ZAKI',
    division: 'Benih Berkah Berseri',
    unitName: 'Benih Berkah Berseri',
    position: 'Field Officer',
    branch: 'SUBANG',
    employeeType: 'PKWT',
    salary: 9500000,
    nominalCadangan: 190000,
    status: 'GAGAL',
    keterangan: 'Format kontrak tidak valid / NIK tidak ditemukan',
    createdDate: '2026-08-20',
    createdBy: 'staffhrd'
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function UploadCadangan() {
  const [dataList, setDataList] = useState(INITIAL_CADANGAN_DATA);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterMonth, setFilterMonth] = useState('November');
  const [filterYear, setFilterYear] = useState('2026');

  // Upload modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadPeriodMonth, setUploadPeriodMonth] = useState('August');
  const [uploadPeriodYear, setUploadPeriodYear] = useState('2026');
  const [selectedFile, setSelectedFile] = useState(null);

  // Gagal modal states
  const [gagalModalOpen, setGagalModalOpen] = useState(false);

  // Notifications & confirm
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: () => {} });

  const showSnackbar = (msg, sev = 'success') => {
    setSnackbar({ open: true, message: msg, severity: sev });
  };

  const handleSearch = () => {
    setPage(1);
    showSnackbar('Filter data berhasil diaplikasikan!', 'success');
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilterUnit('');
    setFilterPosition('');
    setFilterBranch('');
    setFilterEmployeeType('');
    setFilterMonth('November');
    setFilterYear('2026');
    setPage(1);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Silakan pilih data terlebih dahulu!', 'warning');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Hapus Data',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data kompensasi dicadangkan yang terpilih?`,
      onConfirm: () => {
        setDataList(prev => prev.filter(r => !selectedIds.includes(r.id)));
        setSelectedIds([]);
        showSnackbar('Data berhasil dihapus!', 'success');
        setConfirmDialog(p => ({ ...p, open: false }));
      }
    });
  };

  const handleDeleteRow = (row) => {
    setConfirmDialog({
      open: true,
      title: 'Hapus Data',
      message: `Apakah Anda yakin ingin menghapus data untuk ${row.name} (${row.nik})?`,
      onConfirm: () => {
        setDataList(prev => prev.filter(r => r.id !== row.id));
        showSnackbar('Data berhasil dihapus!', 'success');
        setConfirmDialog(p => ({ ...p, open: false }));
      }
    });
  };

  const handleProcessUpload = () => {
    if (!selectedFile) {
      showSnackbar('Pilih file Excel terlebih dahulu!', 'warning');
      return;
    }
    showSnackbar(`File ${selectedFile.name} berhasil di-upload dan diproses!`, 'success');
    setUploadModalOpen(false);
    setSelectedFile(null);
  };

  const filteredData = dataList.filter(row => {
    if (searchQuery && !row.name.toLowerCase().includes(searchQuery.toLowerCase()) && !row.nik.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterUnit && row.unitName !== filterUnit) return false;
    if (filterPosition && row.position !== filterPosition) return false;
    if (filterBranch && row.branch !== filterBranch) return false;
    if (filterEmployeeType && row.employeeType !== filterEmployeeType) return false;
    return true;
  });

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  const totalNominalUkCadangan = filteredData.reduce((sum, item) => sum + item.nominalCadangan, 0);

  // Compact columns (8 key columns + select checkbox)
  const columns = [
    {
      id: 'select',
      label: '',
      width: '40px',
      align: 'center',
      headerRender: () => (
        <Checkbox
          size="small"
          checked={paginatedData.length > 0 && paginatedData.every(row => selectedIds.includes(row.id))}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(prev => Array.from(new Set([...prev, ...paginatedData.map(r => r.id)])));
            } else {
              setSelectedIds(prev => prev.filter(id => !paginatedData.map(r => r.id).includes(id)));
            }
          }}
        />
      ),
      render: (row) => (
        <Checkbox
          size="small"
          checked={selectedIds.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(prev => [...prev, row.id]);
            } else {
              setSelectedIds(prev => prev.filter(id => id !== row.id));
            }
          }}
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
      id: 'name', 
      label: 'Nama Karyawan', 
      render: (row) => (
        <Tooltip title={row.name} arrow>
          <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
            {row.name}
          </Typography>
        </Tooltip>
      ) 
    },
    { 
      id: 'employeeType', 
      label: 'Tipe', 
      width: '75px',
      render: (row) => <Chip label={row.employeeType} size="small" sx={{ fontWeight: 600, borderRadius: '6px', fontSize: '0.72rem' }} /> 
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
      id: 'position', 
      label: 'Posisi',
      render: (row) => (
        <Tooltip title={row.position || '-'} arrow>
          <Typography sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
            {row.position || '-'}
          </Typography>
        </Tooltip>
      )
    },
    { id: 'branch', label: 'Branch', width: '85px' }
  ];

  // Collapsible Minimal Linear View
  const renderCollapsibleRow = (row) => {
    return (
      <Box sx={{ width: '100%', py: 1.5, px: { xs: 1, sm: 2 } }}>
        {/* Top Header Strip */}
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
                bgcolor: '#10b981',
                color: '#fff',
                fontWeight: 700,
                width: 38,
                height: 38,
                fontSize: '0.95rem'
              }}
            >
              {row.name ? row.name.charAt(0) : 'E'}
            </Avatar>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.95rem' }}>
                  {row.name}
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
                  label={row.employeeType || 'PKWT'}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                />
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {row.position} • {row.division} ({row.branch})
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Hapus Data">
              <IconButton
                size="small"
                onClick={() => handleDeleteRow(row)}
                sx={{
                  color: 'error.main',
                  bgcolor: 'error.lighter',
                  '&:hover': { bgcolor: 'error.light', color: 'error.dark' },
                  borderRadius: '8px'
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* 3 Minimal Linear Columns */}
        <Grid container spacing={2.5}>
          {/* Column 1: Info Organisasi & Penempatan */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <AssignmentIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Organisasi & Penempatan
                </Typography>
              </Box>

              <Stack spacing={1.25}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    DIVISI / UNIT NAME
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.division} / {row.unitName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    POSISI & CABANG
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.position} ({row.branch})
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 2: Periode Cadangan UK */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <CalendarMonthIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Periode Cadangan UK
                </Typography>
              </Box>

              <Stack spacing={1.25}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Periode Penggajian
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                    {row.periodePenggajian || '-'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Periode Release
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'primary.main' }}>
                    {row.periodeRelease || '-'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Gaji Pokok
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    Rp {row.salary?.toLocaleString('id-ID') || 0}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 3: Nominal Cadangan Banner */}
          <Grid item xs={12} sm={12} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <MonetizationOnIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Finansial Pencadangan
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#047857', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    NOMINAL UK CADANGAN
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', fontFamily: 'monospace', letterSpacing: '-0.02em', fontSize: '1.25rem' }}>
                    Rp {row.nominalCadangan?.toLocaleString('id-ID') || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', mt: 0.2 }}>
                    Dicadangkan setiap bulan untuk kompensasi akhir PKWT
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

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
          <AccountBalanceWalletIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Upload Cadangan UK
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Kelola data pencadangan uang kompensasi bulanan karyawan PKWT
          </Typography>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <PeopleIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Headcount</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{filteredData.length} Karyawan</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <MonetizationOnIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Nominal Cadangan</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                Rp {totalNominalUkCadangan.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <CheckCircleIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Sinkronisasi</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>Tersinkron</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
              <CloudUploadIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Data Dipilih</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: selectedIds.length > 0 ? '#3b82f6' : 'text.primary' }}>
                {selectedIds.length} Terpilih
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search & Filter Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Cari NIK atau Nama Karyawan..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
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
                onClick={handleReset}
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

          {/* Row 2 Filters */}
          <Grid item xs={12} sm={6} md={3}>
            <SearchableSelect
              label="Unit Name"
              options={[
                { value: '', label: 'Semua Unit' },
                { value: 'Benih Berkah Berseri', label: 'Benih Berkah Berseri' }
              ]}
              value={filterUnit}
              onChange={(val) => setFilterUnit(val)}
              placeholder="Pilih Unit"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SearchableSelect
              label="Position"
              options={[
                { value: '', label: 'Semua Posisi' },
                { value: 'Field Officer', label: 'Field Officer' },
                { value: 'Admin Staff', label: 'Admin Staff' }
              ]}
              value={filterPosition}
              onChange={(val) => setFilterPosition(val)}
              placeholder="Pilih Posisi"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Branch"
              options={[
                { value: '', label: 'Semua Branch' },
                { value: 'SUBANG', label: 'SUBANG' }
              ]}
              value={filterBranch}
              onChange={(val) => setFilterBranch(val)}
              placeholder="Pilih Branch"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Month"
              options={MONTH_NAMES.map(m => ({ value: m, label: m }))}
              value={filterMonth}
              onChange={(val) => setFilterMonth(val)}
              placeholder="Pilih Bulan"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Year"
              options={['2026', '2025'].map(y => ({ value: y, label: y }))}
              value={filterYear}
              onChange={(val) => setFilterYear(val)}
              placeholder="Pilih Tahun"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Action Toolbar Directly Above Table */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: '14px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }} elevation={0}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Data Cadangan Uang Kompensasi
          </Typography>
          <Chip 
            label={`${selectedIds.length} data dipilih`} 
            color={selectedIds.length > 0 ? "primary" : "default"}
            size="small" 
            sx={{ fontWeight: 700, borderRadius: '6px' }} 
          />
        </Stack>

        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={() => setUploadModalOpen(true)}
            startIcon={<CloudUploadIcon />}
            sx={{
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#2563eb' },
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              height: '40px'
            }}
          >
            UPLOAD CADANGAN UK
          </Button>

          <Button
            variant="contained"
            onClick={() => showSnackbar('Export data sukses!', 'success')}
            startIcon={<ExportIcon />}
            sx={{
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              height: '40px'
            }}
          >
            EXPORT EXCEL
          </Button>

          <Button
            variant="outlined"
            onClick={() => setGagalModalOpen(true)}
            startIcon={<ErrorIcon />}
            sx={{
              color: '#ef4444',
              borderColor: '#fca5a5',
              '&:hover': { bgcolor: '#fef2f2', borderColor: '#ef4444' },
              borderRadius: '10px',
              fontWeight: 700,
              height: '40px'
            }}
          >
            DATA GAGAL UPLOAD
          </Button>

          <Button
            variant="contained"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            startIcon={<DeleteIcon />}
            sx={{
              bgcolor: '#ef4444',
              '&:hover': { bgcolor: '#dc2626' },
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              height: '40px'
            }}
          >
            DELETE DATA
          </Button>
        </Stack>
      </Paper>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedData}
        loading={false}
        page={page}
        pageSize={pageSize}
        totalElements={filteredData.length}
        totalPages={Math.ceil(filteredData.length / pageSize) || 1}
        onPageChange={setPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
        renderCollapsibleRow={renderCollapsibleRow}
      />

      {/* DIALOG: UPLOAD CADANGAN UK */}
      <CustomModal 
        open={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
        title="Upload Cadangan Uang Kompensasi"
        maxWidth="sm"
      >
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Periode Bulan & Tahun</Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <SearchableSelect
                options={MONTH_NAMES.map(m => ({ value: m, label: m }))}
                value={uploadPeriodMonth}
                onChange={(val) => setUploadPeriodMonth(val)}
                placeholder="Pilih Bulan"
              />
              <SearchableSelect
                options={['2026', '2025'].map(y => ({ value: y, label: y }))}
                value={uploadPeriodYear}
                onChange={(val) => setUploadPeriodYear(val)}
                placeholder="Pilih Tahun"
              />
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>File Excel (.xls / .xlsx)</Typography>
            <TextField 
              type="file" 
              size="small" 
              fullWidth
              onChange={(e) => setSelectedFile(e.target.files[0])}
              inputProps={{ accept: ".xls,.xlsx" }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }} 
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => showSnackbar('Download template sukses!', 'success')}
              sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none' }}
            >
              Template Excel
            </Button>
            <Button
              variant="contained"
              onClick={handleProcessUpload}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, borderRadius: '8px', fontWeight: 700, px: 3, boxShadow: 'none' }}
            >
              PROSES UPLOAD
            </Button>
          </Box>
        </Stack>
      </CustomModal>

      {/* DIALOG: DATA GAGAL UPLOAD */}
      <CustomModal 
        open={gagalModalOpen} 
        onClose={() => setGagalModalOpen(false)} 
        title="Daftar Data Gagal Upload Cadangan UK"
        maxWidth="lg"
      >
        <DataTable
          columns={[
            { id: 'nik', label: 'NIK' },
            { id: 'name', label: 'Nama' },
            { id: 'division', label: 'Divisi' },
            { id: 'unitName', label: 'Unit Name' },
            { id: 'position', label: 'Posisi' },
            { id: 'branch', label: 'Branch' },
            { id: 'employeeType', label: 'Tipe' },
            { 
              id: 'nominalCadangan', 
              label: 'Nominal Cadangan', 
              align: 'right', 
              render: (row) => `Rp ${row.nominalCadangan.toLocaleString('id-ID')}` 
            },
            { 
              id: 'status', 
              label: 'Status', 
              render: (row) => <Chip label={row.status} color="error" size="small" sx={{ fontWeight: 'bold' }} /> 
            },
            { id: 'keterangan', label: 'Keterangan Error' },
            { id: 'createdDate', label: 'Created Date' },
            { id: 'createdBy', label: 'Created By' }
          ]}
          data={INITIAL_GAGAL_DATA}
          loading={false}
          page={1}
          pageSize={10}
          totalElements={INITIAL_GAGAL_DATA.length}
          totalPages={1}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
        />
      </CustomModal>

      {/* Global Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      />

      {/* Global Confirm Dialog */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(p => ({ ...p, open: false }))}
      />
    </Box>
  );
}
