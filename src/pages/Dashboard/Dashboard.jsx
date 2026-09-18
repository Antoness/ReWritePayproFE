import React from 'react';
import { Box, Typography, Paper, Stack, Select, MenuItem, Divider, Chip, Tooltip } from '@mui/material';
import { 
  ArrowUpward, ArrowDownward, Group as GroupIcon, 
  Payments as PaymentsIcon, AssignmentLate as PendingIcon,
  Business as ClientIcon, Assessment as AssessmentIcon, LocalAtm as CompensationIcon
} from '@mui/icons-material';

// --- CUSTOM SVG DONUT CHART ---
const DonutChart = () => {
  const radius = 55;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const data = [
    { label: 'IT', value: 35, color: '#6366f1' },
    { label: 'Operations', value: 40, color: '#10b981' },
    { label: 'Finance', value: 15, color: '#f59e0b' },
    { label: 'HR', value: 10, color: '#ec4899' }
  ];
  let currentOffset = 0;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Box sx={{ position: 'relative', width: 130, height: 130, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
          {data.map((item, index) => {
            const dashValue = (item.value / 100) * circumference;
            const dashOffset = -currentOffset;
            currentOffset += dashValue;
            return (<circle key={index} cx="65" cy="65" r={radius} fill="transparent" stroke={item.color} strokeWidth={strokeWidth} strokeDasharray={`${dashValue} ${circumference - dashValue}`} strokeDashoffset={dashOffset} style={{ cursor: 'pointer' }} />);
          })}
        </svg>
        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.55rem' }}>Total</Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.85rem' }}>188,245</Typography>
        </Box>
      </Box>
      <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
        {data.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.5, py: 0.2 }}>
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: item.color }} />
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, fontSize: '0.55rem' }}>{item.label} {item.value}%</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

