import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, Checkbox, Grid, Divider, Tooltip, IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  Print as PrintIcon,
  ReceiptLong as ReceiptLongIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Today as TodayIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const generateDummyPph21Data = () => {
  return [
    {
      id: 1,
      nik: 'D0000331',
      name: 'Pegawai Dummy 331',
      employeeType: 'Pkwt',
      division: 'Business Development',
      unitName: 'Laku Pandai',
      position: 'SUPERVISOR',
      branch: 'Bogor',
      periodeStart: '01/12/2026',
      periodeEnd: '31/12/2026',
      methodePajak: 'Net',
      komponenProject: 'Net',
      sumberAcuanPajak: 'Master Client',
      pph21BulanIni: -322032,
      pph26BulanIni: 0,
      residentStatus: 'Resident',
      thp: 1637831,
      payrollDate: '25/12/2026'
    },
    {
      id: 2,
      nik: 'D8210663',
      name: 'POPI ANGRAINI',
      employeeType: 'PKWT',
      division: 'Tax, Accounting & Biz Plan',
      unitName: 'Accounting',
      position: 'Supervisor',
      branch: 'JAKARTA',
      periodeStart: '01/12/2026',
      periodeEnd: '31/12/2026',
      methodePajak: 'Gross',
      komponenProject: 'Gross',
      sumberAcuanPajak: 'Master Client',
      pph21BulanIni: -1447776,
      pph26BulanIni: 0,
      residentStatus: 'Resident',
      thp: 12096913,
      payrollDate: '25/12/2026'
    },
    {
      id: 3,
      nik: 'D8231214',
      name: 'MAMTA SARTIKA',
      employeeType: 'PKWT',
      division: 'Tax, Accounting & Biz Plan',
      unitName: 'Accounting',
      position: 'Administrasi',
      branch: 'JAKARTA',
      periodeStart: '01/12/2026',
      periodeEnd: '31/12/2026',
      methodePajak: 'Gross',
      komponenProject: 'Gross',
      sumberAcuanPajak: 'Master Client',
      pph21BulanIni: -965184,
      pph26BulanIni: 0,
      residentStatus: 'Resident',
      thp: 11614321,
      payrollDate: '25/12/2026'
    }
  ];
};

