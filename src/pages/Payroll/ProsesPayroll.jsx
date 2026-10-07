import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, Select, FormControl, InputLabel,
  Stack, Chip, Checkbox, FormControlLabel, CircularProgress, IconButton, Tooltip, Grid, Divider, DialogContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment, Tabs, Tab, Avatar,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as ProcessIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as UploadIcon,
  Calculate as CalculateIcon,
  Send as SendIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowBack as ArrowBackIcon,
  FolderOpen as FolderOpenIcon,
  Remove as RemoveIcon,
  Close as CloseIcon,
  Payments as PaymentsIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  InfoOutlined as InfoOutlinedIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonOutlineIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalanceWallet as WalletIcon,
  History as HistoryIcon,
  EventAvailable as EventAvailableIcon,
  Style as StyleIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import SearchableSelect from '../../components/Common/SearchableSelect';
import { useCascadingDropdowns } from '../../hooks/useCascadingDropdowns';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const INITIAL_PAYROLL_DATA = [
  {
    id: 101,
    nik: 'D8241047',
    name: 'I MADE VERI ANTARA',
    employeeType: 'PKWT',
    division: 'Juara Coding',
    unitName: 'AIR ASIA',
    position: 'Aircraft Cleaning',
    branch: 'DENPASAR',
    joinDate: '2020-01-01',
    resignDate: '',
    statusEmployee: 'ACTIVE',
    periodeStart: '2025-08-01',
    periodeEnd: '2025-08-31',
    absen: 0,
    metodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    statusPayroll: 'REJECTED',
    statusData: 'REJECTED',
    basicSalary: 4500000,
    grossSalary: 4500000,
    statusBayar: 'UNPAID',
    reasonReject: 'cek lagiii',
    createdDate: '2025-08-11 15:08:51.0',
    dynamicComponents: []
  },
  {
    id: 102,
    nik: 'D8250624',
    name: 'SINTIA DORA EDELINA SILALAHI',
    employeeType: 'PKWT',
    division: 'Halo BCA',
    unitName: 'Halo BCA - Inbound',
    position: 'Call Center Officer',
    branch: 'TANGERANG',
    joinDate: '2021-03-15',
    resignDate: '',
    statusEmployee: 'ACTIVE',
    periodeStart: '2025-08-01',
    periodeEnd: '2025-08-31',
    absen: 0,
    metodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    statusPayroll: 'REJECTED',
    statusData: 'REJECTED',
    basicSalary: 4800000,
    grossSalary: 4800000,
    statusBayar: 'UNPAID',
    reasonReject: 'yash',
    createdDate: '2025-08-11 15:11:21.0',
    dynamicComponents: []
  },
  {
    id: 103,
    nik: 'D8250900',
    name: 'SITI SARAH',
    employeeType: 'PKWT',
    division: 'Adira Finance',
    unitName: 'Adira Finance',
    position: 'Telecenter Agent',
    branch: 'Kabupaten Tangerang',
    joinDate: '2022-04-10',
    resignDate: '',
    statusEmployee: 'ACTIVE',
    periodeStart: '2025-08-01',
    periodeEnd: '2025-08-31',
    absen: 0,
    metodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    statusPayroll: 'REJECTED',
    statusData: 'REJECTED',
    basicSalary: 4500000,
    grossSalary: 4500000,
    statusBayar: 'UNPAID',
    reasonReject: 'dscvx',
    createdDate: '2025-08-12 10:01:04.0',
    dynamicComponents: []
  },
  {
    id: 1,
    nik: 'D6250006',
    name: 'ANIFSQA09',
    employeeType: 'MAGANG',
    division: 'Operational',
    unitName: 'Sysmex',
    position: 'TS',
    branch: 'JAKARTA',
    joinDate: '2025-02-26',
    resignDate: '',
    statusEmployee: 'ACTIVE',
    periodeStart: '2026-01-01',
    periodeEnd: '2026-01-31',
    absen: 0,
    metodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    statusPayroll: 'NEW',
    statusData: 'NEW',
    basicSalary: 5000000,
    grossSalary: 5500000,
    statusBayar: 'UNPAID',
    dynamicComponents: [
      { code: 'ALLOW_TRANSPORT', name: 'Tunjangan Transport', amount: 500000, type: 'EARNING', isTaxable: true }
    ]
  },
  {
    id: 2,
    nik: 'D6250016',
    name: 'CHIARA ESPOSITO',
    employeeType: 'MAGANG',
    division: 'Operational',
    unitName: 'Sysmex',
    position: 'Kurir Pickup',
    branch: 'BANYUWANGI',
    joinDate: '2025-05-30',
    resignDate: '',
    statusEmployee: 'ACTIVE',
    periodeStart: '2026-01-01',
    periodeEnd: '2026-01-31',
    absen: 31,
    metodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    statusPayroll: 'NEW',
    statusData: 'NEW',
    basicSalary: 4000000,
    grossSalary: 4200000,
    statusBayar: 'UNPAID',
    dynamicComponents: [
      { code: 'ALLOW_TRANSPORT', name: 'Tunjangan Transport', amount: 200000, type: 'EARNING', isTaxable: true }
    ]
  },
  {
    id: 3,
    nik: 'D7240299',
    name: 'PRISKA SULISTIAWATI',
    employeeType: 'MITRA',
    division: 'Operational',
    unitName: 'Sysmex',
    position: 'Sales Canvassing',
    branch: 'Jakarta Barat',
    joinDate: '2024-08-26',
    resignDate: '',
    statusEmployee: 'ACTIVE',
    periodeStart: '2026-01-01',
    periodeEnd: '2026-01-31',
    absen: 0,
    metodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    statusPayroll: 'NEW',
    statusData: 'NEW',
    basicSalary: 5500000,
    grossSalary: 6000000,
    statusBayar: 'UNPAID',
    dynamicComponents: [
      { code: 'ALLOW_MEAL', name: 'Tunjangan Makan', amount: 500000, type: 'EARNING', isTaxable: true }
    ]
  },
  {
    id: 4,
    nik: 'D7250001',
    name: 'JOHAR NAVISYAH',
    employeeType: 'MITRA',
    division: 'Operational',
    unitName: 'Teknologi International Nusantara',
    position: 'Desk Collection',
    branch: 'BANYUWANGI',
    joinDate: '2023-04-13',
    resignDate: '',
    statusEmployee: 'ACTIVE',
    periodeStart: '2026-01-01',
    periodeEnd: '2026-01-31',
    absen: 0,
    metodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    statusPayroll: 'NEW',
    statusData: 'NEW',
    basicSalary: 4500000,
    grossSalary: 5000000,
    statusBayar: 'UNPAID',
    dynamicComponents: [
      { code: 'ALLOW_TRANSPORT', name: 'Tunjangan Transport', amount: 500000, type: 'EARNING', isTaxable: true }
    ]
  },
  {
    id: 5,
    nik: 'F1240001',
    name: 'AMIN SAEPUDINDDDDDD',
    employeeType: 'MITRA',
    division: 'Operational',
    unitName: 'Sysmex',
    position: 'Sales Akuisisi Merchant',
    branch: 'CIREBON',
    joinDate: '2024-09-03',
    resignDate: '',
    statusEmployee: 'ACTIVE',
    periodeStart: '2026-01-01',
    periodeEnd: '2026-01-31',
    absen: 31,
    metodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    statusPayroll: 'NEW',
    statusData: 'NEW',
    basicSalary: 4500000,
    grossSalary: 4800000,
    statusBayar: 'UNPAID',
    dynamicComponents: [
      { code: 'ALLOW_MEAL', name: 'Tunjangan Makan', amount: 300000, type: 'EARNING', isTaxable: true }
    ]
  }
];

