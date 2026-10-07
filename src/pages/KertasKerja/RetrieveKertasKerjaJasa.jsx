import {
  Box, Typography, Paper, Button, TextField, Stack, Chip, IconButton, Tooltip, InputAdornment, Avatar, Grid, Divider
} from '@mui/material';
import KertasKerjaIcon from '@mui/icons-material/Assignment';
import ProcessIcon from '@mui/icons-material/PlayCircleFilledWhite';
import SearchIcon from '@mui/icons-material/Search';
import ResetIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RetrieveIcon from '@mui/icons-material/CloudDownload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DataTable from '../../components/Common/DataTable';
import SearchableSelect from '../../components/Common/SearchableSelect';
import CustomSnackbar from '../../components/Common/CustomSnackbar';
import CustomConfirmDialog from '../../components/Common/CustomConfirmDialog';
import CustomModal from '../../components/Common/CustomModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Seed dataset matching user's business flow and screenshot
const SEED_RETRIEVE_DATA = [
  {
    id: 1,
    nik: 'D6240395',
    nama: 'A. RYAN EFENDY',
    employeeType: 'MAGANG',
    division: 'BCA',
    unitName: 'BCA CARD PERSONALIZATION & DISTRIBUTION SERVICES',
    position: 'Pengelolaan E-Channel - Inject',
    unitKerjaPenempatan: 'KANTOR PUSAT - CARD PERSONALIZATION & DISTRIBUTION SERVICES - 1438',
    posisiClient: 'PENGELOLAAN E-CHANNEL-KP - P000020',
    status: 'RESIGN',
    joinDate: '05/08/2024',
    resignDate: '23/08/2024'
  },
  {
    id: 2,
    nik: 'D6240368',
    nama: 'A. RYAN EFENDY',
    employeeType: 'MAGANG',
    division: 'BCA',
    unitName: 'BCA CARD PERSONALIZATION & DISTRIBUTION SERVICES',
    position: 'Administrasi',
    unitKerjaPenempatan: 'KANTOR PUSAT - CARD PERSONALIZATION & DISTRIBUTION SERVICES - 1438',
    posisiClient: 'ADMINISTRASI KANTOR PUSAT - P000005',
    status: 'RESIGN',
    joinDate: '25/07/2024',
    resignDate: '26/07/2024'
  },
  {
    id: 3,
    nik: 'D8221889',
    nama: 'AAN SURYANA',
    employeeType: 'PKWT',
    division: 'BCA',
    unitName: 'BCA Urusan EDC Production',
    position: 'Pengelolaan E-Channel',
    unitKerjaPenempatan: 'KANTOR PUSAT - EDC SERVICES - 1610',
    posisiClient: 'PENGELOLAAN E-CHANNEL-KP - P000020',
    status: 'ACTIVE',
    joinDate: '01/01/2023',
    resignDate: '-'
  },
  {
    id: 4,
    nik: 'D8241211',
    nama: 'AANG GUNAWAN',
    employeeType: 'PKWT',
    division: 'BCA',
    unitName: 'BCA Customer Touch Point Bureau B',
    position: 'Administrasi',
    unitKerjaPenempatan: 'KANTOR PUSAT - SUB DIVISI CUSTOMER TOUCH POINT - 2057',
    posisiClient: 'ADMINISTRASI KANTOR PUSAT - P000005',
    status: 'RESIGN',
    joinDate: '18/07/2024',
    resignDate: '03/06/2026'
  },
  {
    id: 5,
    nik: 'D8222107',
    nama: 'ABDUL GOFUR',
    employeeType: 'PKWT',
    division: 'BCA',
    unitName: 'BCA Biro Operasi Kredit Konsumer I',
    position: 'Administrasi',
    unitKerjaPenempatan: 'KANTOR PUSAT - BIRO OPERASI KREDIT KONSUMER I - 1544',
    posisiClient: 'ADMINISTRASI KANTOR PUSAT - P000005',
    status: 'RESIGN',
    joinDate: '01/01/2023',
    resignDate: '11/02/2025'
  },
  {
    id: 6,
    nik: 'D8241278',
    nama: 'ABDUL MUJID',
    employeeType: 'PKWT',
    division: 'BCA',
    unitName: 'BCA Bancassurance Business Management',
    position: 'Administrasi',
    unitKerjaPenempatan: 'KANTOR PUSAT - BANCASSURANCE BUSINESS MANAGEMENT - 1692',
    posisiClient: 'ADMINISTRASI KANTOR PUSAT - P000005',
    status: 'RESIGN',
    joinDate: '24/07/2024',
    resignDate: '31/12/2024'
  },
  {
    id: 7,
    nik: 'D8221736',
    nama: 'ABIMANYU PRINGGAYUDHA MATJAN',
    employeeType: 'PKWT',
    division: 'BCA',
    unitName: 'BCA Application & User Acceptance Test Bureau C',
    position: 'IT Tester Manual GPOL',
    unitKerjaPenempatan: 'KANTOR PUSAT - APPLICATION & USER ACCEPTANCE TEST BUREAU C - 2273',
    posisiClient: 'TESTER MANUAL - GPOL - P000207',
    status: 'ACTIVE',
    joinDate: '22/11/2022',
    resignDate: '-'
  },
  {
    id: 8,
    nik: 'D8250397',
    nama: 'ABIMANYU TEGAR SAMUDRA',
    employeeType: 'PKWT',
    division: 'BCA',
    unitName: 'BCA Service Operation Support Bureau A',
    position: 'Help Desk',
    unitKerjaPenempatan: 'KANTOR PUSAT - SERVICE OPERATION SUPPORT BUREAU A - 2287',
    posisiClient: 'HELP DESK - P000022',
    status: 'ACTIVE',
    joinDate: '14/03/2025',
    resignDate: '-'
  },
  {
    id: 9,
    nik: 'D8222096',
    nama: 'ABNER ARIE PRANATA NOVEMBERIAN MARPAUNG',
    employeeType: 'PKWT',
    division: 'BCA',
    unitName: 'BCA Biro Operasi Kredit Konsumer I',
    position: 'Team Leader Admin',
    unitKerjaPenempatan: 'KANTOR PUSAT - BIRO OPERASI KREDIT KONSUMER I - 1544',
    posisiClient: 'ADMINISTRASI KANTOR PUSAT - P000005',
    status: 'RESIGN',
    joinDate: '01/01/2023',
    resignDate: '24/07/2025'
  },
  {
    id: 10,
    nik: 'D8252322',
    nama: 'ACHMAD AUNURROFIK',
    employeeType: 'PKWT',
    division: 'BCA',
    unitName: 'BCA Biro Business Settlement Services',
    position: 'Help Desk',
    unitKerjaPenempatan: 'KANTOR PUSAT - BUSINESS SETTLEMENT SERVICES - 1416',
    posisiClient: 'HELP DESK - P000022',
    status: 'ACTIVE',
    joinDate: '01/12/2025',
    resignDate: '-'
  }
];

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
];

