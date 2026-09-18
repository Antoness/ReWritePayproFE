import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Grid, Chip, Checkbox, Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as PlayArrowIcon,
  CloudDownload as CloudDownloadIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  PersonOff as PersonOffIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_KOMPENSASI_DATA = [
  { id: 1, nik: 'D7222723', name: 'ABDUL BASIT ARSAL', employeeType: 'PKWT', department: 'Operational - Kp', division: 'HRD, Sales Governance & APP', unitName: 'APP Luar Kota', position: 'Administrasi', branch: 'BALIKPAPAN', joinDate1: '07/12/2022', joinDate2: '', contractStart: '09/04/2025', contractEnd: '27/12/2027', statusEmployee: 'ACTIVE' },
  { id: 2, nik: 'D8260017', name: 'MUKHAMAD WINANTO', employeeType: 'PKWT', department: 'Operational - Kp', division: 'IT Programmer', unitName: 'IT Programmer', position: 'SUPERVISOR', branch: 'JAKARTA', joinDate1: '12/09/2018', joinDate2: '', contractStart: '15/01/2026', contractEnd: '10/01/2027', statusEmployee: 'ACTIVE' },
  { id: 3, nik: 'D8260018', name: 'AEF SYAEFUL MALIK', employeeType: 'PKWT', department: 'Operational - Kp', division: 'Merchant Delivery & Survey', unitName: 'IT Programmer', position: 'Mobile Sales', branch: 'BANDUNG', joinDate1: '18/03/2021', joinDate2: '01/03/2026', contractStart: '15/01/2026', contractEnd: '31/12/2026', statusEmployee: 'RESIGN' },
  { id: 4, nik: 'D6200567', name: 'MIFTAHUL HUDA AL ASHARI', employeeType: 'PKWT', department: 'Business Headcount/Jobsupply', division: 'KTA', unitName: 'Tele Collection', position: 'Supervisor', branch: 'JAKARTA', joinDate1: '16/12/2020', joinDate2: '', contractStart: '11/11/2025', contractEnd: '12/10/2026', statusEmployee: 'ACTIVE' },
  { id: 5, nik: 'D1190037', name: 'SIGIT DWI RAHARJO', employeeType: 'PKWT', department: 'Business Headcount/Jobsupply', division: 'BCA', unitName: 'Telemarketing', position: 'ASM', branch: 'JAKARTA', joinDate1: '17/07/2019', joinDate2: '', contractStart: '01/03/2026', contractEnd: '01/09/2026', statusEmployee: 'ACTIVE' },
  { id: 6, nik: 'D7221253', name: 'NISRINA NOVALINDA ZEIN', employeeType: 'PKWT', department: 'Operational - Kp', division: 'HRD, Sales Governance & APP', unitName: 'Recruitment', position: 'TRO JUNIOR', branch: 'JAKARTA', joinDate1: '14/07/2022', joinDate2: '', contractStart: '07/09/2025', contractEnd: '31/07/2026', statusEmployee: 'ACTIVE' },
  { id: 7, nik: 'D6240005', name: 'JOSUA VLADIO PUTRA', employeeType: 'pkwt', department: 'Operational - Kp', division: 'MIS', unitName: 'IT Programmer', position: 'IT MIS Staff', branch: 'JAKARTA', joinDate1: '11/12/2024', joinDate2: '', contractStart: '21/07/2025', contractEnd: '21/07/2026', statusEmployee: 'ACTIVE' },
  { id: 8, nik: 'D8260015', name: 'HUSAIN HUSAIN HUSAIN HUSAIN HUSAIN HUSAIN', employeeType: 'MITRA', department: 'Operational - Kp', division: 'IT Programmer', unitName: 'IT Programmer', position: 'Admin Inputer', branch: 'Johan Pahlawan', joinDate1: '01/05/2022', joinDate2: '08/05/2026', contractStart: '15/01/2026', contractEnd: '01/06/2026', statusEmployee: 'RESIGN' },
  { id: 9, nik: 'D6230245', name: 'ADAM MARTINO', employeeType: 'PKWT', department: 'Operational - Kp', division: 'IT, GA & Logistik', unitName: 'General Affair/Logistik', position: 'Office Boy', branch: 'LAMPUNG', joinDate1: '12/01/2023', joinDate2: '22/12/2025', contractStart: '22/12/2025', contractEnd: '30/05/2026', statusEmployee: 'ACTIVE' },
  { id: 10, nik: 'D8260008', name: 'YOTA YOTA', employeeType: 'PKWT', department: 'Operational - Kp', division: 'IT Programmer', unitName: 'IT Programmer', position: 'Admin Inputer', branch: 'JAKARTA', joinDate1: '01/05/2018', joinDate2: '09/04/2026', contractStart: '09/09/2025', contractEnd: '14/03/2026', statusEmployee: 'RESIGN' }
];

