import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  CorporateFare as CorporateFareIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_IURANBPJS_DATA = [
  {
    id: 1,
    nik: 'D8221754',
    name: 'SHILVA DEWINTA',
    dob: '29-July-1997',
    ktpNo: '3275016907xxxxxx',
    companyName: 'BCA Digital',
    unitKerja: 'BCA Digital',
    upahBulanIni: 5067381,
    upahJp: 0,
    month: 'Agustus',
    jkk: 0,
    jkm: 0,
    jhtTk: 0,
    jhtPrshn: 0,
    jpPrshn: 0,
    jpTk: 0,
    totalIuran: 0
  },
  {
    id: 2,
    nik: 'D6210911',
    name: 'FERLYAWAN RUSADI',
    dob: '04-November-1992',
    ktpNo: '3275070411xxxxxx',
    companyName: 'Bank NEO Commerce',
    unitKerja: 'BNC Agent CS',
    upahBulanIni: 5067381,
    upahJp: 152022,
    month: 'Agustus',
    jkk: 12162,
    jkm: 15202,
    jhtTk: 101348,
    jhtPrshn: 187493,
    jpPrshn: 101348,
    jpTk: 50674,
    totalIuran: 468227
  },
  {
    id: 3,
    nik: 'D8230675',
    name: 'YUMNA ANANTA MAJID',
    dob: '23-August-2002',
    ktpNo: '3216026308xxxxxx',
    companyName: 'Indolakto',
    unitKerja: 'Indolakto',
    upahBulanIni: 8000000,
    upahJp: 240000,
    month: 'Agustus',
    jkk: 19200,
    jkm: 24000,
    jhtTk: 160000,
    jhtPrshn: 296000,
    jpPrshn: 160000,
    jpTk: 80000,
    totalIuran: 739200
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReportIuranBpjs() {
  const [dataList, setDataList] = useState(INITIAL_IURANBPJS_DATA);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnitKerja, setFilterUnitKerja] = useState('');
  const [filterMonth, setFilterMonth] = useState('August');

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
    setFilterMonth('August');
    showSnackbar('Filter berhasil di-reset', 'info');
  };

  const handleExport = () => {
    showSnackbar('Export Iuran BPJS Ketenagakerjaan berhasil diunduh!', 'success');
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
  const totalUpah = filteredData.reduce((sum, r) => sum + r.upahBulanIni, 0);
  const totalIuranAll = filteredData.reduce((sum, r) => sum + r.totalIuran, 0);
  const totalUnits = Array.from(new Set(filteredData.map(r => r.unitKerja).filter(Boolean))).length;

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
      render: (row) => <Typography sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{row.ktpNo}</Typography>
    },
    { id: 'companyName', label: 'Perusahaan / Client', headerRender: () => renderSortableHeader('Perusahaan', 'companyName') },
    { id: 'unitKerja', label: 'Unit Kerja', headerRender: () => renderSortableHeader('Unit Kerja', 'unitKerja') },
    { 
      id: 'upahBulanIni', 
      label: 'Upah Bulan Ini', 
      align: 'right', 
      headerRender: () => renderSortableHeader('Upah Bulan Ini', 'upahBulanIni'), 
      render: (row) => `Rp ${row.upahBulanIni.toLocaleString('id-ID')}` 
    },
    { id: 'jkk', label: 'JKK', align: 'right', render: (row) => `Rp ${row.jkk.toLocaleString('id-ID')}` },
    { id: 'jkm', label: 'JKM', align: 'right', render: (row) => `Rp ${row.jkm.toLocaleString('id-ID')}` },
    { id: 'jhtTk', label: 'JHT (TK)', align: 'right', render: (row) => `Rp ${row.jhtTk.toLocaleString('id-ID')}` },
    { id: 'jhtPrshn', label: 'JHT (Perusahaan)', align: 'right', render: (row) => `Rp ${row.jhtPrshn.toLocaleString('id-ID')}` },
    { id: 'jpPrshn', label: 'JP (Perusahaan)', align: 'right', render: (row) => `Rp ${row.jpPrshn.toLocaleString('id-ID')}` },
    { id: 'jpTk', label: 'JP (TK)', align: 'right', render: (row) => `Rp ${row.jpTk.toLocaleString('id-ID')}` },
    { 
      id: 'totalIuran', 
      label: 'Total Iuran', 
      align: 'right', 
      headerRender: () => renderSortableHeader('Total Iuran', 'totalIuran'), 
      render: (row) => (
        <Typography sx={{ fontWeight: 700, color: '#10b981', fontSize: '0.875rem' }}>
          Rp {row.totalIuran.toLocaleString('id-ID')}
        </Typography>
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
          <HealthAndSafetyIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Report Iuran BPJS Ketenagakerjaan
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Rincian detail pemotongan iuran JKK, JKM, JHT, dan JP (Porsi Tenaga Kerja & Perusahaan)
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
                Total Tenaga Kerja
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
                Total Upah Bruto
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                Rp {totalUpah.toLocaleString('id-ID')}
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
                Total Iuran BPJS TK
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444' }}>
                Rp {totalIuranAll.toLocaleString('id-ID')}
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
              <CorporateFareIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total Unit Kerja
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                {totalUnits} Unit
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
          <Grid item xs={12} md={4}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Cari NIK / Nama Tenaga Kerja
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

          <Grid item xs={12} sm={6} md={3}>
            <SearchableSelect
              label="Perusahaan / Client"
              value={filterDivision}
              onChange={setFilterDivision}
              options={divisions.map(d => ({ value: d, label: d }))}
              placeholder="Semua Perusahaan"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
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

          <Grid item xs={12} md={1}>
            <Box sx={{ display: 'flex', gap: 1 }}>
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
                  height: 40,
                  width: '100%'
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
          Menampilkan {filteredData.length} baris detail iuran BPJS TK
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
          EXPORT IURAN BPJS TK
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
