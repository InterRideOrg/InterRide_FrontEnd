import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Avatar,
  Tooltip,
  Stack,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Mapeo de pestañas del conductor
const links = [
  { to: "/driver/home",            label: "Inicio" },
  { to: "/driver/wallet",          label: "Billetera" },
  { to: "/help",                   label: "Ayuda" },
  { to: "/driver/notifications",   label: "Notificaciones" },
];

export default function DriverMenu() {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {links.map(({ to, label }) => (
        <Button
          key={to}
          component={NavLink}
          to={to}
          color="inherit"
          sx={{
            px: 2,
            fontSize: 14,
            "&.active": { fontWeight: 700, borderBottom: 2, borderColor: "secondary.main" },
          }}
        >
          {label}
        </Button>
      ))}

      {/* Placeholder de avatar / futuro menú de usuario */}
      <Tooltip title="Mi perfil">
        <IconButton component={NavLink} to="/profile" sx={{ p: 0 }}>
          <Avatar
            src=""               // ← URL del avatar aquí
            alt="avatar"
            sx={{ width: 32, height: 32 }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </Avatar>
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
