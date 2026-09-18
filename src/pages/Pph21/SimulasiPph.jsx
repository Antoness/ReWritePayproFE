import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, Checkbox, Grid, Divider, Tooltip, IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Calculate as CalculateIcon,
  People as PeopleIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  MonetizationOn as MonetizationOnIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const generateDummySimulasiData = () => {
  return [
    {
      id: 1,
      nik: 'D8260008',
      name: 'YOTA YOTA',
      employeeType: 'PKWT',
      division: 'IT Programmer',
      unitName: 'IT Programmer',
      position: 'Admin Imputer',
      branch: 'JAKARTA',
      joinDate: '01/05/2018',
      resignDate: '09/04/2026',
      statusEmployee: 'Resign',
      periodeStart: '01/02/2026',
      periodeEnd: '28/02/2026',
      methodePajak: 'Gross',
      komponenProject: 'Gross',
      sumberAcuanPajak: 'Master Client',
      totalBruto: 14697800,
      thp: 14697800,
      pph21BulanIni: 0
    },
    {
      id: 2,
      nik: 'D8260001',
      name: 'FITI AWANDA TEST',
      employeeType: 'PKWT',
      division: 'BCA',
      unitName: 'EDC Machine',
      position: 'Desk Collection',
      branch: 'JAKARTA',
      joinDate: '06/01/2026',
      resignDate: '',
      statusEmployee: 'Active',
      periodeStart: '01/01/2026',
      periodeEnd: '31/01/2026',
      methodePajak: 'Gross',
      komponenProject: 'Gross',
      sumberAcuanPajak: 'Master Client',
      totalBruto: 6169549,
      thp: 6169549,
      pph21BulanIni: 0
    },
    {
      id: 3,
      nik: 'D8260001',
      name: 'FITI AWANDA TEST',
      employeeType: 'PKWT',
      division: 'BCA',
      unitName: 'EDC Machine',
      position: 'Desk Collection',
      branch: 'JAKARTA',
      joinDate: '06/01/2026',
      resignDate: '',
      statusEmployee: 'Active',
      periodeStart: '01/02/2026',
      periodeEnd: '28/02/2026',
      methodePajak: 'Gross',
      komponenProject: 'Gross',
      sumberAcuanPajak: 'Master Client',
      totalBruto: 31667074,
      thp: 31667074,
      pph21BulanIni: 0
    },
    {
      id: 4,
      nik: 'D8260008',
      name: 'YOTA YOTA',
      employeeType: 'PKWT',
      division: 'IT Programmer',
      unitName: 'IT Programmer',
      position: 'Admin Imputer',
      branch: 'JAKARTA',
      joinDate: '01/05/2018',
      resignDate: '09/04/2026',
      statusEmployee: 'Resign',
      periodeStart: '01/01/2026',
      periodeEnd: '31/01/2026',
      methodePajak: 'Gross',
      komponenProject: 'Gross',
      sumberAcuanPajak: 'Master Client',
      totalBruto: 7997800,
      thp: 7997800,
      pph21BulanIni: 0
    },
    {
      id: 5,
      nik: 'D8210663',
      name: 'POPI ANGRAINI',
      employeeType: 'PKWT',
      division: 'Reddoorz Management Indonesia',
      unitName: 'Accounting',
      position: 'Supervisor',
      branch: 'JAKARTA',
      joinDate: '02/06/2021',
      resignDate: '',
      statusEmployee: 'Active',
      periodeStart: '01/07/2026',
      periodeEnd: '31/07/2026',
      methodePajak: 'Gross',
      komponenProject: 'Gross',
      sumberAcuanPajak: 'Master Client',
      totalBruto: 12064800,
      thp: 12064800,
      pph21BulanIni: 0
    }
  ];
};

const INITIAL_SIMULASI_DATA = generateDummySimulasiData();

