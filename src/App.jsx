import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Forbidden from './pages/Forbidden';
import Dashboard from './pages/Dashboard/Dashboard';
import MasterEmployee from './pages/Master/MasterEmployee';
import UserList from './pages/UserManagement/UserList';
import RoleManagement from './pages/UserManagement/RoleManagement';
import MasterUmk from './pages/Master/MasterUmk';
import MasterUpah from './pages/Master/MasterUpah';
import MasterUnitKerjaPenempatan from './pages/Master/MasterUnitKerjaPenempatan';
import MasterPosisi from './pages/Master/MasterPosisi';
import MasterTer from './pages/Master/MasterTer';
import MasterPtkp from './pages/Master/MasterPtkp';
import MasterPkp from './pages/Master/MasterPkp';
import MasterClient from './pages/Master/MasterClient';
import MasterPicUk from './pages/Master/MasterPicUk';
import MasterPicProject from './pages/Master/MasterPicProject';
import MasterLibur from './pages/Master/MasterLibur';
import MasterSwiftCode from './pages/Master/MasterSwiftCode';
import MasterHold from './pages/Master/MasterHold';
import MasterSettingAssign from './pages/Master/MasterSettingAssign';
import MasterTunjanganInsentif from './pages/Master/MasterTunjanganInsentif';
import RetrieveKertasKerjaJasa from './pages/KertasKerja/RetrieveKertasKerjaJasa';
import KkJasa from './pages/KertasKerja/KkJasa';
import Login from './pages/Login';
import ProsesPayroll from './pages/Payroll/ProsesPayroll';
import ProsesPph from './pages/Payroll/ProsesPph';
import RetrieveData from './pages/Payroll/RetrieveData';
import Pph21List from './pages/Pph21/Pph21List';
import SlipGaji from './pages/Pph21/SlipGaji';
import SimulasiPph from './pages/Pph21/SimulasiPph';
import SummaryPph from './pages/Pph21/SummaryPph';
import BuktiPotongA1 from './pages/BuktiPotong/BuktiPotongA1';
import BuktiPotongPasal21Payroll from './pages/BuktiPotong/BuktiPotongPasal21Payroll';
import BuktiPotongPasal26 from './pages/BuktiPotong/BuktiPotongPasal26';
import BuktiPotongPasal21Kompensasi from './pages/BuktiPotong/BuktiPotongPasal21Kompensasi';
import LemburEntry from './pages/Lembur/LemburEntry';
import PinjamanEntry from './pages/Pinjaman/PinjamanEntry';
import RetrieveKompensasi from './pages/Kompensasi/RetrieveKompensasi';
import UploadKompensasi from './pages/Kompensasi/UploadKompensasi';
import UploadCadangan from './pages/Kompensasi/UploadCadangan';
import SlipKompensasi from './pages/Kompensasi/SlipKompensasi';
import ReportBpjs from './pages/Report/ReportBpjs';
import ReportPph from './pages/Report/ReportPph';
import ReportBupot21 from './pages/Report/ReportBupot21';
import ReportBupotA1 from './pages/Report/ReportBupotA1';
import ReportBupot26 from './pages/Report/ReportBupot26';
import ReportBupotUk from './pages/Report/ReportBupotUk';
import ReportUbahUpah from './pages/Report/ReportUbahUpah';
import ReportIuranBpjs from './pages/Report/ReportIuranBpjs';
import ReportTkMasuk from './pages/Report/ReportTkMasuk';
import ReportTkKeluar from './pages/Report/ReportTkKeluar';
import { Typography } from '@mui/material';

