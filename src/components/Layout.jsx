import React, { useState, useEffect, useRef } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, CssBaseline, Collapse, Popover,
  IconButton, Avatar, Menu, MenuItem, Divider, useTheme, useMediaQuery,
  Stack, Badge, Tooltip, Chip, Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SettingIcon from '@mui/icons-material/Settings';
import PayrollIcon from '@mui/icons-material/Receipt';
import ReportIcon from '@mui/icons-material/Assessment';
import EmployeeIcon from '@mui/icons-material/Person';
import UserManagementIcon from '@mui/icons-material/ManageAccounts';
import PinjamanIcon from '@mui/icons-material/CreditCard';
import LemburIcon from '@mui/icons-material/WatchLater';
import LogoutIcon from '@mui/icons-material/Logout';
import MasterIcon from '@mui/icons-material/Storage';
import ReceiptIcon from '@mui/icons-material/ReceiptLong';
import UserIcon from '@mui/icons-material/Group';
import LocalAtmIcon from '@mui/icons-material/Payments';
import MenuIcon from '@mui/icons-material/Menu';
import BellIcon from '@mui/icons-material/NotificationsNone';
import MoonIcon from '@mui/icons-material/DarkModeOutlined';
import SunIcon from '@mui/icons-material/LightModeOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircleIcon from '@mui/icons-material/Circle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import UmkIcon from '@mui/icons-material/MonetizationOn';
import UpahIcon from '@mui/icons-material/PriceCheck';
import UnitKerjaIcon from '@mui/icons-material/Domain';
import PosisiIcon from '@mui/icons-material/Badge';
import TerIcon from '@mui/icons-material/TableChart';
import PtkpIcon from '@mui/icons-material/AccountBalance';
import PkpIcon from '@mui/icons-material/AccountBalanceWallet';
import ClientIcon from '@mui/icons-material/Business';
import PicProjectIcon from '@mui/icons-material/Assignment';
import LiburIcon from '@mui/icons-material/CalendarMonth';
import SwiftIcon from '@mui/icons-material/VpnKey';
import HoldIcon from '@mui/icons-material/PauseCircle';
import MasterSettingIcon from '@mui/icons-material/Tune';
import RetrieveIcon from '@mui/icons-material/CloudDownload';
import ProsesIcon from '@mui/icons-material/PlayCircleOutlined';
import CalculateIcon from '@mui/icons-material/Calculate';
import ListIcon from '@mui/icons-material/FormatListBulleted';
import SlipIcon from '@mui/icons-material/Description';
import SimulasiIcon from '@mui/icons-material/Science';
import SummaryIcon from '@mui/icons-material/Summarize';
import BupotIcon from '@mui/icons-material/ArticleOutlined';
import BupotA1Icon from '@mui/icons-material/NoteAlt';
import Bupot21Icon from '@mui/icons-material/FileCopy';
import Bupot26Icon from '@mui/icons-material/ContentPaste';
import BupotKompIcon from '@mui/icons-material/RequestPage';
import EntryIcon from '@mui/icons-material/AddCircle';
import UploadIcon from '@mui/icons-material/CloudUpload';
import BackupIcon from '@mui/icons-material/Backup';
import SlipKompIcon from '@mui/icons-material/ReceiptLong';
import ReportBpjsIcon from '@mui/icons-material/BarChart';
import RekapIcon from '@mui/icons-material/PieChart';
import ReportBupotIcon from '@mui/icons-material/FolderOpen';
import UbahUpahIcon from '@mui/icons-material/TrendingUp';
import IuranIcon from '@mui/icons-material/HealthAndSafety';
import TkMasukIcon from '@mui/icons-material/PersonAdd';
import TkKeluarIcon from '@mui/icons-material/PersonRemove';
import RolePrivilegeIcon from '@mui/icons-material/AdminPanelSettings';
import ChangePasswordIcon from '@mui/icons-material/LockReset';
import ToggleProjectIcon from '@mui/icons-material/ToggleOn';
import KertasKerjaIcon from '@mui/icons-material/AssignmentOutlined';
import KkJasaIcon from '@mui/icons-material/ReceiptLongOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setPermissions } from '../store/slices/authSlice';
import { useColorMode } from '../context/ThemeContext';
import axios from 'axios';

