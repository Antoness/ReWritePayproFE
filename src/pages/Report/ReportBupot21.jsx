import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  ReceiptLong as ReceiptLongIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  LocationCity as LocationCityIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_BUPOT21_DATA = [
  {
    id: 1,
    nik: 'D6250001',
    name: 'D4V4I0PRX',
    employeeType: 'MAGANG',
    employeeStatus: 'ACTIVE',
    division: 'Operational',
    unitName: 'Sysmex',
    position: 'Cook 3',
    branch: 'BOGOR',
    methodePajak: 'Net',
    komponenProject: 'Net',
    sumberAcuanPajak: 'Master Client',
    periodePayroll: 'August-2026'
  },
  {
    id: 2,
    nik: 'D6220297',
    name: 'MEIDYANTO',
    employeeType: 'PKWT',
    employeeStatus: 'ACTIVE',
    division: 'HRD, Sales Governance & APP',
    unitName: 'APP Jakarta',
    position: 'Administrasi',
    branch: 'JAKARTA',
    methodePajak: 'Gross',
    komponenProject: '',
    sumberAcuanPajak: 'Master Employee (Override)',
    periodePayroll: 'August-2026'
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReportBupot21() {
  const [dataList, setDataList] = useState(INITIAL_BUPOT21_DATA);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterDivision, setFilterDivision] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterMonth, setFilterMonth] = useState('August');
  const [filterYear, setFilterYear] = useState('2026');
  const [filterTemplate, setFilterTemplate] = useState('');

  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('ASCENDING');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (msg, sev = 'success') => {
    setSnackbar({ open: true, message: msg, severity: sev });
  };

  const divisions = Array.from(new Set(dataList.map(r => r.division).filter(Boolean)));
  const employeeTypes = Array.from(new Set(dataList.map(r => r.employeeType).filter(Boolean)));

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterDivision('');
    setFilterEmployeeType('');
    setFilterMonth('August');
    setFilterYear('2026');
    setFilterTemplate('');
    showSnackbar('Filter berhasil di-reset', 'info');
  };

  const handleExport = () => {
    showSnackbar('Export Bukti Potong PPh 21 berhasil diunduh!', 'success');
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'ASCENDING' ? 'DESCENDING' : 'ASCENDING');
    } else {
      setSortField(field);
      setSortDirection('ASCENDING');
    }
  };

  const renderSortableHeader = (label, field) => {
    const isSorted = sortField === field;
    return (
      <Box 
        onClick={() => handleSort(field)} 
        sx={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          userSelect: 'none',
          gap: 0.5,
          '&:hover': { color: 'primary.main' }
        }}
      >
        <span>{label}</span>
        <span style={{ fontSize: '0.7rem', opacity: isSorted ? 1 : 0.4 }}>
          {!isSorted ? '↕' : sortDirection === 'ASCENDING' ? '▲' : '▼'}
        </span>
      </Box>
    );
  };

  const filteredData = dataList.filter(row => {
    if (searchQuery && !row.name.toLowerCase().includes(searchQuery.toLowerCase()) && !row.nik.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterDivision && row.division !== filterDivision) return false;
    if (filterEmployeeType && row.employeeType !== filterEmployeeType) return false;
    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortDirection === 'ASCENDING' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      return sortDirection === 'ASCENDING' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    }
  });

  const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  // Totals calculations
  const totalEmployees = filteredData.length;
  const totalActive = filteredData.filter(r => r.employeeStatus === 'ACTIVE').length;
  const totalBranchesCount = Array.from(new Set(filteredData.map(r => r.branch).filter(Boolean))).length;
  const totalDivisionsCount = Array.from(new Set(filteredData.map(r => r.division).filter(Boolean))).length;

  const columns = [
    { 
      id: 'nik', 
      label: 'NIK', 
      headerRender: () => renderSortableHeader('NIK', 'nik'),
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
      headerRender: () => renderSortableHeader('Name', 'name'), 
      render: (row) => <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{row.name}</Typography> 
    },
    { id: 'employeeType', label: 'Employee Type', headerRender: () => renderSortableHeader('Employee Type', 'employeeType') },
    { 
      id: 'employeeStatus', 
      label: 'Status', 
      headerRender: () => renderSortableHeader('Status', 'employeeStatus'),
      render: (row) => (
        <Chip
          label={row.employeeStatus}
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
    { id: 'division', label: 'Division', headerRender: () => renderSortableHeader('Division', 'division') },
    { id: 'unitName', label: 'Unit Name', headerRender: () => renderSortableHeader('Unit Name', 'unitName') },
    { id: 'position', label: 'Position', headerRender: () => renderSortableHeader('Position', 'position') },
    { id: 'branch', label: 'Branch', headerRender: () => renderSortableHeader('Branch', 'branch') },
    { id: 'methodePajak', label: 'Methode Pajak', headerRender: () => renderSortableHeader('Methode Pajak', 'methodePajak') },
    { id: 'komponenProject', label: 'Komponen Project', headerRender: () => renderSortableHeader('Komponen Project', 'komponenProject'), render: (row) => row.komponenProject || '-' },
    { id: 'sumberAcuanPajak', label: 'Sumber Acuan Pajak', headerRender: () => renderSortableHeader('Sumber Acuan Pajak', 'sumberAcuanPajak') },
    { id: 'periodePayroll', label: 'Periode Payroll', headerRender: () => renderSortableHeader('Periode Payroll', 'periodePayroll') }
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
            Report Rekap Bukti Potong PPh 21
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Tinjau dan ekspor rekapitulasi data bukti pemotongan PPh 21 bulanan karyawan
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
                Status Aktif
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
                bgcolor: 'rgba(2, 132, 199, 0.1)',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <DescriptionIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total Divisi
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0284c7' }}>
                {totalDivisionsCount} Divisi
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
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={3.5}>
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

          <Grid item xs={12} sm={6} md={2.5}>
            <SearchableSelect
              label="Division"
              value={filterDivision}
              onChange={setFilterDivision}
              options={divisions.map(d => ({ value: d, label: d }))}
              placeholder="Semua Divisi"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Employee Type"
              value={filterEmployeeType}
              onChange={setFilterEmployeeType}
              options={employeeTypes.map(t => ({ value: t, label: t }))}
              placeholder="Semua Tipe"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={1.5}>
            <SearchableSelect
              label="Month"
              value={filterMonth}
              onChange={setFilterMonth}
              options={MONTH_NAMES.map(m => ({ value: m, label: m }))}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={1}>
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

          <Grid item xs={12} md={1.5}>
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
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
          Menampilkan {filteredData.length} baris rekapitulasi bukti potong PPh 21
        </Typography>

        <Button
          variant="contained"
          startIcon={<ExportIcon />}
          onClick={handleExport}
          sx={{
            bgcolor: '#0f172a',
            '&:hover': { bgcolor: '#1e293b' },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            height: 40
          }}
        >
          EXPORT REKAP BUPOT 21
        </Button>
      </Box>

      {/* 5. Main Data Table */}
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

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      />
    </Box>
  );
}
