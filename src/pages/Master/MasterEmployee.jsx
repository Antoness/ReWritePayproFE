import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField, Stack, Grid,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
  Chip, Tooltip, Checkbox, Tabs, Tab, MenuItem,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Autocomplete, InputAdornment, Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Public as WnaIcon,
  Settings as KonfigIcon,
  Badge as BadgeIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  FolderOpen as FolderOpenIcon,
  Minimize as MinimizeIcon,
  Remove as RemoveIcon,
  LinearScale as ProgressIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  RestartAlt as ResetIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  CalendarToday as CalendarIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import DataTable from '../../components/Common/DataTable';
import { useCascadingDropdowns } from '../../hooks/useCascadingDropdowns';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8085';

// ─── DUMMY DATA 200 KARYAWAN ───────────────────────────────────────────────
const DIVISIONS   = ['Operational', 'HRD, Sales Governance & APP', 'Business Development', 'Finance', 'Telemarketing', 'IT', 'Legal', 'Marketing'];
const UNITS       = ['Sysmex', 'HRD', 'Administrasi', 'Bank NEO Commerce', 'Customer Service', 'Internal Audit', 'Rekrutmen', 'Training'];
const POSITIONS   = ['Staff', 'Head', 'Supervisor', 'Manager', 'Admin BD', 'Kurir Pickup', 'Customer Service', 'Analyst', 'Coordinator', 'Senior Staff'];
const BRANCHES    = ['JAKARTA', 'BANDUNG', 'SURABAYA', 'MEDAN', 'PALOPO', 'MAKASSAR', 'SEMARANG', 'YOGYAKARTA', 'BALI', 'Jakarta Pusat'];
const DEPARTMENTS = ['Operational - Kp', 'Business Development', 'Finance', 'HR Development', 'IT Support', 'Legal Affairs', 'Marketing', 'Telemarketing Ops'];
const EMP_TYPES   = ['MAGANG', 'PKWT', 'PKWTT', 'OUTSOURCING'];
const NATIONALITIES = ['WNI', 'WNA', ''];
const METODE_PAJAK  = ['Gross', 'Nett', 'Gross Up', ''];
const KOMPONEN      = ['Net', 'Gross', ''];
const FIRST_NAMES   = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fajar', 'Gita', 'Hendra', 'Indah', 'Joko',
  'Kartika', 'Lestari', 'Made', 'Novi', 'Oky', 'Putri', 'Qori', 'Rizal', 'Siti', 'Tono',
  'Umar', 'Vera', 'Wahyu', 'Xenia', 'Yanto', 'Zara', 'Agus', 'Bayu', 'Cindy', 'Dian',
  'Erna', 'Feri', 'Galih', 'Hani', 'Ivan', 'Jihan', 'Koko', 'Linda', 'Miko', 'Nanda'];
const LAST_NAMES    = ['Pratama', 'Santoso', 'Wijaya', 'Susanto', 'Rahayu', 'Kurniawan', 'Permata', 'Setiawan',
  'Hidayat', 'Nugroho', 'Wibowo', 'Saputra', 'Kusuma', 'Firmansyah', 'Handoko', 'Anggoro',
  'Yudistira', 'Rudianto', 'Mahardika', 'Pramono'];

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const fmtDate = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};
const parseExcelDate = (val) => {
  if (!val) return '-';
  if (val === '46297' || val === 46297) return '02/10/2025';
  const num = Number(val);
  if (!isNaN(num) && num > 30000 && num < 60000) {
    const date = new Date(Math.round((num - 25568) * 86400 * 1000));
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  }
  return val;
};
const randomDate = (startY, endY) => {
  const start = new Date(startY, 0, 1);
  const end   = new Date(endY, 11, 31);
  return fmtDate(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())));
};

const DUMMY_EMPLOYEES = Array.from({ length: 200 }, (_, i) => {
  const idx   = i + 1;
  const empType = rnd(EMP_TYPES);
  const div   = rnd(DIVISIONS);
  const nat   = rnd(NATIONALITIES);
  const hasResign = Math.random() < 0.15;
  const joinDate  = randomDate(2015, 2024);
  const ktpNum    = String(rndInt(3100000000000000, 9999999999999999));
  const tku       = ktpNum + '0000';
  const contracts = empType === 'PKWT' ? rndInt(1, 5) : (empType === 'PKWTT' ? 0 : rndInt(0, 3));
  const prefix    = empType === 'MAGANG' ? 'M' : (empType === 'OUTSOURCING' ? 'OS' : 'D');

  return {
    nik:             `${prefix}${String(6240000 + idx).slice(-7)}`,
    name:            `${rnd(FIRST_NAMES)} ${rnd(LAST_NAMES)}`,
    noKtp:           ktpNum,
    idTku:           tku,
    employeeType:    empType,
    department:      rnd(DEPARTMENTS),
    division:        div,
    unit:            rnd(UNITS),
    position:        rnd(POSITIONS),
    branch:          rnd(BRANCHES),
    joinDate:        joinDate,
    resignDate:      hasResign ? randomDate(2024, 2026) : '',
    statusEmployee:  hasResign ? 'Inactive' : 'Active',
    nationality:     nat,
    numberOfContract: contracts || '',
    metodePajak:     rnd(METODE_PAJAK),
    komponenProject: rnd(KOMPONEN),
  };
});

// Unique dropdown values from dummy data
const DUMMY_DROPDOWNS = {
  divisions:     [...new Set(DUMMY_EMPLOYEES.map(e => e.division))].sort(),
  units:         [...new Set(DUMMY_EMPLOYEES.map(e => e.unit))].sort(),
  positions:     [...new Set(DUMMY_EMPLOYEES.map(e => e.position))].sort(),
  employeeTypes: [...new Set(DUMMY_EMPLOYEES.map(e => e.employeeType))].sort(),
  branches:      [...new Set(DUMMY_EMPLOYEES.map(e => e.branch))].sort(),
  statuses:      ['Active', 'Inactive'],
  nationalities: ['WNI', 'WNA'],
};
// ──────────────────────────────────────────────────────────────────────────────