const drawerWidth = 260;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, permissions } = useSelector((state) => state.auth);

  // Helper untuk state yang persisten di localStorage
  const usePersistentState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
      try {
        const saved = localStorage.getItem(key);
        return saved !== null ? JSON.parse(saved) : defaultValue;
      } catch { return defaultValue; }
    });
    const setPersistentState = (value) => {
      setState(value);
      localStorage.setItem(key, JSON.stringify(value));
    };
    return [state, setPersistentState];
  };

  const [openMaster, setOpenMaster] = usePersistentState('sidebar_openMaster', false);
  const [openKertasKerja, setOpenKertasKerja] = usePersistentState('sidebar_openKertasKerja', false);
  const [openUserMgmt, setOpenUserMgmt] = usePersistentState('sidebar_openUserMgmt', false);
  const [openPayroll, setOpenPayroll] = usePersistentState('sidebar_openPayroll', false);
  const [openPph21, setOpenPph21] = usePersistentState('sidebar_openPph21', false);
  const [openBuktiPotong, setOpenBuktiPotong] = usePersistentState('sidebar_openBuktiPotong', false);
  const [openLembur, setOpenLembur] = usePersistentState('sidebar_openLembur', false);
  const [openPinjaman, setOpenPinjaman] = usePersistentState('sidebar_openPinjaman', false);
  const [openKompensasi, setOpenKompensasi] = usePersistentState('sidebar_openKompensasi', false);
  const [openReport, setOpenReport] = usePersistentState('sidebar_openReport', false);
  const [openSetting, setOpenSetting] = usePersistentState('sidebar_openSetting', false);

  const [collapsed, setCollapsed] = usePersistentState('sidebar_collapsed', true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Dark / Day Mode context
  const { mode, toggleColorMode } = useColorMode();

  // Notifications State & Handlers
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Payroll Periode Berjalan',
      desc: 'Data payroll periode ini telah siap untuk dikalkulasi dan diproses.',
      time: '10 menit yang lalu',
      unread: true,
      type: 'success',
    },
    {
      id: 2,
      title: '3 Approval Pengajuan Menunggu',
      desc: 'Terdapat 3 pengajuan slip/gaji yang menunggu persetujuan PIC & Manager.',
      time: '1 jam yang lalu',
      unread: true,
      type: 'warning',
    },
    {
      id: 3,
      title: 'Data Master Diperbarui',
      desc: 'Konfigurasi Master UMK, PTKP, dan TER 2026 berhasil diperbarui.',
      time: '3 jam yang lalu',
      unread: false,
      type: 'info',
    },
    {
      id: 4,
      title: 'Sinkronisasi HRIS Otomatis',
      desc: 'Sinkronisasi data karyawan dari HRIS One DIKA berhasil diselesaikan.',
      time: '1 hari yang lalu',
      unread: false,
      type: 'info',
    },
  ]);

  const handleNotifOpen = (event) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Flyout popover state for collapsed sidebar
  const [flyoutAnchor, setFlyoutAnchor] = useState(null);
  const [flyoutItem, setFlyoutItem] = useState(null);
  const flyoutTimeout = useRef(null);

  const handleProfileMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleFlyoutOpen = (event, item) => {
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
    setFlyoutAnchor(event.currentTarget);
    setFlyoutItem(item);
  };

  const handleFlyoutClose = () => {
    flyoutTimeout.current = setTimeout(() => {
      setFlyoutAnchor(null);
      setFlyoutItem(null);
    }, 150);
  };

  const handleFlyoutEnter = () => {
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
  };

  const menuItems = [
    { key: 'DASHBOARD', text: 'Dashboard', icon: <DashboardIcon />, path: '/', allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'SPV', 'HR', 'FINANCE', 'STAFF'] },
    {
      key: 'USER_MANAGEMENT',
      text: 'USER MANAGEMENT',
      icon: <UserManagementIcon />,
      isSub: true,
      open: openUserMgmt,
      setOpen: setOpenUserMgmt,
      allowedPositions: ['IT', 'ADMIN', 'SUPERVISOR'],
      children: [
        { key: 'USER_MANAGEMENT_USER', text: 'USER', path: '/user-management/user', icon: <UserIcon /> },
        { key: 'USER_MANAGEMENT_ROLE_PRIVILEGE', text: 'ROLE PRIVILEGE', path: '/user-management/role-management', icon: <RolePrivilegeIcon /> },
      ]
    },
    {
      key: 'MASTER',
      text: 'MASTER',
      icon: <MasterIcon />,
      isSub: true,
      open: openMaster,
      setOpen: setOpenMaster,
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { key: 'MASTER_UMK', text: 'MASTER UMK', path: '/master/umk', icon: <UmkIcon /> },
        { key: 'MASTER_UPAH', text: 'MASTER UPAH', path: '/master/upah', icon: <UpahIcon /> },
        { key: 'MASTER_UNIT_KERJA_PENEMPATAN', text: 'MASTER UNIT KERJA PENEMPATAN', path: '/master/unit-kerja-penempatan', icon: <UnitKerjaIcon /> },
        { key: 'MASTER_POSISI', text: 'MASTER POSISI', path: '/master/posisi', icon: <PosisiIcon /> },
        { key: 'MASTER_TER', text: 'MASTER TER', path: '/master/ter', icon: <TerIcon /> },
        { key: 'MASTER_PTKP', text: 'MASTER PTKP', path: '/master/ptkp', icon: <PtkpIcon /> },
        { key: 'MASTER_PKP', text: 'MASTER PKP', path: '/master/pkp', icon: <PkpIcon /> },
        { key: 'MASTER_EMPLOYEE', text: 'MASTER EMPLOYEE', path: '/master/employee', icon: <EmployeeIcon /> },
        { key: 'MASTER_CLIENT', text: 'MASTER CLIENT', path: '/master/client', icon: <ClientIcon /> },
        { key: 'MASTER_PIC_PROJECT', text: 'MASTER PIC PROJECT', path: '/master/picproject', icon: <PicProjectIcon />, allowedPositions: ['IT', 'SUPERVISOR', 'SPV'] },
        { key: 'MASTER_UANG_KOMPENSASI', text: 'MASTER UANG KOMPENSASI', path: '/master/pic-uk', icon: <LocalAtmIcon />, allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'] },
        { key: 'MASTER_LIBUR', text: 'MASTER LIBUR', path: '/master/libur', icon: <LiburIcon /> },
        { key: 'MASTER_SWIFT_CODE', text: 'MASTER SWIFT CODE', path: '/master/swift', icon: <SwiftIcon />, allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'] },
        { key: 'MASTER_HOLD', text: 'MASTER HOLD', path: '/master/hold', icon: <HoldIcon />, allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'] },
        { key: 'MASTER_SETTING_ASSIGN', text: 'SETTING ASSIGN', path: '/master/setting-assign', icon: <SettingIcon /> },
        { key: 'MASTER_TUNJANGAN_INSENTIF', text: 'TUNJANGAN & INSENTIF CONFIG', path: '/master/tunjangan-insentif', icon: <MasterSettingIcon /> },
      ]
    },
    {
      key: 'KERTAS_KERJA',
      text: 'KERTAS KERJA',
      icon: <KertasKerjaIcon />,
      isSub: true,
      open: openKertasKerja,
      setOpen: setOpenKertasKerja,
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { key: 'KERTAS_KERJA_RETRIEVE', text: 'RETRIEVE KERTAS KERJA JASA', path: '/kertas-kerja/retrieve', icon: <RetrieveIcon /> },
        { key: 'KERTAS_KERJA_JASA', text: 'KK JASA', path: '/kertas-kerja/jasa', icon: <KkJasaIcon /> },
      ]
    },
    {
      key: 'PAYROLL',
      text: 'PAYROLL',
      icon: <PayrollIcon />,
      isSub: true,
      open: openPayroll,
      setOpen: setOpenPayroll,
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { key: 'PAYROLL_RETRIEVE', text: 'RETRIEVE DATA', path: '/payroll/retrieve', icon: <RetrieveIcon />, allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'] },
        { key: 'PAYROLL_PROSES', text: 'PROSES PAYROLL', path: '/payroll/proses', icon: <ProsesIcon /> },
        { key: 'PAYROLL_PPH', text: 'PROSES PPH', path: '/payroll/pph', icon: <CalculateIcon /> },
      ]
    },
    {
      key: 'PPH21',
      text: 'PPH21',
      icon: <ReportIcon />,
      isSub: true,
      open: openPph21,
      setOpen: setOpenPph21,
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { key: 'PPH21_LIST', text: 'DATALIST PPH21', path: '/pph21/list', icon: <ListIcon /> },
        { key: 'PPH21_SLIP', text: 'SLIP GAJI', path: '/pph21/slip', icon: <SlipIcon /> },
        { key: 'PPH21_SIMULASI', text: 'SIMULASI PPH21', path: '/pph21/simulasi', icon: <SimulasiIcon /> },
        { key: 'PPH21_SUMMARY', text: 'SUMMARY PPH21', path: '/pph21/summary', icon: <SummaryIcon /> },
      ]
    },
    {
      key: 'BUKTI_PEMOTONGAN',
      text: 'BUKTI PEMOTONGAN',
      icon: <ReceiptIcon />,
      isSub: true,
      open: openBuktiPotong,
      setOpen: setOpenBuktiPotong,
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { key: 'BUKTI_PEMOTONGAN_A1', text: 'BUKTI POTONG A1', path: '/bukti-potong/a1', icon: <BupotA1Icon /> },
        { key: 'BUKTI_PEMOTONGAN_21_PAYROLL', text: 'BUKTI POTONG 21 PAYROLL', path: '/bukti-potong/21-payroll', icon: <Bupot21Icon /> },
        { key: 'BUKTI_PEMOTONGAN_26_PAYROLL', text: 'BUKTI POTONG 26 PAYROLL', path: '/bukti-potong/26-payroll', icon: <Bupot26Icon /> },
        { key: 'BUKTI_PEMOTONGAN_21_UK', text: 'BUKTI POTONG 21 KOMPENSASI', path: '/bukti-potong/21-uk', icon: <BupotKompIcon /> },
      ]
    },
    {
      key: 'LEMBUR',
      text: 'LEMBUR',
      icon: <LemburIcon />,
      isSub: true,
      open: openLembur,
      setOpen: setOpenLembur,
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { key: 'LEMBUR_ENTRY', text: 'ENTRY LEMBUR', path: '/lembur/entry', icon: <EntryIcon /> },
      ]
    },
    {
      key: 'PINJAMAN',
      text: 'PINJAMAN',
      icon: <PinjamanIcon />,
      isSub: true,
      open: openPinjaman,
      setOpen: setOpenPinjaman,
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { key: 'PINJAMAN_ENTRY', text: 'ENTRY PINJAMAN', path: '/pinjaman/entry', icon: <EntryIcon /> },
      ]
    },
    {
      key: 'UANG_KOMPENSASI',
      text: 'UANG KOMPENSASI',
      icon: <LocalAtmIcon />,
      isSub: true,
      open: openKompensasi,
      setOpen: setOpenKompensasi,
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { key: 'KOMPENSASI_RETRIEVE', text: 'RETRIEVE DATA', path: '/kompensasi/retrieve', icon: <RetrieveIcon /> },
        { key: 'KOMPENSASI_UPLOAD', text: 'UPLOAD DATA', path: '/kompensasi/upload', icon: <UploadIcon /> },
        { key: 'KOMPENSASI_UPLOAD_CADANGAN', text: 'UPLOAD CADANGAN', path: '/kompensasi/upload-cadangan', icon: <BackupIcon /> },
        { key: 'KOMPENSASI_SLIP', text: 'SLIP KOMPENSASI', path: '/kompensasi/slip', icon: <SlipKompIcon /> },
      ]
    },
    {
      key: 'REPORT',
      text: 'REPORT',
      icon: <ReportIcon />,
      isSub: true,
      open: openReport,
      setOpen: setOpenReport,
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { key: 'REPORT_BPJS', text: 'REPORT BPJS', path: '/report/bpjs', icon: <ReportBpjsIcon /> },
        { key: 'REPORT_REKAP_PPH21', text: 'REKAP PPH21', path: '/report/rekap-pph21', icon: <RekapIcon /> },
        { key: 'REPORT_BUPOT_21', text: 'REPORT BUKTI POTONG PPH21', path: '/report/bupot-21', icon: <ReportBupotIcon /> },
        { key: 'REPORT_BUPOT_A1', text: 'REPORT BUKTI POTONG PPH21 A1', path: '/report/bupot-a1', icon: <BupotA1Icon /> },
        { key: 'REPORT_BUPOT_26', text: 'REPORT BUKTI POTONG PPH26', path: '/report/bupot-26', icon: <Bupot26Icon /> },
        { key: 'REPORT_BUPOT_KOMPENSASI', text: 'REPORT BUKTI POTONG UANG KOMPENSASI', path: '/report/bupot-kompensasi', icon: <BupotKompIcon /> },
        { key: 'REPORT_UBAH_UPAH', text: 'REPORT PERUBAHAN UPAH TENAGA KERJA', path: '/report/ubah-upah', icon: <UbahUpahIcon /> },
        { key: 'REPORT_IURAN_BPJS', text: 'REPORT IURAN BPJS TENAGA KERJA', path: '/report/iuran-bpjs', icon: <IuranIcon /> },
        { key: 'REPORT_TK_MASUK', text: 'REPORT DAFTAR TENAGA KERJA MASUK', path: '/report/tk-masuk', icon: <TkMasukIcon /> },
        { key: 'REPORT_TK_KELUAR', text: 'REPORT DAFTAR TENAGA KERJA KELUAR', path: '/report/tk-keluar', icon: <TkKeluarIcon /> },
      ]
    },
    {
      key: 'SETTING',
      text: 'SETTING',
      icon: <SettingIcon />,
      isSub: true,
      open: openSetting,
      setOpen: setOpenSetting,
      allowedPositions: ['IT', 'ADMIN', 'MANAJER', 'MANAGER', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { key: 'SETTING_CHANGE_PASSWORD', text: 'CHANGE PASSWORD', path: '/setting/change-password', icon: <ChangePasswordIcon /> },
        { key: 'SETTING_TOGGLE_PROJECT', text: 'BUKA/TUTUP PROJECT', path: '/setting/toggle-project', icon: <ToggleProjectIcon />, allowedPositions: ['IT', 'SUPERVISOR', 'SPV'] },
      ]
    }
  ];

  const [allowedKeys, setAllowedKeys] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const pos = user?.position || '';
        if (pos && token) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8085'}/api/roles/permissions/by-position?position=${encodeURIComponent(pos)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const keys = res.data.filter(p => p.canAccess).map(p => p.menuKey);
          setAllowedKeys(keys);
          dispatch(setPermissions(keys));
        }
      } catch (err) {
        console.error('Failed to fetch dynamic permissions', err);
      }
    };
    if (user?.position) {
      fetchPermissions();
    }
  }, [user?.position, dispatch]);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/master/')) setOpenMaster(true);
    else if (path.startsWith('/kertas-kerja/')) setOpenKertasKerja(true);
    else if (path.startsWith('/user-management/')) setOpenUserMgmt(true);
    else if (path.startsWith('/payroll/')) setOpenPayroll(true);
    else if (path.startsWith('/pph21/')) setOpenPph21(true);
    else if (path.startsWith('/bukti-potong/')) setOpenBuktiPotong(true);
    else if (path.startsWith('/lembur/')) setOpenLembur(true);
    else if (path.startsWith('/pinjaman/')) setOpenPinjaman(true);
    else if (path.startsWith('/kompensasi/')) setOpenKompensasi(true);
    else if (path.startsWith('/report/')) setOpenReport(true);
    else if (path.startsWith('/setting/')) setOpenSetting(true);
  }, []);

  const activePermissions = permissions && permissions.length > 0 ? permissions : allowedKeys;

  const filteredMenuItems = menuItems.map(item => {
    const userPriv2 = user?.privilage?.toUpperCase()?.trim() || user?.privilege?.toUpperCase()?.trim() || '';
    const userPos2 = user?.position?.toUpperCase()?.trim() || '';
    const isSuperAdminOrIT = userPriv2 === 'ADMIN' || userPriv2 === 'SUPER_ADMIN' || userPos2 === 'IT' || userPos2 === 'SUPER_ADMIN' || userPos2 === 'ADMIN';
    let newItem = { ...item };

    if (item.text === 'SETTING') newItem = { ...item, open: openSetting, setOpen: setOpenSetting };
    else if (item.text === 'MASTER') newItem = { ...item, open: openMaster, setOpen: setOpenMaster };
    else if (item.text === 'USER MANAGEMENT') newItem = { ...item, open: openUserMgmt, setOpen: setOpenUserMgmt };
    else if (item.text === 'KERTAS KERJA') newItem = { ...item, open: openKertasKerja, setOpen: setOpenKertasKerja };
    else if (item.text === 'PAYROLL') newItem = { ...item, open: openPayroll, setOpen: setOpenPayroll };
    else if (item.text === 'PPH21') newItem = { ...item, open: openPph21, setOpen: setOpenPph21 };
    else if (item.text === 'BUKTI PEMOTONGAN') newItem = { ...item, open: openBuktiPotong, setOpen: setOpenBuktiPotong };
    else if (item.text === 'LEMBUR') newItem = { ...item, open: openLembur, setOpen: setOpenLembur };
    else if (item.text === 'PINJAMAN') newItem = { ...item, open: openPinjaman, setOpen: setOpenPinjaman };
    else if (item.text === 'UANG KOMPENSASI') newItem = { ...item, open: openKompensasi, setOpen: setOpenKompensasi };
    else if (item.text === 'REPORT') newItem = { ...item, open: openReport, setOpen: setOpenReport };

    if (newItem.children) {
      newItem.children = newItem.children.filter(child => {
        // Admin privilege users always see ROLE PRIVILEGE (to prevent lockout)
        if (isSuperAdminOrIT && child.key === 'USER_MANAGEMENT_ROLE_PRIVILEGE') {
          return true;
        }

        // If activePermissions loaded, check dynamic permissions
        if (activePermissions !== null && activePermissions !== undefined && activePermissions.length > 0) {
          return activePermissions.includes(child.key);
        }
        if (!child.allowedPositions) return true;
        return child.allowedPositions.some(pos => userPos2.includes(pos.toUpperCase().trim()));
      });
    }
    return newItem;
  }).filter(item => {
    const userPriv = user?.privilage?.toUpperCase()?.trim() || user?.privilege?.toUpperCase()?.trim() || '';
    const userPos = user?.position?.toUpperCase()?.trim() || '';
    const isSuperAdminOrIT = userPriv === 'ADMIN' || userPriv === 'SUPER_ADMIN' || userPos === 'IT' || userPos === 'SUPER_ADMIN' || userPos === 'ADMIN';

    // If dynamic permissions loaded, filter based on active permissions
    if (activePermissions !== null && activePermissions !== undefined && activePermissions.length > 0) {
      // Super admin / admin always keeps USER_MANAGEMENT to prevent lockout
      if (isSuperAdminOrIT && item.key === 'USER_MANAGEMENT') {
        return true;
      }
      // If item has children, it MUST only be shown IF it has at least 1 allowed child
      if (item.children) {
        return item.children.length > 0;
      }
      return activePermissions.includes(item.key);
    }

    // Fallback when dynamic permissions not yet loaded
    if (isSuperAdminOrIT) {
      if (item.children) {
        return item.children.length > 0;
      }
      return true;
    }
    if (item.children) {
      return item.children.length > 0;
    }
    if (!item.allowedPositions || item.allowedPositions.length === 0) return true;
    return item.allowedPositions.some(pos => userPos.includes(pos.toUpperCase().trim()));
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const isActive = (path) => location.pathname === path;

  const itemStyle = (active) => ({
    py: 0.75,
    my: 0.25,
    minHeight: 40,
    borderRadius: '10px',
    bgcolor: active ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
    color: active ? '#4f46e5' : '#64748b',
    '&:hover': {
      bgcolor: 'rgba(79, 70, 229, 0.04)',
      color: '#4f46e5'
    }
  });

  const renderDrawerContent = () => (
    <Box sx={{ overflowX: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" onClick={toggleSidebar} sx={{ cursor: 'pointer' }}>
          <img src="/favicon.svg" alt="PayPro Logo" style={{ width: 32, height: 32 }} />
          {!collapsed && (
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'text.primary', fontFamily: "'Outfit', sans-serif" }}>
              PayPro
            </Typography>
          )}
        </Stack>
      </Toolbar>
      
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, py: 1, px: collapsed ? 1 : 1.5 }}>
        <List sx={{ px: 0 }}>
          {filteredMenuItems.map((item, index) => {
            const isItemActive = isActive(item.path) || (item.children && item.children.some(child => isActive(child.path)));
            return (
              <React.Fragment key={item.text}>
                {index > 0 && index % 3 === 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.5, letterSpacing: '3px', fontSize: '0.65rem', fontWeight: 900 }}>...</Typography>
                  </Box>
                )}
                {item.isSub ? (
                  <>
                    <ListItemButton
                      onClick={(e) => {
                        if (collapsed) {
                          handleFlyoutOpen(e, item);
                        } else {
                          item.setOpen(!item.open);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (collapsed) handleFlyoutOpen(e, item);
                      }}
                      onMouseLeave={() => {
                        if (collapsed) handleFlyoutClose();
                      }}
                      sx={{ 
                        justifyContent: collapsed ? 'center' : 'initial',
                        px: collapsed ? 0 : 2,
                        ...itemStyle(isItemActive)
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, justifyContent: 'center', color: isItemActive ? '#4f46e5' : 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      {!collapsed && (
                        <ListItemText
                          primary={
                            <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: isItemActive ? '#4f46e5' : 'text.primary' }}>
                              {item.text}
                            </Typography>
                          }
                        />
                      )}
                      {!collapsed && (item.open ? <ExpandLess sx={{ fontSize: '1.1rem', color: 'text.secondary' }} /> : <ExpandMore sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />)}
                    </ListItemButton>

                    <Collapse in={item.open && !collapsed} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding sx={{ my: 0.5 }}>
                        {item.children.map((sub) => (
                          <ListItemButton
                            key={sub.text}
                            onClick={() => navigate(sub.path)}
                            sx={{ 
                              pl: 2.5,
                              pr: 2,
                              ...itemStyle(isActive(sub.path))
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 30, color: isActive(sub.path) ? '#4f46e5' : 'text.secondary' }}>
                              {sub.icon || item.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography sx={{ fontSize: '0.72rem', fontWeight: isActive(sub.path) ? 700 : 500 }}>
                                  {sub.text}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{ 
                      justifyContent: collapsed ? 'center' : 'initial',
                      px: collapsed ? 0 : 2,
                      ...itemStyle(isActive(item.path))
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, justifyContent: 'center', color: isActive(item.path) ? '#4f46e5' : 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={
                          <Typography sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
                            {item.text}
                          </Typography>
                        }
                      />
                    )}
                  </ListItemButton>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { md: `calc(100% - ${collapsed ? 72 : drawerWidth}px)` },
          ml: { md: `${collapsed ? 72 : drawerWidth}px` },
          background: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          transition: theme.transitions.create(['width', 'margin', 'background-color'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={toggleSidebar} 
              edge="start" 
              color="inherit"
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px', 
                p: 0.75,
                color: 'text.secondary',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Day / Dark Mode Switcher */}
            <Tooltip title={mode === 'dark' ? 'Beralih ke Day Mode' : 'Beralih ke Dark Mode'}>
              <IconButton 
                onClick={toggleColorMode} 
                size="small" 
                sx={{ 
                  color: mode === 'dark' ? '#fbbf24' : '#64748b',
                  p: 0.8,
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                {mode === 'dark' ? <SunIcon fontSize="small" /> : <MoonIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            {/* Notification Bell with Badge & Dropdown */}
            <Tooltip title="Notifikasi">
              <IconButton 
                onClick={handleNotifOpen} 
                size="small" 
                sx={{ 
                  color: Boolean(notifAnchor) ? '#4f46e5' : '#64748b', 
                  p: 0.8,
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Badge badgeContent={unreadCount} color="error" variant="dot">
                  <BellIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Notification Popover */}
            <Popover
              open={Boolean(notifAnchor)}
              anchorEl={notifAnchor}
              onClose={handleNotifClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1.5,
                    width: 360,
                    maxWidth: '90vw',
                    borderRadius: '12px',
                    boxShadow: mode === 'dark' ? '0 10px 30px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    overflow: 'hidden'
                  }
                }
              }}
            >
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'text.primary' }}>
                    Notifikasi
                  </Typography>
                  {unreadCount > 0 && (
                    <Chip label={`${unreadCount} Baru`} size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                  )}
                </Stack>
                {unreadCount > 0 && (
                  <Button 
                    size="small" 
                    startIcon={<DoneAllIcon sx={{ fontSize: 14 }} />} 
                    onClick={handleMarkAllRead}
                    sx={{ fontSize: '0.7rem', textTransform: 'none', py: 0.25, px: 1 }}
                  >
                    Tandai dibaca
                  </Button>
                )}
              </Box>

              <List sx={{ p: 0, maxHeight: 340, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tidak ada notifikasi baru</Typography>
                  </Box>
                ) : (
                  notifications.map((n, idx) => (
                    <React.Fragment key={n.id}>
                      <ListItemButton
                        sx={{
                          py: 1.5,
                          px: 2,
                          alignItems: 'flex-start',
                          bgcolor: n.unread ? (mode === 'dark' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)') : 'transparent',
                          '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc' }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, mt: 0.3 }}>
                          {n.type === 'success' && <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />}
                          {n.type === 'warning' && <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 20 }} />}
                          {n.type === 'info' && <InfoOutlinedIcon sx={{ color: '#3b82f6', fontSize: 20 }} />}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: n.unread ? 700 : 500, fontSize: '0.8rem', color: 'text.primary' }}>
                                {n.title}
                              </Typography>
                              {n.unread && <CircleIcon sx={{ fontSize: 8, color: '#6366f1' }} />}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 0.3 }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.73rem', lineHeight: 1.3 }}>
                                {n.desc}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.7, fontSize: '0.68rem', mt: 0.5, display: 'inline-block' }}>
                                {n.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                      {idx < notifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                )}
              </List>

              <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider', bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.2)' : '#f8fafc' }}>
                <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: '0.73rem', '&:hover': { textDecoration: 'underline' } }} onClick={handleNotifClose}>
                  Tutup Notifikasi
                </Typography>
              </Box>
            </Popover>

            <Divider orientation="vertical" flexItem sx={{ my: 1.5, borderColor: 'divider' }} />

            {/* Profile Avatar & Name */}
            <Stack direction="row" spacing={1.5} alignItems="center" onClick={handleProfileMenu} sx={{ cursor: 'pointer', p: 0.5, borderRadius: '8px', '&:hover': { bgcolor: 'action.hover' } }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#6366f1', fontSize: '13px', border: '2px solid', borderColor: 'divider' }}>
                {(user?.fullName || user?.username || 'AD').substring(0, 2).toUpperCase()}
              </Avatar>
              <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem', lineHeight: 1.2 }}>
                  {user?.fullName || user?.username || 'Guest'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.7rem' }}>
                  {user?.position || 'No Position'}
                </Typography>
              </Box>
            </Stack>

            {/* Profile Menu Dropdown with App Version */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: mode === 'dark' ? 'drop-shadow(0px 4px 16px rgba(0,0,0,0.5))' : 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                    mt: 1.5,
                    borderRadius: '12px',
                    minWidth: '200px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  },
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.82rem' }}>
                  {user?.fullName || user?.username || 'Guest'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
                  {user?.position || 'User'}
                </Typography>
              </Box>
              <MenuItem onClick={handleCloseMenu} sx={{ py: 1, fontSize: '0.8rem' }}>Profile</MenuItem>
              <MenuItem onClick={handleCloseMenu} sx={{ py: 1, fontSize: '0.8rem' }}>Settings</MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1, fontSize: '0.8rem' }}>
                <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                Logout
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              {/* Application Version */}
              <Box sx={{ px: 2, py: 1, textAlign: 'center', bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.3px' }}>
                  PayPro v1.0.0
                </Typography>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            },
          }}
        >
          {renderDrawerContent()}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: collapsed ? 72 : drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: collapsed ? 72 : drawerWidth, 
              boxSizing: 'border-box',
              overflowX: 'hidden',
              overflowY: collapsed ? 'visible' : 'auto',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {renderDrawerContent()}
        </Drawer>
      )}

      {/* Flyout Popover for collapsed sidebar sub-menus */}
      <Popover
        open={Boolean(flyoutAnchor) && Boolean(flyoutItem) && collapsed}
        anchorEl={flyoutAnchor}
        onClose={() => { setFlyoutAnchor(null); setFlyoutItem(null); }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableRestoreFocus
        sx={{ pointerEvents: 'none' }}
        slotProps={{
          paper: {
            sx: {
              pointerEvents: 'auto',
              borderRadius: '12px',
              boxShadow: mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              ml: 1,
              minWidth: 220,
              maxHeight: 400,
              overflowY: 'auto',
            },
            onMouseEnter: handleFlyoutEnter,
            onMouseLeave: handleFlyoutClose,
          }
        }}
      >
        {flyoutItem && (
          <Box sx={{ py: 1 }}>
            <Typography variant="caption" sx={{ px: 2, py: 0.75, fontWeight: 800, color: 'text.primary', fontSize: '0.75rem', display: 'block', borderBottom: '1px solid', borderColor: 'divider', mb: 0.5 }}>
              {flyoutItem.text}
            </Typography>
            <List dense disablePadding>
              {flyoutItem.children?.map((sub) => (
                <ListItemButton
                  key={sub.text}
                  onClick={() => {
                    navigate(sub.path);
                    setFlyoutAnchor(null);
                    setFlyoutItem(null);
                  }}
                  sx={{
                    px: 2,
                    py: 0.6,
                    minHeight: 36,
                    bgcolor: isActive(sub.path) ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                    color: isActive(sub.path) ? '#4f46e5' : 'text.primary',
                    '&:hover': {
                      bgcolor: 'rgba(79, 70, 229, 0.04)',
                      color: '#4f46e5'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 28, color: isActive(sub.path) ? '#4f46e5' : 'text.secondary' }}>
                    {React.cloneElement(sub.icon || flyoutItem.icon, { sx: { fontSize: 18 } })}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: isActive(sub.path) ? 700 : 500 }}>
                        {sub.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}
      </Popover>

      <Box
        component="main"
        sx={{
          flex: '1 1 0%',
          p: 0,
          minHeight: '100vh',
          backgroundColor: 'background.default',
          color: 'text.primary',
          overflowX: 'hidden',
          minWidth: 0,
          transition: theme.transitions.create(['width', 'margin-left', 'background-color'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2, width: '100%', maxWidth: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;