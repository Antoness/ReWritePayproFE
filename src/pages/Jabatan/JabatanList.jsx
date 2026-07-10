import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../services/api';

const JabatanList = () => {
  const [jabatans, setJabatans] = useState([]);

  useEffect(() => {
    fetchJabatans();
  }, []);

  const fetchJabatans = async () => {
    try {
      const response = await api.get('/jabatan');
      setJabatans(response.data);
    } catch (error) {
      console.error('Failed to fetch jabatans', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await api.delete(`/jabatan/${id}`);
        fetchJabatans();
      } catch (error) {
        console.error('Failed to delete jabatan', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Master Jabatan</Typography>
        <Button variant="contained" startIcon={<AddIcon />} color="primary">
          Tambah Jabatan
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Kode</TableCell>
              <TableCell>Nama Jabatan</TableCell>
              <TableCell>Gaji Pokok</TableCell>
              <TableCell>Deskripsi</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jabatans.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.kodeJabatan}</TableCell>
                <TableCell>{row.namaJabatan}</TableCell>
                <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.gajiPokok)}</TableCell>
                <TableCell>{row.deskripsi}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default JabatanList;
