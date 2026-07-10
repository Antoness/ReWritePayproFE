import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Box, Typography, Paper, Grid, TextField, Button, Stack, Chip, Checkbox, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, RadioGroup, FormControlLabel, Radio, FormControl,
  Snackbar, Alert, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { 
  Search as SearchIcon, Add as AddIcon, Edit as EditIcon, 
  GetApp as ExportIcon, History as HistoryIcon, Close as CloseIcon, Info as InfoIcon,
  ArrowBack as ArrowBackIcon, AttachFile as AttachFileIcon,
  CompareArrows as CompareArrowsIcon, RemoveCircle as RemoveCircleIcon
} from '@mui/icons-material';
import SearchableSelect from '../../components/Common/SearchableSelect';
import DataTable from '../../components/Common/DataTable';

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
  const [tunjanganTetap, setTunjanganTetap] = useState([]);
  const [tunjanganTidakTetap, setTunjanganTidakTetap] = useState([]);
  const [activeTab, setActiveTab] = useState('tunjangan');

  const tunjanganOptions = [
    'Tunjangan Supervisor', 'Tunjangan Jabatan', 'Skill Allowance',
    'Grading Allowance', 'Montly Allowance', 'Performance Allowance',
    'Position Allowance', 'Tunjangan Bensin'
  ];

  const allSelectedTunjangan = [...new Set([...tunjanganTetap, ...tunjanganTidakTetap])];

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
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Add Client</Typography>
          <Typography variant="body2" color="text.secondary">Tambah data divisi, unit, posisi, dan branch baru ke dalam sistem</Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'white', border: '1px solid #e2e8f0', mb: 3 }} elevation={0}>
        
        {/* DATA CLIENT SECTION */}
        <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3 }}>Data Client</Typography>
        <Grid container spacing={6}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Division"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Unit Name"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Position"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Employee Type"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Branch"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Salary Type"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Nominal"><TextField fullWidth size="small" /></FormRow>
            </Stack>
          </Grid>
          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Works Days"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="BPJS TK Type"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Manajemen Fee (%)"><TextField fullWidth size="small" defaultValue="0" /></FormRow>
              <FormRow label="Metode Pajak"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Komponen Project"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* BPJS SECTION */}
        <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>BPJS</Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Persen BPJS Kesehatan" alignTop>
                <FormControl component="fieldset">
                  <RadioGroup defaultValue="1">
                    <FormControlLabel value="1" control={<Radio size="small" />} label={<Typography variant="body2">Perusahaan 5%</Typography>} sx={{ mb: -1 }} />
                    <FormControlLabel value="2" control={<Radio size="small" />} label={<Typography variant="body2">Perusahaan 4% dan Karyawan 1%</Typography>} sx={{ mb: -1 }} />
                    <FormControlLabel value="3" control={<Radio size="small" />} label={<Typography variant="body2">Karyawan 5%</Typography>} />
                  </RadioGroup>
                </FormControl>
              </FormRow>
              <FormRow label="BPJS Ketenagakerjaan"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Komponen Upah"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Komponen Lembur"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* SPECIAL TREATMENT & KATEGORI TUNJANGAN SECTION */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Special Treatment</Typography>
            <Stack spacing={2.5}>
              <FormRow label="Biaya Jasa"><TextField fullWidth size="small" /></FormRow>
              <FormRow label="Training"><TextField fullWidth size="small" /></FormRow>
              <FormRow label="Bonus"><TextField fullWidth size="small" /></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Kategori Tunjangan</Typography>
            <Stack spacing={2.5}>
              <FormRow label="Tunjangan Tetap">
                <SearchableSelect 
                  placeholder="--Pilih--" 
                  options={tunjanganOptions} 
                  multiple={true}
                  value={tunjanganTetap}
                  onChange={(val) => setTunjanganTetap(val)}
                />
              </FormRow>
              <FormRow label="Tunjangan Tidak Tetap">
                <SearchableSelect 
                  placeholder="--Pilih--" 
                  options={tunjanganOptions} 
                  multiple={true}
                  value={tunjanganTidakTetap}
                  onChange={(val) => setTunjanganTidakTetap(val)}
                />
              </FormRow>
              <FormRow label="">
                <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2" color="text.secondary" fontWeight={600}>Tunjangan Beda Periode</Typography>} />
              </FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* ASURANSI SECTION */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Asuransi</Typography>
            <Stack spacing={2.5}>
              <FormRow label="Ditanggung oleh"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Asuransi Kesehatan"><TextField fullWidth size="small" /></FormRow>
              <FormRow label="Asuransi Kecelakaan"><TextField fullWidth size="small" /></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
             <Button variant="contained" sx={{ bgcolor: '#3b82f6', color: 'white', '&:hover': { bgcolor: '#2563eb' }, px: 6, py: 1.5, fontWeight: 700, borderRadius: '8px', minWidth: 160 }}>
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
                       <TextField fullWidth size="small" placeholder={`Nominal ${t}`} />
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
                     <FormRow label="Insentif"><TextField fullWidth size="small" /></FormRow>
                     <FormRow label="Lembur"><TextField fullWidth size="small" /></FormRow>
                     <FormRow label="Tunjangan Kesehatan"><TextField fullWidth size="small" /></FormRow>
                     <FormRow label="Performance Pay"><TextField fullWidth size="small" /></FormRow>
                   </Stack>
                 </Grid>
                 <Grid item xs={12} md={6}>
                   <Stack spacing={2.5}>
                     <FormRow label="Monthly Commision"><TextField fullWidth size="small" /></FormRow>
                     <FormRow label="Shift Allowance"><TextField fullWidth size="small" /></FormRow>
                     <FormRow label="THR"><TextField fullWidth size="small" /></FormRow>
                     <FormRow label="Kompensasi"><TextField fullWidth size="small" /></FormRow>
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
  const [tunjanganTetap, setTunjanganTetap] = useState(['Tunjangan Supervisor', 'Tunjangan Jabatan']);
  const [tunjanganTidakTetap, setTunjanganTidakTetap] = useState([]);
  const [activeTab, setActiveTab] = useState('tunjangan');

  const tunjanganOptions = [
    'Tunjangan Supervisor', 'Tunjangan Jabatan', 'Skill Allowance',
    'Grading Allowance', 'Montly Allowance', 'Performance Allowance',
    'Position Allowance', 'Tunjangan Bensin'
  ];

  const allSelectedTunjangan = [...new Set([...tunjanganTetap, ...tunjanganTidakTetap])];

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
              <FormRow label="Division"><SearchableSelect placeholder="--Pilih--" options={[]} value={data?.division} /></FormRow>
              <FormRow label="Unit Name"><SearchableSelect placeholder="--Pilih--" options={[]} value={data?.unit} /></FormRow>
              <FormRow label="Position"><SearchableSelect placeholder="--Pilih--" options={[]} value={data?.position} /></FormRow>
              <FormRow label="Employee Type"><SearchableSelect placeholder="--Pilih--" options={[]} value={data?.employeeType} /></FormRow>
              <FormRow label="Branch"><SearchableSelect placeholder="--Pilih--" options={[]} value={data?.branch} /></FormRow>
              <FormRow label="Salary Type"><SearchableSelect placeholder="--Pilih--" options={['Variable', 'Fix']} value="Variable" /></FormRow>
              <FormRow label="Nominal"><TextField fullWidth size="small" defaultValue="2,324,776" /></FormRow>
            </Stack>
          </Grid>
          {/* Right Column */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Works Days"><SearchableSelect placeholder="--Pilih--" options={['5+2', '6+1']} value="5+2" /></FormRow>
              <FormRow label="BPJS TK Type"><SearchableSelect placeholder="--Pilih--" options={['Variable', 'Fix']} value="Variable" /></FormRow>
              <FormRow label="Manajemen Fee (%)"><TextField fullWidth size="small" defaultValue="2.5" /></FormRow>
              <FormRow label="Metode Pajak"><SearchableSelect placeholder="--Pilih--" options={['Gross', 'Net']} value="Net" /></FormRow>
              <FormRow label="Komponen Project"><SearchableSelect placeholder="--Pilih--" options={['Gross', 'Net']} value="Gross" /></FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* BPJS SECTION */}
        <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>BPJS</Typography>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Persen BPJS Kesehatan" alignTop>
                <FormControl component="fieldset">
                  <RadioGroup defaultValue="2">
                    <FormControlLabel value="1" control={<Radio size="small" />} label={<Typography variant="body2">Perusahaan 5%</Typography>} sx={{ mb: -1 }} />
                    <FormControlLabel value="2" control={<Radio size="small" />} label={<Typography variant="body2">Perusahaan 4% dan Karyawan 1%</Typography>} sx={{ mb: -1 }} />
                    <FormControlLabel value="3" control={<Radio size="small" />} label={<Typography variant="body2">Karyawan 5%</Typography>} />
                  </RadioGroup>
                </FormControl>
              </FormRow>
              <FormRow label="BPJS Ketenagakerjaan"><SearchableSelect placeholder="--Pilih--" options={['Yes', 'No']} value="Yes" /></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2.5}>
              <FormRow label="Komponen Upah"><SearchableSelect placeholder="--Pilih--" options={['Salary']} value="Salary" /></FormRow>
              <FormRow label="Komponen Lembur"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* SPECIAL TREATMENT & KATEGORI TUNJANGAN SECTION */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Special Treatment</Typography>
            <Stack spacing={2.5}>
              <FormRow label="Biaya Jasa"><TextField fullWidth size="small" /></FormRow>
              <FormRow label="Training"><TextField fullWidth size="small" /></FormRow>
              <FormRow label="Bonus"><TextField fullWidth size="small" /></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Kategori Tunjangan</Typography>
            <Stack spacing={2.5}>
              <FormRow label="Tunjangan Tetap">
                <SearchableSelect 
                  placeholder="--Pilih--" 
                  options={tunjanganOptions} 
                  multiple={true}
                  value={tunjanganTetap}
                  onChange={(val) => setTunjanganTetap(val)}
                />
              </FormRow>
              <FormRow label="Tunjangan Tidak Tetap">
                <SearchableSelect 
                  placeholder="--Pilih--" 
                  options={tunjanganOptions} 
                  multiple={true}
                  value={tunjanganTidakTetap}
                  onChange={(val) => setTunjanganTidakTetap(val)}
                />
              </FormRow>
              <FormRow label="">
                <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2" color="text.secondary" fontWeight={600}>Tunjangan Beda Periode</Typography>} />
              </FormRow>
            </Stack>
          </Grid>
        </Grid>

        {/* ASURANSI SECTION */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: 1, mb: 3, mt: 5 }}>Asuransi</Typography>
            <Stack spacing={2.5}>
              <FormRow label="Ditanggung oleh"><SearchableSelect placeholder="--Pilih--" options={[]} /></FormRow>
              <FormRow label="Asuransi Kesehatan"><TextField fullWidth size="small" /></FormRow>
              <FormRow label="Asuransi Kecelakaan"><TextField fullWidth size="small" /></FormRow>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 2 }}>
             <Button variant="outlined" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', color: '#3b82f6', borderColor: '#3b82f6', px: 4 }}>
               DUPLIKAT
             </Button>
             <Button variant="contained" sx={{ bgcolor: '#3b82f6', color: 'white', '&:hover': { bgcolor: '#2563eb' }, px: 6, py: 1.5, fontWeight: 700, borderRadius: '8px', minWidth: 160 }}>
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
                       <TextField fullWidth size="small" defaultValue="1,000,000" />
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
                     <FormRow label="Insentif"><TextField fullWidth size="small" defaultValue="0" /></FormRow>
                     <FormRow label="Lembur"><TextField fullWidth size="small" defaultValue="0" /></FormRow>
                     <FormRow label="Tunjangan Kesehatan"><TextField fullWidth size="small" defaultValue="0" /></FormRow>
                     <FormRow label="Performance Pay"><TextField fullWidth size="small" defaultValue="0" /></FormRow>
                   </Stack>
                 </Grid>
                 <Grid item xs={12} md={6}>
                   <Stack spacing={2.5}>
                     <FormRow label="Monthly Commision"><TextField fullWidth size="small" defaultValue="0" /></FormRow>
                     <FormRow label="Shift Allowance"><TextField fullWidth size="small" defaultValue="0" /></FormRow>
                     <FormRow label="THR"><TextField fullWidth size="small" defaultValue="0" /></FormRow>
                     <FormRow label="Kompensasi"><TextField fullWidth size="small" defaultValue="0" /></FormRow>
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

