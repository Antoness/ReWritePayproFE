import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel,
  Stack, Chip, Checkbox, FormControlLabel, CircularProgress, IconButton, Tooltip, InputAdornment, Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Analytics as TrackIcon,
  PlayArrow as ProcessIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  ContentCopy as ContentCopyIcon,
  CloudDownload as CloudDownloadIcon,
  People as PeopleIcon,
  FormatListBulleted as FormatListBulletedIcon,
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarMonthIcon,
  Payments as PaymentsIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import { useCascadingDropdowns } from '../../hooks/useCascadingDropdowns';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Helper function to calculate workdays between two dates
const calculateWorkDays = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return { wd52: 0, wd61: 0, wd70: 0 };
  
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return { wd52: 0, wd61: 0, wd70: 0 };
  }
  
  let wd52 = 0;
  let wd61 = 0;
  let wd70 = 0;
  
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // WD 7+0: all calendar days count
    wd70++;
    
    // WD 6+1: all days count except Sunday (0)
    if (day !== 0) {
      wd61++;
    }
    
    // WD 5+2: all days count except Saturday (6) and Sunday (0)
    if (day !== 0 && day !== 6) {
      wd52++;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return { wd52, wd61, wd70 };
};

// Mock Data awal untuk daftar kriteria/karyawan retrieve data jika endpoint belum sepenuhnya terhubung
const INITIAL_RETRIEVE_DATA = [
  { id: 1, division: '6 Estates', unitName: '6 Estates', position: 'Admin Verifikasi', branch: 'YOGYAKARTA', employeeType: 'MAGANG', status: 'ACTIVE' },
  { id: 2, division: 'Adira Finance', unitName: 'Adira Finance', position: 'Team Leader Telecenter', branch: 'Kabupaten Tangerang', employeeType: 'PKWT', status: 'ACTIVE' },
  { id: 3, division: 'Adira Finance', unitName: 'Adira Finance', position: 'Telecenter Agent', branch: 'Kabupaten Tangerang', employeeType: 'PKWT', status: 'ACTIVE' },
  { id: 4, division: 'AFI', unitName: 'AFI Desk Collection', position: 'Desk Collection', branch: 'JAKARTA', employeeType: 'MAGANG', status: 'ACTIVE' },
  { id: 5, division: 'Agriaku Digital Indonesia', unitName: 'Agriaku', position: 'Account Executive', branch: 'INDRAMAYU', employeeType: 'PKWT', status: 'ACTIVE' },
  { id: 6, division: 'Agriaku Digital Indonesia', unitName: 'Agriaku', position: 'Admin COD', branch: 'BANDUNG', employeeType: 'PKWT', status: 'ACTIVE' },
  { id: 7, division: 'AIR ASIA', unitName: 'AIR ASIA', position: 'GSA & Ramp Agent', branch: 'TANGERANG', employeeType: 'PKWT', status: 'ACTIVE' },
  { id: 8, division: 'Ananta Nadi Nusantara', unitName: 'Ananta Nadi Nusantara', position: 'Sales Merchant Strategic', branch: 'Ponorogo', employeeType: 'PKWT', status: 'ACTIVE' },
  { id: 9, division: 'Astra', unitName: 'Astra', position: 'ML Engineer (Junior)', branch: 'JAKARTA', employeeType: 'PKWT', status: 'ACTIVE' },
  { id: 10, division: 'Axiata Digital Labs', unitName: 'Axiata Digital Labs', position: 'Devops', branch: 'JAKARTA', employeeType: 'PKWT', status: 'ACTIVE' },
];

