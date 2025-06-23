// src/components/profile/ProfileAvatar.jsx
import React from "react";
import { Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

// * Avatar circular con icono placeholder --------
export default function ProfileAvatar({ size = 120 }) {
  return (
    <Box
      sx={{
        width:  size,
        height: size,
        borderRadius: "50%",
        bgcolor: "common.black",
        color: "primary.light",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }}
    >
      <PersonIcon sx={{ fontSize: size * 0.5 }} />
    </Box>
  );
}
