// src/components/profile/ProfileField.jsx
import React from "react";
import {
  Stack,
  Typography,
  TextField,
  IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

// * Campo de perfil con icono de editar -----------
export default function ProfileField({ label, value }) {
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={{ textTransform: "uppercase" }}>
        {label}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1}>
        <TextField
          fullWidth
          size="small"
          value={value}
          InputProps={{
            readOnly: true,
            sx: { bgcolor: "common.white", borderRadius: 2 }
          }}
        />
        <IconButton size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
