import React from 'react';
import { Box, Typography, Paper, Grid, Stack, Select, MenuItem, Divider } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

// --- CUSTOM SVG DONUT CHART ---
const DonutChart = () => {
  const radius = 70;
  const strokeWidth = 25;
  const circumference = 2 * Math.PI * radius;
  
  const data = [
    { label: 'IT', value: 35, color: '#047857' },       // Dark Green
    { label: 'Operations', value: 40, color: '#10b981' }, // Medium Green
    { label: 'Finance', value: 15, color: '#6ee7b7' },  // Light Green
    { label: 'HR', value: 10, color: '#d1fae5' }        // Very Light Green
  ];

  let currentOffset = 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', width: 220, height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
          {data.map((item, index) => {
            const dashValue = (item.value / 100) * circumference;
            const dashOffset = -currentOffset;
            currentOffset += dashValue;
            
            return (
              <circle
                key={index}
                cx="110"
                cy="110"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashValue} ${circumference - dashValue}`}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
              />
            );
          })}
        </svg>
        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">Total</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>188,245</Typography>
        </Box>
      </Box>
      
      <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
            <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600 }}>{item.label}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

// --- CUSTOM STACKED BAR CHART ---
const StackedBarChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxVal = 80;
  
  // Random mock data for 3 areas
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
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 250, gap: 2, position: 'relative' }}>
        {/* Y Axis Lines */}
        {[0, 20, 40, 60, 80].map(val => (
          <Box key={val} sx={{ position: 'absolute', bottom: `${(val/maxVal)*100}%`, left: 0, right: 0, borderBottom: '1px dashed #e2e8f0', zIndex: 0 }}>
            <Typography variant="caption" sx={{ position: 'absolute', left: -25, top: -8, color: '#94a3b8', fontSize: '0.65rem' }}>{val}</Typography>
          </Box>
        ))}
        
        {/* Bars */}
        {data.map((col, i) => {
          const total = col.jakarta + col.bekasi + col.tangerang;
          return (
            <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', zIndex: 1, height: '100%' }}>
              <Box sx={{ width: '60%', minWidth: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: `${(total/maxVal)*100}%` }}>
                <Box sx={{ height: `${(col.tangerang/total)*100}%`, bgcolor: '#0ea5e9', borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
                <Box sx={{ height: `${(col.bekasi/total)*100}%`, bgcolor: '#f59e0b' }} />
                <Box sx={{ height: `${(col.jakarta/total)*100}%`, bgcolor: '#0f766e', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }} />
              </Box>
              <Typography variant="caption" sx={{ mt: 1, color: '#64748b', fontSize: '0.7rem' }}>{col.m}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

// --- MINI BAR CHARTS FOR TOP CARDS ---
const MiniBarChart = ({ color, data }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: 35 }}>
    {data.map((val, i) => (
      <Box key={i} sx={{ width: 6, height: `${val}%`, bgcolor: color, borderRadius: 1 }} />
    ))}
  </Box>
);


const Dashboard = () => {
  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      
      {/* TOP KPI CARDS */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Card 1 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #f1f5f9' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>Total Employees</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>18,765</Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                  <ArrowUpward sx={{ fontSize: 16, color: '#10b981' }} />
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>+2.6%</Typography>
                  <Typography variant="body2" color="text.secondary">last 7 days</Typography>
                </Stack>
              </Box>
              <MiniBarChart color="#10b981" data={[30, 40, 20, 50, 70, 80, 60, 90]} />
            </Box>
          </Paper>
        </Grid>
        
        {/* Card 2 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #f1f5f9' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>Total Payroll Processed</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>4,876</Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                  <ArrowUpward sx={{ fontSize: 16, color: '#10b981' }} />
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>+0.2%</Typography>
                  <Typography variant="body2" color="text.secondary">last 7 days</Typography>
                </Stack>
              </Box>
              <MiniBarChart color="#0ea5e9" data={[40, 50, 60, 40, 70, 50, 80, 70]} />
            </Box>
          </Paper>
        </Grid>

        {/* Card 3 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #f1f5f9' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 2 }}>Pending Approvals</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>678</Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                  <ArrowDownward sx={{ fontSize: 16, color: '#ef4444' }} />
                  <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 700 }}>-0.1%</Typography>
                  <Typography variant="body2" color="text.secondary">last 7 days</Typography>
                </Stack>
              </Box>
              <MiniBarChart color="#f97316" data={[80, 70, 60, 90, 80, 50, 40, 60]} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* MIDDLE SECTION */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Left Donut */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #f1f5f9', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Employee Distribution</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Distributed by department</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DonutChart />
            </Box>
          </Paper>
        </Grid>

        {/* Right Stacked Bar */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #f1f5f9', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Payroll Expense by Area</Typography>
                <Typography variant="body2" color="text.secondary">(+43%) than last year</Typography>
                <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#0f766e' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Jakarta</Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>1.23k</Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Bekasi</Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>6.79k</Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#0ea5e9' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Tangerang</Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>1.01k</Typography>
                  </Box>
                </Stack>
              </Box>
              <Select size="small" value="2026" sx={{ bgcolor: 'white', borderRadius: 2, minWidth: 100 }}>
                <MenuItem value="2026">2026</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
              </Select>
            </Box>
            
            <Box sx={{ mt: 2, pl: 3 }}>
              <StackedBarChart />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* BOTTOM SECTION */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #f1f5f9', minHeight: 200 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>Recent Payroll Runs</Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Mock Table */}
            <Stack spacing={2}>
              {[1, 2, 3].map((item) => (
                <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#f8fafc' } }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Payroll Jakarta - May 2026</Typography>
                    <Typography variant="caption" color="text.secondary">Processed by: SPV HRD</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>COMPLETED</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #f1f5f9', minHeight: 200 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>Pending Requests</Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Box sx={{ p: 2, bgcolor: '#fffbeb', borderRadius: 2, border: '1px solid #fde68a' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#b45309' }}>UMK Adjustment Needed</Typography>
                <Typography variant="caption" sx={{ color: '#d97706' }}>Tangerang branch UMK update pending SPV approval.</Typography>
              </Box>
              <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#15803d' }}>New PTKP Category</Typography>
                <Typography variant="caption" sx={{ color: '#16a34a' }}>Requested by Finance Dept.</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      
    </Box>
  );
};

export default Dashboard;