export default function ProsesPayroll() {
  const { user } = useSelector((state) => state.auth);
  const isSpv = user?.position?.toUpperCase()?.includes('SPV') || user?.position?.toUpperCase()?.includes('SUPERVISOR') || user?.position?.toUpperCase()?.includes('IT');

  // States
  const [dataList, setDataList] = useState(INITIAL_PAYROLL_DATA);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Search & Basic Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  // Cascading Dropdown Filters
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterStatusEmployee, setFilterStatusEmployee] = useState('');

  // Status & Detail Filters
  const [filterStatusData, setFilterStatusData] = useState('');
  const [filterStatusBayar, setFilterStatusBayar] = useState('');
  const [filterPengembalianPajak, setFilterPengembalianPajak] = useState('');

  // Upload state
  const [uploadType, setUploadType] = useState('');
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openHistoryRejectedModal, setOpenHistoryRejectedModal] = useState(false);
  const [rejectSearch, setRejectSearch] = useState('');
  const [rejectFilterUnit, setRejectFilterUnit] = useState('');
  const [rejectFilterPosition, setRejectFilterPosition] = useState('');
  const [rejectFilterBranch, setRejectFilterBranch] = useState('');
  const [rejectFilterEmployeeType, setRejectFilterEmployeeType] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingInBackground, setIsUploadingInBackground] = useState(false);
  const [isProgressMinimized, setIsProgressMinimized] = useState(false);
  const [backgroundProcessName, setBackgroundProcessName] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadPeriodeStart, setUploadPeriodeStart] = useState('2026-08-01');
  const [uploadPeriodeEnd, setUploadPeriodeEnd] = useState('2026-08-21');
  const [uploadKategoriRapelan, setUploadKategoriRapelan] = useState([]);
  const [uploadLemburPeriode, setUploadLemburPeriode] = useState('');
  const [uploadLemburTahun, setUploadLemburTahun] = useState('');
  
  // Sorting States
  const [sortMonth, setSortMonth] = useState('January');
  const [sortOrder, setSortOrder] = useState('ASCENDING');
  const [sortBy, setSortBy] = useState('nik');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dropdown combinations state
  const [ddCombinations, setDdCombinations] = useState([]);

  // Modals States
  const [openSpecialCaseModal, setOpenSpecialCaseModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openBpjsModal, setOpenBpjsModal] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Tab States
  const [addTab, setAddTab] = useState(0);
  const [detailTab, setDetailTab] = useState(0);

  // Selected row/employee for details/edit
  const [selectedRow, setSelectedRow] = useState(null);

  // Form states for Add Employee (Special Case)
  const [addForm, setAddForm] = useState({
    nik: '', name: '', division: '', unitName: '', position: '', employeeType: '', branch: '', statusEmployee: 'ACTIVE', resignDate: '',
    periodeStart: '', periodeEnd: '', salaryType: '', worksDays: '', absen: 0, bpjsTkType: '', manajemenFee: '0.0', metodePajak: '', komponenProject: '',
    tunjanganTetap: [], tunjanganTidakTetap: [],
    tunjanganJabatanVal: '', tunjanganMakanVal: '', tunjanganTransportVal: '',
    insentifBulananVal: '', uangLemburVal: '', bonusKerajinanVal: '',
    gradingAllowanceVal: '', montlyAllowanceVal: '',
    insentif: '', lembur: '', productivity: '', tjKesehatan: '', performancePay: '', bonusNonUpah: '', monthlyCommission: '', shiftAllowance: '', thr: '', kompensasi: '',
    specialTreatment: { biayaJasaTraining: false, bonus: false },
    rapelan: '', tunjanganLain: '', tunjanganLainNonTax: '',
    wagely: '', potonganLain: '', potonganLainNonTax: '', keterangan: '',
    bpjsTk: '', bpjsKesehatan: '', jkk: '', jkm: '', jht: '', asuransiKesehatan: '', asuransiKecelakaan: '', premiAsuransi: '', ditanggungOleh: ''
  });

  // Form states for Edit / Detail Employee
  const [editForm, setEditForm] = useState({
    nik: '', name: '', employeeType: '', position: '', unitName: '', joinDate: '', pengembalianPajak: '',
    tunjanganTetap: [], tunjanganTidakTetap: [],
    rapelanPeriodeStart: '', rapelanPeriodeEnd: '', rapelanAbsen: 0, rapelanTotalHariKerja: 0, rapelanKategori: [],
    bulanIniPeriodeStart: '', bulanIniPeriodeEnd: '', bulanIniAbsen: 0, bulanIniTotalHariKerja: 0,
    salaryType: '', basicSalary: 0, perubahanGajiPokok: 0, grossSalary: 0,
    bpjsTkType: '', modeUpahBpjsTk: '', upahBpjsTk: '', dub: '', bpjsKetenagakerjaan: '', bpjsKesehatan: '',
    bpuJkk: 0, bpuJht: 0, bpuJkm: 0, asuransiKesehatan: 0, asuransiKecelakaan: 0, premiAsuransi: 0, ditanggungOleh: '',
    insentif: 0, lembur: 0, modeLembur: '', tjKesehatan: 0, performancePay: 0, monthlyCommission: 0, shiftAllowance: 0, bonus: 0, biayaJasaTraining: 0, thr: 0, kompensasi: 0, 
    insentifPerformance: 0, insentifShifting: 0, insentifTrainer: 0, insentifNonTrainer: 0, insentifDifa: 0,
    insentifKuantitatif: 0, insentifKualitatif: 0, insentifAht: 0, insentifMotivational: 0, rewardKehadiran: 0, garansiKomisi: 0, addSalaryProject: 0, additionalSalary: 0, additionalSalaryRetention: 0, natura: 0, naturaKesehatan: 0, naturaKendaraan: 0,
    modeRapelan: '', rapelan: 0, tunjanganLain: 0, tunjanganLainNonTax: 0, reimbursement: 0,
    wagely: 0, potonganLain: 0, potonganLainNonTax: 0, potonganAbsen: 0, potonganThr: 0, potonganThrNonTax: 0, potonganDeposit: 0, denda: 0, potonganHte: 0, potonganIndodana: 0, potonganKeterlambatan: 0, potonganKu: 0, potonganNatura: 0, potonganNaturaKendaraan: 0,
    potonganNaturaKesehatan: 0, potonganParkir: 0, potonganSeragam: 0, potonganSp: 0, potonganSaResign: 0, potonganTagihan: 0,
    tunjanganJabatanVal: 0, tunjanganMakanVal: 0, tunjanganTransportVal: 0, insentifBulananVal: 0, uangLemburVal: 0, bonusKerajinanVal: 0, keterangan: ''
  });

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // Cascading dropdowns hook
  const cascaded = useCascadingDropdowns(ddCombinations, {
    division: filterDivision,
    unit: filterUnit,
    position: filterPosition,
    employeeType: filterEmployeeType,
    branch: filterBranch
  });

  // UI state notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // Fetch Dropdown Combinations on mount
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

  // Fetch payroll transactions (mock / API)
  const fetchPayrollTransactions = useCallback(() => {
    setLoading(true);
    // Since this is a high fidelity FE mock task first, we fetch from our local states
    // but try backend first in case there is some endpoint
    axios.get(`${API_URL}/api/v1/payroll/transactions`, { headers: getAuthHeader() })
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          // If backend has transactions, map them with mocks or display
          // Currently backend does not have transaction endpoints, so fallback to local
        }
      })
      .catch(err => {
        console.log('Using local mock data for payroll transactions', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPayrollTransactions();
  }, [fetchPayrollTransactions]);

  // Handle row selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedData.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter local data
  const filteredData = dataList.filter(row => {
    const q = searchQuery.toLowerCase();
    const matchQuery = !q || 
      row.nik.toLowerCase().includes(q) || 
      row.name.toLowerCase().includes(q) ||
      (row.position || '').toLowerCase().includes(q) ||
      (row.branch || '').toLowerCase().includes(q);

    const matchDiv = !filterDivision || row.division === filterDivision;
    const matchUnit = !filterUnit || row.unitName === filterUnit;
    const matchPos = !filterPosition || row.position === filterPosition;
    const matchBranch = !filterBranch || row.branch === filterBranch;
    const matchEmpType = !filterEmployeeType || row.employeeType === filterEmployeeType;
    const matchStatusEmp = !filterStatusEmployee || row.statusEmployee === filterStatusEmployee;
    const matchStatusData = !filterStatusData || row.statusData === filterStatusData;
    const matchStatusBayar = !filterStatusBayar || row.statusBayar === filterStatusBayar;
    
    // Period filter
    const matchStart = !filterStartDate || row.periodeStart >= filterStartDate;
    const matchEnd = !filterEndDate || row.periodeEnd <= filterEndDate;

    return matchQuery && matchDiv && matchUnit && matchPos && matchBranch && matchEmpType && matchStatusEmp && matchStatusData && matchStatusBayar && matchStart && matchEnd;
  });

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortBy] || '';
    let valB = b[sortBy] || '';

    if (typeof valA === 'string') {
      return sortOrder === 'ASCENDING' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    } else {
      return sortOrder === 'ASCENDING' 
        ? valA - valB 
        : valB - valA;
    }
  });

  // Pagination
  const startIndex = (page - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterDivision('');
    setFilterUnit('');
    setFilterPosition('');
    setFilterBranch('');
    setFilterEmployeeType('');
    setFilterStatusEmployee('');
    setFilterStatusData('');
    setFilterStatusBayar('');
    setFilterPengembalianPajak('');
  };

  // UPLOAD DATA Handler
  const startProcessSimulation = (type) => {
    if (!uploadFile) {
      showSnackbar('Pilih file terlebih dahulu!', 'warning');
      return;
    }
    setOpenUploadDialog(false);
    setIsUploadingInBackground(true);
    setUploadProgress(0);
    setIsProgressMinimized(false);
    setSelectedFileName(uploadFile.name);

    let displayType = 'Absen';
    if (type === 'TUNJANGAN') displayType = 'Tunjangan';
    if (type === 'PENGURANGAN') displayType = 'Pengurangan';
    if (type === 'BPJS') displayType = 'BPJS';
    if (type === 'LEMBUR') displayType = 'Lembur';
    if (type === 'ASURANSI') displayType = 'Asuransi';
    if (type === 'SPECIAL_INCENTIVE') displayType = 'Special Incentive';
    if (type === 'KENAIKAN_GAJI') displayType = 'Kenaikan Gaji Tahunan';
    setBackgroundProcessName(`Proses Upload Data ${displayType}...`);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploadingInBackground(false);
          setUploadFile(null);
          showSnackbar(`Upload file tipe ${displayType} berhasil disimulasikan!`, 'success');
        }, 500);
      } else {
        setUploadProgress(currentProgress);
      }
    }, 400);
  };

  const downloadTemplate = (type) => {
    let displayType = 'Absen';
    if (type === 'TUNJANGAN') displayType = 'Tunjangan';
    if (type === 'PENGURANGAN') displayType = 'Pengurangan';
    if (type === 'BPJS') displayType = 'BPJS';
    if (type === 'LEMBUR') displayType = 'Lembur';
    if (type === 'ASURANSI') displayType = 'Asuransi';
    if (type === 'SPECIAL_INCENTIVE') displayType = 'Special Incentive';
    if (type === 'KENAIKAN_GAJI') displayType = 'Kenaikan Gaji Tahunan';
    
    showSnackbar(`Template ${displayType} berhasil di-download!`, 'success');
  };

  const handleUploadData = () => {
    if (!uploadType) {
      showSnackbar('Pilih tipe file upload terlebih dahulu!', 'warning');
      return;
    }
    setOpenUploadDialog(true);
  };

  // DATA HAS BEEN PAID Handler
  const handleMarkAsPaid = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Pilih minimal satu data untuk diperbarui status bayarnya!', 'warning');
      return;
    }
    
    setConfirmDialog({
      open: true,
      title: 'Update Status Bayar',
      message: `Apakah Anda yakin ingin mengubah status bayar dari ${selectedIds.length} data terpilih menjadi PAID/LUNAS?`,
      onConfirm: () => {
        setConfirmDialog(c => ({ ...c, open: false }));
        setDataList(prev => 
          prev.map(row => 
            selectedIds.includes(row.id) ? { ...row, statusBayar: 'PAID' } : row
          )
        );
        setSelectedIds([]);
        showSnackbar('Status bayar berhasil diperbarui menjadi PAID!', 'success');
      }
    });
  };

  // GET HADIR Handler
  const handleGetHadir = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSnackbar('Sync data kehadiran berhasil ditarik dari HRIS!', 'success');
    }, 1500);
  };

  // REQUEST PAYROLL (Submit to SPV/Upliner)
  const handleRequestPayroll = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Pilih minimal satu data untuk diajukan approval!', 'warning');
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Request Approval Payroll',
      message: `Ajukan approval untuk ${selectedIds.length} data payroll terpilih?`,
      onConfirm: () => {
        setConfirmDialog(c => ({ ...c, open: false }));
        setDataList(prev => 
          prev.map(row => 
            selectedIds.includes(row.id) ? { ...row, statusData: 'REQUEST_APPROVAL', statusPayroll: 'REQUEST_APPROVAL' } : row
          )
        );
        setSelectedIds([]);
        showSnackbar('Permohonan payroll berhasil diajukan!', 'success');
      }
    });
  };

  // PROCESS PAYROLL (SPV Only)
  const handleProcessPayroll = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Pilih minimal satu data untuk diproses!', 'warning');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Process Payroll',
      message: `Proses payroll untuk ${selectedIds.length} data terpilih?`,
      onConfirm: () => {
        setConfirmDialog(c => ({ ...c, open: false }));
        setDataList(prev => 
          prev.map(row => 
            selectedIds.includes(row.id) ? { ...row, statusData: 'APPROVED', statusPayroll: 'PROCESSED' } : row
          )
        );
        setSelectedIds([]);
        showSnackbar('Data payroll berhasil diproses!', 'success');
      }
    });
  };

  // REJECT PAYROLL (SPV Only - Opens reason modal)
  const handleRejectPayroll = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Pilih minimal satu data untuk direject!', 'warning');
      return;
    }
    setRejectReason('');
    setOpenRejectDialog(true);
  };

  const handleConfirmRejectWithReason = () => {
    if (!rejectReason.trim()) {
      showSnackbar('Alasan penolakan (Reject Reason) wajib diisi!', 'warning');
      return;
    }
    setDataList(prev => 
      prev.map(row => 
        selectedIds.includes(row.id) 
          ? { ...row, statusData: 'REJECTED', statusPayroll: 'REJECTED', reasonReject: rejectReason.trim() } 
          : row
      )
    );
    setOpenRejectDialog(false);
    setSelectedIds([]);
    showSnackbar(`Data payroll (${selectedIds.length} data) berhasil direject dengan catatan!`, 'success');
  };

  // CEK PERHITUNGAN Handler
  const handleCalculateCalculations = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showSnackbar('Kalkulasi seluruh data payroll berhasil diperbarui!', 'success');
    }, 1200);
  };

  // Request Delete Handler
  const handleRequestDelete = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Pilih minimal satu data untuk didelete!', 'warning');
      return;
    }
    
    setConfirmDialog({
      open: true,
      title: 'Hapus Data Payroll',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data payroll terpilih?`,
      onConfirm: () => {
        setConfirmDialog(c => ({ ...c, open: false }));
        setDataList(prev => prev.filter(row => !selectedIds.includes(row.id)));
        setSelectedIds([]);
        showSnackbar('Data payroll terpilih berhasil dihapus!', 'success');
      }
    });
  };

  // Edit Modal triggers
  const handleOpenEditModal = (row) => {
    setSelectedRow(row);
    // Find matching components or default
    const getCompVal = (code) => {
      const c = row.dynamicComponents?.find(item => item.code === code);
      return c ? c.amount : 0;
    };
    
    setDetailTab(0);
    setEditForm({
      nik: row.nik,
      name: row.name,
      employeeType: row.employeeType,
      position: row.position,
      unitName: row.unitName,
      joinDate: row.joinDate || '2025-02-26',
      pengembalianPajak: row.pengembalianPajak || 'TIDAK',
      tunjanganTetap: row.tunjanganTetap || [],
      tunjanganTidakTetap: row.tunjanganTidakTetap || [],
      rapelanPeriodeStart: row.rapelanPeriodeStart || '2025-12-01',
      rapelanPeriodeEnd: row.rapelanPeriodeEnd || '2025-12-31',
      rapelanAbsen: row.rapelanAbsen || 0,
      rapelanTotalHariKerja: row.rapelanTotalHariKerja || 0,
      rapelanKategori: row.rapelanKategori ? (Array.isArray(row.rapelanKategori) ? row.rapelanKategori : row.rapelanKategori.split(',')) : [],
      bulanIniPeriodeStart: row.periodeStart,
      bulanIniPeriodeEnd: row.periodeEnd,
      bulanIniAbsen: row.absen,
      bulanIniTotalHariKerja: row.totalHariKerja || (row.absen > 0 ? row.absen : 22),
      salaryType: row.salaryType || 'Fix',
      basicSalary: row.basicSalary,
      perubahanGajiPokok: row.perubahanGajiPokok || 0,
      grossSalary: row.grossSalary,
      bpjsTkType: row.bpjsTkType || 'Variable',
      modeUpahBpjsTk: row.modeUpahBpjsTk || 'Gaji Pokok',
      upahBpjsTk: row.upahBpjsTk || row.basicSalary,
      dub: row.dub || '0.0',
      bpjsKetenagakerjaan: row.bpjsKetenagakerjaan || 'Yes',
      bpjsKesehatan: row.bpjsKesehatan || '1',
      bpuJkk: row.bpuJkk || 0,
      bpuJht: row.bpuJht || 0,
      bpuJkm: row.bpuJkm || 0,
      asuransiKesehatan: row.asuransiKesehatan || 0,
      asuransiKecelakaan: row.asuransiKecelakaan || 0,
      premiAsuransi: row.premiAsuransi || 0,
      ditanggungOleh: row.ditanggungOleh || 'Perusahaan',
      // Non Upah
      insentif: getCompVal('INSENTIF'),
      lembur: getCompVal('LEMBUR'),
      modeLembur: row.modeLembur || 'Normal',
      tjKesehatan: getCompVal('TJ_KESEHATAN'),
      performancePay: getCompVal('PERFORMANCE_PAY'),
      monthlyCommission: getCompVal('COMMISSION'),
      shiftAllowance: getCompVal('SHIFT_ALLOWANCE'),
      bonus: getCompVal('BONUS'),
      biayaJasaTraining: getCompVal('TRAINING'),
      thr: getCompVal('THR'),
      kompensasi: getCompVal('KOMPENSASI'),
      insentifPerformance: getCompVal('INSENTIF_PERF'),
      insentifShifting: getCompVal('INSENTIF_SHIFT'),
      insentifTrainer: getCompVal('INSENTIF_TRAIN'),
      insentifNonTrainer: getCompVal('INSENTIF_NONTRAIN'),
      insentifDifa: getCompVal('INSENTIF_DIFA'),
      insentifKuantitatif: getCompVal('INSENTIF_KUANTITATIF'),
      insentifKualitatif: getCompVal('INSENTIF_KUALITATIF'),
      insentifAht: getCompVal('INSENTIF_AHT'),
      insentifMotivational: getCompVal('INSENTIF_MOTIVATIONAL'),
      rewardKehadiran: getCompVal('REWARD_KEHADIRAN'),
      garansiKomisi: getCompVal('GARANSI_KOMISI'),
      addSalaryProject: getCompVal('ADD_SALARY_PROJECT'),
      additionalSalary: getCompVal('ADDITIONAL_SALARY'),
      additionalSalaryRetention: getCompVal('ADDITIONAL_SALARY_RETENTION'),
      natura: getCompVal('NATURA'),
      naturaKesehatan: getCompVal('NATURA_KESEHATAN'),
      naturaKendaraan: getCompVal('NATURA_KENDARAAN'),
      // Opsional
      modeRapelan: row.modeRapelan || '',
      rapelan: getCompVal('RAPELAN'),
      tunjanganLain: getCompVal('TJ_LAIN'),
      tunjanganLainNonTax: getCompVal('TJ_LAIN_NONTAX'),
      reimbursement: getCompVal('REIMBURSE'),
      // Pengurangan
      wagely: getCompVal('WAGELY'),
      potonganLain: getCompVal('POT_LAIN'),
      potonganLainNonTax: getCompVal('POT_LAIN_NONTAX'),
      potonganAbsen: getCompVal('POT_ABSEN'),
      potonganThr: getCompVal('POT_THR'),
      potonganThrNonTax: getCompVal('POT_THR_NONTAX'),
      potonganDeposit: getCompVal('POT_DEPOSIT'),
      denda: getCompVal('POT_DENDA'),
      potonganHte: getCompVal('POT_HTE'),
      potonganIndodana: getCompVal('POT_INDODANA'),
      potonganKeterlambatan: getCompVal('POT_LATE'),
      potonganKu: getCompVal('POT_KU'),
      potonganNatura: getCompVal('POT_NATURA'),
      potonganNaturaKendaraan: getCompVal('POT_NATURA_VEH'),
      potonganNaturaKesehatan: getCompVal('POT_NATURA_KESEHATAN'),
      potonganParkir: getCompVal('POT_PARKIR'),
      potonganSeragam: getCompVal('POT_SERAGAM'),
      potonganSp: getCompVal('POT_SP'),
      potonganSaResign: getCompVal('POT_SA_RESIGN'),
      potonganTagihan: getCompVal('POT_TAGIHAN'),
      tunjanganJabatanVal: getCompVal('TJ_JABATAN'),
      tunjanganMakanVal: getCompVal('TJ_MAKAN'),
      tunjanganTransportVal: getCompVal('TJ_TRANSPORT'),
      insentifBulananVal: getCompVal('INS_BULANAN'),
      uangLemburVal: getCompVal('UANG_LEMBUR'),
      bonusKerajinanVal: getCompVal('BONUS_KERAJINAN'),
      keterangan: row.keterangan || ''
    });
    setOpenEditModal(true);
  };

  // Save edits of payroll transaction
  const handleSaveEditPayroll = () => {
    // Reconstruct dynamic components from editForm
    const comps = [
      { code: 'INSENTIF', name: 'Insentif', amount: parseFloat(editForm.insentif) || 0, type: 'EARNING', isTaxable: true },
      { code: 'LEMBUR', name: 'Lembur', amount: parseFloat(editForm.lembur) || 0, type: 'EARNING', isTaxable: true },
      { code: 'TJ_KESEHATAN', name: 'Tunjangan Kesehatan', amount: parseFloat(editForm.tjKesehatan) || 0, type: 'EARNING', isTaxable: true },
      { code: 'TJ_JABATAN', name: 'Tunjangan Jabatan', amount: parseFloat(editForm.tunjanganJabatanVal) || 0, type: 'EARNING', isTaxable: true },
      { code: 'TJ_MAKAN', name: 'Tunjangan Makan', amount: parseFloat(editForm.tunjanganMakanVal) || 0, type: 'EARNING', isTaxable: true },
      { code: 'TJ_TRANSPORT', name: 'Tunjangan Transport', amount: parseFloat(editForm.tunjanganTransportVal) || 0, type: 'EARNING', isTaxable: true },
      { code: 'INS_BULANAN', name: 'Insentif Bulanan', amount: parseFloat(editForm.insentifBulananVal) || 0, type: 'EARNING', isTaxable: true },
      { code: 'UANG_LEMBUR', name: 'Uang Lembur', amount: parseFloat(editForm.uangLemburVal) || 0, type: 'EARNING', isTaxable: true },
      { code: 'BONUS_KERAJINAN', name: 'Bonus Kerajinan', amount: parseFloat(editForm.bonusKerajinanVal) || 0, type: 'EARNING', isTaxable: true },
      { code: 'PERFORMANCE_PAY', name: 'Performance Pay', amount: parseFloat(editForm.performancePay) || 0, type: 'EARNING', isTaxable: true },
      { code: 'COMMISSION', name: 'Monthly Commission', amount: parseFloat(editForm.monthlyCommission) || 0, type: 'EARNING', isTaxable: true },
      { code: 'SHIFT_ALLOWANCE', name: 'Shift Allowance', amount: parseFloat(editForm.shiftAllowance) || 0, type: 'EARNING', isTaxable: true },
      { code: 'BONUS', name: 'Bonus', amount: parseFloat(editForm.bonus) || 0, type: 'EARNING', isTaxable: true },
      { code: 'TRAINING', name: 'Biaya Jasa Training', amount: parseFloat(editForm.biayaJasaTraining) || 0, type: 'EARNING', isTaxable: true },
      { code: 'THR', name: 'THR', amount: parseFloat(editForm.thr) || 0, type: 'EARNING', isTaxable: true },
      { code: 'KOMPENSASI', name: 'Kompensasi', amount: parseFloat(editForm.kompensasi) || 0, type: 'EARNING', isTaxable: true },
      { code: 'INSENTIF_PERF', name: 'Insentif Performance', amount: parseFloat(editForm.insentifPerformance) || 0, type: 'EARNING', isTaxable: true },
      { code: 'INSENTIF_SHIFT', name: 'Insentif Shifting', amount: parseFloat(editForm.insentifShifting) || 0, type: 'EARNING', isTaxable: true },
      { code: 'INSENTIF_TRAIN', name: 'Insentif Trainer', amount: parseFloat(editForm.insentifTrainer) || 0, type: 'EARNING', isTaxable: true },
      { code: 'INSENTIF_NONTRAIN', name: 'Insentif Non Trainer', amount: parseFloat(editForm.insentifNonTrainer) || 0, type: 'EARNING', isTaxable: true },
      { code: 'INSENTIF_DIFA', name: 'Insentif Difa', amount: parseFloat(editForm.insentifDifa) || 0, type: 'EARNING', isTaxable: true },
      { code: 'INSENTIF_KUANTITATIF', name: 'Insentif Kuantitatif', amount: parseFloat(editForm.insentifKuantitatif) || 0, type: 'EARNING', isTaxable: true },
      { code: 'INSENTIF_KUALITATIF', name: 'Insentif Kualitatif', amount: parseFloat(editForm.insentifKualitatif) || 0, type: 'EARNING', isTaxable: true },
      { code: 'INSENTIF_AHT', name: 'Insentif AHT', amount: parseFloat(editForm.insentifAht) || 0, type: 'EARNING', isTaxable: true },
      { code: 'INSENTIF_MOTIVATIONAL', name: 'Insentif Motivational Program', amount: parseFloat(editForm.insentifMotivational) || 0, type: 'EARNING', isTaxable: true },
      { code: 'REWARD_KEHADIRAN', name: 'Reward Kehadiran', amount: parseFloat(editForm.rewardKehadiran) || 0, type: 'EARNING', isTaxable: true },
      { code: 'GARANSI_KOMISI', name: 'Garansi Komisi', amount: parseFloat(editForm.garansiKomisi) || 0, type: 'EARNING', isTaxable: true },
      { code: 'ADD_SALARY_PROJECT', name: 'Add Salary Project', amount: parseFloat(editForm.addSalaryProject) || 0, type: 'EARNING', isTaxable: true },
      { code: 'ADDITIONAL_SALARY', name: 'Additional Salary', amount: parseFloat(editForm.additionalSalary) || 0, type: 'EARNING', isTaxable: true },
      { code: 'ADDITIONAL_SALARY_RETENTION', name: 'Additional Salary Retention Program', amount: parseFloat(editForm.additionalSalaryRetention) || 0, type: 'EARNING', isTaxable: true },
      { code: 'NATURA', name: 'Natura', amount: parseFloat(editForm.natura) || 0, type: 'EARNING', isTaxable: true },
      { code: 'NATURA_KESEHATAN', name: 'Natura Kesehatan', amount: parseFloat(editForm.naturaKesehatan) || 0, type: 'EARNING', isTaxable: true },
      { code: 'NATURA_KENDARAAN', name: 'Natura Kendaraan', amount: parseFloat(editForm.naturaKendaraan) || 0, type: 'EARNING', isTaxable: true },
      { code: 'RAPELAN', name: 'Rapelan', amount: parseFloat(editForm.rapelan) || 0, type: 'EARNING', isTaxable: true },
      { code: 'TJ_LAIN', name: 'Tunjangan Lain', amount: parseFloat(editForm.tunjanganLain) || 0, type: 'EARNING', isTaxable: true },
      { code: 'TJ_LAIN_NONTAX', name: 'Tunjangan Lain Non Tax', amount: parseFloat(editForm.tunjanganLainNonTax) || 0, type: 'EARNING', isTaxable: false },
      { code: 'REIMBURSE', name: 'Reimbursement', amount: parseFloat(editForm.reimbursement) || 0, type: 'EARNING', isTaxable: false },
      // Deductions
      { code: 'WAGELY', name: 'Wagely', amount: parseFloat(editForm.wagely) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_LAIN', name: 'Potongan Lain', amount: parseFloat(editForm.potonganLain) || 0, type: 'DEDUCTION', isTaxable: true },
      { code: 'POT_LAIN_NONTAX', name: 'Potongan Lain Non Tax', amount: parseFloat(editForm.potonganLainNonTax) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_ABSEN', name: 'Potongan Absen', amount: parseFloat(editForm.potonganAbsen) || 0, type: 'DEDUCTION', isTaxable: true },
      { code: 'POT_THR', name: 'Potongan THR', amount: parseFloat(editForm.potonganThr) || 0, type: 'DEDUCTION', isTaxable: true },
      { code: 'POT_THR_NONTAX', name: 'Potongan THR Non Tax', amount: parseFloat(editForm.potonganThrNonTax) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_DEPOSIT', name: 'Potongan Deposit', amount: parseFloat(editForm.potonganDeposit) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_DENDA', name: 'Potongan Denda', amount: parseFloat(editForm.denda) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_HTE', name: 'Potongan HTE', amount: parseFloat(editForm.potonganHte) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_INDODANA', name: 'Potongan Indodana', amount: parseFloat(editForm.potonganIndodana) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_LATE', name: 'Potongan Keterlambatan', amount: parseFloat(editForm.potonganKeterlambatan) || 0, type: 'DEDUCTION', isTaxable: true },
      { code: 'POT_KU', name: 'Potongan KU', amount: parseFloat(editForm.potonganKu) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_NATURA', name: 'Potongan Natura', amount: parseFloat(editForm.potonganNatura) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_NATURA_VEH', name: 'Potongan Natura Kendaraan', amount: parseFloat(editForm.potonganNaturaKendaraan) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_NATURA_KESEHATAN', name: 'Potongan Natura Kesehatan', amount: parseFloat(editForm.potonganNaturaKesehatan) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_PARKIR', name: 'Potongan Parkir', amount: parseFloat(editForm.potonganParkir) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_SERAGAM', name: 'Potongan Seragam', amount: parseFloat(editForm.potonganSeragam) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_SP', name: 'Potongan SP', amount: parseFloat(editForm.potonganSp) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_SA_RESIGN', name: 'Potongan SA Resign', amount: parseFloat(editForm.potonganSaResign) || 0, type: 'DEDUCTION', isTaxable: false },
      { code: 'POT_TAGIHAN', name: 'Potongan Tagihan', amount: parseFloat(editForm.potonganTagihan) || 0, type: 'DEDUCTION', isTaxable: false },
    ].filter(c => c.amount > 0);

    const calculatedBasic = parseFloat(editForm.basicSalary) || 0;
    const allowanceSum = comps
      .filter(c => c.type === 'EARNING')
      .reduce((sum, current) => sum + current.amount, 0);

    const calculatedGross = calculatedBasic + allowanceSum;

    setDataList(prev => 
      prev.map(row => 
        row.id === selectedRow.id 
          ? { 
              ...row, 
              nik: editForm.nik,
              name: editForm.name,
              basicSalary: calculatedBasic,
              grossSalary: calculatedGross,
              dynamicComponents: comps,
              employeeType: editForm.employeeType,
              position: editForm.position,
              unitName: editForm.unitName,
              joinDate: editForm.joinDate,
              pengembalianPajak: editForm.pengembalianPajak,
              absen: editForm.bulanIniAbsen,
              totalHariKerja: editForm.bulanIniTotalHariKerja,
              tunjanganTetap: editForm.tunjanganTetap,
              tunjanganTidakTetap: editForm.tunjanganTidakTetap,
              salaryType: editForm.salaryType,
              upahBpjsTk: editForm.upahBpjsTk,
              bpjsTkType: editForm.bpjsTkType,
              modeUpahBpjsTk: editForm.modeUpahBpjsTk,
              dub: editForm.dub,
              bpjsKetenagakerjaan: editForm.bpjsKetenagakerjaan,
              bpjsKesehatan: editForm.bpjsKesehatan,
              bpuJkk: editForm.bpuJkk,
              bpuJht: editForm.bpuJht,
              bpuJkm: editForm.bpuJkm,
              asuransiKesehatan: editForm.asuransiKesehatan,
              asuransiKecelakaan: editForm.asuransiKecelakaan,
              premiAsuransi: editForm.premiAsuransi,
              ditanggungOleh: editForm.ditanggungOleh,
              rapelanPeriodeStart: editForm.rapelanPeriodeStart,
              rapelanPeriodeEnd: editForm.rapelanPeriodeEnd,
              rapelanAbsen: editForm.rapelanAbsen,
              rapelanTotalHariKerja: editForm.rapelanTotalHariKerja,
              rapelanKategori: Array.isArray(editForm.rapelanKategori) ? editForm.rapelanKategori.join(',') : (editForm.rapelanKategori || ''),
              periodeStart: editForm.bulanIniPeriodeStart,
              periodeEnd: editForm.bulanIniPeriodeEnd,
              modeLembur: editForm.modeLembur,
              modeRapelan: editForm.modeRapelan,
              keterangan: editForm.keterangan
            } 
          : row
      )
    );

    setOpenEditModal(false);
    showSnackbar('Komponen gaji berhasil diperbarui!', 'success');
  };

  // Calculate totals
  const totalEmployees = filteredData.length;
  const totalPayrollAmount = filteredData.reduce((sum, item) => sum + (item.grossSalary || 0), 0);

  // Handler for column header sorting
  const handleRequestSort = (field) => {
    const isAsc = sortBy === field && sortOrder === 'ASCENDING';
    setSortBy(field);
    setSortOrder(isAsc ? 'DESCENDING' : 'ASCENDING');
  };

  // Reusable header sorting renderer
  const renderSortableHeader = (field, label, align = 'left') => {
    const isActive = sortBy === field;
    return (
      <Box 
        onClick={() => handleRequestSort(field)} 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
          cursor: 'pointer', 
          userSelect: 'none',
          gap: 0.5,
          '&:hover': { color: '#3b82f6' } 
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 'inherit', color: 'inherit' }}>
          {label}
        </Typography>
        {isActive && (
          sortOrder === 'ASCENDING' ? (
            <ArrowUpwardIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
          ) : (
            <ArrowDownwardIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
          )
        )}
      </Box>
    );
  };

  // Table columns definition (Compact & Collapsible)
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
          onChange={handleSelectAll}
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
    { 
      id: 'nik', 
      label: 'NIK',
      headerRender: () => renderSortableHeader('nik', 'NIK'),
      render: (row) => (
        <Chip
          label={row.nik}
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
      )
    },
    { 
      id: 'name', 
      label: 'Nama',
      headerRender: () => renderSortableHeader('name', 'Nama'),
      render: (row) => (
        <Typography 
          variant="body2" 
          title={row.name}
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary', 
            fontSize: '0.8rem',
            maxWidth: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {row.name}
        </Typography>
      )
    },
    {
      id: 'employeeType',
      label: 'Employee Type',
      render: (row) => (
        <Chip
          label={row.employeeType}
          size="small"
          sx={{ fontSize: '0.7rem', fontWeight: 700, bgcolor: 'primary.lighter', color: 'primary.dark' }}
        />
      )
    },
    { 
      id: 'division', 
      label: 'Division', 
      render: (row) => (
        <Typography 
          variant="body2" 
          title={row.division}
          sx={{ 
            fontSize: '0.78rem', 
            color: 'text.secondary', 
            fontWeight: 500,
            maxWidth: 110,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {row.division}
        </Typography>
      ) 
    },
    { 
      id: 'unitName', 
      label: 'Unit', 
      render: (row) => (
        <Typography 
          variant="body2" 
          title={row.unitName}
          sx={{ 
            fontSize: '0.78rem', 
            color: 'text.secondary', 
            fontWeight: 500,
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {row.unitName}
        </Typography>
      ) 
    },
    { 
      id: 'position', 
      label: 'Position', 
      render: (row) => (
        <Typography 
          variant="body2" 
          title={row.position}
          sx={{ 
            fontSize: '0.78rem', 
            color: 'text.primary', 
            fontWeight: 600,
            maxWidth: 130,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {row.position}
        </Typography>
      ) 
    },
    { 
      id: 'branch', 
      label: 'Branch', 
      render: (row) => (
        <Typography 
          variant="body2" 
          title={row.branch}
          sx={{ 
            fontSize: '0.78rem', 
            color: 'text.secondary',
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {row.branch}
        </Typography>
      ) 
    },
    {
      id: 'expand',
      label: '',
      width: '40px',
      align: 'center',
      render: (row, rowIndex, isExpanded, toggleExpand) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            if (toggleExpand) toggleExpand();
          }}
          sx={{
            color: isExpanded ? 'primary.main' : 'text.secondary',
            bgcolor: isExpanded ? 'primary.lighter' : 'transparent',
            transition: 'all 0.2s',
            p: 0.5,
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'primary.main'
            }
          }}
        >
          {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
        </IconButton>
      )
    }
  ];

  // Collapsible Sub-Row (Maximized Linear Minimal Layout)
  const renderCollapsibleRow = (row) => {
    const isRejected = row.statusPayroll === 'REJECTED' || row.statusData === 'REJECTED';
    const isApproved = row.statusPayroll === 'APPROVED' || row.statusPayroll === 'PROCESSED' || row.statusData === 'APPROVED';
    const isPending = row.statusPayroll === 'REQUEST_APPROVAL' || row.statusData === 'REQUEST_APPROVAL';

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
        {/* Top Header Row of Collapsible */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main', fontSize: '0.95rem', fontWeight: 800, boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }}>
              {row.name ? row.name.charAt(0).toUpperCase() : 'E'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.98rem', lineHeight: 1.2 }}>
                {row.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.75rem', mt: 0.2, display: 'block' }}>
                {row.division} • {row.unitName} • {row.position}
              </Typography>
            </Box>
            <Chip
              label={row.nik}
              size="small"
              sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.75rem', bgcolor: 'primary.lighter', color: 'primary.dark' }}
            />
            <Chip
              label={isApproved ? 'DISETUJUI' : isPending ? 'MENUNGGU APPROVAL' : isRejected ? 'DITOLAK' : (row.statusPayroll || 'DRAFT')}
              size="small"
              sx={{
                fontWeight: 700, fontSize: '0.7rem',
                bgcolor: isApproved ? '#dcfce7' : isPending ? '#fef3c7' : isRejected ? '#ffe4e6' : '#f1f5f9',
                color: isApproved ? '#15803d' : isPending ? '#b45309' : isRejected ? '#be123c' : '#475569',
                border: '1px solid',
                borderColor: isApproved ? '#bbf7d0' : isPending ? '#fde68a' : isRejected ? '#fecdd3' : '#e2e8f0'
              }}
            />
            <Chip
              label={`Status Bayar: ${row.statusBayar || 'UNPAID'}`}
              size="small"
              sx={{
                fontWeight: 700, fontSize: '0.7rem',
                bgcolor: row.statusBayar === 'PAID' ? '#dcfce7' : '#f1f5f9',
                color: row.statusBayar === 'PAID' ? '#15803d' : '#475569',
                border: '1px solid',
                borderColor: row.statusBayar === 'PAID' ? '#bbf7d0' : '#e2e8f0'
              }}
            />
          </Box>

          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<EditIcon sx={{ fontSize: '1rem !important' }} />}
            onClick={() => handleOpenEditModal(row)}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.78rem',
              borderRadius: 2,
              px: 2,
              py: 0.6,
              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.25)',
              '&:hover': { boxShadow: '0 4px 10px rgba(59, 130, 246, 0.35)' }
            }}
          >
            Edit Form Payroll
          </Button>
        </Box>

        {/* Rejection Alert if rejected */}
        {isRejected && row.reasonReject && (
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              bgcolor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}
          >
            <InfoOutlinedIcon sx={{ color: '#ef4444', fontSize: 22 }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#b91c1c', fontWeight: 800, display: 'block', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                Alasan Penolakan Payroll:
              </Typography>
              <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 600, fontSize: '0.82rem' }}>
                {row.reasonReject}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* Maximized 3-Column Linear Section */}
        <Grid container spacing={2.5}>
          {/* Column 1: Kontrak & Kehadiran */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <CalendarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Informasi Kontrak & Absen
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    PERIODE KERJA
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem' }}>
                    {row.periodeStart || '-'} s/d {row.periodeEnd || '-'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    JOIN DATE & RESIGN
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.joinDate ? new Date(row.joinDate).toLocaleDateString('id-ID') : '-'} s/d {row.resignDate ? new Date(row.resignDate).toLocaleDateString('id-ID') : '- (Aktif)'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.3 }}>
                    STATUS KEPEGAWAIAN
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                    <Chip
                      label={row.employeeType || 'PKWT'}
                      size="small"
                      sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: 'primary.lighter', color: 'primary.dark' }}
                    />
                    <Chip
                      label={row.statusEmployee || 'ACTIVE'}
                      size="small"
                      sx={{
                        fontWeight: 700, fontSize: '0.7rem',
                        bgcolor: row.statusEmployee === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                        color: row.statusEmployee === 'ACTIVE' ? '#15803d' : '#b91c1c'
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    KEHADIRAN / TOTAL ABSEN
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: row.absen > 0 ? '#ea580c' : '#16a34a', fontSize: '0.82rem' }}>
                    {row.absen ?? 0} Hari Absen {row.absen === 0 ? '(Kehadiran Penuh)' : ''}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 2: Skema Pajak & Sistem */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <ReceiptLongIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Skema Pajak & Acuan
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    METODE PAJAK
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem' }}>
                    {row.metodePajak || 'Gross'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    KOMPONEN PROJECT
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.komponenProject || 'Gross'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    SUMBER ACUAN PAJAK
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.sumberAcuanPajak || 'Master Client'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    STATUS DATA & INPUT
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.statusData || 'NEW'} • <span style={{ color: '#64748b' }}>{row.createdDate || '-'}</span>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 3: Finansial & Total Gaji Kotor */}
          <Grid item xs={12} sm={12} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <WalletIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Rincian Finansial
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0.75, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Gaji Pokok (Basic Salary)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary' }}>
                    Rp {(row.basicSalary || 0).toLocaleString('id-ID')}
                  </Typography>
                </Box>

                {row.dynamicComponents && row.dynamicComponents.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.7rem', display: 'block', mb: 0.5, textTransform: 'uppercase' }}>
                      Komponen Tambahan / Potongan:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                      {row.dynamicComponents.map((comp, idx) => (
                        <Chip
                          key={idx}
                          size="small"
                          label={`${comp.label || comp.code}: Rp ${(comp.amount || 0).toLocaleString('id-ID')}`}
                          sx={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            bgcolor: 'action.hover',
                            border: '1px solid',
                            borderColor: 'divider',
                            py: 1.2
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Total Gross Highlight Banner */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.4,
                    mt: 0.5
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#047857', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    Total Gaji Kotor (Gross Salary)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', lineHeight: 1.2, fontSize: '1.15rem' }}>
                    Rp {(row.grossSalary || 0).toLocaleString('id-ID')}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const paidCount = filteredData.filter(d => d.statusBayar === 'PAID').length;
  const unpaidCount = filteredData.filter(d => d.statusBayar !== 'PAID').length;
  const approvedCount = filteredData.filter(d => d.statusData === 'APPROVED' || d.statusPayroll === 'APPROVED' || d.statusPayroll === 'PROCESSED').length;
  const requestedCount = filteredData.filter(d => d.statusData === 'REQUEST_APPROVAL' || d.statusPayroll === 'REQUEST_APPROVAL').length;
  const rejectedCount = filteredData.filter(d => d.statusData === 'REJECTED' || d.statusPayroll === 'REJECTED').length;

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {!openEditModal ? (
        <>
          {/* PAGE HEADER */}
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
                <PaymentsIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
                  Proses Payroll
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 500 }}>
                  Kelola perhitungan gaji kotor, rincian tunjangan & potongan karyawan tetap
                </Typography>
              </Box>
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
                  Total Headcount
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {totalEmployees} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>karyawan</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Karyawan dalam batch
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
                <MonetizationOnIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Total Gaji Kotor
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981', lineHeight: 1.2 }}>
                  Rp {totalPayrollAmount.toLocaleString('id-ID')}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Filtered batch amount
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
                  Status Bayar
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {paidCount} Paid / {unpaidCount} Unpaid
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Realisasi pembayaran gaji
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
                <CalculateIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Status Payroll
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2, fontSize: '0.95rem' }}>
                  {approvedCount} App / {requestedCount} Req / {rejectedCount} Rej
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Status persetujuan batch
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
              {/* Row 1: Search & Date Range & SEARCH & CLEAR Buttons */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2.5fr 3fr auto auto' }, gap: 1.5, alignItems: 'center' }}>
                <TextField
                  placeholder="Cari NIK / Nama Karyawan..."
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchPayrollTransactions()}
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
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      type="date"
                      size="small"
                      fullWidth
                      placeholder="Periode Start"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mr: 0.5 }}>Start:</Typography>
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>-</Typography>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      type="date"
                      size="small"
                      fullWidth
                      placeholder="Periode End"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mr: 0.5 }}>End:</Typography>
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={fetchPayrollTransactions}
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
                  onClick={handleClearFilters}
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

              {/* Row 2: Cascading Filters */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(6, 1fr)' }, gap: 1.5 }}>
                <SearchableSelect
                  placeholder="(Division)"
                  value={filterDivision}
                  options={cascaded.divisions}
                  onChange={(val) => {
                    setFilterDivision(val || '');
                    setFilterUnit('');
                    setFilterPosition('');
                    setFilterBranch('');
                    setFilterEmployeeType('');
                  }}
                />

                <SearchableSelect
                  placeholder="(Unit)"
                  value={filterUnit}
                  options={cascaded.units}
                  onChange={(val) => {
                    setFilterUnit(val || '');
                    setFilterPosition('');
                    setFilterBranch('');
                    setFilterEmployeeType('');
                  }}
                />

                <SearchableSelect
                  placeholder="(Position)"
                  value={filterPosition}
                  options={cascaded.positions}
                  onChange={(val) => {
                    setFilterPosition(val || '');
                    setFilterBranch('');
                    setFilterEmployeeType('');
                  }}
                />

                <SearchableSelect
                  placeholder="(Employee Type)"
                  value={filterEmployeeType}
                  options={cascaded.employeeTypes}
                  onChange={(val) => setFilterEmployeeType(val || '')}
                />

                <SearchableSelect
                  placeholder="(Branch)"
                  value={filterBranch}
                  options={cascaded.branches}
                  onChange={(val) => setFilterBranch(val || '')}
                />

                <SearchableSelect
                  placeholder="(Status Employee)"
                  value={filterStatusEmployee}
                  options={['ACTIVE', 'RESIGN']}
                  onChange={(val) => setFilterStatusEmployee(val || '')}
                />
              </Box>

              {/* Row 3: Status Filters & UPDATE Button */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr auto' }, gap: 1.5, alignItems: 'center' }}>
                <SearchableSelect
                  placeholder="(Status Data)"
                  value={filterStatusData}
                  options={['NEW', 'REQUEST_APPROVAL', 'APPROVED', 'RETURNED', 'PROCESSED', 'PAID']}
                  onChange={(val) => setFilterStatusData(val || '')}
                />

                <SearchableSelect
                  placeholder="(Status Bayar)"
                  value={filterStatusBayar}
                  options={['PAID', 'UNPAID']}
                  onChange={(val) => setFilterStatusBayar(val || '')}
                />

                <SearchableSelect
                  placeholder="(Pengembalian Pajak)"
                  value={filterPengembalianPajak}
                  options={['YA', 'TIDAK']}
                  onChange={(val) => setFilterPengembalianPajak(val || '')}
                />

                <Button
                  variant="outlined"
                  onClick={() => showSnackbar('Status data berhasil diperbarui', 'success')}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    height: 40,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    px: 3,
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'primary.lighter' }
                  }}
                >
                  UPDATE
                </Button>
              </Box>

              <Divider sx={{ my: 0.5 }} />

              {/* Row 4: Toolbar Action Row */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Bulk Upload Dropdown + Button */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.default', p: 0.5, pl: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      Bulk Upload:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                      <Select
                        value={uploadType}
                        displayEmpty
                        onChange={(e) => setUploadType(e.target.value)}
                        sx={{ height: 32, fontSize: '0.8rem', bgcolor: 'background.paper' }}
                      >
                        <MenuItem value=""><em>(Upload)</em></MenuItem>
                        <MenuItem value="ABSEN">Upload Absen</MenuItem>
                        <MenuItem value="TUNJANGAN">Upload Tunjangan</MenuItem>
                        <MenuItem value="PENGURANGAN">Upload Pengurangan</MenuItem>
                        <MenuItem value="BPJS">Upload BPJS</MenuItem>
                        <MenuItem value="LEMBUR">Upload Lembur</MenuItem>
                        <MenuItem value="ASURANSI">Upload Asuransi</MenuItem>
                        <MenuItem value="SPECIAL_INCENTIVE">Upload Special Incentive</MenuItem>
                        <MenuItem value="KENAIKAN_GAJI">Upload Kenaikan Gaji</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<UploadIcon />}
                      onClick={handleUploadData}
                      sx={{
                        bgcolor: '#2563eb',
                        color: 'white',
                        '&:hover': { bgcolor: '#1d4ed8' },
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        height: 32,
                        px: 2
                      }}
                    >
                      UPLOAD DATA
                    </Button>
                  </Box>

                  {!isSpv && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenSpecialCaseModal(true)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        height: 36,
                        borderColor: 'divider',
                        color: 'text.primary',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      + ADD SPECIAL CASE
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ExportIcon />}
                    onClick={() => showSnackbar('Laporan Excel berhasil diexport!', 'success')}
                    sx={{
                      bgcolor: '#10b981',
                      color: 'white',
                      '&:hover': { bgcolor: '#059669' },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      height: 36,
                      px: 2
                    }}
                  >
                    EXPORT
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleMarkAsPaid}
                    sx={{
                      bgcolor: '#059669',
                      color: 'white',
                      '&:hover': { bgcolor: '#047857' },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      height: 36,
                      px: 2
                    }}
                  >
                    DATA HAS BEEN PAID
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleGetHadir}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      height: 36,
                      borderColor: 'divider',
                      color: 'text.primary',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    GET HADIR
                  </Button>

                  {isSpv ? (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => setOpenHistoryRejectedModal(true)}
                      sx={{
                        bgcolor: '#ef4444',
                        color: 'white',
                        '&:hover': { bgcolor: '#dc2626' },
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        height: 36,
                        px: 2
                      }}
                    >
                      HISTORY REJECTED
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={handleRequestDelete}
                      sx={{
                        bgcolor: '#ef4444',
                        color: 'white',
                        '&:hover': { bgcolor: '#dc2626' },
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        height: 36,
                        px: 2
                      }}
                    >
                      Request Delete
                    </Button>
                  )}
                </Box>

                {/* Sorter Month on Right */}
                <Box sx={{ width: 140, minWidth: 120 }}>
                  <SearchableSelect
                    placeholder="Pilih Bulan"
                    value={sortMonth}
                    onChange={(val) => setSortMonth(val || 'January')}
                    options={MONTH_NAMES.map(m => ({ label: m, value: m }))}
                  />
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* AKSI PAYROLL TOOLBAR (ABOVE DATA TABLE) */}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center' }}>
                <CalculateIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  Aksi Payroll
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  <Box component="span" sx={{ fontWeight: 800, color: selectedIds.length > 0 ? 'primary.main' : 'text.primary' }}>
                    {selectedIds.length}
                  </Box> data payroll dipilih untuk diproses
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Button
                variant="outlined"
                size="small"
                startIcon={<CalculateIcon />}
                onClick={handleCalculateCalculations}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 2,
                  height: '38px',
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' }
                }}
              >
                Cek Perhitungan
              </Button>

              {!isSpv ? (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ProcessIcon />}
                  onClick={handleRequestPayroll}
                  disabled={selectedIds.length === 0}
                  sx={{
                    bgcolor: '#10b981',
                    color: 'white',
                    '&:hover': { bgcolor: '#059669' },
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 2.5,
                    height: '38px',
                    boxShadow: selectedIds.length > 0 ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
                  }}
                >
                  Request Approval
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ProcessIcon />}
                    onClick={handleProcessPayroll}
                    disabled={selectedIds.length === 0}
                    sx={{
                      bgcolor: '#10b981',
                      color: 'white',
                      '&:hover': { bgcolor: '#059669' },
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 2.5,
                      height: '38px',
                      boxShadow: selectedIds.length > 0 ? '0 4px 14px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                  >
                    Process Payroll
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CloseIcon />}
                    onClick={handleRejectPayroll}
                    disabled={selectedIds.length === 0}
                    sx={{
                      bgcolor: '#ef4444',
                      color: 'white',
                      '&:hover': { bgcolor: '#dc2626' },
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 2,
                      height: '38px',
                      boxShadow: selectedIds.length > 0 ? '0 4px 14px rgba(239, 68, 68, 0.3)' : 'none'
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </Stack>
          </Paper>

          {/* DATA TABLE PANEL */}
          <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
            <DataTable
              columns={columns}
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
              renderCollapsibleRow={renderCollapsibleRow}
            />
          </Paper>
        </>
      ) : (
        <>
          {/* Page Title when editing */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => setOpenEditModal(false)}
              sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6' }}
            >
              Kembali
            </Button>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Detail & Edit Transaksi Payroll
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Karyawan: <strong>{editForm.name} ({editForm.nik})</strong>
              </Typography>
            </Box>
          </Box>

          <Paper sx={{ p: 3, border: '1px solid #cbd5e1', borderRadius: 3, bgcolor: '#ffffff' }} elevation={0}>
            <Stack spacing={2}>
          {/* Custom Slate Tab Bar */}
          <Stack direction="row" spacing={1} sx={{ borderBottom: '1px solid #cbd5e1', pb: 1, mb: 1 }}>
            <Button
              variant={detailTab === 0 ? "contained" : "outlined"}
              onClick={() => setDetailTab(0)}
              sx={{
                bgcolor: detailTab === 0 ? '#0f172a' : 'transparent',
                color: detailTab === 0 ? 'white' : '#64748b',
                borderColor: detailTab === 0 ? '#0f172a' : '#cbd5e1',
                '&:hover': { bgcolor: detailTab === 0 ? '#1e293b' : '#f8fafc', borderColor: '#cbd5e1' },
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 700
              }}
            >
              Data Karyawan
            </Button>
            <Button
              variant={detailTab === 1 ? "contained" : "outlined"}
              onClick={() => setDetailTab(1)}
              sx={{
                bgcolor: detailTab === 1 ? '#0f172a' : 'transparent',
                color: detailTab === 1 ? 'white' : '#64748b',
                borderColor: detailTab === 1 ? '#0f172a' : '#cbd5e1',
                '&:hover': { bgcolor: detailTab === 1 ? '#1e293b' : '#f8fafc', borderColor: '#cbd5e1' },
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 700
              }}
            >
              Tunjangan & Komponen Gaji
            </Button>
          </Stack>

          {detailTab === 0 && (
            <Grid container spacing={3}>
              {/* Left Column: Data Karyawan Details */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>
                  {/* Basic Card */}
                  <Paper sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2, bgcolor: '#f8fafc' }} elevation={0}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1.5 }}>
                      Profil Karyawan
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="NIK"
                          size="small"
                          fullWidth
                          disabled
                          value={editForm.nik}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Nama"
                          size="small"
                          fullWidth
                          disabled
                          value={editForm.name}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Employee Type"
                          size="small"
                          fullWidth
                          disabled
                          value={editForm.employeeType}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          label="Position"
                          size="small"
                          fullWidth
                          disabled
                          value={editForm.position}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Unit"
                          size="small"
                          fullWidth
                          disabled
                          value={editForm.unitName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Join Date"
                          size="small"
                          fullWidth
                          disabled
                          value={editForm.joinDate}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormControl size="small" fullWidth sx={{ minWidth: 180 }}>
                          <InputLabel>Pengembalian Pajak</InputLabel>
                          <Select
                            value={editForm.pengembalianPajak}
                            label="Pengembalian Pajak"
                            onChange={(e) => handleEditFormChange('pengembalianPajak', e.target.value)}
                          >
                            <MenuItem value=""><em>--PILIH--</em></MenuItem>
                            <MenuItem value="YA">YA</MenuItem>
                            <MenuItem value="TIDAK">TIDAK</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Absen Rapelan Card */}
                  <Paper sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1.5 }}>
                      Rapelan Absensi
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Periode Start"
                          type="date"
                          size="small"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={editForm.rapelanPeriodeStart}
                          onChange={(e) => handleEditFormChange('rapelanPeriodeStart', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Periode End"
                          type="date"
                          size="small"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={editForm.rapelanPeriodeEnd}
                          onChange={(e) => handleEditFormChange('rapelanPeriodeEnd', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Absen"
                          type="number"
                          size="small"
                          fullWidth
                          value={editForm.rapelanAbsen}
                          onChange={(e) => handleEditFormChange('rapelanAbsen', parseInt(e.target.value) || 0)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Hari Kerja"
                          type="number"
                          size="small"
                          fullWidth
                          value={editForm.rapelanTotalHariKerja}
                          onChange={(e) => handleEditFormChange('rapelanTotalHariKerja', parseInt(e.target.value) || 0)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl size="small" fullWidth sx={{ minWidth: 180 }}>
                          <InputLabel shrink>Kategori Rapelan</InputLabel>
                          <Select
                            multiple
                            displayEmpty
                            value={Array.isArray(editForm.rapelanKategori) ? editForm.rapelanKategori : []}
                            label="Kategori Rapelan"
                            onChange={(e) => handleEditFormChange('rapelanKategori', e.target.value)}
                            renderValue={(selected) => {
                              if (!selected || selected.length === 0) {
                                return <span style={{ color: '#94a3b8' }}>--PILIH--</span>;
                              }
                              return (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} size="small" />
                                  ))}
                                </Box>
                              );
                            }}
                          >
                            <MenuItem value="Salary">Salary</MenuItem>
                            <MenuItem value="Tunjangan">Tunjangan</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Absen Bulan Ini Card */}
                  <Paper sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1.5 }}>
                      Absensi Bulan Ini
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="Periode Start"
                          type="date"
                          size="small"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={editForm.bulanIniPeriodeStart}
                          onChange={(e) => handleEditFormChange('bulanIniPeriodeStart', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Periode End"
                          type="date"
                          size="small"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          value={editForm.bulanIniPeriodeEnd}
                          onChange={(e) => handleEditFormChange('bulanIniPeriodeEnd', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Absen"
                          type="number"
                          size="small"
                          fullWidth
                          value={editForm.bulanIniAbsen}
                          onChange={(e) => handleEditFormChange('bulanIniAbsen', parseInt(e.target.value) || 0)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Total Hari Kerja"
                          type="number"
                          size="small"
                          fullWidth
                          value={editForm.bulanIniTotalHariKerja}
                          onChange={(e) => handleEditFormChange('bulanIniTotalHariKerja', parseInt(e.target.value) || 0)}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Stack>
              </Grid>

              {/* Right Column: Salary details & actions */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>
                  {/* Gaji Pokok & Summary */}
                  <Paper sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
                      Gaji & Kompensasi
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={6}>
                        <FormControl size="small" fullWidth disabled>
                          <InputLabel>Salary Type</InputLabel>
                          <Select
                            value={editForm.salaryType}
                            label="Salary Type"
                          >
                            <MenuItem value="Fix">Fix</MenuItem>
                            <MenuItem value="Daily">Daily</MenuItem>
                            <MenuItem value="FIX">FIX</MenuItem>
                            <MenuItem value="DAILY">DAILY</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            label="Gaji Pokok"
                            type="number"
                            size="small"
                            fullWidth
                            value={editForm.basicSalary}
                            onChange={(e) => handleEditFormChange('basicSalary', parseFloat(e.target.value) || 0)}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => showSnackbar('History Gaji Pokok (Simulasi): Gaji diperbarui pada 01/08/2026', 'info')}
                            sx={{
                              borderColor: '#cbd5e1',
                              color: '#475569',
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              height: 38
                            }}
                          >
                            LOG HISTORY
                          </Button>
                        </Stack>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Perubahan Gaji Pokok"
                          type="number"
                          size="small"
                          fullWidth
                          value={editForm.perubahanGajiPokok}
                          onChange={(e) => handleEditFormChange('perubahanGajiPokok', parseFloat(e.target.value) || 0)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Total Gaji Kotor"
                          type="number"
                          size="small"
                          fullWidth
                          disabled
                          value={editForm.grossSalary}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Kategori Tunjangan Dropdowns */}
                  <Paper sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
                      Kategori Tunjangan
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl size="small" fullWidth sx={{ minWidth: 180 }}>
                          <InputLabel shrink>Tunjangan Tetap</InputLabel>
                          <Select
                            multiple
                            displayEmpty
                            value={editForm.tunjanganTetap}
                            label="Tunjangan Tetap"
                            onChange={(e) => handleEditFormChange('tunjanganTetap', e.target.value)}
                            renderValue={(selected) => {
                              if (!selected || selected.length === 0) {
                                return <span style={{ color: '#94a3b8' }}>--PILIH--</span>;
                              }
                              return (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} size="small" />
                                  ))}
                                </Box>
                              );
                            }}
                          >
                            <MenuItem value="Tunjangan Jabatan">Tunjangan Jabatan</MenuItem>
                            <MenuItem value="Tunjangan Makan">Tunjangan Makan</MenuItem>
                            <MenuItem value="Tunjangan Transport">Tunjangan Transport</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl size="small" fullWidth sx={{ minWidth: 180 }}>
                          <InputLabel shrink>Tunjangan Tidak Tetap</InputLabel>
                          <Select
                            multiple
                            displayEmpty
                            value={editForm.tunjanganTidakTetap}
                            label="Tunjangan Tidak Tetap"
                            onChange={(e) => handleEditFormChange('tunjanganTidakTetap', e.target.value)}
                            renderValue={(selected) => {
                              if (!selected || selected.length === 0) {
                                return <span style={{ color: '#94a3b8' }}>--PILIH--</span>;
                              }
                              return (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} size="small" />
                                  ))}
                                </Box>
                              );
                            }}
                          >
                            <MenuItem value="Insentif Bulanan">Insentif Bulanan</MenuItem>
                            <MenuItem value="Uang Lembur">Uang Lembur</MenuItem>
                            <MenuItem value="Bonus Kerajinan">Bonus Kerajinan</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* BPJS Action Card */}
                  <Paper sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} elevation={0}>
                    <Box>
                      <Typography variant="body2" fontWeight={800} color="#1e293b">BPJS & Asuransi Karyawan</Typography>
                      <Typography variant="caption" color="text.secondary">Kelola detail iuran BPJS TK, Kesehatan, BPU, dan Premi asuransi.</Typography>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => setOpenBpjsModal(true)}
                      sx={{
                        bgcolor: '#0284c7',
                        '&:hover': { bgcolor: '#0369a1' },
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2
                      }}
                    >
                      EDIT BPJS
                    </Button>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          )}

          {detailTab === 1 && (
            <Stack spacing={3}>
              {/* SECTION: Tunjangan Tetap & Tidak Tetap */}
              <Box>
                <Box sx={{
                  height: 38,
                  bgcolor: '#f1f5f9',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  mb: 1.5,
                  borderLeft: '4px solid #6366f1'
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
                    Tunjangan Tetap
                  </Typography>
                </Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {editForm.tunjanganTetap.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#94a3b8', pl: 1 }}>
                        Karyawan tidak memiliki Tunjangan Tetap
                      </Typography>
                    </Grid>
                  ) : (
                    <>
                      {editForm.tunjanganTetap.includes("Tunjangan Jabatan") && (
                        <Grid item xs={12} sm={4}>
                          <TextField label="Tunjangan Jabatan" type="number" size="small" fullWidth value={editForm.tunjanganJabatanVal} onChange={(e) => handleEditFormChange('tunjanganJabatanVal', parseFloat(e.target.value) || 0)} />
                        </Grid>
                      )}
                      {editForm.tunjanganTetap.includes("Tunjangan Makan") && (
                        <Grid item xs={12} sm={4}>
                          <TextField label="Tunjangan Makan" type="number" size="small" fullWidth value={editForm.tunjanganMakanVal} onChange={(e) => handleEditFormChange('tunjanganMakanVal', parseFloat(e.target.value) || 0)} />
                        </Grid>
                      )}
                      {editForm.tunjanganTetap.includes("Tunjangan Transport") && (
                        <Grid item xs={12} sm={4}>
                          <TextField label="Tunjangan Transport" type="number" size="small" fullWidth value={editForm.tunjanganTransportVal} onChange={(e) => handleEditFormChange('tunjanganTransportVal', parseFloat(e.target.value) || 0)} />
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>

                <Box sx={{
                  height: 38,
                  bgcolor: '#f1f5f9',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  mb: 1.5,
                  borderLeft: '4px solid #6366f1'
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
                    Tunjangan Tidak Tetap
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {editForm.tunjanganTidakTetap.length === 0 ? (
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#94a3b8', pl: 1 }}>
                        Karyawan tidak memiliki Tunjangan Tidak Tetap
                      </Typography>
                    </Grid>
                  ) : (
                    <>
                      {editForm.tunjanganTidakTetap.includes("Insentif Bulanan") && (
                        <Grid item xs={12} sm={4}>
                          <TextField label="Insentif Bulanan" type="number" size="small" fullWidth value={editForm.insentifBulananVal} onChange={(e) => handleEditFormChange('insentifBulananVal', parseFloat(e.target.value) || 0)} />
                        </Grid>
                      )}
                      {editForm.tunjanganTidakTetap.includes("Uang Lembur") && (
                        <Grid item xs={12} sm={4}>
                          <TextField label="Uang Lembur" type="number" size="small" fullWidth value={editForm.uangLemburVal} onChange={(e) => handleEditFormChange('uangLemburVal', parseFloat(e.target.value) || 0)} />
                        </Grid>
                      )}
                      {editForm.tunjanganTidakTetap.includes("Bonus Kerajinan") && (
                        <Grid item xs={12} sm={4}>
                          <TextField label="Bonus Kerajinan" type="number" size="small" fullWidth value={editForm.bonusKerajinanVal} onChange={(e) => handleEditFormChange('bonusKerajinanVal', parseFloat(e.target.value) || 0)} />
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              </Box>

              {/* SECTION: Non Upah Table */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                  Non Upah
                </Typography>
                <Box sx={{ overflowX: 'auto', width: '100%', border: '1px solid #cbd5e1', borderRadius: 1 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1700 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {[
                          'Insentif Trainer', 'Insentif Non Trainer', 'Insentif Difable', 'Insentif Kuantitatif',
                          'Insentif Kualitatif', 'Insentif AHT', 'Insentif Motivational Program', 'Reward Kehadiran',
                          'Garansi Komisi', 'Add Salary Project', 'Additional Salary', 'Additional Salary Retention Program',
                          'Natura', 'Natura Kesehatan', 'Natura Kendaraan'
                        ].map((h) => (
                          <th key={h} style={{ padding: '8px 12px', border: '1px solid #94a3b8', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textAlign: 'center' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {[
                          { field: 'insentifTrainer' },
                          { field: 'insentifNonTrainer' },
                          { field: 'insentifDifa' },
                          { field: 'insentifKuantitatif' },
                          { field: 'insentifKualitatif' },
                          { field: 'insentifAht' },
                          { field: 'insentifMotivational' },
                          { field: 'rewardKehadiran' },
                          { field: 'garansiKomisi' },
                          { field: 'addSalaryProject' },
                          { field: 'additionalSalary' },
                          { field: 'additionalSalaryRetention' },
                          { field: 'natura' },
                          { field: 'naturaKesehatan' },
                          { field: 'naturaKendaraan' }
                        ].map((cell) => (
                          <td key={cell.field} style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', backgroundColor: '#ffffff' }}>
                            <TextField
                              type="number"
                              size="small"
                              variant="standard"
                              value={editForm[cell.field]}
                              onChange={(e) => handleEditFormChange(cell.field, parseFloat(e.target.value) || 0)}
                              InputProps={{
                                startAdornment: <span style={{ marginRight: 2, color: '#94a3b8', fontSize: '0.7rem' }}>Rp</span>,
                                disableUnderline: true
                              }}
                              sx={{
                                width: 100,
                                '& input': { fontSize: '0.75rem', textAlign: 'right', padding: '2px 0' }
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Box>

              {/* SECTION: Opsional Table */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                  Opsional
                </Typography>
                <Box sx={{ overflowX: 'auto', width: '100%', border: '1px solid #cbd5e1', borderRadius: 1 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {[
                          'Mode Rapelan', 'Rapelan', 'Tunjangan Lain Tax', 'Tunjangan Lain Non Tax', 'Reimbursement'
                        ].map((h) => (
                          <th key={h} style={{ padding: '8px 12px', border: '1px solid #94a3b8', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textAlign: 'center' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', backgroundColor: '#ffffff' }}>
                          <Select
                            value={editForm.modeRapelan}
                            onChange={(e) => handleEditFormChange('modeRapelan', e.target.value)}
                            size="small"
                            variant="standard"
                            disableUnderline
                            sx={{ fontSize: '0.75rem', width: 120 }}
                          >
                            <MenuItem value=""><em>--PILIH--</em></MenuItem>
                            <MenuItem value="Penambahan">Penambahan</MenuItem>
                            <MenuItem value="Pengurangan">Pengurangan</MenuItem>
                          </Select>
                        </td>
                        {[
                          { field: 'rapelan' },
                          { field: 'tunjanganLain' },
                          { field: 'tunjanganLainNonTax' },
                          { field: 'reimbursement' }
                        ].map((cell) => (
                          <td key={cell.field} style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', backgroundColor: '#ffffff' }}>
                            <TextField
                              type="number"
                              size="small"
                              variant="standard"
                              value={editForm[cell.field]}
                              onChange={(e) => handleEditFormChange(cell.field, parseFloat(e.target.value) || 0)}
                              InputProps={{
                                startAdornment: <span style={{ marginRight: 2, color: '#94a3b8', fontSize: '0.7rem' }}>Rp</span>,
                                disableUnderline: true
                              }}
                              sx={{
                                width: 120,
                                '& input': { fontSize: '0.75rem', textAlign: 'right', padding: '2px 0' }
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Box>

              {/* SECTION: Pengurangan Table */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                  Pengurangan
                </Typography>
                <Box sx={{ overflowX: 'auto', width: '100%', border: '1px solid #cbd5e1', borderRadius: 1 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1600 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {[
                          'Potongan Deposit', 'Potongan Denda', 'Potongan HTE', 'Potongan Indodana', 'Potongan Keterlambatan',
                          'Potongan KU', 'Potongan Natura', 'Potongan Natura Kendaraan', 'Potongan Natura Kesehatan',
                          'Potongan Parkir', 'Potongan Seragam', 'Potongan SP', 'Potongan SA Resign', 'Potongan Tagihan'
                        ].map((h) => (
                          <th key={h} style={{ padding: '8px 12px', border: '1px solid #94a3b8', color: '#475569', fontWeight: 700, fontSize: '0.75rem', textAlign: 'center' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {[
                          { field: 'potonganDeposit' },
                          { field: 'denda' },
                          { field: 'potonganHte' },
                          { field: 'potonganIndodana' },
                          { field: 'potonganKeterlambatan' },
                          { field: 'potonganKu' },
                          { field: 'potonganNatura' },
                          { field: 'potonganNaturaKendaraan' },
                          { field: 'potonganNaturaKesehatan' },
                          { field: 'potonganParkir' },
                          { field: 'potonganSeragam' },
                          { field: 'potonganSp' },
                          { field: 'potonganSaResign' },
                          { field: 'potonganTagihan' }
                        ].map((cell) => (
                          <td key={cell.field} style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'center', backgroundColor: '#ffffff' }}>
                            <TextField
                              type="number"
                              size="small"
                              variant="standard"
                              value={editForm[cell.field]}
                              onChange={(e) => handleEditFormChange(cell.field, parseFloat(e.target.value) || 0)}
                              InputProps={{
                                startAdornment: <span style={{ marginRight: 2, color: '#94a3b8', fontSize: '0.7rem' }}>Rp</span>,
                                disableUnderline: true
                              }}
                              sx={{
                                width: 100,
                                '& input': { fontSize: '0.75rem', textAlign: 'right', padding: '2px 0' }
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Box>

              {/* Keterangan Potongan */}
              <Box>
                <TextField
                  label="Keterangan Potongan"
                  size="small"
                  fullWidth
                  value={editForm.keterangan}
                  onChange={(e) => handleEditFormChange('keterangan', e.target.value)}
                />
              </Box>
            </Stack>
          )}

          {/* Modal Footer Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2, borderTop: '1px solid #cbd5e1', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenEditModal(false)}
              sx={{
                borderColor: '#cbd5e1',
                color: '#64748b',
                '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2
              }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveEditPayroll}
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                textTransform: 'none',
                fontWeight: 800,
                borderRadius: 2,
                px: 4
              }}
            >
              Simpan Perubahan
            </Button>
          </Box>
          </Stack>
        </Paper>
        </>
      )}

      {/* NESTED SUB-MODAL: EDIT BPJS */}
      <CustomModal
        open={openBpjsModal}
        onClose={() => setOpenBpjsModal(false)}
        title={`Edit BPJS & Asuransi Karyawan - ${editForm.name}`}
        maxWidth="lg"
      >
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Left Column: Input Form */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <Paper sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
                  Parameter BPJS TK & Kesehatan
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                      <InputLabel>BPJS TK Type</InputLabel>
                      <Select
                        value={editForm.bpjsTkType}
                        label="BPJS TK Type"
                        onChange={(e) => handleEditFormChange('bpjsTkType', e.target.value)}
                      >
                        <MenuItem value="Variable">Variable</MenuItem>
                        <MenuItem value="Fix">Fix</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                      <InputLabel>Mode Upah BPJS TK</InputLabel>
                      <Select
                        value={editForm.modeUpahBpjsTk}
                        label="Mode Upah BPJS TK"
                        onChange={(e) => handleEditFormChange('modeUpahBpjsTk', e.target.value)}
                      >
                        <MenuItem value="Gaji Pokok">Gaji Pokok</MenuItem>
                        <MenuItem value="Uplink">Uplink</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Upah BPJS TK (Rp)"
                      type="number"
                      size="small"
                      fullWidth
                      value={editForm.upahBpjsTk}
                      onChange={(e) => handleEditFormChange('upahBpjsTk', parseFloat(e.target.value) || 0)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="DUB"
                      size="small"
                      fullWidth
                      value={editForm.dub}
                      onChange={(e) => handleEditFormChange('dub', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                      <InputLabel>BPJS Ketenagakerjaan</InputLabel>
                      <Select
                        value={editForm.bpjsKetenagakerjaan}
                        label="BPJS Ketenagakerjaan"
                        onChange={(e) => handleEditFormChange('bpjsKetenagakerjaan', e.target.value)}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                      <InputLabel>BPJS Kesehatan</InputLabel>
                      <Select
                        value={editForm.bpjsKesehatan}
                        label="BPJS Kesehatan"
                        onChange={(e) => handleEditFormChange('bpjsKesehatan', e.target.value)}
                      >
                        <MenuItem value="1">Perusahaan 5%</MenuItem>
                        <MenuItem value="2">Perusahaan 4% dan Karyawan 1%</MenuItem>
                        <MenuItem value="3">Karyawan 5%</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
                  Badan Penyelenggara Upah (BPU) & Premi Asuransi
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField label="JKK BPU" type="number" size="small" fullWidth value={editForm.bpuJkk} onChange={(e) => handleEditFormChange('bpuJkk', parseFloat(e.target.value) || 0)} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField label="JKM BPU" type="number" size="small" fullWidth value={editForm.bpuJkm} onChange={(e) => handleEditFormChange('bpuJkm', parseFloat(e.target.value) || 0)} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField label="JHT BPU" type="number" size="small" fullWidth value={editForm.bpuJht} onChange={(e) => handleEditFormChange('bpuJht', parseFloat(e.target.value) || 0)} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField label="Asuransi Kesehatan" type="number" size="small" fullWidth value={editForm.asuransiKesehatan} onChange={(e) => handleEditFormChange('asuransiKesehatan', parseFloat(e.target.value) || 0)} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField label="Asuransi Kecelakaan" type="number" size="small" fullWidth value={editForm.asuransiKecelakaan} onChange={(e) => handleEditFormChange('asuransiKecelakaan', parseFloat(e.target.value) || 0)} />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField label="Premi Asuransi" type="number" size="small" fullWidth value={editForm.premiAsuransi} onChange={(e) => handleEditFormChange('premiAsuransi', parseFloat(e.target.value) || 0)} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                      <InputLabel>Asuransi Ditanggung oleh</InputLabel>
                      <Select
                        value={editForm.ditanggungOleh}
                        label="Asuransi Ditanggung oleh"
                        onChange={(e) => handleEditFormChange('ditanggungOleh', e.target.value)}
                      >
                        <MenuItem value="Perusahaan">Perusahaan</MenuItem>
                        <MenuItem value="Karyawan">Karyawan</MenuItem>
                        <MenuItem value="Bagi Dua">Bagi Dua (50:50)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column: Breakdown Table Detail */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2, height: '100%' }} elevation={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Rincian Perhitungan Iuran (Simulasi Live)
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => showSnackbar('Perhitungan iuran BPJS ter-update secara otomatis!', 'success')}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  CEK
                </Button>
              </Box>

              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 700 }}>NO</th>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 700 }}>Komponen BPJS</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>Nominal (Estimasi)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'JHT 3.7% (Perusahaan)', rate: 0.037 },
                      { name: 'JKK 0.24% (Perusahaan)', rate: 0.0024 },
                      { name: 'JKM 0.3% (Perusahaan)', rate: 0.003 },
                      { name: 'JIP 2% (Perusahaan)', rate: 0.02 },
                      { name: 'BPJS 4% (Perusahaan)', rate: 0.04 },
                      { name: 'JHT 2% (Karyawan)', rate: 0.02 },
                      { name: 'BPJS 1% (Karyawan)', rate: 0.01 }
                    ].map((row, idx) => {
                      const amount = Math.round(editForm.upahBpjsTk * row.rate);
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px' }}>{idx + 1}.</td>
                          <td style={{ padding: '8px' }}>{row.name}</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>
                            Rp {amount.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2, borderTop: '1px solid #cbd5e1', mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => {
              setOpenBpjsModal(false);
              showSnackbar('Konfigurasi iuran BPJS berhasil disimpan ke form payroll!', 'success');
            }}
            sx={{
              bgcolor: '#0f172a',
              '&:hover': { bgcolor: '#1e293b' },
              textTransform: 'none',
              fontWeight: 800,
              borderRadius: 2,
              px: 4
            }}
          >
            UPDATE
          </Button>
        </Box>
      </CustomModal>

      {/* MODAL ADD SPECIAL CASE (ADD EMPLOYEE) */}
      <CustomModal
        open={openSpecialCaseModal}
        onClose={() => setOpenSpecialCaseModal(false)}
        title="Tambah Data Karyawan Ke Payroll (ADD SPECIAL CASE)"
        maxWidth="lg"
      >
        <Stack spacing={3} sx={{ mt: 1, maxHeight: '80vh', overflowY: 'auto', pr: 1 }}>
          {/* SECTION 1: DATA KARYAWAN */}
          <Paper sx={{ p: 2.5, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
              DATA KARYAWAN
            </Typography>
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <TextField label="NIK *" size="small" fullWidth value={addForm.nik} onChange={(e) => setAddForm(prev => ({ ...prev, nik: e.target.value }))} />
                  <TextField label="Nama *" size="small" fullWidth value={addForm.name} onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))} />
                  <TextField label="Division *" size="small" fullWidth value={addForm.division} onChange={(e) => setAddForm(prev => ({ ...prev, division: e.target.value }))} />
                  <TextField label="Unit *" size="small" fullWidth value={addForm.unitName} onChange={(e) => setAddForm(prev => ({ ...prev, unitName: e.target.value }))} />
                  <TextField label="Position *" size="small" fullWidth value={addForm.position} onChange={(e) => setAddForm(prev => ({ ...prev, position: e.target.value }))} />
                  <TextField label="Employee Type *" size="small" fullWidth value={addForm.employeeType} onChange={(e) => setAddForm(prev => ({ ...prev, employeeType: e.target.value }))} />
                  <TextField label="Branch *" size="small" fullWidth value={addForm.branch} onChange={(e) => setAddForm(prev => ({ ...prev, branch: e.target.value }))} />
                  <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                    <InputLabel>Status *</InputLabel>
                    <Select value={addForm.statusEmployee} label="Status *" onChange={(e) => setAddForm(prev => ({ ...prev, statusEmployee: e.target.value }))}>
                      <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                      <MenuItem value="RESIGN">RESIGN</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="Resign Date *" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={addForm.resignDate} onChange={(e) => setAddForm(prev => ({ ...prev, resignDate: e.target.value }))} />
                </Stack>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', mb: 0.5, display: 'block' }}>
                      Periode Absen *
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={addForm.periodeStart} onChange={(e) => setAddForm(prev => ({ ...prev, periodeStart: e.target.value }))} />
                      <Typography variant="body2">-</Typography>
                      <TextField type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={addForm.periodeEnd} onChange={(e) => setAddForm(prev => ({ ...prev, periodeEnd: e.target.value }))} />
                    </Box>
                  </Box>
                  <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                    <InputLabel>Salary Type</InputLabel>
                    <Select value={addForm.salaryType} label="Salary Type" onChange={(e) => setAddForm(prev => ({ ...prev, salaryType: e.target.value }))}>
                      <MenuItem value=""><em>--PILIH--</em></MenuItem>
                      <MenuItem value="Fix">Fix</MenuItem>
                      <MenuItem value="Daily">Daily</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                    <InputLabel>Works Days</InputLabel>
                    <Select value={addForm.worksDays} label="Works Days" onChange={(e) => setAddForm(prev => ({ ...prev, worksDays: e.target.value }))}>
                      <MenuItem value=""><em>--PILIH--</em></MenuItem>
                      <MenuItem value="5">5 Hari Kerja</MenuItem>
                      <MenuItem value="6">6 Hari Kerja</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="Absen" type="number" size="small" fullWidth value={addForm.absen} onChange={(e) => setAddForm(prev => ({ ...prev, absen: parseInt(e.target.value) || 0 }))} />
                  <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                    <InputLabel>BPJS TK Type</InputLabel>
                    <Select value={addForm.bpjsTkType} label="BPJS TK Type" onChange={(e) => setAddForm(prev => ({ ...prev, bpjsTkType: e.target.value }))}>
                      <MenuItem value=""><em>--PILIH--</em></MenuItem>
                      <MenuItem value="Variable">Variable</MenuItem>
                      <MenuItem value="Fix">Fix</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField label="Manajemen Fee Dalam (%)" size="small" fullWidth value={addForm.manajemenFee} onChange={(e) => setAddForm(prev => ({ ...prev, manajemenFee: e.target.value }))} />
                  <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                    <InputLabel>Methode Pajak *</InputLabel>
                    <Select value={addForm.metodePajak} label="Methode Pajak *" onChange={(e) => setAddForm(prev => ({ ...prev, metodePajak: e.target.value }))}>
                      <MenuItem value=""><em>--PILIH--</em></MenuItem>
                      <MenuItem value="NETTO">NETTO</MenuItem>
                      <MenuItem value="GROSS">GROSS</MenuItem>
                      <MenuItem value="GROSS UP">GROSS UP</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                    <InputLabel>Komponen Project</InputLabel>
                    <Select value={addForm.komponenProject} label="Komponen Project" onChange={(e) => setAddForm(prev => ({ ...prev, komponenProject: e.target.value }))}>
                      <MenuItem value=""><em>--PILIH--</em></MenuItem>
                      <MenuItem value="Project A">Project A</MenuItem>
                      <MenuItem value="Project B">Project B</MenuItem>
                      <MenuItem value="Project C">Project C</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* SECTION 2: Kategori Tunjangan */}
          <Paper sx={{ p: 2.5, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
              Kategori Tunjangan
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                  <InputLabel shrink>Tunjangan Tetap</InputLabel>
                  <Select
                    multiple
                    displayEmpty
                    value={addForm.tunjanganTetap}
                    label="Tunjangan Tetap"
                    onChange={(e) => setAddForm(prev => ({ ...prev, tunjanganTetap: e.target.value }))}
                    renderValue={(selected) => {
                      if (!selected || selected.length === 0) return <span style={{ color: '#94a3b8' }}>--PILIH--</span>;
                      return selected.join(', ');
                    }}
                  >
                    <MenuItem value="Tunjangan Jabatan">Tunjangan Jabatan</MenuItem>
                    <MenuItem value="Tunjangan Makan">Tunjangan Makan</MenuItem>
                    <MenuItem value="Tunjangan Transport">Tunjangan Transport</MenuItem>
                    <MenuItem value="Grading Allowance">Grading Allowance</MenuItem>
                    <MenuItem value="Montly Allowance">Montly Allowance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                  <InputLabel shrink>Tunjangan Tidak Tetap</InputLabel>
                  <Select
                    multiple
                    displayEmpty
                    value={addForm.tunjanganTidakTetap}
                    label="Tunjangan Tidak Tetap"
                    onChange={(e) => setAddForm(prev => ({ ...prev, tunjanganTidakTetap: e.target.value }))}
                    renderValue={(selected) => {
                      if (!selected || selected.length === 0) return <span style={{ color: '#94a3b8' }}>--PILIH--</span>;
                      return selected.join(', ');
                    }}
                  >
                    <MenuItem value="Insentif Bulanan">Insentif Bulanan</MenuItem>
                    <MenuItem value="Uang Lembur">Uang Lembur</MenuItem>
                    <MenuItem value="Bonus Kerajinan">Bonus Kerajinan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* SECTION 3: List Tunjangan */}
          <Paper sx={{ p: 2.5, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
              List Tunjangan
            </Typography>
            <Grid container spacing={2}>
              {(addForm.tunjanganTetap.length === 0 && addForm.tunjanganTidakTetap.length === 0) ? (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Pilih kategori tunjangan di atas untuk mengisi nominal tunjangan.
                  </Typography>
                </Grid>
              ) : (
                <>
                  {addForm.tunjanganTetap.includes("Tunjangan Jabatan") && (
                    <Grid item xs={12} sm={4}>
                      <TextField label="Tunjangan Jabatan" type="number" size="small" fullWidth value={addForm.tunjanganJabatanVal} onChange={(e) => setAddForm(prev => ({ ...prev, tunjanganJabatanVal: e.target.value }))} />
                    </Grid>
                  )}
                  {addForm.tunjanganTetap.includes("Tunjangan Makan") && (
                    <Grid item xs={12} sm={4}>
                      <TextField label="Tunjangan Makan" type="number" size="small" fullWidth value={addForm.tunjanganMakanVal} onChange={(e) => setAddForm(prev => ({ ...prev, tunjanganMakanVal: e.target.value }))} />
                    </Grid>
                  )}
                  {addForm.tunjanganTetap.includes("Tunjangan Transport") && (
                    <Grid item xs={12} sm={4}>
                      <TextField label="Tunjangan Transport" type="number" size="small" fullWidth value={addForm.tunjanganTransportVal} onChange={(e) => setAddForm(prev => ({ ...prev, tunjanganTransportVal: e.target.value }))} />
                    </Grid>
                  )}
                  {addForm.tunjanganTetap.includes("Grading Allowance") && (
                    <Grid item xs={12} sm={4}>
                      <TextField label="Grading Allowance" type="number" size="small" fullWidth value={addForm.gradingAllowanceVal} onChange={(e) => setAddForm(prev => ({ ...prev, gradingAllowanceVal: e.target.value }))} />
                    </Grid>
                  )}
                  {addForm.tunjanganTetap.includes("Montly Allowance") && (
                    <Grid item xs={12} sm={4}>
                      <TextField label="Montly Allowance" type="number" size="small" fullWidth value={addForm.montlyAllowanceVal} onChange={(e) => setAddForm(prev => ({ ...prev, montlyAllowanceVal: e.target.value }))} />
                    </Grid>
                  )}
                  {addForm.tunjanganTidakTetap.includes("Insentif Bulanan") && (
                    <Grid item xs={12} sm={4}>
                      <TextField label="Insentif Bulanan" type="number" size="small" fullWidth value={addForm.insentifBulananVal} onChange={(e) => setAddForm(prev => ({ ...prev, insentifBulananVal: e.target.value }))} />
                    </Grid>
                  )}
                  {addForm.tunjanganTidakTetap.includes("Uang Lembur") && (
                    <Grid item xs={12} sm={4}>
                      <TextField label="Uang Lembur" type="number" size="small" fullWidth value={addForm.uangLemburVal} onChange={(e) => setAddForm(prev => ({ ...prev, uangLemburVal: e.target.value }))} />
                    </Grid>
                  )}
                  {addForm.tunjanganTidakTetap.includes("Bonus Kerajinan") && (
                    <Grid item xs={12} sm={4}>
                      <TextField label="Bonus Kerajinan" type="number" size="small" fullWidth value={addForm.bonusKerajinanVal} onChange={(e) => setAddForm(prev => ({ ...prev, bonusKerajinanVal: e.target.value }))} />
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Paper>

          {/* SECTION 4: Non Upah */}
          <Paper sx={{ p: 2.5, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
              Non Upah
            </Typography>
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <TextField label="Insentif" type="number" size="small" fullWidth value={addForm.insentif} onChange={(e) => setAddForm(prev => ({ ...prev, insentif: e.target.value }))} />
                  <TextField label="Lembur" type="number" size="small" fullWidth value={addForm.lembur} onChange={(e) => setAddForm(prev => ({ ...prev, lembur: e.target.value }))} />
                  <TextField label="Productivity" type="number" size="small" fullWidth value={addForm.productivity} onChange={(e) => setAddForm(prev => ({ ...prev, productivity: e.target.value }))} />
                  <TextField label="TJ Kesehatan" type="number" size="small" fullWidth value={addForm.tjKesehatan} onChange={(e) => setAddForm(prev => ({ ...prev, tjKesehatan: e.target.value }))} />
                  <TextField label="Performance Pay" type="number" size="small" fullWidth value={addForm.performancePay} onChange={(e) => setAddForm(prev => ({ ...prev, performancePay: e.target.value }))} />
                  <TextField label="Bonus Non Upah" type="number" size="small" fullWidth value={addForm.bonusNonUpah} onChange={(e) => setAddForm(prev => ({ ...prev, bonusNonUpah: e.target.value }))} />
                </Stack>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <TextField label="Monthly Commission" type="number" size="small" fullWidth value={addForm.monthlyCommission} onChange={(e) => setAddForm(prev => ({ ...prev, monthlyCommission: e.target.value }))} />
                  <TextField label="Shift Allowance" type="number" size="small" fullWidth value={addForm.shiftAllowance} onChange={(e) => setAddForm(prev => ({ ...prev, shiftAllowance: e.target.value }))} />
                  <TextField label="THR" type="number" size="small" fullWidth value={addForm.thr} onChange={(e) => setAddForm(prev => ({ ...prev, thr: e.target.value }))} />
                  <TextField label="Kompensasi" type="number" size="small" fullWidth value={addForm.kompensasi} onChange={(e) => setAddForm(prev => ({ ...prev, kompensasi: e.target.value }))} />
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* SECTION 5: Special Treatment */}
          <Paper sx={{ p: 2.5, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
              Special Treatment
            </Typography>
            <Stack direction="row" spacing={3}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addForm.specialTreatment.biayaJasaTraining}
                    onChange={(e) => setAddForm(prev => ({
                      ...prev,
                      specialTreatment: { ...prev.specialTreatment, biayaJasaTraining: e.target.checked }
                    }))}
                  />
                }
                label="Biaya Jasa Training"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addForm.specialTreatment.bonus}
                    onChange={(e) => setAddForm(prev => ({
                      ...prev,
                      specialTreatment: { ...prev.specialTreatment, bonus: e.target.checked }
                    }))}
                  />
                }
                label="Bonus"
              />
            </Stack>
          </Paper>

          {/* SECTION 6: Opsional */}
          <Paper sx={{ p: 2.5, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
              Opsional
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField label="Rapelan" type="number" size="small" fullWidth value={addForm.rapelan} onChange={(e) => setAddForm(prev => ({ ...prev, rapelan: e.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Tunjangan Lain" type="number" size="small" fullWidth value={addForm.tunjanganLain} onChange={(e) => setAddForm(prev => ({ ...prev, tunjanganLain: e.target.value }))} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField label="Tunjangan Lain Non Tax" type="number" size="small" fullWidth value={addForm.tunjanganLainNonTax} onChange={(e) => setAddForm(prev => ({ ...prev, tunjanganLainNonTax: e.target.value }))} />
              </Grid>
            </Grid>
          </Paper>

          {/* SECTION 7: Pajak */}
          <Paper sx={{ p: 2.5, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
              Pajak
            </Typography>
            <Grid container spacing={3}>
              {/* BPJS Sub-Section */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>BPJS</Typography>
                  <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                    <InputLabel>BPJS Kesehatan</InputLabel>
                    <Select value={addForm.bpjsKesehatan} label="BPJS Kesehatan" onChange={(e) => setAddForm(prev => ({ ...prev, bpjsKesehatan: e.target.value }))}>
                      <MenuItem value=""><em>--PILIH--</em></MenuItem>
                      <MenuItem value="1">Perusahaan 5%</MenuItem>
                      <MenuItem value="2">Perusahaan 4% dan Karyawan 1%</MenuItem>
                      <MenuItem value="3">Karyawan 5%</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                    <InputLabel>BPJS Ketenagakerjaan</InputLabel>
                    <Select value={addForm.bpjsTk} label="BPJS Ketenagakerjaan" onChange={(e) => setAddForm(prev => ({ ...prev, bpjsTk: e.target.value }))}>
                      <MenuItem value=""><em>--PILIH--</em></MenuItem>
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                    <InputLabel>Komponen Upah BPJS TK</InputLabel>
                    <Select value={addForm.bpjsTkType} label="Komponen Upah BPJS TK" onChange={(e) => setAddForm(prev => ({ ...prev, bpjsTkType: e.target.value }))}>
                      <MenuItem value=""><em>--PILIH--</em></MenuItem>
                      <MenuItem value="Gaji Pokok">Gaji Pokok</MenuItem>
                      <MenuItem value="Uplink">Uplink</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/* BPU and Asuransi Sub-Section */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>BPU & Asuransi</Typography>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <TextField label="JKK" type="number" size="small" fullWidth value={addForm.jkk} onChange={(e) => setAddForm(prev => ({ ...prev, jkk: e.target.value }))} />
                    <TextField label="JKM" type="number" size="small" fullWidth value={addForm.jkm} onChange={(e) => setAddForm(prev => ({ ...prev, jkm: e.target.value }))} />
                    <TextField label="JHT" type="number" size="small" fullWidth value={addForm.jht} onChange={(e) => setAddForm(prev => ({ ...prev, jht: e.target.value }))} />
                  </Box>
                  <TextField label="Premi Asuransi" type="number" size="small" fullWidth value={addForm.premiAsuransi} onChange={(e) => setAddForm(prev => ({ ...prev, premiAsuransi: e.target.value }))} />
                  <FormControl size="small" fullWidth sx={{ minWidth: 160 }}>
                    <InputLabel>Ditanggung oleh</InputLabel>
                    <Select value={addForm.ditanggungOleh} label="Ditanggung oleh" onChange={(e) => setAddForm(prev => ({ ...prev, ditanggungOleh: e.target.value }))}>
                      <MenuItem value=""><em>--PILIH--</em></MenuItem>
                      <MenuItem value="Karyawan">Karyawan</MenuItem>
                      <MenuItem value="Perusahaan">Perusahaan</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* SECTION 8: Pengurangan */}
          <Paper sx={{ p: 2.5, border: '1px solid #cbd5e1', borderRadius: 2 }} elevation={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>
              Pengurangan
            </Typography>
            <Grid container spacing={3}>
              {/* Inputs Column */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <TextField label="Wagely" type="number" size="small" fullWidth value={addForm.wagely} onChange={(e) => setAddForm(prev => ({ ...prev, wagely: e.target.value }))} />
                  <TextField label="Potongan Lain" type="number" size="small" fullWidth value={addForm.potonganLain} onChange={(e) => setAddForm(prev => ({ ...prev, potonganLain: e.target.value }))} />
                  <TextField label="Potongan Lain Non Tax" type="number" size="small" fullWidth value={addForm.potonganLainNonTax} onChange={(e) => setAddForm(prev => ({ ...prev, potonganLainNonTax: e.target.value }))} />
                </Stack>
              </Grid>

              {/* Textarea Column */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Keterangan"
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  value={addForm.keterangan}
                  onChange={(e) => setAddForm(prev => ({ ...prev, keterangan: e.target.value }))}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Footer Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2, borderTop: '1px solid #cbd5e1', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenSpecialCaseModal(false)}
              sx={{
                borderColor: '#cbd5e1',
                color: '#64748b',
                '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' },
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2
              }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (!addForm.nik || !addForm.name || !addForm.division || !addForm.unitName) {
                  showSnackbar('NIK, Nama, Division, dan Unit wajib diisi!', 'warning');
                  return;
                }

                // Construct dynamic components
                const comps = [
                  { code: 'INSENTIF', name: 'Insentif', amount: parseFloat(addForm.insentif) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'LEMBUR', name: 'Lembur', amount: parseFloat(addForm.lembur) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'PRODUCTIVITY', name: 'Productivity', amount: parseFloat(addForm.productivity) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'TJ_KESEHATAN', name: 'Tunjangan Kesehatan', amount: parseFloat(addForm.tjKesehatan) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'PERFORMANCE_PAY', name: 'Performance Pay', amount: parseFloat(addForm.performancePay) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'BONUS_NON_UPAH', name: 'Bonus Non Upah', amount: parseFloat(addForm.bonusNonUpah) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'COMMISSION', name: 'Monthly Commission', amount: parseFloat(addForm.monthlyCommission) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'SHIFT_ALLOWANCE', name: 'Shift Allowance', amount: parseFloat(addForm.shiftAllowance) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'THR', name: 'THR', amount: parseFloat(addForm.thr) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'KOMPENSASI', name: 'Kompensasi', amount: parseFloat(addForm.kompensasi) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'RAPELAN', name: 'Rapelan', amount: parseFloat(addForm.rapelan) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'TJ_LAIN', name: 'Tunjangan Lain', amount: parseFloat(addForm.tunjanganLain) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'TJ_LAIN_NONTAX', name: 'Tunjangan Lain Non Tax', amount: parseFloat(addForm.tunjanganLainNonTax) || 0, type: 'EARNING', isTaxable: false },
                  { code: 'WAGELY', name: 'Wagely', amount: parseFloat(addForm.wagely) || 0, type: 'DEDUCTION', isTaxable: false },
                  { code: 'POT_LAIN', name: 'Potongan Lain', amount: parseFloat(addForm.potonganLain) || 0, type: 'DEDUCTION', isTaxable: true },
                  { code: 'POT_LAIN_NONTAX', name: 'Potongan Lain Non Tax', amount: parseFloat(addForm.potonganLainNonTax) || 0, type: 'DEDUCTION', isTaxable: false },
                  { code: 'TJ_GRADING', name: 'Grading Allowance', amount: parseFloat(addForm.gradingAllowanceVal) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'TJ_MONTHLY', name: 'Montly Allowance', amount: parseFloat(addForm.montlyAllowanceVal) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'TJ_JABATAN', name: 'Tunjangan Jabatan', amount: parseFloat(addForm.tunjanganJabatanVal) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'TJ_MAKAN', name: 'Tunjangan Makan', amount: parseFloat(addForm.tunjanganMakanVal) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'TJ_TRANSPORT', name: 'Tunjangan Transport', amount: parseFloat(addForm.tunjanganTransportVal) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'TJ_INSENTIF_BULANAN', name: 'Insentif Bulanan', amount: parseFloat(addForm.insentifBulananVal) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'TJ_UANG_LEMBUR', name: 'Uang Lembur', amount: parseFloat(addForm.uangLemburVal) || 0, type: 'EARNING', isTaxable: true },
                  { code: 'TJ_BONUS_KERAJINAN', name: 'Bonus Kerajinan', amount: parseFloat(addForm.bonusKerajinanVal) || 0, type: 'EARNING', isTaxable: true }
                ].filter(c => c.amount > 0);

                const newRecord = {
                  id: Math.max(...dataList.map(r => r.id)) + 1,
                  nik: addForm.nik.trim(),
                  name: addForm.name.trim(),
                  employeeType: addForm.employeeType || 'PERMANENT',
                  division: addForm.division.trim(),
                  unitName: addForm.unitName.trim(),
                  position: addForm.position || 'Staff',
                  branch: addForm.branch || 'Head Office',
                  statusEmployee: addForm.statusEmployee,
                  statusPayroll: 'NEW',
                  statusData: 'NEW',
                  statusBayar: 'UNPAID',
                  absen: addForm.absen,
                  basicSalary: 4500000,
                  grossSalary: 4500000 + comps.filter(c => c.type === 'EARNING').reduce((sum, item) => sum + item.amount, 0),
                  periodeStart: addForm.periodeStart || '2026-01-01',
                  periodeEnd: addForm.periodeEnd || '2026-01-31',
                  metodePajak: addForm.metodePajak || 'NETTO',
                  komponenProject: addForm.komponenProject || 'Project A',
                  sumberAcuanPajak: 'Master',
                  bpjsTkType: addForm.bpjsTkType,
                  bpjsKetenagakerjaan: addForm.bpjsTk,
                  bpjsKesehatan: addForm.bpjsKesehatan,
                  modeUpahBpjsTk: addForm.bpjsTkType,
                  bpuJkk: parseFloat(addForm.jkk) || 0,
                  bpuJkm: parseFloat(addForm.jkm) || 0,
                  bpuJht: parseFloat(addForm.jht) || 0,
                  premiAsuransi: parseFloat(addForm.premiAsuransi) || 0,
                  ditanggungOleh: addForm.ditanggungOleh,
                  dynamicComponents: comps
                };

                setDataList(prev => [newRecord, ...prev]);
                setOpenSpecialCaseModal(false);
                showSnackbar(`Karyawan ${addForm.name} berhasil ditambahkan ke list payroll!`, 'success');
                
                // reset form
                setAddForm({
                  nik: '', name: '', division: '', unitName: '', position: '', employeeType: '', branch: '', statusEmployee: 'ACTIVE', resignDate: '',
                  periodeStart: '', periodeEnd: '', salaryType: '', worksDays: '', absen: 0, bpjsTkType: '', manajemenFee: '0.0', metodePajak: '', komponenProject: '',
                  tunjanganTetap: [], tunjanganTidakTetap: [],
                  tunjanganJabatanVal: '', tunjanganMakanVal: '', tunjanganTransportVal: '',
                  insentifBulananVal: '', uangLemburVal: '', bonusKerajinanVal: '',
                  gradingAllowanceVal: '', montlyAllowanceVal: '',
                  insentif: '', lembur: '', productivity: '', tjKesehatan: '', performancePay: '', bonusNonUpah: '', monthlyCommission: '', shiftAllowance: '', thr: '', kompensasi: '',
                  specialTreatment: { biayaJasaTraining: false, bonus: false },
                  rapelan: '', tunjanganLain: '', tunjanganLainNonTax: '',
                  wagely: '', potonganLain: '', potonganLainNonTax: '', keterangan: '',
                  bpjsTk: '', bpjsKesehatan: '', jkk: '', jkm: '', jht: '', asuransiKesehatan: '', asuransiKecelakaan: '', premiAsuransi: '', ditanggungOleh: ''
                });
              }}
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                textTransform: 'none',
                fontWeight: 800,
                borderRadius: 2,
                px: 4
              }}
            >
              Simpan Data Karyawan
            </Button>
          </Box>
        </Stack>
      </CustomModal>

      {/* MODAL BULK UPLOAD DIALOG */}
      <CustomModal
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        title={
          uploadType === 'ABSEN' ? 'Upload Absen' :
          uploadType === 'TUNJANGAN' ? 'Upload Tunjangan' :
          uploadType === 'PENGURANGAN' ? 'Upload Pengurangan' :
          uploadType === 'BPJS' ? 'Upload Bpjs' :
          uploadType === 'LEMBUR' ? 'Upload Lembur' :
          uploadType === 'ASURANSI' ? 'Upload Asuransi' :
          uploadType === 'SPECIAL_INCENTIVE' ? 'Upload Special Incentive' :
          uploadType === 'KENAIKAN_GAJI' ? 'Upload Kenaikan Gaji Tahunan' : 'Upload Data'
        }
        maxWidth="md"
      >
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {['ABSEN', 'TUNJANGAN', 'PENGURANGAN', 'BPJS', 'ASURANSI'].includes(uploadType) && (
              <>
                {/* Periode */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>Periode</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <TextField
                        type="date"
                        size="small"
                        value={uploadPeriodeStart}
                        onChange={(e) => setUploadPeriodeStart(e.target.value)}
                        sx={{ bgcolor: 'white' }}
                      />
                      <Typography variant="body2" sx={{ color: '#64748b' }}>s/d</Typography>
                      <TextField
                        type="date"
                        size="small"
                        value={uploadPeriodeEnd}
                        onChange={(e) => setUploadPeriodeEnd(e.target.value)}
                        sx={{ bgcolor: 'white' }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                {/* File Choose */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>File</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      size="small"
                      fullWidth
                      value={uploadFile ? uploadFile.name : ''}
                      placeholder="Choose File"
                      onClick={() => {
                        const fileInput = document.getElementById('dialog-upload-file-input');
                        if (fileInput) fileInput.click();
                      }}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <FolderOpenIcon sx={{ color: '#10b981', cursor: 'pointer' }} onClick={() => {
                            const fileInput = document.getElementById('dialog-upload-file-input');
                            if (fileInput) fileInput.click();
                          }} />
                        ),
                        sx: { cursor: 'pointer', bgcolor: 'white', borderRadius: 1.5 }
                      }}
                    />
                    <input
                      id="dialog-upload-file-input"
                      type="file"
                      style={{ display: 'none' }}
                      accept=".xls,.xlsx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadFile(e.target.files[0]);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        onClick={() => startProcessSimulation(uploadType)}
                        disabled={!uploadFile}
                        sx={{ px: 2, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                      >
                        Upload
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => startProcessSimulation(uploadType)}
                        disabled={!uploadFile}
                        sx={{ px: 2, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                      >
                        Process
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => downloadTemplate(uploadType)}
                        sx={{ px: 2, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', color: '#3b82f6', borderColor: '#3b82f6', whiteSpace: 'nowrap' }}
                      >
                        Template {
                          uploadType === 'ABSEN' ? 'Absen' :
                          uploadType === 'TUNJANGAN' ? 'Tunjangan' :
                          uploadType === 'PENGURANGAN' ? 'Pengurangan' :
                          uploadType === 'ASURANSI' ? 'Asuransi' : 'Bpjs'
                        }
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Kategori Rapelan (Absen Only) */}
                {uploadType === 'ABSEN' && (
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>Kategori Rapelan</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white' }}>
                        <Select
                          multiple
                          displayEmpty
                          value={uploadKategoriRapelan}
                          onChange={(e) => setUploadKategoriRapelan(e.target.value)}
                          renderValue={(selected) => {
                            if (!selected || selected.length === 0) return <span style={{ color: '#94a3b8' }}>--PILIH--</span>;
                            return selected.join(', ');
                          }}
                        >
                          <MenuItem value="Salary">Salary</MenuItem>
                          <MenuItem value="Tunjangan">Tunjangan</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
              </>
            )}

            {/* LEMBUR layout */}
            {uploadType === 'LEMBUR' && (
              <>
                {/* File Choose */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>File</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      size="small"
                      fullWidth
                      value={uploadFile ? uploadFile.name : ''}
                      placeholder="Choose File"
                      onClick={() => {
                        const fileInput = document.getElementById('dialog-upload-file-input');
                        if (fileInput) fileInput.click();
                      }}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <FolderOpenIcon sx={{ color: '#10b981', cursor: 'pointer' }} onClick={() => {
                            const fileInput = document.getElementById('dialog-upload-file-input');
                            if (fileInput) fileInput.click();
                          }} />
                        ),
                        sx: { cursor: 'pointer', bgcolor: 'white', borderRadius: 1.5 }
                      }}
                    />
                    <input
                      id="dialog-upload-file-input"
                      type="file"
                      style={{ display: 'none' }}
                      accept=".xls,.xlsx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadFile(e.target.files[0]);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        onClick={() => startProcessSimulation('LEMBUR')}
                        disabled={!uploadFile}
                        sx={{ px: 2, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                      >
                        View Data
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => startProcessSimulation('LEMBUR')}
                        disabled={!uploadFile}
                        sx={{ px: 2, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                      >
                        Process
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => downloadTemplate('LEMBUR')}
                        sx={{ px: 2, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', color: '#3b82f6', borderColor: '#3b82f6', whiteSpace: 'nowrap' }}
                      >
                        Download Template
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Periode Dropdown */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>Periode</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white' }}>
                      <Select
                        value={uploadLemburPeriode}
                        onChange={(e) => setUploadLemburPeriode(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value=""><em>(Pilih Periode)</em></MenuItem>
                        <MenuItem value="01">Januari</MenuItem>
                        <MenuItem value="02">Februari</MenuItem>
                        <MenuItem value="03">Maret</MenuItem>
                        <MenuItem value="04">April</MenuItem>
                        <MenuItem value="05">Mei</MenuItem>
                        <MenuItem value="06">Juni</MenuItem>
                        <MenuItem value="07">Juli</MenuItem>
                        <MenuItem value="08">Agustus</MenuItem>
                        <MenuItem value="09">September</MenuItem>
                        <MenuItem value="10">Oktober</MenuItem>
                        <MenuItem value="11">November</MenuItem>
                        <MenuItem value="12">Desember</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* Tahun Dropdown */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>Tahun</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white' }}>
                      <Select
                        value={uploadLemburTahun}
                        onChange={(e) => setUploadLemburTahun(e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value=""><em>(Pilih Tahun)</em></MenuItem>
                        <MenuItem value="2026">2026</MenuItem>
                        <MenuItem value="2025">2025</MenuItem>
                        <MenuItem value="2024">2024</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </>
            )}

            {/* SPECIAL_INCENTIVE & KENAIKAN_GAJI layout (File Only) */}
            {['SPECIAL_INCENTIVE', 'KENAIKAN_GAJI'].includes(uploadType) && (
              <>
                {/* File Choose */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>File</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      size="small"
                      fullWidth
                      value={uploadFile ? uploadFile.name : ''}
                      placeholder="Choose File"
                      onClick={() => {
                        const fileInput = document.getElementById('dialog-upload-file-input');
                        if (fileInput) fileInput.click();
                      }}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <FolderOpenIcon sx={{ color: '#10b981', cursor: 'pointer' }} onClick={() => {
                            const fileInput = document.getElementById('dialog-upload-file-input');
                            if (fileInput) fileInput.click();
                          }} />
                        ),
                        sx: { cursor: 'pointer', bgcolor: 'white', borderRadius: 1.5 }
                      }}
                    />
                    <input
                      id="dialog-upload-file-input"
                      type="file"
                      style={{ display: 'none' }}
                      accept=".xls,.xlsx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadFile(e.target.files[0]);
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        onClick={() => startProcessSimulation(uploadType)}
                        disabled={!uploadFile}
                        sx={{ px: 2, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                      >
                        Upload
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => startProcessSimulation(uploadType)}
                        disabled={!uploadFile}
                        sx={{ px: 2, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                      >
                        Process
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => downloadTemplate(uploadType)}
                        sx={{ px: 2, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', color: '#3b82f6', borderColor: '#3b82f6', whiteSpace: 'nowrap' }}
                      >
                        Template {uploadType === 'SPECIAL_INCENTIVE' ? 'Special Incentive' : 'Kenaikan Gaji'}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </>
            )}

            {/* Criteria & Rules Info */}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #cbd5e1' }}>
              {uploadType === 'ABSEN' && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Kriteria penginputan data :</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Kolom yang wajib diisi : "NIK" dan "Nama"</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 600, color: '#475569' }}>2. List kategori rapelan dapat dipilih jika ingin absen langsung menghitung nominal rapelan</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Informasi Penting</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Total Gaji Kotor dan BPJS tidak langsung dihitung saat Upload Absen</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>2. Untuk melihat hasil perhitungan:</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>a. Klik tombol "CEK PERHITUNGAN", atau</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>b. Langsung pilih "REQUEST PAYROLL".</Typography>
                </>
              )}
              {uploadType === 'TUNJANGAN' && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Kriteria penginputan data :</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 600, color: '#475569' }}>1. Kolom yang wajib diisi : "NIK" dan "Nama"</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Informasi Penting</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Total Gaji Kotor dan BPJS tidak langsung dihitung saat Upload Tunjangan</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>2. Untuk melihat hasil perhitungan:</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>a. Klik tombol "CEK PERHITUNGAN", atau</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>b. Langsung pilih "REQUEST PAYROLL".</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 600, color: '#475569' }}>3. Khusus rapel, data hanya akan di-update jika kolom absen rapelan masih kosong. Jika sudah pernah diisi, perhitungan hanya bisa dilakukan oleh sistem secara otomatis.</Typography>
                </>
              )}
              {uploadType === 'PENGURANGAN' && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Kriteria penginputan data :</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 600, color: '#475569' }}>1. Kolom yang wajib diisi : "NIK" dan "Nama"</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Informasi Penting</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Total Gaji Kotor dan BPJS tidak langsung dihitung saat Upload Pengurangan</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>2. Untuk melihat hasil perhitungan:</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>a. Klik tombol "CEK PERHITUNGAN", atau</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>b. Langsung pilih "REQUEST PAYROLL".</Typography>
                </>
              )}
              {uploadType === 'BPJS' && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Kriteria penginputan data :</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Data yang terupdate hanya ketika absen telah diinput</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>2. Kolom yang wajib diisi : "NIK" dan "Nama"</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>3. Pilihan untuk "BPJS Ketenagakerjaan", "BPJS Kesehatan", dan "BPJS Keluarga" jika "YES" maka tuliskan "1" dan jika "NO" maka tuliskan "0"</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 600, color: '#475569' }}>4. Untuk "BPU" langsung dituliskan dalam bentuk nominal</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Informasi Penting</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Total Gaji Kotor dan BPJS tidak langsung dihitung saat Upload BPJS</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>2. Untuk melihat hasil perhitungan:</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>a. Klik tombol "CEK PERHITUNGAN", atau</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>b. Langsung pilih "REQUEST PAYROLL".</Typography>
                </>
              )}
              {uploadType === 'LEMBUR' && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Kriteria penginputan data :</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Kolom yang wajib diisi : "Tanggal,Lembur,Nik,Nama, Mulai Lembur, Selesai Lembur, Lama Lembur"</Typography>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#475569' }}>2. format isi Mulai Lembur, Selesai, lama break : "00:00:00"</Typography>
                </>
              )}
              {uploadType === 'ASURANSI' && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Kriteria penginputan data :</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 600, color: '#475569' }}>1. Kolom yang wajib diisi : "NIK" dan "Nama"</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Informasi Penting</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Total Gaji Kotor tidak langsung dihitung saat Upload Asuransi</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>2. Untuk melihat hasil perhitungan:</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>a. Klik tombol "CEK PERHITUNGAN", atau</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>b. Langsung pilih "REQUEST PAYROLL".</Typography>
                </>
              )}
              {uploadType === 'SPECIAL_INCENTIVE' && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Kriteria penginputan data :</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Data yang diupdate dengan status data: Special Insentive</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 2, fontWeight: 600, color: '#475569' }}>2. Kolom yang wajib diisi "NIK" dan "Nama"</Typography>

                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Informasi Penting</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Total Gaji Kotor dan BPJS tidak langsung dihitung saat Upload BPJS</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>2. Untuk melihat hasil perhitungan:</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>a. Klik tombol "CEK PERHITUNGAN", atau</Typography>
                  <Typography variant="caption" sx={{ display: 'block', ml: 2, fontWeight: 600, color: '#475569' }}>b. Langsung pilih "REQUEST PAYROLL".</Typography>
                </>
              )}
              {uploadType === 'KENAIKAN_GAJI' && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369a1', mb: 1 }}>Kriteria penginputan data :</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, color: '#475569' }}>1. Untuk Kenaikan Gaji Tahunan Mix wajib isi semua field</Typography>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: '#475569' }}>2. Field absen digunakan untuk Kenaikan Gaji mix</Typography>
                </>
              )}
            </Box>
          </Stack>
        </DialogContent>
      </CustomModal>

      {/* Floating Progress Bar Service */}
      {isUploadingInBackground && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            width: isProgressMinimized ? 'auto' : 320,
            bgcolor: 'white',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            border: '1px solid #cbd5e1',
            borderRadius: 3,
            p: isProgressMinimized ? 1.5 : 2,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          {isProgressMinimized ? (
            <Tooltip title="Click to expand process details" placement="left">
              <Box
                onClick={() => setIsProgressMinimized(false)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.9 }
                }}
              >
                <CircularProgress variant="determinate" value={uploadProgress} size={20} sx={{ color: '#3b82f6' }} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {backgroundProcessName} {uploadProgress}%
                </Typography>
              </Box>
            </Tooltip>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', pb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {backgroundProcessName}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => setIsProgressMinimized(true)} sx={{ color: '#64748b' }}>
                    <RemoveIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => setIsUploadingInBackground(false)} sx={{ color: '#ef4444' }}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  File: {selectedFileName}
                </Typography>
                <Box sx={{ width: '100%', bgcolor: '#e2e8f0', borderRadius: 1.5, height: 6, overflow: 'hidden', position: 'relative' }}>
                  <Box
                    sx={{
                      width: `${uploadProgress}%`,
                      bgcolor: '#3b82f6',
                      height: '100%',
                      borderRadius: 1.5,
                      transition: 'width 0.4s ease'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                    {uploadProgress}% Complete
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      )}

      {/* MODAL HISTORY REJECTED (SPV Only) */}
      <CustomModal
        open={openHistoryRejectedModal}
        onClose={() => setOpenHistoryRejectedModal(false)}
        title="History Reject"
        maxWidth="lg"
      >
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Filter Panel */}
            <Paper sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2, bgcolor: '#f8fafc' }} elevation={0}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    placeholder="Cari NIK / Nama..."
                    size="small"
                    fullWidth
                    value={rejectSearch}
                    onChange={(e) => setRejectSearch(e.target.value)}
                    sx={{ bgcolor: 'white' }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    sx={{
                      height: 40,
                      textTransform: 'none',
                      fontWeight: 700,
                      bgcolor: '#0f172a',
                      '&:hover': { bgcolor: '#1e293b' }
                    }}
                  >
                    SEARCH
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600 }}>
                    *searching hanya untuk nik dan nama
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1.5 }}>
                <Grid item xs={12} sm={3}>
                  <FormControl size="small" fullWidth sx={{ bgcolor: 'white' }}>
                    <InputLabel shrink>(Unit)</InputLabel>
                    <Select
                      displayEmpty
                      value={rejectFilterUnit}
                      onChange={(e) => setRejectFilterUnit(e.target.value)}
                      label="(Unit)"
                    >
                      <MenuItem value=""><em>Semua</em></MenuItem>
                      {Array.from(new Set(dataList.map(r => r.unitName).filter(Boolean))).map(u => (
                        <MenuItem key={u} value={u}>{u}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl size="small" fullWidth sx={{ bgcolor: 'white' }}>
                    <InputLabel shrink>(Position)</InputLabel>
                    <Select
                      displayEmpty
                      value={rejectFilterPosition}
                      onChange={(e) => setRejectFilterPosition(e.target.value)}
                      label="(Position)"
                    >
                      <MenuItem value=""><em>Semua</em></MenuItem>
                      {Array.from(new Set(dataList.map(r => r.position).filter(Boolean))).map(p => (
                        <MenuItem key={p} value={p}>{p}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl size="small" fullWidth sx={{ bgcolor: 'white' }}>
                    <InputLabel shrink>(Branch)</InputLabel>
                    <Select
                      displayEmpty
                      value={rejectFilterBranch}
                      onChange={(e) => setRejectFilterBranch(e.target.value)}
                      label="(Branch)"
                    >
                      <MenuItem value=""><em>Semua</em></MenuItem>
                      {Array.from(new Set(dataList.map(r => r.branch).filter(Boolean))).map(b => (
                        <MenuItem key={b} value={b}>{b}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl size="small" fullWidth sx={{ bgcolor: 'white' }}>
                    <InputLabel shrink>(Employee Type)</InputLabel>
                    <Select
                      displayEmpty
                      value={rejectFilterEmployeeType}
                      onChange={(e) => setRejectFilterEmployeeType(e.target.value)}
                      label="(Employee Type)"
                    >
                      <MenuItem value=""><em>Semua</em></MenuItem>
                      {Array.from(new Set(dataList.map(r => r.employeeType).filter(Boolean))).map(t => (
                        <MenuItem key={t} value={t}>{t}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Data Table */}
            {dataList.filter(row => row.statusData === 'REJECTED' || row.statusPayroll === 'REJECTED').length === 0 ? (
              <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', py: 4, textAlign: 'center' }}>
                Tidak ada data payroll yang direject.
              </Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: '#475569' }}>NIK</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Division</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Unit Name</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Employee Type</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Branch</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Reason Reject</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Created Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataList
                      .filter(row => row.statusData === 'REJECTED' || row.statusPayroll === 'REJECTED')
                      .filter(row => {
                        if (rejectSearch) {
                          const query = rejectSearch.toLowerCase();
                          const matchesNik = row.nik?.toLowerCase()?.includes(query);
                          const matchesName = row.name?.toLowerCase()?.includes(query);
                          if (!matchesNik && !matchesName) return false;
                        }
                        if (rejectFilterUnit && row.unitName !== rejectFilterUnit) return false;
                        if (rejectFilterPosition && row.position !== rejectFilterPosition) return false;
                        if (rejectFilterBranch && row.branch !== rejectFilterBranch) return false;
                        if (rejectFilterEmployeeType && row.employeeType !== rejectFilterEmployeeType) return false;
                        return true;
                      })
                      .map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.nik}</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>{row.name}</TableCell>
                          <TableCell>{row.division}</TableCell>
                          <TableCell>{row.unitName}</TableCell>
                          <TableCell>{row.employeeType}</TableCell>
                          <TableCell>{row.position}</TableCell>
                          <TableCell>{row.branch}</TableCell>
                          <TableCell sx={{ color: '#ef4444', fontWeight: 600 }}>
                            {row.reasonReject || 'Perhitungan tidak sesuai'}
                          </TableCell>
                          <TableCell>
                            {row.modifyDate || row.createdDate || '2026-08-18 16:00:00.0'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenHistoryRejectedModal(false)}
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
                Tutup
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </CustomModal>

      {/* Reject Reason Modal Dialog */}
      <CustomModal
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        title="Alasan Penolakan Payroll"
        maxWidth="sm"
      >
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary">
              Anda akan menolak <strong>{selectedIds.length}</strong> data payroll terpilih. Silakan cantumkan alasan penolakan untuk downliner:
            </Typography>
            <TextField
              label="Alasan Penolakan (Reject Reason) *"
              multiline
              rows={3}
              fullWidth
              placeholder="Contoh: Komponen lembur belum sesuai dengan rekapan HR..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              autoFocus
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenRejectDialog(false)}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmRejectWithReason}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
              >
                Tolak Pengajuan
              </Button>
            </Box>
          </Stack>
        </DialogContent>
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