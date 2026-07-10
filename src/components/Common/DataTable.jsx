import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select, MenuItem, Typography, Stack, Pagination, LinearProgress
} from '@mui/material';

const DataTable = ({ 
  columns, 
  data, 
  loading, 
  page, 
  pageSize, 
  totalElements, 
  totalPages,
  onPageChange, 
  onPageSizeChange,
  headerBg = '#f8fafc',
  headerColor = '#1e293b',
  showPagination = true
}) => {
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, totalElements);

  return (
    <Paper sx={{ borderRadius: 2, border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }} elevation={0}>
      {loading && (
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 10,
            height: '3px'
          }} 
        />
      )}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead sx={{ bgcolor: headerBg }}>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell 
                  key={index} 
                  align={col.align || 'left'} 
                  sx={{ 
                    fontWeight: 700, 
                    color: headerColor,
                    whiteSpace: 'nowrap',
                    borderRight: headerBg !== '#f8fafc' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
            {data.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                  <Typography variant="body2" color="text.secondary">No data available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} hover sx={{ '&:nth-of-type(even)': { bgcolor: headerBg !== '#f8fafc' ? '#f8fafc' : 'inherit' } }}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex} align={col.align || 'left'} sx={{ whiteSpace: 'nowrap' }}>
                      {col.render ? col.render(row, rowIndex) : row[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', bgcolor: headerBg === '#f8fafc' ? 'inherit' : '#f8fafc' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">Show Page :</Typography>
            <Select 
              size="small" 
              value={pageSize} 
              onChange={(e) => onPageSizeChange(e.target.value)} 
              sx={{ height: '32px' }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={500}>500</MenuItem>
              <MenuItem value={1000}>1000</MenuItem>
            </Select>
            <Typography variant="body2">
              Showing {totalElements === 0 ? 0 : startEntry} to {endEntry} of {totalElements} entries
            </Typography>
          </Stack>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(e, v) => onPageChange(v)} 
            color="primary" 
            shape="rounded" 
            size={headerBg !== '#f8fafc' ? 'small' : 'medium'}
          />
        </Box>
      )}
    </Paper>
  );
};

export default DataTable;
