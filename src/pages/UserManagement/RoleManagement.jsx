import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
  Box,
  Stack
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setPermissions } from '../../store/slices/authSlice';
import DataTable from '../../components/Common/DataTable';

const MENU_STRUCTURE = [
  { key: 'DASHBOARD', label: 'DASHBOARD' },
  {
    key: 'USER_MANAGEMENT',
    label: 'USER MANAGEMENT',
    children: [
      { key: 'USER_MANAGEMENT_USER', label: 'USER' },
      { key: 'USER_MANAGEMENT_ROLE_PRIVILEGE', label: 'ROLE PRIVILEGE' }
    ]
  },
  {
    key: 'MASTER',
    label: 'MASTER',
    children: [
      { key: 'MASTER_UMK', label: 'MASTER UMK' },
      { key: 'MASTER_UPAH', label: 'MASTER UPAH' },
      { key: 'MASTER_UNIT_KERJA_PENEMPATAN', label: 'MASTER UNIT KERJA PENEMPATAN' },
      { key: 'MASTER_POSISI', label: 'MASTER POSISI' },
      { key: 'MASTER_TER', label: 'MASTER TER' },
      { key: 'MASTER_PTKP', label: 'MASTER PTKP' },
      { key: 'MASTER_PKP', label: 'MASTER PKP' },
      { key: 'MASTER_EMPLOYEE', label: 'MASTER EMPLOYEE' },
      { key: 'MASTER_CLIENT', label: 'MASTER CLIENT' },
      { key: 'MASTER_PIC_PROJECT', label: 'MASTER PIC PROJECT' },
      { key: 'MASTER_UANG_KOMPENSASI', label: 'MASTER UANG KOMPENSASI' },
      { key: 'MASTER_LIBUR', label: 'MASTER LIBUR' },
      { key: 'MASTER_SWIFT_CODE', label: 'MASTER SWIFT CODE' },
      { key: 'MASTER_HOLD', label: 'MASTER HOLD' },
      { key: 'MASTER_SETTING_ASSIGN', label: 'SETTING ASSIGN' },
      { key: 'MASTER_TUNJANGAN_INSENTIF', label: 'TUNJANGAN & INSENTIF CONFIG' }
    ]
  },
  {
    key: 'KERTAS_KERJA',
    label: 'KERTAS KERJA',
    children: [
      { key: 'KERTAS_KERJA_RETRIEVE', label: 'RETRIEVE KERTAS KERJA JASA' },
      { key: 'KERTAS_KERJA_JASA', label: 'KK JASA' }
    ]
  },
  {
    key: 'PAYROLL',
    label: 'PAYROLL',
    children: [
      { key: 'PAYROLL_RETRIEVE', label: 'RETRIEVE DATA' },
      { key: 'PAYROLL_PROSES', label: 'PROSES PAYROLL' },
      { key: 'PAYROLL_PPH', label: 'PROSES PPH' }
    ]
  },
  {
    key: 'PPH21',
    label: 'PPH21',
    children: [
      { key: 'PPH21_LIST', label: 'DATALIST PPH21' },
      { key: 'PPH21_SLIP', label: 'SLIP GAJI' },
      { key: 'PPH21_SIMULASI', label: 'SIMULASI PPH21' },
      { key: 'PPH21_SUMMARY', label: 'SUMMARY PPH21' }
    ]
  },
  {
    key: 'BUKTI_PEMOTONGAN',
    label: 'BUKTI PEMOTONGAN',
    children: [
      { key: 'BUKTI_PEMOTONGAN_A1', label: 'BUKTI POTONG A1' },
      { key: 'BUKTI_PEMOTONGAN_21_PAYROLL', label: 'BUKTI POTONG 21 PAYROLL' },
      { key: 'BUKTI_PEMOTONGAN_26_PAYROLL', label: 'BUKTI POTONG 26 PAYROLL' },
      { key: 'BUKTI_PEMOTONGAN_21_UK', label: 'BUKTI POTONG 21 KOMPENSASI' }
    ]
  },
  {
    key: 'LEMBUR',
    label: 'LEMBUR',
    children: [
      { key: 'LEMBUR_ENTRY', label: 'ENTRY LEMBUR' }
    ]
  },
  {
    key: 'PINJAMAN',
    label: 'PINJAMAN',
    children: [
      { key: 'PINJAMAN_ENTRY', label: 'ENTRY PINJAMAN' }
    ]
  },
  {
    key: 'UANG_KOMPENSASI',
    label: 'UANG KOMPENSASI',
    children: [
      { key: 'KOMPENSASI_RETRIEVE', label: 'RETRIEVE DATA' },
      { key: 'KOMPENSASI_UPLOAD', label: 'UPLOAD DATA' },
      { key: 'KOMPENSASI_UPLOAD_CADANGAN', label: 'UPLOAD CADANGAN' },
      { key: 'KOMPENSASI_SLIP', label: 'SLIP KOMPENSASI' }
    ]
  },
  {
    key: 'REPORT',
    label: 'REPORT',
    children: [
      { key: 'REPORT_BPJS', label: 'REPORT BPJS' },
      { key: 'REPORT_REKAP_PPH21', label: 'REKAP PPH21' },
      { key: 'REPORT_BUPOT_21', label: 'REPORT BUKTI POTONG PPH21' },
      { key: 'REPORT_BUPOT_A1', label: 'REPORT BUKTI POTONG PPH21 A1' },
      { key: 'REPORT_BUPOT_26', label: 'REPORT BUKTI POTONG PPH26' },
      { key: 'REPORT_BUPOT_KOMPENSASI', label: 'REPORT BUKTI POTONG UANG KOMPENSASI' },
      { key: 'REPORT_UBAH_UPAH', label: 'REPORT PERUBAHAN UPAH TENAGA KERJA' },
      { key: 'REPORT_IURAN_BPJS', label: 'REPORT IURAN BPJS TENAGA KERJA' },
      { key: 'REPORT_TK_MASUK', label: 'REPORT DAFTAR TENAGA KERJA MASUK' },
      { key: 'REPORT_TK_KELUAR', label: 'REPORT DAFTAR TENAGA KERJA KELUAR' }
    ]
  },
  {
    key: 'SETTING',
    label: 'SETTING',
    children: [
      { key: 'SETTING_CHANGE_PASSWORD', label: 'CHANGE PASSWORD' },
      { key: 'SETTING_TOGGLE_PROJECT', label: 'BUKA/TUTUP PROJECT' }
    ]
  }
];