export default function SimulasiPph() {
  const { user } = useSelector((state) => state.auth);

  // States
  const [dataList, setDataList] = useState(INITIAL_SIMULASI_DATA);
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
  const [filterYear, setFilterYear] = useState('2026');

  // Preview dialog states
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
  const totalBruto = filteredData.reduce((sum, r) => sum + r.totalBruto, 0);
  const totalActive = filteredData.filter(r => r.statusEmployee === 'Active').length;
  const totalResign = filteredData.filter(r => r.statusEmployee === 'Resign').length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterDivision('');
    setFilterUnit('');
    setFilterPosition('');
    setFilterEmployeeType('');
    setFilterBranch('');
    setFilterYear('2026');
    showSnackbar('Filter berhasil di-reset', 'info');
  };

  const handlePrintSlip = (row) => {
    setSelectedSlipEmployee(row);
    setSlipModalOpen(true);
  };

  const triggerPrintPdf = (employee) => {
    const printWindow = window.open('', '_blank', 'width=950,height=800');
    if (!printWindow) {
      showSnackbar('Popup blocker aktif! Izinkan popup untuk mengunduh PDF.', 'warning');
      return;
    }

    const formatNum = (val) => {
      if (val === undefined || val === null) return '0';
      return Math.abs(val).toLocaleString('id-ID');
    };

    printWindow.document.write(`
      <html>
        <head>
          <title>Rincian Perhitungan PPh Pasal 21 - ${employee.name}</title>
          <style>
            @media print {
              body { margin: 0; padding: 15px; }
              @page { size: A4 portrait; margin: 10mm; }
            }
            body { 
              font-family: Arial, sans-serif; 
              color: #000; 
              padding: 20px; 
              font-size: 11px;
              line-height: 1.4;
            }
            .header-sec { margin-bottom: 20px; }
            .company { font-weight: bold; font-size: 14px; margin-bottom: 5px; }
            .title { font-weight: bold; font-size: 14px; }
            
            .info-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
            .info-table td { padding: 3px 0; font-size: 11px; vertical-align: top; }
            .lbl { width: 220px; }
            .col { width: 20px; }
            .val { font-weight: bold; }

            .calc-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px; 
            }
            .calc-table th, .calc-table td { 
              border: 1px solid #000; 
              padding: 6px 8px; 
              font-size: 11px;
            }
            .calc-table th {
              background-color: #f8fafc;
              font-weight: bold;
              text-align: center;
            }
            .align-r { text-align: right; }
            .align-c { text-align: center; }
            .font-bold { font-weight: bold; }
            .indent { padding-left: 20px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header-sec">
            <div class="company">PT DANAMAS INSAN KREASI ANDALAN</div>
            <div class="title">Rincian Perhitungan PPh Pasal 21 Bulan Januari 2026</div>
          </div>

          <table class="info-table">
            <tr>
              <td class="lbl">Nik</td><td class="col">:</td><td class="val">${employee.nik}</td>
            </tr>
            <tr>
              <td class="lbl">Nama</td><td class="col">:</td><td class="val">${employee.name}</td>
            </tr>
            <tr>
              <td class="lbl">Alamat</td><td class="col">:</td><td class="val"></td>
            </tr>
            <tr>
              <td class="lbl">NPWP</td><td class="col">:</td><td class="val"></td>
              <td style="width:100px;">Tgl Terdaftar :</td><td style="width:120px;"></td>
              <td style="width:180px;">Tgl Catat Mulai Punya NPWP :</td><td></td>
            </tr>
            <tr>
              <td class="lbl">Jabatan</td><td class="col">:</td><td class="val">${employee.position}</td>
            </tr>
            <tr>
              <td class="lbl">Jenis Kelamin</td><td class="col">:</td><td class="val">Laki-laki</td>
            </tr>
            <tr>
              <td class="lbl">Status PTKP</td><td class="col">:</td><td class="val">TK/0</td>
              <td>Kebangsaan :</td><td class="val">WNI</td>
            </tr>
            <tr>
              <td class="lbl">Masa Perolehan Penghasilan</td><td class="col">:</td><td class="val">Januari s.d. Desember</td>
            </tr>
            <tr>
              <td class="lbl">Status Masuk</td><td class="col">:</td><td class="val"></td>
            </tr>
            <tr>
              <td class="lbl">Status Berhenti</td><td class="col">:</td><td class="val"></td>
            </tr>
          </table>

          <table class="calc-table">
            <thead>
              <tr>
                <th style="width: 50%;">Keterangan</th>
                <th style="width: 16%;">Januari<br/>2026</th>
                <th style="width: 16%;">s/d<br/>Bulan lalu</th>
                <th style="width: 18%;">s/d Januari<br/>2026</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1. Gaji</td>
                <td class="align-r">5.901.615</td>
                <td class="align-r">0</td>
                <td class="align-r">5.901.615</td>
              </tr>
              <tr>
                <td>2. Tunjangan PPh</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
              </tr>
              <tr>
                <td>3. Tunjangan Lainnya, Lembur, dsb</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
              </tr>
              <tr>
                <td>4. Honorarium dan Imbalan Lain</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
              </tr>
              <tr>
                <td>5. Premi Asuransi Dibayar Pemberi Kerja</td>
                <td class="align-r">267.934</td>
                <td class="align-r">0</td>
                <td class="align-r">267.934</td>
              </tr>
              <tr>
                <td>6. Penerimaan Dalam Bentuk Natura</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
              </tr>
              <tr class="font-bold" style="background-color: #f8fafc;">
                <td class="indent">Jumlah (1 s.d 6)</td>
                <td class="align-r">6.169.549</td>
                <td class="align-r">0</td>
                <td class="align-r">6.169.549</td>
              </tr>
              <tr>
                <td>7. Bonus, THR, Tantiem, Jasa Produksi dll</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
              </tr>
              <tr class="font-bold" style="background-color: #f8fafc;">
                <td class="indent">8. Jumlah Penghasilan Bruto 1 s.d 7</td>
                <td class="align-r">6.169.549</td>
                <td class="align-r">0</td>
                <td class="align-r">6.169.549</td>
              </tr>
              <tr>
                <td>9. Biaya Jabatan</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">308.477</td>
              </tr>
              <tr>
                <td>10. Iuran Pensiun</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">177.048</td>
              </tr>
              <tr>
                <td>11. Zakat</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">0</td>
              </tr>
              <tr class="font-bold">
                <td>12. Jumlah Pengurangan (9+10+11)</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">485.525</td>
              </tr>
              <tr class="font-bold">
                <td>13. Jumlah Penghasilan Netto (8-12)</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">5.684.024</td>
              </tr>
              <tr>
                <td>14. Penghasilan Sebelumnya</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">0</td>
              </tr>
              <tr class="font-bold">
                <td>15. Penghasilan Neto Setahun/Disetahunkan</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">68.208.288</td>
              </tr>
              <tr>
                <td>16. PTKP</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">54.000.000</td>
              </tr>
              <tr class="font-bold">
                <td>17. PKP Setahun/Disetahunkan(14-15)</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">14.208.000</td>
              </tr>
              <tr class="font-bold">
                <td>18. PPh Setahun/Disetahunkan</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">710.400</td>
              </tr>
              <tr>
                <td>19. PPh Dipotong Masa Sebelumnya</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
                <td class="align-r">0</td>
              </tr>
              <tr>
                <td class="indent">Golongan Tarif</td>
                <td class="align-c font-bold">TER A</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
              </tr>
              <tr>
                <td class="indent">Tarif Efektif (%)</td>
                <td class="align-c font-bold">0.75</td>
                <td colspan="2" style="background-color: #f1f5f9;"></td>
              </tr>
              <tr class="font-bold">
                <td>20. PPh 21 Terhutang</td>
                <td class="align-r">46.272</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
              </tr>
              <tr class="font-bold">
                <td>21. PPh Yang Disetor</td>
                <td class="align-r">46.272</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
              </tr>
              <tr class="font-bold">
                <td>22. PPh Yang Kurang/Lebih Disetor</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
                <td class="align-r">0</td>
              </tr>
            </tbody>
          </table>
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
    { id: 'unitName', label: 'Unit' },
    { id: 'position', label: 'Position' },
    { id: 'branch', label: 'Branch' },
    { id: 'joinDate', label: 'Join Date' },
    { id: 'resignDate', label: 'Resign Date' },
    {
      id: 'statusEmployee',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.statusEmployee}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.75rem',
            bgcolor: row.statusEmployee === 'Resign' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            color: row.statusEmployee === 'Resign' ? '#ef4444' : '#10b981'
          }}
        />
      )
    },
    { id: 'periodeStart', label: 'Periode Start' },
    { id: 'periodeEnd', label: 'Periode End' },
    { id: 'methodePajak', label: 'Methode Pajak' },
    { id: 'komponenProject', label: 'Komponen Project' },
    { id: 'sumberAcuanPajak', label: 'Sumber Acuan Pajak' },
    {
      id: 'totalBruto',
      label: 'Total Bruto',
      align: 'right',
      render: (row) => (
        <Typography sx={{ color: '#10b981', fontWeight: 700, fontSize: '0.875rem' }}>
          Rp {row.totalBruto.toLocaleString('id-ID')}
        </Typography>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Tooltip title="Preview / Cetak Rincian PPh21">
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
          <CalculateIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Simulasi PPh Pasal 21
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Simulasi perhitungan PPh21 bruto, potongan biaya jabatan, iuran pensiun, dan tarif TER
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
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MonetizationOnIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total Bruto
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                Rp {totalBruto.toLocaleString('id-ID')}
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
              <CheckCircleIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Karyawan Aktif
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                {totalActive}
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
              <AccountBalanceWalletIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Karyawan Resign
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444' }}>
                {totalResign}
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
            <Grid item xs={12} sm={6} md={2.4}>
              <SearchableSelect
                label="Division"
                value={filterDivision}
                onChange={setFilterDivision}
                options={divisions.map(d => ({ value: d, label: d }))}
                placeholder="Semua Divisi"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <SearchableSelect
                label="Unit Name"
                value={filterUnit}
                onChange={setFilterUnit}
                options={units.map(u => ({ value: u, label: u }))}
                placeholder="Semua Unit"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <SearchableSelect
                label="Position"
                value={filterPosition}
                onChange={setFilterPosition}
                options={positions.map(p => ({ value: p, label: p }))}
                placeholder="Semua Posisi"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <SearchableSelect
                label="Employee Type"
                value={filterEmployeeType}
                onChange={setFilterEmployeeType}
                options={employeeTypes.map(t => ({ value: t, label: t }))}
                placeholder="Semua Tipe"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <SearchableSelect
                label="Branch"
                value={filterBranch}
                onChange={setFilterBranch}
                options={branches.map(b => ({ value: b, label: b }))}
                placeholder="Semua Cabang"
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            disabled={selectedIds.length === 0}
            onClick={() => {
              const firstSelected = dataList.find(r => r.id === selectedIds[0]);
              if (firstSelected) handlePrintSlip(firstSelected);
            }}
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
            CETAK RINCIAN TERPILIH
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

      {/* 6. Rincian PPh21 Preview Modal */}
      <CustomModal
        open={slipModalOpen}
        onClose={() => setSlipModalOpen(false)}
        title="Rincian Perhitungan PPh Pasal 21"
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
              color: 'text.primary'
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
              PT DANAMAS INSAN KREASI ANDALAN
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 2 }}>
              Rincian Perhitungan PPh Pasal 21 - {selectedSlipEmployee.name} ({selectedSlipEmployee.nik})
            </Typography>

            <Grid container spacing={1.5} sx={{ mb: 2.5, fontSize: '0.85rem' }}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Jabatan</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedSlipEmployee.position}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Total Bruto</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>
                  Rp {selectedSlipEmployee.totalBruto.toLocaleString('id-ID')}
                </Typography>
              </Grid>
            </Grid>
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