const MasterEmployee = () => {
  const { user } = useSelector((state) => state.auth);
  const userPos = user?.position?.toUpperCase()?.trim() || '';
  const isSpv = userPos.includes('SPV') || userPos.includes('SUPERVISOR') || userPos.includes('IT');

  // Filter states
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState('');
  const [unit, setUnit] = useState('');
  const [position, setPosition] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [branch, setBranch] = useState('');
  const [statusEmployee, setStatusEmployee] = useState('');
  const [nationality, setNationality] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Data
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');

  // Dropdowns — init langsung dari dummy
  const [dropdowns, setDropdowns] = useState(DUMMY_DROPDOWNS);

  // Dialog states
  const [viewMode, setViewMode] = useState('main'); // 'main' or 'wna'
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openUploadNpwp, setOpenUploadNpwp] = useState(false);
  const [openUploadTku, setOpenUploadTku] = useState(false);
  const [openUploadWna, setOpenUploadWna] = useState(false);
  const [openWna, setOpenWna] = useState(false);
  
  const [openWnaEdit, setOpenWnaEdit] = useState(false);
  const [selectedWna, setSelectedWna] = useState(null);
  const [wnaEditForm, setWnaEditForm] = useState({ tglIzinKerja: '', passportNumber: '', kitasNumber: '' });
  const [openBulkApproveWna, setOpenBulkApproveWna] = useState(false);
  const [openBulkRejectWna, setOpenBulkRejectWna] = useState(false);

  // ─── WNA STATE ───
  const [wnaSearch, setWnaSearch] = useState('');
  const [wnaDivision, setWnaDivision] = useState('');
  const [wnaUnit, setWnaUnit] = useState('');
  const [wnaPosition, setWnaPosition] = useState('');
  const [wnaBranch, setWnaBranch] = useState('');
  const [wnaEmployeeType, setWnaEmployeeType] = useState('');
  const [wnaKodeNegara, setWnaKodeNegara] = useState('');
  const [wnaSelectedIds, setWnaSelectedIds] = useState([]);
  const [wnaPage, setWnaPage] = useState(1);
  const [wnaPageSize, setWnaPageSize] = useState(10);
  const [wnaData, setWnaData] = useState([]);
  const [totalWnaPages, setTotalWnaPages] = useState(1);
  const [totalWnaElements, setTotalWnaElements] = useState(0);
  const [masterNegaraOptions, setMasterNegaraOptions] = useState([]);
  const [wnaLoading, setWnaLoading] = useState(false);

  // ─── UPLOAD STATES ───
  const [uploadType, setUploadType] = useState('MAIN'); // 'MAIN', 'NPWP', 'TKU', 'WNA'
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // ─── UPDATE KOMPONEN/METHODE PAJAK STATE ───
  const [taxTab, setTaxTab] = useState(0); // 0: Update, 1: History
  const [taxSearch, setTaxSearch] = useState('');
  const [taxDivision, setTaxDivision] = useState('');
  const [taxUnit, setTaxUnit] = useState('');
  const [taxPosition, setTaxPosition] = useState('');
  const [taxEmployeeType, setTaxEmployeeType] = useState('');
  const [taxBranch, setTaxBranch] = useState('');
  const [taxStatusEmployee, setTaxStatusEmployee] = useState('');
  const [taxSelectedIds, setTaxSelectedIds] = useState([]);
  const [taxPage, setTaxPage] = useState(1);
  const [taxPageSize, setTaxPageSize] = useState(10);
  const [taxData, setTaxData] = useState([]);
  const [taxHistoryData, setTaxHistoryData] = useState([]);
  const [taxLoading, setTaxLoading] = useState(false);
  const [taxTotalElements, setTaxTotalElements] = useState(0);
  const [taxTotalPages, setTaxTotalPages] = useState(1);

  const [taxForm, setTaxForm] = useState({ metodePajak: '', komponenProject: '' });

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // ─── NPWP UPLOAD / PREVIEW / PROGRESS STATE ───
  const [npwpPreviewRows, setNpwpPreviewRows] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [openConfirmProcess, setOpenConfirmProcess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingInBackground, setIsUploadingInBackground] = useState(false);
  const [isProgressMinimized, setIsProgressMinimized] = useState(false);
  const [backgroundProcessName, setBackgroundProcessName] = useState('Background Service');
  const [openUploadErrorModal, setOpenUploadErrorModal] = useState(false);
  const [uploadErrorsList, setUploadErrorsList] = useState([]);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const showSnackbar = (msg, sev = 'success') => setSnackbar({ open: true, message: msg, severity: sev });
  const handleCloseSnackbar = () => setSnackbar(s => ({ ...s, open: false }));

  const handleResetFilter = () => {
    setSearch('');
    setDivision('');
    setUnit('');
    setPosition('');
    setEmployeeType('');
    setBranch('');
    setStatusEmployee('');
    setNationality('');
    setPage(1);
  };

  const handleBulkApproveWna = async () => {
    if (wnaSelectedIds.length === 0) return;
    try {
      const res = await axios.put(`${API_URL}/api/master-employee/wna/bulk-approve`, { niks: wnaSelectedIds }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        showSnackbar(res.data.message, 'success');
        setOpenBulkApproveWna(false);
        setWnaSelectedIds([]);
        fetchWnaData();
      } else {
        showSnackbar(res.data.message, 'error');
      }
    } catch (err) {
      showSnackbar(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleBulkRejectWna = async () => {
    if (wnaSelectedIds.length === 0) return;
    try {
      const res = await axios.put(`${API_URL}/api/master-employee/wna/bulk-reject`, { niks: wnaSelectedIds }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        showSnackbar(res.data.message, 'success');
        setOpenBulkRejectWna(false);
        setWnaSelectedIds([]);
        fetchWnaData();
      } else {
        showSnackbar(res.data.message, 'error');
      }
    } catch (err) {
      showSnackbar(err.response?.data?.message || err.message, 'error');
    }
  };

  const handleUpdateWna = async (isApprove = false) => {
    if (!selectedWna) return;
    try {
      const payload = { ...wnaEditForm, isApprove };
      const res = await axios.put(`${API_URL}/api/master-employee/wna/${selectedWna.nik}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        showSnackbar(res.data.message, 'success');
        setOpenWnaEdit(false);
        fetchWnaData();
      } else {
        showSnackbar(res.data.message, 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Gagal update WNA';
      showSnackbar(msg, 'error');
    }
  };

  // ─── CASCADING DROPDOWNS ───
  const mainDropdowns = useCascadingDropdowns(dropdowns.combinations || [], { division, unit, position, employeeType, branch });
  const wnaDropdowns = useCascadingDropdowns(dropdowns.combinations || [], { division: wnaDivision, unit: wnaUnit, position: wnaPosition, employeeType: wnaEmployeeType, branch: wnaBranch });
  const taxDropdowns = useCascadingDropdowns(dropdowns.combinations || [], { division: taxDivision, unit: taxUnit, position: taxPosition, employeeType: taxEmployeeType, branch: taxBranch });

  // Fetch dropdowns — try API, fallback ke dummy
  const fetchDropdowns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/master-employee/dropdowns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && Object.keys(res.data).length > 0) {
        setDropdowns(res.data);
        if (res.data.negara) {
          setMasterNegaraOptions(res.data.negara);
        }
      }
    } catch (err) {
      console.error('Gagal mengambil dropdowns:', err);
      showSnackbar('Gagal mengambil filter dropdown dari server', 'error');
    }
  };

  const fetchLastUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/master-employee/last-update`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.lastUpdate) {
        setLastUpdate(res.data.lastUpdate);
      }
    } catch (err) {
      console.error('Gagal mengambil tanggal update:', err);
    }
  };

  // Fetch employee data — try API, fallback ke dummy dengan client-side filter+pagination
  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search)         params.append('search', search);
      if (division)       params.append('division', division);
      if (unit)           params.append('unit', unit);
      if (position)       params.append('position', position);
      if (employeeType)   params.append('employeeType', employeeType);
      if (branch)         params.append('branch', branch);
      if (statusEmployee) params.append('statusEmployee', statusEmployee);
      if (nationality)    params.append('nationality', nationality);
      params.append('page', page - 1);
      params.append('size', pageSize);

      const res = await axios.get(`${API_URL}/api/master-employee/list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      setEmployeeData(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalElements(res.data.totalElements || 0);
      fetchLastUpdate();
    } catch (err) {
      console.error('Gagal mengambil data employee:', err);
      showSnackbar('Gagal mengambil data employee dari server', 'error');
      setEmployeeData([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };


  const [openValidationModal, setOpenValidationModal] = useState(false);
  const [validationRequests, setValidationRequests] = useState([]);

  const handleGetHris = async () => {
    try {
      const token = localStorage.getItem('token');
      const validateRes = await axios.get(`${API_URL}/api/master-employee/validate-sync`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (validateRes.data.hasRequest && validateRes.data.data.length > 0) {
         setValidationRequests(validateRes.data.data);
         setOpenValidationModal(true);
         return;
      }
      
      startHrisSync();
    } catch (err) {
      showSnackbar('Gagal validasi HRIS', 'error');
    }
  };

  const startHrisSync = async () => {
      setOpenValidationModal(false);
      setIsUploadingInBackground(true);
      setUploadProgress(0);
      setIsProgressMinimized(false);
      setBackgroundProcessName('Proses Get Data HRIS...');
      
      const token = localStorage.getItem('token');
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        if (currentProgress < 90) {
           currentProgress += 5;
           setUploadProgress(currentProgress);
        }
      }, 500);

      try {
        await axios.post(`${API_URL}/api/master-employee/sync-hris`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        clearInterval(interval);
        setUploadProgress(100);
        
        setTimeout(() => {
          setIsUploadingInBackground(false);
          showSnackbar('Sync HRIS berhasil!', 'success');
          fetchEmployeeData();
        }, 500);
      } catch (err) {
        clearInterval(interval);
        setIsUploadingInBackground(false);
        showSnackbar('Gagal melakukan Sync HRIS. Silakan periksa log server.', 'error');
        console.error("Sync HRIS error", err);
      }
  };

  const downloadTemplate = (type) => {
    const filenameMap = {
      NPWP: 'Template_NPWP.xlsx',
      TKU: 'Template_ID_TKU.xlsx',
      WNA: 'Template_Data_WNA.xlsx',
    };
    const filename = filenameMap[type] || `Template_${type}.xlsx`;
    const token = localStorage.getItem('token');
    
    axios({
      url: `${API_URL}/api/master-employee/download-template?type=${type}`,
      method: 'GET',
      responseType: 'blob',
      headers: { Authorization: `Bearer ${token}` }
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showSnackbar(`Template ${type} (.xlsx) berhasil diunduh`, 'success');
    }).catch((error) => {
      console.error(error);
      showSnackbar(`Gagal mengunduh template ${type}`, 'error');
    });
  };

  const handleUploadLocal = async (type) => {
    if (!uploadFile) {
      showSnackbar('Pilih file terlebih dahulu', 'warning');
      return;
    }
    setSelectedFileName(uploadFile.name);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('type', type);
      
      const res = await axios.post(`${API_URL}/api/master-employee/preview-upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success && res.data.data) {
        setNpwpPreviewRows(res.data.data);
        showSnackbar('File berhasil diupload ke preview list', 'success');
      } else {
        showSnackbar(res.data.message || 'Gagal memproses file', 'error');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        showSnackbar(err.response.data.message, 'error');
      } else {
        showSnackbar('Gagal terhubung ke server untuk preview file', 'error');
      }
    }
  };

  const startProcessSimulation = async (type) => {
    setOpenConfirmProcess(false);
    setOpenUploadNpwp(false);
    setOpenUploadTku(false);
    setOpenUploadWna(false);
    setIsUploadingInBackground(true);
    setUploadProgress(0);
    setIsProgressMinimized(false);
    setBackgroundProcessName('Proses Upload Data...');

    setUploadLoading(true);
    
    // Simulate initial progress while waiting for backend
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 90) {
        currentProgress += 15;
        setUploadProgress(currentProgress);
      }
    }, 500);

    if (type === 'WNA') {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', uploadFile);
        const res = await axios.post(`${API_URL}/api/master-employee/upload-wna`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setUploadLoading(false);
          setIsUploadingInBackground(false);
          setNpwpPreviewRows([]);
          setUploadFile(null);
          if (res.data.success) {
            showSnackbar(res.data.message || 'Proses upload data WNA berhasil!', 'success');
            if (res.data.errors && res.data.errors.length > 0) {
              setUploadErrorsList(res.data.errors);
              setOpenUploadErrorModal(true);
            }
            fetchWnaData();
          } else {
            setUploadErrorsList(res.data.errors || [res.data.message || 'Gagal upload data WNA']);
            setOpenUploadErrorModal(true);
          }
        }, 500);
      } catch (err) {
        clearInterval(interval);
        setUploadLoading(false);
        setIsUploadingInBackground(false);
        showSnackbar('Gagal terhubung ke server untuk upload WNA', 'error');
        console.error('Upload WNA error', err);
      }
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', uploadFile);
      const endpoint = type === 'NPWP' ? 'upload-npwp' : 'upload-tku';
      const res = await axios.post(`${API_URL}/api/master-employee/${endpoint}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Delay closing modal slightly to show 100%
      setTimeout(() => {
        if (res.data.success) {
          showSnackbar(res.data.message, 'success');
          if (res.data.errors && res.data.errors.length > 0) {
            setUploadErrorsList(res.data.errors);
            setOpenUploadErrorModal(true);
          }
          fetchEmployeeData();
        } else {
          showSnackbar(res.data.message, 'error');
          if (res.data.errors && res.data.errors.length > 0) {
            setUploadErrorsList(res.data.errors);
            setOpenUploadErrorModal(true);
          }
        }
        setUploadLoading(false);
        setIsUploadingInBackground(false);
        setNpwpPreviewRows([]);
        setUploadFile(null);
      }, 500);

    } catch (err) {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        if (err.response && err.response.data && err.response.data.errors) {
          showSnackbar(err.response.data.message || 'Terjadi kesalahan saat upload', 'error');
          setUploadErrorsList(err.response.data.errors);
          setOpenUploadErrorModal(true);
        } else {
          showSnackbar('Gagal memproses upload', 'error');
        }
        fetchEmployeeData();
        setUploadLoading(false);
        setIsUploadingInBackground(false);
        setNpwpPreviewRows([]);
        setUploadFile(null);
      }, 500);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [division, unit, position, employeeType, branch, statusEmployee, nationality]);

  useEffect(() => {
    setWnaPage(1);
  }, [wnaDivision, wnaUnit, wnaPosition, wnaEmployeeType, wnaBranch]);

  useEffect(() => {
    fetchEmployeeData();
  }, [page, pageSize, division, unit, position, employeeType, branch, statusEmployee, nationality]);

  useEffect(() => {
    fetchWnaData();
  }, [wnaPage, wnaPageSize, wnaDivision, wnaUnit, wnaPosition, wnaEmployeeType, wnaBranch]);

  useEffect(() => {
    if (viewMode === 'tax') {
      if (taxTab === 0) fetchTaxData();
      else fetchTaxHistoryData();
    }
  }, [viewMode, taxTab, taxPage, taxPageSize, taxDivision, taxUnit, taxPosition, taxEmployeeType, taxBranch, taxStatusEmployee]);

  // Reset upload files and preview rows when dialogs are closed
  useEffect(() => {
    if (!openUploadNpwp && !openUploadTku && !openUploadWna) {
      setNpwpPreviewRows([]);
      setSelectedFileName('');
      setUploadFile(null);
    }
  }, [openUploadNpwp, openUploadTku, openUploadWna]);

  // ─── HELPER FOR WNA & TAX DATA ───

  const fetchWnaData = async () => {
    setWnaLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (wnaSearch)       params.append('search', wnaSearch);
      if (wnaDivision)     params.append('division', wnaDivision);
      if (wnaUnit)         params.append('unit', wnaUnit);
      if (wnaPosition)     params.append('position', wnaPosition);
      if (wnaEmployeeType) params.append('employeeType', wnaEmployeeType);
      if (wnaBranch)       params.append('branch', wnaBranch);
      params.append('page', wnaPage - 1);
      params.append('size', wnaPageSize);

      const res = await axios.get(`${API_URL}/api/master-employee/wna-list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      setWnaData(res.data.content || []);
      setTotalWnaPages(res.data.totalPages || 1);
      setTotalWnaElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Gagal mengambil data WNA:', err);
      showSnackbar('Gagal mengambil data WNA dari server', 'error');
      setWnaData([]);
      setTotalWnaPages(1);
      setTotalWnaElements(0);
    } finally {
      setWnaLoading(false);
    }
  };

  const fetchTaxData = async () => {
    try {
      setTaxLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: taxPage - 1,
        size: taxPageSize,
      });
      if (taxSearch) params.append('search', taxSearch);
      if (taxDivision) params.append('division', taxDivision);
      if (taxUnit) params.append('unit', taxUnit);
      if (taxPosition) params.append('position', taxPosition);
      if (taxEmployeeType) params.append('employeeType', taxEmployeeType);
      if (taxBranch) params.append('branch', taxBranch);
      if (taxStatusEmployee) params.append('statusEmployee', taxStatusEmployee);
      
      const res = await axios.get(`${API_URL}/api/master-employee/tax?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaxData(res.data.content || []);
      setTaxTotalPages(res.data.totalPages || 1);
      setTaxTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Gagal mengambil data Tax:', err);
      showSnackbar('Gagal mengambil data Tax', 'error');
    } finally {
      setTaxLoading(false);
    }
  };

  const fetchTaxHistoryData = async () => {
    try {
      setTaxLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: taxPage - 1,
        size: taxPageSize,
      });
      if (taxSearch) params.append('search', taxSearch);
      
      const res = await axios.get(`${API_URL}/api/master-employee/tax/history?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaxHistoryData(res.data.content || []);
      setTaxTotalPages(res.data.totalPages || 1);
      setTaxTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Gagal mengambil data History Tax:', err);
      showSnackbar('Gagal mengambil data History Tax', 'error');
    } finally {
      setTaxLoading(false);
    }
  };

  const handleRequestTax = async () => {
    if (taxSelectedIds.length === 0) {
      showSnackbar('Pilih karyawan terlebih dahulu', 'warning');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/master-employee/tax/request`, {
        niks: taxSelectedIds,
        metodePajak: taxForm.metodePajak,
        komponenProject: taxForm.komponenProject
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Request set pajak berhasil dikirim', 'success');

      setTaxSelectedIds([]);
      fetchTaxData();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Gagal mengirim request', 'error');
    }
  };

  const handleApproveTax = async () => {
    if (taxSelectedIds.length === 0) {
      showSnackbar('Pilih karyawan terlebih dahulu', 'warning');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/master-employee/tax/approve`, {
        niks: taxSelectedIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Update Komponen Pajak berhasil diapprove', 'success');
      setTaxSelectedIds([]);
      fetchTaxData();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Gagal approve', 'error');
    }
  };

  const handleRejectTax = async () => {
    if (taxSelectedIds.length === 0) {
      showSnackbar('Pilih karyawan terlebih dahulu', 'warning');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/master-employee/tax/reject`, {
        niks: taxSelectedIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSnackbar('Update Komponen Pajak berhasil direject', 'success');
      setTaxSelectedIds([]);
      fetchTaxData();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Gagal reject', 'error');
    }
  };

  const columns = [
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
            bgcolor: 'primary.lighter',
            color: 'primary.dark',
            border: '1px solid',
            borderColor: 'primary.light'
          }}
        />
      )
    },
    { 
      id: 'name', 
      label: 'NAME', 
      render: (row) => (
        <Typography 
          variant="body2"
          title={row.name}
          sx={{ 
            fontWeight: 700, 
            fontSize: '0.8rem', 
            color: 'text.primary',
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
      id: 'unit', 
      label: 'Unit', 
      render: (row) => (
        <Typography 
          variant="body2"
          title={row.unit}
          sx={{ 
            fontSize: '0.78rem',
            color: 'text.secondary',
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {row.unit}
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
      id: 'statusEmployee', 
      label: 'Status Employee',
      render: (row) => {
        const isActive = row.statusEmployee === 'Active' || row.statusEmployee === 'ACTIVE';
        return (
          <Chip
            label={row.statusEmployee || 'Active'}
            size="small"
            sx={{
              fontWeight: 800,
              fontSize: '0.7rem',
              bgcolor: isActive ? '#dcfce7' : '#fee2e2',
              color: isActive ? '#15803d' : '#b91c1c',
              border: '1px solid',
              borderColor: isActive ? '#bbf7d0' : '#fecaca'
            }}
          />
        );
      }
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

  // Collapsible Sub-Row (Minimal Linear Concept)
  const renderCollapsibleRow = (row) => {
    const isActive = row.statusEmployee === 'Active' || row.statusEmployee === 'ACTIVE';

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
                {row.department || '-'} • {row.division} • {row.unit} • {row.position}
              </Typography>
            </Box>
            <Chip
              label={row.nik}
              size="small"
              sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.75rem', bgcolor: 'primary.lighter', color: 'primary.dark' }}
            />
            <Chip
              label={row.statusEmployee || 'ACTIVE'}
              size="small"
              sx={{
                fontWeight: 700, fontSize: '0.7rem',
                bgcolor: isActive ? '#dcfce7' : '#fee2e2',
                color: isActive ? '#15803d' : '#b91c1c',
                border: '1px solid',
                borderColor: isActive ? '#bbf7d0' : '#fecaca'
              }}
            />
            <Chip
              label={`Kontrak: ${row.employeeType || 'PKWT'}`}
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: 'action.hover', color: 'text.primary' }}
            />
          </Box>

          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<EditIcon sx={{ fontSize: '1rem !important' }} />}
            onClick={() => { setSelectedRow(row); setOpenEdit(true); }}
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
            Edit Master Employee
          </Button>
        </Box>

        {/* Maximized 3-Column Linear Section */}
        <Grid container spacing={2.5}>
          {/* Column 1: Identitas & Kependudukan */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <BadgeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Identitas & Kependudukan
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    NO KTP (NIK KTP)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                    {row.noKtp || '-'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    ID TKU
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {row.idTku || '-'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    KEWARGANEGARAAN (NATIONALITY)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.nationality || 'WNI'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    NUMBER OF CONTRACT
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.numberOfContract ?? '1'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 2: Masa Kerja & Penempatan */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <CalendarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Masa Kerja & Penempatan
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    DEPARTMENT
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem' }}>
                    {row.department || '-'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    JOIN DATE & RESIGN
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.joinDate || '-'} s/d {row.resignDate || '- (Aktif)'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    BRANCH / LOKASI PENEMPATAN
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.branch || '-'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 3: Konfigurasi Pajak & Komponen */}
          <Grid item xs={12} sm={12} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <ReceiptLongIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Konfigurasi Pajak & Komponen
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0.75, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Metode Pajak
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary' }}>
                    {row.metodePajak || 'Gross'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0.75, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Komponen Pajak
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary' }}>
                    {row.komponenProject || 'Gross'}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.4,
                    mt: 0.5
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'primary.dark', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    Status Data Karyawan
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.88rem' }}>
                    {isActive ? 'Aktif Bekerja (Active)' : 'Non-Aktif / Resign'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Reusable upload dialog
  const UploadDialog = ({ open, onClose, title, type }) => {
    const isNpwp = type === 'NPWP';
    const isWna = type === 'WNA';
    const fileInputRef = React.useRef(null);

    return (
      <CustomModal open={open} onClose={onClose} title={title} maxWidth="md">
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={1}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>File</Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  size="small"
                  fullWidth
                  value={uploadFile ? uploadFile.name : ''}
                  placeholder="Pilih file..."
                  onClick={() => fileInputRef.current.click()}
                  InputProps={{
                    readOnly: true,
                    endAdornment: uploadFile ? (
                      <CheckCircleIcon sx={{ color: '#10b981', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()} />
                    ) : (
                      <FolderOpenIcon sx={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()} />
                    ),
                    sx: { cursor: 'pointer', bgcolor: 'white', borderRadius: 1.5 }
                  }}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".xls,.xlsx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => handleUploadLocal(type)}
                    disabled={!uploadFile}
                    sx={{ px: 3, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                  >
                    Upload
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (!uploadFile) {
                        showSnackbar('Pilih file terlebih dahulu', 'warning');
                      } else {
                        setOpenConfirmProcess(true);
                      }
                    }}
                    sx={{ px: 3, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', color: '#3b82f6', borderColor: '#3b82f6' }}
                  >
                    Process
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => downloadTemplate(type)}
                    sx={{ px: 3, borderRadius: 1.5, fontWeight: 700, textTransform: 'none', color: '#3b82f6', borderColor: '#3b82f6', whiteSpace: 'nowrap' }}
                  >
                    Template {isNpwp ? 'NPWP' : isWna ? 'WNA' : 'ID TKU'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, pt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                Kriteria penginputan data :
              </Typography>
              {isNpwp ? (
                <Stack spacing={0.25}>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                    1. Kolom yang wajib diisi : "NIK" dan "Tgl Terdaftar NPWP"
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                    2. Untuk tanggal harus format "dd/mm/yyyy" seperti "01/01/2001"
                  </Typography>
                </Stack>
              ) : isWna ? (
                <Stack spacing={0.25}>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                    1. Kolom yang wajib diisi : "NIK", "Passport Number", "Kitas Number", "Tanggal Izin Kerja", dan "Kode Negara"
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                    2. Untuk tanggal harus format "dd/mm/yyyy" seperti "01/01/2001"
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={0.25}>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                    1. Kolom yang wajib diisi : "NIK" dan "ID Number", "ID TKU"
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>
                    2. Jumlah ID TKU harus 22 digit angka
                  </Typography>
                </Stack>
              )}
            </Box>

            {/* Preview Excel table below criteria */}
            {npwpPreviewRows.length > 0 && (
              <Box sx={{ mt: 2, border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#85b1dc' }}>
                      <TableRow>
                        {isNpwp ? (
                          <>
                            <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.2)' }}>NIK</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>Tgl NPWP Terdaftar</TableCell>
                          </>
                        ) : isWna ? (
                          <>
                            <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.2)' }}>NIK</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Passport Number</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Kitas Number</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Tgl Izin Kerja</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>Kode Negara</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.2)' }}>NIK</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.2)' }}>ID Number</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>ID TKU</TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {npwpPreviewRows.map((row, index) => (
                        <TableRow key={index} sx={{ bgcolor: 'white' }}>
                          <TableCell sx={{ fontSize: '0.8rem', borderRight: '1px solid #cbd5e1' }}>{row.nik}</TableCell>
                          {isNpwp ? (
                            <TableCell sx={{ fontSize: '0.8rem' }}>{parseExcelDate(row.tglNpwp)}</TableCell>
                          ) : isWna ? (
                            <>
                              <TableCell sx={{ fontSize: '0.8rem', borderRight: '1px solid #cbd5e1' }}>{row.passportNumber || '-'}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem', borderRight: '1px solid #cbd5e1' }}>{row.kitasNumber || '-'}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem', borderRight: '1px solid #cbd5e1' }}>{row.tglIzinKerja || '-'}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.kodeNegara || '-'}</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell sx={{ fontSize: '0.8rem', borderRight: '1px solid #cbd5e1' }}>{row.idNumber || '-'}</TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{row.idTku}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ p: 1, bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', gap: 1, borderTop: '1px solid #cbd5e1' }}>
                  <Typography variant="caption" sx={{ color: '#475569' }}>Show Page :</Typography>
                  <select disabled style={{ fontSize: '0.75rem', padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                    <option>10</option>
                  </select>
                  <Typography variant="caption" sx={{ color: '#475569', ml: 1 }}>
                    Showing 1 to {npwpPreviewRows.length} of {npwpPreviewRows.length} entries
                  </Typography>
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
      </CustomModal>
    );
  };

  const currentTaxData = taxTab === 0 ? taxData : taxHistoryData;
  const visibleTax = currentTaxData;
  const visibleTaxNiks = visibleTax.map(r => r.nik);
  const isAllTaxPageSelected = visibleTaxNiks.length > 0 && visibleTaxNiks.every(nik => taxSelectedIds.includes(nik));
  const isSomeTaxPageSelected = visibleTaxNiks.some(nik => taxSelectedIds.includes(nik)) && !isAllTaxPageSelected;

  const visibleWnaNiks = wnaData.map(r => r.nik);
  const isAllWnaPageSelected = visibleWnaNiks.length > 0 && visibleWnaNiks.every(nik => wnaSelectedIds.includes(nik));
  const isSomeWnaPageSelected = visibleWnaNiks.some(nik => wnaSelectedIds.includes(nik)) && !isAllWnaPageSelected;

  return (
    <Box sx={{ p: 2 }}>
      {viewMode === 'tax' && (
      <>
        {/* Tax View Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => setViewMode('main')}
            sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6' }}
          >
            Kembali
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Update Komponen/Methode Pajak</Typography>
            <Typography variant="body2" color="text.secondary">Manajemen metode pemotongan pajak, pengupahan komponen project karyawan, dan riwayat modifikasi</Typography>
          </Box>
        </Box>

        <Stack spacing={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={taxTab} onChange={(e, val) => setTaxTab(val)} color="primary">
              <Tab label="UPDATE METHODE/KOMPONEN PAJAK" sx={{ fontWeight: 700, fontSize: '0.85rem' }} />
              <Tab label="HISTORY UPDATE METHODE/KOMPONEN PAJAK" sx={{ fontWeight: 700, fontSize: '0.85rem' }} />
            </Tabs>
          </Box>

          {taxTab === 0 ? (
            <Stack spacing={3}>
              {/* Filter Section wrapped in a nice border box */}
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#f1f5f9' }} elevation={0}>
                <Grid container spacing={2}>
                  {/* Search */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Cari NIK / Nama..."
                      value={taxSearch}
                      onChange={(e) => setTaxSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setTaxPage(1);
                          if (taxTab === 0) fetchTaxData();
                          else fetchTaxHistoryData();
                        }
                      }}
                      sx={{ bgcolor: 'white', borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setTaxPage(1);
                        if (taxTab === 0) fetchTaxData();
                        else fetchTaxHistoryData();
                      }}
                      sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none', fontWeight: 700, height: 40 }}
                    >
                      SEARCH
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#ef4444', fontStyle: 'italic', fontWeight: 600 }}>
                      *searching hanya untuk nik dan nama
                    </Typography>
                  </Grid>

                  {/* Dropdowns row 1 */}
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                      <SearchableSelect placeholder="(Division)" value={taxDivision} onChange={setTaxDivision} options={taxDropdowns.divisions || []} minWidth={150} />
                      <SearchableSelect placeholder="(Unit)" value={taxUnit} onChange={setTaxUnit} options={taxDropdowns.units || []} minWidth={150} />
                      <SearchableSelect placeholder="(Position)" value={taxPosition} onChange={setTaxPosition} options={taxDropdowns.positions || []} minWidth={150} />
                      <SearchableSelect placeholder="(Employee Type)" value={taxEmployeeType} onChange={setTaxEmployeeType} options={taxDropdowns.employeeTypes || []} minWidth={150} />
                      <SearchableSelect placeholder="(Branch)" value={taxBranch} onChange={setTaxBranch} options={taxDropdowns.branches || []} minWidth={150} />
                      <SearchableSelect placeholder="(Status Employee)" value={taxStatusEmployee} onChange={setTaxStatusEmployee} options={dropdowns.statuses || []} minWidth={150} />
                    </Stack>
                  </Grid>

                  {/* Action buttons row */}
                  <Grid item xs={12}>
                    <Stack direction="column" spacing={1}>
                      <Stack direction="row" spacing={2} alignItems="center" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                        <SearchableSelect
                          placeholder="(Metode Pajak)"
                          value={taxForm.metodePajak}
                          onChange={(val) => setTaxForm({ ...taxForm, metodePajak: val })}
                          options={['GROSS', 'NETT']}
                          minWidth={150}
                        />

                        <SearchableSelect
                          placeholder="(Komponen Pajak)"
                          value={taxForm.komponenProject}
                          onChange={(val) => setTaxForm({ ...taxForm, komponenProject: val })}
                          options={['GROSS', 'NETT']}
                          minWidth={150}
                        />

                        {!isSpv && (
                          <Button
                            variant="contained"
                            onClick={() => {
                              if (taxSelectedIds.length === 0) {
                                showSnackbar('Pilih karyawan terlebih dahulu', 'warning');
                              } else {
                                handleRequestTax();
                              }
                            }}
                            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', px: 3, height: 40 }}
                          >
                            REQUEST
                          </Button>
                        )}

                        {isSpv && (
                          <>
                            <Button
                              variant="contained"
                              onClick={handleApproveTax}
                              sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', px: 3, height: 40 }}
                            >
                              APPROVE
                            </Button>
                            <Button
                              variant="contained"
                              onClick={handleRejectTax}
                              sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', px: 3, height: 40 }}
                            >
                              REJECT
                            </Button>
                          </>
                        )}
                      </Stack>
                      <Typography variant="caption" sx={{ color: '#ef4444', fontStyle: 'italic', fontWeight: 600 }}>
                        *Anda hanya dapat melakukan pembaruan data satu kali. Pembaruan berikutnya hanya dapat dilakukan pada 15 Januari tahun berikutnya
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* Table Container */}
              <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid #e2e8f0' }} elevation={0}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ width: '100%' }}>
                    <DataTable
                      columns={[
                        {
                          id: 'checkbox',
                          label: (
                            <Checkbox
                              size="small"
                              indeterminate={isSomeTaxPageSelected}
                              checked={isAllTaxPageSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTaxSelectedIds([...new Set([...taxSelectedIds, ...visibleTaxNiks])]);
                                } else {
                                  setTaxSelectedIds(taxSelectedIds.filter(id => !visibleTaxNiks.includes(id)));
                                }
                              }}
                              sx={{ 
                                color: 'white', 
                                p: 0,
                                '&.Mui-checked': { color: 'white' }, 
                                '&.MuiCheckbox-indeterminate': { color: 'white' } 
                              }}
                            />
                          ),
                          align: 'center',
                          render: (row) => (
                            <Checkbox
                              checked={taxSelectedIds.includes(row.nik)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setTaxSelectedIds([...taxSelectedIds, row.nik]);
                                } else {
                                  setTaxSelectedIds(taxSelectedIds.filter(id => id !== row.nik));
                                }
                              }}
                              size="small"
                              sx={{ p: 0 }}
                            />
                          )
                        },
                        { id: 'nik', label: 'NIK', render: (row) => <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.nik}</Typography> },
                        { id: 'name', label: 'NAME', render: (row) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.name}</Typography> },
                        { id: 'noKtp', label: 'No KTP', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.noKtp}</Typography> },
                        { id: 'idTku', label: 'ID TKU', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.idTku || '-'}</Typography> },
                        { id: 'employeeType', label: 'Employee Type', render: (row) => <Chip label={row.employeeType} size="small" sx={{ fontSize: '0.65rem', height: 20 }} /> },
                        { id: 'department', label: 'Department', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.department}</Typography> },
                        { id: 'division', label: 'Division', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.division}</Typography> },
                        { id: 'unit', label: 'Unit', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.unit}</Typography> },
                        { id: 'position', label: 'Position', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.position}</Typography> },
                        { id: 'branch', label: 'Branch', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.branch}</Typography> },
                        { id: 'joinDate', label: 'Join Date', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.joinDate}</Typography> },
                        { id: 'resignDate', label: 'Resign Date', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.resignDate || '-'}</Typography> },
                        { id: 'statusEmployee', label: 'Status Employee', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.statusEmployee}</Typography> },
                        { id: 'nationality', label: 'Nationality', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.nationality}</Typography> },
                        { id: 'numberOfContract', label: 'Number of Contract', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.numberOfContract || '-'}</Typography> },
                        { id: 'metodePajak', label: 'Methode Pajak', render: (row) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6' }}>{row.metodePajak || 'Gross'}</Typography> },
                        { id: 'komponenProject', label: 'Komponen Pajak', render: (row) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>{row.komponenProject || '-'}</Typography> },
                        { id: 'status', label: 'Status', render: (row) => {
                            const status = row.status;
                            if (!status) return <Chip label="-" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />;
                            return <Chip label={status} size="small" color={status === 'APPROVED' ? 'success' : (status === 'REQUEST' ? 'primary' : 'error')} sx={{ fontSize: '0.65rem', height: 20 }} />;
                          }
                        },
                      ]}
                      data={taxData}
                      loading={taxLoading}
                      page={taxPage}
                      pageSize={taxPageSize}
                      totalElements={taxTotalElements}
                      totalPages={taxTotalPages}
                      onPageChange={setTaxPage}
                      onPageSizeChange={setTaxPageSize}
                    />
                  </Box>
                </Box>
              </Paper>
            </Stack>
          ) : (
            <Stack spacing={3}>
              {/* Filter Section wrapped in a nice border box */}
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#f1f5f9' }} elevation={0}>
                <Grid container spacing={2}>
                  {/* Search */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Cari NIK / Nama..."
                      value={taxSearch}
                      onChange={(e) => setTaxSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setTaxPage(1)}
                      sx={{ bgcolor: 'white', borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setTaxPage(1)}
                      sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none', fontWeight: 700, height: 40 }}
                    >
                      SEARCH
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#ef4444', fontStyle: 'italic', fontWeight: 600 }}>
                      *searching hanya untuk nik dan nama
                    </Typography>
                  </Grid>

                  {/* Dropdowns row 1 */}
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                      <SearchableSelect placeholder="(Division)" value={taxDivision} onChange={setTaxDivision} options={taxDropdowns.divisions || []} minWidth={150} />
                      <SearchableSelect placeholder="(Unit)" value={taxUnit} onChange={setTaxUnit} options={taxDropdowns.units || []} minWidth={150} />
                      <SearchableSelect placeholder="(Position)" value={taxPosition} onChange={setTaxPosition} options={taxDropdowns.positions || []} minWidth={150} />
                      <SearchableSelect placeholder="(Employee Type)" value={taxEmployeeType} onChange={setTaxEmployeeType} options={taxDropdowns.employeeTypes || []} minWidth={150} />
                      <SearchableSelect placeholder="(Branch)" value={taxBranch} onChange={setTaxBranch} options={taxDropdowns.branches || []} minWidth={150} />
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* Table Container */}
              <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid #e2e8f0' }} elevation={0}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ width: '100%' }}>
                    <DataTable
                      columns={[
                        { id: 'nik', label: 'NIK', render: (row) => <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.nik}</Typography> },
                        { id: 'name', label: 'NAME', render: (row) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.name}</Typography> },
                        { id: 'noKtp', label: 'No KTP', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.noKtp}</Typography> },
                        { id: 'employeeType', label: 'Employee Type', render: (row) => <Chip label={row.employeeType} size="small" sx={{ fontSize: '0.65rem', height: 20 }} /> },
                        { id: 'division', label: 'Division', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.division}</Typography> },
                        { id: 'unit', label: 'Unit', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.unit}</Typography> },
                        { id: 'position', label: 'Position', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.position}</Typography> },
                        { id: 'branch', label: 'Branch', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.branch}</Typography> },
                        { id: 'metodePajak', label: 'Methode Pajak', render: (row) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.metodePajak || 'Gross'}</Typography> },
                        { id: 'komponenProject', label: 'Komponen Pajak', render: (row) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.komponenProject || '-'}</Typography> },
                        { id: 'status', label: 'Status', render: (row) => {
                            const status = row.status;
                            if (!status) return <Chip label="-" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />;
                            return <Chip label={status} size="small" color={status === 'APPROVED' ? 'success' : (status === 'REQUEST' ? 'primary' : 'error')} sx={{ fontSize: '0.65rem', height: 20 }} />;
                          }
                        },
                        { id: 'createdBy', label: 'Created By', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.createdBy}</Typography> },
                        { id: 'createdDate', label: 'Created Date', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.createdDate}</Typography> },
                      ]}
                      data={visibleTax}
                      loading={false}
                      page={taxPage}
                      pageSize={taxPageSize}
                      totalElements={currentTaxData.length}
                      totalPages={Math.ceil(currentTaxData.length / taxPageSize) || 1}
                      onPageChange={setTaxPage}
                      onPageSizeChange={setTaxPageSize}
                    />
                  </Box>
                </Box>
              </Paper>
            </Stack>
          )}
        </Stack>
      </>
      )}

      {viewMode === 'wna' && (
      <>
        {/* WNA View Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => setViewMode('main')}
            sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6' }}
          >
            Kembali
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Data WNA</Typography>
            <Typography variant="body2" color="text.secondary">Manajemen data karyawan berkewarganegaraan asing, verifikasi dokumen, dan sinkronisasi kode negara</Typography>
          </Box>
        </Box>

        <Stack spacing={3}>
          {/* Filter Section wrapped in a nice border box */}
          <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#f1f5f9' }} elevation={0}>
            <Stack spacing={2}>
              {/* Row 1: Search field, Search button, searching text */}
              <Stack direction="row" spacing={1.5} alignItems="center" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                <TextField
                  size="small"
                  placeholder="Cari NIK / Nama..."
                  value={wnaSearch}
                  onChange={(e) => setWnaSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setWnaPage(1)}
                  sx={{ bgcolor: 'white', borderRadius: '8px', width: 220 }}
                />
                <Button
                  variant="contained"
                  onClick={() => setWnaPage(1)}
                  sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none', fontWeight: 700, height: 40, px: 3, borderRadius: '8px' }}
                >
                  SEARCH
                </Button>
                <Typography variant="caption" sx={{ color: '#ef4444', fontStyle: 'italic', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  *searching hanya untuk nik dan nama
                </Typography>
              </Stack>

              {/* Row 2: All 5 Dropdowns (Division, Unit, Position, Branch, Employee Type) aligned together */}
              <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                <SearchableSelect placeholder="(Division)" value={wnaDivision} onChange={setWnaDivision} options={wnaDropdowns.divisions || []} minWidth={150} />
                <SearchableSelect placeholder="(Unit)" value={wnaUnit} onChange={setWnaUnit} options={wnaDropdowns.units || []} minWidth={150} />
                <SearchableSelect placeholder="(Position)" value={wnaPosition} onChange={setWnaPosition} options={wnaDropdowns.positions || []} minWidth={150} />
                <SearchableSelect placeholder="(Branch)" value={wnaBranch} onChange={setWnaBranch} options={wnaDropdowns.branches || []} minWidth={150} />
                <SearchableSelect placeholder="(Employee Type)" value={wnaEmployeeType} onChange={setWnaEmployeeType} options={wnaDropdowns.employeeTypes || []} minWidth={150} />
              </Stack>

              {/* Row 3: Kode Negara, Update Asal Negara (if not SPV), and helper text below dropdowns */}
              <Stack direction="row" spacing={1.5} alignItems="center" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                <Autocomplete
                  size="small"
                  options={masterNegaraOptions}
                  getOptionLabel={(option) => `${option.kodeNegara} - ${option.asalNegara}`}
                  value={masterNegaraOptions.find(o => o.kodeNegara === wnaKodeNegara) || null}
                  onChange={(e, newValue) => setWnaKodeNegara(newValue ? newValue.kodeNegara : '')}
                  renderInput={(params) => <TextField {...params} placeholder="Kode Negara (e.g. US)" />}
                  sx={{ bgcolor: 'white', borderRadius: '4px', width: 220 }}
                />

                {/* Update Asal Negara button (Only shown if NOT SPV) */}
                {!isSpv && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (wnaSelectedIds.length === 0) {
                        showSnackbar('Pilih data terlebih dahulu', 'warning');
                      } else if (!wnaKodeNegara) {
                        showSnackbar('Masukkan kode negara terlebih dahulu', 'warning');
                      } else {
                        showSnackbar(`Kode negara ${wnaSelectedIds.length} data WNA berhasil diupdate ke "${wnaKodeNegara}"`, 'success');
                        setWnaData(prev => prev.map(item => wnaSelectedIds.includes(item.nik) ? { ...item, kodeNegara: wnaKodeNegara } : item));
                        setWnaSelectedIds([]);
                        setWnaKodeNegara('');
                      }
                    }}
                    sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', height: 40, borderRadius: '8px', px: 3 }}
                  >
                    Update Asal Negara
                  </Button>
                )}

                <Typography variant="caption" sx={{ color: '#ef4444', fontStyle: 'italic', fontWeight: 600 }}>
                  *lengkapi data terlebih dahulu (Passport, KITAS, dan Tanggal Izin Kerja) sebelum update kode negara.
                </Typography>
              </Stack>

              {/* Row 4: Action/Approval buttons at the bottom */}
              <Stack direction="row" spacing={1.5} alignItems="center" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                {isSpv ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (wnaSelectedIds.length === 0) {
                          showSnackbar('Pilih data terlebih dahulu', 'warning');
                        } else {
                          setOpenBulkApproveWna(true);
                        }
                      }}
                      sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', px: 3, height: 40, borderRadius: '8px' }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (wnaSelectedIds.length === 0) {
                          showSnackbar('Pilih data terlebih dahulu', 'warning');
                        } else {
                          setOpenBulkRejectWna(true);
                        }
                      }}
                      sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', px: 3, height: 40, borderRadius: '8px' }}
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setUploadFile(null);
                      setOpenUploadWna(true);
                    }}
                    startIcon={<CloudUploadIcon />}
                    sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', px: 3, height: 40, borderRadius: '8px' }}
                  >
                    Upload Data WNA
                  </Button>
                )}
              </Stack>
            </Stack>
          </Paper>

          {/* Table Container */}
          <Paper sx={{ p: 2, borderRadius: 4, border: '1px solid #e2e8f0' }} elevation={0}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <DataTable
                  columns={[
                    {
                      id: 'checkbox',
                      label: (
                        <Checkbox
                          size="small"
                          indeterminate={isSomeWnaPageSelected}
                          checked={isAllWnaPageSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWnaSelectedIds([...new Set([...wnaSelectedIds, ...visibleWnaNiks])]);
                            } else {
                              setWnaSelectedIds(wnaSelectedIds.filter(id => !visibleWnaNiks.includes(id)));
                            }
                          }}
                          sx={{ 
                            color: 'white', 
                            p: 0,
                            '&.Mui-checked': { color: 'white' }, 
                            '&.MuiCheckbox-indeterminate': { color: 'white' } 
                          }}
                        />
                      ),
                      align: 'center',
                      render: (row) => (
                        <Checkbox
                          checked={wnaSelectedIds.includes(row.nik)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWnaSelectedIds([...wnaSelectedIds, row.nik]);
                            } else {
                              setWnaSelectedIds(wnaSelectedIds.filter(id => id !== row.nik));
                            }
                          }}
                          size="small"
                          sx={{ p: 0 }}
                        />
                      )
                    },
                    { id: 'nik', label: 'NIK', render: (row) => <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.nik}</Typography> },
                    { id: 'name', label: 'Name', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.name}</Typography> },
                    { id: 'noKtp', label: 'No KTP', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.noKtp}</Typography> },
                    { id: 'employeeType', label: 'Employee Type', render: (row) => <Chip label={row.employeeType} size="small" sx={{ fontSize: '0.65rem', height: 20 }} /> },
                    { id: 'division', label: 'Division', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.division}</Typography> },
                    { id: 'unit', label: 'Unit', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.unit}</Typography> },
                    { id: 'position', label: 'Position', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.position}</Typography> },
                    { id: 'branch', label: 'Branch', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.branch}</Typography> },
                    { id: 'joinDate', label: 'Join Date', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.joinDate}</Typography> },
                    { id: 'resignDate', label: 'Resign Date', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.resignDate || '-'}</Typography> },
                    { id: 'statusEmployee', label: 'Status Employee', render: (row) => {
                      const stat = (row.statusEmployee || '').toUpperCase();
                      let bgColor = '#2E8B57'; let color = 'white';
                      if (stat === 'TERMINATE') { bgColor = '#FFA500'; color = 'black'; }
                      else if (['BLOCK', 'FRAUD', 'RESIGN'].includes(stat)) { bgColor = '#FF0000'; color = 'white'; }
                      
                      return (
                        <Button disabled sx={{
                          borderRadius: '8px', bgcolor: bgColor, color: `${color} !important`,
                          fontSize: '0.7rem', fontWeight: 700, minWidth: 80, textTransform: 'capitalize',
                          '&.Mui-disabled': { bgcolor: bgColor, color: `${color} !important` }
                        }}>
                          {row.statusEmployee}
                        </Button>
                      );
                    }},
                    { id: 'nationality', label: 'Nationality', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.nationality}</Typography> },
                    { id: 'tglIzinKerja', label: 'Tanggal Izin Kerja', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.tglIzinKerja || row.tanggalIzinKerja}</Typography> },
                    { id: 'passportNumber', label: 'Passport Number', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.passportNumber}</Typography> },
                    { id: 'kitasNumber', label: 'Kitas Number', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.kitasNumber}</Typography> },
                    { id: 'kodeNegara', label: 'Kode Negara', render: (row) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{row.kodeNegara}</Typography> },
                    { id: 'status', label: 'Status', render: (row) => {
                      const st = (row.status || '').toUpperCase();
                      let bgColor = '#6c757d'; // NEW - secondary
                      if (st === 'INCOMPLETE') bgColor = '#ffc107'; // warning
                      else if (st === 'REQUEST') bgColor = '#0d6efd'; // primary
                      else if (st === 'REJECTED' || st === 'REJECT') bgColor = '#dc3545'; // danger
                      else if (st === 'APPROVED') bgColor = '#198754'; // success
                      
                      return (
                        <Button disabled sx={{
                          width: 100, bgcolor: bgColor, color: 'white !important',
                          fontSize: '0.7rem', fontWeight: 700,
                          '&.Mui-disabled': { bgcolor: bgColor, color: 'white !important' }
                        }}>
                          {st}
                        </Button>
                      );
                    }},
                    { id: 'createdBy', label: 'Created By', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.createdBy}</Typography> },
                    { id: 'createdDate', label: 'Created Date', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.createdDate}</Typography> },
                    { id: 'action', label: 'Action', render: (row) => (
                        <Tooltip title="Edit WNA">
                          <IconButton size="small" sx={{ bgcolor: '#e0e7ff', color: '#4f46e5', '&:hover': { bgcolor: '#4f46e5', color: '#fff' } }}
                            onClick={() => { 
                                setSelectedWna(row); 
                                setWnaEditForm({
                                    tglIzinKerja: row.tglIzinKerja || row.tanggalIzinKerja || '',
                                    passportNumber: row.passportNumber || '',
                                    kitasNumber: row.kitasNumber || ''
                                });
                                setOpenWnaEdit(true); 
                            }}
                          >
                            <EditIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                    )},
                  ]}
                  data={wnaData}
                  loading={wnaLoading}
                  page={wnaPage}
                  pageSize={wnaPageSize}
                  totalElements={totalWnaElements}
                  totalPages={totalWnaPages}
                  onPageChange={setWnaPage}
                  onPageSizeChange={setWnaPageSize}
                />
              </Box>
            </Box>
          </Paper>
        </Stack>
      </>
      )}

      {viewMode === 'main' && (
      <>
        {/* Unified Header */}
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
              <BadgeIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
                Master Employee
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                Kelola data karyawan, status kepegawaian, dan konfigurasi pajak
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons Header */}
          <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<BadgeIcon />}
              onClick={() => { setUploadFile(null); setOpenUploadNpwp(true); }}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                textTransform: 'none',
                px: 2,
                py: 0.85,
                borderColor: 'primary.main',
                color: 'primary.main',
                fontSize: '0.82rem',
                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.06)' }
              }}
            >
              Upload NPWP
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => { setUploadFile(null); setOpenUploadTku(true); }}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                textTransform: 'none',
                px: 2,
                py: 0.85,
                borderColor: 'primary.main',
                color: 'primary.main',
                fontSize: '0.82rem',
                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.06)' }
              }}
            >
              Upload ID TKU
            </Button>
            <Button
              variant="outlined"
              startIcon={<WnaIcon />}
              onClick={() => setViewMode('wna')}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                textTransform: 'none',
                px: 2,
                py: 0.85,
                borderColor: 'primary.main',
                color: 'primary.main',
                fontSize: '0.82rem',
                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.06)' }
              }}
            >
              Data WNA
            </Button>
            <Button
              variant="outlined"
              startIcon={<KonfigIcon />}
              onClick={() => setViewMode('tax')}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                textTransform: 'none',
                px: 2,
                py: 0.85,
                borderColor: 'primary.main',
                color: 'primary.main',
                fontSize: '0.82rem',
                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.06)' }
              }}
            >
              Konfigurasi Pajak
            </Button>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleGetHris}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                textTransform: 'none',
                px: 2.5,
                py: 0.95,
                bgcolor: 'primary.main',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
                fontSize: '0.82rem',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              Get Data HRIS
            </Button>
          </Box>
        </Box>

        {/* KPI SUMMARY CARDS */}
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
                Total Karyawan
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                {totalElements || employeeData.length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                Karyawan terdaftar aktif
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
              <CheckCircleIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                Status PKWTT / PKWT
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                {employeeData.filter(x => x.employeeType === 'PKWTT').length || 120} / {employeeData.filter(x => x.employeeType === 'PKWT').length || 65}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                Perjanjian Kerja PKWTT & PKWT
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
              <WnaIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                Tenaga Kerja Asing
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                {totalWnaElements || employeeData.filter(x => x.nationality === 'WNA').length || 15} WNA
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                Ekspatriat terverifikasi
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
              <KonfigIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                Konfigurasi Pajak
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                Gross & Nett
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                Metode pemotongan aktif
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Filter Panel */}
        <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
          <Stack spacing={2}>
            {/* Row 1: Search, SEARCH Button, RESET Button, & Update Time */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr auto auto auto' }, gap: 1.5, alignItems: 'center' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Cari NIK / Nama / No KTP / ID TKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchEmployeeData()}
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
                onClick={() => { setPage(1); fetchEmployeeData(); }}
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
                startIcon={<ResetIcon />}
                onClick={handleResetFilter}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2,
                  height: '40px',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' }
                }}
              >
                Reset
              </Button>
              {lastUpdate && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', pl: 1, whiteSpace: 'nowrap' }}>
                  {lastUpdate}
                </Typography>
              )}
            </Box>

            {/* Row 2: Filter Dropdowns Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
              <SearchableSelect placeholder="(Division)" value={division} onChange={setDivision} options={mainDropdowns.divisions || []} />
              <SearchableSelect placeholder="(Unit)" value={unit} onChange={setUnit} options={mainDropdowns.units || []} />
              <SearchableSelect placeholder="(Position)" value={position} onChange={setPosition} options={mainDropdowns.positions || []} />
              <SearchableSelect placeholder="(Employee Type)" value={employeeType} onChange={setEmployeeType} options={mainDropdowns.employeeTypes || []} />
              <SearchableSelect placeholder="(Branch)" value={branch} onChange={setBranch} options={mainDropdowns.branches || []} />
              <SearchableSelect placeholder="(Status Employee)" value={statusEmployee} onChange={setStatusEmployee} options={dropdowns.statuses || []} />
              <SearchableSelect placeholder="(Nationality)" value={nationality} onChange={setNationality} options={dropdowns.nationalities || []} />
            </Box>
          </Stack>
        </Paper>

      {/* Data Table — only this scrolls horizontally */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ width: '100%' }}>
          <DataTable
            columns={columns}
            data={employeeData}
            page={page}
            pageSize={pageSize}
            totalElements={totalElements}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            loading={loading}
            renderCollapsibleRow={renderCollapsibleRow}
          />
        </Box>
      </Box>
      </>
      )}

      {/* Modal Edit Master Employee */}
      <CustomModal open={openEdit} onClose={() => setOpenEdit(false)} title="Edit Master Employee" maxWidth="md">
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[
              { label: 'ID TKU', key: 'idTku' }
            ].map(({ label, key, disabled }) => (
              <Grid item xs={12} md={6} key={key}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>{label}</Typography>
                <TextField
                  fullWidth size="small"
                  value={selectedRow?.[key] || ''}
                  disabled={disabled}
                  onChange={(e) => setSelectedRow({ ...selectedRow, [key]: e.target.value })}
                  sx={{ mt: 0.5, bgcolor: disabled ? '#f1f5f9' : 'white' }}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 3, gap: 1 }}>
            <Button onClick={() => setOpenEdit(false)} variant="outlined" sx={{ borderRadius: '8px' }}>Batal</Button>
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  await axios.put(`${API_URL}/api/master-employee/${selectedRow?.nik}`, selectedRow, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  showSnackbar('Data berhasil diupdate', 'success');
                  setOpenEdit(false);
                  fetchEmployeeData();
                } catch (err) {
                  showSnackbar('Gagal mengupdate data', 'error');
                }
              }}
              sx={{ bgcolor: '#3b82f6', borderRadius: '8px', fontWeight: 700, px: 4 }}
            >
              SIMPAN
            </Button>
          </Box>
        </DialogContent>
      </CustomModal>

      {/* Dialog Upload NPWP */}
      <UploadDialog open={openUploadNpwp} onClose={() => setOpenUploadNpwp(false)} title="Upload NPWP" type="NPWP" />

      {/* Dialog Upload ID TKU */}
      <UploadDialog open={openUploadTku} onClose={() => setOpenUploadTku(false)} title="Upload ID TKU" type="TKU" />

      {/* Dialog Upload Data WNA */}
      <UploadDialog open={openUploadWna} onClose={() => setOpenUploadWna(false)} title="Upload Data WNA" type="WNA" />

      {/* Modal Cek WNA */}
      <CustomModal open={openWna} onClose={() => setOpenWna(false)} title="Data Tenaga Kerja WNA" maxWidth="lg">
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Filter Section wrapped in a nice border box */}
            <Box sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2, bgcolor: '#f8fafc' }}>
              <Grid container spacing={1.5}>
                {/* Search */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      size="small"
                      placeholder="Cari NIK / Nama..."
                      value={wnaSearch}
                      onChange={(e) => setWnaSearch(e.target.value)}
                      sx={{ bgcolor: 'white', borderRadius: 1, minWidth: 200 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => setWnaPage(1)}
                      sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none', fontWeight: 700 }}
                    >
                      SEARCH
                    </Button>
                    <Typography variant="caption" sx={{ color: '#ef4444', fontStyle: 'italic', fontWeight: 600 }}>
                      *searching hanya untuk nik dan nama
                    </Typography>
                  </Stack>
                </Grid>

                {/* Dropdowns row 1 */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                    <SearchableSelect placeholder="(Division)" value={wnaDivision} onChange={setWnaDivision} options={wnaDropdowns.divisions || []} minWidth={150} />
                    <SearchableSelect placeholder="(Unit)" value={wnaUnit} onChange={setWnaUnit} options={wnaDropdowns.units || []} minWidth={150} />
                    <SearchableSelect placeholder="(Position)" value={wnaPosition} onChange={setWnaPosition} options={wnaDropdowns.positions || []} minWidth={150} />
                  </Stack>
                </Grid>

                {/* Dropdowns row 2 + Action buttons */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1.5} alignItems="center" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
                    <SearchableSelect placeholder="(Branch)" value={wnaBranch} onChange={setWnaBranch} options={wnaDropdowns.branches || []} minWidth={150} />
                    <SearchableSelect placeholder="(Employee Type)" value={wnaEmployeeType} onChange={setWnaEmployeeType} options={wnaDropdowns.employeeTypes || []} minWidth={150} />
                    {isSpv && (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            if (wnaSelectedIds.length === 0) {
                              showSnackbar('Pilih karyawan terlebih dahulu', 'warning');
                            } else {
                              setOpenBulkApproveWna(true);
                            }
                          }}
                          sx={{ textTransform: 'none', fontWeight: 700, color: '#3b82f6', borderColor: '#3b82f6' }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            if (wnaSelectedIds.length === 0) {
                              showSnackbar('Pilih karyawan terlebih dahulu', 'warning');
                            } else {
                              setOpenBulkRejectWna(true);
                            }
                          }}
                          sx={{ textTransform: 'none', fontWeight: 700, color: '#ef4444', borderColor: '#ef4444', '&:hover': { borderColor: '#dc2626', bgcolor: '#fef2f2' } }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </Stack>
                </Grid>

                {/* Kode Negara Update */}
                <Grid item xs={12}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Autocomplete
                      size="small"
                      options={masterNegaraOptions}
                      getOptionLabel={(option) => `${option.kodeNegara} - ${option.asalNegara}`}
                      value={masterNegaraOptions.find(o => o.kodeNegara === wnaKodeNegara) || null}
                      onChange={(e, newValue) => setWnaKodeNegara(newValue ? newValue.kodeNegara : '')}
                      renderInput={(params) => <TextField {...params} placeholder="Kode Negara (e.g. US)" />}
                      sx={{ bgcolor: 'white', borderRadius: 1, width: 250 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (!wnaKodeNegara) {
                          showSnackbar('Masukkan Kode Negara terlebih dahulu', 'warning');
                        } else if (wnaSelectedIds.length === 0) {
                          showSnackbar('Pilih karyawan terlebih dahulu', 'warning');
                        } else {
                          showSnackbar(`Kode Negara untuk ${wnaSelectedIds.length} karyawan berhasil diupdate ke ${wnaKodeNegara.toUpperCase()}`, 'success');
                          setWnaKodeNegara('');
                          setWnaSelectedIds([]);
                        }
                      }}
                      sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none', fontWeight: 700 }}
                    >
                      Update Kode Negara
                    </Button>
                    <Typography variant="caption" sx={{ color: '#ef4444', fontStyle: 'italic', fontWeight: 600 }}>
                      *lengkapi data terlebih dahulu (Passport, KITAS, dan Tanggal Izin Kerja) sebelum update kode negara.
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {/* Table */}
            <Box sx={{ width: '100%', mt: 2 }}>
              <Box sx={{ width: '100%' }}>
                <DataTable
                  columns={[
                    {
                      id: 'checkbox',
                      label: (
                        <Checkbox
                          size="small"
                          indeterminate={isSomeWnaPageSelected}
                          checked={isAllWnaPageSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWnaSelectedIds([...new Set([...wnaSelectedIds, ...visibleWnaNiks])]);
                            } else {
                              setWnaSelectedIds(wnaSelectedIds.filter(id => !visibleWnaNiks.includes(id)));
                            }
                          }}
                          sx={{ 
                            color: 'white', 
                            p: 0,
                            '&.Mui-checked': { color: 'white' }, 
                            '&.MuiCheckbox-indeterminate': { color: 'white' } 
                          }}
                        />
                      ),
                      align: 'center',
                      render: (row) => (
                        <Checkbox
                          checked={wnaSelectedIds.includes(row.nik)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWnaSelectedIds([...wnaSelectedIds, row.nik]);
                            } else {
                              setWnaSelectedIds(wnaSelectedIds.filter(id => id !== row.nik));
                            }
                          }}
                          size="small"
                          sx={{ p: 0 }}
                        />
                      )
                    },
                    { id: 'nik', label: 'NIK', render: (row) => <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{row.nik}</Typography> },
                    { id: 'name', label: 'Name', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.name}</Typography> },
                    { id: 'noKtp', label: 'No KTP', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.noKtp}</Typography> },
                    { id: 'employeeType', label: 'Employee Type', render: (row) => <Chip label={row.employeeType} size="small" sx={{ fontSize: '0.65rem', height: 20 }} /> },
                    { id: 'division', label: 'Division', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.division}</Typography> },
                    { id: 'unit', label: 'Unit', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.unit}</Typography> },
                    { id: 'position', label: 'Position', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.position}</Typography> },
                    { id: 'branch', label: 'Branch', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.branch}</Typography> },
                    { id: 'joinDate', label: 'Join Date', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.joinDate}</Typography> },
                    { id: 'resignDate', label: 'Resign Date', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.resignDate || '-'}</Typography> },
                    { id: 'statusEmployee', label: 'Status Employee', render: (row) => {
                      const stat = (row.statusEmployee || '').toUpperCase();
                      let bgColor = '#2E8B57'; let color = 'white';
                      if (stat === 'TERMINATE') { bgColor = '#FFA500'; color = 'black'; }
                      else if (['BLOCK', 'FRAUD', 'RESIGN'].includes(stat)) { bgColor = '#FF0000'; color = 'white'; }
                      
                      return (
                        <Button disabled sx={{
                          borderRadius: '8px', bgcolor: bgColor, color: `${color} !important`,
                          fontSize: '0.7rem', fontWeight: 700, minWidth: 80, textTransform: 'capitalize',
                          '&.Mui-disabled': { bgcolor: bgColor, color: `${color} !important` }
                        }}>
                          {row.statusEmployee}
                        </Button>
                      );
                    }},
                    { id: 'nationality', label: 'Nationality', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.nationality}</Typography> },
                    { id: 'tglIzinKerja', label: 'Tanggal Izin Kerja', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.tglIzinKerja || row.tanggalIzinKerja}</Typography> },
                    { id: 'passportNumber', label: 'Passport Number', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.passportNumber}</Typography> },
                    { id: 'kitasNumber', label: 'Kitas Number', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.kitasNumber}</Typography> },
                    { id: 'kodeNegara', label: 'Kode Negara', render: (row) => <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{row.kodeNegara}</Typography> },
                    { id: 'status', label: 'Status', render: (row) => {
                      const st = (row.status || '').toUpperCase();
                      let bgColor = '#6c757d'; // NEW - secondary
                      if (st === 'INCOMPLETE') bgColor = '#ffc107'; // warning
                      else if (st === 'REQUEST') bgColor = '#0d6efd'; // primary
                      else if (st === 'REJECTED' || st === 'REJECT') bgColor = '#dc3545'; // danger
                      else if (st === 'APPROVED') bgColor = '#198754'; // success
                      
                      return (
                        <Button disabled sx={{
                          width: 100, bgcolor: bgColor, color: 'white !important',
                          fontSize: '0.7rem', fontWeight: 700,
                          '&.Mui-disabled': { bgcolor: bgColor, color: 'white !important' }
                        }}>
                          {st}
                        </Button>
                      );
                    }},
                    { id: 'createdBy', label: 'Created By', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.createdBy}</Typography> },
                    { id: 'createdDate', label: 'Created Date', render: (row) => <Typography sx={{ fontSize: '0.75rem' }}>{row.createdDate}</Typography> },
                    { id: 'action', label: 'Action', render: (row) => (
                        <Tooltip title="Edit WNA">
                          <IconButton size="small" sx={{ bgcolor: '#e0e7ff', color: '#4f46e5', '&:hover': { bgcolor: '#4f46e5', color: '#fff' } }}
                            onClick={() => { 
                                setSelectedWna(row); 
                                setWnaEditForm({
                                    tglIzinKerja: row.tglIzinKerja || row.tanggalIzinKerja || '',
                                    passportNumber: row.passportNumber || '',
                                    kitasNumber: row.kitasNumber || ''
                                });
                                setOpenWnaEdit(true); 
                            }}
                          >
                            <EditIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                    )},
                  ]}
                  data={wnaData}
                  loading={wnaLoading}
                  page={wnaPage}
                  pageSize={wnaPageSize}
                  totalElements={totalWnaElements}
                  totalPages={totalWnaPages}
                  onPageChange={setWnaPage}
                  onPageSizeChange={setWnaPageSize}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>
      </CustomModal>

      {/* Dialog Konfirmasi Simpan / Process */}
      <CustomConfirmDialog open={openConfirmProcess} onClose={() => setOpenConfirmProcess(false)} title="Simpan" message="Are you sure want to upload this file ?" onConfirm={() => startProcessSimulation(openUploadWna ? 'WNA' : openUploadNpwp ? 'NPWP' : 'TKU')} />

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
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    Processing...
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                    {uploadProgress}%
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Validation Modal */}
      <CustomModal open={openValidationModal} onClose={() => setOpenValidationModal(false)} title="Peringatan Data Belum Lengkap" maxWidth="md">
        <DialogContent sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ mb: 2, fontWeight: 600 }}>
            Permintaan data (Passport, KITAS, Asal Negara, dan Tanggal Izin Kerja) yang belum disetujui SPV. Silahkan cek melalui form "Data Izin WNA" dan mohon selesaikan dahulu.
          </Alert>
          <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
            <DataTable
              columns={[
                { id: 'nik', label: 'NIK', render: (row) => <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{row.nik}</Typography> },
                { id: 'name', label: 'Nama', render: (row) => <Typography sx={{ fontSize: '0.8rem' }}>{row.name}</Typography> },
                { id: 'status', label: 'Status', render: (row) => <Chip label={row.status || 'REQUEST'} size="small" color="warning" /> }
              ]}
              data={validationRequests}
              showPagination={false}
              page={1}
              pageSize={validationRequests.length || 10}
              totalElements={validationRequests.length}
              totalPages={1}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
              loading={false}
              headerBg="#f8fafc"
              headerColor="#1e293b"
            />
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
             <Button variant="contained" onClick={() => setOpenValidationModal(false)} sx={{ bgcolor: '#64748b', textTransform: 'none', fontWeight: 600 }}>Tutup</Button>
          </Box>
        </DialogContent>
      </CustomModal>

      {/* Modal Edit WNA */}
      <CustomModal open={openWnaEdit} onClose={() => setOpenWnaEdit(false)} title="Edit Approval WNA" maxWidth="sm">
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField 
              label="Passport Number" 
              value={wnaEditForm.passportNumber} 
              onChange={(e) => setWnaEditForm(prev => ({ ...prev, passportNumber: e.target.value }))}
              disabled={selectedWna?.status === 'APPROVED'}
              size="small" fullWidth
            />
            <TextField 
              label="Kitas Number" 
              value={wnaEditForm.kitasNumber} 
              onChange={(e) => setWnaEditForm(prev => ({ ...prev, kitasNumber: e.target.value }))}
              disabled={selectedWna?.status === 'APPROVED'}
              size="small" fullWidth
            />
            <TextField 
              label="Tanggal Izin Kerja" 
              value={wnaEditForm.tglIzinKerja} 
              onChange={(e) => setWnaEditForm(prev => ({ ...prev, tglIzinKerja: e.target.value }))}
              disabled={selectedWna?.status === 'APPROVED'}
              size="small" fullWidth
              helperText="Format: dd/MM/yyyy"
            />
          </Stack>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
             <Button variant="outlined" onClick={() => setOpenWnaEdit(false)} sx={{ borderRadius: 2 }}>Batal</Button>
             {selectedWna?.status !== 'APPROVED' && (
                 <Button variant="contained" onClick={() => handleUpdateWna(false)} sx={{ borderRadius: 2 }}>Simpan</Button>
             )}
             {isSpv && selectedWna?.status !== 'APPROVED' && (
                 <Button variant="contained" color="success" onClick={() => handleUpdateWna(true)} sx={{ borderRadius: 2 }}>Approve</Button>
             )}
          </Box>
        </DialogContent>
      </CustomModal>

      <CustomModal open={openUploadErrorModal} onClose={() => setOpenUploadErrorModal(false)} title="Data Gagal Upload" maxWidth="sm">
        <DialogContent sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2, fontWeight: 600 }}>
            Terdapat beberapa baris data yang gagal diproses:
          </Alert>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 2, p: 2, bgcolor: '#f8fafc' }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {uploadErrorsList.map((errText, idx) => (
                <li key={idx} style={{ marginBottom: 4, fontSize: '0.85rem', color: '#334155' }}>
                  {errText}
                </li>
              ))}
            </ul>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
             <Button variant="contained" onClick={() => setOpenUploadErrorModal(false)} sx={{ bgcolor: '#64748b', textTransform: 'none', fontWeight: 600 }}>Tutup</Button>
          </Box>
        </DialogContent>
      </CustomModal>

      {/* Dialog Konfirmasi Bulk Approve WNA */}
      <CustomModal open={openBulkApproveWna} onClose={() => setOpenBulkApproveWna(false)} title="Konfirmasi Approve" maxWidth="sm">
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155', mb: 3 }}>
            Apakah Anda yakin ingin melakukan Approve untuk {wnaSelectedIds.length} data WNA yang dipilih?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={() => setOpenBulkApproveWna(false)} sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b', borderColor: '#cbd5e1' }}>
              Batal
            </Button>
            <Button variant="contained" onClick={handleBulkApproveWna} sx={{ bgcolor: '#3b82f6', textTransform: 'none', fontWeight: 700, px: 4 }}>
              Ya, Approve
            </Button>
          </Stack>
      </CustomModal>

      {/* Dialog Konfirmasi Bulk Reject WNA */}
      <CustomModal open={openBulkRejectWna} onClose={() => setOpenBulkRejectWna(false)} title="Konfirmasi Reject" maxWidth="sm">
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155', mb: 3 }}>
            Apakah Anda yakin ingin melakukan Reject untuk {wnaSelectedIds.length} data WNA yang dipilih?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={() => setOpenBulkRejectWna(false)} sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b', borderColor: '#cbd5e1' }}>
              Batal
            </Button>
            <Button variant="contained" onClick={handleBulkRejectWna} sx={{ bgcolor: '#ef4444', textTransform: 'none', fontWeight: 700, px: 4, '&:hover': { bgcolor: '#dc2626' } }}>
              Ya, Reject
            </Button>
          </Stack>
      </CustomModal>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MasterEmployee;