// --- CUSTOM STACKED BAR CHART ---
const StackedBarChart = () => {
  const maxVal = 80;
  const data = [
    { m: 'Jan', jakarta: 15, bekasi: 10, tangerang: 12 },
    { m: 'Feb', jakarta: 28, bekasi: 22, tangerang: 18 },
    { m: 'Mar', jakarta: 22, bekasi: 15, tangerang: 16 },
    { m: 'Apr', jakarta: 18, bekasi: 12, tangerang: 14 },
    { m: 'May', jakarta: 25, bekasi: 25, tangerang: 20 },
    { m: 'Jun', jakarta: 10, bekasi: 8, tangerang: 10 },
    { m: 'Jul', jakarta: 30, bekasi: 28, tangerang: 25 },
    { m: 'Aug', jakarta: 28, bekasi: 24, tangerang: 20 },
    { m: 'Sep', jakarta: 15, bekasi: 12, tangerang: 10 },
    { m: 'Oct', jakarta: 32, bekasi: 28, tangerang: 26 },
    { m: 'Nov', jakarta: 15, bekasi: 10, tangerang: 8 },
    { m: 'Dec', jakarta: 25, bekasi: 22, tangerang: 20 },
  ];
  return (
    <Box sx={{ width: '100%', mt: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 180, gap: '6px', position: 'relative' }}>
        {[0, 20, 40, 60, 80].map(val => (
          <Box key={val} sx={{ position: 'absolute', bottom: `${(val/maxVal)*100}%`, left: 0, right: 0, borderBottom: '1px dashed #e2e8f0', zIndex: 0 }}>
            <Typography variant="caption" sx={{ position: 'absolute', left: -22, top: -8, color: '#94a3b8', fontSize: '0.55rem', fontWeight: 600 }}>{val}</Typography>
          </Box>
        ))}
        {data.map((col, i) => {
          const total = col.jakarta + col.bekasi + col.tangerang;
          return (
            <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', zIndex: 1, height: '100%' }}>
              <Box sx={{ width: '80%', minWidth: 6, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: `${(total/maxVal)*100}%` }}>
                <Tooltip title={`TGR: ${col.tangerang}`} arrow><Box sx={{ height: `${(col.tangerang/total)*100}%`, bgcolor: '#6366f1', borderTopLeftRadius: 2, borderTopRightRadius: 2 }} /></Tooltip>
                <Tooltip title={`BKS: ${col.bekasi}`} arrow><Box sx={{ height: `${(col.bekasi/total)*100}%`, bgcolor: '#f59e0b' }} /></Tooltip>
                <Tooltip title={`JKT: ${col.jakarta}`} arrow><Box sx={{ height: `${(col.jakarta/total)*100}%`, bgcolor: '#10b981', borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} /></Tooltip>
              </Box>
              <Typography variant="caption" sx={{ mt: 0.5, color: '#64748b', fontSize: '0.55rem', fontWeight: 700 }}>{col.m}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// --- MINI BAR CHARTS ---
const MiniBarChart = ({ color, data }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 28 }}>
    {data.map((val, i) => (
      <Box key={i} sx={{ width: 3, height: `${val}%`, bgcolor: color, borderRadius: 0.5 }} />
    ))}
  </Box>
);

// --- KPI CARD ---
const KpiCard = ({ title, value, icon, iconBg, iconColor, change, changeColor, changeIcon, chartColor, chartData }) => (
  <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flex: 1, minWidth: 0 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.58rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.25, fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem' }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ p: 0.75, bgcolor: iconBg, color: iconColor, borderRadius: 1.5, display: 'flex', flexShrink: 0 }}>
        {icon}
      </Box>
    </Stack>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <Stack direction="row" alignItems="center" spacing={0.25}>
        {changeIcon}
        <Typography variant="caption" sx={{ color: changeColor, fontWeight: 800, fontSize: '0.65rem' }}>{change}</Typography>
      </Stack>
      <MiniBarChart color={chartColor} data={chartData} />
    </Box>
  </Paper>
);

const Dashboard = () => {
  return (
    <Box sx={{ width: '100%' }}>
      
      {/* HEADER */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.75px' }}>Welcome back, Admin</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Tinjauan ringkas aktivitas operasional, data master, dan rekapitulasi penggajian.</Typography>
      </Box>

      {/* === MAIN LAYOUT: flexbox row, NO MUI Grid === */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        
        {/* LEFT COLUMN ~75% */}
        <Box sx={{ flex: 3, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          {/* Row 1: 3 KPI Cards */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <KpiCard title="Total Employees" value="18,765" icon={<GroupIcon fontSize="small" />} iconBg="rgba(16, 185, 129, 0.12)" iconColor="#10b981" change="+2.6%" changeColor="#10b981" changeIcon={<ArrowUpward sx={{ fontSize: 12, color: '#10b981' }} />} chartColor="#10b981" chartData={[30,40,20,50,70,80,60,90]} />
            <KpiCard title="Total Payroll Processed" value="Rp 18.2B" icon={<PaymentsIcon fontSize="small" />} iconBg="rgba(59, 130, 246, 0.12)" iconColor="#3b82f6" change="+0.2%" changeColor="#10b981" changeIcon={<ArrowUpward sx={{ fontSize: 12, color: '#10b981' }} />} chartColor="#3b82f6" chartData={[40,50,60,40,70,50,80,70]} />
            <KpiCard title="Pending Approvals" value="678" icon={<PendingIcon fontSize="small" />} iconBg="rgba(249, 115, 22, 0.12)" iconColor="#f97316" change="-0.1%" changeColor="#ef4444" changeIcon={<ArrowDownward sx={{ fontSize: 12, color: '#ef4444' }} />} chartColor="#f97316" chartData={[80,70,60,90,80,50,40,60]} />
          </Box>

          {/* Row 2: Bar Chart + Donut side by side */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            {/* Bar Chart - takes more space */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flex: 2, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.85rem' }}>Payroll Expense by Area</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>(+43%) than last year</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    {[{ l: 'JKT', c: '#10b981', v: 'Rp 12.3M' }, { l: 'BKS', c: '#f59e0b', v: 'Rp 6.7M' }, { l: 'TGR', c: '#6366f1', v: 'Rp 1.0M' }].map((a, i) => (
                      <Box key={i}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: a.c }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.6rem' }}>{a.l}</Typography>
                        </Stack>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 0.25, fontSize: '0.75rem', color: 'text.primary' }}>{a.v}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
                <Select size="small" value="2026" sx={{ bgcolor: 'background.paper', borderRadius: 1.5, minWidth: 70, height: 26, fontSize: '0.65rem' }}>
                  <MenuItem value="2026">2026</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                </Select>
              </Box>
              <StackedBarChart />
            </Paper>

            {/* Donut + Pending */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.85rem' }}>Employee Distribution</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Distributed by department</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}><DonutChart /></Box>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Divider sx={{ mb: 1, borderColor: 'divider' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.75, fontSize: '0.8rem' }}>Pending Requests</Typography>
                <Stack spacing={0.75}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(245, 158, 11, 0.12)', borderRadius: 2, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#f59e0b', display: 'block', fontSize: '0.68rem' }}>UMK Adjustment Needed</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mt: 0.15, fontSize: '0.6rem' }}>Tangerang branch UMK update pending SPV approval.</Typography>
                  </Box>
                  <Box sx={{ p: 1, bgcolor: 'rgba(16, 185, 129, 0.12)', borderRadius: 2, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#10b981', display: 'block', fontSize: '0.68rem' }}>New PTKP Category</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mt: 0.15, fontSize: '0.6rem' }}>Requested by Finance Dept.</Typography>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* RIGHT COLUMN ~25% - Statistics full height */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.85rem' }}>Statistics</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>Target you've set for each month</Typography>
          <Stack spacing={1.5} sx={{ flex: 1, justifyContent: 'center' }}>
            {[
              { label: 'Active Clients', count: '48 Clients', icon: <ClientIcon fontSize="small" />, color: 'rgba(59, 130, 246, 0.12)', textColor: '#3b82f6' },
              { label: 'Active Projects', count: '15 Projects', icon: <AssessmentIcon fontSize="small" />, color: 'rgba(124, 58, 237, 0.12)', textColor: '#8b5cf6' },
              { label: 'Kompensasi PIC', count: '12 PICs', icon: <CompensationIcon fontSize="small" />, color: 'rgba(16, 185, 129, 0.12)', textColor: '#10b981' },
              { label: 'Master Hold Logs', count: '5 Hold Logs', icon: <PendingIcon fontSize="small" />, color: 'rgba(249, 115, 22, 0.12)', textColor: '#f97316' }
            ].map((stat, idx) => (
              <Box key={idx} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5, '&:hover': { bgcolor: 'action.hover', borderColor: '#6366f1' }, transition: 'all 0.2s' }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: stat.color, color: stat.textColor, display: 'flex', flexShrink: 0 }}>{stat.icon}</Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 700, fontSize: '0.65rem' }}>{stat.label}</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.1, fontSize: '0.8rem' }}>{stat.count}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* BOTTOM ROW: RECENT PAYROLL RUNS - full width */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5, fontSize: '0.9rem' }}>Recent Payroll Runs</Typography>
        <Divider sx={{ mb: 1.5, borderColor: 'divider' }} />
        <Stack spacing={1}>
          {[
            { id: 'PAY-1020', title: 'Payroll Jakarta - May 2026', user: 'SPV HRD', status: 'COMPLETED', color: 'rgba(16, 185, 129, 0.15)', textColor: '#10b981', date: '20-May-2026' },
            { id: 'KOM-2201', title: 'Kompensasi Subang - April 2026', user: 'HR Staff', status: 'COMPLETED', color: 'rgba(16, 185, 129, 0.15)', textColor: '#10b981', date: '18-April-2026' },
            { id: 'LMB-8827', title: 'Lembur Bekasi - May 2026', user: 'Finance Admin', status: 'PROCESSING', color: 'rgba(59, 130, 246, 0.15)', textColor: '#3b82f6', date: '20-May-2026' }
          ].map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'action.hover' } }}>
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.15)', px: 0.75, py: 0.2, borderRadius: 0.75, fontSize: '0.65rem' }}>{item.id}</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.8rem' }}>{item.title}</Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mt: 0.25, fontSize: '0.65rem' }}>Processed by: {item.user} • {item.date}</Typography>
              </Box>
              <Chip label={item.status} size="small" sx={{ fontWeight: 800, bgcolor: item.color, color: item.textColor, fontSize: '0.6rem', height: 22 }} />
            </Box>
          ))}
        </Stack>
      </Paper>
      
    </Box>
  );
};

export default Dashboard;
