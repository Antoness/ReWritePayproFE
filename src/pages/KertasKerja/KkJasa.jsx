import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Paper, Button, TextField, Stack, Chip, IconButton, Tooltip,
  InputAdornment, Grid, Divider, CircularProgress
} from '@mui/material';
import KkJasaIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import ResetIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/CloudUpload';
import RequestIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TemplateIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import * as XLSX from 'xlsx';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const MONTHS = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' }
];

const YEARS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
  { value: '2027', label: '2027' }
];

const SEED_KK_JASA_DATA = [
  {
    id: 1,
    bulan: 'May-2026',
    nikKtp: '1673071108000001',
    nikDika: 'D8242328',
    nama: 'ACHMAD FIKRI GUSTIYANDA',
    divisi: 'BCA',
    unitName: 'BCA IT Management Office',
    unitKerjaPenempatan: 'KANTOR PUSAT - IT MANAGEMENT OFFICE - 1697',
    posisiClient: 'MECHANICAL / TECHNICAL SUPPORT - P000023',
    kodeCabangPembayaran: '0998',
    rccPembayaran: '090',
    upahMinimum: 5210377,
    statusData: 'NEW',
    noPbb: '026/PPB-01/0998/22/2022',
    vendorName: 'PT DANAMAS INSAN KREASI ANDALAN',
    email: 'achmad.fikri@ptdika.com',
    kodePenempatan: 'P000023',
    kodeCabang: '0998',
    kodePosition: '1697',
    kodeSlid: '',
    manajemenFeePersen: '2',
    standarisasiUpahPersen: '135%',
    lokasiUnitKerja: 'BCA FORESTA / LANTAI 9',
    biayaOperasional: '',
    tglDitempatkan: '2025-01-01',
    tglMulaiPkwt: '2026-07-01',
    tglAkhirPkwt: '2026-12-31',
    nikTkadHabis: '',
    namaTkadHabis: '',
    tglHabisTkad: '',
    habisKontrak: '',
    keterangan: '',
    keteranganLainnya: '',
    upahPokokTahunLalu: 0,
    tunjanganSupervisorTahunLalu: 0
  },
  {
    id: 2,
    bulan: 'May-2026',
    nikKtp: '3276012303000002',
    nikDika: 'D8221795',
    nama: 'ACKBAR FADHILAH',
    divisi: 'BCA',
    unitName: 'BCA Urusan EDC Production',
    unitKerjaPenempatan: 'KANTOR PUSAT - EDC SERVICES - 1610',
    posisiClient: 'PENGELOLAAN E-CHANNEL-KP - P000020',
    kodeCabangPembayaran: '',
    rccPembayaran: '',
    upahMinimum: 5210377,
    statusData: 'NEW',
    noPbb: '027/PPB-01/0998/22/2022',
    vendorName: 'PT DANAMAS INSAN KREASI ANDALAN',
    email: 'ackbar.f@ptdika.com',
    kodePenempatan: 'P000020',
    kodeCabang: '',
    kodePosition: '1610',
    kodeSlid: '',
    manajemenFeePersen: '2',
    standarisasiUpahPersen: '135%',
    lokasiUnitKerja: 'KANTOR PUSAT EDC',
    biayaOperasional: '',
    tglDitempatkan: '2024-06-01',
    tglMulaiPkwt: '2025-06-01',
    tglAkhirPkwt: '2026-05-31',
    nikTkadHabis: '',
    namaTkadHabis: '',
    tglHabisTkad: '',
    habisKontrak: '',
    keterangan: '',
    keteranganLainnya: '',
    upahPokokTahunLalu: 0,
    tunjanganSupervisorTahunLalu: 0
  },
  {
    id: 3,
    bulan: 'May-2026',
    nikKtp: '3271032710000002',
    nikDika: 'D8250958',
    nama: 'ADAM NURFAUZAN SUBIYANTO',
    divisi: 'BCA',
    unitName: 'BCA Urusan Merchant & Cardholder Services',
    unitKerjaPenempatan: 'KANTOR PUSAT - URUSAN MERCHANT & CARDHOLDER SERVICES - 2350',
    posisiClient: 'ADMINISTRASI KANTOR PUSAT - P000005',
    kodeCabangPembayaran: '0998',
    rccPembayaran: '242',
    upahMinimum: 5210377,
    statusData: 'NEW',
    noPbb: '028/PPB-01/0998/22/2022',
    vendorName: 'PT DANAMAS INSAN KREASI ANDALAN',
    email: 'adam.nurfauzan@ptdika.com',
    kodePenempatan: 'P000005',
    kodeCabang: '0998',
    kodePosition: '2350',
    kodeSlid: '',
    manajemenFeePersen: '2',
    standarisasiUpahPersen: '135%',
    lokasiUnitKerja: 'BCA MERCHANT SERVICES',
    biayaOperasional: '',
    tglDitempatkan: '2025-02-01',
    tglMulaiPkwt: '2025-08-01',
    tglAkhirPkwt: '2026-07-31',
    nikTkadHabis: '',
    namaTkadHabis: '',
    tglHabisTkad: '',
    habisKontrak: '',
    keterangan: '',
    keteranganLainnya: '',
    upahPokokTahunLalu: 0,
    tunjanganSupervisorTahunLalu: 0
  },
  {
    id: 4,
    bulan: 'May-2026',
    nikKtp: '3173012009981008',
    nikDika: 'D8221605',
    nama: 'ADDHAM PASHA BAIHAQQI',
    divisi: 'BCA',
    unitName: 'BCA Application & User Acceptance Test Bureau C',
    unitKerjaPenempatan: 'KANTOR PUSAT - APPLICATION & USER ACCEPTANCE TEST BUREAU C - 2273',
    posisiClient: 'TESTER OTOMASI - GPOL - P000206',
    kodeCabangPembayaran: '0998',
    rccPembayaran: '231',
    upahMinimum: 5729876,
    statusData: 'NEW',
    noPbb: '029/PPB-01/0998/22/2022',
    vendorName: 'PT DANAMAS INSAN KREASI ANDALAN',
    email: 'addham.p@ptdika.com',
    kodePenempatan: 'P000206',
    kodeCabang: '0998',
    kodePosition: '2273',
    kodeSlid: '',
    manajemenFeePersen: '2',
    standarisasiUpahPersen: '135%',
    lokasiUnitKerja: 'BCA UAT BUREAU C',
    biayaOperasional: '',
    tglDitempatkan: '2024-03-01',
    tglMulaiPkwt: '2025-03-01',
    tglAkhirPkwt: '2026-02-28',
    nikTkadHabis: '',
    namaTkadHabis: '',
    tglHabisTkad: '',
    habisKontrak: '',
    keterangan: '',
    keteranganLainnya: '',
    upahPokokTahunLalu: 0,
    tunjanganSupervisorTahunLalu: 0
  },
  {
    id: 5,
    bulan: 'May-2026',
    nikKtp: '3275096210000007',
    nikDika: 'D8231675',
    nama: 'ADE AISYAH',
    divisi: 'BCA',
    unitName: 'BCA Experience Design Loan Operation & Credit Process Bureau B',
    unitKerjaPenempatan: '0',
    posisiClient: 'HELP DESK - P000022',
    kodeCabangPembayaran: '',
    rccPembayaran: '',
    upahMinimum: 5729876,
    statusData: 'NEW',
    noPbb: '030/PPB-01/0998/22/2022',
    vendorName: 'PT DANAMAS INSAN KREASI ANDALAN',
    email: 'ade.aisyah@ptdika.com',
    kodePenempatan: 'P000022',
    kodeCabang: '',
    kodePosition: '0',
    kodeSlid: '',
    manajemenFeePersen: '2',
    standarisasiUpahPersen: '135%',
    lokasiUnitKerja: 'BCA EXPERIENCE DESIGN',
    biayaOperasional: '',
    tglDitempatkan: '2024-05-01',
    tglMulaiPkwt: '2025-05-01',
    tglAkhirPkwt: '2026-04-30',
    nikTkadHabis: '',
    namaTkadHabis: '',
    tglHabisTkad: '',
    habisKontrak: '',
    keterangan: '',
    keteranganLainnya: '',
    upahPokokTahunLalu: 0,
    tunjanganSupervisorTahunLalu: 0
  },
  {
    id: 6,
    bulan: 'May-2026',
    nikKtp: '1771032707980002',
    nikDika: 'D8221576',
    nama: 'ADE JUANDA',
    divisi: 'BCA',
    unitName: 'BCA Urusan EDC Maintenance',
    unitKerjaPenempatan: 'KANTOR PUSAT - EDC SERVICES - 1610',
    posisiClient: 'PENGELOLAAN E-CHANNEL-KP - P000020',
    kodeCabangPembayaran: '',
    rccPembayaran: '',
    upahMinimum: 5210377,
    statusData: 'NEW',
    noPbb: '031/PPB-01/0998/22/2022',
    vendorName: 'PT DANAMAS INSAN KREASI ANDALAN',
    email: 'ade.juanda@ptdika.com',
    kodePenempatan: 'P000020',
    kodeCabang: '',
    kodePosition: '1610',
    kodeSlid: '',
    manajemenFeePersen: '2',
    standarisasiUpahPersen: '135%',
    lokasiUnitKerja: 'KANTOR PUSAT EDC SERVICES',
    biayaOperasional: '',
    tglDitempatkan: '2024-04-01',
    tglMulaiPkwt: '2025-04-01',
    tglAkhirPkwt: '2026-03-31',
    nikTkadHabis: '',
    namaTkadHabis: '',
    tglHabisTkad: '',
    habisKontrak: '',
    keterangan: '',
    keteranganLainnya: '',
    upahPokokTahunLalu: 0,
    tunjanganSupervisorTahunLalu: 0
  },
  {
    id: 7,
    bulan: 'May-2026',
    nikKtp: '3275030506950031',
    nikDika: 'D8220500',
    nama: 'ADE KURNIAWAN',
    divisi: 'BCA',
    unitName: 'BCA Biro Sistem Informasi Perbankan Transaksi',
    unitKerjaPenempatan: 'KANTOR PUSAT - BIRO SISTEM INFORMASI PERBANKAN TRANSAKSI - 1650',
    posisiClient: 'PROGRAMMER - P000027',
    kodeCabangPembayaran: '0960',
    rccPembayaran: '300',
    upahMinimum: 5729876,
    statusData: 'NEW',
    noPbb: '032/PPB-01/0998/22/2022',
    vendorName: 'PT DANAMAS INSAN KREASI ANDALAN',
    email: 'ade.kurniawan@ptdika.com',
    kodePenempatan: 'P000027',
    kodeCabang: '0960',
    kodePosition: '1650',
    kodeSlid: '',
    manajemenFeePersen: '2',
    standarisasiUpahPersen: '135%',
    lokasiUnitKerja: 'BCA BIRO SISTEM INFORMASI',
    biayaOperasional: '',
    tglDitempatkan: '2023-11-01',
    tglMulaiPkwt: '2024-11-01',
    tglAkhirPkwt: '2025-10-31',
    nikTkadHabis: '',
    namaTkadHabis: '',
    tglHabisTkad: '',
    habisKontrak: '',
    keterangan: '',
    keteranganLainnya: '',
    upahPokokTahunLalu: 0,
    tunjanganSupervisorTahunLalu: 0
  }
];

