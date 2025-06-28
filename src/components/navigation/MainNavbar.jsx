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
  useMediaQuery,
} from "@mui/material";
import MenuIcon            from "@mui/icons-material/Menu";
import AccountCircleIcon   from "@mui/icons-material/AccountCircle";
import DriveEtaIcon        from "@mui/icons-material/DriveEta";

import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTheme }  from "@mui/material/styles";

import { useAuth }   from "../../auth/AuthContext";
import useMenus      from "../../constants/menus";             // ✅  importación correcta

/* ────────────────────────────────────────────────────────── */
export default function MainNavbar() {
  const { user }      = useAuth();
  const navigate      = useNavigate();
  const theme         = useTheme();
  const isDesktop     = useMediaQuery(theme.breakpoints.up("md"));
  const { pathname }  = useLocation();

  const onLanding = pathname === "/";

  /* Links para usuario autenticado (PASSENGER / DRIVER) */
  const userLinks = useMenus();

  /* Links fijos del landing page */
  const landingLinks = [
    { label: "Inicio",    target: "hero"      },
    { label: "Nosotros",  target: "about"     },
    { label: "Contacto",  target: "contact"   },
    { label: "Regístrate", path: "/register"  },
    { label: "Inicia Sesión", path: "/login"  }
  ];

  const links = onLanding ? landingLinks : userLinks;

  /* Drawer móvil */
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(p => !p);

  /* Scroll suave (landing) */
  const smoothScroll = id =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* ─────────────────────────── UI ─────────────────────────── */
  return (
    <>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display         : "flex",
              alignItems      : "center",
              color           : "inherit",
              textDecoration  : "none",
              gap             : 1
            }}
          >
            <DriveEtaIcon fontSize="small" />
            <Typography variant="h6" fontWeight={700}>
              Inter<span style={{ fontWeight: 300 }}>Ride</span>
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Links en desktop */}
          {isDesktop && (
            <Stack direction="row" spacing={3} sx={{ mr: 2 }}>
              {links.map(({ label, path, target }) =>
                onLanding && target ? (
                  <Typography
                    key={label}
                    component="a"
                    href={`#${target}`}
                    onClick={e => {
                      e.preventDefault();
                      smoothScroll(target);
                    }}
                    sx={linkSx}
                  >
                    {label}
                  </Typography>
                ) : (
                  <Typography
                    key={label}
                    component={NavLink}
                    to={path}
                    sx={linkSx}
                  >
                    {label}
                  </Typography>
                )
              )}
            </Stack>
          )}

          {/* Botón menú (móvil) */}
          {!isDesktop && (
            <IconButton color="inherit" edge="end" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Ícono perfil (no en landing) */}
          {!onLanding && (
            <Tooltip title="Perfil">
              <IconButton color="inherit" onClick={() => navigate("/profile")}>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer móvil */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 240 }} role="presentation" onClick={toggleDrawer}>
          <List>
            {links.map(({ label, path, target }) => (
              <ListItem key={label} disablePadding>
                {onLanding && target ? (
                  <ListItemButton
                    component="a"
                    href={`#${target}`}
                    onClick={e => {
                      e.preventDefault();
                      smoothScroll(target);
                    }}
                  >
                    <ListItemText primary={label} />
                  </ListItemButton>
                ) : (
                  <ListItemButton component={Link} to={path}>
                    <ListItemText primary={label} />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

/* Estilo base para los links */
const linkSx = {
  color          : "inherit",
  textDecoration : "none",
  fontSize       : 14,
  "&.active"     : {
    fontWeight   : 600,
    borderBottom : "2px solid currentColor",
  },
};
