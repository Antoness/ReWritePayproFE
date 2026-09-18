import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Grid, Chip, Checkbox, Tooltip, IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  WorkHistory as WorkHistoryIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_LEMBUR_DATA = [
  {
    id: 1,
    nik: 'D8200056',
    name: 'VILLIANO C V',
    periode: 'Mei 2026',
    division: 'SDM',
    unitName: 'SDM',
    position: 'Supervisor',
    branch: 'JAKARTA',
    employeeType: 'PKWT'
  },
  {
    id: 2,
    nik: 'D8240010',
    name: 'ADITTYA MAULANA PUTRA',
    periode: 'Mei 2026',
    division: 'Operational',
    unitName: 'Sysmex',
    position: 'Collector',
    branch: 'BANDUNG',
    employeeType: 'PKWT'
  },
  {
    id: 3,
    nik: 'F1100002',
    name: 'JENS VALERY OKTAVIANI MNAHONIN',
    periode: 'Mei 2026',
    division: 'BCA',
    unitName: 'Telemarketing',
    position: 'DSR',
    branch: 'JAKARTA',
    employeeType: 'MITRA'
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function LemburEntry() {
  const { user } = useSelector((state) => state.auth);

  // States
  const [dataList, setDataList] = useState(INITIAL_LEMBUR_DATA);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterMonth, setFilterMonth] = useState('May');
  const [filterYear, setFilterYear] = useState('2026');

  // Dialogs & Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: () => {} });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSearch = () => {
    setPage(1);
    showSnackbar('Data lembur berhasil difilter!', 'success');
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilterUnit('');
    setFilterPosition('');
    setFilterBranch('');
    setFilterEmployeeType('');
    setFilterMonth('May');
    setFilterYear('2026');
    setPage(1);
  };

  const handleDownloadAll = () => {
    showSnackbar('Download Report All berhasil diproses!', 'success');
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Pilih data lembur yang ingin dihapus!', 'warning');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Hapus Record Lembur',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data lembur terpilih?`,
      onConfirm: () => {
        setDataList(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
        setConfirmDialog(c => ({ ...c, open: false }));
        showSnackbar('Data lembur terpilih berhasil dihapus!', 'success');
      }
    });
  };

  const handleDeleteRow = (row) => {
    setConfirmDialog({
      open: true,
      title: 'Hapus Record Lembur',
      message: `Apakah Anda yakin ingin menghapus data lembur untuk ${row.name}?`,
      onConfirm: () => {
        setDataList(prev => prev.filter(item => item.id !== row.id));
        setSelectedIds(prev => prev.filter(id => id !== row.id));
        setConfirmDialog(c => ({ ...c, open: false }));
        showSnackbar('Data lembur berhasil dihapus!', 'success');
      }
    });
  };

  const triggerPrintPdf = (employee) => {
    const printWindow = window.open('', '_blank', 'width=1100,height=800');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Perhitungan Lembur - ${employee.name}</title>
          <style>
            @media print {
              body { margin: 0; padding: 15px; }
              @page { size: landscape; margin: 10mm; }
            }
            body { 
              font-family: Arial, sans-serif; 
              color: #000; 
              padding: 20px; 
              font-size: 11px;
              line-height: 1.4;
            }
            .header-sec { margin-bottom: 15px; }
            .company { font-weight: bold; font-size: 13px; margin-bottom: 3px; }
            .title { font-weight: bold; font-size: 13px; margin-bottom: 5px; }
            .meta-info { font-size: 11px; line-height: 1.5; margin-bottom: 15px; }
            
            table.lembur-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            table.lembur-table th, table.lembur-table td {
              border: 1px solid #000;
              padding: 4px 6px;
              font-size: 10px;
              text-align: center;
            }
            table.lembur-table th {
              font-weight: bold;
              background-color: #ffffff;
            }
            .align-l { text-align: left !important; }
            .align-r { text-align: right !important; }
            
            .calc-footer {
              margin-top: 15px;
              margin-bottom: 25px;
              font-size: 11px;
              line-height: 1.6;
            }
            .calc-row {
              display: flex;
              width: 400px;
            }
            .calc-lbl {
              width: 180px;
              font-weight: bold;
            }
            .calc-val {
              font-weight: bold;
            }

            .sig-table {
              width: 250px;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .sig-table th, .sig-table td {
              border: 1px solid #000;
              text-align: center;
              padding: 4px;
              font-size: 10px;
            }
            .sig-table th {
              background-color: #000000;
              color: #ffffff;
              font-weight: bold;
            }
            .sig-box {
              height: 45px;
              vertical-align: bottom;
              font-weight: bold;
              padding-bottom: 5px !important;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header-sec">
            <div class="company">PT DANAMAS INSAN KREASI ANDALAN</div>
            <div class="title">Perhitungan Lembur</div>
          </div>

          <div class="meta-info">
            <strong>Periode :</strong> ${employee.periode.toLowerCase()}<br/>
            <strong>NIK/Nama Pegawai :</strong> ${employee.nik} - ${employee.name.toUpperCase()}<br/>
            <strong>Jabatan :</strong> ${employee.position}<br/>
            <strong>Dept :</strong> ${employee.division} / <strong>Section :</strong> EDC Machine
          </div>

          <table class="lembur-table">
            <thead>
              <tr>
                <th rowspan="2" style="width: 80px;">Tgl Lembur</th>
                <th rowspan="2" style="width: 50px;">Jenis Hari</th>
                <th colspan="3">Waktu Lembur</th>
                <th colspan="7">Perhitungan Lembur</th>
                <th rowspan="2" style="width: 40px;">Var1</th>
                <th rowspan="2" style="width: 40px;">Var2</th>
                <th rowspan="2" style="width: 40px;">Var3</th>
                <th rowspan="2" style="width: 80px;">No.Referensi</th>
                <th rowspan="2" style="width: 100px;">Keterangan</th>
              </tr>
              <tr>
                <th style="width: 50px;">Mulai</th>
                <th style="width: 50px;">Selesai</th>
                <th style="width: 50px;">Jlh Jam</th>
                <th style="width: 50px;">Break</th>
                <th style="width: 50px;">Lama</th>
                <th style="width: 40px;">1.5 X</th>
                <th style="width: 40px;">2 X</th>
                <th style="width: 40px;">3 X</th>
                <th style="width: 40px;">4 X</th>
                <th style="width: 50px;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>02/02/2026</td>
                <td>LBR55</td>
                <td>21:00</td>
                <td>23:00</td>
                <td>1.00</td>
                <td>01:00</td>
                <td>1.00</td>
                <td>0.00</td>
                <td>2.00</td>
                <td>0.00</td>
                <td>0.00</td>
                <td>2.00</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>03/02/2026</td>
                <td>LBR56</td>
                <td>21:00</td>
                <td>23:00</td>
                <td>1.00</td>
                <td>01:00</td>
                <td>1.00</td>
                <td>0.00</td>
                <td>2.00</td>
                <td>0.00</td>
                <td>0.00</td>
                <td>2.00</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>04/02/2026</td>
                <td>LBR57</td>
                <td>21:00</td>
                <td>23:00</td>
                <td>1.00</td>
                <td>01:00</td>
                <td>1.00</td>
                <td>0.00</td>
                <td>2.00</td>
                <td>0.00</td>
                <td>0.00</td>
                <td>2.00</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr style="font-weight: bold;">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>3.00</td>
                <td>3.00</td>
                <td>0.00</td>
                <td>6.00</td>
                <td>0.00</td>
                <td>0.00</td>
                <td>6.00</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div class="calc-footer">
            <div class="calc-row">
              <div class="calc-lbl">Tarif Lembur</div>
              <div>: &nbsp; <strong>11560.69</strong></div>
            </div>
            <div class="calc-row">
              <div class="calc-lbl">Perhitungan Nilai Lembur</div>
              <div>: &nbsp; <strong>11560.69 &nbsp; &nbsp; &nbsp; &nbsp; x 6.00 &nbsp; &nbsp; &nbsp; = &nbsp; Rp.69,364</strong></div>
            </div>
          </div>

          <table class="sig-table">
            <thead>
              <tr>
                <th style="width: 33%;">Dibuat</th>
                <th style="width: 33%;">Disetujui</th>
                <th style="width: 33%;">Diterima</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="sig-box">SPV HRD</td>
                <td class="sig-box"></td>
                <td class="sig-box"></td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredData = dataList.filter(row => {
    if (searchQuery && !row.name.toLowerCase().includes(searchQuery.toLowerCase()) && !row.nik.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterUnit && row.unitName !== filterUnit) return false;
    if (filterPosition && row.position !== filterPosition) return false;
    if (filterBranch && row.branch !== filterBranch) return false;
    if (filterEmployeeType && row.employeeType !== filterEmployeeType) return false;
    return true;
  });

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

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
    { id: 'name', label: 'Nama Pegawai', render: (row) => <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{row.name}</Typography> },
    { id: 'periode', label: 'Periode Lembur' },
    { id: 'division', label: 'Division' },
    { id: 'unitName', label: 'Unit Name' },
    { id: 'position', label: 'Position' },
    { id: 'branch', label: 'Branch' },
    { id: 'employeeType', label: 'Tipe', render: (row) => <Chip label={row.employeeType} size="small" sx={{ fontWeight: 600, borderRadius: '6px' }} /> },
    {
      id: 'actions',
      label: 'Aksi',
      align: 'center',
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="Print Slip Lembur">
            <IconButton size="small" onClick={() => triggerPrintPdf(row)} sx={{ color: '#0284c7', bgcolor: '#f0f9ff', '&:hover': { bgcolor: '#e0f2fe' }, borderRadius: '8px' }}>
              <PrintIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteRow(row)} sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' }, borderRadius: '8px' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
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
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 16px -4px rgba(245, 158, 11, 0.4)'
        }}>
          <AccessTimeIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Rekap Lembur Karyawan
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Kelola data perhitungan, rekapitulasi, cetak slip dan persetujuan lembur bulanan
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
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Pegawai Lembur</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{filteredData.length} Orang</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
              <WorkHistoryIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Jam Lembur</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#d97706' }}>18.00 Jam</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <CheckCircleIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Periode</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>{filterMonth} {filterYear}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <AccessTimeIcon sx={{ fontSize: 24 }} />
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
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Cari NIK atau Nama Pegawai..."
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
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
            <SearchableSelect
              label="Unit Name"
              options={[
                { value: '', label: 'Semua Unit' },
                { value: 'SDM', label: 'SDM' },
                { value: 'Sysmex', label: 'Sysmex' },
                { value: 'Telemarketing', label: 'Telemarketing' }
              ]}
              value={filterUnit}
              onChange={(val) => setFilterUnit(val)}
              placeholder="Pilih Unit"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SearchableSelect
              label="Position"
              options={[
                { value: '', label: 'Semua Posisi' },
                { value: 'Supervisor', label: 'Supervisor' },
                { value: 'Collector', label: 'Collector' },
                { value: 'DSR', label: 'DSR' }
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
                { value: 'JAKARTA', label: 'JAKARTA' },
                { value: 'BANDUNG', label: 'BANDUNG' }
              ]}
              value={filterBranch}
              onChange={(val) => setFilterBranch(val)}
              placeholder="Pilih Branch"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Month"
              options={MONTH_NAMES.map(m => ({ value: m, label: m }))}
              value={filterMonth}
              onChange={(val) => setFilterMonth(val)}
              placeholder="Pilih Bulan"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <SearchableSelect
              label="Year"
              options={['2026', '2025'].map(y => ({ value: y, label: y }))}
              value={filterYear}
              onChange={(val) => setFilterYear(val)}
              placeholder="Pilih Tahun"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Action Toolbar Directly Above Table */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: '14px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }} elevation={0}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Data Rekapitulasi Lembur
          </Typography>
          <Chip 
            label={`${selectedIds.length} data dipilih`} 
            color={selectedIds.length > 0 ? "primary" : "default"}
            size="small" 
            sx={{ fontWeight: 700, borderRadius: '6px' }} 
          />
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            onClick={handleDownloadAll}
            startIcon={<ExportIcon />}
            sx={{
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              height: '40px'
            }}
          >
            DOWNLOAD REPORT ALL
          </Button>

          <Button
            variant="contained"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            startIcon={<DeleteIcon />}
            sx={{
              bgcolor: '#ef4444',
              '&:hover': { bgcolor: '#dc2626' },
              borderRadius: '10px',
              fontWeight: 700,
              boxShadow: 'none',
              height: '40px'
            }}
          >
            DELETE DATA
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

      {/* Global Notifications */}
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
