import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Grid, Chip, Checkbox, Tooltip, IconButton, Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  CloudUpload as CloudUploadIcon,
  Warning as ErrorIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  PauseCircle as PauseCircleIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarMonthIcon,
  Assignment as AssignmentIcon,
  Payments as PaymentsIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_KOMPENSASI_DATA = [
  {
    id: 1,
    nik: 'D8240100',
    name: 'TEDI RAMDANI',
    employeeType: 'PKWT',
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
    totalUk: 2000000,
    statusSlip: 'RETURNED',
    efektifPaymentDate: '25/11/2026',
    sisaUkCadangan: -633333
  },
  {
    id: 2,
    nik: 'D8240101',
    name: 'SITI AMINAH',
    employeeType: 'PKWT',
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
    totalUk: 1600000,
    statusSlip: 'APPROVED',
    efektifPaymentDate: '25/11/2026',
    sisaUkCadangan: 200000
  },
  {
    id: 3,
    nik: 'D8240102',
    name: 'BUDI SANTOSO',
    employeeType: 'PKWT',
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
    totalUk: 1800000,
    statusSlip: 'RETURNED',
    efektifPaymentDate: '25/11/2026',
    sisaUkCadangan: -400000
  },
  {
    id: 4,
    nik: 'D8240103',
    name: 'RATNA DEWI',
    employeeType: 'PKWT',
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
    totalUk: 2000000,
    statusSlip: 'APPROVED',
    efektifPaymentDate: '25/11/2026',
    sisaUkCadangan: 500000
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

export default function UploadKompensasi() {
  const { user } = useSelector((state) => state.auth);

  // Lists & table pagination
  const [dataList, setDataList] = useState(INITIAL_KOMPENSASI_DATA);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterMonth, setFilterMonth] = useState('December');
  const [filterYear, setFilterYear] = useState('2026');
  const [filterStatusSlip, setFilterStatusSlip] = useState('');

  // Bulk options
  const [exportType, setExportType] = useState('Excel');
  const [effectivePaymentDate, setEffectivePaymentDate] = useState('');

  // Dialog states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadModalMode, setUploadModalMode] = useState('NORMAL'); // 'NORMAL' or 'CALCULATED'
  const [gagalModalOpen, setGagalModalOpen] = useState(false);

  // Upload Form Inputs
  const [uploadPeriodMonth, setUploadPeriodMonth] = useState('August');
  const [uploadPeriodYear, setUploadPeriodYear] = useState('2026');
  const [uploadCuttOff, setUploadCuttOff] = useState('25');
  const [uploadNote, setUploadNote] = useState('Kompensasi Awal');
  const [selectedFile, setSelectedFile] = useState(null);

  // Notifications & Confirms
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: () => {} });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSearch = () => {
    setPage(1);
    showSnackbar('Data berhasil difilter!', 'success');
  };

  const handleReset = () => {
    setSearchQuery('');
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

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Tidak ada data terpilih untuk dihapus!', 'warning');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Hapus Data Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data terpilih?`,
      onConfirm: () => {
        setDataList(prev => prev.filter(row => !selectedIds.includes(row.id)));
        setSelectedIds([]);
        setConfirmDialog(c => ({ ...c, open: false }));
        showSnackbar('Data terpilih berhasil dihapus!', 'success');
      }
    });
  };

  const handleHoldSelected = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Tidak ada data terpilih untuk di-hold!', 'warning');
      return;
    }
    showSnackbar(`${selectedIds.length} data berhasil di-hold!`, 'success');
    setSelectedIds([]);
  };

  const handleApplyPaymentDate = () => {
    if (!effectivePaymentDate) {
      showSnackbar('Harap pilih tanggal pembayaran terlebih dahulu!', 'warning');
      return;
    }
    showSnackbar(`Tanggal pembayaran efektif berhasil diterapkan: ${effectivePaymentDate}`, 'success');
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      showSnackbar('Harap pilih file excel template kompensasi terlebih dahulu!', 'warning');
      return;
    }
    showSnackbar(`File ${selectedFile.name} berhasil di-upload dan diproses!`, 'success');
    setUploadModalOpen(false);
    setSelectedFile(null);
  };

  const triggerPrintSlip = (employee) => {
    const printWindow = window.open('', '_blank', 'width=900,height=600');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Slip Kompensasi - ${employee.name}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 25px; color: #000; font-size: 12px; }
            .header-sec { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 15px; }
            .company { font-weight: bold; font-size: 13px; }
            .title { font-weight: bold; font-size: 13px; text-decoration: underline; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
            .info-row { display: flex; margin-bottom: 4px; }
            .info-lbl { width: 120px; font-weight: bold; }
            .table-hdr { display: flex; justify-content: space-between; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-top: 15px; text-transform: uppercase; }
            .row-data { display: flex; justify-content: space-between; padding: 6px 0; }
            .total-row { display: flex; justify-content: space-between; font-weight: bold; border-top: 1px double #000; border-bottom: 1px double #000; padding: 4px 0; }
            .thp-box { border: 1.5px solid #000; display: inline-block; padding: 6px 20px; font-weight: bold; margin-top: 15px; font-size: 13px; }
            .footer-sec { display: flex; justify-content: space-between; margin-top: 30px; }
            .footer-notes { font-size: 10px; line-height: 1.4; max-width: 400px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header-sec">
            <div class="company">PT DANAMAS INSAN KREASI ANDALAN</div>
            <div>
              <div class="title">SLIP KOMPENSASI PKWT</div>
              <div style="text-align: right; font-weight: bold; margin-top: 3px;">November 2026</div>
            </div>
          </div>
          <div class="info-grid">
            <div>
              <div class="info-row"><span class="info-lbl">NIK/Nama</span>: ${employee.nik} - ${employee.name.toUpperCase()}</div>
              <div class="info-row"><span class="info-lbl">Jabatan</span>: ${employee.position}</div>
              <div class="info-row"><span class="info-lbl">Dept/Sect</span>: ${employee.division} / Benih</div>
            </div>
            <div>
              <div class="info-row"><span class="info-lbl">Periode kontrak</span>: ${employee.startContract} s/d ${employee.endContract}</div>
              <div class="info-row"><span class="info-lbl">Gol/Grade</span>: ${employee.employeeType}/</div>
              <div class="info-row"><span class="info-lbl">Cabang</span>: ${employee.branch.toUpperCase()}</div>
            </div>
          </div>
          <div class="table-hdr">
            <span>P E N E R I M A A N</span>
            <span>P O T O N G A N</span>
          </div>
          <div class="row-data">
            <span>Kompensasi PKWT</span>
            <span>Rp ${employee.totalUk.toLocaleString('id-ID')}</span>
          </div>
          <div class="total-row">
            <div style="display: flex; justify-content: space-between; width: 48%;">
              <span>Total Penerimaan</span>
              <span>Rp ${employee.totalUk.toLocaleString('id-ID')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; width: 48%;">
              <span>Total Potongan</span>
              <span>0</span>
            </div>
          </div>
          <div style="margin-top: 15px;">
            <span style="font-weight: bold; margin-right: 15px; vertical-align: middle;">Take Home Pay</span>
            <div class="thp-box">Rp ${employee.totalUk.toLocaleString('id-ID')}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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
  const totalNominalUk = filteredData.reduce((sum, item) => sum + item.totalUk, 0);
  const totalCadanganUk = filteredData.reduce((sum, item) => sum + item.sisaUkCadangan, 0);

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
                bgcolor: 'primary.main',
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
                  color="primary"
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
              onClick={() => triggerPrintSlip(row)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                borderRadius: '8px',
                borderColor: 'primary.light',
                color: 'primary.main',
                '&:hover': { bgcolor: 'primary.50', borderColor: 'primary.main' }
              }}
            >
              Cetak Slip Kompensasi
            </Button>
            <Tooltip title="Hapus Data">
              <IconButton
                size="small"
                onClick={() => {
                  setConfirmDialog({
                    open: true,
                    title: 'Hapus Data Kompensasi',
                    message: `Apakah Anda yakin ingin menghapus data kompensasi ${row.name}?`,
                    onConfirm: () => {
                      setDataList(prev => prev.filter(r => r.id !== row.id));
                      setConfirmDialog(c => ({ ...c, open: false }));
                      showSnackbar('Data berhasil dihapus!', 'success');
                    }
                  });
                }}
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
          {/* Column 1: Kontrak & Periode Kompensasi */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <CalendarMonthIcon sx={{ fontSize: 16, color: 'primary.main' }} />
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
                    PERIODE AWAL & SELESAI UK
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.periodeAwalUk} s/d {row.periodeSelesaiUk}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 0.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block' }}>
                      HITUNGAN BULAN
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '0.8rem' }}>
                      {row.hitunganBulan || '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block' }}>
                      MODE UK
                    </Typography>
                    <Chip label={row.modeUk || 'MODE_7'} size="small" sx={{ fontWeight: 700, bgcolor: 'primary.50', color: 'primary.dark', borderRadius: '4px', fontSize: '0.7rem', height: 20 }} />
                  </Box>
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
                  Status & Approval
                </Typography>
              </Box>

              <Stack spacing={1.25}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0.75, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Status Slip Kompensasi
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
                    Gaji Pokok
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    Rp {row.salary?.toLocaleString('id-ID') || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Sisa Cadangan UK
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem', color: row.sisaUkCadangan < 0 ? '#ef4444' : '#10b981' }}>
                    Rp {row.sisaUkCadangan?.toLocaleString('id-ID') || 0}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 3: Ringkasan Total Kompensasi */}
          <Grid item xs={12} sm={12} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <MonetizationOnIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Ringkasan Finansial
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
                    TOTAL UANG KOMPENSASI
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', fontFamily: 'monospace', letterSpacing: '-0.02em', fontSize: '1.25rem' }}>
                    Rp {row.totalUk?.toLocaleString('id-ID') || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', mt: 0.2 }}>
                    Kompensasi PKWT sesuai masa kerja & PP 35/2021
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
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 16px -4px rgba(2, 132, 199, 0.4)'
        }}>
          <CloudUploadIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Upload Data Kompensasi
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Kelola data upload rekapitulasi pembayaran uang kompensasi karyawan PKWT
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
              <MonetizationOnIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Uang Kompensasi</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                Rp {totalNominalUk.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Sisa Cadangan UK</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: totalCadanganUk >= 0 ? '#10b981' : '#ef4444' }}>
                Rp {totalCadanganUk.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
              <PauseCircleIcon sx={{ fontSize: 24 }} />
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
            Aksi & Upload Data Kompensasi
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
            onClick={() => {
              setUploadModalMode('NORMAL');
              setUploadModalOpen(true);
            }}
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
            UPLOAD KOMPENSASI
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setUploadModalMode('CALCULATED');
              setUploadModalOpen(true);
            }}
            startIcon={<CloudUploadIcon />}
            sx={{
              bgcolor: '#0284c7',
              '&:hover': { bgcolor: '#0369a1' },
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              height: '40px'
            }}
          >
            UPLOAD UK SUDAH DIKALKULASI
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
            onClick={handleHoldSelected}
            disabled={selectedIds.length === 0}
            startIcon={<PauseCircleIcon />}
            sx={{
              bgcolor: '#f59e0b',
              '&:hover': { bgcolor: '#d97706' },
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              height: '40px'
            }}
          >
            HOLD DATA
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

      {/* DIALOG UPLOAD DATA KOMPENSASI */}
      <CustomModal 
        open={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
        title={uploadModalMode === 'NORMAL' ? 'Upload Uang Kompensasi' : 'Upload UK Sudah Dikalkulasi'}
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

          {uploadModalMode === 'NORMAL' && (
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Cut Off</Typography>
              <SearchableSelect
                options={[
                  { value: '25', label: 'Tanggal 25' },
                  { value: '30', label: 'Tanggal 30' }
                ]}
                value={uploadCuttOff}
                onChange={(val) => setUploadCuttOff(val)}
                placeholder="Pilih Cut Off"
              />
            </Box>
          )}

          <Box>
            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '0.875rem' }}>Note Kompensasi</Typography>
            <SearchableSelect
              options={[
                { value: 'Kompensasi Awal', label: 'Kompensasi Awal' },
                { value: 'Kompensasi Akhir', label: 'Kompensasi Akhir' }
              ]}
              value={uploadNote}
              onChange={(val) => setUploadNote(val)}
              placeholder="Pilih Note"
            />
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
              onClick={handleUploadSubmit}
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
        title="Daftar Data Gagal Upload Kompensasi"
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
