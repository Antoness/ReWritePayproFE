import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  CorporateFare as CorporateFareIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_TKMASUK_DATA = [
  {
    id: 1,
    name: 'Pegawai Payroll 10002',
    pob: 'Jakarta',
    dob: '26-January-2005',
    ktpNo: '3171012601050001',
    companyName: 'AIR ASIA',
    unitKerja: 'AIR ASIA',
    maritalStatus: 'Menikah',
    gender: 'Laki-laki',
    joinDate: '05-April-2026',
    salary: 1000000,
    month: 'Juli',
    motherName: 'Ibu Siti',
    address: 'Jl. Merdeka No. 10 Jakarta'
  },
  {
    id: 2,
    name: 'Pegawai Payroll 1010',
    pob: 'Bogor',
    dob: '10-April-2006',
    ktpNo: '3201011004060002',
    companyName: 'AIR ASIA',
    unitKerja: 'AIR ASIA',
    maritalStatus: 'Menikah',
    gender: 'Perempuan',
    joinDate: '18-April-2026',
    salary: 1000000,
    month: 'Juli',
    motherName: 'Ibu Aminah',
    address: 'Jl. Pajajaran No. 22 Bogor'
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReportTkMasuk() {
  const [dataList, setDataList] = useState(INITIAL_TKMASUK_DATA);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnitKerja, setFilterUnitKerja] = useState('');
  const [filterMonth, setFilterMonth] = useState('April');
  const [filterYear, setFilterYear] = useState('2026');

  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('ASCENDING');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (msg, sev = 'success') => {
    setSnackbar({ open: true, message: msg, severity: sev });
  };

  const divisions = Array.from(new Set(dataList.map(r => r.companyName).filter(Boolean)));
  const unitKerjas = Array.from(new Set(dataList.map(r => r.unitKerja).filter(Boolean)));

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterDivision('');
    setFilterUnitKerja('');
    setFilterMonth('April');
    setFilterYear('2026');
    showSnackbar('Filter berhasil di-reset', 'info');
  };

  const handleExport = () => {
    showSnackbar('Export data Tenaga Kerja Masuk berhasil diunduh!', 'success');
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
    if (searchQuery && !row.name.toLowerCase().includes(searchQuery.toLowerCase()) && !row.ktpNo.includes(searchQuery)) return false;
    if (filterDivision && row.companyName !== filterDivision) return false;
    if (filterUnitKerja && row.unitKerja !== filterUnitKerja) return false;
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
  const totalSalary = filteredData.reduce((sum, r) => sum + r.salary, 0);
  const totalMale = filteredData.filter(r => r.gender === 'Laki-laki').length;
  const totalFemale = filteredData.filter(r => r.gender === 'Perempuan').length;

  const columns = [
    { 
      id: 'name', 
      label: 'Nama Tenaga Kerja', 
      headerRender: () => renderSortableHeader('Nama Tenaga Kerja', 'name'), 
      render: (row) => <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{row.name}</Typography> 
    },
    { id: 'pob', label: 'Tempat Lahir', headerRender: () => renderSortableHeader('Tempat Lahir', 'pob'), render: (row) => row.pob || '-' },
    { id: 'dob', label: 'Tanggal Lahir', headerRender: () => renderSortableHeader('Tanggal Lahir', 'dob') },
    { 
      id: 'ktpNo', 
      label: 'Nomor KTP', 
      headerRender: () => renderSortableHeader('Nomor KTP', 'ktpNo'),
      render: (row) => (
        <Chip
          label={row.ktpNo || '-'}
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
    { id: 'companyName', label: 'Perusahaan / Client', headerRender: () => renderSortableHeader('Perusahaan', 'companyName') },
    { id: 'unitKerja', label: 'Unit Kerja', headerRender: () => renderSortableHeader('Unit Kerja', 'unitKerja') },
    { id: 'maritalStatus', label: 'Status Nikah', headerRender: () => renderSortableHeader('Status Nikah', 'maritalStatus') },
    { 
      id: 'gender', 
      label: 'Jenis Kelamin', 
      headerRender: () => renderSortableHeader('Jenis Kelamin', 'gender'),
      render: (row) => (
        <Chip
          label={row.gender}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.75rem',
            bgcolor: row.gender === 'Laki-laki' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(236, 72, 153, 0.1)',
            color: row.gender === 'Laki-laki' ? '#2563eb' : '#db2777'
          }}
        />
      )
    },
    { id: 'joinDate', label: 'Tgl Masuk', headerRender: () => renderSortableHeader('Tgl Masuk', 'joinDate') },
    { 
      id: 'salary', 
      label: 'Upah / Gaji', 
      align: 'right', 
      headerRender: () => renderSortableHeader('Upah / Gaji', 'salary'), 
      render: (row) => (
        <Typography sx={{ fontWeight: 700, color: '#10b981', fontSize: '0.875rem' }}>
          Rp {row.salary.toLocaleString('id-ID')}
        </Typography>
      ) 
    },
    { id: 'motherName', label: 'Nama Ibu Kandung', render: (row) => row.motherName || '-' },
    { id: 'address', label: 'Alamat', render: (row) => row.address || '-' }
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
          <PersonAddIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Report Tenaga Kerja Masuk (New Hire)
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Tinjau data karyawan baru masuk untuk pelaporan BPJS Ketenagakerjaan & administrasi payroll
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
                Total TK Masuk
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
                Total Upah Awal
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                Rp {totalSalary.toLocaleString('id-ID')}
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
                Laki-laki
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563eb' }}>
                {totalMale} Org
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
                bgcolor: 'rgba(236, 72, 153, 0.1)',
                color: '#db2777',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PeopleIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Perempuan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#db2777' }}>
                {totalFemale} Org
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
              Cari Nama / No KTP
            </Typography>
            <TextField
              placeholder="Search Nama atau No KTP..."
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
              label="Perusahaan / Client"
              value={filterDivision}
              onChange={setFilterDivision}
              options={divisions.map(d => ({ value: d, label: d }))}
              placeholder="Semua Perusahaan"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Unit Kerja"
              value={filterUnitKerja}
              onChange={setFilterUnitKerja}
              options={unitKerjas.map(u => ({ value: u, label: u }))}
              placeholder="Semua Unit"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={1.5}>
            <SearchableSelect
              label="Bulan"
              value={filterMonth}
              onChange={setFilterMonth}
              options={MONTH_NAMES.map(m => ({ value: m, label: m }))}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={1}>
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
          Menampilkan {filteredData.length} baris data tenaga kerja masuk
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
          EXPORT TK MASUK
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
