import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, TextField,
  Stack, Chip, Checkbox, Grid, Divider, DialogContent, Tooltip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, Tabs, Tab, DialogActions, InputAdornment, Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as PlayArrowIcon,
  RotateLeft as RotateLeftIcon,
  PauseCircle as PauseCircleIcon,
  Edit as EditIcon,
  Calculate as CalculateIcon,
  CheckCircle as CheckCircleIcon,
  Payments as PaymentsIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  CalendarToday as CalendarIcon,
  ReceiptLong as ReceiptLongIcon,
  AccountBalanceWallet as WalletIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import { useCascadingDropdowns } from '../../hooks/useCascadingDropdowns';

const generateDummyData = () => {
  const divisionsList = ['Business Development', 'Tax, Accounting & Biz Plan', 'Operational', 'Human Resource', 'Finance'];
  const unitsList = ['Laku Pandai', 'Accounting', 'Sysmex', 'Juara Coding', 'Halo BCA - Inbound'];
  const positionsList = ['SUPERVISOR', 'Administrasi', 'Supervisor', 'Staff', 'Manager', 'Developer'];
  const branchesList = ['Bogor', 'JAKARTA', 'TANGERANG', 'Bandung', 'Surabaya'];
  const empTypesList = ['PKWT', 'PKWTT', 'MAGANG', 'MITRA'];
  const namesList = [
    'Pegawai Dummy', 'MAMTA SARTIKA', 'POPI ANGRAINI', 'DEWABRATA', 'JANE', 'SINTIA DORA', 'I MADE VERI', 'SITI SARAH', 
    'OLAF W FELIX', 'ANGGA TUBAGUS', 'EDI MULYANTO', 'DIMAS AGUNG', 'CHIARA ESPOSITO', 'PRISKA SULISTIAWATI'
  ];

  const data = [];
  
  // Seed the 3 original ones first for visual consistency
  data.push({
    id: 1,
    nik: 'D0000331',
    name: 'Pegawai Dummy 331',
    employeeType: 'Pkwt',
    division: 'Business Development',
    unitName: 'Laku Pandai',
    position: 'SUPERVISOR',
    branch: 'Bogor',
    joinDate: '19/02/2026',
    resignDate: '-',
    statusEmployee: 'Active',
    periodeStart: '01/12/2026',
    periodeEnd: '31/12/2026',
    methodePajak: 'Net',
    komponenProject: 'Net',
    sumberAcuanPajak: 'Master Client',
    totalBruto: 1002059,
    statusPph21: 'HOLD',
    statusBayar: 'UNPAID',
    statusPengembalianPajak: 'NO'
  });
  data.push({
    id: 2,
    nik: 'D8231214',
    name: 'MAMTA SARTIKA',
    employeeType: 'PKWT',
    division: 'Tax, Accounting & Biz Plan',
    unitName: 'Accounting',
    position: 'Administrasi',
    branch: 'JAKARTA',
    joinDate: '28/08/2023',
    resignDate: '-',
    statusEmployee: 'Active',
    periodeStart: '01/12/2026',
    periodeEnd: '31/12/2026',
    methodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    totalBruto: 12000000,
    statusPph21: 'HOLD',
    statusBayar: 'UNPAID',
    statusPengembalianPajak: 'NO'
  });
  data.push({
    id: 3,
    nik: 'D8210663',
    name: 'POPI ANGRAINI',
    employeeType: 'PKWT',
    division: 'Tax, Accounting & Biz Plan',
    unitName: 'Accounting',
    position: 'Supervisor',
    branch: 'JAKARTA',
    joinDate: '02/06/2021',
    resignDate: '-',
    statusEmployee: 'Active',
    periodeStart: '01/12/2026',
    periodeEnd: '31/12/2026',
    methodePajak: 'Gross',
    komponenProject: 'Gross',
    sumberAcuanPajak: 'Master Client',
    totalBruto: 12000000,
    statusPph21: 'RELEASE',
    statusBayar: 'UNPAID',
    statusPengembalianPajak: 'NO'
  });

  // Generate 97 more records
  for (let i = 4; i <= 100; i++) {
    const nikNum = String(100000 + i).padStart(6, '0');
    const namePrefix = namesList[i % namesList.length];
    data.push({
      id: i,
      nik: `D${nikNum}`,
      name: `${namePrefix} ${i}`,
      employeeType: empTypesList[i % empTypesList.length],
      division: divisionsList[i % divisionsList.length],
      unitName: unitsList[i % unitsList.length],
      position: positionsList[i % positionsList.length],
      branch: branchesList[i % branchesList.length],
      joinDate: '01/01/2024',
      resignDate: '-',
      statusEmployee: 'Active',
      periodeStart: '01/12/2026',
      periodeEnd: '31/12/2026',
      methodePajak: i % 2 === 0 ? 'Gross' : 'Net',
      komponenProject: i % 2 === 0 ? 'Gross' : 'Net',
      sumberAcuanPajak: 'Master Client',
      totalBruto: 3000000 + (i * 75000),
      statusPph21: i % 3 === 0 ? 'HOLD' : 'RELEASE',
      statusBayar: i % 4 === 0 ? 'PAID' : 'UNPAID',
      statusPengembalianPajak: i % 5 === 0 ? 'YES' : 'NO'
    });
  }

  return data;
};

