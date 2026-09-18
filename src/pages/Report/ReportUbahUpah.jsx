import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  PriceChange as PriceChangeIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_UBAHUPAH_DATA = [
  {
    id: 1,
    nik: 'D8221754',
    name: 'SHILVA DEWINTA',
    dob: '29-July-1997',
    ktpNo: '3275016907970002',
    companyName: 'BCA Digital',
    unitKerja: 'BCA Digital',
    gender: 'Perempuan',
    month: 'Desember',
    lastMonthSalary: 5067381,
    thisMonthSalary: 5500000
  },
  {
    id: 2,
    nik: 'D8230937',
    name: 'KRISNA TRI PUTRA',
    dob: '02-November-1990',
    ktpNo: '3172030211900001',
    companyName: 'MSI',
    unitKerja: 'MSI Merchant Care',
    gender: 'Laki-laki',
    month: 'Desember',
    lastMonthSalary: 4800000,
    thisMonthSalary: 5067381
  },
  {
    id: 3,
    nik: 'D8230675',
    name: 'YUMNA ANANTA MAJID',
    dob: '23-August-2002',
    ktpNo: '3216026308020005',
    companyName: 'Indolakto',
    unitKerja: 'Indolakto',
    gender: 'Laki-laki',
    month: 'Desember',
    lastMonthSalary: 8000000,
    thisMonthSalary: 8000000
  }
];

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function ReportUbahUpah() {
  const [dataList, setDataList] = useState(INITIAL_UBAHUPAH_DATA);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnitKerja, setFilterUnitKerja] = useState('');
  const [filterMonth, setFilterMonth] = useState('Desember');

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
    setFilterMonth('Desember');
    showSnackbar('Filter berhasil di-reset', 'info');
  };

  const handleExport = () => {
    showSnackbar('Export data Perubahan Upah berhasil diunduh!', 'success');
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
    if (filterMonth && row.month !== filterMonth) return false;
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
  const totalRecords = filteredData.length;
  const totalLastMonth = filteredData.reduce((sum, r) => sum + (r.lastMonthSalary || 0), 0);
  const totalThisMonth = filteredData.reduce((sum, r) => sum + (r.thisMonthSalary || 0), 0);
  const totalDiff = totalThisMonth - totalLastMonth;

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
    { id: 'unitKerja', label: 'Unit Kerja', headerRender: () => renderSortableHeader('Unit Kerja', 'unitKerja'), render: (row) => row.unitKerja || row.companyName },
    { 
      id: 'gender', 
      label: 'Kelamin', 
      headerRender: () => renderSortableHeader('Kelamin', 'gender'),
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
    { id: 'month', label: 'Bulan', headerRender: () => renderSortableHeader('Bulan', 'month') },
    { 
      id: 'lastMonthSalary', 
      label: 'Gaji Bulan Lalu', 
      align: 'right', 
      headerRender: () => renderSortableHeader('Gaji Bulan Lalu', 'lastMonthSalary'), 
      render: (row) => (
        <Typography sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
          Rp {(row.lastMonthSalary || 0).toLocaleString('id-ID')}
        </Typography>
      ) 
    },
    { 
      id: 'thisMonthSalary', 
      label: 'Gaji Bulan Ini', 
      align: 'right', 
      headerRender: () => renderSortableHeader('Gaji Bulan Ini', 'thisMonthSalary'), 
      render: (row) => (
        <Typography sx={{ fontWeight: 700, color: '#10b981', fontSize: '0.875rem' }}>
          Rp {(row.thisMonthSalary || 0).toLocaleString('id-ID')}
        </Typography>
      ) 
    },
    {
      id: 'diff',
      label: 'Selisih / Penyesuaian',
      align: 'right',
      render: (row) => {
        const diff = (row.thisMonthSalary || 0) - (row.lastMonthSalary || 0);
        const isUp = diff > 0;
        const isDown = diff < 0;
        return (
          <Chip
            icon={isUp ? <TrendingUpIcon sx={{ fontSize: '14px !important' }} /> : isDown ? <TrendingDownIcon sx={{ fontSize: '14px !important' }} /> : <TrendingFlatIcon sx={{ fontSize: '14px !important' }} />}
            label={`${isUp ? '+' : ''}Rp ${diff.toLocaleString('id-ID')}`}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              bgcolor: isUp ? 'rgba(16, 185, 129, 0.1)' : isDown ? 'rgba(239, 68, 68, 0.1)' : 'action.hover',
              color: isUp ? '#10b981' : isDown ? '#ef4444' : 'text.secondary'
            }}
          />
        );
      }
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
          <PriceChangeIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Report Perubahan Upah Tenaga Kerja
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Tinjau data perbandingan mutasi, kenaikan upah pokok, dan penyesuaian gaji bulanan karyawan
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
                Total Perubahan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {totalRecords.toLocaleString('id-ID')} Org
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
                bgcolor: 'rgba(100, 116, 139, 0.1)',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MonetizationOnIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total Upah Lalu
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                Rp {totalLastMonth.toLocaleString('id-ID')}
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
                Total Upah Kini
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                Rp {totalThisMonth.toLocaleString('id-ID')}
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
                bgcolor: totalDiff >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: totalDiff >= 0 ? '#10b981' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <TrendingUpIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Net Penyesuaian
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: totalDiff >= 0 ? '#10b981' : '#ef4444' }}>
                {totalDiff >= 0 ? '+' : ''}Rp {totalDiff.toLocaleString('id-ID')}
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

          <Grid item xs={12} sm={6} md={2.5}>
            <SearchableSelect
              label="Unit Kerja"
              value={filterUnitKerja}
              onChange={setFilterUnitKerja}
              options={unitKerjas.map(u => ({ value: u, label: u }))}
              placeholder="Semua Unit"
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

          <Grid item xs={12} md={1.5}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<SearchIcon />}
                onClick={() => showSnackbar('Filter perubahan upah berhasil diaplikasikan!', 'success')}
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
          Menampilkan {filteredData.length} baris data perubahan upah
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
          EXPORT PERUBAHAN UPAH
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