export default function RetrieveKompensasi() {
  const { user } = useSelector((state) => state.auth);

  // States
  const [dataList, setDataList] = useState(INITIAL_KOMPENSASI_DATA);
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
  const [filterBranch, setFilterBranch] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterStatusEmployee, setFilterStatusEmployee] = useState('');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSearch = () => {
    setPage(1);
    showSnackbar('Filter data kompensasi berhasil!', 'success');
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
    setFilterStatusEmployee('');
    setPage(1);
  };

  const handleProsesData = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Harap pilih karyawan terlebih dahulu!', 'warning');
      return;
    }
    const selectedNiks = dataList
      .filter(item => selectedIds.includes(item.id))
      .map(item => item.nik);
    showSnackbar(`Memproses ${selectedNiks.length} data kompensasi!`, 'success');
  };

  const filteredData = dataList.filter(row => {
    if (searchQuery && !row.name.toLowerCase().includes(searchQuery.toLowerCase()) && !row.nik.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterDivision && row.division !== filterDivision) return false;
    if (filterUnit && row.unitName !== filterUnit) return false;
    if (filterPosition && row.position !== filterPosition) return false;
    if (filterBranch && row.branch !== filterBranch) return false;
    if (filterEmployeeType && row.employeeType?.toUpperCase() !== filterEmployeeType?.toUpperCase()) return false;
    if (filterStatusEmployee && row.statusEmployee !== filterStatusEmployee) return false;
    return true;
  });

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const activeCount = filteredData.filter(d => d.statusEmployee === 'ACTIVE').length;
  const resignCount = filteredData.filter(d => d.statusEmployee === 'RESIGN').length;

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
      render: (row) => (
        <Chip label={row.nik} size="small" sx={{ fontFamily: 'monospace', fontWeight: 700, bgcolor: 'action.hover', borderRadius: '6px' }} />
      )
    },
    { id: 'name', label: 'Nama Karyawan', render: (row) => <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{row.name}</Typography> },
    { id: 'employeeType', label: 'Tipe', render: (row) => <Chip label={row.employeeType} size="small" sx={{ fontWeight: 600, borderRadius: '6px' }} /> },
    { id: 'division', label: 'Division' },
    { id: 'unitName', label: 'Unit Name' },
    { id: 'position', label: 'Position' },
    { id: 'branch', label: 'Branch' },
    { id: 'joinDate1', label: 'Join Date' },
    { id: 'contractStart', label: 'Start Kontrak' },
    { id: 'contractEnd', label: 'End Kontrak' },
    {
      id: 'statusEmployee',
      label: 'Status',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.statusEmployee}
          size="small"
          sx={{
            bgcolor: row.statusEmployee === 'ACTIVE' ? '#ecfdf5' : '#fef2f2',
            color: row.statusEmployee === 'ACTIVE' ? '#059669' : '#dc2626',
            fontWeight: 800,
            borderRadius: '6px'
          }}
        />
      )
    }
  ];

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
          <CloudDownloadIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Retrieve Uang Kompensasi
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ambil dan proses data kompensasi kerja bulanan karyawan PKWT / Berakhir Kontrak
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
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Karyawan PKWT</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{filteredData.length} Karyawan</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <CheckCircleIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Aktif</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>{activeCount} Karyawan</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <PersonOffIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Habis Kontrak / Resign</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{resignCount} Karyawan</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <PlayArrowIcon sx={{ fontSize: 24 }} />
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
          <Grid item xs={12} md={4}>
            <TextField
              placeholder="Cari NIK atau Nama..."
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
                { value: 'HRD, Sales Governance & APP', label: 'HRD, Sales Governance & APP' },
                { value: 'IT Programmer', label: 'IT Programmer' },
                { value: 'Merchant Delivery & Survey', label: 'Merchant Delivery & Survey' },
                { value: 'KTA', label: 'KTA' },
                { value: 'BCA', label: 'BCA' }
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
                { value: 'APP Luar Kota', label: 'APP Luar Kota' },
                { value: 'IT Programmer', label: 'IT Programmer' },
                { value: 'Tele Collection', label: 'Tele Collection' },
                { value: 'Telemarketing', label: 'Telemarketing' },
                { value: 'Recruitment', label: 'Recruitment' }
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
                { value: 'Administrasi', label: 'Administrasi' },
                { value: 'SUPERVISOR', label: 'SUPERVISOR' },
                { value: 'Mobile Sales', label: 'Mobile Sales' },
                { value: 'Supervisor', label: 'Supervisor' },
                { value: 'ASM', label: 'ASM' }
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
                { value: 'BALIKPAPAN', label: 'BALIKPAPAN' },
                { value: 'JAKARTA', label: 'JAKARTA' },
                { value: 'BANDUNG', label: 'BANDUNG' },
                { value: 'LAMPUNG', label: 'LAMPUNG' }
              ]}
              value={filterBranch}
              onChange={(val) => setFilterBranch(val)}
              placeholder="Pilih Branch"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Employee Type"
              options={[
                { value: '', label: 'Semua Tipe' },
                { value: 'PKWT', label: 'PKWT' },
                { value: 'MITRA', label: 'MITRA' }
              ]}
              value={filterEmployeeType}
              onChange={(val) => setFilterEmployeeType(val)}
              placeholder="Pilih Tipe"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Status Employee"
              options={[
                { value: '', label: 'Semua Status' },
                { value: 'ACTIVE', label: 'ACTIVE' },
                { value: 'RESIGN', label: 'RESIGN' }
              ]}
              value={filterStatusEmployee}
              onChange={(val) => setFilterStatusEmployee(val)}
              placeholder="Pilih Status"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Action Toolbar Directly Above Table */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: '14px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }} elevation={0}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Data Karyawan Kompensasi
          </Typography>
          <Chip 
            label={`${selectedIds.length} data dipilih`} 
            color={selectedIds.length > 0 ? "primary" : "default"}
            size="small" 
            sx={{ fontWeight: 700, borderRadius: '6px' }} 
          />
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="contained"
            onClick={handleProsesData}
            startIcon={<PlayArrowIcon />}
            disabled={selectedIds.length === 0}
            sx={{
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              height: '40px'
            }}
          >
            PROSES KOMPENSASI
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
      />

      {/* Global Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      />
    </Box>
  );
}
