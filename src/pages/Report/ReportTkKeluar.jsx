import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  PersonRemove as PersonRemoveIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  EventBusy as EventBusyIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_TKKELUAR_DATA = [
  {
    id: 1,
    nik: 'D7230001',
    name: 'MUHAMMAD RIKKI',
    dob: '01-May-2023',
    ktpNo: '3333331201990001',
    companyName: 'Bank Mega Syariah',
    unitKerja: 'Sales',
    gender: 'Laki-laki',
    joinDate: '29-November-2023',
    resignDate: '22-March-2026',
    salary: 5000000,
    address: 'Jl. Pemuda No. 45 Jakarta',
    keterangan: 'RESIGN'
  },
  {
    id: 2,
    nik: 'D8250014',
    name: 'RIZKY',
    dob: '14-August-2000',
    ktpNo: '3245454543321320',
    companyName: 'BCA',
    unitKerja: 'CS Finance',
    gender: 'Laki-laki',
    joinDate: '31-December-2025',
    resignDate: '08-March-2026',
    salary: 5900000,
    address: 'Jl. Sudirman Kav 10 Jakarta',
    keterangan: 'END CONTRACT'
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReportTkKeluar() {
  const [dataList, setDataList] = useState(INITIAL_TKKELUAR_DATA);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnitKerja, setFilterUnitKerja] = useState('');
  const [filterMonth, setFilterMonth] = useState('March');
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
    setFilterMonth('March');
    setFilterYear('2026');
    showSnackbar('Filter berhasil di-reset', 'info');
  };

  const handleExport = () => {
    showSnackbar('Export data Tenaga Kerja Keluar berhasil diunduh!', 'success');
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
    if (searchQuery && !row.name.toLowerCase().includes(searchQuery.toLowerCase()) && !row.nik.toLowerCase().includes(searchQuery.toLowerCase()) && !row.ktpNo.includes(searchQuery)) return false;
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
  const totalSalary = filteredData.reduce((sum, r) => sum + (r.salary || 0), 0);
  const totalMale = filteredData.filter(r => r.gender === 'Laki-laki').length;
  const totalFemale = filteredData.filter(r => r.gender === 'Perempuan').length;

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
      label: 'Nama Tenaga Kerja', 
      headerRender: () => renderSortableHeader('Nama Tenaga Kerja', 'name'), 
      render: (row) => <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{row.name}</Typography> 
    },
    { id: 'dob', label: 'Tgl Lahir', headerRender: () => renderSortableHeader('Tgl Lahir', 'dob') },
    { 
      id: 'ktpNo', 
      label: 'Nomor KTP', 
      headerRender: () => renderSortableHeader('Nomor KTP', 'ktpNo'),
      render: (row) => (
        <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'text.secondary' }}>
          {row.ktpNo || '-'}
        </Typography>
      )
    },
    { id: 'companyName', label: 'Perusahaan / Client', headerRender: () => renderSortableHeader('Perusahaan', 'companyName') },
    { id: 'unitKerja', label: 'Unit Kerja', headerRender: () => renderSortableHeader('Unit Kerja', 'unitKerja') },
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
    { id: 'joinDate', label: 'Tgl Join', headerRender: () => renderSortableHeader('Tgl Join', 'joinDate') },
    { 
      id: 'resignDate', 
      label: 'Tgl Resign / Keluar', 
      headerRender: () => renderSortableHeader('Tgl Resign', 'resignDate'),
      render: (row) => (
        <Chip
          icon={<EventBusyIcon sx={{ fontSize: '14px !important' }} />}
          label={row.resignDate}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.75rem',
            bgcolor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444'
          }}
        />
      )
    },
    { 
      id: 'salary', 
      label: 'Upah Terakhir', 
      align: 'right', 
      headerRender: () => renderSortableHeader('Upah Terakhir', 'salary'), 
      render: (row) => (
        <Typography sx={{ fontWeight: 700, color: '#10b981', fontSize: '0.875rem' }}>
          Rp {(row.salary || 0).toLocaleString('id-ID')}
        </Typography>
      ) 
    },
    { 
      id: 'keterangan', 
      label: 'Keterangan', 
      headerRender: () => renderSortableHeader('Keterangan', 'keterangan'),
      render: (row) => (
        <Chip
          label={row.keterangan || 'RESIGN'}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.75rem',
            bgcolor: 'rgba(245, 158, 11, 0.1)',
            color: '#f59e0b'
          }}
        />
      )
    },
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
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(248, 113, 113, 0.05))',
            color: '#ef4444',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <PersonRemoveIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Report Daftar Tenaga Kerja Keluar
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Tinjau data laporan karyawan resign / habis masa kontrak untuk pelaporan BPJS & administrasi payroll
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
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PersonRemoveIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total TK Keluar
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
                Total Upah Terakhir
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
              Cari NIK / Nama / KTP
            </Typography>
            <TextField
              placeholder="Search NIK, Nama, atau No KTP..."
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
                onClick={() => showSnackbar('Filter data berhasil diaplikasikan!', 'success')}
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
          Menampilkan {filteredData.length} baris data tenaga kerja keluar
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
          EXPORT TK KELUAR
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
