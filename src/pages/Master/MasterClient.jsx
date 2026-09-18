import { useDynamicClientDropdowns } from "../../hooks/useDynamicClientDropdowns";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Box, Typography, Paper, Grid, TextField, Button, Stack, Chip, Checkbox, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, RadioGroup, FormControlLabel, Radio, FormControl,
  Snackbar, Alert, ToggleButton, ToggleButtonGroup, Skeleton, CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon, Add as AddIcon, Edit as EditIcon, 
  GetApp as ExportIcon, History as HistoryIcon, Close as CloseIcon, Info as InfoIcon,
  ArrowBack as ArrowBackIcon, AttachFile as AttachFileIcon,
  CompareArrows as CompareArrowsIcon, RemoveCircle as RemoveCircleIcon
} from '@mui/icons-material';
import CustomModal from '../../components/Common/CustomModal';
import SearchableSelect from '../../components/Common/SearchableSelect';
import DataTable from '../../components/Common/DataTable';
import { useCascadingDropdowns } from '../../hooks/useCascadingDropdowns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


const FormRow = ({ label, children, alignTop = false, maxWidth = 320 }) => (
  <Stack direction="row" alignItems={alignTop ? "flex-start" : "center"} spacing={2}>
    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ width: 140, flexShrink: 0, pt: alignTop ? 1 : 0 }}>
      {label}
    </Typography>
    <Box sx={{ flex: 1, maxWidth: maxWidth }}>
      {children}
    </Box>
  </Stack>
);



