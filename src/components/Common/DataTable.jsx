import React, { useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Select, MenuItem, Typography, Stack, Pagination, LinearProgress,
  Collapse
} from '@mui/material';

const DataTable = ({ 
  columns, 
  data, 
  loading, 
  page = 1, 
  pageSize = 10, 
  rowsPerPage,
  totalElements, 
  totalCount,
  totalPages,
  onPageChange = () => {}, 
  onPageSizeChange,
  onRowsPerPageChange,
  headerBg,
  headerColor,
  showPagination = true,
  onRowClick,
  emptyMessage = 'No data available',
  renderCollapsibleRow
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpand = (key) => {
    setExpandedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const effectivePageSize = rowsPerPage || pageSize || 10;
  const effectiveTotal = totalElements !== undefined ? totalElements : (totalCount !== undefined ? totalCount : (data?.length || 0));
  const effectiveTotalPages = totalPages || Math.max(1, Math.ceil(effectiveTotal / effectivePageSize));
  const handleSizeChange = onPageSizeChange || onRowsPerPageChange || (() => {});

  const startEntry = Math.max(1, (page - 1) * effectivePageSize + 1);
  const endEntry = Math.min(page * effectivePageSize, effectiveTotal);

  return (
    <Paper sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' }} elevation={0}>
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
        <Table size="small">
          <TableHead sx={{ bgcolor: headerBg || 'action.hover' }}>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell 
                  key={index} 
                  align={col.align || 'left'} 
                  sx={{ 
                    fontWeight: 700, 
                    color: headerColor || 'text.secondary',
                    whiteSpace: 'nowrap',
                    borderRight: 'none',
                    borderColor: 'divider',
                    py: 1.2,
                    px: 1.25,
                    fontSize: '0.78rem',
                    width: col.width || 'auto'
                  }}
                >
                  {col.headerRender ? col.headerRender() : col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
            {(data || []).length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 5, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              (data || []).map((row, rowIndex) => {
                const rowKey = row.id !== undefined ? row.id : rowIndex;
                const isExpanded = !!expandedRows[rowKey];

                return (
                  <React.Fragment key={rowKey}>
                    <TableRow 
                      hover 
                      onClick={() => {
                        if (onRowClick) {
                          onRowClick(row);
                        } else if (renderCollapsibleRow) {
                          toggleExpand(rowKey);
                        }
                      }}
                      sx={{ 
                        cursor: (onRowClick || renderCollapsibleRow) ? 'pointer' : 'default',
                        bgcolor: isExpanded ? 'action.hover' : 'inherit',
                        '&:hover': { bgcolor: 'action.hover' },
                        '& > *': renderCollapsibleRow && isExpanded ? { borderBottom: 'none' } : {}
                      }}
                    >
                      {columns.map((col, colIndex) => (
                        <TableCell 
                          key={colIndex} 
                          align={col.align || 'left'} 
                          sx={{ 
                            whiteSpace: 'nowrap', 
                            borderColor: 'divider',
                            py: 1.2,
                            px: 1.25,
                            fontSize: '0.8rem'
                          }}
                        >
                          {col.render ? col.render(row, rowIndex, isExpanded, () => toggleExpand(rowKey)) : row[col.id]}
                        </TableCell>
                      ))}
                    </TableRow>

                    {renderCollapsibleRow && (
                      <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell 
                          colSpan={columns.length} 
                          sx={{ 
                            p: 0, 
                            borderBottom: isExpanded ? '1px solid' : 'none', 
                            borderColor: 'divider' 
                          }}
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: { xs: 1.5, md: 2 }, bgcolor: 'background.paper', borderTop: '1px dashed', borderColor: 'divider', m: { xs: 1, md: 1.5 }, borderRadius: 2, boxSizing: 'border-box' }}>
                              {renderCollapsibleRow(row, rowIndex, isExpanded, () => toggleExpand(rowKey))}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {showPagination && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider', bgcolor: 'transparent', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>Show Page :</Typography>
            <Select 
              size="small" 
              value={effectivePageSize} 
              onChange={(e) => handleSizeChange(e.target.value)} 
              sx={{ height: '32px', fontSize: '0.78rem' }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={500}>500</MenuItem>
              <MenuItem value={1000}>1000</MenuItem>
            </Select>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              Showing {effectiveTotal === 0 ? 0 : startEntry} to {endEntry} of {effectiveTotal} entries
            </Typography>
          </Box>
          <Pagination 
            count={effectiveTotalPages} 
            page={page} 
            onChange={(e, v) => onPageChange(v)} 
            color="primary" 
            shape="rounded" 
            size="small"
          />
        </Box>
      )}
    </Paper>
  );
};

export { DataTable };
export default DataTable;