const INITIAL_PPH_DATA = generateDummyData();

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const YEAR_OPTIONS = ['2027', '2026', '2025', '2024', '2023'];

export default function ProsesPph() {
  const { user } = useSelector((state) => state.auth);
  const userPosition = user?.position?.toUpperCase() || '';
  const isSpv = userPosition === 'SPV' || userPosition === 'SUPERVISOR' || userPosition === 'IT';

  // States
  const [dataList, setDataList] = useState(INITIAL_PPH_DATA);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterDivision, setFilterDivision] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterEmployeeType, setFilterEmployeeType] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterStatusBayar, setFilterStatusBayar] = useState('');
  const [filterStatusPph21, setFilterStatusPph21] = useState('');
  const [filterMonth, setFilterMonth] = useState('December');
  const [filterYear, setFilterYear] = useState('2026');
  const [filterStatusPengembalianPajak, setFilterStatusPengembalianPajak] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalTabValue, setModalTabValue] = useState(0);

  const handleOpenDetailModal = (employee) => {
    setSelectedEmployee(employee);
    setModalTabValue(0);
    setDetailModalOpen(true);
  };

  // Dialogs & Snackbar
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: () => {} });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Cascading Dropdown Helper
  const combinations = useMemo(() => {
    return dataList.map(r => ({
      division: r.division,
      unit: r.unitName,
      position: r.position,
      employeeType: r.employeeType,
      branch: r.branch
    }));
  }, [dataList]);

  const cascading = useCascadingDropdowns(combinations, {
    division: filterDivision,
    unit: filterUnit,
    position: filterPosition,
    employeeType: filterEmployeeType,
    branch: filterBranch
  });

  // Filter Logic
  const filteredData = useMemo(() => {
    return dataList.filter(row => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchNik = row.nik?.toLowerCase()?.includes(q);
        const matchName = row.name?.toLowerCase()?.includes(q);
        if (!matchNik && !matchName) return false;
      }
      if (filterDivision && row.division !== filterDivision) return false;
      if (filterUnit && row.unitName !== filterUnit) return false;
      if (filterPosition && row.position !== filterPosition) return false;
      if (filterEmployeeType && row.employeeType !== filterEmployeeType) return false;
      if (filterBranch && row.branch !== filterBranch) return false;
      if (filterStatusBayar && row.statusBayar !== filterStatusBayar) return false;
      if (filterStatusPph21 && row.statusPph21 !== filterStatusPph21) return false;
      if (filterStatusPengembalianPajak && row.statusPengembalianPajak !== filterStatusPengembalianPajak) return false;
      return true;
    });
  }, [dataList, searchQuery, filterDivision, filterUnit, filterPosition, filterEmployeeType, filterBranch, filterStatusBayar, filterStatusPph21, filterStatusPengembalianPajak]);

  // Pagination slice
  const startIndex = (page - 1) * pageSize;
  const paginatedData = useMemo(() => {
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, startIndex, pageSize]);

  // Statistics calculation for Top Summary Cards
  const totalEmployees = filteredData.length;
  const totalBrutoAmount = useMemo(() => {
    return filteredData.reduce((sum, r) => sum + (Number(r.totalBruto) || 0), 0);
  }, [filteredData]);

  const holdCount = useMemo(() => filteredData.filter(r => r.statusPph21 === 'HOLD').length, [filteredData]);
  const releaseCount = useMemo(() => filteredData.filter(r => r.statusPph21 === 'RELEASE').length, [filteredData]);
  const processedCount = useMemo(() => filteredData.filter(r => r.statusPph21 === 'PROCESSED').length, [filteredData]);
  const paidCount = useMemo(() => filteredData.filter(r => r.statusBayar === 'PAID').length, [filteredData]);
  const unpaidCount = useMemo(() => filteredData.filter(r => r.statusBayar !== 'PAID').length, [filteredData]);

  // Column definitions for DataTable (Compact View)
  const columns = [
    {
      id: 'select',
      label: '',
      width: '40px',
      align: 'center',
      headerRender: () => (
        <Checkbox
          size="small"
          checked={paginatedData.length > 0 && paginatedData.every(row => selectedIds.includes(row.id))}
          onChange={(e) => {
            if (e.target.checked) {
              const paginatedIds = paginatedData.map(r => r.id);
              setSelectedIds(prev => Array.from(new Set([...prev, ...paginatedIds])));
            } else {
              const paginatedIds = paginatedData.map(r => r.id);
              setSelectedIds(prev => prev.filter(id => !paginatedIds.includes(id)));
            }
          }}
          sx={{ color: 'text.secondary', '&.Mui-checked': { color: 'primary.main' } }}
        />
      ),
      render: (row) => (
        <Checkbox
          size="small"
          checked={selectedIds.includes(row.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(prev => [...prev, row.id]);
            } else {
              setSelectedIds(prev => prev.filter(id => id !== row.id));
            }
          }}
          sx={{ color: 'text.secondary', '&.Mui-checked': { color: 'primary.main' } }}
        />
      )
    },
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
      label: 'Nama Karyawan',
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

  // Collapsible Sub-Row (Minimal Linear Concept)
  const renderCollapsibleRow = (row) => {
    const isHold = row.statusPph21 === 'HOLD';
    const isRelease = row.statusPph21 === 'RELEASE';
    const isProcessed = row.statusPph21 === 'PROCESSED';

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
        {/* Top Header Row of Collapsible */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main', fontSize: '0.95rem', fontWeight: 800, boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }}>
              {row.name ? row.name.charAt(0).toUpperCase() : 'P'}
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
              label={`Status PPh21: ${row.statusPph21 || 'NEW'}`}
              size="small"
              sx={{
                fontWeight: 700, fontSize: '0.7rem',
                bgcolor: isRelease ? '#dcfce7' : isProcessed ? '#eff6ff' : isHold ? '#fef3c7' : '#f1f5f9',
                color: isRelease ? '#15803d' : isProcessed ? '#1d4ed8' : isHold ? '#b45309' : '#475569',
                border: '1px solid',
                borderColor: isRelease ? '#bbf7d0' : isProcessed ? '#bfdbfe' : isHold ? '#fde68a' : '#e2e8f0'
              }}
            />
            <Chip
              label={`Status Bayar: ${row.statusBayar || 'UNPAID'}`}
              size="small"
              sx={{
                fontWeight: 700, fontSize: '0.7rem',
                bgcolor: row.statusBayar === 'PAID' ? '#dcfce7' : '#fee2e2',
                color: row.statusBayar === 'PAID' ? '#15803d' : '#b91c1c',
                border: '1px solid',
                borderColor: row.statusBayar === 'PAID' ? '#bbf7d0' : '#fecaca'
              }}
            />
          </Box>

          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<VisibilityIcon sx={{ fontSize: '1rem !important' }} />}
            onClick={() => handleOpenDetailModal(row)}
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
            Detail PPh21 Karyawan
          </Button>
        </Box>

        {/* Maximized 3-Column Linear Section */}
        <Grid container spacing={2.5}>
          {/* Column 1: Masa Kerja & Periode */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <CalendarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Informasi Kontrak & Periode
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    PERIODE PPH21
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
                    {row.joinDate || '-'} s/d {row.resignDate || '- (Aktif)'}
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
                        bgcolor: row.statusEmployee === 'ACTIVE' || row.statusEmployee === 'Active' ? '#dcfce7' : '#fee2e2',
                        color: row.statusEmployee === 'ACTIVE' || row.statusEmployee === 'Active' ? '#15803d' : '#b91c1c'
                      }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 2: Skema Pajak & Parameter Acuan */}
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
                    {row.methodePajak || 'Gross'}
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
                    PENGEMBALIAN PAJAK
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.pengembalianPajak || 'NO'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 3: Finansial & Total Bruto */}
          <Grid item xs={12} sm={12} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <WalletIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Rincian Finansial PPh21
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0.75, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Status Proses PPh21
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: 'text.primary' }}>
                    {row.statusPph21 || 'PROCESSED'}
                  </Typography>
                </Box>

                {/* Total Bruto Highlight Banner */}
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
                    Total Pendapatan Bruto
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#059669', lineHeight: 1.2, fontSize: '1.15rem' }}>
                    Rp {Number(row.totalBruto || 0).toLocaleString('id-ID')}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Action Triggers
  const handleSearch = () => {
    setPage(1);
    showSnackbar('Data berhasil difilter!', 'success');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterDivision('');
    setFilterUnit('');
    setFilterPosition('');
    setFilterEmployeeType('');
    setFilterBranch('');
    setFilterStatusBayar('');
    setFilterStatusPph21('');
    setFilterMonth('December');
    setFilterYear('2026');
    setFilterStatusPengembalianPajak('');
    setPage(1);
    showSnackbar('Filter berhasil direset!', 'info');
  };

  const handleReturnData = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Pilih minimal satu data untuk di-return!', 'warning');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Return Data PPh',
      message: `Return data PPh untuk ${selectedIds.length} karyawan terpilih?`,
      onConfirm: () => {
        setConfirmDialog(c => ({ ...c, open: false }));
        setSelectedIds([]);
        showSnackbar('Data PPh terpilih berhasil di-return!', 'success');
      }
    });
  };

  const handleProcessPph = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Pilih minimal satu data untuk diproses!', 'warning');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Proses PPh21',
      message: `Proses PPh21 untuk ${selectedIds.length} karyawan terpilih?`,
      onConfirm: () => {
        setConfirmDialog(c => ({ ...c, open: false }));
        setDataList(prev => prev.map(row => 
          selectedIds.includes(row.id) ? { ...row, statusPph21: 'PROCESSED' } : row
        ));
        setSelectedIds([]);
        showSnackbar('Proses PPh21 berhasil disimulasikan!', 'success');
      }
    });
  };

  const handleHoldPayroll = () => {
    if (selectedIds.length === 0) {
      showSnackbar('Pilih minimal satu data untuk di-hold!', 'warning');
      return;
    }
    setConfirmDialog({
      open: true,
      title: 'Hold Payroll',
      message: `Hold payroll untuk ${selectedIds.length} karyawan terpilih?`,
      onConfirm: () => {
        setConfirmDialog(c => ({ ...c, open: false }));
        setDataList(prev => prev.map(row => 
          selectedIds.includes(row.id) ? { ...row, statusPph21: 'HOLD' } : row
        ));
        setSelectedIds([]);
        showSnackbar('Payroll terpilih berhasil di-hold!', 'success');
      }
    });
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
            <CalculateIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
              Proses PPh21
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
              Kelola perhitungan, pemrosesan PPh21, dan status penangguhan (hold/release) payroll karyawan
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
              Total Karyawan
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
              Total Bruto
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981', lineHeight: 1.2 }}>
              Rp {totalBrutoAmount.toLocaleString('id-ID')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Filtered batch bruto
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
              Status PPh21
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2, fontSize: '0.95rem' }}>
              {releaseCount} Rel / {holdCount} Hold / {processedCount} Proc
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Status proses PPh21
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
            <PaymentsIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Status Bayar
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2, fontSize: '0.95rem' }}>
              {paidCount} Paid / {unpaidCount} Unpaid
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Realisasi pembayaran pajak
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
              onClick={handleSearch}
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

          <Divider sx={{ my: 0.5 }} />

          {/* Row 2: Cascading Filters */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 1.5 }}>
            <SearchableSelect
              label="(Division)"
              placeholder="Semua Division"
              options={cascading.divisions}
              value={filterDivision}
              onChange={(val) => {
                setFilterDivision(val);
                setFilterUnit('');
                setFilterPosition('');
                setFilterEmployeeType('');
                setFilterBranch('');
              }}
            />

            <SearchableSelect
              label="(Unit)"
              placeholder="Semua Unit"
              options={cascading.units}
              value={filterUnit}
              onChange={(val) => {
                setFilterUnit(val);
                setFilterPosition('');
                setFilterEmployeeType('');
                setFilterBranch('');
              }}
            />

            <SearchableSelect
              label="(Position)"
              placeholder="Semua Position"
              options={cascading.positions}
              value={filterPosition}
              onChange={(val) => {
                setFilterPosition(val);
                setFilterEmployeeType('');
                setFilterBranch('');
              }}
            />

            <SearchableSelect
              label="(Employee Type)"
              placeholder="Semua Tipe"
              options={cascading.employeeTypes}
              value={filterEmployeeType}
              onChange={(val) => {
                setFilterEmployeeType(val);
                setFilterBranch('');
              }}
            />

            <SearchableSelect
              label="(Branch)"
              placeholder="Semua Branch"
              options={cascading.branches}
              value={filterBranch}
              onChange={(val) => setFilterBranch(val)}
            />
          </Box>

          {/* Row 3: Status and Month/Year Filters */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 1.5 }}>
            <SearchableSelect
              label="(Status Bayar)"
              placeholder="Semua Status"
              options={[
                { label: 'PAID', value: 'PAID' },
                { label: 'UNPAID', value: 'UNPAID' }
              ]}
              value={filterStatusBayar}
              onChange={(val) => setFilterStatusBayar(val)}
            />

            <SearchableSelect
              label="(Status PPH21)"
              placeholder="Semua Status PPh"
              options={[
                { label: 'HOLD', value: 'HOLD' },
                { label: 'RELEASE', value: 'RELEASE' },
                { label: 'PROCESSED', value: 'PROCESSED' }
              ]}
              value={filterStatusPph21}
              onChange={(val) => setFilterStatusPph21(val)}
            />

            <SearchableSelect
              label="Month"
              placeholder="Pilih Bulan"
              options={MONTH_NAMES}
              value={filterMonth}
              onChange={(val) => setFilterMonth(val)}
            />

            <SearchableSelect
              label="Year"
              placeholder="Pilih Tahun"
              options={YEAR_OPTIONS}
              value={filterYear}
              onChange={(val) => setFilterYear(val)}
            />

            <SearchableSelect
              label="(Status Pengembalian Pajak)"
              placeholder="Semua Status"
              options={[
                { label: 'YES', value: 'YES' },
                { label: 'NO', value: 'NO' }
              ]}
              value={filterStatusPengembalianPajak}
              onChange={(val) => setFilterStatusPengembalianPajak(val)}
            />
          </Box>
        </Stack>
      </Paper>

      {/* AKSI PPH21 TOOLBAR (ABOVE DATA TABLE) */}
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
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'primary.main', display: 'flex', alignItems: 'center' }}>
            <PaymentsIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              Aksi PPh21
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              <Box component="span" sx={{ fontWeight: 800, color: selectedIds.length > 0 ? 'primary.main' : 'text.primary' }}>
                {selectedIds.length}
              </Box> karyawan dipilih untuk diproses
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<RotateLeftIcon />}
            onClick={handleReturnData}
            disabled={selectedIds.length === 0}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: 'none',
              px: 2.5,
              height: '38px',
              borderColor: 'divider',
              color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' }
            }}
          >
            RETURN DATA
          </Button>

          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handleProcessPph}
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
            PROCESS PPH21
          </Button>

          {!isSpv && (
            <Button
              variant="contained"
              startIcon={<PauseCircleIcon />}
              onClick={handleHoldPayroll}
              disabled={selectedIds.length === 0}
              sx={{
                bgcolor: '#f59e0b',
                color: 'white',
                '&:hover': { bgcolor: '#d97706' },
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                px: 2.5,
                height: '38px',
                boxShadow: selectedIds.length > 0 ? '0 4px 14px rgba(245, 158, 11, 0.3)' : 'none'
              }}
            >
              HOLD PAYROLL
            </Button>
          )}
        </Stack>
      </Paper>

      {/* TABLE DATA CONTAINER */}
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

      {/* Global Dialogs & Snackbar */}
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

      {/* Detail Employee Dialog Modal */}
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CalculateIcon sx={{ color: 'primary.main' }} />
          Detail Data PPh21 Karyawan
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedEmployee && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Header info grid */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="NIK"
                    size="small"
                    fullWidth
                    disabled
                    value={selectedEmployee.nik || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Nama Karyawan"
                    size="small"
                    fullWidth
                    disabled
                    value={selectedEmployee.name || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Division"
                    size="small"
                    fullWidth
                    disabled
                    value={selectedEmployee.division || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Unit Name"
                    size="small"
                    fullWidth
                    disabled
                    value={selectedEmployee.unitName || ''}
                  />
                </Grid>
              </Grid>

              {/* Tabs bar */}
              <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                <Tabs 
                  value={modalTabValue} 
                  onChange={(e, val) => setModalTabValue(val)}
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab label="Detail Data 1" sx={{ fontWeight: 700, textTransform: 'none' }} />
                  <Tab label="Detail Data 2" sx={{ fontWeight: 700, textTransform: 'none' }} />
                  <Tab label="Detail Data 3" sx={{ fontWeight: 700, textTransform: 'none' }} />
                  <Tab label="Detail Data 4" sx={{ fontWeight: 700, textTransform: 'none' }} />
                  <Tab label="Detail Data 5" sx={{ fontWeight: 700, textTransform: 'none' }} />
                </Tabs>
              </Box>

              {/* Tab content 1 */}
              {modalTabValue === 0 && (
                <Stack spacing={3}>
                  {/* Data Karyawan grid */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5 }}>
                      Informasi Penugasan & Absensi
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Periode Start"
                          size="small"
                          fullWidth
                          disabled
                          value={selectedEmployee.periodeStart || ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Periode End"
                          size="small"
                          fullWidth
                          disabled
                          value={selectedEmployee.periodeEnd || ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Position"
                          size="small"
                          fullWidth
                          disabled
                          value={selectedEmployee.position || ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Employee Type"
                          size="small"
                          fullWidth
                          disabled
                          value={selectedEmployee.employeeType || ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Branch"
                          size="small"
                          fullWidth
                          disabled
                          value={selectedEmployee.branch || ''}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2}>
                        <TextField
                          label="Absen"
                          size="small"
                          fullWidth
                          disabled
                          value="31"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2}>
                        <TextField
                          label="Total Hari Kerja"
                          size="small"
                          fullWidth
                          disabled
                          value="31"
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Data Pendapatan table */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5 }}>
                      Rincian Komponen Pendapatan
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 220, borderRadius: 2, borderColor: 'divider' }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>No</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>Komponen</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            { no: 1, komponen: 'Gaji Pokok', value: selectedEmployee.totalBruto },
                            { no: 2, komponen: 'Tunjangan Supervisor', value: 1000000 },
                            { no: 3, komponen: 'Tunjangan Jabatan', value: 750000 },
                            { no: 4, komponen: 'Skill Allowance', value: 500000 },
                            { no: 5, komponen: 'Grading Allowance', value: 400000 },
                            { no: 6, komponen: 'Monthly Allowance', value: 350000 },
                            { no: 7, komponen: 'Performance Allowance', value: 600000 },
                            { no: 8, komponen: 'Position Allowance', value: 500000 },
                            { no: 9, komponen: 'Tunjangan Bensin', value: 300000 },
                            { no: 10, komponen: 'Tunjangan Komunikasi', value: 250000 }
                          ].map((item) => (
                            <TableRow key={item.no}>
                              <TableCell>{item.no}</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>{item.komponen}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: '#10b981' }}>
                                Rp {item.value.toLocaleString('id-ID')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Stack>
              )}

              {/* Tab content 2 */}
              {modalTabValue === 1 && (
                <Stack spacing={3}>
                  {/* Data Potongan */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5 }}>
                      Rincian Komponen Potongan
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 220, borderRadius: 2, borderColor: 'divider' }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>No</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>Komponen</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            { no: 1, komponen: 'Potongan Keterlambatan', value: 50000 },
                            { no: 2, komponen: 'Potongan Deposit', value: 100000 },
                            { no: 3, komponen: 'Potongan Denda', value: 75000 },
                            { no: 4, komponen: 'Potongan HTE', value: 50000 },
                            { no: 5, komponen: 'Potongan HTK', value: 50000 },
                            { no: 6, komponen: 'Potongan Indodana', value: 200000 },
                            { no: 7, komponen: 'Potongan Seragam', value: 80000 },
                            { no: 8, komponen: 'Potongan Parkir', value: 30000 }
                          ].map((item) => (
                            <TableRow key={item.no}>
                              <TableCell>{item.no}</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>{item.komponen}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: '#ef4444' }}>
                                Rp {item.value.toLocaleString('id-ID')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Data Benefit table */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5 }}>
                      Rincian Komponen Benefit & Asuransi
                    </Typography>
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 220, borderRadius: 2, borderColor: 'divider' }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>No</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>Komponen</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'background.paper' }}>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            { no: 1, komponen: 'Premi Asuransi', value: 150000 },
                            { no: 2, komponen: 'BPU JHT', value: 85000 },
                            { no: 3, komponen: 'BPU JKK', value: 24000 },
                            { no: 4, komponen: 'BPU JKM', value: 30000 },
                            { no: 5, komponen: 'JHT 3.7% (Perusahaan)', value: 185000 },
                            { no: 6, komponen: 'JKK 0.24% (Perusahaan)', value: 12000 },
                            { no: 7, komponen: 'JKM 0.3% (Perusahaan)', value: 15000 },
                            { no: 8, komponen: 'JP 2% (Perusahaan)', value: 100000 }
                          ].map((item) => (
                            <TableRow key={item.no}>
                              <TableCell>{item.no}</TableCell>
                              <TableCell sx={{ fontWeight: 600 }}>{item.komponen}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                                Rp {item.value.toLocaleString('id-ID')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Stack>
              )}

              {/* Placeholder tabs 3, 4, 5 */}
              {modalTabValue >= 2 && (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Tidak ada konfigurasi tambahan untuk Detail Data {modalTabValue + 1}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => setDetailModalOpen(false)}
            sx={{
              bgcolor: '#0f172a',
              '&:hover': { bgcolor: '#1e293b' },
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              px: 3
            }}
          >
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