const ProtectedRoute = ({ children, permission }) => {
  const { isAuthenticated, user, permissions, isPermissionsLoaded } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If permissions are still in transit (not yet loaded from API), wait before showing Forbidden
  if (permission && !isPermissionsLoaded && (!permissions || permissions.length === 0)) {
    return <Layout>{children}</Layout>;
  }

  const priv = user?.privilage?.toUpperCase()?.trim() || user?.privilege?.toUpperCase()?.trim() || '';
  // Only allow admin bypass strictly for the Role Privilege setting page to prevent permanent lockout
  const isSuperAccessToRolePrivilege = (priv === 'ADMIN' || user?.position?.toUpperCase() === 'IT') && permission === 'USER_MANAGEMENT_ROLE_PRIVILEGE';

  if (permission && !isSuperAccessToRolePrivilege) {
    const userPerms = Array.isArray(permissions) ? permissions : (user?.permissions || []);
    // If user does not have this permission key, block and show 403 Forbidden
    if (isPermissionsLoaded && !userPerms.includes(permission)) {
      return (
        <Layout>
          <Forbidden permissionRequired={permission} />
        </Layout>
      );
    }
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute permission="DASHBOARD"><Dashboard /></ProtectedRoute>} />

        {/* User Management */}
        <Route path="/user-management/user" element={<ProtectedRoute permission="USER_MANAGEMENT_USER"><UserList /></ProtectedRoute>} />
        <Route path="/user-management/role-management" element={<ProtectedRoute permission="USER_MANAGEMENT_ROLE_PRIVILEGE"><RoleManagement /></ProtectedRoute>} />

        {/* Master */}
        <Route path="/master/umk" element={<ProtectedRoute permission="MASTER_UMK"><MasterUmk /></ProtectedRoute>} />
        <Route path="/master/upah" element={<ProtectedRoute permission="MASTER_UPAH"><MasterUpah /></ProtectedRoute>} />
        <Route path="/master/unit-kerja-penempatan" element={<ProtectedRoute permission="MASTER_UNIT_KERJA_PENEMPATAN"><MasterUnitKerjaPenempatan /></ProtectedRoute>} />
        <Route path="/master/posisi" element={<ProtectedRoute permission="MASTER_POSISI"><MasterPosisi /></ProtectedRoute>} />
        <Route path="/master/ter" element={<ProtectedRoute permission="MASTER_TER"><MasterTer /></ProtectedRoute>} />
        <Route path="/master/ptkp" element={<ProtectedRoute permission="MASTER_PTKP"><MasterPtkp /></ProtectedRoute>} />
        <Route path="/master/pkp" element={<ProtectedRoute permission="MASTER_PKP"><MasterPkp /></ProtectedRoute>} />
        <Route path="/master/employee" element={<ProtectedRoute permission="MASTER_EMPLOYEE"><MasterEmployee /></ProtectedRoute>} />
        <Route path="/master/client" element={<ProtectedRoute permission="MASTER_CLIENT"><MasterClient /></ProtectedRoute>} />
        <Route path="/master/pic-uk" element={<ProtectedRoute permission="MASTER_UANG_KOMPENSASI"><MasterPicUk /></ProtectedRoute>} />
        <Route path="/master/picproject" element={<ProtectedRoute permission="MASTER_PIC_PROJECT"><MasterPicProject /></ProtectedRoute>} />
        <Route path="/master/libur" element={<ProtectedRoute permission="MASTER_LIBUR"><MasterLibur /></ProtectedRoute>} />
        <Route path="/master/swift" element={<ProtectedRoute permission="MASTER_SWIFT_CODE"><MasterSwiftCode /></ProtectedRoute>} />
        <Route path="/master/hold" element={<ProtectedRoute permission="MASTER_HOLD"><MasterHold /></ProtectedRoute>} />
        <Route path="/master/setting-assign" element={<ProtectedRoute permission="MASTER_SETTING_ASSIGN"><MasterSettingAssign /></ProtectedRoute>} />
        <Route path="/master/tunjangan-insentif" element={<ProtectedRoute permission="MASTER_TUNJANGAN_INSENTIF"><MasterTunjanganInsentif /></ProtectedRoute>} />

        {/* Kertas Kerja */}
        <Route path="/kertas-kerja/retrieve" element={<ProtectedRoute permission="KERTAS_KERJA_RETRIEVE"><RetrieveKertasKerjaJasa /></ProtectedRoute>} />
        <Route path="/kertas-kerja/jasa" element={<ProtectedRoute permission="KERTAS_KERJA_JASA"><KkJasa /></ProtectedRoute>} />

        {/* Payroll */}
        <Route path="/payroll/retrieve" element={<ProtectedRoute permission="PAYROLL_RETRIEVE"><RetrieveData /></ProtectedRoute>} />
        <Route path="/payroll/proses" element={<ProtectedRoute permission="PAYROLL_PROSES"><ProsesPayroll /></ProtectedRoute>} />
        <Route path="/payroll/pph" element={<ProtectedRoute permission="PAYROLL_PPH"><ProsesPph /></ProtectedRoute>} />

        {/* PPH21 */}
        <Route path="/pph21/list" element={<ProtectedRoute permission="PPH21_LIST"><Pph21List /></ProtectedRoute>} />
        <Route path="/pph21/slip" element={<ProtectedRoute permission="PPH21_SLIP"><SlipGaji /></ProtectedRoute>} />
        <Route path="/pph21/simulasi" element={<ProtectedRoute permission="PPH21_SIMULASI"><SimulasiPph /></ProtectedRoute>} />
        <Route path="/pph21/summary" element={<ProtectedRoute permission="PPH21_SUMMARY"><SummaryPph /></ProtectedRoute>} />

        {/* Bukti Potong */}
        <Route path="/bukti-potong/a1" element={<ProtectedRoute permission="BUKTI_PEMOTONGAN_A1"><BuktiPotongA1 /></ProtectedRoute>} />
        <Route path="/bukti-potong/21-payroll" element={<ProtectedRoute permission="BUKTI_PEMOTONGAN_21_PAYROLL"><BuktiPotongPasal21Payroll /></ProtectedRoute>} />
        <Route path="/bukti-potong/26-payroll" element={<ProtectedRoute permission="BUKTI_PEMOTONGAN_26_PAYROLL"><BuktiPotongPasal26 /></ProtectedRoute>} />
        <Route path="/bukti-potong/21-uk" element={<ProtectedRoute permission="BUKTI_PEMOTONGAN_21_UK"><BuktiPotongPasal21Kompensasi /></ProtectedRoute>} />

        {/* Lembur & Pinjaman */}
        <Route path="/lembur/entry" element={<ProtectedRoute permission="LEMBUR_ENTRY"><LemburEntry /></ProtectedRoute>} />
        <Route path="/pinjaman/entry" element={<ProtectedRoute permission="PINJAMAN_ENTRY"><PinjamanEntry /></ProtectedRoute>} />

        {/* Kompensasi */}
        <Route path="/kompensasi/retrieve" element={<ProtectedRoute permission="KOMPENSASI_RETRIEVE"><RetrieveKompensasi /></ProtectedRoute>} />
        <Route path="/kompensasi/upload" element={<ProtectedRoute permission="KOMPENSASI_UPLOAD"><UploadKompensasi /></ProtectedRoute>} />
        <Route path="/kompensasi/upload-cadangan" element={<ProtectedRoute permission="KOMPENSASI_UPLOAD_CADANGAN"><UploadCadangan /></ProtectedRoute>} />
        <Route path="/kompensasi/slip" element={<ProtectedRoute permission="KOMPENSASI_SLIP"><SlipKompensasi /></ProtectedRoute>} />

        {/* Report */}
        <Route path="/report/bpjs" element={<ProtectedRoute permission="REPORT_BPJS"><ReportBpjs /></ProtectedRoute>} />
        <Route path="/report/rekap-pph21" element={<ProtectedRoute permission="REPORT_REKAP_PPH21"><ReportPph /></ProtectedRoute>} />
        <Route path="/report/bupot-21" element={<ProtectedRoute permission="REPORT_BUPOT_21"><ReportBupot21 /></ProtectedRoute>} />
        <Route path="/report/bupot-a1" element={<ProtectedRoute permission="REPORT_BUPOT_A1"><ReportBupotA1 /></ProtectedRoute>} />
        <Route path="/report/bupot-26" element={<ProtectedRoute permission="REPORT_BUPOT_26"><ReportBupot26 /></ProtectedRoute>} />
        <Route path="/report/bupot-kompensasi" element={<ProtectedRoute permission="REPORT_BUPOT_KOMPENSASI"><ReportBupotUk /></ProtectedRoute>} />
        <Route path="/report/ubah-upah" element={<ProtectedRoute permission="REPORT_UBAH_UPAH"><ReportUbahUpah /></ProtectedRoute>} />
        <Route path="/report/iuran-bpjs" element={<ProtectedRoute permission="REPORT_IURAN_BPJS"><ReportIuranBpjs /></ProtectedRoute>} />
        <Route path="/report/tk-masuk" element={<ProtectedRoute permission="REPORT_TK_MASUK"><ReportTkMasuk /></ProtectedRoute>} />
        <Route path="/report/tk-keluar" element={<ProtectedRoute permission="REPORT_TK_KELUAR"><ReportTkKeluar /></ProtectedRoute>} />

        {/* 403 / Fallback */}
        <Route path="/forbidden" element={<ProtectedRoute><Forbidden /></ProtectedRoute>} />
        <Route path="*" element={<ProtectedRoute><Typography variant="h5" sx={{ p: 4 }}>Module Under Development</Typography></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;