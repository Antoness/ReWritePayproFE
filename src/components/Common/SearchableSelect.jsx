import React from 'react';
import { Autocomplete, TextField, Typography } from '@mui/material';

const SearchableSelect = ({ value, onChange, options = [], placeholder, minWidth = 200, multiple = false, error, helperText, freeSolo = false }) => {
  return (
    <Autocomplete
      freeSolo={freeSolo}
      multiple={multiple}
      size="small"
      options={options}
      value={multiple ? (value || []) : (value || null)}
      onChange={(event, newValue) => {
        if (onChange) {
          onChange(newValue || (multiple ? [] : ''));
        }
      }}
      onInputChange={(event, newInputValue, reason) => {
        if (freeSolo && onChange && reason === 'input') {
          onChange(newInputValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          sx={{
            bgcolor: 'white',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      )}
      sx={{ minWidth: minWidth }}
      // Menangani placeholder ketika tidak ada nilai
      renderOption={(props, option) => (
        <li {...props} key={option}>
          <Typography variant="body2">{option}</Typography>
        </li>
      )}
    />
  );
};

export default SearchableSelect;