const KkJasa = () => {
  // State
  const [data, setData] = useState(SEED_KK_JASA_DATA);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Multi-Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals & Dialogs
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [uploadMonth, setUploadMonth] = useState('May');
  const [uploadYear, setUploadYear] = useState('2026');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    action: null,
    isDanger: false
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch or populate data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/kertas-kerja/jasa`, {
        headers: getAuthHeader(),
        params: {
          bulan: `${selectedMonth}-${selectedYear}`,
          unit: selectedUnit,
          posisi: selectedPosition,
          search: search
        }
      });
      if (res.data && Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else if (res.data && Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData(SEED_KK_JASA_DATA);
      }
    } catch {
      setData(SEED_KK_JASA_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  // Options
  const unitOptions = useMemo(() => {
    const set = new Set();
    data.forEach(item => item.unitName && set.add(item.unitName));
    return Array.from(set).map(u => ({ label: u, value: u }));
  }, [data]);

  const positionOptions = useMemo(() => {
    const set = new Set();
    data.forEach(item => item.posisiClient && set.add(item.posisiClient));
    return Array.from(set).map(p => ({ label: p, value: p }));
  }, [data]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch =
        !search ||
        (item.nama && item.nama.toLowerCase().includes(search.toLowerCase())) ||
        (item.nikDika && item.nikDika.toLowerCase().includes(search.toLowerCase())) ||
        (item.nikKtp && item.nikKtp.toLowerCase().includes(search.toLowerCase())) ||
        (item.posisiClient && item.posisiClient.toLowerCase().includes(search.toLowerCase())) ||
        (item.unitName && item.unitName.toLowerCase().includes(search.toLowerCase()));

      const matchUnit = !selectedUnit || item.unitName === selectedUnit;
      const matchPos = !selectedPosition || item.posisiClient === selectedPosition;
      return matchSearch && matchUnit && matchPos;
    });
  }, [data, search, selectedUnit, selectedPosition]);

  // Selection handlers
  const handleCheckAllPage = () => {
    const pageItemIds = filteredData
      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
      .map(d => d.id);
    setSelectedIds(Array.from(new Set([...selectedIds, ...pageItemIds])));
  };

  const handleUncheckAllPage = () => {
    const pageItemIds = new Set(
      filteredData
        .slice((page - 1) * rowsPerPage, page * rowsPerPage)
        .map(d => d.id)
    );
    setSelectedIds(selectedIds.filter(id => !pageItemIds.has(id)));
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk Actions
  const handleRequestApproval = () => {
    if (selectedIds.length === 0) {
      setSnackbar({
        open: true,
        message: 'Silakan pilih setidaknya satu data untuk diajukan (REQUEST)',
        severity: 'warning'
      });
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Konfirmasi Request Kertas Kerja Jasa',
      message: `Apakah Anda yakin ingin mengajukan approval/request untuk ${selectedIds.length} data Kertas Kerja Jasa terpilih?`,
      action: async () => {
        try {
          setData(prev => prev.map(item =>
            selectedIds.includes(item.id) ? { ...item, statusData: 'REQUESTED' } : item
          ));
          setSelectedIds([]);
          setSnackbar({
            open: true,
            message: `Berhasil mengajukan request untuk ${selectedIds.length} data!`,
            severity: 'success'
          });
        } catch {
          setSnackbar({ open: true, message: 'Gagal mengajukan request', severity: 'error' });
        }
      },
      isDanger: false
    });
  };

  const handleRequestDelete = () => {
    if (selectedIds.length === 0) {
      setSnackbar({
        open: true,
        message: 'Silakan pilih data yang ingin diajukan penghapusan (Request Delete)',
        severity: 'warning'
      });
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Konfirmasi Request Delete',
      message: `PERINGATAN: Apakah Anda yakin ingin mengajukan penghapusan untuk ${selectedIds.length} data terpilih?`,
      action: async () => {
        try {
          setData(prev => prev.filter(item => !selectedIds.includes(item.id)));
          setSelectedIds([]);
          setSnackbar({
            open: true,
            message: `Berhasil mengajukan penghapusan data terpilih`,
            severity: 'success'
          });
        } catch {
          setSnackbar({ open: true, message: 'Gagal memproses penghapusan', severity: 'error' });
        }
      },
      isDanger: true
    });
  };

  // Upload Handlers
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (!uploadFile) {
      setSnackbar({ open: true, message: 'Pilih file terlebih dahulu!', severity: 'warning' });
      return;
    }
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setOpenUploadModal(false);
      setUploadFile(null);
      setSnackbar({
        open: true,
        message: `File berhasil di-upload dan diproses untuk periode ${uploadMonth} ${uploadYear}`,
        severity: 'success'
      });
    }, 1200);
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        'BULAN': 'May-2026',
        'NIK (SESUAI KTP)': '1673071108000001',
        'NIK DIKA': 'D8242328',
        'NAMA (SESUAI KTP)': 'CONTOH NAMA KARYAWAN',
        'DIVISI': 'BCA',
        'UNIT NAME': 'BCA IT Management Office',
        'UNIT KERJA PENEMPATAN': 'KANTOR PUSAT - IT MANAGEMENT OFFICE - 1697',
        'POSISI CLIENT': 'MECHANICAL / TECHNICAL SUPPORT - P000023',
        'KODE CABANG PEMBAYARAN': '0998',
        'RCC PEMBAYARAN': '090',
        'Upah Minimum': 5210377
      }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_KK_Jasa');
    XLSX.writeFile(wb, 'Template_Upload_KK_Jasa.xlsx');
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      setSnackbar({ open: true, message: 'Tidak ada data untuk diekspor', severity: 'warning' });
      return;
    }
    const exportRows = filteredData.map((d, index) => ({
      'No': index + 1,
      'BULAN': d.bulan,
      'NIK (SESUAI KTP)': d.nikKtp,
      'NIK DIKA': d.nikDika,
      'NAMA (SESUAI KTP)': d.nama,
      'DIVISI': d.divisi,
      'UNIT NAME': d.unitName,
      'UNIT KERJA PENEMPATAN': d.unitKerjaPenempatan,
      'POSISI CLIENT': d.posisiClient,
      'KODE CABANG PEMBAYARAN': d.kodeCabangPembayaran,
      'RCC PEMBAYARAN': d.rccPembayaran,
      'Upah Minimum': d.upahMinimum,
      'Status Data': d.statusData
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'KK_Jasa');
    XLSX.writeFile(wb, `Kertas_Kerja_Jasa_${selectedMonth}_${selectedYear}.xlsx`);
    setSnackbar({ open: true, message: 'Berhasil mengunduh data Excel', severity: 'success' });
  };

  // Detail Modal Handlers
  const handleOpenDetail = (item) => {
    setEditingItem({ ...item });
    setOpenDetailModal(true);
  };

  const handleSaveDetail = () => {
    if (!editingItem) return;
    setData(prev => prev.map(item => item.id === editingItem.id ? editingItem : item));
    setOpenDetailModal(false);
    setSnackbar({
      open: true,
      message: `Data karyawan ${editingItem.nama} berhasil diperbarui`,
      severity: 'success'
    });
  };

  const handleResetFilter = () => {
    setSearch('');
    setSelectedUnit('');
    setSelectedPosition('');
    setSelectedMonth('May');
    setSelectedYear('2026');
    setPage(1);
  };

  // Table Columns
  const columns = [
    {
      id: 'select',
      label: (
        <input
          type="checkbox"
          checked={
            filteredData.length > 0 &&
            filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage).every(d => selectedIds.includes(d.id))
          }
          onChange={(e) => {
            if (e.target.checked) handleCheckAllPage();
            else handleUncheckAllPage();
          }}
          style={{ cursor: 'pointer', width: 16, height: 16 }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => handleToggleSelect(row.id)}
          style={{ cursor: 'pointer', width: 16, height: 16 }}
        />
      ),
      width: '40px',
      align: 'center'
    },
    {
      id: 'index',
      label: 'NO',
      render: (_, index) => (page - 1) * rowsPerPage + index + 1,
      width: '50px',
      align: 'center'
    },
    {
      id: 'bulan',
      label: 'BULAN',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.82rem' }}>
          {row.bulan}
        </Typography>
      ),
      minWidth: '100px'
    },
    {
      id: 'nikKtp',
      label: 'NIK (SESUAI KTP)',
      render: (row) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'text.secondary', fontSize: '0.82rem' }}>
          {row.nikKtp}
        </Typography>
      ),
      minWidth: '160px'
    },
    {
      id: 'nikDika',
      label: 'NIK DIKA',
      render: (row) => (
        <Chip
          label={row.nikDika}
          size="small"
          sx={{
            fontWeight: 700,
            fontFamily: 'monospace',
            bgcolor: 'primary.lighter',
            color: 'primary.dark',
            border: '1px solid',
            borderColor: 'primary.light',
            fontSize: '0.78rem'
          }}
        />
      ),
      minWidth: '110px'
    },
    {
      id: 'nama',
      label: 'NAMA (SESUAI KTP)',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.84rem' }}>
          {row.nama}
        </Typography>
      ),
      minWidth: '220px'
    },
    {
      id: 'divisi',
      label: 'DIVISI',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.82rem' }}>
          {row.divisi}
        </Typography>
      ),
      minWidth: '80px'
    },
    {
      id: 'unitName',
      label: 'UNIT NAME',
      render: (row) => (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', fontWeight: 500 }}>
          {row.unitName}
        </Typography>
      ),
      minWidth: '220px'
    },
    {
      id: 'unitKerjaPenempatan',
      label: 'UNIT KERJA PENEMPATAN',
      render: (row) => (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem', fontWeight: 500 }}>
          {row.unitKerjaPenempatan}
        </Typography>
      ),
      minWidth: '240px'
    },
    {
      id: 'posisiClient',
      label: 'POSISI CLIENT',
      render: (row) => (
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.82rem', fontWeight: 600 }}>
          {row.posisiClient}
        </Typography>
      ),
      minWidth: '220px'
    },
    {
      id: 'kodeCabangPembayaran',
      label: 'KODE CABANG PEMBAYARAN',
      render: (row) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.82rem', textAlign: 'center' }}>
          {row.kodeCabangPembayaran || '-'}
        </Typography>
      ),
      minWidth: '130px',
      align: 'center'
    },
    {
      id: 'rccPembayaran',
      label: 'RCC PEMBAYARAN',
      render: (row) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.82rem', textAlign: 'center' }}>
          {row.rccPembayaran || '-'}
        </Typography>
      ),
      minWidth: '110px',
      align: 'center'
    },
    {
      id: 'upahMinimum',
      label: 'Upah Minimum',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem', textAlign: 'right' }}>
          Rp {Number(row.upahMinimum || 0).toLocaleString('id-ID')}
        </Typography>
      ),
      minWidth: '130px',
      align: 'right'
    },
    {
      id: 'statusData',
      label: 'Status Data',
      render: (row) => {
        let color = 'default';
        if (row.statusData === 'NEW') color = 'primary';
        else if (row.statusData === 'REQUESTED') color = 'warning';
        else if (row.statusData === 'APPROVED') color = 'success';
        return (
          <Chip
            label={row.statusData}
            size="small"
            color={color}
            sx={{ fontWeight: 700, fontSize: '0.75rem', borderRadius: 1.5 }}
          />
        );
      },
      minWidth: '110px',
      align: 'center'
    },
    {
      id: 'action',
      label: 'AKSI',
      render: (row) => (
        <Tooltip title="Detail KK Jasa" arrow>
          <IconButton
            size="small"
            onClick={() => handleOpenDetail(row)}
            sx={{
              bgcolor: '#fef3c7',
              color: '#d97706',
              '&:hover': { bgcolor: '#fde68a' },
              borderRadius: 1.5,
              p: 0.75
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      ),
      minWidth: '70px',
      align: 'center'
    }
  ];

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {/* HEADER SECTION */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.4)'
            }}
          >
            <KkJasaIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Kertas Kerja Jasa
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 500 }}>
              Manajemen penagihan, data kontrak, upload berkas, dan pengajuan request kertas kerja jasa
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setOpenUploadModal(true)}
            sx={{
              bgcolor: '#2563eb',
              color: 'white',
              '&:hover': { bgcolor: '#1d4ed8' },
              borderRadius: 2.5,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              px: 2.5,
              py: 1
            }}
          >
            UPLOAD DATA
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportExcel}
            sx={{
              borderRadius: 2.5,
              fontWeight: 600,
              textTransform: 'none',
              px: 2,
              py: 1,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' }
            }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* FILTER & CONTROL PANEL */}
      <Paper
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}
        elevation={0}
      >
        <Stack spacing={2}>
          {/* Row 1: Search, Unit, Position, Bulan, Tahun, SEARCH */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Cari NIK, Nama, Posisi..."
              sx={{ flex: '1 1 200px', minWidth: 180, bgcolor: 'background.paper', borderRadius: 2 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }
              }}
            />

            <Box sx={{ flex: '1 1 170px', minWidth: 150 }}>
              <SearchableSelect
                placeholder="(Unit)"
                value={selectedUnit}
                onChange={(val) => setSelectedUnit(val || '')}
                options={unitOptions}
              />
            </Box>

            <Box sx={{ flex: '1 1 170px', minWidth: 150 }}>
              <SearchableSelect
                placeholder="(Position)"
                value={selectedPosition}
                onChange={(val) => setSelectedPosition(val || '')}
                options={positionOptions}
              />
            </Box>

            <Box sx={{ width: 140, minWidth: 120 }}>
              <SearchableSelect
                placeholder="Bulan"
                value={selectedMonth}
                onChange={(val) => setSelectedMonth(val || 'May')}
                options={MONTHS}
              />
            </Box>

            <Box sx={{ width: 120, minWidth: 100 }}>
              <SearchableSelect
                placeholder="Tahun"
                value={selectedYear}
                onChange={(val) => setSelectedYear(val || '2026')}
                options={YEARS}
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => setPage(1)}
              sx={{
                bgcolor: '#1e293b',
                color: 'white',
                '&:hover': { bgcolor: '#0f172a' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                height: '40px'
              }}
            >
              SEARCH
            </Button>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Row 2: Bulk Actions (REQUEST, Request Delete, Reset) */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<RequestIcon />}
                size="small"
                onClick={handleRequestApproval}
                disabled={selectedIds.length === 0}
                sx={{
                  bgcolor: '#3b82f6',
                  color: 'white',
                  '&:hover': { bgcolor: '#2563eb' },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.5,
                  height: '36px'
                }}
              >
                REQUEST ({selectedIds.length})
              </Button>

              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                size="small"
                onClick={handleRequestDelete}
                disabled={selectedIds.length === 0}
                sx={{
                  bgcolor: '#ef4444',
                  color: 'white',
                  '&:hover': { bgcolor: '#dc2626' },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.5,
                  height: '36px'
                }}
              >
                Request Delete
              </Button>
            </Box>

            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              size="small"
              onClick={handleResetFilter}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                height: '36px',
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' }
              }}
            >
              Reset Filter
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* DATA TABLE */}
      <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <DataTable
          columns={columns}
          data={filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
          loading={loading}
          totalCount={filteredData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => {
            setRowsPerPage(r);
            setPage(1);
          }}
          emptyMessage="Tidak ada data Kertas Kerja Jasa ditemukan untuk filter ini."
        />
      </Paper>

      {/* MODAL 1: UPLOAD KERTAS KERJA JASA */}
      <CustomModal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
        title="Upload Kertas Kerja Jasa"
        maxWidth="md"
      >
        <Box sx={{ p: 1 }}>
          <Stack spacing={3}>
            {/* Periode */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, width: 80, color: 'text.secondary' }}>
                Periode
              </Typography>
              <Box sx={{ width: 180 }}>
                <SearchableSelect
                  placeholder="Bulan"
                  value={uploadMonth}
                  onChange={(val) => setUploadMonth(val || 'May')}
                  options={MONTHS}
                />
              </Box>
              <Box sx={{ width: 140 }}>
                <SearchableSelect
                  placeholder="Tahun"
                  value={uploadYear}
                  onChange={(val) => setUploadYear(val || '2026')}
                  options={YEARS}
                />
              </Box>
            </Box>

            {/* File Upload Drop Zone */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, width: 80, color: 'text.secondary' }}>
                File
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: uploadFile ? 'primary.main' : 'divider',
                  bgcolor: uploadFile ? 'primary.lighter' : 'background.default'
                }}
              >
                <AttachFileIcon sx={{ color: uploadFile ? 'primary.main' : 'text.disabled' }} />
                <Typography variant="body2" sx={{ flex: 1, color: uploadFile ? 'text.primary' : 'text.secondary' }}>
                  {uploadFile ? uploadFile.name : 'Choose File (Excel / CSV)'}
                </Typography>
                <input
                  type="file"
                  id="kk-file-input"
                  accept=".xlsx, .xls, .csv"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <label htmlFor="kk-file-input">
                  <Button
                    variant="outlined"
                    component="span"
                    size="small"
                    sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
                  >
                    Browse
                  </Button>
                </label>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                variant="outlined"
                startIcon={<TemplateIcon />}
                onClick={handleDownloadTemplate}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'primary.main',
                  color: 'primary.main'
                }}
              >
                Template Upload
              </Button>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenUploadModal(false)}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.secondary' }}
                >
                  Batal
                </Button>
                <Button
                  variant="contained"
                  startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <UploadIcon />}
                  onClick={handleUploadSubmit}
                  disabled={uploading || !uploadFile}
                  sx={{
                    bgcolor: '#2563eb',
                    color: 'white',
                    '&:hover': { bgcolor: '#1d4ed8' },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 3
                  }}
                >
                  {uploading ? 'Processing...' : 'Upload & Process'}
                </Button>
              </Box>
            </Box>
          </Stack>
        </Box>
      </CustomModal>

      {/* MODAL 2: DETAIL KK JASA (Matches Exact Screenshot Layout) */}
      <CustomModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        title="Detail KK JASA"
        maxWidth="lg"
      >
        {editingItem && (
          <Box sx={{ p: 1 }}>
            <Stack spacing={3}>
              {/* SECTION 1: DATA KARYAWAN */}
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
                elevation={0}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  DATA KARYAWAN
                </Typography>

                <Grid container spacing={2.5}>
                  {/* Column 1: NIK, Nama, NIK/KTP, No Pbb, Unit, Position, Vendor Name, EMAIL */}
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>NIK</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.nikDika || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, nikDika: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Nama</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.nama || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, nama: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>NIK / KTP</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.nikKtp || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, nikKtp: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>No Pbb</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.noPbb || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, noPbb: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Unit</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.unitKerjaPenempatan || editingItem.unitName || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, unitKerjaPenempatan: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Position</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.posisiClient || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, posisiClient: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Vendor Name</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.vendorName || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, vendorName: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>EMAIL</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.email || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                        />
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Column 2: Periode, Kode Penempatan, Kode Cabang, Kode Position, Kode Slid, RCC Pembayaran */}
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Periode</Typography>
                        <SearchableSelect
                          value={editingItem.bulan?.split('-')[0] || selectedMonth}
                          onChange={(val) => setEditingItem({ ...editingItem, bulan: `${val || 'May'}-${selectedYear}` })}
                          options={MONTHS}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Kode Penempatan</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.kodePenempatan || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, kodePenempatan: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Kode Cabang</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.kodeCabangPembayaran || editingItem.kodeCabang || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, kodeCabangPembayaran: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Kode Position</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.kodePosition || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, kodePosition: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Kode Slid</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.kodeSlid || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, kodeSlid: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>RCC Pembayaran</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.rccPembayaran || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, rccPembayaran: e.target.value })}
                        />
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Column 3: Manajemen Fee Dalam (%), Standarisasi Upah Persen, Keterangan Lokasi Unit Kerja, Keterangan Biaya Operasional */}
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Manajemen Fee Dalam (%)</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.manajemenFeePersen || '2'}
                          onChange={(e) => setEditingItem({ ...editingItem, manajemenFeePersen: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Standarisasi Upah Persen</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.standarisasiUpahPersen || '135%'}
                          onChange={(e) => setEditingItem({ ...editingItem, standarisasiUpahPersen: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Keterangan Lokasi Unit Kerja</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.lokasiUnitKerja || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, lokasiUnitKerja: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Keterangan Biaya Operasional</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.biayaOperasional || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, biayaOperasional: e.target.value })}
                        />
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* SECTION 2: KONTRAK KARYAWAN & NOMINAL */}
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
                elevation={0}
              >
                <Grid container spacing={3}>
                  {/* SUBSECTION: KONTRAK KARYAWAN */}
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      KONTRAK KARYAWAN
                    </Typography>

                    <Grid container spacing={2}>
                      {/* Dates Column */}
                      <Grid item xs={12} sm={4}>
                        <Stack spacing={1.5}>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Tanggal Ditempatkan</Typography>
                            <TextField
                              size="small"
                              type="date"
                              fullWidth
                              value={editingItem.tglDitempatkan || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, tglDitempatkan: e.target.value })}
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Tanggal Mulai PKWT</Typography>
                            <TextField
                              size="small"
                              type="date"
                              fullWidth
                              value={editingItem.tglMulaiPkwt || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, tglMulaiPkwt: e.target.value })}
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Tanggal Akhir PKWT</Typography>
                            <TextField
                              size="small"
                              type="date"
                              fullWidth
                              value={editingItem.tglAkhirPkwt || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, tglAkhirPkwt: e.target.value })}
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          </Box>
                        </Stack>
                      </Grid>

                      {/* TKAD Details Column */}
                      <Grid item xs={12} sm={4}>
                        <Stack spacing={1.5}>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Nik TKAD Habis Kontrak</Typography>
                            <TextField
                              size="small"
                              fullWidth
                              value={editingItem.nikTkadHabis || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, nikTkadHabis: e.target.value })}
                            />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Nama TKAD Habis Kontrak</Typography>
                            <TextField
                              size="small"
                              fullWidth
                              value={editingItem.namaTkadHabis || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, namaTkadHabis: e.target.value })}
                            />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Tgl Habis kontrak TKAD</Typography>
                            <TextField
                              size="small"
                              type="date"
                              fullWidth
                              value={editingItem.tglHabisTkad || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, tglHabisTkad: e.target.value })}
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Habis Kontrak</Typography>
                            <TextField
                              size="small"
                              fullWidth
                              value={editingItem.habisKontrak || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, habisKontrak: e.target.value })}
                            />
                          </Box>
                        </Stack>
                      </Grid>

                      {/* Notes Column */}
                      <Grid item xs={12} sm={4}>
                        <Stack spacing={1.5}>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Keterangan</Typography>
                            <TextField
                              size="small"
                              multiline
                              rows={3}
                              fullWidth
                              value={editingItem.keterangan || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, keterangan: e.target.value })}
                            />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Keterangan Lainnya</Typography>
                            <TextField
                              size="small"
                              multiline
                              rows={3}
                              fullWidth
                              value={editingItem.keteranganLainnya || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, keteranganLainnya: e.target.value })}
                            />
                          </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* SUBSECTION: NOMINAL */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      NOMINAL
                    </Typography>

                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Upah Pokok Tahun Lalu</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.upahPokokTahunLalu || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, upahPokokTahunLalu: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Tunjangan Supervisor Tahun Lalu</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.tunjanganSupervisorTahunLalu || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, tunjanganSupervisorTahunLalu: e.target.value })}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Upah Minimum</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={editingItem.upahMinimum || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, upahMinimum: e.target.value })}
                        />
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* FOOTER ACTIONS */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => setOpenDetailModal(false)}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, borderColor: 'divider', color: 'text.secondary' }}
                >
                  Batal
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveDetail}
                  sx={{
                    bgcolor: '#2563eb',
                    color: 'white',
                    '&:hover': { bgcolor: '#1d4ed8' },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 4
                  }}
                >
                  UPDATE
                </Button>
              </Box>
            </Stack>
          </Box>
        )}
      </CustomModal>

      {/* CONFIRMATION DIALOG */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={async () => {
          if (confirmDialog.action) await confirmDialog.action();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        isDanger={confirmDialog.isDanger}
      />

      {/* SNACKBAR */}
      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default KkJasa;
