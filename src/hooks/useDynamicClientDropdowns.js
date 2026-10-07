import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085';

// Default tunjangan yang SELALU muncul untuk semua klien
// Ini adalah list tetap yang sudah ada sebelumnya
const DEFAULT_TUNJANGAN = [
  'Tunjangan Supervisor',
  'Tunjangan Jabatan',
  'Skill Allowance',
  'Grading Allowance',
  'Montly Allowance',
  'Performance Allowance',
  'Position Allowance',
  'Tunjangan Bensin',
];

export const useDynamicClientDropdowns = (selected) => {
  const { division, unit, position, employeeType } = selected || {};

  const [divisions, setDivisions] = useState([]);
  const [units, setUnits] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [branches, setBranches] = useState([]);

  // Additional static dropdowns
  const [salaryTypes, setSalaryTypes] = useState([]);
  // Inisialisasi dengan DEFAULT_TUNJANGAN agar tidak pernah kosong
  const [allowances, setAllowances] = useState([...DEFAULT_TUNJANGAN]);
  const [komponenUpah, setKomponenUpah] = useState([]);
  const [workDays, setWorkDays] = useState([]);
  const [bpjsTkTypes, setBpjsTkTypes] = useState([]);
  const [metodePajak, setMetodePajak] = useState([]);
  const [komponenProject, setKomponenProject] = useState([]);
  const [bpjsKetenagakerjaan, setBpjsKetenagakerjaan] = useState([]);
  const [ditanggungOleh, setDitanggungOleh] = useState([]);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch static dropdowns (salary types, work days, etc.) — hanya sekali
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/master-client/dropdowns/divisions`, getHeaders());
        setDivisions(res.data || []);
      } catch (error) {
        console.error('Failed to fetch divisions', error);
      }
    };

    const fetchStaticOptions = async () => {
      try {
        const [
          salaryTypesRes, komponenUpahRes,
          workDaysRes, bpjsTkTypesRes, metodePajakRes,
          komponenProjectRes, bpjsKetRes, ditanggungOlehRes
        ] = await Promise.all([
          axios.get(`${API_URL}/api/master-client/dropdowns/salary-types`, getHeaders()),
          axios.get(`${API_URL}/api/master-client/dropdowns/komponen-upah`, getHeaders()),
          axios.get(`${API_URL}/api/master-client/dropdowns/work-days`, getHeaders()),
          axios.get(`${API_URL}/api/master-client/dropdowns/bpjs-tk-types`, getHeaders()),
          axios.get(`${API_URL}/api/master-client/dropdowns/metode-pajak`, getHeaders()),
          axios.get(`${API_URL}/api/master-client/dropdowns/komponen-project`, getHeaders()),
          axios.get(`${API_URL}/api/master-client/dropdowns/bpjs-ketenagakerjaan`, getHeaders()),
          axios.get(`${API_URL}/api/master-client/dropdowns/ditanggung-oleh`, getHeaders())
        ]);
        
        setSalaryTypes((salaryTypesRes.data || []).map(o => o.name));
        setKomponenUpah((komponenUpahRes.data || []).map(o => o.name));
        setWorkDays(workDaysRes.data || []);
        setBpjsTkTypes(bpjsTkTypesRes.data || []);
        setMetodePajak(metodePajakRes.data || []);
        setKomponenProject(komponenProjectRes.data || []);
        setBpjsKetenagakerjaan(bpjsKetRes.data || []);
        setDitanggungOleh(ditanggungOlehRes.data || []);
      } catch (error) {
        console.error('Failed to fetch static dropdown options', error);
      }
    };

    fetchDivisions();
    fetchStaticOptions();
  }, []);

  // Fetch allowances (Tunjangan & Insentif) — dynamically filtered by selection
  // Selalu mulai dari DEFAULT_TUNJANGAN + tambahkan payroll_components dari API
  useEffect(() => {
    const fetchAllowances = async () => {
      try {
        const params = new URLSearchParams();
        if (division) params.append('division', division);
        if (unit) params.append('unitName', unit);
        if (position) params.append('position', position);
        if (employeeType) params.append('employeeType', employeeType);
        const res = await axios.get(
          `${API_URL}/api/master-client/dropdowns/payroll-components?${params.toString()}`,
          getHeaders()
        );
        // Merge: DEFAULT_TUNJANGAN (selalu ada) + tambahan dari API (filtered), tanpa duplikat
        const apiItems = res.data || [];
        const merged = [...new Set([...DEFAULT_TUNJANGAN, ...apiItems])];
        setAllowances(merged);
      } catch (error) {
        console.error('Failed to fetch allowances', error);
        // Kalau API gagal, tetap pakai defaults saja
        setAllowances([...DEFAULT_TUNJANGAN]);
      }
    };
    fetchAllowances();
  }, [division, unit, position, employeeType]);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!division) {
        setUnits([]);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/api/master-client/dropdowns/units?division=${encodeURIComponent(division)}`, getHeaders());
        setUnits(res.data || []);
      } catch (error) {
        console.error('Failed to fetch units', error);
      }
    };
    fetchUnits();
  }, [division]);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!division || !unit) {
        setPositions([]);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/api/master-client/dropdowns/positions?division=${encodeURIComponent(division)}&unitName=${encodeURIComponent(unit)}`, getHeaders());
        setPositions(res.data || []);
      } catch (error) {
        console.error('Failed to fetch positions', error);
      }
    };
    fetchPositions();
  }, [division, unit]);

  useEffect(() => {
    const fetchEmployeeTypes = async () => {
      if (!division || !unit || !position) {
        setEmployeeTypes([]);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/api/master-client/dropdowns/employee-types?division=${encodeURIComponent(division)}&unitName=${encodeURIComponent(unit)}&position=${encodeURIComponent(position)}`, getHeaders());
        setEmployeeTypes(res.data || []);
      } catch (error) {
        console.error('Failed to fetch employee types', error);
      }
    };
    fetchEmployeeTypes();
  }, [division, unit, position]);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!division || !unit || !position || !employeeType) {
        setBranches([]);
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/api/master-client/dropdowns/branches?division=${encodeURIComponent(division)}&unitName=${encodeURIComponent(unit)}&position=${encodeURIComponent(position)}&employeeType=${encodeURIComponent(employeeType)}`, getHeaders());
        setBranches(res.data || []);
      } catch (error) {
        console.error('Failed to fetch branches', error);
      }
    };
    fetchBranches();
  }, [division, unit, position, employeeType]);

  return { 
    divisions, units, positions, employeeTypes, branches,
    salaryTypes, allowances, komponenUpah, workDays,
    bpjsTkTypes, metodePajak, komponenProject, bpjsKetenagakerjaan, ditanggungOleh
  };
};