const ALL_MENU_KEYS = [];
MENU_STRUCTURE.forEach(m => {
  ALL_MENU_KEYS.push(m.key);
  if (m.children) {
    m.children.forEach(c => ALL_MENU_KEYS.push(c.key));
  }
});

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const res = await api.get('/roles');
    setRoles(res.data);
  };

  const openEdit = async (role) => {
    try {
      const permRes = await api.get(`/roles/${role.id}/permissions`);
      const perms = ALL_MENU_KEYS.map(key => ({
        menuKey: key,
        canAccess: (permRes.data || []).some(p => p.menuKey === key && p.canAccess)
      }));
      setEdit({ ...role, permissions: perms });
    } catch (err) {
      console.error('Failed to fetch role permissions from API:', err);
      const perms = ALL_MENU_KEYS.map(key => ({
        menuKey: key,
        canAccess: false
      }));
      setEdit({ ...role, permissions: perms });
    }
    setOpen(true);
  };

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleSave = async () => {
    // Ensure parent keys are true if any child is true
    const sanitizedPermissions = edit.permissions.map(p => {
      const parentMenu = MENU_STRUCTURE.find(m => m.key === p.menuKey);
      if (parentMenu && parentMenu.children) {
        const hasActiveChild = parentMenu.children.some(c =>
          edit.permissions.find(ep => ep.menuKey === c.key)?.canAccess
        );
        if (hasActiveChild) {
          return { ...p, canAccess: true };
        }
      }
      return p;
    });

    const payload = {
      name: edit.name,
      description: edit.description,
      permissions: sanitizedPermissions
    };
    if (edit.id) await api.put(`/roles/${edit.id}`, payload);
    else await api.post('/roles', payload);
    setOpen(false);
    fetchRoles();

    // If edited role matches current logged in user's position or role name, immediately sync permissions in Redux
    const currentPos = user?.position?.toUpperCase()?.trim() || '';
    const currentPriv = user?.privilage?.toUpperCase()?.trim() || user?.privilege?.toUpperCase()?.trim() || '';
    const editedName = edit.name?.toUpperCase()?.trim() || '';

    if (
      editedName === currentPos ||
      editedName === currentPriv ||
      (currentPriv === 'ADMIN' && editedName === 'SUPER_ADMIN') ||
      (currentPos === 'IT' && editedName === 'SUPER_ADMIN')
    ) {
      const updatedKeys = sanitizedPermissions.filter(p => p.canAccess).map(p => p.menuKey);
      dispatch(setPermissions(updatedKeys));
    }
  };

  const columns = [
    { label: 'Nama Role', id: 'name' },
    { label: 'Deskripsi', id: 'description' },
    {
      label: 'Aksi',
      id: 'actions',
      render: (row) => (
        <Button size="small" variant="outlined" color="primary" onClick={() => openEdit(row)}>Edit</Button>
      )
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Role Privilege Setting</Typography>
        <Button variant="contained" onClick={() => {
          setEdit({ name: '', description: '', permissions: ALL_MENU_KEYS.map(k => ({ menuKey: k, canAccess: false })) });
          setOpen(true);
        }}>
          Tambah Role
        </Button>
      </Box>
      
      <DataTable 
        columns={columns} 
        data={roles} 
        loading={false}
        page={1}
        pageSize={50}
        totalElements={roles.length}
        totalPages={1}
        showPagination={false}
      />

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="md" 
        fullWidth
        disableRestoreFocus
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle component="div" sx={{ fontWeight: 700 }}>
          <Typography component="div" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
            {edit?.id ? 'Edit' : 'Tambah'} Role & Privilege
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <TextField label="Nama" fullWidth margin="dense" size="small"
            value={edit?.name || ''} onChange={e => setEdit({ ...edit, name: e.target.value })} />
          <TextField label="Deskripsi" fullWidth margin="dense" size="small"
            value={edit?.description || ''} onChange={e => setEdit({ ...edit, description: e.target.value })} />
          
          <Box sx={{ mt: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#334155' }}>
              Menu & Sub-Menu Permissions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {MENU_STRUCTURE.map((menu) => {
                const isParentChecked = edit?.permissions?.find(p => p.menuKey === menu.key)?.canAccess || false;
                return (
                  <Box key={menu.key}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: '8px', bgcolor: '#f8fafc', borderColor: '#e2e8f0' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isParentChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              let newPerms = edit.permissions.map(p => {
                                if (p.menuKey === menu.key) return { ...p, canAccess: checked };
                                if (menu.children && menu.children.some(c => c.key === p.menuKey)) {
                                  return { ...p, canAccess: checked };
                                }
                                return p;
                              });
                              setEdit({ ...edit, permissions: newPerms });
                            }}
                            size="small"
                          />
                        }
                        label={<Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{menu.label}</Typography>}
                      />
                      {menu.children && (
                        <Box sx={{ pl: 3.5, mt: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1 }}>
                          {menu.children.map((child) => {
                            const isChildChecked = edit?.permissions?.find(p => p.menuKey === child.key)?.canAccess || false;
                            return (
                              <FormControlLabel
                                key={child.key}
                                control={
                                  <Checkbox
                                    checked={isChildChecked}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      let newPerms = edit.permissions.map(p =>
                                        p.menuKey === child.key ? { ...p, canAccess: checked } : p
                                      );
                                      // If checking child, ensure parent is also checked
                                      if (checked) {
                                        newPerms = newPerms.map(p =>
                                          p.menuKey === menu.key ? { ...p, canAccess: true } : p
                                        );
                                      }
                                      setEdit({ ...edit, permissions: newPerms });
                                    }}
                                    size="small"
                                  />
                                }
                                label={<Typography variant="caption" sx={{ fontWeight: 500, color: '#475569' }}>{child.label}</Typography>}
                              />
                            );
                          })}
                        </Box>
                      )}
                    </Paper>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Batal</Button>
          <Button variant="contained" onClick={handleSave}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}