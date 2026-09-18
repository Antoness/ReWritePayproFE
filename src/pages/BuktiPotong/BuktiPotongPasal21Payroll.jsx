import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, Checkbox, Grid, Tooltip, IconButton, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  UploadFile as UploadIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  ReceiptLong as ReceiptLongIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingActionsIcon,
  LocationCity as LocationCityIcon,
  ConfirmationNumber as NumberIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_P21_DATA = [
  {
    id: 1,
    nik: 'D0000331',
    name: 'Pegawai Dummy 331',
    employeeType: 'Pkwt',
    division: 'Business Development',
    unitName: 'Laku Pandai',
    position: 'SUPERVISOR',
    branch: 'Bogor',
    joinDate: '19/02/2026',
    resignDate: '',
    statusEmployee: 'Active',
    methodePajak: 'Net',
    komponenProject: 'Net',
    sumberAcuanPajak: 'Master Client',
    periodePayroll: 'November-2026',
    nomor: ''
  },
  {
    id: 2,
    nik: 'D6211412',
    name: 'JODDY WIRABATAVRI',
    employeeType: 'PKWT',
    division: 'Motivational',
    unitName: 'Motivational',
    position: 'Digital Marketing',
    branch: 'JAKARTA',
    joinDate: '01/12/2021',
    resignDate: '',
    statusEmployee: 'Active',
    methodePajak: 'Net',
    komponenProject: '',
    sumberAcuanPajak: 'Master Employee (Override)',
    periodePayroll: 'November-2026',
    nomor: '2.1-11.26-000001'
  },
  {
    id: 3,
    nik: 'D8210663',
    name: 'POPI ANGRAINI',
    employeeType: 'PKWT',
    division: 'Tax, Accounting & Biz Plan',
    unitName: 'Accounting',
    position: 'Supervisor',
    branch: 'JAKARTA',
    joinDate: '02/06/2021',
    resignDate: '',
    statusEmployee: 'Active',
    methodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    periodePayroll: 'November-2026',
    nomor: '2.1-11.26-000002'
  },
  {
    id: 4,
    nik: 'D8230429',
    name: 'PUTRI ADHILA INAS MAWARNI',
    employeeType: 'PKWT',
    division: 'Manajemen Risiko & Int Audit',
    unitName: 'Internal Audit',
    position: 'Supervisor',
    branch: 'JAKARTA',
    joinDate: '01/03/2023',
    resignDate: '',
    statusEmployee: 'Active',
    methodePajak: 'Net',
    komponenProject: 'Net',
    sumberAcuanPajak: 'Master Client',
    periodePayroll: 'November-2026',
    nomor: ''
  },
  {
    id: 5,
    nik: 'D8231214',
    name: 'MAMTA SARTIKA',
    employeeType: 'PKWT',
    division: 'Tax, Accounting & Biz Plan',
    unitName: 'Accounting',
    position: 'Administrasi',
    branch: 'JAKARTA',
    joinDate: '28/08/2023',
    resignDate: '',
    statusEmployee: 'Active',
    methodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    periodePayroll: 'November-2026',
    nomor: ''
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BuktiPotongPasal21Payroll() {
  const { user } = useSelector((state) => state.auth);

  // States
  const [dataList, setDataList] = useState(INITIAL_P21_DATA);
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
  const [filterMonth, setFilterMonth] = useState('November');
  const [filterYear, setFilterYear] = useState('2026');

  // Modals
  const [numberModalOpen, setNumberModalOpen] = useState(false);
  const [inputNumberVal, setInputNumberVal] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // Notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: () => {} });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Lists for dropdown options
  const divisions = Array.from(new Set(dataList.map(r => r.division).filter(Boolean)));
  const units = Array.from(new Set(dataList.map(r => r.unitName).filter(Boolean)));
  const positions = Array.from(new Set(dataList.map(r => r.position).filter(Boolean)));
  const branches = Array.from(new Set(dataList.map(r => r.branch).filter(Boolean)));
  const employeeTypes = Array.from(new Set(dataList.map(r => r.employeeType).filter(Boolean)));

  // Filter logic
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
    if (filterBranch && row.branch !== filterBranch) return false;
    if (filterEmployeeType && row.employeeType !== filterEmployeeType) return false;
    return true;
  });

  const startIndex = (page - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Totals calculations
  const totalEmployees = filteredData.length;
  const totalWithNumber = filteredData.filter(r => !!r.nomor).length;
  const totalWithoutNumber = filteredData.filter(r => !r.nomor).length;
  const totalBranchesCount = Array.from(new Set(filteredData.map(r => r.branch).filter(Boolean))).length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterDivision('');
    setFilterUnit('');
    setFilterPosition('');
    setFilterBranch('');
    setFilterEmployeeType('');
    setFilterMonth('November');
    setFilterYear('2026');
    showSnackbar('Filter berhasil di-reset', 'info');
  };

  const handleInputNomor = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Pilih minimal satu karyawan terlebih dahulu!', 'warning');
      return;
    }
    setInputNumberVal('');
    setNumberModalOpen(true);
  };

  const submitNomor = () => {
    if (!inputNumberVal.trim()) {
      showSnackbar('Nomor tidak boleh kosong!', 'error');
      return;
    }
    setDataList(prev => prev.map(item => {
      if (selectedIds.includes(item.id)) {
        return { ...item, nomor: inputNumberVal };
      }
      return item;
    }));
    setNumberModalOpen(false);
    setSelectedIds([]);
    showSnackbar('Nomor bukti potong berhasil diperbarui!', 'success');
  };

  const handleExport = () => {
    showSnackbar('Ekspor data bukti potong Pasal 21 Payroll berhasil!', 'success');
  };

  const handleUpload = () => {
    showSnackbar('Unggah data bukti potong Pasal 21 Payroll berhasil!', 'success');
  };

  const handleEditRow = (row) => {
    setEditingRow({ ...row });
    setEditModalOpen(true);
  };

  const saveRowEdit = () => {
    setDataList(prev => prev.map(item => item.id === editingRow.id ? editingRow : item));
    setEditModalOpen(false);
    showSnackbar('Data berhasil disimpan!', 'success');
  };

  const triggerPrintPdf = (employee) => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Bukti Potong PPh 21 Payroll - ${employee.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; font-size: 13px; }
            .border-box { border: 2px solid #000; padding: 20px; }
            h2 { text-align: center; text-transform: uppercase; margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            td { padding: 6px; }
            .label { width: 30%; font-weight: bold; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="border-box">
            <h2>BUKTI PEMOTONGAN PAJAK PENGHASILAN PASAL 21 BULANAN</h2>
            <hr style="border: 1px solid #000;" />
            <table>
              <tr><td class="label">Nomor Bukti Potong</td><td>: ${employee.nomor || '-'}</td></tr>
              <tr><td class="label">NIK</td><td>: ${employee.nik}</td></tr>
              <tr><td class="label">Nama Penerima Penghasilan</td><td>: ${employee.name}</td></tr>
              <tr><td class="label">Jabatan</td><td>: ${employee.position}</td></tr>
              <tr><td class="label">Metode Pajak</td><td>: ${employee.methodePajak}</td></tr>
              <tr><td class="label">Sumber Acuan Pajak</td><td>: ${employee.sumberAcuanPajak}</td></tr>
              <tr><td class="label">Periode Payroll</td><td>: ${employee.periodePayroll}</td></tr>
            </table>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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
              setSelectedIds(prev => Array.from(new Set([...prev, ...paginatedData.map(r => r.id)])));
            } else {
              setSelectedIds(prev => prev.filter(id => !paginatedData.map(r => r.id).includes(id)));
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
            bgcolor: 'rgba(16, 185, 129, 0.1)',
            color: '#10b981'
          }}
        />
      )
    },
    { id: 'methodePajak', label: 'Methode Pajak' },
    { id: 'komponenProject', label: 'Komponen Project' },
    { id: 'sumberAcuanPajak', label: 'Sumber Acuan Pajak' },
    { id: 'periodePayroll', label: 'Periode Payroll' },
    {
      id: 'nomor',
      label: 'Nomor Bukti Potong',
      render: (row) => row.nomor ? (
        <Chip
          label={row.nomor}
          size="small"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '0.75rem',
            bgcolor: 'rgba(37, 99, 235, 0.1)',
            color: '#2563eb'
          }}
        />
      ) : (
        <Typography sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.8rem' }}>Belum ada</Typography>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'center',
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="Cetak Bukti Potong Bulanan">
            <IconButton
              size="small"
              onClick={() => triggerPrintPdf(row)}
              sx={{
                color: '#0284c7',
                bgcolor: 'rgba(2, 132, 199, 0.08)',
                '&:hover': { bgcolor: 'rgba(2, 132, 199, 0.16)' }
              }}
            >
              <PrintIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Data">
            <IconButton
              size="small"
              onClick={() => handleEditRow(row)}
              sx={{
                color: '#16a34a',
                bgcolor: 'rgba(22, 163, 74, 0.08)',
                '&:hover': { bgcolor: 'rgba(22, 163, 74, 0.16)' }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
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
            Bukti Potong PPh 21 Bulanan (Payroll)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Pengelolaan nomor bukti potong bulanan dan pencetakan dokumen bukti pemotongan PPh Pasal 21
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
              <CheckCircleIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Sudah Ada Nomor
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                {totalWithNumber}
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
              <PendingActionsIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Belum Ada Nomor
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444' }}>
                {totalWithoutNumber}
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
              <LocationCityIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total Cabang
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                {totalBranchesCount} Cabang
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
          {/* Row 1: Search & Month/Year */}
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={5}>
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

            <Grid item xs={12} sm={6} md={2}>
              <SearchableSelect
                label="Bulan"
                value={filterMonth}
                onChange={setFilterMonth}
                options={MONTH_NAMES.map(m => ({ value: m, label: m }))}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <SearchableSelect
                label="Tahun"
                value={filterYear}
                onChange={setFilterYear}
                options={[
                  { value: '2026', label: '2026' },
                  { value: '2025', label: '2025' },
                  { value: '2024', label: '2024' }
                ]}
              />
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
                label="Branch"
                value={filterBranch}
                onChange={setFilterBranch}
                options={branches.map(b => ({ value: b, label: b }))}
                placeholder="Semua Cabang"
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
          <Button
            variant="contained"
            startIcon={<NumberIcon />}
            onClick={handleInputNomor}
            sx={{
              bgcolor: '#0284c7',
              '&:hover': { bgcolor: '#0369a1' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              height: 40
            }}
          >
            INPUT NOMOR
          </Button>

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
            EXPORT DATA
          </Button>

          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleUpload}
            sx={{
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              height: 40
            }}
          >
            UPLOAD DATA
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

      {/* 6. Input Nomor Modal */}
      <CustomModal
        open={numberModalOpen}
        onClose={() => setNumberModalOpen(false)}
        title="Input Nomor Bukti Potong PPh 21 Payroll"
        maxWidth="sm"
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, width: '100%' }}>
            <Button
              variant="outlined"
              onClick={() => setNumberModalOpen(false)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={submitNomor}
              sx={{
                bgcolor: '#0f172a',
                '&:hover': { bgcolor: '#1e293b' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700
              }}
            >
              Simpan Nomor
            </Button>
          </Box>
        }
      >
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Masukkan nomor bukti potong untuk <strong>{selectedIds.length}</strong> data karyawan terpilih:
          </Typography>
          <TextField
            autoFocus
            label="Nomor Bukti Potong"
            placeholder="Contoh: 2.1-11.26-000001"
            fullWidth
            size="small"
            value={inputNumberVal}
            onChange={(e) => setInputNumberVal(e.target.value)}
          />
        </Stack>
      </CustomModal>

      {/* 7. Edit Data Modal */}
      <CustomModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Data Bukti Potong PPh 21"
        maxWidth="sm"
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, width: '100%' }}>
            <Button
              variant="outlined"
              onClick={() => setEditModalOpen(false)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={saveRowEdit}
              sx={{
                bgcolor: '#0284c7',
                '&:hover': { bgcolor: '#0369a1' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700
              }}
            >
              Simpan Perubahan
            </Button>
          </Box>
        }
      >
        {editingRow && (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="NIK" fullWidth size="small" disabled value={editingRow.nik} />
            <TextField label="Nama Karyawan" fullWidth size="small" disabled value={editingRow.name} />
            <TextField
              label="Nomor Bukti Potong"
              fullWidth
              size="small"
              value={editingRow.nomor || ''}
              onChange={(e) => setEditingRow(prev => ({ ...prev, nomor: e.target.value }))}
            />
            <FormControl size="small" fullWidth>
              <InputLabel>Methode Pajak</InputLabel>
              <Select
                value={editingRow.methodePajak}
                label="Methode Pajak"
                onChange={(e) => setEditingRow(prev => ({ ...prev, methodePajak: e.target.value }))}
              >
                <MenuItem value="Net">Net</MenuItem>
                <MenuItem value="Gross">Gross</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        )}
      </CustomModal>

      {/* Global Snackbar & Confirm */}
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
