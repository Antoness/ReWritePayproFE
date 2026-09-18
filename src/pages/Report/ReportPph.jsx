import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, Grid, Avatar, Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ReceiptLong as ReceiptLongIcon,
  CalendarMonth as CalendarMonthIcon,
  Assignment as AssignmentIcon,
  Payments as PaymentsIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_PPH_DATA = [
  {
    id: 1,
    nik: 'D6220297',
    name: 'MEIDYANTO',
    employeeType: 'PKWT',
    division: 'HRD, Sales Governance & APP',
    unitName: 'APP Jakarta',
    position: 'Administrasi',
    branch: 'JAKARTA',
    periodeStart: '01/08/2026',
    periodeEnd: '31/08/2026',
    methodePajak: 'Gross',
    komponenProject: '',
    sumberAcuanPajak: 'Master Employee (Override)',
    pendapatanBulanan: 10080000,
    pph21BulanIni: 199600
  },
  {
    id: 2,
    nik: 'D6250001',
    name: 'D4V4I0PRX',
    employeeType: 'MAGANG',
    division: 'Operational',
    unitName: 'Sysmex',
    position: 'Cook 3',
    branch: 'BOGOR',
    periodeStart: '01/08/2026',
    periodeEnd: '31/08/2026',
    methodePajak: 'Net',
    komponenProject: 'Net',
    sumberAcuanPajak: 'Master Client',
    pendapatanBulanan: 9828462,
    pph21BulanIni: 231256
  }
];

export default function ReportPph() {
  const [dataList, setDataList] = useState(INITIAL_PPH_DATA);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterDivision, setFilterDivision] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('ASCENDING');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (msg, sev = 'success') => {
    setSnackbar({ open: true, message: msg, severity: sev });
  };

  const divisions = Array.from(new Set(dataList.map(r => r.division).filter(Boolean)));

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterDivision('');
    setFilterStartDate('');
    setFilterEndDate('');
    showSnackbar('Filter berhasil di-reset', 'info');
  };

  const handleExport = () => {
    showSnackbar('Export Rekapitulasi PPH 21 berhasil diunduh!', 'success');
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

  // Total Summary
  const totalEmployees = filteredData.length;
  const totalPendapatan = filteredData.reduce((sum, item) => sum + item.pendapatanBulanan, 0);
  const totalPph21 = filteredData.reduce((sum, item) => sum + item.pph21BulanIni, 0);
  const avgPendapatan = totalEmployees > 0 ? Math.round(totalPendapatan / totalEmployees) : 0;

  // Compact columns (8 key columns)
  const columns = [
    { 
      id: 'nik', 
      label: 'NIK', 
      width: '95px',
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
      label: 'Nama Karyawan', 
      headerRender: () => renderSortableHeader('Nama', 'name'), 
      render: (row) => (
        <Tooltip title={row.name} arrow>
          <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
            {row.name}
          </Typography>
        </Tooltip>
      ) 
    },
    { 
      id: 'employeeType', 
      label: 'Tipe', 
      width: '80px',
      headerRender: () => renderSortableHeader('Tipe', 'employeeType'),
      render: (row) => <Chip label={row.employeeType} size="small" sx={{ fontWeight: 600, borderRadius: '6px', fontSize: '0.72rem' }} />
    },
    { 
      id: 'division', 
      label: 'Divisi', 
      headerRender: () => renderSortableHeader('Divisi', 'division'),
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
      headerRender: () => renderSortableHeader('Unit Name', 'unitName'),
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
      headerRender: () => renderSortableHeader('Posisi', 'position'),
      render: (row) => (
        <Tooltip title={row.position || '-'} arrow>
          <Typography sx={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
            {row.position || '-'}
          </Typography>
        </Tooltip>
      )
    },
    { id: 'branch', label: 'Branch', width: '85px', headerRender: () => renderSortableHeader('Branch', 'branch') },
    { 
      id: 'methodePajak', 
      label: 'Metode Pajak', 
      width: '100px',
      align: 'center',
      headerRender: () => renderSortableHeader('Metode', 'methodePajak'),
      render: (row) => (
        <Chip 
          label={row.methodePajak || 'Gross'} 
          size="small" 
          sx={{ 
            fontWeight: 700, 
            fontSize: '0.72rem',
            bgcolor: 'primary.50',
            color: 'primary.main',
            borderRadius: '6px'
          }} 
        />
      )
    }
  ];

  // Collapsible Minimal Linear View
  const renderCollapsibleRow = (row) => {
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

          <Chip
            label={`Metode: ${row.methodePajak || 'Gross'}`}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
          />
        </Box>

        {/* 3 Minimal Linear Columns */}
        <Grid container spacing={2.5}>
          {/* Column 1: Periode & Parameter Pajak */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <CalendarMonthIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Periode & Acuan Pajak
                </Typography>
              </Box>

              <Stack spacing={1.25}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    PERIODE PAJAK
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.periodeStart} s/d {row.periodeEnd}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    SUMBER ACUAN PAJAK
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.sumberAcuanPajak || 'Master Employee'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Komponen Project
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                    {row.komponenProject || '-'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 2: Detail Pendapatan */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <PaymentsIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Pendapatan Bulanan
                </Typography>
              </Box>

              <Stack spacing={1.25}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Penghasilan Bruto (Bulan ini)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace', fontSize: '0.88rem' }}>
                    Rp {row.pendapatanBulanan?.toLocaleString('id-ID') || 0}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    DIVISI & UNIT KERJA
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.division} - {row.unitName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    POSISI & CABANG
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.position} ({row.branch})
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 3: Kalkulasi PPh 21 Banner */}
          <Grid item xs={12} sm={12} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <ReceiptLongIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Potongan PPh 21
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    POTONGAN PPH 21 (BULAN INI)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444', fontFamily: 'monospace', letterSpacing: '-0.02em', fontSize: '1.25rem' }}>
                    Rp {row.pph21BulanIni?.toLocaleString('id-ID') || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', mt: 0.2 }}>
                    Kalkulasi otomatis berdasarkan skema TER PPh 21
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
          <AssessmentIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Report PPh 21 Karyawan
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Tinjau rekapitulasi perhitungan pendapatan bruto dan potongan PPh Pasal 21 seluruh karyawan
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
                Total Pendapatan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                Rp {totalPendapatan.toLocaleString('id-ID')}
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
              <ReceiptLongIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total PPH 21
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444' }}>
                Rp {totalPph21.toLocaleString('id-ID')}
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
              <AccountBalanceWalletIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Rata-rata Pendapatan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                Rp {avgPendapatan.toLocaleString('id-ID')}
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
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 0.5, display: 'block' }}>
              Periode Start - End
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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

          <Grid item xs={12} md={2}>
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
          Menampilkan {filteredData.length} baris rekapitulasi data PPh 21
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
          EXPORT REKAP PPH 21
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
          renderCollapsibleRow={renderCollapsibleRow}
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