const AddClientForm = ({ onCancel }) => {
  const [division, setDivision] = useState('');
  const [unit, setUnit] = useState('');
  const [position, setPosition] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [branch, setBranch] = useState('');
  
  const [salaryType, setSalaryType] = useState('');
  const [nominal, setNominal] = useState('');
  const [workDays, setWorkDays] = useState('');
  const [bpjsTkType, setBpjsTkType] = useState('');
  const [manajemenFee, setManajemenFee] = useState('0');
  const [metodePajak, setMetodePajak] = useState('');
  const [komponenProject, setKomponenProject] = useState('');
  const [persenBpjsKesehatan, setPersenBpjsKesehatan] = useState('1');
  const [bpjsKetenagakerjaan, setBpjsKetenagakerjaan] = useState('');
  const [komponenUpah, setKomponenUpahVal] = useState('');
  const [komponenLembur, setKomponenLembur] = useState('');
  const [ditanggungOleh, setDitanggungOleh] = useState('');

  const [tunjanganTetap, setTunjanganTetap] = useState([]);
  const [tunjanganTidakTetap, setTunjanganTidakTetap] = useState([]);
  const [tunjanganBedaPeriode, setTunjanganBedaPeriode] = useState(false);
  const [tunjanganDetails, setTunjanganDetails] = useState({});
  const [activeTab, setActiveTab] = useState('tunjangan');
  
  const [biayaJasa, setBiayaJasa] = useState('');
  const [training, setTraining] = useState('');
  const [bonus, setBonus] = useState('');
  const [asuransiKesehatan, setAsuransiKesehatan] = useState('');
  const [asuransiKecelakaan, setAsuransiKecelakaan] = useState('');
  const [insentif, setInsentif] = useState('');
  const [lembur, setLembur] = useState('');
  const [tunjanganKesehatan, setTunjanganKesehatan] = useState('');
  const [performancePay, setPerformancePay] = useState('');
  const [monthlyCommission, setMonthlyCommission] = useState('');
  const [shiftAllowance, setShiftAllowance] = useState('');
  const [thr, setThr] = useState('');
  const [kompensasi, setKompensasi] = useState('');

  const [errors, setErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const { 
    divisions, units, positions, employeeTypes, branches,
    salaryTypes, allowances, komponenUpah: komponenUpahOptions, workDays: workDaysOptions,
    bpjsTkTypes, metodePajak: metodePajakOptions, komponenProject: komponenProjectOptions, 
    bpjsKetenagakerjaan: bpjsKetOptions, ditanggungOleh: ditanggungOlehOptions
  } = useDynamicClientDropdowns({ division, unit, position, employeeType });

  const allSelectedTunjangan = [...new Set([...tunjanganTetap, ...tunjanganTidakTetap])];

  const formatCurrency = (val) => {
    if (!val) return '';
    const num = val.toString().replace(/[^0-9]/g, '');
    if (!num) return '';
    return Number(num).toLocaleString('en-US');
  };

  const handleCurrencyChange = (setter) => (e) => {
    setter(formatCurrency(e.target.value));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    const errorMsg = (msg) => setSnackbar({ open: true, message: msg, severity: 'error' });

    const mandatory = { division, unit, position, branch, employeeType, salaryType, metodePajak, komponenProject, workDays };
    Object.keys(mandatory).forEach(key => {
      if (!mandatory[key]) {
        newErrors[key] = true;
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      errorMsg('Harap isi semua komponen yang mandatory');
      return false;
    }

    if (!persenBpjsKesehatan && !bpjsTkType) {
      newErrors.persenBpjsKesehatan = true;
      newErrors.bpjsTkType = true;
      setErrors(newErrors);
      errorMsg('Persen BPJS Kesehatan dan BPJS TK Type harus diisi');
      return false;
    }

    if (bpjsTkType && bpjsTkType !== 'None' && !persenBpjsKesehatan) {
      newErrors.persenBpjsKesehatan = true;
      setErrors(newErrors);
      errorMsg('Persen BPJS Kesehatan harus diisi');
      return false;
    }

    if (bpjsKetenagakerjaan !== '0' && bpjsKetenagakerjaan !== 'No' && bpjsKetenagakerjaan && !bpjsTkType) {
      newErrors.bpjsTkType = true;
      setErrors(newErrors);
      errorMsg('BPJS TK Type harus diisi');
      return false;
    }

    if (asuransiKesehatan && (!ditanggungOleh || ditanggungOleh === '0')) {
      newErrors.ditanggungOleh = true;
      setErrors(newErrors);
      errorMsg('Asuransi Ditanggung Oleh harus diisi');
      return false;
    }

    if (asuransiKecelakaan && (!ditanggungOleh || ditanggungOleh === '0')) {
      newErrors.ditanggungOleh = true;
      setErrors(newErrors);
      errorMsg('Asuransi Ditanggung Oleh harus diisi');
      return false;
    }

    if ((bpjsKetenagakerjaan === '1' || bpjsKetenagakerjaan === 'Yes') && !komponenUpah) {
      newErrors.komponenUpah = true;
      setErrors(newErrors);
      errorMsg('Komponen Upah harus dipilih terlebih dahulu');
      return false;
    }

    if (bpjsTkType && bpjsTkType !== 'None' && (bpjsKetenagakerjaan === '0' || bpjsKetenagakerjaan === 'No' || !bpjsKetenagakerjaan)) {
      newErrors.bpjsKetenagakerjaan = true;
      setErrors(newErrors);
      errorMsg('Bpjs Ketenagakerjaan harus dipilih');
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setConfirmDialog(true);
    }
  };

  const proceedSave = async () => {
    setConfirmDialog(false);
    try {
      const payload = {
         division, unitName: unit, position, branch, employeeType,
         salaryType, nominal: parseFloat(nominal.replace(/,/g, '') || 0),
         workDays, bpjsTkType, manajemenFee: parseFloat(manajemenFee.replace(/,/g, '') || 0),
         metodePajak, komponenProject, persenBpjsKesehatan, bpjsKetenagakerjaan,
         komponenUpah, komponenLembur, biayaJasa: parseFloat(biayaJasa.replace(/,/g, '') || 0),
         training: parseFloat(training.replace(/,/g, '') || 0), bonus: parseFloat(bonus.replace(/,/g, '') || 0),
         tunjanganTetap, tunjanganTidakTetap, tunjanganBedaPeriode, ditanggungOleh, tunjanganDetails: JSON.stringify(tunjanganDetails),
         asuransiKesehatan: parseFloat(asuransiKesehatan.replace(/,/g, '') || 0),
         asuransiKecelakaan: parseFloat(asuransiKecelakaan.replace(/,/g, '') || 0),
         insentif: parseFloat(insentif.replace(/,/g, '') || 0), lembur: parseFloat(lembur.replace(/,/g, '') || 0),
         tunjanganKesehatan: parseFloat(tunjanganKesehatan.replace(/,/g, '') || 0),
         performancePay: parseFloat(performancePay.replace(/,/g, '') || 0),
         monthlyCommission: parseFloat(monthlyCommission.replace(/,/g, '') || 0),
         shiftAllowance: parseFloat(shiftAllowance.replace(/,/g, '') || 0),
         thr: parseFloat(thr.replace(/,/g, '') || 0), kompensasi: parseFloat(kompensasi.replace(/,/g, '') || 0)
      };
      
      const userFullname = localStorage.getItem('fullname') || 'Staff HRD';
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/master-client/add`, payload, {
        headers: { 
          'fullname': userFullname,
          'Authorization': `Bearer ${token}` 
        }
      });
      
      setSnackbar({ open: true, message: 'Data berhasil disimpan!', severity: 'success' });
      setTimeout(() => {
        onCancel(true);
      }, 1500);
    } catch (err) {
       const msg = err.response?.data || err.message;
       setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  const getErrorStyle = (field) => errors[field] ? { border: '1px solid red', borderRadius: 1 } : {};

  return (
    <Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Konfirmasi Penyimpanan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menyimpan data Master Client ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} color="inherit">Batal</Button>
          <Button onClick={proceedSave} variant="contained" color="primary" autoFocus>
            Ya, Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => onCancel()}
          sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6' }}
        >
          Kembali
        </Button>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Add Client</Typography>
          <Typography variant="body2" color="text.secondary">Tambah data divisi, unit, posisi, dan branch baru ke dalam sistem</Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'white', border: '1px solid #e2e8f0', mb: 3 }} elevation={0}>
        
        {/* DATA CLIENT SECTION */}
        <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3 }}>Data Client</Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Division"><Box sx={getErrorStyle('division')}><SearchableSelect freeSolo={true} placeholder="--Pilih--" options={divisions} value={division} onChange={val => { setDivision(val); setUnit(''); setPosition(''); setEmployeeType(''); setBranch(''); }} /></Box></FormRow>
              <FormRow label="Unit Name"><Box sx={getErrorStyle('unit')}><SearchableSelect freeSolo={true} placeholder="--Pilih--" options={units} value={unit} onChange={val => { setUnit(val); setPosition(''); setEmployeeType(''); setBranch(''); }} /></Box></FormRow>
              <FormRow label="Position"><Box sx={getErrorStyle('position')}><SearchableSelect freeSolo={true} placeholder="--Pilih--" options={positions} value={position} onChange={val => { setPosition(val); setEmployeeType(''); setBranch(''); }} /></Box></FormRow>
              <FormRow label="Employee Type"><Box sx={getErrorStyle('employeeType')}><SearchableSelect freeSolo={true} placeholder="--Pilih--" options={employeeTypes} value={employeeType} onChange={val => { setEmployeeType(val); setBranch(''); }} /></Box></FormRow>
              <FormRow label="Branch"><Box sx={getErrorStyle('branch')}><SearchableSelect freeSolo={true} placeholder="--Pilih--" options={branches} value={branch} onChange={val => setBranch(val)} /></Box></FormRow>
              <FormRow label="Salary Type"><Box sx={getErrorStyle('salaryType')}><SearchableSelect freeSolo={true} placeholder="--Pilih--" options={salaryTypes} value={salaryType} onChange={val => setSalaryType(val)} /></Box></FormRow>
              <FormRow label="Nominal"><TextField fullWidth size="small" value={nominal} onChange={handleCurrencyChange(setNominal)} /></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Works Days"><Box sx={getErrorStyle('workDays')}><SearchableSelect placeholder="--Pilih--" options={workDaysOptions} value={workDays} onChange={val => setWorkDays(val)} /></Box></FormRow>
              <FormRow label="BPJS TK Type"><Box sx={getErrorStyle('bpjsTkType')}><SearchableSelect placeholder="--Pilih--" options={bpjsTkTypes} value={bpjsTkType} onChange={val => setBpjsTkType(val)} /></Box></FormRow>
              <FormRow label="Manajemen Fee (%)"><TextField fullWidth size="small" value={manajemenFee} onChange={(e) => setManajemenFee(e.target.value.replace(/[^0-9.]/g, ''))} /></FormRow>
              <FormRow label="Metode Pajak"><Box sx={getErrorStyle('metodePajak')}><SearchableSelect placeholder="--Pilih--" options={metodePajakOptions} value={metodePajak} onChange={val => setMetodePajak(val)} /></Box></FormRow>
              <FormRow label="Komponen Project"><Box sx={getErrorStyle('komponenProject')}><SearchableSelect placeholder="--Pilih--" options={komponenProjectOptions} value={komponenProject} onChange={val => setKomponenProject(val)} /></Box></FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* BPJS SECTION */}
        <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>BPJS</Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Persen BPJS Kesehatan" alignTop>
                <Box sx={getErrorStyle('persenBpjsKesehatan')}>
                  <FormControl component="fieldset">
                    <RadioGroup value={persenBpjsKesehatan} onChange={(e) => setPersenBpjsKesehatan(e.target.value)}>
                      <FormControlLabel value="1" control={<Radio size="small" />} label={<Typography variant="body2">Perusahaan 5%</Typography>} sx={{ mb: -1 }} />
                      <FormControlLabel value="2" control={<Radio size="small" />} label={<Typography variant="body2">Perusahaan 4% dan Karyawan 1%</Typography>} sx={{ mb: -1 }} />
                      <FormControlLabel value="3" control={<Radio size="small" />} label={<Typography variant="body2">Karyawan 5%</Typography>} />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </FormRow>
              <FormRow label="BPJS Ketenagakerjaan"><Box sx={getErrorStyle('bpjsKetenagakerjaan')}><SearchableSelect placeholder="--Pilih--" options={bpjsKetOptions} value={bpjsKetenagakerjaan} onChange={val => setBpjsKetenagakerjaan(val)} /></Box></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Komponen Upah"><Box sx={getErrorStyle('komponenUpah')}><SearchableSelect placeholder="--Pilih--" options={komponenUpahOptions} value={komponenUpah} onChange={val => setKomponenUpahVal(val)} /></Box></FormRow>
              <FormRow label="Komponen Lembur"><SearchableSelect placeholder="--Pilih--" options={komponenUpahOptions} value={komponenLembur} onChange={val => setKomponenLembur(val)} /></FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* SPECIAL TREATMENT & KATEGORI TUNJANGAN SECTION */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Special Treatment</Typography>
            <Stack spacing={2.5}>
              <FormRow label="Biaya Jasa"><TextField fullWidth size="small" value={biayaJasa} onChange={handleCurrencyChange(setBiayaJasa)} /></FormRow>
              <FormRow label="Training"><TextField fullWidth size="small" value={training} onChange={handleCurrencyChange(setTraining)} /></FormRow>
              <FormRow label="Bonus"><TextField fullWidth size="small" value={bonus} onChange={handleCurrencyChange(setBonus)} /></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Kategori Tunjangan</Typography>
            <Stack spacing={2.5}>
              <FormRow label="Tunjangan Tetap">
                <SearchableSelect 
                  placeholder="--Pilih--" 
                  options={allowances} 
                  multiple={true}
                  value={tunjanganTetap}
                  onChange={(val) => setTunjanganTetap(val)}
                />
              </FormRow>
              <FormRow label="Tunjangan Tidak Tetap">
                <SearchableSelect 
                  placeholder="--Pilih--" 
                  options={allowances} 
                  multiple={true}
                  value={tunjanganTidakTetap}
                  onChange={(val) => setTunjanganTidakTetap(val)}
                />
              </FormRow>
              <FormRow label="">
                <FormControlLabel control={<Checkbox size="small" checked={tunjanganBedaPeriode} onChange={(e) => setTunjanganBedaPeriode(e.target.checked)} />} label={<Typography variant="body2" color="text.secondary" fontWeight={600}>Tunjangan Beda Periode</Typography>} />
              </FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* ASURANSI SECTION */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Asuransi</Typography>
            <Stack spacing={2.5}>
              <FormRow label="Ditanggung oleh"><Box sx={getErrorStyle('ditanggungOleh')}><SearchableSelect placeholder="--Pilih--" options={ditanggungOlehOptions} value={ditanggungOleh} onChange={val => setDitanggungOleh(val)} /></Box></FormRow>
              <FormRow label="Asuransi Kesehatan"><TextField fullWidth size="small" value={asuransiKesehatan} onChange={handleCurrencyChange(setAsuransiKesehatan)} /></FormRow>
              <FormRow label="Asuransi Kecelakaan"><TextField fullWidth size="small" value={asuransiKecelakaan} onChange={handleCurrencyChange(setAsuransiKecelakaan)} /></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
             <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#3b82f6', color: 'white', '&:hover': { bgcolor: '#2563eb' }, px: 6, py: 1.5, fontWeight: 700, borderRadius: '8px', minWidth: 160 }}>
               SAVE DATA
             </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
          <Stack direction="row" sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <Button 
              onClick={() => setActiveTab('tunjangan')}
              sx={{ 
                color: activeTab === 'tunjangan' ? '#3b82f6' : '#64748b', 
                bgcolor: activeTab === 'tunjangan' ? 'white' : 'transparent',
                borderRadius: 0, px: 3, py: 1.5, fontWeight: 700, textTransform: 'none', 
                borderRight: '1px solid #e2e8f0', 
                borderBottom: activeTab === 'tunjangan' ? '2px solid #3b82f6' : '2px solid transparent' 
              }}>
              List Tunjangan
            </Button>
            <Button 
              onClick={() => setActiveTab('non-upah')}
              sx={{ 
                color: activeTab === 'non-upah' ? '#3b82f6' : '#64748b', 
                bgcolor: activeTab === 'non-upah' ? 'white' : 'transparent',
                px: 3, py: 1.5, fontWeight: 700, textTransform: 'none',
                borderBottom: activeTab === 'non-upah' ? '2px solid #3b82f6' : '2px solid transparent'
              }}>
              List Non Upah
            </Button>
          </Stack>
          <Box sx={{ p: 4, minHeight: 100 }}>
             {activeTab === 'tunjangan' && (
               allSelectedTunjangan.length > 0 ? (
                 <Stack spacing={2.5}>
                   {allSelectedTunjangan.map((t) => (
                     <FormRow key={t} label={t}>
                       <TextField fullWidth size="small" placeholder={`Nominal ${t}`} value={tunjanganDetails[t] || ''} onChange={(e) => { const val = e.target.value; setTunjanganDetails(prev => ({...prev, [t]: val})); }} />
                     </FormRow>
                   ))}
                 </Stack>
               ) : (
                 <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                   Belum ada tunjangan yang dipilih. Silakan pilih pada menu Kategori Tunjangan.
                 </Typography>
               )
             )}
             
             {activeTab === 'non-upah' && (
               <Grid container spacing={6}>
                 <Grid item xs={12} md={6}>
                   <Stack spacing={2.5}>
                     <FormRow label="Insentif"><TextField fullWidth size="small" value={insentif} onChange={handleCurrencyChange(setInsentif)} /></FormRow>
                     <FormRow label="Lembur"><TextField fullWidth size="small" value={lembur} onChange={handleCurrencyChange(setLembur)} /></FormRow>
                     <FormRow label="Tunjangan Kesehatan"><TextField fullWidth size="small" value={tunjanganKesehatan} onChange={handleCurrencyChange(setTunjanganKesehatan)} /></FormRow>
                     <FormRow label="Performance Pay"><TextField fullWidth size="small" value={performancePay} onChange={handleCurrencyChange(setPerformancePay)} /></FormRow>
                   </Stack>
                 </Grid>
                 <Grid item xs={12} md={6}>
                   <Stack spacing={2.5}>
                     <FormRow label="Monthly Commision"><TextField fullWidth size="small" value={monthlyCommission} onChange={handleCurrencyChange(setMonthlyCommission)} /></FormRow>
                     <FormRow label="Shift Allowance"><TextField fullWidth size="small" value={shiftAllowance} onChange={handleCurrencyChange(setShiftAllowance)} /></FormRow>
                     <FormRow label="THR"><TextField fullWidth size="small" value={thr} onChange={handleCurrencyChange(setThr)} /></FormRow>
                     <FormRow label="Kompensasi"><TextField fullWidth size="small" value={kompensasi} onChange={handleCurrencyChange(setKompensasi)} /></FormRow>
                   </Stack>
                 </Grid>
               </Grid>
             )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

const EditClientForm = ({ onCancel, data }) => {
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState(null);

  const [division, setDivision] = useState('');
  const [unit, setUnit] = useState('');
  const [position, setPosition] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [branch, setBranch] = useState('');
  
  const [salaryType, setSalaryType] = useState('');
  const [nominal, setNominal] = useState('');
  const [workDays, setWorkDays] = useState('');
  const [bpjsTkType, setBpjsTkType] = useState('');
  const [manajemenFee, setManajemenFee] = useState('');
  const [metodePajak, setMetodePajak] = useState('');
  const [komponenProject, setKomponenProject] = useState('');
  const [persenBpjsKesehatan, setPersenBpjsKesehatan] = useState('');
  const [bpjsKetenagakerjaan, setBpjsKetenagakerjaan] = useState('');
  const [komponenUpah, setKomponenUpahVal] = useState('');
  const [komponenLembur, setKomponenLembur] = useState('');
  const [ditanggungOleh, setDitanggungOleh] = useState('');
  
  const [asuransiKesehatan, setAsuransiKesehatan] = useState('');
  const [asuransiKecelakaan, setAsuransiKecelakaan] = useState('');
  
  const [insentif, setInsentif] = useState('');
  const [lembur, setLembur] = useState('');
  const [tunjanganKesehatan, setTunjanganKesehatan] = useState('');
  const [performancePay, setPerformancePay] = useState('');
  const [monthlyCommission, setMonthlyCommission] = useState('');
  const [shiftAllowance, setShiftAllowance] = useState('');
  const [thr, setThr] = useState('');
  const [kompensasi, setKompensasi] = useState('');

  const [tunjanganTetap, setTunjanganTetap] = useState([]);
  const [tunjanganTidakTetap, setTunjanganTidakTetap] = useState([]);
  const [tunjanganBedaPeriode, setTunjanganBedaPeriode] = useState(false);
  const [tunjanganDetails, setTunjanganDetails] = useState({});
  const [activeTab, setActiveTab] = useState('tunjangan');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const { user } = useSelector((state) => state.auth || {});

  const { 
    divisions, units, positions, employeeTypes, branches,
    salaryTypes, allowances, komponenUpah: komponenUpahOptions, workDays: workDaysOptions,
    bpjsTkTypes, metodePajak: metodePajakOptions, komponenProject: komponenProjectOptions, 
    bpjsKetenagakerjaan: bpjsKetOptions, ditanggungOleh: ditanggungOlehOptions
  } = useDynamicClientDropdowns({ division, unit, position, employeeType });

  const fetchDetail = async () => {
    if (!data?.id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/master-client/${data.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        const d = res.data;
        setDetailData(d);
        setDivision(d.division || '');
        setUnit(d.unitName || '');
        setPosition(d.position || '');
        setEmployeeType(d.employeeType || '');
        setBranch(d.branch || '');
        setSalaryType(d.salaryType || '');
        setNominal(d.nominal || '');
        setWorkDays(d.workDays || '');
        setBpjsTkType(d.bpjsTkType || '');
        setManajemenFee(d.manajemenFee || '');
        setMetodePajak(d.metodePajak || '');
        setKomponenProject(d.komponenProject || '');
        setPersenBpjsKesehatan(d.persenBpjsKesehatan || '');
        setBpjsKetenagakerjaan(d.bpjsKetenagakerjaan || '');
        setKomponenUpahVal(d.komponenUpah || '');
        setKomponenLembur(d.komponenLembur || '');
        setDitanggungOleh(d.ditanggungOleh || '');
        setAsuransiKesehatan(d.asuransiKesehatan || '');
        setAsuransiKecelakaan(d.asuransiKecelakaan || '');
        
        setInsentif(d.insentif || '');
        setLembur(d.lembur || '');
        setTunjanganKesehatan(d.tunjanganKesehatan || '');
        setPerformancePay(d.performancePay || '');
        setMonthlyCommission(d.monthlyCommission || '');
        setShiftAllowance(d.shiftAllowance || '');
        setThr(d.thr || '');
        setKompensasi(d.kompensasi || '');
        
        if (d.tunjanganBedaPeriode != null) setTunjanganBedaPeriode(d.tunjanganBedaPeriode);
        if (d.tunjanganDetails) { try { setTunjanganDetails(JSON.parse(d.tunjanganDetails)); } catch(e) {} }
        if (d.tunjanganTetap) setTunjanganTetap(d.tunjanganTetap.split(','));
        else setTunjanganTetap([]);
        if (d.tunjanganTidakTetap) setTunjanganTidakTetap(d.tunjanganTidakTetap.split(','));
        else setTunjanganTidakTetap([]);
      }
    } catch (error) {
      console.error('Error fetching detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [data]);

  const tunjanganOptions = [
    'Tunjangan Supervisor', 'Tunjangan Jabatan', 'Skill Allowance',
    'Grading Allowance', 'Montly Allowance', 'Performance Allowance',
    'Position Allowance', 'Tunjangan Bensin'
  ];

  const allSelectedTunjangan = [...new Set([...tunjanganTetap, ...tunjanganTidakTetap])];

  const handleUpdateData = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        division, unitName: unit, position, employeeType, branch,
        salaryType, nominal: parseFloat(String(nominal).replace(/,/g, '')) || null, workDays,
        bpjsTkType, manajemenFee: parseFloat(String(manajemenFee).replace(/,/g, '')) || null,
        metodePajak, komponenProject, 
        persenBpjsKesehatan, bpjsKetenagakerjaan, komponenUpah, komponenLembur,
        ditanggungOleh,
        asuransiKesehatan: parseFloat(String(asuransiKesehatan).replace(/,/g, '')) || null,
        asuransiKecelakaan: parseFloat(String(asuransiKecelakaan).replace(/,/g, '')) || null,
        insentif: parseFloat(String(insentif).replace(/,/g, '')) || null,
        lembur: parseFloat(String(lembur).replace(/,/g, '')) || null,
        tunjanganKesehatan: parseFloat(String(tunjanganKesehatan).replace(/,/g, '')) || null,
        performancePay: parseFloat(String(performancePay).replace(/,/g, '')) || null,
        monthlyCommission: parseFloat(String(monthlyCommission).replace(/,/g, '')) || null,
        shiftAllowance: parseFloat(String(shiftAllowance).replace(/,/g, '')) || null,
        thr: parseFloat(String(thr).replace(/,/g, '')) || null,
        kompensasi: parseFloat(String(kompensasi).replace(/,/g, '')) || null,
        tunjanganTetap, tunjanganTidakTetap, tunjanganBedaPeriode,
        tunjanganDetails: JSON.stringify(tunjanganDetails)
      };

      await axios.put(`${API_URL}/api/master-client/${data.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'Data updated successfully', severity: 'success' });
      setTimeout(() => {
        onCancel();
      }, 1500);
    } catch (error) {
      console.error('Error updating data:', error);
      setSnackbar({ open: true, message: 'Failed to update data', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={300} />
          </Box>
          <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }} elevation={0}>
            <Skeleton variant="text" width={150} height={30} sx={{ mb: 3 }} />
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>
                  {[...Array(6)].map((_, i) => (
                    <Stack direction="row" spacing={2} key={i}>
                      <Skeleton variant="text" width={120} />
                      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                    </Stack>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2.5}>
                  {[...Array(6)].map((_, i) => (
                    <Stack direction="row" spacing={2} key={i}>
                      <Skeleton variant="text" width={120} />
                      <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                    </Stack>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onCancel}
          sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6' }}
        >
          Kembali
        </Button>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Edit Client</Typography>
          <Typography variant="body2" color="text.secondary">Perbarui data atau duplikat konfigurasi client</Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'white', border: '1px solid #e2e8f0', mb: 3 }} elevation={0}>
        
        {/* DATA CLIENT SECTION */}
        <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3 }}>Data Client</Typography>
        <Grid container spacing={6}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Division"><TextField fullWidth size="small" value={division} onChange={e => setDivision(e.target.value)} /></FormRow>
              <FormRow label="Unit Name"><TextField fullWidth size="small" value={unit} onChange={e => setUnit(e.target.value)} /></FormRow>
              <FormRow label="Position"><TextField fullWidth size="small" value={position} onChange={e => setPosition(e.target.value)} /></FormRow>
              <FormRow label="Employee Type"><TextField fullWidth size="small" value={employeeType} onChange={e => setEmployeeType(e.target.value)} /></FormRow>
              <FormRow label="Branch"><TextField fullWidth size="small" value={branch} onChange={e => setBranch(e.target.value)} /></FormRow>
              <FormRow label="Salary Type"><TextField fullWidth size="small" value={salaryType} onChange={e => setSalaryType(e.target.value)} /></FormRow>
              <FormRow label="Nominal"><TextField fullWidth size="small" value={nominal} onChange={e => setNominal(e.target.value)} /></FormRow>
            </Stack>
          </Grid>
          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Works Days"><TextField fullWidth size="small" value={workDays} onChange={e => setWorkDays(e.target.value)} /></FormRow>
              <FormRow label="BPJS TK Type"><TextField fullWidth size="small" value={bpjsTkType} onChange={e => setBpjsTkType(e.target.value)} /></FormRow>
              <FormRow label="Manajemen Fee (%)"><TextField fullWidth size="small" value={manajemenFee} onChange={e => setManajemenFee(e.target.value)} /></FormRow>
              <FormRow label="Metode Pajak"><TextField fullWidth size="small" value={metodePajak} onChange={e => setMetodePajak(e.target.value)} /></FormRow>
              <FormRow label="Komponen Project"><TextField fullWidth size="small" value={komponenProject} onChange={e => setKomponenProject(e.target.value)} /></FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* BPJS SECTION */}
        <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>BPJS</Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Persen BPJS Kesehatan" alignTop>
                <TextField fullWidth size="small" value={persenBpjsKesehatan} onChange={e => setPersenBpjsKesehatan(e.target.value)} />
              </FormRow>
              <FormRow label="BPJS Ketenagakerjaan" alignTop>
                <TextField fullWidth size="small" value={bpjsKetenagakerjaan} onChange={e => setBpjsKetenagakerjaan(e.target.value)} />
              </FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Komponen Upah"><TextField fullWidth size="small" value={komponenUpah} onChange={e => setKomponenUpahVal(e.target.value)} /></FormRow>
              <FormRow label="Komponen Lembur"><TextField fullWidth size="small" value={komponenLembur} onChange={e => setKomponenLembur(e.target.value)} /></FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* KATEGORI TUNJANGAN SECTION */}
        <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Kategori Tunjangan</Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Tunjangan Tetap" alignTop>
                <SearchableSelect 
                  placeholder="--Pilih Tunjangan--"
                  options={allowances && allowances.length > 0 ? allowances : tunjanganOptions}
                  value={tunjanganTetap}
                  onChange={setTunjanganTetap}
                  multiple
                />
              </FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Tunjangan Tidak Tetap" alignTop>
                <SearchableSelect 
                  placeholder="--Pilih Tunjangan--"
                  options={allowances && allowances.length > 0 ? allowances : tunjanganOptions}
                  value={tunjanganTidakTetap}
                  onChange={setTunjanganTidakTetap}
                  multiple
                />
              </FormRow>
              <FormRow label="">
                <FormControlLabel control={<Checkbox size="small" checked={tunjanganBedaPeriode} onChange={e => setTunjanganBedaPeriode(e.target.checked)} />} label={<Typography variant="body2" color="text.secondary" fontWeight={600}>Tunjangan Beda Periode</Typography>} />
              </FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* ASURANSI SECTION */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Asuransi</Typography>
            <Stack spacing={2.5}>
              <FormRow label="Ditanggung oleh"><TextField fullWidth size="small" value={ditanggungOleh} onChange={e => setDitanggungOleh(e.target.value)} /></FormRow>
              <FormRow label="Asuransi Kesehatan"><TextField fullWidth size="small" value={asuransiKesehatan} onChange={e => setAsuransiKesehatan(e.target.value)} /></FormRow>
              <FormRow label="Asuransi Kecelakaan"><TextField fullWidth size="small" value={asuransiKecelakaan} onChange={e => setAsuransiKecelakaan(e.target.value)} /></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 2 }}>
             <Button variant="outlined" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', color: '#3b82f6', borderColor: '#3b82f6', px: 4 }}>
               DUPLIKAT
             </Button>
             <Button onClick={handleUpdateData} variant="contained" sx={{ bgcolor: '#3b82f6', color: 'white', '&:hover': { bgcolor: '#2563eb' }, px: 6, py: 1.5, fontWeight: 700, borderRadius: '8px', minWidth: 160 }}>
               UPDATE DATA
             </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
          <Stack direction="row" sx={{ bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <Button 
              onClick={() => setActiveTab('tunjangan')}
              sx={{ 
                color: activeTab === 'tunjangan' ? '#3b82f6' : '#64748b', 
                bgcolor: activeTab === 'tunjangan' ? 'white' : 'transparent',
                borderRadius: 0, px: 3, py: 1.5, fontWeight: 700, textTransform: 'none', 
                borderRight: '1px solid #e2e8f0', 
                borderBottom: activeTab === 'tunjangan' ? '2px solid #3b82f6' : '2px solid transparent' 
              }}>
              List Tunjangan
            </Button>
            <Button 
              onClick={() => setActiveTab('non-upah')}
              sx={{ 
                color: activeTab === 'non-upah' ? '#3b82f6' : '#64748b', 
                bgcolor: activeTab === 'non-upah' ? 'white' : 'transparent',
                px: 3, py: 1.5, fontWeight: 700, textTransform: 'none',
                borderBottom: activeTab === 'non-upah' ? '2px solid #3b82f6' : '2px solid transparent'
              }}>
              List Non Upah
            </Button>
          </Stack>
          <Box sx={{ p: 4, minHeight: 100 }}>
             {activeTab === 'tunjangan' && (
               allSelectedTunjangan.length > 0 ? (
                 <Stack spacing={2.5}>
                   {allSelectedTunjangan.map((t) => (
                     <FormRow key={t} label={t}>
                       <TextField fullWidth size="small" value={tunjanganDetails[t] || ''} onChange={(e) => { const val = e.target.value; setTunjanganDetails(prev => ({...prev, [t]: val})); }} />
                     </FormRow>
                   ))}
                 </Stack>
               ) : (
                 <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                   Belum ada tunjangan yang dipilih. Silakan pilih pada menu Kategori Tunjangan.
                 </Typography>
               )
             )}
             
             {activeTab === 'non-upah' && (
               <Grid container spacing={6}>
                 <Grid item xs={12} md={6}>
                   <Stack spacing={2.5}>
                     <FormRow label="Insentif"><TextField fullWidth size="small" value={insentif} onChange={e => setInsentif(e.target.value)} /></FormRow>
                     <FormRow label="Lembur"><TextField fullWidth size="small" value={lembur} onChange={e => setLembur(e.target.value)} /></FormRow>
                     <FormRow label="Tunjangan Kesehatan"><TextField fullWidth size="small" value={tunjanganKesehatan} onChange={e => setTunjanganKesehatan(e.target.value)} /></FormRow>
                     <FormRow label="Performance Pay"><TextField fullWidth size="small" value={performancePay} onChange={e => setPerformancePay(e.target.value)} /></FormRow>
                   </Stack>
                 </Grid>
                 <Grid item xs={12} md={6}>
                   <Stack spacing={2.5}>
                     <FormRow label="Monthly Commision"><TextField fullWidth size="small" value={monthlyCommission} onChange={e => setMonthlyCommission(e.target.value)} /></FormRow>
                     <FormRow label="Shift Allowance"><TextField fullWidth size="small" value={shiftAllowance} onChange={e => setShiftAllowance(e.target.value)} /></FormRow>
                     <FormRow label="THR"><TextField fullWidth size="small" value={thr} onChange={e => setThr(e.target.value)} /></FormRow>
                     <FormRow label="Kompensasi"><TextField fullWidth size="small" value={kompensasi} onChange={e => setKompensasi(e.target.value)} /></FormRow>
                   </Stack>
                 </Grid>
               </Grid>
             )}
          </Box>
        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const UploadClientForm = ({ onCancel }) => {
  const [tunjanganTetap, setTunjanganTetap] = useState([]);
  const [tunjanganTidakTetap, setTunjanganTidakTetap] = useState([]);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const { allowances } = useDynamicClientDropdowns();
  
  const tunjanganOptions = [
    'Tunjangan Supervisor', 'Tunjangan Jabatan', 'Skill Allowance',
    'Grading Allowance', 'Montly Allowance', 'Performance Allowance',
    'Position Allowance', 'Tunjangan Bensin'
  ];

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
      const token = localStorage.getItem('token');
      const response = await axios({
        url: `${API_URL}/api/master-client/download-template`,
        method: 'GET',
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Template_Client.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading template", error);
      showSnackbar('Gagal mengunduh template.', 'error');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };


  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onCancel}
          sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6' }}
        >
          Kembali
        </Button>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Upload Client</Typography>
          <Typography variant="body2" color="text.secondary">Upload data client secara massal menggunakan file Excel</Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'white', border: '1px solid #e2e8f0', mb: 3 }} elevation={0}>
        <Stack spacing={2.5}>
          
          <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 2 }}>Kategori Tunjangan</Typography>
          
          <FormRow label={<span>Tunjangan Tetap <span style={{color: 'red'}}>*</span></span>} maxWidth={400}>
            <SearchableSelect 
              placeholder="--Pilih--" 
              options={allowances && allowances.length > 0 ? allowances : tunjanganOptions} 
              multiple={true}
              value={tunjanganTetap}
              onChange={(val) => setTunjanganTetap(val)}
            />
          </FormRow>

          <FormRow label={<span>Tunjangan Tidak Tetap <span style={{color: 'red'}}>*</span></span>} maxWidth="100%">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 400 }}>
                <SearchableSelect 
                  placeholder="--Pilih--" 
                  options={allowances && allowances.length > 0 ? allowances : tunjanganOptions} 
                  multiple={true}
                  value={tunjanganTidakTetap}
                  onChange={(val) => setTunjanganTidakTetap(val)}
                />
              </Box>
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2" color="text.secondary" fontWeight={600}>Tunjangan Beda Periode</Typography>} />
            </Stack>
          </FormRow>

          <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 2, mt: 3 }}>BPJS</Typography>

          <FormRow label={<span>BPJS Kesehatan <span style={{color: 'red'}}>*</span></span>} alignTop>
            <FormControl component="fieldset">
              <RadioGroup defaultValue="1">
                <FormControlLabel value="1" control={<Radio size="small" />} label={<Typography variant="body2">Perusahaan 5%</Typography>} sx={{ mb: -1 }} />
                <FormControlLabel value="2" control={<Radio size="small" />} label={<Typography variant="body2">Perusahaan 4% dan Karyawan 1%</Typography>} sx={{ mb: -1 }} />
                <FormControlLabel value="3" control={<Radio size="small" />} label={<Typography variant="body2">Karyawan 5%</Typography>} />
              </RadioGroup>
            </FormControl>
          </FormRow>

          <FormRow label="Komponen Upah BPJS TK" maxWidth={400}>
            <SearchableSelect placeholder="--Pilih--" options={[]} />
          </FormRow>

          <FormRow label="Komponen Lembur" maxWidth={400}>
            <SearchableSelect placeholder="--Pilih--" options={[]} />
          </FormRow>

          <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 2, mt: 3 }}>Lainnya</Typography>

          <FormRow label={<span>Komponen Project <span style={{color: 'red'}}>*</span></span>} maxWidth={400}>
            <SearchableSelect placeholder="--Pilih--" options={[]} />
          </FormRow>

          <FormRow label={<span>Salary Type <span style={{color: 'red'}}>*</span></span>} maxWidth={400}>
            <SearchableSelect placeholder="--Pilih--" options={[]} />
          </FormRow>

          <FormRow label="File" maxWidth="100%">
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField 
                size="small" 
                placeholder="Choose File" 
                disabled 
                sx={{ width: 400, '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' } }} 
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" sx={{ color: '#22c55e' }}>
                      <AttachFileIcon />
                    </IconButton>
                  )
                }}
              />
              <Button variant="contained" sx={{ bgcolor: '#f0f9ff', color: '#0369a1', boxShadow: 'none', border: '1px solid #bae6fd', '&:hover': { bgcolor: '#e0f2fe', boxShadow: 'none' }, textTransform: 'none', fontWeight: 600 }}>
                Upload
              </Button>
              <Button variant="contained" sx={{ bgcolor: '#f0f9ff', color: '#0369a1', boxShadow: 'none', border: '1px solid #bae6fd', '&:hover': { bgcolor: '#e0f2fe', boxShadow: 'none' }, textTransform: 'none', fontWeight: 600 }}>
                Process
              </Button>
              <Button disabled={isDownloadingTemplate} onClick={handleDownloadTemplate} variant="contained" sx={{ bgcolor: '#f0f9ff', color: '#0369a1', boxShadow: 'none', border: '1px solid #bae6fd', '&:hover': { bgcolor: '#e0f2fe', boxShadow: 'none' }, textTransform: 'none', fontWeight: 600 }}>
                {isDownloadingTemplate ? <CircularProgress size={24} sx={{ color: '#0369a1' }} /> : 'Download Template'}
              </Button>
            </Stack>
          </FormRow>

          {/* Guidelines */}
          <Box sx={{ mt: 4, p: 3, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>Kriteria penginputan data :</Typography>
            <Typography variant="body2" sx={{ color: '#334155', mb: 1, display: 'flex', gap: 1 }}><span>1.</span> <span>Kolom yang wajib diisi : Division,Unit,Employee Type,Position,Branch,Gaji pokok(Variable/Fix/Daily/Allowance/Submitted User/CL First Transaction/CL Retention/Pay Later First Transaction),BPJS TK Type,Methode Pajak</span></Typography>
            <Typography variant="body2" sx={{ color: '#334155', mb: 1, display: 'flex', gap: 1 }}><span>2.</span> <span>Pilihan BPJS Ketenagakerjaan dan BPJS Kesehatan jika "YES" maka tuliskan "1" dan jika "NO" maka tuliskan "0"</span></Typography>
            <Typography variant="body2" sx={{ color: '#334155', mb: 1, display: 'flex', gap: 1 }}><span>3.</span> <span>Pilihan BPJS TK Type dituliskan "Variable" atau "Fix" atau "None"</span></Typography>
            <Typography variant="body2" sx={{ color: '#334155', mb: 1, display: 'flex', gap: 1 }}><span>4.</span> <span>Pilihan Works Days dituliskan "5+2" atau "6+1"</span></Typography>
            <Typography variant="body2" sx={{ color: '#334155', mb: 1, display: 'flex', gap: 1 }}><span>5.</span> <span>Untuk Status Asuransi yang ditanggung perusahaan input angka "1" dan yang ditanggung karyawan "2".</span></Typography>
            <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700, display: 'flex', gap: 1 }}><span>6.</span> <span>Untuk penulisan nominal hanya berupa angka tidak boleh ada huruf dan karakter ( ! @ # $ % ^ & * ( ) _ + - =  [ ] | \ ; : ' " , . &lt; &gt; / ?)</span></Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

const UpdateClientForm = ({ onCancel, selectedIds, mockData }) => {
  const [selectedKategori, setSelectedKategori] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAwalTahun, setIsAwalTahun] = useState(false);
  const [hasKaryawanBaru, setHasKaryawanBaru] = useState(false);

  const [updateSalaryType, setUpdateSalaryType] = useState('');
  const [updateWorkDay, setUpdateWorkDay] = useState('');
  const [tunjanganTetap, setTunjanganTetap] = useState([]);
  const [tunjanganTidakTetap, setTunjanganTidakTetap] = useState([]);
  const [tunjanganBedaPeriode, setTunjanganBedaPeriode] = useState(false);
  const [persenBpjsKesehatan, setPersenBpjsKesehatan] = useState('1');
  const [bpjsKetenagakerjaan, setBpjsKetenagakerjaan] = useState('');
  const [komponenUpah, setKomponenUpah] = useState([]);
  const [bpjsTkType, setBpjsTkType] = useState('');
  const [komponenLembur, setKomponenLembur] = useState([]);
  const [ditanggungOleh, setDitanggungOleh] = useState('');
  const [asuransiKesehatan, setAsuransiKesehatan] = useState('');
  const [asuransiKecelakaan, setAsuransiKecelakaan] = useState('');
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const { allowances, bpjsKetenagakerjaan: bpjsKetOptions, ditanggungOleh: ditanggungOlehOptions, komponenUpah: komponenUpahOptions } = useDynamicClientDropdowns();

  const handleUpdateSalaryTypeChange = (val) => {
    setUpdateSalaryType(val);
  };

  const handleUpdateWorkDayChange = (val) => {
    setUpdateWorkDay(val);
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
      const token = localStorage.getItem('token');
      const response = await axios({
        url: `${API_URL}/api/master-client/download-template`,
        method: 'GET',
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Template_Client.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading template", error);
      alert('Gagal mengunduh template.');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_URL}/api/master-client/update-preview`, selectedIds, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const fetchedData = res.data || [];
        setUpdateData(fetchedData);
        
        // logic awal tahun & karyawan baru
        const currentMonth = new Date().getMonth(); // 0 is January
        const currentYear = new Date().getFullYear();
        setIsAwalTahun(currentMonth === 0); // true if January
        
        // check if any fetched data has created_date in the current month & year
        const isBaru = fetchedData.some(d => {
           if (!d.created_date) return false;
           const date = new Date(d.created_date);
           return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });
        setHasKaryawanBaru(isBaru);

      } catch (err) {
        console.error('Failed to fetch update preview', err);
      } finally {
        setLoading(false);
      }
    };
    if (selectedIds && selectedIds.length > 0) {
      fetchData();
    }
  }, [selectedIds]);
  
  const handleKategoriChange = (kategori) => {
    if (selectedKategori.includes(kategori)) {
      setSelectedKategori(selectedKategori.filter(k => k !== kategori));
    } else {
      setSelectedKategori([...selectedKategori, kategori]);
    }
  };

  let kategoriList = [
    'Salary Type', 'Work Day', 'Manajemen Fee',
    'Kategori Tunjangan', 'Kategori BPJS', 'Komponen Lembur',
    'Asuransi', 'Nominal Tunjangan'
  ];

  if (isAwalTahun && hasKaryawanBaru) {
    kategoriList.splice(3, 0, 'Komponen Project', 'Metode Pajak');
  }

  const updateColumns = updateData.length > 0 
    ? Object.keys(updateData[0])
        .filter(key => key !== 'id' && key !== 'created_date')
        .map(key => ({
          field: key,
          label: key,
          render: (row) => <Typography sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              {row[key] !== null && row[key] !== undefined ? row[key].toString() : '-'}
            </Typography>
        }))
    : [];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onCancel}
          sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none', borderColor: '#3b82f6', color: '#3b82f6' }}
        >
          Kembali
        </Button>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Update Client</Typography>
          <Typography variant="body2" color="text.secondary">Perbarui data komponen payroll untuk client yang dipilih</Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'white', border: '1px solid #e2e8f0', mb: 3 }} elevation={0}>
        <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 2 }}>Kategori</Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#334155', fontWeight: 600 }}>Berikut ini adalah daftar kategori komponen payroll yang tersedia untuk pembaruan di Master Client:</Typography>
        
        <Stack spacing={0}>
          {kategoriList.map(kat => (
            <FormControlLabel 
              key={kat} 
              control={<Checkbox size="small" checked={selectedKategori.includes(kat)} onChange={() => handleKategoriChange(kat)} />} 
              label={<Typography variant="body2" color="text.secondary" fontWeight={selectedKategori.includes(kat) ? 600 : 400}>{kat}</Typography>} 
            />
          ))}
        </Stack>
        
        <Box sx={{ mt: 4, overflowX: 'auto' }}>
          <DataTable 
            columns={updateColumns} 
            data={updateData} 
            loading={loading}
            page={1}
            pageSize={updateData.length > 0 ? updateData.length : 10}
            totalElements={updateData.length}
            totalPages={1}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
            headerBg="#f8fafc"
            headerColor="#1e293b"
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'white', border: '1px solid #e2e8f0', mb: 3 }} elevation={0}>
        <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3 }}>Komponen Payroll</Typography>
        
        <Stack spacing={2.5}>
          {selectedKategori.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, fontStyle: 'italic' }}>
              Silakan centang kategori di atas untuk memunculkan form pembaruan data.
            </Typography>
          )}
          
          {selectedKategori.includes('Salary Type') && (
            <FormRow label="Salary Type" maxWidth={400}><SearchableSelect placeholder="--PILIH--" options={['Variable', 'Fix', 'Daily', 'Allowance']} value={updateSalaryType} onChange={handleUpdateSalaryTypeChange} /></FormRow>
          )}
          {selectedKategori.includes('Work Day') && (
            <FormRow label="Work Day" maxWidth={400}><SearchableSelect placeholder="--PILIH--" options={['5+2', '6+1']} value={updateWorkDay} onChange={handleUpdateWorkDayChange} /></FormRow>
          )}
          {selectedKategori.includes('Manajemen Fee') && (
            <FormRow label="Manajemen Fee Dalam (%)" maxWidth={400}><TextField size="small" fullWidth defaultValue="0.0" /></FormRow>
          )}
          {selectedKategori.includes('Komponen Project') && (
            <FormRow label="Komponen Project" maxWidth={400}><SearchableSelect placeholder="--PILIH--" options={['Gross', 'Net']} /></FormRow>
          )}
          {selectedKategori.includes('Metode Pajak') && (
            <FormRow label="Metode Pajak" maxWidth={400}><SearchableSelect placeholder="--PILIH--" options={['Gross', 'Net']} /></FormRow>
          )}
          {selectedKategori.includes('Kategori Tunjangan') && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', pb: 1, mb: 2 }}>Kategori Tunjangan</Typography>
              <Stack spacing={2.5}>
                <FormRow label="Tunjangan Tetap" maxWidth={400}>
                  <SearchableSelect placeholder="--Pilih--" options={allowances} multiple={true} value={tunjanganTetap} onChange={(val) => setTunjanganTetap(val)} />
                </FormRow>
                <FormRow label="Tunjangan Tidak Tetap" maxWidth={400}>
                  <SearchableSelect placeholder="--Pilih--" options={allowances} multiple={true} value={tunjanganTidakTetap} onChange={(val) => setTunjanganTidakTetap(val)} />
                </FormRow>
                <FormRow label="" maxWidth={400}>
                  <FormControlLabel control={<Checkbox size="small" checked={tunjanganBedaPeriode} onChange={(e) => setTunjanganBedaPeriode(e.target.checked)} />} label={<Typography variant="body2" color="text.secondary" fontWeight={600}>Tunjangan Beda Periode</Typography>} />
                </FormRow>
              </Stack>
            </Box>
          )}
          {selectedKategori.includes('Kategori BPJS') && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', pb: 1, mb: 2 }}>Kategori BPJS</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2.5}>
                    <FormRow label="BPJS TK Type" alignTop maxWidth={400}>
                      <SearchableSelect placeholder="--Pilih--" options={['Variable', 'Fix', 'None']} value={bpjsTkType} onChange={val => setBpjsTkType(val)} />
                    </FormRow>
                    <FormRow label="Persen BPJS Kesehatan" alignTop maxWidth={400}>
                      <FormControl component="fieldset">
                        <RadioGroup value={persenBpjsKesehatan} onChange={(e) => setPersenBpjsKesehatan(e.target.value)}>
                          <FormControlLabel value="1" control={<Radio size="small" />} label={<Typography variant="body2">Perusahaan 5%</Typography>} sx={{ mb: -1 }} />
                          <FormControlLabel value="2" control={<Radio size="small" />} label={<Typography variant="body2">Perusahaan 4% dan Karyawan 1%</Typography>} sx={{ mb: -1 }} />
                          <FormControlLabel value="3" control={<Radio size="small" />} label={<Typography variant="body2">Karyawan 5%</Typography>} />
                        </RadioGroup>
                      </FormControl>
                    </FormRow>
                    <FormRow label="BPJS Ketenagakerjaan" maxWidth={400}>
                      <SearchableSelect placeholder="--Pilih--" options={bpjsKetOptions || []} value={bpjsKetenagakerjaan} onChange={val => setBpjsKetenagakerjaan(val)} />
                    </FormRow>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2.5}>
                    <FormRow label="Komponen Upah BPJS TK" alignTop maxWidth={400}>
                      <SearchableSelect multiple={true} placeholder="--Pilih--" options={komponenUpahOptions || []} value={komponenUpah} onChange={val => setKomponenUpah(val)} />
                    </FormRow>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          )}
          {selectedKategori.includes('Komponen Lembur') && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', pb: 1, mb: 2 }}>Komponen Lembur</Typography>
              <Stack spacing={2.5}>
                <FormRow label="Komponen Lembur" alignTop maxWidth={400}>
                  <SearchableSelect multiple={true} placeholder="--Pilih--" options={komponenUpahOptions || []} value={komponenLembur} onChange={val => setKomponenLembur(val)} />
                </FormRow>
              </Stack>
            </Box>
          )}
          {selectedKategori.includes('Asuransi') && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', pb: 1, mb: 2 }}>Kategori Asuransi</Typography>
              <Stack spacing={2.5}>
                <FormRow label="Ditanggung oleh" maxWidth={400}>
                  <SearchableSelect placeholder="--PILIH--" options={ditanggungOlehOptions} value={ditanggungOleh} onChange={val => setDitanggungOleh(val)} />
                </FormRow>
              </Stack>
            </Box>
          )}
          {selectedKategori.includes('Nominal Tunjangan') && (
            <Box sx={{ mt: 3, mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', pb: 1, mb: 2 }}>Update Nominal</Typography>
              <FormRow label="File" maxWidth="100%">
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField 
                    size="small" 
                    placeholder="Choose File" 
                    disabled 
                    sx={{ width: 400, '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' } }} 
                    InputProps={{
                      endAdornment: (
                        <IconButton size="small" sx={{ color: '#22c55e' }}>
                          <AttachFileIcon />
                        </IconButton>
                      )
                    }}
                  />
                  <Button variant="contained" sx={{ bgcolor: '#f0f9ff', color: '#0369a1', boxShadow: 'none', border: '1px solid #bae6fd', '&:hover': { bgcolor: '#e0f2fe', boxShadow: 'none' }, textTransform: 'none', fontWeight: 600 }}>
                    Upload
                  </Button>
                  <Button disabled={isDownloadingTemplate} onClick={handleDownloadTemplate} variant="contained" sx={{ bgcolor: '#f0f9ff', color: '#0369a1', boxShadow: 'none', border: '1px solid #bae6fd', '&:hover': { bgcolor: '#e0f2fe', boxShadow: 'none' }, textTransform: 'none', fontWeight: 600 }}>
                    {isDownloadingTemplate ? <CircularProgress size={24} sx={{ color: '#0369a1' }} /> : 'Download Template'}
                  </Button>
                </Stack>
              </FormRow>

              <Box sx={{ mt: 2, p: 3, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>Kriteria penginputan data :</Typography>
                <Typography variant="body2" sx={{ color: '#334155', mb: 1, display: 'flex', gap: 1 }}><span>1.</span> <span>Pastikan kategori tunjangan telah sesuai dengan nominal yang ingin diinput</span></Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700, display: 'flex', gap: 1 }}><span>2.</span> <span>Untuk penulisan nominal hanya berupa angka tidak boleh ada huruf dan karakter ( ! @ # $ % ^ & * ( ) _ + - = {"{"} {"}"} [ ] | \ ; : ' " , . &lt; &gt; / ?)</span></Typography>
              </Box>
            </Box>
          )}
        </Stack>
        
        {selectedKategori.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button variant="contained" sx={{ bgcolor: '#3b82f6', color: 'white', '&:hover': { bgcolor: '#2563eb' }, px: 6, py: 1.5, fontWeight: 700, borderRadius: '8px', minWidth: 160 }}>
              UPDATE
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

const MasterClient = () => {
  const { user } = useSelector((state) => state.auth || {});
  const [viewMode, setViewMode] = useState('list');
  const [role, setRole] = useState('STAFF');

  // Auto-detect role from logged in user
  useEffect(() => {
    if (user?.position?.toUpperCase()?.trim() === 'SPV') {
      setRole('SPV');
    }
  }, [user]);
  // Dummy State for filters
  const [search, setSearch] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [division, setDivision] = useState('');
  const [divisionError, setDivisionError] = useState(false);
  const [unit, setUnit] = useState('');
  const [position, setPosition] = useState('');
  const [branch, setBranch] = useState('');
  const [status, setStatus] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  
  // Dummy State for Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Dummy Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  
  // History State
  const [openHistory, setOpenHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyDivision, setHistoryDivision] = useState('');
  const [historyUnit, setHistoryUnit] = useState('');
  const [historyPosition, setHistoryPosition] = useState('');
  const [historyBranch, setHistoryBranch] = useState('');
  
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [historyTotalElements, setHistoryTotalElements] = useState(0);
  
  // Delete Dialog State
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Dropdown Options State
  const [dropdowns, setDropdowns] = useState({
    divisions: [],
    units: [],
    positions: [],
    branches: [],
    employeeTypes: []
  });

  const fetchDropdowns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/master-employee/dropdowns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && Object.keys(res.data).length > 0) {
        setDropdowns(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch dropdowns:', error);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const mainDropdowns = useCascadingDropdowns(dropdowns.combinations || [], { division, unit, position, employeeType, branch });
  const historyDropdowns = useCascadingDropdowns(dropdowns.combinations || [], { division: historyDivision, unit: historyUnit, position: historyPosition, branch: historyBranch });

  const divisions = mainDropdowns.divisions || [];
  const units = mainDropdowns.units || [];
  const positions = mainDropdowns.positions || [];
  const branches = mainDropdowns.branches || [];
  //const employeeTypes = mainDropdowns.employeeTypes || ['REGULER', 'WNA', 'MAGANG'];

  const histDivisions = historyDropdowns.divisions || [];
  const histUnits = historyDropdowns.units || [];
  const histPositions = historyDropdowns.positions || [];
  const histBranches = historyDropdowns.branches || [];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = role === 'SPV' ? `${API_URL}/api/master-client/spv/list?page=${page - 1}&size=${pageSize}` : `${API_URL}/api/master-client/staff/list?page=${page - 1}&size=${pageSize}`;
      const payload = {
        search,
        division,
        unitName: unit,
        position,
        branch,
        employeeType,
        status: role === 'SPV' ? status : undefined,
      };
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'user-id': user?.id || (role === 'SPV' ? 15 : 16),
        'fullname': user?.username || (role === 'SPV' ? 'SPV HRD' : 'Staff HRD')
      };
      
      const response = await axios.post(endpoint, payload, { headers });
      
      if (response.data && response.data.content !== undefined) {
        setData(response.data.content);
        setTotalElements(response.data.totalElements || response.data.content.length);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setData(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Gagal mengambil data dari server', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, page, pageSize, search, division, unit, position, branch, employeeType, status]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const fetchHistoryData = async () => {
    setHistoryLoading(true);
    try {
      const endpoint = `${API_URL}/api/master-client/${role.toLowerCase()}/history?page=${historyPage - 1}&size=${historyPageSize}`;
      const payload = {
        search: historySearch,
        division: historyDivision,
        unitName: historyUnit,
        position: historyPosition,
        branch: historyBranch
      };
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'user-id': user?.id || (role === 'SPV' ? 15 : 16),
        'fullname': user?.username || (role === 'SPV' ? 'SPV HRD' : 'Staff HRD')
      };
      
      const response = await axios.post(endpoint, payload, { headers });
      
      if (response.data && response.data.content !== undefined) {
        setHistoryData(response.data.content);
        setHistoryTotalElements(response.data.totalElements || response.data.content.length);
      } else {
        setHistoryData(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching history data:', error);
      setSnackbar({ open: true, message: 'Gagal mengambil data history dari server', severity: 'error' });
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (openHistory) {
      fetchHistoryData();
    }
  }, [openHistory, role, historyPage, historyPageSize, historySearch, historyDivision, historyUnit, historyPosition, historyBranch]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleExport = async () => {
    if (!division) {
      setDivisionError(true);
      return;
    }
    setSnackbar({ open: true, message: 'Memulai proses export data...', severity: 'info' });
    try {
      const endpoint = role === 'SPV' ? `${API_URL}/api/master-client/spv/export` : `${API_URL}/api/master-client/staff/export`;
      const payload = {
        search,
        division,
        unitName: unit,
        position,
        branch,
        status: role === 'SPV' ? status : undefined,
        ids: selectedIds.length > 0 ? selectedIds : undefined
      };
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'user-id': user?.id || 1,
        'fullname': user?.username || (role === 'SPV' ? 'SPV HRD' : 'Staff HRD'),
        'upliner-name': 'SPV HRD' // Default mock upliner
      };
      
      const response = await axios.post(endpoint, payload, { headers, responseType: 'blob' });
      // Logic for downloading blob... (Assuming backend returns excel or json)
      // Since backend currently returns JSON, we will just stringify it for demo, 
      // but if it's JSON array, we can trigger CSV/Excel download. 
      // Since the backend returns `List<MasterClientResponseDTO>`, we should create a CSV string.
      setSnackbar({ open: true, message: 'Data berhasil diexport (Simulasi, data json diterima)!', severity: 'success' });
      console.log('Export Data:', response.data);
    } catch (error) {
      console.error('Error exporting data:', error);
      setSnackbar({ open: true, message: 'Gagal melakukan export', severity: 'error' });
    }
  };

  const handleOpenEdit = (row) => {
    setEditData(row);
    setViewMode('editClient');
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockData.length) {
      setSelectedIds([]); // Uncheck all if all are selected
    } else {
      setSelectedIds(mockData.map(d => d.id)); // Check all on current page
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const columns = [
    { 
      id: 'checkbox', 
      label: <Checkbox size="small" checked={selectedIds.length === data.length && data.length > 0} onChange={handleSelectAll} />, 
      render: (row) => (
        <Checkbox 
          size="small" 
          checked={selectedIds.includes(row.id)}
          onChange={() => handleSelectOne(row.id)}
        />
      )
    },
    { id: 'division', label: 'Division', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.division}</Typography> },
    { id: 'unit', label: 'Unit', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.unit}</Typography> },
    { id: 'position', label: 'Position', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.position}</Typography> },
    { id: 'branch', label: 'Branch', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.branch}</Typography> },
    { id: 'employeeType', label: 'Employee Type', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.employeeType}</Typography> },
    { id: 'createdDate', label: 'Created Date', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.createdDate}</Typography> },
    { id: 'updateDate', label: 'Update Date', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.updateDate || '-'}</Typography> },
    { id: 'createdBy', label: 'Created By', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.createdBy}</Typography> },
    { 
      id: 'status', 
      label: 'Status', 
      render: (row) => (
        <Chip 
          label={row.status} 
          size="small" 
          color={row.status === 'APPROVED' ? 'success' : 'primary'} 
          sx={{ fontSize: '0.7rem', height: 20 }} 
        />
      ) 
    },
    ...(role === 'SPV' ? [{ 
      id: 'keterangan', 
      label: 'Keterangan', 
      render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.status === 'REQUEST' ? 'Update pada Kategori Tunjangan, Nominal Tunjangan' : ''}</Typography> 
    }] : []),
    { 
      id: 'actions', 
      label: '', 
      render: (row) => role === 'SPV' ? (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" sx={{ color: '#f59e0b', bgcolor: '#fef3c7', borderRadius: '50%', '&:hover': { bgcolor: '#fde68a' } }} onClick={() => handleOpenEdit(row)}>
             <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" sx={{ color: '#ef4444', bgcolor: '#fee2e2', borderRadius: '50%', '&:hover': { bgcolor: '#fecaca' } }} onClick={() => { setDeleteId(row.id); setOpenDeleteDialog(true); }}>
             <RemoveCircleIcon fontSize="small" />
          </IconButton>
        </Stack>
      ) : (
        <IconButton size="small" sx={{ color: '#f59e0b' }} onClick={() => handleOpenEdit(row)}>
          <EditIcon fontSize="small" />
        </IconButton>
      ) 
    }
  ];

  const historyColumns = [
    { id: 'division', label: 'Division', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.division}</Typography> },
    { id: 'unit', label: 'Unit', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.unit}</Typography> },
    { id: 'position', label: 'Position', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.position}</Typography> },
    { id: 'branch', label: 'Branch', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.branch}</Typography> },
    { id: 'employeeType', label: 'Employee Type', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.employeeType}</Typography> },
    { id: 'createdDate', label: 'Created Date', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.createdDate}</Typography> },
    { id: 'createdBy', label: 'Created By', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.createdBy}</Typography> },
    { id: 'status', label: 'Status', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.status}</Typography> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {viewMode === 'list' ? (
        <>
          {/* Header Modern 52x52 Badge */}
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
                <CompareArrowsIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
                  Master Client
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                  Kelola konfigurasi divisi, unit kerja, posisi, branch, dan komponen payroll client
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => setOpenHistory(true)}
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
                LOG HISTORY
              </Button>
              {role === 'STAFF' && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAddDialog(true)}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 2.5,
                    py: 1,
                    bgcolor: 'primary.main',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  ADD CLIENT
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
                <CompareArrowsIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Total Client
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {totalElements} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>records</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Konfigurasi client aktif
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
                <InfoIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Division Aktif
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {divisions.length} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>divisi</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Terdaftar dalam sistem
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
                <EditIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Position & Unit
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {positions.length} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>posisi</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  {units.length} Unit kerja terhubung
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
                <ExportIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  Branch Coverage
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                  {branches.length} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 500, color: 'text.secondary' }}>cabang</Box>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Distribusi area kerja
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Filter Panel */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}
          >
            <Stack spacing={2}>
              {/* Row 1: Search, SEARCH button, CLEAR button */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr auto' }, gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Cari Division, Unit, Posisi, atau Branch..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchData(); } }}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc'
                    }
                  }}
                />
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Button
                    variant="contained"
                    onClick={() => { setPage(1); fetchData(); }}
                    sx={{
                      bgcolor: '#1e293b',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2.5,
                      px: 3,
                      height: 40,
                      '&:hover': { bgcolor: '#0f172a' }
                    }}
                  >
                    SEARCH
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearch('');
                      setDivision('');
                      setUnit('');
                      setPosition('');
                      setBranch('');
                      setEmployeeType('');
                      setStatus('');
                      setPage(1);
                    }}
                    sx={{
                      borderRadius: 2.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      height: 40,
                      px: 2.5,
                      borderColor: 'divider',
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    CLEAR
                  </Button>
                </Stack>
              </Box>

              {/* Row 2: Cascading SearchableSelect Filters */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: role === 'SPV' ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)' }, gap: 1.5 }}>
                <SearchableSelect 
                  freeSolo={true}
                  placeholder="(Division)" 
                  value={division} 
                  onChange={(val) => {
                    setDivision(val);
                    if (val && divisionError) setDivisionError(false);
                  }} 
                  options={divisions} 
                  error={divisionError}
                  helperText={divisionError ? "Harap di isi" : ""}
                />
                <SearchableSelect freeSolo={true} placeholder="(Unit)" value={unit} onChange={setUnit} options={units} />
                <SearchableSelect freeSolo={true} placeholder="(Position)" value={position} onChange={setPosition} options={positions} />
                <SearchableSelect freeSolo={true} placeholder="(Branch)" value={branch} onChange={setBranch} options={branches} />
                {role === 'SPV' && (
                  <SearchableSelect 
                    placeholder="(Status)" 
                    value={status} 
                    onChange={setStatus} 
                    options={['REQUEST', 'APPROVED', 'REJECTED']} 
                  />
                )}
              </Box>
            </Stack>
          </Paper>

          {/* ACTION TOOLBAR DIRECTLY ABOVE DATATABLE */}
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              px: 2,
              mb: 2,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.4)' : '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Aksi Master Client:
              </Typography>
              {selectedIds.length > 0 ? (
                <Chip
                  label={`${selectedIds.length} data dipilih`}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700, fontSize: '0.75rem', borderRadius: 2 }}
                />
              ) : (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  (Pilih checklist baris untuk eksekusi aksi)
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              {role === 'SPV' && (
                <Button 
                  variant="contained" 
                  disabled={selectedIds.length === 0}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 700, 
                    borderRadius: 2.5, 
                    bgcolor: '#10b981', 
                    color: 'white',
                    px: 2.5,
                    '&:hover': { bgcolor: '#059669' } 
                  }}
                  onClick={() => {
                    if (selectedIds.length === 0) {
                      setSnackbar({ open: true, message: 'Pilih/Checklist data terlebih dahulu sebelum melakukan approve!', severity: 'error' });
                    } else {
                      setSnackbar({ open: true, message: `Berhasil menyetujui ${selectedIds.length} data client!`, severity: 'success' });
                      setSelectedIds([]);
                      fetchData();
                    }
                  }}
                >
                  APPROVE ({selectedIds.length})
                </Button>
              )}

              {role === 'STAFF' && (
                <Button 
                  variant="outlined" 
                  disabled={selectedIds.length === 0}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 700, 
                    borderRadius: 2.5,
                    px: 2.5,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.08)' }
                  }}
                  onClick={() => {
                    if (selectedIds.length === 0) {
                      setSnackbar({ open: true, message: 'Pilih/Checklist data terlebih dahulu sebelum melakukan update!', severity: 'error' });
                    } else {
                      setViewMode('update');
                    }
                  }}
                >
                  UPDATE ({selectedIds.length})
                </Button>
              )}

              <Button 
                variant="outlined" 
                startIcon={<ExportIcon />}
                onClick={handleExport}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 700, 
                  borderRadius: 2.5,
                  px: 2.5,
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                EXPORT
              </Button>
            </Stack>
          </Paper>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            page={page}
            pageSize={pageSize}
            totalElements={totalElements}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      ) : viewMode === 'addManual' ? (
        <AddClientForm onCancel={(shouldReload) => { 
          setViewMode('list'); 
          if (shouldReload === true) {
            setSearch('');
            setDivision('');
            setUnit('');
            setPosition('');
            setBranch('');
            setEmployeeType('');
            setTimeout(() => { fetchData(); }, 100);
          } 
        }} />
      ) : viewMode === 'addUpload' ? (
        <UploadClientForm onCancel={() => setViewMode('list')} />
      ) : viewMode === 'editClient' ? (
        <EditClientForm onCancel={() => setViewMode('list')} data={editData} />
      ) : viewMode === 'update' ? (
        <UpdateClientForm onCancel={() => setViewMode('list')} selectedIds={selectedIds} mockData={data} />
      ) : null}

      {/* Dialog ADD Options */}
      <CustomModal open={openAddDialog} onClose={() => setOpenAddDialog(false)} title="Information" maxWidth="xs">
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
            <InfoIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Pilihan Input Data
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              variant="outlined" 
              onClick={() => { setOpenAddDialog(false); setViewMode('addManual'); }}
              sx={{ flex: 1, py: 1, borderRadius: '8px', fontWeight: 600, textTransform: 'none' }}
            >
              Manual
            </Button>
            <Button 
              variant="contained" 
              onClick={() => { setOpenAddDialog(false); setViewMode('addUpload'); }}
              sx={{ flex: 1, py: 1, borderRadius: '8px', fontWeight: 600, textTransform: 'none', bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
            >
              Upload
            </Button>
          </Stack>
      </CustomModal>

      {/* Modal History Log */}
      <CustomModal open={openHistory} onClose={() => setOpenHistory(false)} title="History Master Client" maxWidth="lg">
          <Stack spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField 
                size="small" 
                placeholder="Search..." 
                value={historySearch} 
                onChange={(e) => setHistorySearch(e.target.value)} 
                sx={{ width: 250 }} 
              />
              <Button 
                variant="contained" 
                size="small" 
                sx={{ height: '40px', bgcolor: '#f1f5f9', color: '#1e293b', boxShadow: 'none', border: '1px solid #cbd5e1', '&:hover': { bgcolor: '#e2e8f0' } }}
              >
                Search
              </Button>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <SearchableSelect freeSolo={true} placeholder="(Division)" value={historyDivision} onChange={setHistoryDivision} options={histDivisions} minWidth={250} />
              <SearchableSelect freeSolo={true} placeholder="(Unit)" value={historyUnit} onChange={setHistoryUnit} options={histUnits} minWidth={250} />
              <SearchableSelect freeSolo={true} placeholder="(Position)" value={historyPosition} onChange={setHistoryPosition} options={histPositions} minWidth={250} />
            </Stack>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <SearchableSelect freeSolo={true} placeholder="(Branch)" value={historyBranch} onChange={setHistoryBranch} options={histBranches} minWidth={250} />
              <Typography variant="body2" sx={{ mx: 1, fontWeight: 600 }}>Periode</Typography>
              <TextField type="date" size="small" sx={{ width: 160 }} InputLabelProps={{ shrink: true }} />
              <Typography variant="body2">-</Typography>
              <TextField type="date" size="small" sx={{ width: 160 }} InputLabelProps={{ shrink: true }} />
            </Stack>
          </Stack>
          
          <Box sx={{ mt: 3 }}>
            <DataTable 
              columns={historyColumns} 
              data={historyData} 
              page={historyPage} 
              pageSize={historyPageSize} 
              totalElements={historyTotalElements} 
              totalPages={Math.ceil(historyTotalElements / historyPageSize) || 1} 
              onPageChange={setHistoryPage} 
              onPageSizeChange={setHistoryPageSize} 
              loading={historyLoading}
              headerBg="#f8fafc"
              headerColor="#1e293b"
            />
          </Box>
      </CustomModal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1e293b' }}>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Batal</Button>
          <Button 
            onClick={() => {
              setSnackbar({ open: true, message: 'Data berhasil dihapus!', severity: 'success' });
              setOpenDeleteDialog(false);
              setDeleteId(null);
            }} 
            variant="contained" 
            color="error" 
            sx={{ fontWeight: 600, borderRadius: 1 }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MasterClient;
