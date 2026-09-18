import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, RadioGroup, FormControlLabel, Radio, Grid, Tooltip, IconButton,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Calculate as CalculateIcon,
  AddCard as AddCardIcon,
  Info as InfoIcon,
  RemoveCircle as RemoveCircleIcon,
  RequestQuote as RequestQuoteIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';

const INITIAL_PINJAMAN_DATA = [
  {
    id: 1,
    nik: 'D8221514',
    name: 'RACHMANDO',
    tanggalPinjaman: '01 December 2022',
    jumlahPinjaman: 2000000,
    lamaPinjaman: '5 Bulan',
    cicilanMulai: '15 January 2023',
    cicilanBerakhir: '15 May 2023'
  },
  {
    id: 2,
    nik: 'D8221514',
    name: 'RACHMANDO',
    tanggalPinjaman: '10 November 2023',
    jumlahPinjaman: 6000000,
    lamaPinjaman: '4 Bulan',
    cicilanMulai: '10 December 2023',
    cicilanBerakhir: '10 March 2024'
  },
  {
    id: 3,
    nik: 'D8200312',
    name: 'FITRIYADI',
    tanggalPinjaman: '12 February 2024',
    jumlahPinjaman: 2000000,
    lamaPinjaman: '12 Bulan',
    cicilanMulai: '29 February 2024',
    cicilanBerakhir: '29 January 2025'
  },
  {
    id: 4,
    nik: 'D6230616',
    name: 'FIKRI MAHMUDI',
    tanggalPinjaman: '13 May 2024',
    jumlahPinjaman: 2000000,
    lamaPinjaman: '12 Bulan',
    cicilanMulai: '10 June 2024',
    cicilanBerakhir: '10 May 2025'
  },
  {
    id: 5,
    nik: 'D6230658',
    name: 'REZKY KARUNIA',
    tanggalPinjaman: '13 May 2024',
    jumlahPinjaman: 5000000,
    lamaPinjaman: '12 Bulan',
    cicilanMulai: '10 June 2024',
    cicilanBerakhir: '10 May 2025'
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PinjamanEntry() {
  const { user } = useSelector((state) => state.auth);

  // States
  const [dataList, setDataList] = useState(INITIAL_PINJAMAN_DATA);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Form inputs
  const [tanggalPinjaman, setTanggalPinjaman] = useState('');
  const [nik, setNik] = useState('');
  const [namaPegawai, setNamaPegawai] = useState('');
  const [alamat, setAlamat] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const [persetujuan, setPersetujuan] = useState('');
  const [jumlahPinjaman, setJumlahPinjaman] = useState('');
  const [jenisBunga, setJenisBunga] = useState('Flat');
  const [dikenakanBunga, setDikenakanBunga] = useState('Ya');
  const [lamaCicilan, setLamaCicilan] = useState('');
  const [cicilanMulaiBulan, setCicilanMulaiBulan] = useState('January');
  const [cicilanMulaiTahun, setCicilanMulaiTahun] = useState('2026');
  const [cicilanPokok, setCicilanPokok] = useState(600000);
  const [bungaPersen, setBungaPersen] = useState(5);

  // Perubahan Section States
  const [perubahanCicilanKe, setPerubahanCicilanKe] = useState(3);
  const [perubahanCicilanPokok, setPerubahanCicilanPokok] = useState(800000);

  // Simulation Dialog States
  const [simulasiModalOpen, setSimulasiModalOpen] = useState(false);
  const [simulasiRows, setSimulasiRows] = useState([]);

  // Detail Modal & Installments States
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPinjaman, setSelectedPinjaman] = useState(null);
  const [detailInstallments, setDetailInstallments] = useState([]);

  // Snack & Dialog
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: () => {} });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDetail = (row) => {
    setSelectedPinjaman(row);
    
    const totalPinjaman = row.jumlahPinjaman;
    const totalBulan = parseInt(row.lamaPinjaman) || 6;
    const rateBunga = Number(bungaPersen);

    const monthlyBunga = dikenakanBunga === 'Ya' ? Math.round((totalPinjaman * (rateBunga / 100)) / totalBulan) : 0;

    let startMonthIndex = MONTH_NAMES.indexOf(cicilanMulaiBulan);
    if (startMonthIndex === -1) startMonthIndex = 1; 
    let startYear = Number(cicilanMulaiTahun) || 2026;

    let sisa = totalPinjaman;
    const rows = [];

    for (let i = 1; i <= totalBulan; i++) {
      const curMonthIndex = (startMonthIndex + i - 1) % 12;
      const curYear = startYear + Math.floor((startMonthIndex + i - 1) / 12);
      const periodName = `${MONTH_NAMES[curMonthIndex]} ${curYear}`;

      let pokok = 0;
      if (i === totalBulan) {
        pokok = sisa;
      } else if (i < Number(perubahanCicilanKe)) {
        pokok = Number(cicilanPokok);
      } else {
        pokok = Number(perubahanCicilanPokok);
      }

      if (pokok > sisa) {
        pokok = sisa;
      }

      sisa = sisa - pokok;

      rows.push({
        no: i,
        periode: periodName,
        angsuranBunga: monthlyBunga,
        angsuranPokok: pokok,
        totalAngsuran: monthlyBunga + pokok,
        sisaPinjaman: sisa,
        status: 'Unpaid'
      });
    }

    setDetailInstallments(rows);
    setDetailModalOpen(true);
  };

  const handleToggleStatus = (index) => {
    setDetailInstallments(prev => prev.map((item, idx) => {
      if (idx === index) {
        return { ...item, status: item.status === 'Paid' ? 'Unpaid' : 'Paid' };
      }
      return item;
    }));
    showSnackbar('Status angsuran berhasil diupdate!', 'success');
  };

  const handleSimulasi = () => {
    if (!jumlahPinjaman || !lamaCicilan) {
      showSnackbar('Harap isi jumlah pinjaman dan lama cicilan untuk simulasi!', 'warning');
      return;
    }

    const totalPinjaman = Number(jumlahPinjaman);
    const totalBulan = Number(lamaCicilan);
    const rateBunga = Number(bungaPersen);

    const monthlyBunga = dikenakanBunga === 'Ya' ? Math.round((totalPinjaman * (rateBunga / 100)) / totalBulan) : 0;

    let startMonthIndex = MONTH_NAMES.indexOf(cicilanMulaiBulan);
    if (startMonthIndex === -1) startMonthIndex = 1;
    let startYear = Number(cicilanMulaiTahun) || 2026;

    let sisa = totalPinjaman;
    const rows = [];

    for (let i = 1; i <= totalBulan; i++) {
      const curMonthIndex = (startMonthIndex + i - 1) % 12;
      const curYear = startYear + Math.floor((startMonthIndex + i - 1) / 12);
      const periodName = `${MONTH_NAMES[curMonthIndex]} ${curYear}`;

      let pokok = 0;
      if (i === totalBulan) {
        pokok = sisa;
      } else if (i < Number(perubahanCicilanKe)) {
        pokok = Number(cicilanPokok);
      } else {
        pokok = Number(perubahanCicilanPokok);
      }

      if (pokok > sisa) {
        pokok = sisa;
      }

      sisa = sisa - pokok;

      rows.push({
        no: i,
        periode: periodName,
        angsuranBunga: monthlyBunga,
        angsuranPokok: pokok,
        totalAngsuran: monthlyBunga + pokok,
        sisaPinjaman: sisa
      });
    }

    setSimulasiRows(rows);
    setSimulasiModalOpen(true);
  };

  const handleProsesPinjam = () => {
    if (!nik || !namaPegawai || !jumlahPinjaman || !lamaCicilan || !tanggalPinjaman) {
      showSnackbar('Harap lengkapi semua field utama form pinjaman!', 'warning');
      return;
    }

    const formattedDate = new Date(tanggalPinjaman).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const newRow = {
      id: Date.now(),
      nik,
      name: namaPegawai,
      tanggalPinjaman: formattedDate,
      jumlahPinjaman: Number(jumlahPinjaman),
      lamaPinjaman: `${lamaCicilan} Bulan`,
      cicilanMulai: `${cicilanMulaiBulan || '15'} ${cicilanMulaiTahun || '2026'}`,
      cicilanBerakhir: 'Selesai'
    };

    setDataList([newRow, ...dataList]);
    showSnackbar('Pengajuan pinjaman berhasil diproses dan dicatat!', 'success');

    // Reset Form
    setNik('');
    setNamaPegawai('');
    setTanggalPinjaman('');
    setJumlahPinjaman('');
    setLamaCicilan('');
    setAlamat('');
    setKeterangan('');
  };

  const handleDeleteRow = (row) => {
    setConfirmDialog({
      open: true,
      title: 'Batalkan Pinjaman',
      message: `Apakah Anda yakin ingin membatalkan/menghapus record pinjaman untuk ${row.name}?`,
      onConfirm: () => {
        setDataList(prev => prev.filter(item => item.id !== row.id));
        setConfirmDialog(c => ({ ...c, open: false }));
        showSnackbar('Record pinjaman berhasil dihapus!', 'success');
      }
    });
  };

  const filteredData = dataList.filter(row => {
    if (searchQuery && !row.name.toLowerCase().includes(searchQuery.toLowerCase()) && !row.nik.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
  const totalPinjamanSum = filteredData.reduce((sum, item) => sum + item.jumlahPinjaman, 0);

  const columns = [
    { 
      id: 'nik', 
      label: 'NIK',
      render: (row) => (
        <Chip label={row.nik} size="small" sx={{ fontFamily: 'monospace', fontWeight: 700, bgcolor: 'action.hover', borderRadius: '6px' }} />
      )
    },
    { id: 'name', label: 'Nama Pegawai', render: (row) => <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{row.name}</Typography> },
    { id: 'tanggalPinjaman', label: 'Tanggal Pinjaman' },
    {
      id: 'jumlahPinjaman',
      label: 'Jumlah Pinjaman',
      align: 'right',
      render: (row) => (
        <Typography sx={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace', fontSize: '0.875rem' }}>
          Rp {row.jumlahPinjaman.toLocaleString('id-ID')}
        </Typography>
      )
    },
    { id: 'lamaPinjaman', label: 'Lama Pinjaman' },
    { id: 'cicilanMulai', label: 'Cicilan Mulai' },
    { id: 'cicilanBerakhir', label: 'Cicilan Berakhir' },
    {
      id: 'actions',
      label: 'Aksi',
      align: 'center',
      render: (row) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="Detail Simulasi & Cicilan">
            <IconButton size="small" onClick={() => handleOpenDetail(row)} sx={{ color: '#f59e0b', bgcolor: '#fffbeb', '&:hover': { bgcolor: '#fef3c7' }, borderRadius: '8px' }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Batalkan Pinjaman">
            <IconButton size="small" onClick={() => handleDeleteRow(row)} sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' }, borderRadius: '8px' }}>
              <RemoveCircleIcon fontSize="small" />
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
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 8px 16px -4px rgba(16, 185, 129, 0.4)'
        }}>
          <RequestQuoteIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Pinjaman & Potongan Cicilan
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Kelola pengajuan pinjaman, kalkulasi bunga, simulasi angsuran dan integrasi potongan payroll
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
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Peminjam</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>{filteredData.length} Pegawai</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <MonetizationOnIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Nominal Pinjaman</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                Rp {totalPinjamanSum.toLocaleString('id-ID')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Rata-rata Lama Pinjaman</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#d97706' }}>8.6 Bulan</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2 }} elevation={0}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <CheckCircleIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Payroll</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>Auto-Deduct Aktif</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* DOUBLE INPUT CARDS */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Left Side Form Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', height: '100%' }} elevation={0}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', mb: 2.5 }}>
              Informasi Pegawai
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>Tanggal Pinjaman</Typography>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  value={tanggalPinjaman}
                  onChange={(e) => setTanggalPinjaman(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>NIK Pegawai</Typography>
                <TextField
                  placeholder="NIK Karyawan..."
                  size="small"
                  fullWidth
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>Nama Pegawai</Typography>
                <TextField
                  placeholder="Nama Lengkap Karyawan..."
                  size="small"
                  fullWidth
                  value={namaPegawai}
                  onChange={(e) => setNamaPegawai(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary', mt: 1 }}>Alamat</Typography>
                <TextField
                  placeholder="Alamat lengkap..."
                  multiline
                  rows={2}
                  size="small"
                  fullWidth
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary', mt: 1 }}>Keterangan</Typography>
                <TextField
                  placeholder="Keterangan keperluan pinjaman..."
                  multiline
                  rows={2}
                  size="small"
                  fullWidth
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Side Form Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', height: '100%' }} elevation={0}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', mb: 2.5 }}>
              Parameter Pinjaman & Bunga
            </Typography>
            <Stack spacing={1.8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>Persetujuan</Typography>
                <TextField
                  placeholder="Nama Penyetuju / SPV..."
                  size="small"
                  fullWidth
                  value={persetujuan}
                  onChange={(e) => setPersetujuan(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>Jumlah Pinjaman</Typography>
                <TextField
                  type="number"
                  placeholder="Contoh: 5000000"
                  size="small"
                  fullWidth
                  value={jumlahPinjaman}
                  onChange={(e) => setJumlahPinjaman(e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>Jenis Bunga</Typography>
                <Box sx={{ flex: 1 }}>
                  <SearchableSelect
                    options={[
                      { value: 'Flat', label: 'Flat / Bunga Tetap' },
                      { value: 'Anuitas', label: 'Anuitas' }
                    ]}
                    value={jenisBunga}
                    onChange={(val) => setJenisBunga(val)}
                    placeholder="Pilih Jenis Bunga"
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>Dikenakan Bunga</Typography>
                <RadioGroup row value={dikenakanBunga} onChange={(e) => setDikenakanBunga(e.target.value)}>
                  <FormControlLabel value="Ya" control={<Radio size="small" />} label="Ya" />
                  <FormControlLabel value="Tidak" control={<Radio size="small" />} label="Tidak" />
                </RadioGroup>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>Lama Cicilan</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <TextField
                    type="number"
                    size="small"
                    placeholder="Contoh: 12"
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    value={lamaCicilan}
                    onChange={(e) => setLamaCicilan(e.target.value)}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Bulan</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>Cicilan Mulai</Typography>
                <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
                  <SearchableSelect
                    options={MONTH_NAMES.map(m => ({ value: m, label: m }))}
                    value={cicilanMulaiBulan}
                    onChange={(val) => setCicilanMulaiBulan(val)}
                    placeholder="Pilih Bulan"
                  />
                  <SearchableSelect
                    options={['2026', '2025', '2024'].map(y => ({ value: y, label: y }))}
                    value={cicilanMulaiTahun}
                    onChange={(val) => setCicilanMulaiTahun(val)}
                    placeholder="Pilih Tahun"
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '130px', fontSize: '0.85rem', fontWeight: 700, color: 'text.primary' }}>Bunga / Bulan</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <TextField
                    type="number"
                    size="small"
                    sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    value={bungaPersen}
                    onChange={(e) => setBungaPersen(e.target.value)}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>%</Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleSimulasi}
                  startIcon={<CalculateIcon />}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 700,
                    flex: 1,
                    color: '#3b82f6',
                    borderColor: '#93c5fd',
                    height: '42px'
                  }}
                >
                  Cek Simulasi
                </Button>
                <Button
                  variant="contained"
                  onClick={handleProsesPinjam}
                  startIcon={<AddCardIcon />}
                  sx={{
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' },
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 700,
                    flex: 1,
                    boxShadow: 'none',
                    height: '42px'
                  }}
                >
                  Proses Pinjam
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* FILTER & SEARCH TOOLBAR */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Cari NIK atau Nama Pegawai Peminjam..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={() => setPage(1)}
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
                onClick={() => { setSearchQuery(''); setPage(1); }}
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
        </Grid>
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

      {/* Simulasi Pinjaman Dialog */}
      <CustomModal 
        open={simulasiModalOpen} 
        onClose={() => setSimulasiModalOpen(false)} 
        title="Simulasi Jadwal Cicilan Pinjaman"
        maxWidth="md"
      >
        <DataTable
          columns={[
            { id: 'no', label: 'Bulan Ke-', width: '80px', align: 'center' },
            { id: 'periode', label: 'Periode Pembayaran' },
            { 
              id: 'angsuranBunga', 
              label: 'Angsuran Bunga', 
              align: 'right', 
              render: (row) => `Rp ${row.angsuranBunga.toLocaleString('id-ID')}` 
            },
            { 
              id: 'angsuranPokok', 
              label: 'Angsuran Pokok', 
              align: 'right', 
              render: (row) => `Rp ${row.angsuranPokok.toLocaleString('id-ID')}` 
            },
            { 
              id: 'totalAngsuran', 
              label: 'Total Cicilan', 
              align: 'right', 
              render: (row) => (
                <Typography sx={{ fontWeight: 700, color: '#10b981' }}>
                  Rp {row.totalAngsuran.toLocaleString('id-ID')}
                </Typography>
              )
            },
            { 
              id: 'sisaPinjaman', 
              label: 'Sisa Pokok Pinjaman', 
              align: 'right', 
              render: (row) => `Rp ${row.sisaPinjaman.toLocaleString('id-ID')}` 
            }
          ]}
          data={simulasiRows}
          loading={false}
          page={1}
          pageSize={100}
          totalElements={simulasiRows.length}
          totalPages={1}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          showPagination={false}
        />
      </CustomModal>

      {/* Detail Pinjaman Dialog */}
      <CustomModal 
        open={detailModalOpen} 
        onClose={() => setDetailModalOpen(false)} 
        title={`Rincian Angsuran - ${selectedPinjaman?.name} (${selectedPinjaman?.nik})`}
        maxWidth="md"
      >
        {selectedPinjaman && (
          <DataTable
            columns={[
              { id: 'no', label: 'Bulan Ke-', width: '80px', align: 'center' },
              { id: 'periode', label: 'Periode' },
              { 
                id: 'angsuranBunga', 
                label: 'Angsuran Bunga', 
                align: 'right', 
                render: (row) => `Rp ${row.angsuranBunga.toLocaleString('id-ID')}` 
              },
              { 
                id: 'angsuranPokok', 
                label: 'Angsuran Pokok', 
                align: 'right', 
                render: (row) => `Rp ${row.angsuranPokok.toLocaleString('id-ID')}` 
              },
              { 
                id: 'totalAngsuran', 
                label: 'Total Angsuran', 
                align: 'right', 
                render: (row) => (
                  <Typography sx={{ fontWeight: 700, color: '#10b981' }}>
                    Rp ${row.totalAngsuran.toLocaleString('id-ID')}
                  </Typography>
                )
              },
              { 
                id: 'sisaPinjaman', 
                label: 'Sisa Pinjaman', 
                align: 'right', 
                render: (row) => `Rp ${row.sisaPinjaman.toLocaleString('id-ID')}` 
              },
              {
                id: 'status',
                label: 'Status Bayar',
                align: 'center',
                render: (row, idx) => (
                  <Chip
                    label={row.status}
                    size="small"
                    onClick={() => handleToggleStatus(idx)}
                    sx={{
                      fontWeight: 800,
                      cursor: 'pointer',
                      bgcolor: row.status === 'Paid' ? '#ecfdf5' : '#fef3c7',
                      color: row.status === 'Paid' ? '#059669' : '#b45309',
                      borderRadius: '6px'
                    }}
                  />
                )
              }
            ]}
            data={detailInstallments}
            loading={false}
            page={1}
            pageSize={100}
            totalElements={detailInstallments.length}
            totalPages={1}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
            showPagination={false}
          />
        )}
      </CustomModal>

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