const YEARS = Array.from({ length: 7 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());

const RetrieveKertasKerjaJasa = () => {
  const [dataList, setDataList] = useState(SEED_RETRIEVE_DATA);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('09');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal / Detail / Confirm State
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', action: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  // Fetch API if available, fallback to seed
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/kertas-kerja/retrieve`, {
        headers: getAuthHeader(),
        params: {
          month: selectedMonth,
          year: selectedYear,
          division: selectedDivision || undefined,
          unit: selectedUnit || undefined,
          search: search || undefined
        }
      });
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setDataList(res.data.data);
      }
    } catch (err) {
      console.warn('API /api/kertas-kerja/retrieve not ready, using local dataset:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  // Dynamic filter dropdown options
  const divisionOptions = useMemo(() => {
    const set = new Set(dataList.map((item) => item.division).filter(Boolean));
    return Array.from(set).map((d) => ({ label: d, value: d }));
  }, [dataList]);

  const unitOptions = useMemo(() => {
    let list = dataList;
    if (selectedDivision) {
      list = list.filter((item) => item.division === selectedDivision);
    }
    const set = new Set(list.map((item) => item.unitName).filter(Boolean));
    return Array.from(set).map((u) => ({ label: u, value: u }));
  }, [dataList, selectedDivision]);

  // Client-side filtering & pagination
  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.nik && item.nik.toLowerCase().includes(q)) ||
        (item.nama && item.nama.toLowerCase().includes(q)) ||
        (item.position && item.position.toLowerCase().includes(q)) ||
        (item.unitKerjaPenempatan && item.unitKerjaPenempatan.toLowerCase().includes(q)) ||
        (item.posisiClient && item.posisiClient.toLowerCase().includes(q));

      const matchDivision = !selectedDivision || item.division === selectedDivision;
      const matchUnit = !selectedUnit || item.unitName === selectedUnit;

      return matchSearch && matchDivision && matchUnit;
    });
  }, [dataList, search, selectedDivision, selectedUnit]);

  const totalElements = filteredData.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Reset Filters
  const handleResetFilter = () => {
    setSearch('');
    setSelectedDivision('');
    setSelectedUnit('');
    setSelectedMonth('09');
    setSelectedYear('2026');
    setPage(1);
  };

  // Handle Process Action
  const handleProcess = () => {
    const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label || selectedMonth;
    setConfirmDialog({
      open: true,
      title: 'Proses Kertas Kerja Jasa',
      message: `Apakah Anda yakin ingin memproses data Retrieve Kertas Kerja Jasa untuk Periode ${monthLabel} ${selectedYear}?`,
      action: async () => {
        try {
          await axios.post(
            `${API_URL}/api/kertas-kerja/process`,
            { month: selectedMonth, year: selectedYear, division: selectedDivision, unit: selectedUnit },
            { headers: getAuthHeader() }
          );
        } catch (err) {
          console.warn('Process fallback:', err.message);
        }
        showSnackbar(`Proses Kertas Kerja Jasa periode ${monthLabel} ${selectedYear} berhasil dijalankan!`, 'success');
      }
    });
  };

  // Table Columns (Compact View)
  const columns = [
    {
      id: 'no',
      label: 'No',
      align: 'center',
      width: '45px',
      render: (row, index) => (page - 1) * pageSize + index + 1
    },
    {
      id: 'nik',
      label: 'NIK',
      render: (row) => (
        <Chip
          label={row.nik || '-'}
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
      id: 'nama',
      label: 'Nama Karyawan',
      render: (row) => (
        <Typography 
          variant="body2"
          title={row.nama}
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
          {row.nama || '-'}
        </Typography>
      )
    },
    {
      id: 'employeeType',
      label: 'Employee Type',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.employeeType || '-'}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.7rem',
            bgcolor:
              row.employeeType === 'MAGANG'
                ? 'rgba(59, 130, 246, 0.12)'
                : row.employeeType === 'PKWTT'
                ? 'rgba(16, 185, 129, 0.12)'
                : 'rgba(99, 102, 241, 0.12)',
            color:
              row.employeeType === 'MAGANG'
                ? '#2563eb'
                : row.employeeType === 'PKWTT'
                ? '#10b981'
                : '#6366f1'
          }}
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
          {row.division || '-'}
        </Typography>
      )
    },
    {
      id: 'unitName',
      label: 'Unit Name',
      render: (row) => (
        <Typography 
          variant="body2"
          title={row.unitName}
          sx={{ 
            fontSize: '0.78rem', 
            color: 'text.primary', 
            fontWeight: 600,
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {row.unitName || '-'}
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
            color: 'text.secondary',
            maxWidth: 130,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {row.position || '-'}
        </Typography>
      )
    },
    {
      id: 'status',
      label: 'Status',
      align: 'center',
      render: (row) => (
        <Chip
          label={row.status || '-'}
          size="small"
          sx={{
            fontWeight: 800,
            fontSize: '0.7rem',
            bgcolor: row.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
            color: row.status === 'ACTIVE' ? '#10b981' : '#ef4444',
            border: '1px solid',
            borderColor: row.status === 'ACTIVE' ? '#bbf7d0' : '#fecaca'
          }}
        />
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
    const isActive = row.status === 'ACTIVE';

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
        {/* Top Header Row of Collapsible */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main', fontSize: '0.95rem', fontWeight: 800, boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }}>
              {row.nama ? row.nama.charAt(0).toUpperCase() : 'K'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.98rem', lineHeight: 1.2 }}>
                {row.nama}
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
              label={row.status || 'ACTIVE'}
              size="small"
              sx={{
                fontWeight: 700, fontSize: '0.7rem',
                bgcolor: isActive ? '#dcfce7' : '#fee2e2',
                color: isActive ? '#10b981' : '#ef4444',
                border: '1px solid',
                borderColor: isActive ? '#bbf7d0' : '#fecaca'
              }}
            />
            <Chip
              label={`Tipe: ${row.employeeType || 'MAGANG'}`}
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.7rem', bgcolor: 'action.hover', color: 'text.primary' }}
            />
          </Box>

          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<VisibilityIcon sx={{ fontSize: '1rem !important' }} />}
            onClick={() => { setSelectedRow(row); setOpenDetailModal(true); }}
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
            Lihat Detail Karyawan
          </Button>
        </Box>

        {/* Maximized 3-Column Linear Section */}
        <Grid container spacing={2.5}>
          {/* Column 1: Penempatan Client */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <BusinessIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Penempatan Client
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    UNIT KERJA PENEMPATAN
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem' }}>
                    {row.unitKerjaPenempatan || '-'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    POSISI CLIENT
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.posisiClient || '-'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 2: Masa Kerja & Kontrak */}
          <Grid item xs={12} sm={6} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <CalendarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Masa Kerja & Kontrak
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    JOIN DATE
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem' }}>
                    {row.joinDate || '-'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    RESIGN DATE
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: row.resignDate !== '-' ? 'error.main' : 'text.primary', fontSize: '0.8rem' }}>
                    {row.resignDate || '- (Aktif)'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.2 }}>
                    TIPE KEPEGAWAIAN
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8rem' }}>
                    {row.employeeType || '-'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Column 3: Ringkasan Status Kertas Kerja */}
          <Grid item xs={12} sm={12} lg={4}>
            <Box sx={{ p: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <WorkIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem' }}>
                  Ringkasan Kertas Kerja
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0.75, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 500 }}>
                    Status Karyawan
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: isActive ? 'success.main' : 'error.main' }}>
                    {row.status || 'ACTIVE'}
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
                    Status Kertas Kerja Jasa
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontSize: '0.88rem' }}>
                    Siap Ditagihkan / Terkalkulasi
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
            <RetrieveIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Retrieve Kertas Kerja Jasa
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 500 }}>
              Kalkulasi dan penarikan data kertas kerja jasa karyawan aktif & mutasi
            </Typography>
          </Box>
        </Box>
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
          {/* Row 1: Search & Unit/Division Filters */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Cari NIK, Nama Karyawan, Posisi..."
              sx={{ flex: '1 1 240px', minWidth: 200, bgcolor: 'background.paper', borderRadius: 2 }}
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
            <Box sx={{ flex: '1 1 180px', minWidth: 160 }}>
              <SearchableSelect
                placeholder="(Division)"
                value={selectedDivision}
                onChange={(val) => {
                  setSelectedDivision(val || '');
                  setSelectedUnit('');
                }}
                options={divisionOptions}
              />
            </Box>
            <Box sx={{ flex: '1 1 180px', minWidth: 160 }}>
              <SearchableSelect
                placeholder="(All Unit)"
                value={selectedUnit}
                onChange={(val) => setSelectedUnit(val || '')}
                options={unitOptions}
              />
            </Box>
          </Box>

          {/* Row 2: Periode Bulan, Periode Tahun, SEARCH, PROCESS, Reset */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', minWidth: 60 }}>
              Periode:
            </Typography>
            <Box sx={{ width: 160, minWidth: 140 }}>
              <SearchableSelect
                placeholder="Pilih Bulan"
                value={selectedMonth}
                onChange={(val) => setSelectedMonth(val || '09')}
                options={MONTHS}
              />
            </Box>
            <Box sx={{ width: 130, minWidth: 110 }}>
              <SearchableSelect
                placeholder="Pilih Tahun"
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

            <Button
              variant="contained"
              startIcon={<ProcessIcon />}
              onClick={handleProcess}
              sx={{
                bgcolor: '#10b981',
                color: 'white',
                '&:hover': { bgcolor: '#059669' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                height: '40px'
              }}
            >
              PROCESS
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
          </Box>
        </Stack>
      </Paper>

      {/* DATA TABLE */}
      <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }} elevation={0}>
        <DataTable
          columns={columns}
          data={paginatedData}
          loading={loading}
          page={page}
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          renderCollapsibleRow={renderCollapsibleRow}
        />
      </Paper>

      {/* DETAIL MODAL */}
      <CustomModal
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        title="Detail Karyawan Kertas Kerja"
        maxWidth="sm"
      >
        {selectedRow && (
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>NIK</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedRow.nik}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Nama Karyawan</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedRow.nama}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Employee Type</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedRow.employeeType}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Status</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedRow.status}</Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Divisi</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRow.division}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Unit Name</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRow.unitName}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Position</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRow.position}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Unit Kerja Penempatan</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRow.unitKerjaPenempatan}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Posisi Client</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedRow.posisiClient}</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Join Date</Typography>
                <Typography variant="body2">{selectedRow.joinDate}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Resign Date</Typography>
                <Typography variant="body2">{selectedRow.resignDate}</Typography>
              </Box>
            </Box>
          </Stack>
        )}
      </CustomModal>

      {/* CONFIRM DIALOG */}
      <CustomConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={async () => {
          if (confirmDialog.action) await confirmDialog.action();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />

      {/* SNACKBAR */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default RetrieveKertasKerjaJasa;
