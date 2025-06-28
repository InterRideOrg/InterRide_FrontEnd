import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect({
  target,
  setTarget,
  targetLabel = 'Selecciona',
  options = [],
  valueKey = 'value',
  labelKey = 'label',
  format = (value) => value
}) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="basic-select-label">{targetLabel}</InputLabel>
        <Select
          labelId="basic-select-label"
          id="basic-select"
          value={target}
          label={targetLabel}
          onChange={(e) => setTarget(e.target.value)}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option[valueKey]}>
              {option[labelKey] != "Efectivo" ? format(option[labelKey]) : option[labelKey]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
