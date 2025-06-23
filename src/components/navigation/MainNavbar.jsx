// src/components/navigation/MainNavbar.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Stack,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import menus from "../../constants/menus";
import { useAuth } from "../../auth/AuthContext";

export default function MainNavbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const links =
    user?.roles.includes("CONDUCTOR") ? menus.DRIVER : menus.PASSENGER;

  /* --- Drawer state --- */
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  /* --------- */
  return (
    <>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>

          {/* LOGO */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "inherit",
              textDecoration: "none",
              gap: 1
            }}
          >
            <DriveEtaIcon fontSize="small" />
            <Typography variant="h6" fontWeight={700}>
              Inter<span style={{ fontWeight: 300 }}>Ride</span>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Rutas – desktop vs móvil */}
          {isDesktop ? (
            /* ------- Desktop (menu inline) ------- */
            <Stack direction="row" spacing={3} sx={{ mr: 2 }}>
              {links.map(({ label, path }) => (
                <Typography
                  key={path}
                  component={NavLink}
                  to={path}
                  sx={{
                    color: "inherit",
                    textDecoration: "none",
                    fontSize: 14,
                    "&.active": {
                      fontWeight: 600,
                      borderBottom: "2px solid currentColor"
                    }
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Stack>
          ) : (
            /* ------- Mobile (button) ------- */
            <IconButton
              size="large"
              color="inherit"
              edge="end"
              aria-label="menú principal"
              onClick={toggle}
              sx={{ mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Icono perfil (igual en ambas vistas) */}
          <Tooltip title="Perfil">
            <IconButton
              size="large"
              color="inherit"
              onClick={() => navigate("/profile")}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* -------- Drawer móvil -------- */}
      <Drawer anchor="right" open={open} onClose={toggle}>
        <Box sx={{ width: 240 }} role="presentation" onClick={toggle}>
          <List>
            {links.map(({ label, path }) => (
              <ListItem key={path} disablePadding>
                <ListItemButton component={Link} to={path}>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
