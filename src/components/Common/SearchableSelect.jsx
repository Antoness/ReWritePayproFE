import React from 'react';
import { Autocomplete, TextField, Typography, Box, Chip } from '@mui/material';

/**
 * Reusable SearchableSelect Component for PayPro V.6
 * Supports both flat array of strings/numbers and array of objects { label, value } or custom keys.
 * Fully compatible with ThemeContext (Light/Dark mode) and high-density datasets.
 */
const SearchableSelect = ({
  options = [],
  value = '',
  onChange,
  label,
  placeholder,
  size = 'small',
  minWidth,
  fullWidth = true,
  disabled = false,
  multiple = false,
  freeSolo = false,
  clearable = true,
  error = false,
  helperText,
  loading = false,
  noOptionsText = 'Tidak ada pilihan',
  getOptionLabel,
  isOptionEqualToValue,
  sx = {},
  inputSx = {},
  ...rest
}) => {
  // Normalize options to a standard structure if needed
  // Options can be: ['IT', 'HR'] OR [{ label: 'IT', value: 'IT' }, { label: 'HR', value: 'HR' }]
  const normalizedOptions = React.useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.map((opt) => {
      if (opt === null || opt === undefined) return { label: '', value: '' };
      if (typeof opt === 'object') {
        return {
          ...opt,
          label: opt.label !== undefined ? String(opt.label) : (opt.name || opt.title || String(opt.value ?? '')),
          value: opt.value !== undefined ? opt.value : (opt.id ?? opt)
        };
      }
      return { label: String(opt), value: opt };
    });
  }, [options]);

  // Find currently selected option object based on `value` prop
  const selectedValue = React.useMemo(() => {
    if (multiple) {
      if (!Array.isArray(value)) return [];
      return value.map((val) => {
        const found = normalizedOptions.find((opt) => opt.value === val || opt.label === val || opt === val);
        return found || (typeof val === 'object' ? val : { label: String(val), value: val });
      });
    }

    if (value === null || value === undefined || value === '') {
      return freeSolo && value !== '' ? value : null;
    }

    const found = normalizedOptions.find(
      (opt) => opt.value === value || opt.label === value || opt === value
    );
    if (found) return found;

    if (typeof value === 'object' && value.value !== undefined) {
      return value;
    }

    // If freeSolo or value not in options list yet
    return { label: String(value), value: value };
  }, [value, normalizedOptions, multiple, freeSolo]);

  const handleChange = (event, newValue) => {
    if (!onChange) return;

    if (multiple) {
      const values = (newValue || []).map((item) => (typeof item === 'object' && item.value !== undefined ? item.value : item));
      onChange(values, newValue, event);
    } else {
      if (newValue === null || newValue === undefined) {
        onChange('', null, event);
      } else if (typeof newValue === 'object') {
        onChange(newValue.value !== undefined ? newValue.value : newValue.label, newValue, event);
      } else {
        onChange(newValue, newValue, event);
      }
    }
  };

  return (
    <Autocomplete
      size={size}
      disabled={disabled}
      multiple={multiple}
      freeSolo={freeSolo}
      disableClearable={!clearable}
      loading={loading}
      options={normalizedOptions}
      value={selectedValue}
      onChange={handleChange}
      onInputChange={(event, newInputValue, reason) => {
        if (freeSolo && onChange && reason === 'input') {
          onChange(newInputValue, null, event);
        }
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        if (option && option.label !== undefined) return option.label;
        if (option && option.value !== undefined) return String(option.value);
        return '';
      }}
      isOptionEqualToValue={(option, val) => {
        if (!option || !val) return false;
        if (isOptionEqualToValue) return isOptionEqualToValue(option, val);
        const optVal = typeof option === 'object' ? option.value : option;
        const targetVal = typeof val === 'object' ? val.value : val;
        return optVal === targetVal || option.label === (val.label || targetVal);
      }}
      noOptionsText={noOptionsText}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box
            component="li"
            key={key || (typeof option === 'object' ? option.value : option)}
            {...otherProps}
            sx={{
              fontSize: '0.875rem',
              py: 0.75,
              px: 1.5,
              '&[aria-selected="true"]': {
                bgcolor: 'primary.light',
                fontWeight: 600
              }
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
              {typeof option === 'object' ? option.label : option}
            </Typography>
          </Box>
        );
      }}
      {...(multiple
        ? {
            renderTags: (tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={typeof option === 'object' ? option.label : option}
                    size="small"
                    {...tagProps}
                  />
                );
              })
          }
        : {})}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder || (label ? undefined : 'Pilih...')}
          error={error}
          helperText={helperText}
          fullWidth={fullWidth}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: '0.875rem',
              height: size === 'small' ? '40px' : 'auto',
              minHeight: '40px',
              py: '2px'
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.875rem'
            },
            ...inputSx
          }}
        />
      )}
      sx={{
        width: fullWidth ? '100%' : (sx?.width || 'auto'),
        minWidth: minWidth !== undefined ? minWidth : (sx?.minWidth || 0),
        maxWidth: '100%',
        '& .MuiAutocomplete-paper': {
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        },
        ...sx
      }}
    />
  );
};

export default SearchableSelect;