const INITIAL_PPH21_DATA = generateDummyPph21Data();

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Pph21List() {
  const { user } = useSelector((state) => state.auth);

  // States
  const [dataList, setDataList] = useState(INITIAL_PPH21_DATA);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterMonth, setFilterMonth] = useState('December');
  const [filterYear, setFilterYear] = useState('2026');
  const [filterTemplate, setFilterTemplate] = useState('');
  const [filterFeeManagement, setFilterFeeManagement] = useState('');
  const [payrollDateInput, setPayrollDateInput] = useState('');
  
  // Modals state
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [selectedSlipEmployee, setSelectedSlipEmployee] = useState(null);

  // Dialogs & Snackbar
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: () => {} });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Helper options from data
  const divisions = Array.from(new Set(dataList.map(r => r.division).filter(Boolean)));
  const units = Array.from(new Set(dataList.map(r => r.unitName).filter(Boolean)));
  const positions = Array.from(new Set(dataList.map(r => r.position).filter(Boolean)));
  const employeeTypes = Array.from(new Set(dataList.map(r => r.employeeType).filter(Boolean)));
  const branches = Array.from(new Set(dataList.map(r => r.branch).filter(Boolean)));

  // Filter Logic
  const filteredData = dataList.filter(row => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNik = row.nik?.toLowerCase()?.includes(q);
      const matchName = row.name?.toLowerCase()?.includes(q);
      if (!matchNik && !matchName) return false;
    }
    if (filterDivision && row.division !== filterDivision) return false;
    if (filterUnit && row.unitName !== filterUnit) return false;
    if (filterPosition && row.position !== filterPosition) return false;
    if (filterEmployeeType && row.employeeType !== filterEmployeeType) return false;
    if (filterBranch && row.branch !== filterBranch) return false;
    return true;
  });

  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Totals calculations
  const totalEmployees = filteredData.length;
  const totalPph21 = filteredData.reduce((sum, r) => sum + r.pph21BulanIni, 0);
  const totalThp = filteredData.reduce((sum, r) => sum + r.thp, 0);
  const totalPph26 = filteredData.reduce((sum, r) => sum + (r.pph26BulanIni || 0), 0);

  // Handlers
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterDivision('');
    setFilterUnit('');
    setFilterPosition('');
    setFilterEmployeeType('');
    setFilterBranch('');
    setFilterMonth('December');
    setFilterYear('2026');
    setFilterTemplate('');
    setFilterFeeManagement('');
    showSnackbar('Filter berhasil di-reset', 'info');
  };

  const handleExport = () => {
    showSnackbar('Ekspor data PPh21 berhasil diinisialisasi!', 'success');
  };

  const handlePayrollDate = () => {
    if (!payrollDateInput) {
      showSnackbar('Pilih tanggal terlebih dahulu untuk mengatur Payroll Date!', 'warning');
      return;
    }
    if (selectedIds.length === 0) {
      showSnackbar('Pilih minimal 1 data karyawan terlebih dahulu!', 'warning');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Update Payroll Date',
      message: `Apakah Anda yakin ingin memperbarui tanggal payroll menjadi ${payrollDateInput} untuk ${selectedIds.length} data yang dipilih?`,
      onConfirm: () => {
        setDataList(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, payrollDate: payrollDateInput } : item));
        setConfirmDialog(c => ({ ...c, open: false }));
        showSnackbar(`Payroll Date berhasil diperbarui ke ${payrollDateInput}!`, 'success');
      }
    });
  };

  const handlePrintSlip = (row) => {
    setSelectedSlipEmployee(row);
    setSlipModalOpen(true);
  };

  const triggerPrintPdf = (employee) => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      showSnackbar('Popup blocker aktif! Izinkan popup untuk mengunduh PDF.', 'warning');
      return;
    }
    
    const formatNum = (val) => {
      if (val === undefined || val === null) return '0';
      return Math.abs(val).toLocaleString('id-ID');
    };

    const isNegative = employee.pph21BulanIni < 0;
    const pphValStr = isNegative ? `-${formatNum(employee.pph21BulanIni)}` : formatNum(employee.pph21BulanIni);

    printWindow.document.write(`
      <html>
        <head>
          <title>Slip Gaji - ${employee.name}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              @page { size: A4 landscape; margin: 10mm; }
            }
            body { 
              font-family: Arial, sans-serif; 
              color: #000; 
              padding: 40px; 
              font-size: 13px; 
              line-height: 1.5;
            }
            .container {
              border: 1px solid #000;
              padding: 25px;
              max-width: 900px;
              margin: 0 auto;
            }
            .header-table { width: 100%; border-bottom: 2.5px solid #000; margin-bottom: 20px; padding-bottom: 5px; }
            .company { font-weight: 800; font-size: 16px; text-decoration: underline; }
            .doc-title { font-weight: 800; font-size: 16px; text-align: right; text-decoration: underline; }
            .period { text-align: right; font-size: 13px; font-weight: bold; margin-top: 5px; }
            .info-table { width: 100%; margin-bottom: 20px; }
            .info-table td { padding: 4px 0; font-size: 13px; }
            .label { width: 15%; color: #333; }
            .colon { width: 2%; }
            .val { width: 33%; font-weight: bold; }
            
            .main-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            .main-table th { 
              border-top: 2.5px solid #000; 
              border-bottom: 2.5px solid #000; 
              text-align: left; 
              padding: 8px 0; 
              font-weight: 900; 
              letter-spacing: 3px;
              font-size: 14px;
            }
            .main-table td { 
              padding: 8px 0; 
              vertical-align: top; 
            }
            .col-header { width: 50%; }
            .total-row { 
              border-top: 2px solid #000; 
              border-bottom: 2px double #000; 
              font-weight: bold; 
              font-size: 13px;
            }
            .inner-table { width: 100%; border-collapse: collapse; }
            .inner-table td { padding: 5px 0; font-size: 13px; }
            
            .thp-label { font-weight: bold; font-size: 14px; vertical-align: middle; }
            .thp-box { 
              border: 2px solid #000; 
              padding: 8px 20px; 
              display: inline-block; 
              font-weight: bold; 
              font-size: 15px;
              min-width: 140px; 
              text-align: right; 
            }
            
            .footer-table { width: 100%; margin-top: 35px; font-size: 13px; }
            .note-title { font-weight: bold; margin-bottom: 3px; }
            .note { font-style: italic; font-size: 11px; color: #444; line-height: 1.4; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="container">
            <table class="header-table">
              <tr>
                <td class="company">PT DANAMAS INSAN KREASI ANDALAN</td>
                <td class="doc-title">SLIP GAJI</td>
              </tr>
              <tr>
                <td></td>
                <td class="period">Desember 2026</td>
              </tr>
            </table>

            <table class="info-table">
              <tr>
                <td class="label">NIK/Nama</td><td class="colon">:</td><td class="val">${employee.nik} - ${employee.name}</td>
                <td class="label">NPWP</td><td class="colon">:</td><td class="val">98.647.488.0-031.000</td>
              </tr>
              <tr>
                <td class="label">Jabatan</td><td class="colon">:</td><td class="val">${employee.position}</td>
                <td class="label">Gol/Grade</td><td class="colon">:</td><td class="val">${employee.employeeType}/</td>
              </tr>
              <tr>
                <td class="label">Dept/Sect</td><td class="colon">:</td><td class="val">${employee.division}</td>
                <td class="label">Cabang</td><td class="colon">:</td><td class="val">${employee.branch}</td>
              </tr>
            </table>

            <table class="main-table">
              <thead>
                <tr>
                  <th class="col-header">P E N E R I M A A N</th>
                  <th class="col-header">P O T O N G A N</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border-right: 1px solid #ddd;">
                    <table class="inner-table">
                      <tr><td>Gaji</td><td style="text-align: right; padding-right: 30px; font-weight: bold;">12.000.000</td></tr>
                      <tr style="height: 90px;"><td>&nbsp;</td><td>&nbsp;</td></tr>
                    </table>
                  </td>
                  <td>
                    <table class="inner-table" style="padding-left: 15px;">
                      <tr><td>JHT 2%(Pegawai)</td><td style="text-align: right; font-weight: bold;">240.000</td></tr>
                      <tr><td>JIP 1%(Pegawai)</td><td style="text-align: right; font-weight: bold;">110.863</td></tr>
                      <tr><td>Potongan THR Non Tax</td><td style="text-align: right; font-weight: bold;">1.000.000</td></tr>
                      <tr><td>PPh 21 Seluruh Penghasilan</td><td style="text-align: right; font-weight: bold; color: ${isNegative ? 'red' : 'black'};">${pphValStr}</td></tr>
                    </table>
                  </td>
                </tr>
                <tr class="total-row">
                  <td style="border-right: 1px solid #ddd;">
                    <table class="inner-table">
                      <tr><td style="font-weight: bold;">Total Penerimaan</td><td style="text-align: right; padding-right: 30px; font-weight: bold;">12.000.000</td></tr>
                    </table>
                  </td>
                  <td>
                    <table class="inner-table" style="padding-left: 15px;">
                      <tr><td style="font-weight: bold;">Total Potongan</td><td style="text-align: right; font-weight: bold;">-96.913</td></tr>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
              <tr>
                <td class="thp-label" style="width: 25%;">Take Home Pay</td>
                <td style="width: 75%;"><div class="thp-box">${formatNum(employee.thp)}</div></td>
              </tr>
            </table>

            <table class="footer-table">
              <tr>
                <td style="width: 50%; vertical-align: top;">
                  <strong style="font-size: 13px;">Ditransfer Ke :</strong><br/>
                  <div style="margin-top: 5px; font-size: 13px; line-height: 1.6;">
                    BCA<br/>
                    a.n. ${employee.name}
                  </div>
                </td>
                <td style="width: 50%; text-align: right; vertical-align: top;">
                  <span style="font-size: 13px; font-weight: bold;">Jakarta, 25 Desember</span><br/><br/>
                  <div class="note-title">Catatan :</div>
                  <span class="note">Slip Gaji ini dicetak secara komputerisasi<br/>Sehingga tidak memerlukan tanda tangan</span>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Columns definition
  const columns = [
    {
      id: 'select',
      label: '',
      width: '50px',
      align: 'center',
      headerRender: () => (
        <Checkbox
          size="small"
          checked={paginatedData.length > 0 && paginatedData.every(row => selectedIds.includes(row.id))}
          indeterminate={paginatedData.some(row => selectedIds.includes(row.id)) && !paginatedData.every(row => selectedIds.includes(row.id))}
          onChange={(e) => {
            if (e.target.checked) {
              const paginatedIds = paginatedData.map(r => r.id);
              setSelectedIds(prev => Array.from(new Set([...prev, ...paginatedIds])));
            } else {
              const paginatedIds = paginatedData.map(r => r.id);
              setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
            }
          }}
          sx={{ color: 'text.secondary', '&.Mui-checked': { color: 'primary.main' } }}
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
          sx={{ color: 'text.secondary', '&.Mui-checked': { color: 'primary.main' } }}
        />
      )
    },
    {
      id: 'nik',
      label: 'NIK',
      render: (row) => (
        <Chip
          label={row.nik}
          size="small"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '0.75rem',
            bgcolor: 'action.hover',
            color: 'text.primary'
          }}
        />
      )
    },
    {
      id: 'name',
      label: 'Name',
      render: (row) => <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}>{row.name}</Typography>
    },
    { id: 'employeeType', label: 'Employee Type' },
    { id: 'division', label: 'Division' },
    { id: 'unitName', label: 'Unit Name' },
    { id: 'position', label: 'Position' },
    { id: 'branch', label: 'Branch' },
    { id: 'periodeStart', label: 'Periode Start' },
    { id: 'periodeEnd', label: 'Periode End' },
    { id: 'methodePajak', label: 'Methode Pajak' },
    { id: 'komponenProject', label: 'Komponen Project' },
    { id: 'sumberAcuanPajak', label: 'Sumber Acuan Pajak' },
    {
      id: 'pph21BulanIni',
      label: 'PPH 21 (Bulan ini)',
      align: 'right',
      render: (row) => (
        <Typography sx={{ color: row.pph21BulanIni < 0 ? '#ef4444' : '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
          Rp {row.pph21BulanIni.toLocaleString('id-ID')}
        </Typography>
      )
    },
    {
      id: 'pph26BulanIni',
      label: 'PPH 26 (Bulan ini)',
      align: 'right',
      render: (row) => (
        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
          Rp {row.pph26BulanIni.toLocaleString('id-ID')}
        </Typography>
      )
    },
    {
      id: 'residentStatus',
      label: 'Resident Status (WNA)',
      render: (row) => (
        <Chip
          label={row.residentStatus || 'Resident'}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.75rem',
            bgcolor: row.residentStatus === 'Non-Resident' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: row.residentStatus === 'Non-Resident' ? '#ef4444' : '#10b981'
          }}
        />
      )
    },
    {
      id: 'thp',
      label: 'THP',
      align: 'right',
      render: (row) => (
        <Typography sx={{ color: '#10b981', fontWeight: 700, fontSize: '0.875rem' }}>
          Rp {row.thp.toLocaleString('id-ID')}
        </Typography>
      )
    },
    {
      id: 'payrollDate',
      label: 'Payroll Date',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{row.payrollDate || '-'}</Typography>
        </Box>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Tooltip title="Preview / Cetak Slip Gaji">
          <IconButton
            size="small"
            onClick={() => handlePrintSlip(row)}
            sx={{
              color: '#0284c7',
              bgcolor: 'rgba(2, 132, 199, 0.08)',
              '&:hover': { bgcolor: 'rgba(2, 132, 199, 0.16)' }
            }}
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* 1. Header Banner */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(59,130,246,0.05))',
            color: '#2563eb',
            border: '1px solid rgba(37,99,235,0.2)'
          }}
        >
          <ReceiptLongIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
            List PPh21 Karyawan
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Monitoring riwayat pemotongan PPh21, PPh26, status residensi WNA, dan tanggal payroll
          </Typography>
        </Box>
      </Box>

      {/* 2. Top KPI Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2.5,
                bgcolor: 'rgba(37, 99, 235, 0.1)',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PeopleIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total Karyawan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {totalEmployees.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2.5,
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MonetizationOnIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total PPH 21
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444' }}>
                Rp {Math.abs(totalPph21).toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2.5,
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AccountBalanceWalletIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total Take Home Pay
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                Rp {totalThp.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2.5,
                bgcolor: 'rgba(245, 158, 11, 0.1)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ReceiptLongIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total PPH 26
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                Rp {totalPph26.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. Search & Filter Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Stack spacing={2.5}>
          {/* Row 1: Search & Date Range */}
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={4}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                Cari NIK / Nama Karyawan
              </Typography>
              <TextField
                placeholder="Search NIK atau Nama..."
                size="small"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
                Rentang Periode
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>-</Typography>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SearchIcon />}
                  sx={{
                    bgcolor: '#1e293b',
                    '&:hover': { bgcolor: '#0f172a' },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    height: 40
                  }}
                >
                  SEARCH
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  sx={{
                    borderColor: 'divider',
                    color: 'text.secondary',
                    '&:hover': { borderColor: 'text.primary', bgcolor: 'action.hover' },
                    borderRadius: 2,
                    minWidth: 40,
                    p: 0,
                    height: 40
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Row 2: Cascading SearchableSelect Filters */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <SearchableSelect
                label="Division"
                value={filterDivision}
                onChange={setFilterDivision}
                options={divisions.map(d => ({ value: d, label: d }))}
                placeholder="Semua Divisi"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SearchableSelect
                label="Unit Name"
                value={filterUnit}
                onChange={setFilterUnit}
                options={units.map(u => ({ value: u, label: u }))}
                placeholder="Semua Unit"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SearchableSelect
                label="Position"
                value={filterPosition}
                onChange={setFilterPosition}
                options={positions.map(p => ({ value: p, label: p }))}
                placeholder="Semua Posisi"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SearchableSelect
                label="Employee Type"
                value={filterEmployeeType}
                onChange={setFilterEmployeeType}
                options={employeeTypes.map(t => ({ value: t, label: t }))}
                placeholder="Semua Tipe"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SearchableSelect
                label="Branch"
                value={filterBranch}
                onChange={setFilterBranch}
                options={branches.map(b => ({ value: b, label: b }))}
                placeholder="Semua Cabang"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SearchableSelect
                label="Month"
                value={filterMonth}
                onChange={setFilterMonth}
                options={MONTH_NAMES.map(m => ({ value: m, label: m }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SearchableSelect
                label="Year"
                value={filterYear}
                onChange={setFilterYear}
                options={[
                  { value: '2026', label: '2026' },
                  { value: '2025', label: '2025' },
                  { value: '2024', label: '2024' }
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SearchableSelect
                label="Template Export"
                value={filterTemplate}
                onChange={setFilterTemplate}
                options={[
                  { value: 'Standard', label: 'Standard' },
                  { value: 'Detailed', label: 'Detailed' }
                ]}
                placeholder="Pilih Template"
              />
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      {/* 4. Action Toolbar DIRECTLY ABOVE DataTable */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2.5,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            label={`${selectedIds.length} data dipilih`}
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: selectedIds.length > 0 ? 'rgba(37, 99, 235, 0.1)' : 'action.hover',
              color: selectedIds.length > 0 ? '#2563eb' : 'text.secondary'
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              type="date"
              size="small"
              value={payrollDateInput}
              onChange={(e) => setPayrollDateInput(e.target.value)}
              sx={{ width: 160 }}
            />
            <Button
              variant="contained"
              onClick={handlePayrollDate}
              startIcon={<TodayIcon />}
              sx={{
                bgcolor: '#0f172a',
                '&:hover': { bgcolor: '#1e293b' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                height: 40
              }}
            >
              UPDATE PAYROLL DATE
            </Button>
          </Box>

          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExport}
            sx={{
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              height: 40
            }}
          >
            EXPORT
          </Button>
        </Box>
      </Box>

      {/* 5. Data Table */}
      <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }} elevation={0}>
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
        />
      </Paper>

      {/* 6. Slip Gaji Preview Modal */}
      <CustomModal
        open={slipModalOpen}
        onClose={() => setSlipModalOpen(false)}
        title="Preview Slip Gaji Karyawan"
        maxWidth="md"
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, width: '100%' }}>
            <Button
              variant="outlined"
              onClick={() => setSlipModalOpen(false)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Tutup
            </Button>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={() => triggerPrintPdf(selectedSlipEmployee)}
              sx={{
                bgcolor: '#0284c7',
                '&:hover': { bgcolor: '#0369a1' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700
              }}
            >
              Download PDF / Cetak
            </Button>
          </Box>
        }
      >
        {selectedSlipEmployee && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
              color: 'text.primary',
              fontFamily: 'Courier New, Courier, monospace'
            }}
          >
            {/* Header */}
            <Box sx={{ borderBottom: '2px solid', borderColor: 'divider', pb: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', textDecoration: 'underline' }}>
                PT DANAMAS INSAN KREASI ANDALAN
              </Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', textDecoration: 'underline' }}>
                  SLIP GAJI
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, mt: 0.5 }}>
                  Desember 2026
                </Typography>
              </Box>
            </Box>

            {/* Info */}
            <Grid container spacing={1.5} sx={{ mb: 2.5, fontSize: '0.85rem' }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <Typography sx={{ width: 100, fontSize: '0.85rem' }}>NIK/Nama</Typography>
                  <Typography sx={{ mr: 1, fontSize: '0.85rem' }}>:</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {selectedSlipEmployee.nik} - {selectedSlipEmployee.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <Typography sx={{ width: 100, fontSize: '0.85rem' }}>Jabatan</Typography>
                  <Typography sx={{ mr: 1, fontSize: '0.85rem' }}>:</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {selectedSlipEmployee.position}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ width: 100, fontSize: '0.85rem' }}>Dept/Sect</Typography>
                  <Typography sx={{ mr: 1, fontSize: '0.85rem' }}>:</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {selectedSlipEmployee.division}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <Typography sx={{ width: 100, fontSize: '0.85rem' }}>NPWP</Typography>
                  <Typography sx={{ mr: 1, fontSize: '0.85rem' }}>:</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>98.647.488.0-031.000</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <Typography sx={{ width: 100, fontSize: '0.85rem' }}>Gol/Grade</Typography>
                  <Typography sx={{ mr: 1, fontSize: '0.85rem' }}>:</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {selectedSlipEmployee.employeeType}/
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ width: 100, fontSize: '0.85rem' }}>Cabang</Typography>
                  <Typography sx={{ mr: 1, fontSize: '0.85rem' }}>:</Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {selectedSlipEmployee.branch}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Income & Deduction */}
            <Grid container sx={{ borderTop: '2px solid', borderBottom: '2px solid', borderColor: 'divider', mb: 2 }}>
              <Grid item xs={6} sx={{ borderRight: '1px solid', borderColor: 'divider', pr: 2, py: 1 }}>
                <Typography sx={{ fontWeight: 800, mb: 1, letterSpacing: 1, fontSize: '0.85rem' }}>
                  P E N E R I M A A N
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>Gaji Pokok</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>12.000.000</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sx={{ pl: 2, py: 1 }}>
                <Typography sx={{ fontWeight: 800, mb: 1, letterSpacing: 1, fontSize: '0.85rem' }}>
                  P O T O N G A N
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>JHT 2% (Pegawai)</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>240.000</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>JIP 1% (Pegawai)</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>110.863</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>PPh 21 Bulan Ini</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#ef4444', fontSize: '0.85rem' }}>
                    {selectedSlipEmployee.pph21BulanIni.toLocaleString('id-ID')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* THP */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>Take Home Pay :</Typography>
              <Box sx={{ border: '2px solid', borderColor: 'divider', px: 2, py: 0.5, borderRadius: 1.5, fontWeight: 800, color: '#10b981' }}>
                Rp {selectedSlipEmployee.thp.toLocaleString('id-ID')}
              </Box>
            </Box>
          </Paper>
        )}
      </CustomModal>

      {/* Global Dialogs & Snackbar */}
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
        onCancel={() => setConfirmDialog(c => ({ ...c, open: false }))}
      />
    </Box>
  );
}