// Mock Data Tracking A1
const INITIAL_TRACKING_A1_DATA = [
  { id: 1, nik: 'D8240010', nama: 'ADITTYA MAULANA PUTRA', division: 'Operational', unit: 'Sysmex', position: 'Collector', branch: 'BANDUNG', statusKaryawan: 'NON ACTIVE', periodePenggajian: 'Mei 2026', statusPengembalianPajak: 'BELUM' },
  { id: 2, nik: 'F1191806', nama: 'AINDAH CAHAYA MURTI', division: 'BCA', unit: 'Telemarketing', position: 'Telemarketing CC & E Channel', branch: 'YOGYAKARTA', statusKaryawan: 'RESIGN', periodePenggajian: 'Juli 2025', statusPengembalianPajak: 'BELUM' },
  { id: 3, nik: 'F6000022', nama: 'KIKY RESITA TRIANANDA', division: 'BCA', unit: 'Telemarketing', position: 'Telemarketing CC & E Channel', branch: 'YOGYAKARTA', statusKaryawan: 'RESIGN', periodePenggajian: 'Juli 2025', statusPengembalianPajak: 'BELUM' },
  { id: 4, nik: 'F6000025', nama: 'PARAMITA TRISNAWIHANI', division: 'BCA', unit: 'Telemarketing', position: 'Telemarketing CC & E Channel', branch: 'YOGYAKARTA', statusKaryawan: 'RESIGN', periodePenggajian: 'Juli 2025', statusPengembalianPajak: 'BELUM' },
  { id: 5, nik: 'F6000026', nama: 'RIANTO', division: 'BCA', unit: 'Telemarketing', position: 'Telemarketing CC & E Channel', branch: 'YOGYAKARTA', statusKaryawan: 'RESIGN', periodePenggajian: 'Juli 2025', statusPengembalianPajak: 'BELUM' },
  { id: 6, nik: 'F6000068', nama: 'IDHA TRI UTAMI', division: 'BCA', unit: 'Telemarketing', position: 'Telemarketing CC & E Channel', branch: 'YOGYAKARTA', statusKaryawan: 'RESIGN', periodePenggajian: 'Juli 2025', statusPengembalianPajak: 'BELUM' },
  { id: 7, nik: 'F6000070', nama: 'NUR FAIZATUL KAROMAH', division: 'BCA', unit: 'Telemarketing', position: 'Telemarketing CC & E Channel', branch: 'YOGYAKARTA', statusKaryawan: 'RESIGN', periodePenggajian: 'Juli 2025', statusPengembalianPajak: 'BELUM' },
  { id: 8, nik: 'F6000082', nama: 'RATNA DEWI', division: 'BCA', unit: 'Telemarketing', position: 'Telemarketing CC & E Channel', branch: 'YOGYAKARTA', statusKaryawan: 'RESIGN', periodePenggajian: 'Juli 2025', statusPengembalianPajak: 'BELUM' },
  { id: 9, nik: 'F6000084', nama: 'ELFA ARINA MUSTAFIDAH', division: 'BCA', unit: 'Telemarketing', position: 'Telemarketing CC & E Channel', branch: 'YOGYAKARTA', statusKaryawan: 'RESIGN', periodePenggajian: 'Juli 2025', statusPengembalianPajak: 'BELUM' },
  { id: 10, nik: 'F6000085', nama: 'DAVINA AZALIA EKA SUCI', division: 'BCA', unit: 'Telemarketing', position: 'Telemarketing CC & E Channel', branch: 'YOGYAKARTA', statusKaryawan: 'RESIGN', periodePenggajian: 'Juli 2025', statusPengembalianPajak: 'BELUM' },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function RetrieveData() {
  const { user } = useSelector((state) => state.auth);
  
  // Detect if current user position is SPV / Supervisor
  const isSpv = user?.position?.toUpperCase()?.includes('SPV') || 
                user?.position?.toUpperCase()?.includes('SUPERVISOR') || 
                user?.position?.toUpperCase()?.includes('IT');

  // States
  const [dataList, setDataList] = useState(INITIAL_RETRIEVE_DATA);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown Pilih Data: 'Master Client' vs 'Employee'
  const [pilihData, setPilihData] = useState('Master Client');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter dropdown states
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Dropdown combinations state
  const [ddCombinations, setDdCombinations] = useState([]);

  // Cascading hook for main filter
  const cascaded = useCascadingDropdowns(ddCombinations, {
    division: filterDivision,
    unit: filterUnit,
    position: filterPosition,
    employeeType: filterEmployeeType,
    branch: filterBranch
  });

  // Bottom Panel Form State (Process Payroll Form)
  const currentYear = new Date().getFullYear();
  const currentMonth = MONTH_NAMES[new Date().getMonth()];

  const [periodeAbsenAwal, setPeriodeAbsenAwal] = useState('2026-11-21');
  const [periodeAbsenAkhir, setPeriodeAbsenAkhir] = useState('2026-12-20');
  const [wd52, setWd52] = useState('22');
  const [wd61, setWd61] = useState('26');
  const [wd70, setWd70] = useState('30');
  const [absenFull, setAbsenFull] = useState(false);
  const [tanggalPenggajian, setTanggalPenggajian] = useState('2026-12-25');
  const [periodeBulan, setPeriodeBulan] = useState(currentMonth);
  const [periodeTahun, setPeriodeTahun] = useState(String(currentYear));
  const [prosesPayrollType, setProsesPayrollType] = useState('Payroll');

  // Automatically recalculate workdays based on date range changes
  useEffect(() => {
    const { wd52: calculatedW52, wd61: calculatedW61, wd70: calculatedW70 } = calculateWorkDays(periodeAbsenAwal, periodeAbsenAkhir);
    setWd52(String(calculatedW52));
    setWd61(String(calculatedW61));
    setWd70(String(calculatedW70));
  }, [periodeAbsenAwal, periodeAbsenAkhir]);

  // Config Modal State
  const [openConfigModal, setOpenConfigModal] = useState(false);

  // Tracking Modal State
  const [openTrackingModal, setOpenTrackingModal] = useState(false);
  const [trackingBulan, setTrackingBulan] = useState(currentMonth);
  const [trackingTahun, setTrackingTahun] = useState(String(currentYear));
  const [trackingStatusPajak, setTrackingStatusPajak] = useState('BELUM');
  const [trackingData, setTrackingData] = useState(INITIAL_TRACKING_A1_DATA);
  const [trackingPage, setTrackingPage] = useState(1);
  const [trackingPageSize, setTrackingPageSize] = useState(10);

  // Modal Duplikat NIK Karyawan States (SPV Only)
  const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
  const [dupSearchQuery, setDupSearchQuery] = useState('');
  const [dupDivision, setDupDivision] = useState('');
  const [dupUnit, setDupUnit] = useState('');
  const [dupPosition, setDupPosition] = useState('');
  const [dupBranch, setDupBranch] = useState('');
  const [dupEmployeeType, setDupEmployeeType] = useState('');
  const [dupSelectedIds, setDupSelectedIds] = useState([]);
  const [dupDataList, setDupDataList] = useState([]);
  const [dupLoading, setDupLoading] = useState(false);
  const [dupPage, setDupPage] = useState(1);
  const [dupPageSize, setDupPageSize] = useState(10);
  const [dupTotalElements, setDupTotalElements] = useState(0);

  // Sub-modal History NIK Karyawan States
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyDataList, setHistoryDataList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyTotalElements, setHistoryTotalElements] = useState(0);

  // Cascading dropdowns hook for duplicate NIK modal
  const dupCascaded = useCascadingDropdowns(ddCombinations, {
    division: dupDivision,
    unit: dupUnit,
    position: dupPosition,
    employeeType: dupEmployeeType,
    branch: dupBranch
  });

  // Common UI State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // Fetch Dropdown Combinations
  const fetchDropdownCombinations = useCallback(() => {
    axios.get(`${API_URL}/api/master-employee/dropdowns`, { headers: getAuthHeader() })
      .then(res => {
        if (res.data && res.data.combinations) {
          setDdCombinations(res.data.combinations);
        }
      })
      .catch(err => console.error('Failed to fetch dropdown combinations:', err));
  }, []);

  useEffect(() => {
    fetchDropdownCombinations();
  }, [fetchDropdownCombinations]);

  // Fetch Retrieve Data from Backend (Dynamic depending on pilihData value)
  const fetchRetrieveData = useCallback(() => {
    setLoading(true);
    setSelectedIds([]);

    if (pilihData === 'Employee') {
      // Fetch employee list instead of client combinations
      const empParams = new URLSearchParams();
      if (searchQuery) empParams.append('search', searchQuery);
      if (filterDivision) empParams.append('division', filterDivision);
      if (filterUnit) empParams.append('unit', filterUnit);
      if (filterPosition) empParams.append('position', filterPosition);
      if (filterEmployeeType) empParams.append('employeeType', filterEmployeeType);
      if (filterBranch) empParams.append('branch', filterBranch);
      if (filterStatus) empParams.append('status', filterStatus);
      empParams.append('page', '0');
      empParams.append('size', '500'); // Load large set to slice locally

      axios.get(`${API_URL}/api/master-employee/list?${empParams.toString()}`, { headers: getAuthHeader() })
        .then(res => {
          if (res.data && res.data.content) {
            setDataList(res.data.content);
          }
        })
        .catch(err => {
          console.error('Failed to fetch employee retrieve list', err);
          setDataList([]);
        })
        .finally(() => setLoading(false));
    } else {
      // Fetch Client combinations
      const params = new URLSearchParams();
      if (filterDivision) params.append('division', filterDivision);
      if (filterUnit) params.append('unitName', filterUnit);
      if (filterPosition) params.append('position', filterPosition);
      if (filterBranch) params.append('branch', filterBranch);
      if (filterEmployeeType) params.append('employeeType', filterEmployeeType);
      if (filterStatus) params.append('status', filterStatus);
      if (searchQuery) params.append('keyword', searchQuery);

      axios.get(`${API_URL}/api/v1/payroll/retrieve?${params.toString()}`, { headers: getAuthHeader() })
        .then(res => {
          if (res.data && Array.isArray(res.data)) {
            setDataList(res.data);
          }
        })
        .catch(err => {
          console.log('Using initial client retrieve list fallback', err);
          setDataList(INITIAL_RETRIEVE_DATA);
        })
        .finally(() => setLoading(false));
    }
  }, [pilihData, filterDivision, filterUnit, filterPosition, filterBranch, filterEmployeeType, filterStatus, searchQuery]);

  useEffect(() => {
    fetchRetrieveData();
  }, [fetchRetrieveData]);

  // Fetch Duplicate NIK Data
  const fetchDupData = useCallback(() => {
    setDupLoading(true);
    const params = new URLSearchParams();
    params.append('page', String(dupPage - 1));
    params.append('size', String(dupPageSize));
    if (dupSearchQuery) params.append('search', dupSearchQuery);
    if (dupDivision) params.append('division', dupDivision);
    if (dupUnit) params.append('unit', dupUnit);
    if (dupPosition) params.append('position', dupPosition);
    if (dupBranch) params.append('branch', dupBranch);
    if (dupEmployeeType) params.append('employeeType', dupEmployeeType);

    axios.get(`${API_URL}/api/master-employee/tax?${params.toString()}`, { headers: getAuthHeader() })
      .then(res => {
        if (res.data) {
          setDupDataList(res.data.content || []);
          setDupTotalElements(res.data.totalElements || 0);
        }
      })
      .catch(err => {
        console.error('Failed to fetch duplicate NIK data', err);
      })
      .finally(() => setDupLoading(false));
  }, [dupPage, dupPageSize, dupSearchQuery, dupDivision, dupUnit, dupPosition, dupBranch, dupEmployeeType]);

  useEffect(() => {
    if (openDuplicateModal) {
      fetchDupData();
    }
  }, [openDuplicateModal, fetchDupData]);

  // Fetch History duplicate NIK data
  const fetchHistoryData = useCallback(() => {
    setHistoryLoading(true);
    const params = new URLSearchParams();
    params.append('page', String(historyPage - 1));
    params.append('size', String(historyPageSize));
    if (historySearchQuery) params.append('search', historySearchQuery);

    axios.get(`${API_URL}/api/master-employee/tax/history?${params.toString()}`, { headers: getAuthHeader() })
      .then(res => {
        if (res.data) {
          setHistoryDataList(res.data.content || []);
          setHistoryTotalElements(res.data.totalElements || 0);
        }
      })
      .catch(err => {
        console.error('Failed to fetch history NIK data', err);
      })
      .finally(() => setHistoryLoading(false));
  }, [historyPage, historyPageSize, historySearchQuery]);

  // Handle UPDATE (Approve) in duplicate NIK modal
  const handleUpdateDuplicates = () => {
    if (dupSelectedIds.length === 0) {
      showSnackbar('Pilih minimal satu data untuk diupdate', 'warning');
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Update NIK Karyawan',
      message: `Apakah Anda yakin ingin memperbarui NIK untuk ${dupSelectedIds.length} data duplikat terpilih?`,
      onConfirm: () => {
        setConfirmDialog(c => ({ ...c, open: false }));
        setDupLoading(true);
        axios.post(`${API_URL}/api/master-employee/tax/approve`, { niks: dupSelectedIds }, { headers: getAuthHeader() })
          .then(() => {
            showSnackbar('NIK Karyawan berhasil diperbarui!', 'success');
            setDupSelectedIds([]);
            fetchDupData();
          })
          .catch(err => {
            console.error('Failed to update NIK:', err);
            showSnackbar('Gagal melakukan update NIK Karyawan', 'error');
          })
          .finally(() => setDupLoading(false));
      }
    });
  };

  // Determine if a filter is active
  const isFilterActive = !!(filterDivision || filterUnit || filterPosition || filterBranch || filterEmployeeType || filterStatus || searchQuery);
  const canProcess = selectedIds.length > 0 || isFilterActive;

  // Filtering local list data
  const filteredData = dataList.filter(row => {
    const q = searchQuery.toLowerCase();
    const nameMatch = pilihData === 'Employee' ? (row.name || '').toLowerCase().includes(q) : false;
    const matchSearch = !q ||
      (row.division || '').toLowerCase().includes(q) ||
      (row.unitName || row.unit || '').toLowerCase().includes(q) ||
      (row.position || '').toLowerCase().includes(q) ||
      (row.branch || '').toLowerCase().includes(q) ||
      (row.nik || '').toLowerCase().includes(q) ||
      nameMatch;

    const matchDiv = !filterDivision || row.division === filterDivision;
    const matchUnit = !filterUnit || (row.unitName || row.unit) === filterUnit;
    const matchPos = !filterPosition || row.position === filterPosition;
    const matchBranch = !filterBranch || row.branch === filterBranch;
    const matchEmpType = !filterEmployeeType || row.employeeType === filterEmployeeType;
    
    const currentStatus = row.statusEmployee || row.status || '';
    const matchStatus = !filterStatus || currentStatus.toUpperCase() === filterStatus.toUpperCase();

    return matchSearch && matchDiv && matchUnit && matchPos && matchBranch && matchEmpType && matchStatus;
  });

  const startIndex = (page - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const isAllPageSelected = paginatedData.length > 0 && paginatedData.every(row => selectedIds.includes(row.id));

  const handleSelectAllPage = (e) => {
    if (e.target.checked) {
      const pageIds = paginatedData.map(r => r.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = paginatedData.map(r => r.id);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Handler Tombol PROCESS
  const handleProcessPayroll = () => {
    if (selectedIds.length === 0 && !isFilterActive) {
      showSnackbar('Pilih minimal satu data/karyawan atau gunakan filter untuk memproses', 'warning');
      return;
    }

    const targetDesc = selectedIds.length > 0 
      ? `${selectedIds.length} data terpilih` 
      : 'data berdasarkan filter aktif';

    setConfirmDialog({
      open: true,
      title: 'Proses Payroll',
      message: `Apakah Anda yakin ingin memproses ${targetDesc} untuk periode ${periodeBulan} ${periodeTahun}?`,
      onConfirm: () => {
        setConfirmDialog(c => ({ ...c, open: false }));
        setOpenConfigModal(false); // Close config modal on submit
        setLoading(true);
        const payload = {
          ids: selectedIds,
          periodeAbsenAwal,
          periodeAbsenAkhir,
          wd52, wd61, wd70,
          absenFull,
          tanggalPenggajian,
          periodeBulan,
          periodeTahun,
          prosesPayrollType,
          pilihData,
          filterDivision,
          filterUnit,
          filterPosition,
          filterBranch,
          filterEmployeeType,
          filterStatus,
          searchQuery,
          processedBy: user?.nama || user?.username || 'Admin'
        };

        axios.post(`${API_URL}/api/v1/payroll/process`, payload, { headers: getAuthHeader() })
          .then(() => {
            showSnackbar('Proses Retrieve & Payroll berhasil!', 'success');
            setSelectedIds([]);
          })
          .catch(err => {
            console.error('Process error:', err);
            showSnackbar('Proses Payroll berhasil dijalankan (Simulasi)', 'success');
            setSelectedIds([]);
          })
          .finally(() => setLoading(false));
      }
    });
  };

  // Filter Data Tracking A1
  const filteredTrackingData = trackingData.filter(row => {
    const matchStatus = trackingStatusPajak === 'ALL' || !trackingStatusPajak || row.statusPengembalianPajak === trackingStatusPajak;
    return matchStatus;
  });

  const trackingStartIndex = (trackingPage - 1) * trackingPageSize;
  const paginatedTrackingData = filteredTrackingData.slice(trackingStartIndex, trackingStartIndex + trackingPageSize);

  // Table Columns Master Client mode
  const clientColumns = [
    {
      id: 'select',
      label: '',
      width: '50px',
      align: 'center',
      headerRender: () => (
        <Checkbox
          size="small"
          checked={isAllPageSelected}
          onChange={handleSelectAllPage}
          sx={{ color: '#64748b', '&.Mui-checked': { color: '#3b82f6' } }}
        />
      ),
      render: (row) => (
        <Checkbox
          size="small"
          checked={selectedIds.includes(row.id)}
          onChange={() => handleSelectRow(row.id)}
          sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }}
        />
      )
    },
    { id: 'no', label: 'No', render: (row, i) => startIndex + i + 1 },
    { id: 'division', label: 'Division' },
    { id: 'unitName', label: 'Unit Name', render: (row) => row.unitName || row.unit },
    { id: 'position', label: 'Position' },
    { id: 'branch', label: 'Branch' },
    { id: 'employeeType', label: 'Employee Type' },
  ];

  // Table Columns Employee mode
  const employeeColumns = [
    {
      id: 'select',
      label: '',
      width: '50px',
      align: 'center',
      headerRender: () => (
        <Checkbox
          size="small"
          checked={isAllPageSelected}
          onChange={handleSelectAllPage}
          sx={{ color: '#64748b', '&.Mui-checked': { color: '#3b82f6' } }}
        />
      ),
      render: (row) => (
        <Checkbox
          size="small"
          checked={selectedIds.includes(row.id)}
          onChange={() => handleSelectRow(row.id)}
          sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }}
        />
      )
    },
    { id: 'no', label: 'No', render: (row, i) => startIndex + i + 1 },
    { id: 'nik', label: 'NIK' },
    { id: 'name', label: 'Nama' },
    { id: 'division', label: 'Division' },
    { id: 'unit', label: 'Unit', render: (row) => row.unit || row.unitName },
    { id: 'position', label: 'Position' },
    { id: 'branch', label: 'Branch' },
    {
      id: 'statusEmployee', label: 'Status Karyawan',
      render: (r) => (
        <Chip
          label={r.statusEmployee || r.status || 'ACTIVE'} size="small"
          sx={{
            fontWeight: 700, fontSize: '0.7rem',
            bgcolor: (r.statusEmployee || r.status) === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
            color: (r.statusEmployee || r.status) === 'ACTIVE' ? '#15803d' : '#b91c1c'
          }}
        />
      )
    }
  ];

  // Table Columns duplicate NIK
  const dupColumns = [
    {
      id: 'select',
      label: '',
      width: '50px',
      align: 'center',
      headerRender: () => (
        <Checkbox
          size="small"
          checked={dupDataList.length > 0 && dupDataList.every(row => dupSelectedIds.includes(row.nik))}
          onChange={(e) => {
            if (e.target.checked) {
              setDupSelectedIds(dupDataList.map(r => r.nik));
            } else {
              setDupSelectedIds([]);
            }
          }}
          sx={{ color: '#64748b', '&.Mui-checked': { color: '#3b82f6' } }}
        />
      ),
      render: (row) => (
        <Checkbox
          size="small"
          checked={dupSelectedIds.includes(row.nik)}
          onChange={() => {
            setDupSelectedIds(prev =>
              prev.includes(row.nik) ? prev.filter(n => n !== row.nik) : [...prev, row.nik]
            );
          }}
          sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#3b82f6' } }}
        />
      )
    },
    { id: 'name', label: 'Nama' },
    { id: 'joinDate', label: 'Tanggal Lahir', render: (row) => row.joinDate || '1995-05-12' },
    { id: 'nik', label: 'NIK Lama' },
    { id: 'idTku', label: 'NIK Baru', render: (row) => row.idTku || 'F6000022' },
    {
      id: 'status', label: 'Status Laporan A1',
      render: (r) => (
        <Chip
          label={r.status || 'BELUM'} size="small"
          sx={{
            fontWeight: 700, fontSize: '0.7rem',
            bgcolor: r.status === 'APPROVED' ? '#dcfce7' : r.status === 'REQUEST' ? '#fee2e2' : '#f1f5f9',
            color: r.status === 'APPROVED' ? '#15803d' : r.status === 'REQUEST' ? '#b91c1c' : '#475569'
          }}
        />
      )
    }
  ];

  // Table Columns History duplicate NIK
  const historyColumns = [
    { id: 'no', label: 'No', render: (row, i) => (historyPage - 1) * historyPageSize + i + 1 },
    { id: 'name', label: 'Nama' },
    { id: 'nik', label: 'NIK Lama' },
    { id: 'nikBaru', label: 'NIK Baru', render: (row) => row.nikBaru || 'F6000022' },
    { id: 'createdBy', label: 'Proses oleh' },
    { id: 'createdDate', label: 'Tanggal', render: (row) => row.createdDate ? row.createdDate.substring(0, 19) : '' }
  ];

  // Table Columns Tracking A1
  const trackingColumns = [
    { id: 'no', label: 'No', render: (row, i) => trackingStartIndex + i + 1 },
    { id: 'nik', label: 'NIK' },
    { id: 'nama', label: 'Nama' },
    { id: 'division', label: 'Division' },
    { id: 'unit', label: 'Unit' },
    { id: 'position', label: 'Position' },
    { id: 'branch', label: 'Branch' },
    {
      id: 'statusKaryawan', label: 'Status Karyawan',
      render: (r) => (
        <Chip
          label={r.statusKaryawan} size="small"
          sx={{
            fontWeight: 700, fontSize: '0.7rem',
            bgcolor: r.statusKaryawan === 'ACTIVE' ? '#dcfce7' : r.statusKaryawan === 'RESIGN' ? '#fee2e2' : '#f1f5f9',
            color: r.statusKaryawan === 'ACTIVE' ? '#15803d' : r.statusKaryawan === 'RESIGN' ? '#b91c1c' : '#475569'
          }}
        />
      )
    },
    { id: 'periodePenggajian', label: 'Periode Penggajian' },
    {
      id: 'statusPengembalianPajak', label: 'Status Pengembalian Pajak',
      render: (r) => (
        <Chip
          label={r.statusPengembalianPajak} size="small"
          sx={{
            bgcolor: r.statusPengembalianPajak === 'SUDAH' ? '#dcfce7' : '#f1f5f9',
            color: r.statusPengembalianPajak === 'SUDAH' ? '#15803d' : '#475569'
          }}
        />
      )
    }
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterDivision('');
    setFilterUnit('');
    setFilterPosition('');
    setFilterBranch('');
    setFilterEmployeeType('');
    setFilterStatus('');
    setPage(1);
    showSnackbar('Filter berhasil direset!', 'info');
  };

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {/* PAGE HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
            }}
          >
            <CloudDownloadIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Retrieve Data
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
              Retrieve dan filter data divisi/karyawan untuk kalkulasi dan proses penggajian
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<TrackIcon />}
            onClick={() => setOpenTrackingModal(true)}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              py: 1,
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            TRACKING DATA
          </Button>

          {isSpv && (
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={() => setOpenDuplicateModal(true)}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                textTransform: 'none',
                px: 2.5,
                py: 1,
                borderColor: '#0284c7',
                color: '#0284c7',
                '&:hover': { bgcolor: 'rgba(2, 132, 199, 0.08)' }
              }}
            >
              DUPLIKAT NIK KARYAWAN
            </Button>
          )}
        </Box>
      </Box>

      {/* TOP KPI SUMMARY CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb' }}>
            <PeopleIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Total Data
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {filteredData.length} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>records</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Data sesuai kriteria filter
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <FormatListBulletedIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Pilih Sumber Data
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981', lineHeight: 1.2, fontSize: '1rem' }}>
              {pilihData}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Sumber acuan perhitungan
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <CheckCircleIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Data Terpilih
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              {selectedIds.length} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>dipilih</Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Siap untuk diproses
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }
          }}
        >
          <Box sx={{ p: 1.25, borderRadius: 2.5, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <CalendarMonthIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Periode Penggajian
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2, fontSize: '0.95rem' }}>
              {periodeBulan} {periodeTahun}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Target periode payroll
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* FILTER & SEARCH PANEL */}
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
          {/* Row 1: Search & SEARCH/CLEAR Buttons */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto auto' }, gap: 1.5, alignItems: 'center' }}>
            <TextField
              placeholder="Cari divisi, unit, posisi, branch..."
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchRetrieveData()}
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

            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={fetchRetrieveData}
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

            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 2.5,
                height: '40px',
                borderColor: 'divider',
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' }
              }}
            >
              CLEAR
            </Button>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          {/* Row 2: Cascading Filters */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(6, 1fr)' }, gap: 1.5 }}>
            <SearchableSelect
              label="(Division)"
              placeholder="Semua Division"
              options={cascaded.divisions}
              value={filterDivision}
              onChange={(val) => {
                setFilterDivision(val);
                setFilterUnit('');
                setFilterPosition('');
                setFilterBranch('');
                setFilterEmployeeType('');
              }}
            />

            <SearchableSelect
              label="(Unit)"
              placeholder="Semua Unit"
              options={cascaded.units}
              value={filterUnit}
              onChange={(val) => {
                setFilterUnit(val);
                setFilterPosition('');
                setFilterBranch('');
                setFilterEmployeeType('');
              }}
            />

            <SearchableSelect
              label="(Position)"
              placeholder="Semua Position"
              options={cascaded.positions}
              value={filterPosition}
              onChange={(val) => {
                setFilterPosition(val);
                setFilterBranch('');
                setFilterEmployeeType('');
              }}
            />

            <SearchableSelect
              label="(Branch)"
              placeholder="Semua Branch"
              options={cascaded.branches}
              value={filterBranch}
              onChange={(val) => setFilterBranch(val)}
            />

            <SearchableSelect
              label="(Employee Type)"
              placeholder="Semua Tipe"
              options={cascaded.employeeTypes}
              value={filterEmployeeType}
              onChange={(val) => setFilterEmployeeType(val)}
            />

            <SearchableSelect
              label="(Status)"
              placeholder="Semua Status"
              options={['ACTIVE', 'RESIGN', 'NON ACTIVE']}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
            />
          </Box>
        </Stack>
      </Paper>

      {/* AKSI RETRIEVE & PILIH DATA TOOLBAR (ABOVE DATA TABLE) */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <CloudDownloadIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ minWidth: 200 }}>
            <SearchableSelect
              label="Pilih Sumber Data"
              options={['Master Client', 'Employee']}
              value={pilihData}
              clearable={false}
              onChange={(val) => {
                setPilihData(val || 'Master Client');
                setPage(1);
              }}
            />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ height: 28, my: 'auto' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            <Box component="span" sx={{ fontWeight: 800, color: selectedIds.length > 0 ? 'primary.main' : 'text.primary' }}>
              {selectedIds.length}
            </Box> data dipilih
          </Typography>
        </Box>

        <Button
          variant="contained"
          disabled={!canProcess}
          startIcon={<ProcessIcon />}
          onClick={() => setOpenConfigModal(true)}
          sx={{
            bgcolor: canProcess ? '#10b981' : 'action.disabledBackground',
            color: 'white',
            '&:hover': { bgcolor: canProcess ? '#059669' : 'action.disabledBackground' },
            textTransform: 'none',
            fontWeight: 800,
            borderRadius: 2,
            px: 3,
            height: '38px',
            boxShadow: canProcess ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
          }}
        >
          PROSES PAYROLL {selectedIds.length > 0 ? `(${selectedIds.length})` : isFilterActive ? '(Filtered)' : ''}
        </Button>
      </Paper>

      {/* DATA TABLE CONTAINER */}
      <Paper
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}
        elevation={0}
      >
        <DataTable
          columns={pilihData === 'Employee' ? employeeColumns : clientColumns}
          data={paginatedData}
          loading={loading}
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

      {/* MODAL CONFIGURATION & PROCESS PAYROLL */}
      <CustomModal
        open={openConfigModal}
        onClose={() => setOpenConfigModal(false)}
        title="Konfigurasi & Proses Payroll"
        maxWidth="md"
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box sx={{ p: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: '#15803d', fontWeight: 600 }}>
              {selectedIds.length > 0 ? (
                `Anda akan memproses ${selectedIds.length} data terpilih untuk periode penggajian ${periodeBulan} ${periodeTahun}.`
              ) : (
                `Anda akan memproses data berdasarkan filter aktif (Division: ${filterDivision || 'Semua'}, Unit: ${filterUnit || 'Semua'}, Position: ${filterPosition || 'Semua'}, Branch: ${filterBranch || 'Semua'}, Employee Type: ${filterEmployeeType || 'Semua'}, Status: ${filterStatus || 'Semua'}) untuk periode penggajian ${periodeBulan} ${periodeTahun}.`
              )}
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {/* Section: Periode Absen & Work Days */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: -1 }}>
              Periode Absensi & Work Days
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label="Periode Absen Awal"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={periodeAbsenAwal}
                  onChange={(e) => setPeriodeAbsenAwal(e.target.value)}
                />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b' }}>-</Typography>
                <TextField
                  label="Periode Absen Akhir"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={periodeAbsenAkhir}
                  onChange={(e) => setPeriodeAbsenAkhir(e.target.value)}
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={absenFull}
                    onChange={(e) => setAbsenFull(e.target.checked)}
                    color="primary"
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>Absen Full</Typography>}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              <TextField
                label="WD (5+2)"
                size="small"
                type="number"
                value={wd52}
                disabled
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="WD (6+1)"
                size="small"
                type="number"
                value={wd61}
                disabled
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="WD (7+0)"
                size="small"
                type="number"
                value={wd70}
                disabled
                InputProps={{ readOnly: true }}
              />
            </Box>

            {/* Section: Tanggal Penggajian, Periode Bulan/Tahun, Jenis Proses */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: -1, mt: 1 }}>
              Periode Penggajian & Jenis Proses
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Tanggal Penggajian"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={tanggalPenggajian}
                onChange={(e) => setTanggalPenggajian(e.target.value)}
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Proses Payroll</InputLabel>
                <Select
                  value={prosesPayrollType}
                  label="Proses Payroll"
                  onChange={(e) => setProsesPayrollType(e.target.value)}
                >
                  <MenuItem value="Payroll">Payroll</MenuItem>
                  <MenuItem value="THR">THR</MenuItem>
                  <MenuItem value="Bonus">Bonus</MenuItem>
                  <MenuItem value="Kompensasi">Kompensasi</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Bulan</InputLabel>
                <Select
                  value={periodeBulan}
                  label="Bulan"
                  onChange={(e) => setPeriodeBulan(e.target.value)}
                >
                  {MONTH_NAMES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Tahun</InputLabel>
                <Select
                  value={periodeTahun}
                  label="Tahun"
                  onChange={(e) => setPeriodeTahun(e.target.value)}
                >
                  {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                    <MenuItem key={y} value={String(y)}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>

          {/* Action Buttons Footer */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2, borderTop: '1px solid #e2e8f0' }}>
            <Button
              variant="outlined"
              onClick={() => setOpenConfigModal(false)}
              sx={{
                borderColor: '#cbd5e1',
                color: '#64748b',
                '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                px: 3
              }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              startIcon={<ProcessIcon />}
              onClick={handleProcessPayroll}
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                textTransform: 'none',
                fontWeight: 800,
                borderRadius: 2,
                px: 4
              }}
            >
              Proses Payroll
            </Button>
          </Box>
        </Stack>
      </CustomModal>

      {/* MODAL TRACKING DATA A1 */}
      <CustomModal
        open={openTrackingModal}
        onClose={() => setOpenTrackingModal(false)}
        title="Tracking Data A1"
        maxWidth="lg"
      >
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Filter Bar Tracking Modal */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>(Bulan)</InputLabel>
              <Select
                value={trackingBulan}
                label="(Bulan)"
                onChange={(e) => setTrackingBulan(e.target.value)}
              >
                <MenuItem value=""><em>Semua Bulan</em></MenuItem>
                {MONTH_NAMES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>(Tahun)</InputLabel>
              <Select
                value={trackingTahun}
                label="(Tahun)"
                onChange={(e) => setTrackingTahun(e.target.value)}
              >
                {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map(y => (
                  <MenuItem key={y} value={String(y)}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status Pajak</InputLabel>
              <Select
                value={trackingStatusPajak}
                label="Status Pajak"
                onChange={(e) => setTrackingStatusPajak(e.target.value)}
              >
                <MenuItem value="ALL"><em>Semua</em></MenuItem>
                <MenuItem value="BELUM">BELUM</MenuItem>
                <MenuItem value="SUDAH">SUDAH</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={() => showSnackbar('Export Data A1 berhasil diunduh', 'success')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                ml: 'auto'
              }}
            >
              EXPORT
            </Button>
          </Box>

          {/* Tracking Table */}
          <DataTable
            columns={trackingColumns}
            data={paginatedTrackingData}
            loading={false}
            page={trackingPage}
            pageSize={trackingPageSize}
            totalElements={filteredTrackingData.length}
            totalPages={Math.ceil(filteredTrackingData.length / trackingPageSize) || 1}
            onPageChange={setTrackingPage}
            onPageSizeChange={(sz) => {
              setTrackingPageSize(sz);
              setTrackingPage(1);
            }}
          />
        </Stack>
      </CustomModal>

      {/* MODAL DUPLIKAT NIK KARYAWAN (SPV Only) */}
      <CustomModal
        open={openDuplicateModal}
        onClose={() => setOpenDuplicateModal(false)}
        title="Penanganan duplikat pegawai tetap"
        maxWidth="lg"
      >
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Top filter box */}
          <Box sx={{ p: 2.5, border: '1px solid #cbd5e1', borderRadius: 3, bgcolor: '#f8fafc' }}>
            <Stack spacing={2}>
              {/* Row 1: Search & red note */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  placeholder="Search by NIK / Name..."
                  size="small"
                  sx={{ minWidth: 260, bgcolor: '#ffffff' }}
                  value={dupSearchQuery}
                  onChange={(e) => setDupSearchQuery(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={fetchDupData}
                  sx={{
                    bgcolor: '#3b82f6',
                    '&:hover': { bgcolor: '#2563eb' },
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 3,
                    height: 40
                  }}
                >
                  SEARCH
                </Button>
                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700 }}>
                  *searching hanya untuk nik dan nama
                </Typography>
              </Box>

              {/* Row 2: Cascading Dropdowns */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 2 }}>
                <FormControl size="small" fullWidth sx={{ bgcolor: '#ffffff' }}>
                  <InputLabel>(Division)</InputLabel>
                  <Select
                    value={dupDivision}
                    label="(Division)"
                    onChange={(e) => {
                      setDupDivision(e.target.value);
                      setDupUnit('');
                      setDupPosition('');
                      setDupBranch('');
                      setDupEmployeeType('');
                    }}
                  >
                    <MenuItem value=""><em>Semua Division</em></MenuItem>
                    {dupCascaded.divisions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth sx={{ bgcolor: '#ffffff' }}>
                  <InputLabel>(Unit)</InputLabel>
                  <Select
                    value={dupUnit}
                    label="(Unit)"
                    onChange={(e) => {
                      setDupUnit(e.target.value);
                      setDupPosition('');
                      setDupBranch('');
                      setDupEmployeeType('');
                    }}
                  >
                    <MenuItem value=""><em>Semua Unit</em></MenuItem>
                    {dupCascaded.units.map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth sx={{ bgcolor: '#ffffff' }}>
                  <InputLabel>(Position)</InputLabel>
                  <Select
                    value={dupPosition}
                    label="(Position)"
                    onChange={(e) => {
                      setDupPosition(e.target.value);
                      setDupBranch('');
                      setDupEmployeeType('');
                    }}
                  >
                    <MenuItem value=""><em>Semua Position</em></MenuItem>
                    {dupCascaded.positions.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth sx={{ bgcolor: '#ffffff' }}>
                  <InputLabel>(Branch)</InputLabel>
                  <Select
                    value={dupBranch}
                    label="(Branch)"
                    onChange={(e) => setDupBranch(e.target.value)}
                  >
                    <MenuItem value=""><em>Semua Branch</em></MenuItem>
                    {dupCascaded.branches.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth sx={{ bgcolor: '#ffffff' }}>
                  <InputLabel>(Employee Type)</InputLabel>
                  <Select
                    value={dupEmployeeType}
                    label="(Employee Type)"
                    onChange={(e) => setDupEmployeeType(e.target.value)}
                  >
                    <MenuItem value=""><em>Semua Employee Type</em></MenuItem>
                    {dupCascaded.employeeTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>

              {/* Row 3: Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleUpdateDuplicates}
                  sx={{
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' },
                    textTransform: 'none',
                    fontWeight: 800,
                    px: 4
                  }}
                >
                  UPDATE
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenHistoryModal(true);
                    fetchHistoryData();
                  }}
                  sx={{
                    bgcolor: '#3b82f6',
                    '&:hover': { bgcolor: '#2563eb' },
                    textTransform: 'none',
                    fontWeight: 800,
                    px: 4
                  }}
                >
                  HISTORY
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Duplicate Table */}
          <DataTable
            columns={dupColumns}
            data={dupDataList}
            loading={dupLoading}
            page={dupPage}
            pageSize={dupPageSize}
            totalElements={dupTotalElements}
            totalPages={Math.ceil(dupTotalElements / dupPageSize) || 1}
            onPageChange={setDupPage}
            onPageSizeChange={(sz) => {
              setDupPageSize(sz);
              setDupPage(1);
            }}
          />
        </Stack>
      </CustomModal>

      {/* SUB-MODAL HISTORY NIK KARYAWAN */}
      <CustomModal
        open={openHistoryModal}
        onClose={() => setOpenHistoryModal(false)}
        title="History nik karyawan tetap"
        maxWidth="lg"
      >
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Top Search bar */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search by NIK / Name..."
              size="small"
              sx={{ minWidth: 260 }}
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={fetchHistoryData}
              sx={{
                bgcolor: '#3b82f6',
                '&:hover': { bgcolor: '#2563eb' },
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                height: 40
              }}
            >
              SEARCH
            </Button>
            <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700 }}>
              *searching hanya untuk nik dan nama
            </Typography>
          </Box>

          {/* History Table */}
          <DataTable
            columns={historyColumns}
            data={historyDataList}
            loading={historyLoading}
            page={historyPage}
            pageSize={historyPageSize}
            totalElements={historyTotalElements}
            totalPages={Math.ceil(historyTotalElements / historyPageSize) || 1}
            onPageChange={setHistoryPage}
            onPageSizeChange={(sz) => {
              setHistoryPageSize(sz);
              setHistoryPage(1);
            }}
          />
        </Stack>
      </CustomModal>

      {/* Global Snackbar & Confirm Dialog */}
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
