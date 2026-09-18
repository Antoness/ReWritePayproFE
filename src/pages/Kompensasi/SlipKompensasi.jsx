import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Grid, Chip, Checkbox, Tooltip, IconButton, Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  Print as PrintIcon,
  PlayArrow as PlayIcon,
  RotateLeft as RotateLeftIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  People as PeopleIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarMonthIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_SLIP_DATA = [
  {
    id: 1,
    nik: 'D8240100',
    name: 'TEDI RAMDANI',
    employeeType: 'PKWT',
    department: 'Business Development',
    division: 'Benih Berkah Berseri',
    unitName: 'Benih Berkah Berseri',
    position: 'Field Officer',
    branch: 'SUBANG',
    startContract: '01/11/2026',
    endContract: '30/12/2026',
    resignDate: '',
    numOfContract: '',
    salary: 10000000,
    periodeAwalUk: '01/11/2026',
    periodeSelesaiUk: '30/12/2026',
    hitunganBulan: '2 Bulan',
    modeUk: 'MODE_7',
    totalUk: 200000,
    efektifPaymentDate: '25/11/2026',
    statusSlip: 'RETURNED',
    keterangan: 'Perlu revisi periode'
  },
  {
    id: 2,
    nik: 'D8240101',
    name: 'SITI AMINAH',
    employeeType: 'PKWT',
    department: 'Operational',
    division: 'Benih Berkah Berseri',
    unitName: 'Benih Berkah Berseri',
    position: 'Admin Staff',
    branch: 'SUBANG',
    startContract: '01/11/2026',
    endContract: '30/12/2026',
    resignDate: '',
    numOfContract: '',
    salary: 8000000,
    periodeAwalUk: '01/11/2026',
    periodeSelesaiUk: '30/12/2026',
    hitunganBulan: '2 Bulan',
    modeUk: 'MODE_7',
    totalUk: 160000,
    efektifPaymentDate: '25/11/2026',
    statusSlip: 'APPROVED',
    keterangan: 'Siap bayar'
  },
  {
    id: 3,
    nik: 'D8240102',
    name: 'BUDI SANTOSO',
    employeeType: 'PKWT',
    department: 'Marketing',
    division: 'Benih Berkah Berseri',
    unitName: 'Benih Berkah Berseri',
    position: 'Sales Representative',
    branch: 'SUBANG',
    startContract: '01/11/2026',
    endContract: '30/12/2026',
    resignDate: '',
    numOfContract: '',
    salary: 9000000,
    periodeAwalUk: '01/11/2026',
    periodeSelesaiUk: '30/12/2026',
    hitunganBulan: '2 Bulan',
    modeUk: 'MODE_7',
    totalUk: 180000,
    efektifPaymentDate: '25/11/2026',
    statusSlip: 'RETURNED',
    keterangan: 'Revisi rekening'
  },
  {
    id: 4,
    nik: 'D8240103',
    name: 'RATNA DEWI',
    employeeType: 'PKWT',
    department: 'Finance',
    division: 'Benih Berkah Berseri',
    unitName: 'Benih Berkah Berseri',
    position: 'Finance Officer',
    branch: 'SUBANG',
    startContract: '01/11/2026',
    endContract: '30/12/2026',
    resignDate: '',
    numOfContract: '',
    salary: 10000000,
    periodeAwalUk: '01/11/2026',
    periodeSelesaiUk: '30/12/2026',
    hitunganBulan: '2 Bulan',
    modeUk: 'MODE_7',
    totalUk: 200000,
    efektifPaymentDate: '25/11/2026',
    statusSlip: 'APPROVED',
    keterangan: 'Selesai proses'
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function SlipKompensasi() {
  const [dataList, setDataList] = useState(INITIAL_SLIP_DATA);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterMonth, setFilterMonth] = useState('December');
  const [filterYear, setFilterYear] = useState('2026');
  const [filterStatusSlip, setFilterStatusSlip] = useState('');

  // Snackbars & dialogs
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: () => {} });

  const showSnackbar = (msg, sev = 'success') => {
    setSnackbar({ open: true, message: msg, severity: sev });
  };

  const handleSearch = () => {
    setPage(1);
    showSnackbar('Pencarian data slip kompensasi selesai!', 'success');
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterDivision('');
    setFilterUnit('');
    setFilterPosition('');
    setFilterBranch('');
    setFilterEmployeeType('');
    setFilterMonth('December');
    setFilterYear('2026');
    setFilterStatusSlip('');
    setPage(1);
  };

  // Main filter logic
  const filteredData = dataList.filter(row => {
    if (searchQuery && !row.name.toLowerCase().includes(searchQuery.toLowerCase()) && !row.nik.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterDivision && row.division !== filterDivision) return false;
    if (filterUnit && row.unitName !== filterUnit) return false;
    if (filterPosition && row.position !== filterPosition) return false;
    if (filterBranch && row.branch !== filterBranch) return false;
    if (filterEmployeeType && row.employeeType !== filterEmployeeType) return false;
    if (filterStatusSlip && row.statusSlip !== filterStatusSlip) return false;
    return true;
  });

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  const totalUangKompensasi = filteredData.reduce((sum, item) => sum + item.totalUk, 0);
  const returnedCount = filteredData.filter(d => d.statusSlip === 'RETURNED').length;

  // Actions
  const handleRequestSlip = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Silakan pilih data terlebih dahulu!', 'warning');
      return;
    }
    showSnackbar(`Request data slip untuk ${selectedIds.length} karyawan berhasil dikirim!`, 'success');
    setSelectedIds([]);
  };

  const handleReturnSlip = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Silakan pilih data terlebih dahulu!', 'warning');
      return;
    }
    showSnackbar(`Data slip untuk ${selectedIds.length} karyawan berhasil di-return!`, 'success');
    setSelectedIds([]);
  };

  const handleDownloadSlip = () => {
    showSnackbar('Slip Uang Kompensasi berhasil di-download!', 'success');
  };

  const handlePrintSlip = (row) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Slip Uang Kompensasi - ${row.name}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; color: #000; padding: 20px; font-size: 12px; line-height: 1.4; }
            .header { text-align: center; margin-bottom: 20px; font-weight: bold; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .details { margin-bottom: 15px; }
            .details table { width: 100%; }
            .details td { padding: 2px 0; vertical-align: top; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .amount-box { border: 1px solid #000; padding: 10px; text-align: center; font-weight: bold; font-size: 14px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #555; }
          </style>
        </head>
        <body>
          <div class="header">
            SLIP UANG KOMPENSASI PKWT<br/>
            PT. DIKA (DUTA INTEGRASI KARYA ANUGERAH)
          </div>
          <div class="details">
            <table>
              <tr>
                <td style="width: 150px;">NIK / NAMA</td>
                <td>: ${row.nik} / ${row.name}</td>
              </tr>
              <tr>
                <td>JABATAN</td>
                <td>: ${row.position}</td>
              </tr>
              <tr>
                <td>EMPLOYEE TYPE</td>
                <td>: ${row.employeeType}</td>
              </tr>
              <tr>
                <td>DIVISI / UNIT</td>
                <td>: ${row.division} / ${row.unitName}</td>
              </tr>
              <tr>
                <td>PERIODE KONTRAK</td>
                <td>: ${row.startContract} s/d ${row.endContract}</td>
              </tr>
            </table>
          </div>
          <div class="divider"></div>
          <div class="details">
            <table>
              <tr>
                <td>Gaji Pokok Acuan</td>
                <td style="text-align: right;">Rp ${row.salary.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td>Periode Kompensasi</td>
                <td style="text-align: right;">${row.periodeAwalUk} s/d ${row.periodeSelesaiUk}</td>
              </tr>
              <tr>
                <td>Mode Perhitungan</td>
                <td style="text-align: right;">${row.modeUk}</td>
              </tr>
            </table>
          </div>
          <div class="divider"></div>
          <div class="amount-box">
            TAKE HOME PAY UANG KOMPENSASI : Rp ${row.totalUk.toLocaleString('id-ID')}
          </div>
          <div class="footer">
            Slip Kompensasi PKWT ini dicetak secara komputerisasi<br/>
            Sehingga tidak memerlukan tanda tangan basah
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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
    { id: 'branch', label: 'Branch', width: '85px' },
    {
      id: 'statusSlip',
      label: 'Status Slip',
      width: '100px',
      align: 'center',
      render: (row) => (
        <Chip 
          label={row.statusSlip} 
          size="small" 
          sx={{ 
            fontWeight: 800, 
            fontSize: '0.72rem',
            bgcolor: row.statusSlip === 'APPROVED' ? '#ecfdf5' : '#fef2f2',
            color: row.statusSlip === 'APPROVED' ? '#059669' : '#dc2626',
            borderRadius: '6px' 
          }} 
        />
      )
    }
  ];

  // Collapsible Minimal Linear View
  const renderCollapsibleRow = (row) => {
    const isApproved = row.statusSlip === 'APPROVED';

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
            <Button
              variant="outlined"
              size="small"
              startIcon={<PrintIcon />}
              onClick={() => handlePrintSlip(row)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                borderRadius: '8px',
                borderColor: '#10b981',
                color: '#059669',
                '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.08)', borderColor: '#059669' }
              }}
            >
              Cetak Slip Kompensasi
            </Button>
          </Stack>
        </Box>

        {/* 3 Minimal Linear Columns */}
        <Grid container spacing={2.5}>
          {/* Column 1: Info Kontrak & Periode */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <CalendarMonthIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Kontrak & Periode UK
                </Typography>
              </Box>

              <Stack spacing={1.25}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    PERIODE KONTRAK
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.startContract} s/d {row.endContract}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    PERIODE KOMPENSASI
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.periodeAwalUk} s/d {row.periodeSelesaiUk}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Mode Perhitungan
                  </Typography>
                  <Chip label={row.modeUk || 'MODE_7'} size="small" sx={{ fontWeight: 700, bgcolor: 'primary.50', color: 'primary.dark', borderRadius: '4px', fontSize: '0.7rem', height: 20 }} />
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 2: Status & Approval */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: isApproved ? 'success.main' : 'error.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Status Slip & Pembayaran
                </Typography>
              </Box>

              <Stack spacing={1.25}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0.75, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Status Slip
                  </Typography>
                  <Chip
                    label={row.statusSlip}
                    size="small"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      height: 22,
                      bgcolor: isApproved ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: isApproved ? '#059669' : '#dc2626',
                      borderRadius: '6px'
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    TANGGAL EFEKTIF PEMBAYARAN
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.efektifPaymentDate || '-'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Gaji Pokok Acuan
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    Rp {row.salary?.toLocaleString('id-ID') || 0}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 3: Total Kompensasi Banner */}
          <Grid item xs={12} sm={12} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <MonetizationOnIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Take Home Pay Kompensasi
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
                    TAKE HOME PAY KOMPENSASI
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', fontFamily: 'monospace', letterSpacing: '-0.02em', fontSize: '1.25rem' }}>
                    Rp {row.totalUk?.toLocaleString('id-ID') || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', mt: 0.2 }}>
                    Kompensasi siap ditransfer ke rekening karyawan
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
          <ReceiptLongIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Slip Uang Kompensasi
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Kelola rincian slip, cetak struk dan persetujuan pembayaran uang kompensasi karyawan PKWT
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
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Karyawan</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{filteredData.length} Karyawan</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Uang Kompensasi</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                Rp {totalUangKompensasi.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <RotateLeftIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Slip Returned / Revisi</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{returnedCount} Slip</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <AssignmentTurnedInIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Data Terpilih</Typography>
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              size="small"
              fullWidth
              label="Periode Start"
              InputLabelProps={{ shrink: true }}
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              size="small"
              fullWidth
              label="Periode End"
              InputLabelProps={{ shrink: true }}
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
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
          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Division"
              options={[
                { value: '', label: 'Semua Division' },
                { value: 'Benih Berkah Berseri', label: 'Benih Berkah Berseri' }
              ]}
              value={filterDivision}
              onChange={(val) => setFilterDivision(val)}
              placeholder="Pilih Division"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Unit"
              options={[
                { value: '', label: 'Semua Unit' },
                { value: 'Benih Berkah Berseri', label: 'Benih Berkah Berseri' }
              ]}
              value={filterUnit}
              onChange={(val) => setFilterUnit(val)}
              placeholder="Pilih Unit"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Position"
              options={[
                { value: '', label: 'Semua Posisi' },
                { value: 'Field Officer', label: 'Field Officer' },
                { value: 'Admin Staff', label: 'Admin Staff' },
                { value: 'Sales Representative', label: 'Sales Representative' }
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
              label="Status Slip"
              options={[
                { value: '', label: 'Semua Status' },
                { value: 'APPROVED', label: 'APPROVED' },
                { value: 'RETURNED', label: 'RETURNED' }
              ]}
              value={filterStatusSlip}
              onChange={(val) => setFilterStatusSlip(val)}
              placeholder="Pilih Status"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Action Toolbar Directly Above Table */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: '14px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }} elevation={0}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Daftar Slip Kompensasi PKWT
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
            onClick={handleRequestSlip}
            disabled={selectedIds.length === 0}
            startIcon={<PlayIcon />}
            sx={{
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#2563eb' },
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              height: '40px'
            }}
          >
            REQUEST APPROVAL
          </Button>

          <Button
            variant="contained"
            onClick={handleReturnSlip}
            disabled={selectedIds.length === 0}
            startIcon={<RotateLeftIcon />}
            sx={{
              bgcolor: '#ef4444',
              '&:hover': { bgcolor: '#dc2626' },
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              height: '40px'
            }}
          >
            RETURN DATA
          </Button>

          <Button
            variant="contained"
            onClick={handleDownloadSlip}
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
            DOWNLOAD EXCEL
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