const UploadClientForm = ({ onCancel }) => {
  const [tunjanganTetap, setTunjanganTetap] = useState([]);
  const [tunjanganTidakTetap, setTunjanganTidakTetap] = useState([]);
  
  const tunjanganOptions = [
    'Tunjangan Supervisor', 'Tunjangan Jabatan', 'Skill Allowance',
    'Grading Allowance', 'Montly Allowance', 'Performance Allowance',
    'Position Allowance', 'Tunjangan Bensin'
  ];

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
              options={tunjanganOptions} 
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
                  options={tunjanganOptions} 
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
              <Button variant="contained" sx={{ bgcolor: '#f0f9ff', color: '#0369a1', boxShadow: 'none', border: '1px solid #bae6fd', '&:hover': { bgcolor: '#e0f2fe', boxShadow: 'none' }, textTransform: 'none', fontWeight: 600 }}>
                Download Template
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
  
  const handleKategoriChange = (kategori) => {
    if (selectedKategori.includes(kategori)) {
      setSelectedKategori(selectedKategori.filter(k => k !== kategori));
    } else {
      setSelectedKategori([...selectedKategori, kategori]);
    }
  };

  const kategoriList = [
    'Salary Type', 'Work Day', 'Manajemen Fee', 'Komponen Project',
    'Metode Pajak', 'Kategori Tunjangan', 'Kategori BPJS', 'Komponen Lembur',
    'Asuransi', 'Nominal Tunjangan'
  ];

  const updateColumns = [
    { field: 'division', label: 'Division', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.division}</Typography> },
    { field: 'unit', label: 'Unit Name', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.unit}</Typography> },
    { field: 'position', label: 'Position', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.position}</Typography> },
    { field: 'branch', label: 'Branch', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.branch}</Typography> },
    { field: 'employeeType', label: 'Employee Type', render: (row) => <Typography sx={{ fontSize: '0.85rem' }}>{row.employeeType}</Typography> },
    { field: 'gajiPokok', label: 'Gaji Pokok', render: () => <Typography sx={{ fontSize: '0.85rem' }}>Rp.2,324,776</Typography> },
    { field: 'manajemenFee', label: 'Manajemen Fee', render: () => <Typography sx={{ fontSize: '0.85rem' }}>2.5</Typography> }
  ];

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
        
        <Box sx={{ mt: 4 }}>
          <DataTable 
            columns={updateColumns} 
            data={mockData.filter(d => selectedIds.includes(d.id))} 
            loading={false}
            page={1}
            pageSize={10}
            totalElements={selectedIds.length}
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
            <FormRow label="Salary Type" maxWidth={400}><SearchableSelect placeholder="--PILIH--" options={['Variable', 'Fix']} /></FormRow>
          )}
          {selectedKategori.includes('Work Day') && (
            <FormRow label="Work Day" maxWidth={400}><SearchableSelect placeholder="--PILIH--" options={['5+2', '6+1']} /></FormRow>
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
            <FormRow label="Kategori Tunjangan" maxWidth={400}><SearchableSelect placeholder="--PILIH--" options={['Tunjangan Supervisor', 'Tunjangan Jabatan']} /></FormRow>
          )}
          {selectedKategori.includes('Kategori BPJS') && (
            <FormRow label="Kategori BPJS" maxWidth={400}><SearchableSelect placeholder="--PILIH--" options={[]} /></FormRow>
          )}
          {selectedKategori.includes('Komponen Lembur') && (
            <FormRow label="Komponen Lembur" maxWidth={400}><SearchableSelect placeholder="--PILIH--" options={[]} /></FormRow>
          )}
          {selectedKategori.includes('Asuransi') && (
            <FormRow label="Asuransi" maxWidth={400}><SearchableSelect placeholder="--PILIH--" options={[]} /></FormRow>
          )}
          {selectedKategori.includes('Nominal Tunjangan') && (
            <FormRow label="Nominal Tunjangan" maxWidth={400}><TextField size="small" fullWidth /></FormRow>
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
  
  // Dummy State for Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Dummy Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  
  // History State
  const [openHistory, setOpenHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyDivision, setHistoryDivision] = useState('');
  const [historyUnit, setHistoryUnit] = useState('');
  const [historyPosition, setHistoryPosition] = useState('');
  const [historyBranch, setHistoryBranch] = useState('');
  
  // Delete Dialog State
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Dummy Dropdown Options
  const divisions = ['Business Development', 'Bank NEO Commerce', 'IT Programmer', 'Management', 'Operational'];
  const units = ['BCA', 'BNC Sales Quality Control', 'IT Programmer', 'EDC Machine', 'Sysmex', 'Laku Pandai'];
  const positions = ['Admin Support', 'Sales Quality Control', 'Admin Inputer', 'Mobile Sales', 'GM', 'Cook 3', 'PROGRAMMER', 'SUPERVISOR'];
  const branches = ['JAKARTA', 'TANGERANG', 'Johan Pahlawan', 'BANDUNG', 'BOGOR', 'Balikpapan'];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = role === 'SPV' ? 'http://localhost:8080/api/master-client/spv/list' : 'http://localhost:8080/api/master-client/staff/list';
      const payload = {
        search,
        division,
        unitName: unit,
        position,
        branch,
        status: role === 'SPV' ? status : undefined,
      };
      const headers = {
        'user-id': user?.id || 1,
        'fullname': user?.username || (role === 'SPV' ? 'SPV HRD' : 'Staff HRD')
      };
      
      const response = await axios.post(endpoint, payload, { headers });
      setData(response.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbar({ open: true, message: 'Gagal mengambil data dari server', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]); // Refetch when role changes

  const handleExport = async () => {
    if (!division) {
      setDivisionError(true);
      return;
    }
    setSnackbar({ open: true, message: 'Memulai proses export data...', severity: 'info' });
    try {
      const endpoint = role === 'SPV' ? 'http://localhost:8080/api/master-client/spv/export' : 'http://localhost:8080/api/master-client/staff/export';
      const payload = {
        search,
        division,
        unitName: unit,
        position,
        branch,
        status: role === 'SPV' ? status : undefined,
        ids: selectedIds.length > 0 ? selectedIds : undefined
      };
      const headers = {
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

  const dummyHistoryData = [
    { id: 1, division: 'Youtap Indonesia', unit: 'Youtap Indonesia (PKWT)', position: 'Content Writer', branch: 'JAKARTA', employeeType: 'PKWT', createdDate: '2026-07-08 10:42:37.0', createdBy: 'Staff HRD', status: 'PROCESSED' },
    { id: 2, division: 'Youtap Indonesia', unit: 'Youtap Indonesia (PKWT)', position: 'Content Writer', branch: 'JAKARTA', employeeType: 'PKWT', createdDate: '2026-07-08 10:41:22.0', createdBy: 'Staff HRD', status: 'PROCESSED' },
    { id: 3, division: 'Youtap Indonesia', unit: 'Youtap Indonesia (PKWT)', position: 'Content Writer', branch: 'JAKARTA', employeeType: 'PKWT', createdDate: '2026-07-08 10:40:56.0', createdBy: 'Staff HRD', status: 'PROCESSED' },
    { id: 4, division: 'Yup Paylater', unit: 'Yup Paylater', position: 'Mobile Sales', branch: 'JAKARTA', employeeType: 'MITRA', createdDate: '2026-07-07 11:39:47.0', createdBy: 'Staff HRD', status: 'PROCESSED' },
    { id: 5, division: 'Agriaku Digital Indonesia', unit: 'Agriaku', position: 'Account Executive', branch: 'INDRAMAYU', employeeType: 'PKWT', createdDate: '2026-07-07 10:43:02.0', createdBy: 'Staff HRD', status: 'PROCESSED' },
    { id: 6, division: 'MBA', unit: 'MBA', position: 'Desk Collection', branch: 'JAKARTA', employeeType: 'MAGANG', createdDate: '2026-07-07 10:03:20.0', createdBy: 'Staff HRD', status: 'PROCESSED' },
    { id: 7, division: 'MBA', unit: 'MBA', position: 'Desk Collection', branch: 'JAKARTA', employeeType: 'MAGANG', createdDate: '2026-07-07 10:02:29.0', createdBy: 'Staff HRD', status: 'PROCESSED' },
    { id: 8, division: 'MBA', unit: 'MBA', position: 'Desk Collection', branch: 'JAKARTA', employeeType: 'MAGANG', createdDate: '2026-07-07 10:02:12.0', createdBy: 'Staff HRD', status: 'PROCESSED' },
    { id: 9, division: 'Ananta Nadi Nusantara', unit: 'Ananta Nadi Nusantara', position: 'Sales Merchant Strategic', branch: 'Ponorogo', employeeType: 'PKWT', createdDate: '2026-07-03 14:12:30.0', createdBy: 'Staff HRD', status: 'PROCESSED' },
    { id: 10, division: 'IT, GA & Logistik', unit: 'General Affair/Logistik', position: 'Office Boy', branch: 'BOGOR', employeeType: 'MAGANG', createdDate: '2026-07-03 09:43:12.0', createdBy: 'Staff HRD', status: 'PROCESSED' }
  ];

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
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>Master Client</Typography>
            <Typography variant="body2" color="text.secondary">Kelola data divisi, unit, posisi, dan branch</Typography>
          </Box>

          {/* Filter Panel */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 4, bgcolor: '#f1f5f9' }} elevation={0}>
            <Stack spacing={2}>
              {/* Row 1: Search & Action Buttons */}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Cari..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ bgcolor: 'white', borderRadius: '8px' }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
                    <Button variant="contained" sx={{ bgcolor: '#1e293b', textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { bgcolor: '#0f172a' } }} onClick={fetchData}>
                      SEARCH
                    </Button>
                    
                    {role === 'SPV' && (
                      <Button 
                        variant="outlined" 
                        sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', color: '#3b82f6', borderColor: '#3b82f6', '&:hover': { bgcolor: '#eff6ff' } }}
                        onClick={() => {
                          if (selectedIds.length === 0) {
                            setSnackbar({ open: true, message: 'Pilih/Checklist data terlebih dahulu sebelum melakukan approve!', severity: 'error' });
                          } else {
                            setSnackbar({ open: true, message: 'Data berhasil di-approve!', severity: 'success' });
                            setSelectedIds([]);
                          }
                        }}
                      >
                        APPROVE
                      </Button>
                    )}

                    {role === 'STAFF' && (
                      <>
                        <Button variant="outlined" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }} onClick={() => setOpenAddDialog(true)}>
                          ADD
                        </Button>
                        <Button 
                          variant="outlined" 
                          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
                          onClick={() => {
                            if (selectedIds.length === 0) {
                              setSnackbar({ open: true, message: 'Pilih/Checklist data terlebih dahulu sebelum melakukan update!', severity: 'error' });
                            } else {
                              setViewMode('update');
                            }
                          }}
                        >
                          UPDATE
                        </Button>
                      </>
                    )}

                    <Button 
                      variant="outlined" 
                      sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
                      onClick={handleExport}
                    >
                      EXPORT
                    </Button>
                    <Button 
                      variant="outlined" 
                      sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
                      onClick={() => setOpenHistory(true)}
                    >
                      LOG HISTORY
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              {/* Row 2: Filter Dropdowns */}
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <SearchableSelect 
                  placeholder="(Division)" 
                  value={division} 
                  onChange={(val) => {
                    setDivision(val);
                    if (val && divisionError) setDivisionError(false);
                  }} 
                  options={divisions} 
                  minWidth={160} 
                  error={divisionError}
                  helperText={divisionError ? "Harap di isi" : ""}
                />
                <SearchableSelect placeholder="(Unit)" value={unit} onChange={setUnit} options={units} minWidth={160} />
                <SearchableSelect placeholder="(Position)" value={position} onChange={setPosition} options={positions} minWidth={160} />
                <SearchableSelect placeholder="(Branch)" value={branch} onChange={setBranch} options={branches} minWidth={160} />
                {role === 'SPV' && (
                  <SearchableSelect 
                    placeholder="(Status)" 
                    value={status} 
                    onChange={setStatus} 
                    options={['REQUEST', 'APPROVED', 'REJECTED']} 
                    minWidth={160} 
                  />
                )}
              </Stack>
            </Stack>
          </Paper>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            page={page}
            pageSize={pageSize}
            totalElements={data.length}
            totalPages={Math.ceil(data.length / pageSize) || 1}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            headerBg="#f8fafc"
            headerColor="#1e293b"
          />
        </>
      ) : viewMode === 'addManual' ? (
        <AddClientForm onCancel={() => setViewMode('list')} />
      ) : viewMode === 'addUpload' ? (
        <UploadClientForm onCancel={() => setViewMode('list')} />
      ) : viewMode === 'editClient' ? (
        <EditClientForm onCancel={() => setViewMode('list')} data={editData} />
      ) : viewMode === 'update' ? (
        <UpdateClientForm onCancel={() => setViewMode('list')} selectedIds={selectedIds} mockData={data} />
      ) : null}

      {/* Dialog ADD Options */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ bgcolor: '#3b82f6', color: 'white', py: 1.5, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>Information</Typography>
          <IconButton onClick={() => setOpenAddDialog(false)} size="small" sx={{ color: 'white' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
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
        </DialogContent>
      </Dialog>

      {/* Dialog Log History */}
      <Dialog open={openHistory} onClose={() => setOpenHistory(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle sx={{ bgcolor: '#3b82f6', color: 'white', py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>History Master Client</Typography>
          <IconButton onClick={() => setOpenHistory(false)} size="small" sx={{ color: 'white' }}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
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
              <SearchableSelect placeholder="(Division)" value={historyDivision} onChange={setHistoryDivision} options={divisions} minWidth={250} />
              <SearchableSelect placeholder="(Unit)" value={historyUnit} onChange={setHistoryUnit} options={units} minWidth={250} />
              <SearchableSelect placeholder="(Position)" value={historyPosition} onChange={setHistoryPosition} options={positions} minWidth={250} />
            </Stack>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <SearchableSelect placeholder="(Branch)" value={historyBranch} onChange={setHistoryBranch} options={branches} minWidth={250} />
              <Typography variant="body2" sx={{ mx: 1, fontWeight: 600 }}>Periode</Typography>
              <TextField type="date" size="small" sx={{ width: 160 }} InputLabelProps={{ shrink: true }} />
              <Typography variant="body2">-</Typography>
              <TextField type="date" size="small" sx={{ width: 160 }} InputLabelProps={{ shrink: true }} />
            </Stack>
          </Stack>
          
          <Box sx={{ mt: 3 }}>
            <DataTable 
              columns={historyColumns} 
              data={dummyHistoryData} 
              page={1} 
              pageSize={10} 
              totalElements={100} 
              totalPages={10} 
              onPageChange={() => {}} 
              onPageSizeChange={() => {}} 
              loading={false}
              headerBg="#f8fafc"
              headerColor="#1e293b"
            />
          </Box>
        </DialogContent>
      </Dialog>

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
