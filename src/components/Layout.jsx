import React, { useState } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Container, CssBaseline, Collapse,
  IconButton, Avatar, Menu, MenuItem, Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ExpandLess, ExpandMore,
  Settings as SettingIcon,
  Receipt as PayrollIcon,
  Assessment as ReportIcon,
  Person as EmployeeIcon,
  ManageAccounts as UserManagementIcon,
  LocalAtm as PinjamanIcon,
  WatchLater as LemburIcon,
  Logout as LogoutIcon,
  Storage as MasterIcon,
  ReceiptLong as ReceiptIcon,
  Group as UserIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
  const [openUserMgmt, setOpenUserMgmt] = usePersistentState('sidebar_openUserMgmt', false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'SPV', 'HR', 'FINANCE', 'STAFF'] },
    {
      text: 'USER MANAGEMENT',
      icon: <UserManagementIcon />,
      isSub: true,
      open: openUserMgmt,
      setOpen: setOpenUserMgmt,
      allowedPositions: ['IT', 'ADMIN', 'SUPERVISOR'],
      children: [
        { text: 'USER', path: '/user-management/user', icon: <UserIcon /> },
      ]
    },
    {
      text: 'MASTER',
      icon: <MasterIcon />,
      isSub: true,
      open: openMaster,
      setOpen: setOpenMaster,
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { text: 'MASTER UMK', path: '/master/umk' },
        { text: 'MASTER TER', path: '/master/ter' },
        { text: 'MASTER PTKP', path: '/master/ptkp' },
        { text: 'MASTER PKP', path: '/master/pkp' },
        { text: 'MASTER EMPLOYEE', path: '/master/employee', icon: <EmployeeIcon /> },
        { text: 'MASTER CLIENT', path: '/master/client' },
        { text: 'MASTER PIC PROJECT', path: '/master/picproject', allowedPositions: ['IT', 'SUPERVISOR', 'SPV'] },
        { text: 'MASTER UANG KOMPENSASI', path: '/master/pic-uk', allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'] },
        { text: 'MASTER LIBUR', path: '/master/libur' },
        { text: 'MASTER SWIFT CODE', path: '/master/swift', allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'] },
        { text: 'MASTER HOLD', path: '/master/hold', allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'] },
        { text: 'MASTER SETTING', path: '/master/setting' },
      ]
    },
    {
      text: 'PAYROLL',
      icon: <PayrollIcon />,
      isSub: true,
      open: false,
      setOpen: () => { },
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { text: 'RETRIEVE DATA', path: '/payroll/retrieve', allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'] },
        { text: 'PROSES PAYROLL', path: '/payroll/proses' },
        { text: 'PROSES PPH', path: '/payroll/pph' },
      ]
    },
    {
      text: 'PPH21',
      icon: <ReportIcon />,
      isSub: true,
      open: false,
      setOpen: () => { },
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { text: 'LIST', path: '/pph21/list' },
        { text: 'SLIP GAJI', path: '/pph21/slip' },
        { text: 'SIMULASI PPH', path: '/pph21/simulasi' },
        { text: 'SUMMARY PPH', path: '/pph21/summary' },
      ]
    },
    {
      text: 'BUKTI PEMOTONGAN',
      icon: <ReceiptIcon />,
      isSub: true,
      open: false,
      setOpen: () => { },
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { text: 'PASAL 21 A1', path: '/bukti-potong/a1' },
        { text: 'PASAL 21 PAYROLL', path: '/bukti-potong/21-payroll' },
        { text: 'PASAL 26 PAYROLL', path: '/bukti-potong/26-payroll' },
        { text: 'PASAL 21 UK', path: '/bukti-potong/21-uk' },
      ]
    },
    {
      text: 'LEMBUR',
      icon: <LemburIcon />,
      isSub: true,
      open: false,
      setOpen: () => { },
      allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { text: 'LEMBUR', path: '/lembur/entry' },
      ]
    },
    {
      text: 'PINJAMAN',
      icon: <PinjamanIcon />,
      isSub: true,
      open: false,
      setOpen: () => { },
      allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { text: 'PINJAMAN', path: '/pinjaman/entry' },
      ]
    },
    {
      text: 'UANG KOMPENSASI',
      icon: <LocalAtmIcon />,
      isSub: true,
      open: false,
      setOpen: () => { },
      allowedPositions: ['IT', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { text: 'RETRIEVE DATA UANG KOMPENSASI', path: '/kompensasi/retrieve' },
        { text: 'UPLOAD UANG KOMPENSASI', path: '/kompensasi/upload' },
        { text: 'UPLOAD UANG DICADANGKAN', path: '/kompensasi/upload-cadangan' },
        { text: 'SLIP UANG KOMPENSASI', path: '/kompensasi/slip' },
      ]
    },
    {
      text: 'REPORT',
      icon: <ReportIcon />,
      isSub: true,
      open: false,
      setOpen: () => { },
      allowedPositions: ['IT', 'MANAJER', 'MANAGER', 'HR', 'FINANCE', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { text: 'REPORT BPJS', path: '/report/bpjs' },
        { text: 'REKAP PPH21', path: '/report/rekap-pph21' },
        { text: 'REPORT BUKTI POTONG PPH21', path: '/report/bupot-21' },
        { text: 'REPORT BUKTI POTONG PPH21 A1', path: '/report/bupot-a1' },
        { text: 'REPORT BUKTI POTONG PPH26', path: '/report/bupot-26' },
        { text: 'REPORT BUKTI POTONG UANG KOMPENSASI', path: '/report/bupot-kompensasi' },
        { text: 'REPORT PERUBAHAN UPAH TENAGA KERJA', path: '/report/ubah-upah' },
        { text: 'REPORT IURAN BPJS TENAGA KERJA', path: '/report/iuran-bpjs' },
        { text: 'REPORT DAFTAR TENAGA KERJA MASUK', path: '/report/tk-masuk' },
        { text: 'REPORT DAFTAR TENAGA KERJA KELUAR', path: '/report/tk-keluar' },
      ]
    },
    {
      text: 'SETTING',
      icon: <SettingIcon />,
      isSub: true,
      open: false,
      setOpen: () => { },
      allowedPositions: ['IT', 'ADMIN', 'MANAJER', 'MANAGER', 'STAFF', 'SUPERVISOR', 'SPV'],
      children: [
        { text: 'CHANGE PASSWORD', path: '/setting/change-password' },
        { text: 'BUKA/TUTUP PROJECT', path: '/setting/toggle-project', allowedPositions: ['IT', 'SUPERVISOR', 'SPV'] },
      ]
    },
  ];

  // State tambahan untuk submenu baru
  const [openPayroll, setOpenPayroll] = usePersistentState('sidebar_openPayroll', false);
  const [openPph21, setOpenPph21] = usePersistentState('sidebar_openPph21', false);
  const [openBuktiPotong, setOpenBuktiPotong] = usePersistentState('sidebar_openBuktiPotong', false);
  const [openLembur, setOpenLembur] = usePersistentState('sidebar_openLembur', false);
  const [openPinjaman, setOpenPinjaman] = usePersistentState('sidebar_openPinjaman', false);
  const [openKompensasi, setOpenKompensasi] = usePersistentState('sidebar_openKompensasi', false);
  const [openReport, setOpenReport] = usePersistentState('sidebar_openReport', false);
  const [openSetting, setOpenSetting] = usePersistentState('sidebar_openSetting', false);

  // Auto-buka menu yang berisi halaman aktif saat ini
  React.useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/master/')) setOpenMaster(true);
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

  // Logic filter menu berdasarkan position & privilage
  const filteredMenuItems = menuItems.map(item => {
    const userPos = user?.position?.toUpperCase()?.trim() || '';

    // Sinkronisasi state buka/tutup submenu
    let newItem = { ...item };
    if (item.text === 'SETTING') newItem = { ...item, open: openSetting, setOpen: setOpenSetting };
    else if (item.text === 'PAYROLL') newItem = { ...item, open: openPayroll, setOpen: setOpenPayroll };
    else if (item.text === 'PPH21') newItem = { ...item, open: openPph21, setOpen: setOpenPph21 };
    else if (item.text === 'BUKTI PEMOTONGAN') newItem = { ...item, open: openBuktiPotong, setOpen: setOpenBuktiPotong };
    else if (item.text === 'LEMBUR') newItem = { ...item, open: openLembur, setOpen: setOpenLembur };
    else if (item.text === 'PINJAMAN') newItem = { ...item, open: openPinjaman, setOpen: setOpenPinjaman };
    else if (item.text === 'UANG KOMPENSASI') newItem = { ...item, open: openKompensasi, setOpen: setOpenKompensasi };
    else if (item.text === 'REPORT') newItem = { ...item, open: openReport, setOpen: setOpenReport };

    // Filter Children (Sub-menu) berdasarkan role jika ada batasan
    if (newItem.children) {
      newItem.children = newItem.children.filter(child => {
        if (!child.allowedPositions) return true;
        return child.allowedPositions.some(pos => userPos.includes(pos.toUpperCase().trim()));
      });
    }

    return newItem;
  }).filter(item => {
    const userPriv = user?.privilage?.toUpperCase()?.trim() || '';
    const userPos = user?.position?.toUpperCase()?.trim() || '';

    // Debug log untuk memastikan data yang terbaca
    console.log('User Auth Info:', { username: user?.username, position: userPos, privilage: userPriv });

    // ATURAN KHUSUS ADMIN (Berdasarkan PRIVILAGE)
    if (userPriv === 'ADMIN') {
      return item.text === 'USER MANAGEMENT' || item.text === 'SETTING';
    }

    // ATURAN UMUM (Berdasarkan POSITION)
    if (!item.allowedPositions || item.allowedPositions.length === 0) return true;

    return item.allowedPositions.some(pos => userPos.includes(pos.toUpperCase().trim()));
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e2e8f0',
          color: '#1e293b'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/favicon.svg" alt="PayPro Logo" style={{ width: 32, height: 32, marginRight: '12px' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
              PayPro
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                {user?.fullName || user?.username || 'Guest'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                {user?.position || 'No Position'}
              </Typography>
            </Box>
            <IconButton onClick={handleProfileMenu} sx={{ p: 0.5, border: '2px solid #e2e8f0' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#6366f1', fontSize: '14px' }}>
                {(user?.fullName || user?.username || 'AD').substring(0, 2).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  borderRadius: '12px',
                  minWidth: '180px',
                  '&:before': {
                    content: '""', display: 'block', position: 'absolute',
                    top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
                  },
                },
              }}
            >
              <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
              <MenuItem onClick={handleCloseMenu}>Settings</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', py: 2 }}>
          <List sx={{ px: 0 }}>
            {filteredMenuItems.map((item) => (
              <React.Fragment key={item.text}>
                {item.isSub ? (
                  <>
                    <ListItem
                      button
                      onClick={() => item.setOpen(!item.open)}
                      className="sidebar-item"
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.82rem', color: '#64748b' }}
                      />
                      {item.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={item.open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children.map((sub) => (
                          <ListItem
                            button
                            key={sub.text}
                            onClick={() => navigate(sub.path)}
                            className={`sidebar-item ${isActive(sub.path) ? 'active' : ''}`}
                            sx={{ pl: 6 }}
                          >
                            <ListItemText
                              primary={sub.text}
                              primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: isActive(sub.path) ? 600 : 400 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItem
                    button
                    onClick={() => navigate(item.path)}
                    className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.85rem' }}
                    />
                  </ListItem>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          overflowX: 'hidden',
          minWidth: 0
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ p: 0 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

// Simple proxy icons
const LocalAtmIcon = PinjamanIcon;

export default Layout;
