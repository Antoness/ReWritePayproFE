const fs = require('fs');
const path = require('path');

const filePath = '/Users/pt-dika/Documents/Documents - MacBook Air PT-DIKA (2) - 1/PAYROLL/PAYPRO NEW/frontend/src/pages/Master/MasterClient.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /const EditClientForm = \(\{ onCancel, data \}\) => \{[\s\S]*?^\};\n/m;
const match = content.match(regex);

if (match) {
    console.log("Found EditClientForm, length:", match[0].length);
    // Let's create the new implementation
    const newImpl = `const EditClientForm = ({ onCancel, data }) => {
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
  const [activeTab, setActiveTab] = useState('tunjangan');
  const { user } = useSelector((state) => state.auth || {});

  const fetchDetail = async () => {
    if (!data?.id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(\`\${API_URL}/api/master-client/\${data.id}\`, {
        headers: { Authorization: \`Bearer \${token}\` }
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
        // Note: For actual lists of tunjangan, backend would need to send them.
        // Assuming they might be returned or we just leave empty for now
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

  if (loading) return <Box sx={{p: 4}}><Typography>Loading...</Typography></Box>;

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
                  options={tunjanganOptions}
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
                  options={tunjanganOptions}
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
    </Box>
  );
};
`;
    content = content.replace(regex, newImpl);
    fs.writeFileSync(filePath, content);
    console.log("Success");
} else {
    console.log("Regex did not match EditClientForm.");
}
