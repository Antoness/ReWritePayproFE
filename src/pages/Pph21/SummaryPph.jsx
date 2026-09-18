import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button,
  Stack, Chip, Grid, Divider, Tooltip, IconButton
} from '@mui/material';
import {
  Summarize as SummarizeIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomModal from '../../components/Common/CustomModal';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const generateSummaryData = () => {
  return [
    {
      id: 1,
      no: 1,
      kodeObjekPajak: '21-401-01',
      keterangan: 'PPh 21 Final',
      totalBruto: 200000,
      totalPph21: 0,
      totalPph26: 0
    },
    {
      id: 2,
      no: 2,
      kodeObjekPajak: 'BPA1 (21-100-01)',
      keterangan: 'PPh 21 Pegawai Tetap BPA1',
      totalBruto: 50154983,
      totalPph21: -4388241,
      totalPph26: 0
    },
    {
      id: 3,
      no: 3,
      kodeObjekPajak: 'Total',
      keterangan: 'Total Seluruh Objek Pajak',
      totalBruto: 50354983,
      totalPph21: -4388241,
      totalPph26: 0
    }
  ];
};

const INITIAL_SUMMARY_DATA = generateSummaryData();

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function SummaryPph() {
  const { user } = useSelector((state) => state.auth);

  // States
  const [dataList, setDataList] = useState(INITIAL_SUMMARY_DATA);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filters
  const [filterMonth, setFilterMonth] = useState('December');
  const [filterYear, setFilterYear] = useState('2026');

  // Detail Modal States
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalMonth, setModalMonth] = useState('December');
  const [modalYear, setModalYear] = useState('2026');

  const DETAIL_TRANSAKSI_DUMMY = [
    { id: 1, nik: 'D0000331', idNumber: '', name: 'Pegawai Dummy 331', division: 'Business Development', unit: 'Laku Pandai', kodeObjek: 'BPA1 (21-100-01)', bruto: 1417357, pph21: -322032 },
    { id: 2, nik: 'D8260007', idNumber: '3271021511830011', name: 'DEWABRATA', division: 'Juara Coding', unit: 'Juara Coding', kodeObjek: 'BPA1 (21-100-01)', bruto: 9000000, pph21: -725675 },
    { id: 3, nik: 'D8230429', idNumber: '3404106610920002', name: 'PUTRI ADHILA INAS MAWARNI', division: 'Manajemen Risiko & Int Audit', unit: 'Internal Audit', kodeObjek: 'BPA1 (21-100-01)', bruto: 10017416, pph21: -783484 },
    { id: 4, nik: 'D6211412', idNumber: '3276051504970008', name: 'JODDY WIRABATAVRI', division: 'Motivational', unit: 'Motivational', kodeObjek: 'BPA1 (21-100-01)', bruto: 5590610, pph21: -144090 },
    { id: 5, nik: 'D8210663', idNumber: '3173076009941002', name: 'POPI ANGRAINI', division: 'Tax, Accounting & Biz Plan', unit: 'Accounting', kodeObjek: 'BPA1 (21-100-01)', bruto: 12064800, pph21: -1447776 },
    { id: 6, nik: 'D8231214', idNumber: '3171086207980001', name: 'MAMTA SARTIKA', division: 'Tax, Accounting & Biz Plan', unit: 'Accounting', kodeObjek: 'BPA1 (21-100-01)', bruto: 12064800, pph21: -965184 }
  ];

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRowClick = (row) => {
    if (row.kodeObjekPajak === 'Total') return;
    setSelectedRow(row);
    setDetailModalOpen(true);
  };

  const handleExport = () => {
    showSnackbar('Ekspor Summary PPH berhasil diinisialisasi!', 'success');
  };

  const handleModalExport = () => {
    showSnackbar('Ekspor Detail Transaksi berhasil!', 'success');
  };

  // Calculations for KPI Cards
  const totalItems = dataList.filter(r => r.kodeObjekPajak !== 'Total').length;
  const totalBrutoRow = dataList.find(r => r.kodeObjekPajak === 'Total') || { totalBruto: 0, totalPph21: 0, totalPph26: 0 };

  // Columns configuration
  const columns = [
    { id: 'no', label: 'No', width: '60px', align: 'center' },
    { 
      id: 'kodeObjekPajak', 
      label: 'Kode Objek Pajak',
      render: (row) => (
        <Typography sx={{ fontWeight: row.kodeObjekPajak === 'Total' ? 800 : 700, color: row.kodeObjekPajak === 'Total' ? 'primary.main' : 'text.primary' }}>
          {row.kodeObjekPajak}
        </Typography>
      )
    },
    { id: 'keterangan', label: 'Keterangan' },
    {
      id: 'totalBruto',
      label: 'Total Bruto',
      align: 'right',
      render: (row) => (
        <Typography sx={{ fontWeight: row.kodeObjekPajak === 'Total' ? 800 : 600, color: '#10b981' }}>
          Rp {row.totalBruto.toLocaleString('id-ID')}
        </Typography>
      )
    },
    {
      id: 'totalPph21',
      label: 'Total PPh 21',
      align: 'right',
      render: (row) => (
        <Typography sx={{ 
          color: row.totalPph21 < 0 ? '#ef4444' : 'text.primary', 
          fontWeight: row.kodeObjekPajak === 'Total' ? 800 : 600 
        }}>
          Rp {row.totalPph21.toLocaleString('id-ID')}
        </Typography>
      )
    },
    {
      id: 'totalPph26',
      label: 'Total PPh 26',
      align: 'right',
      render: (row) => (
        <Typography sx={{ fontWeight: row.kodeObjekPajak === 'Total' ? 800 : 500 }}>
          Rp {row.totalPph26.toLocaleString('id-ID')}
        </Typography>
      )
    },
    {
      id: 'actions',
      label: 'Detail',
      align: 'center',
      render: (row) => row.kodeObjekPajak !== 'Total' ? (
        <Tooltip title="Lihat Detail Transaksi">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(row);
            }}
            sx={{
              color: '#0284c7',
              bgcolor: 'rgba(2, 132, 199, 0.08)',
              '&:hover': { bgcolor: 'rgba(2, 132, 199, 0.16)' }
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null
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
          <SummarizeIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'text.primary' }}>
            Rekapitulasi Bruto dan PPh
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Ringkasan rekapitulasi nominal bruto dan pemotongan PPh pasal 21/26 per kode objek pajak
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
              <CategoryIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Jumlah Objek Pajak
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {totalItems} Objek
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
                Rp {totalBrutoRow.totalBruto.toLocaleString('id-ID')}
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
                Total PPH 21
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ef4444' }}>
                Rp {Math.abs(totalBrutoRow.totalPph21).toLocaleString('id-ID')}
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
              <SummarizeIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Total PPH 26
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#f59e0b' }}>
                Rp {totalBrutoRow.totalPph26.toLocaleString('id-ID')}
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <SearchableSelect
              label="Bulan"
              value={filterMonth}
              onChange={setFilterMonth}
              options={MONTH_NAMES.map(m => ({ value: m, label: m }))}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
          Klik pada baris data untuk melihat rincian transaksi per karyawan
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            EXPORT REKAPITULASI
          </Button>
        </Box>
      </Box>

      {/* 5. Data Table */}
      <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }} elevation={0}>
        <DataTable
          columns={columns}
          data={dataList}
          loading={false}
          page={page}
          pageSize={pageSize}
          totalElements={dataList.length}
          totalPages={Math.ceil(dataList.length / pageSize) || 1}
          onPageChange={setPage}
          onPageSizeChange={(sz) => {
            setPageSize(sz);
            setPage(1);
          }}
          onRowClick={handleRowClick}
        />
      </Paper>

      {/* 6. Detail Transaksi Modal */}
      <CustomModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={`Detail Transaksi - ${selectedRow?.kodeObjekPajak || ''}`}
        maxWidth="lg"
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              onClick={handleModalExport}
              sx={{
                bgcolor: '#0f172a',
                '&:hover': { bgcolor: '#1e293b' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700
              }}
            >
              Export Detail
            </Button>
            <Button
              variant="outlined"
              onClick={() => setDetailModalOpen(false)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Tutup
            </Button>
          </Box>
        }
      >
        {selectedRow && (
          <Stack spacing={2.5}>
            {/* Modal filters */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <SearchableSelect
                  label="Bulan Transaksi"
                  value={modalMonth}
                  onChange={setModalMonth}
                  options={MONTH_NAMES.map(m => ({ value: m, label: m }))}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <SearchableSelect
                  label="Tahun Transaksi"
                  value={modalYear}
                  onChange={setModalYear}
                  options={[
                    { value: '2026', label: '2026' },
                    { value: '2025', label: '2025' },
                    { value: '2024', label: '2024' }
                  ]}
                />
              </Grid>
            </Grid>

            {/* Detail Data Table */}
            <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }} elevation={0}>
              <DataTable
                columns={[
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
                  { id: 'idNumber', label: 'No KTP' },
                  {
                    id: 'name',
                    label: 'Nama Karyawan',
                    render: (row) => <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{row.name}</Typography>
                  },
                  { id: 'division', label: 'Divisi' },
                  { id: 'unit', label: 'Unit' },
                  { id: 'kodeObjek', label: 'Kode Objek' },
                  {
                    id: 'bruto',
                    label: 'Bruto',
                    align: 'right',
                    render: (row) => (
                      <Typography sx={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                        Rp {row.bruto.toLocaleString('id-ID')}
                      </Typography>
                    )
                  },
                  { 
                    id: 'pph21', 
                    label: 'PPh 21', 
                    align: 'right', 
                    render: (row) => (
                      <Typography sx={{ color: row.pph21 < 0 ? '#ef4444' : '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                        Rp {row.pph21.toLocaleString('id-ID')}
                      </Typography>
                    )
                  }
                ]}
                data={DETAIL_TRANSAKSI_DUMMY}
                loading={false}
                page={1}
                pageSize={10}
                totalElements={DETAIL_TRANSAKSI_DUMMY.length}
                totalPages={1}
                onPageChange={() => {}}
                onPageSizeChange={() => {}}
                showPagination={false}
              />
            </Paper>
          </Stack>
        )}
      </CustomModal>

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
