import React, { useState, useContext } from "react";
import mountain from "../assets/mountain.png";
import panier from "../assets/panier.png";
import { Link, useHistory } from "react-router-dom";
import { PreferencesContext } from "../context";
import { useAuth } from "../context";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Select,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "../styles/header.css";

// Liens accessibles à tous les visiteurs (non connectés)
const PUBLIC_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/prestations", label: "Prestations" },
  { to: "/preferences", label: "Préférences" },
];

// Liens supplémentaires pour les utilisateurs connectés
const CLIENT_LINKS = [
  { to: "/mes-reservations", label: "Mes réservations" },
  { to: "/favoris", label: "Mes favoris" },
  { to: "/mes-avis", label: "Mes avis" },
];

const ADMIN_MENU_ITEMS = [
  { value: "/admin/items", label: "Gestion Articles" },
  { value: "/adminReservation", label: "Gestion Réservations" },
  { value: "/admin/prestations", label: "Gestion Prestations" },
];

function Header({ cart = [] }) {
  const history = useHistory();
  const { darkMode } = useContext(PreferencesContext);
  const { user, logout } = useAuth();
  const { isAuthenticated, role } = user;

  const nombreArticles = cart.reduce((total, item) => total + item.amount, 0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleAdminNavigate = (e) => {
    const route = e.target.value;
    if (route) {
      history.push(route);
      e.target.value = "";
      setDrawerOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    history.push("/");
    setDrawerOpen(false);
  };

  // Règles d'accès :
  //   Visiteur  → liens publics uniquement
  //   Client    → liens publics + liens client
  //   Admin     → liens publics + liens client (+ menu admin séparé)
  const navLinks = [
    ...PUBLIC_LINKS,
    ...(isAuthenticated ? CLIENT_LINKS : []),
  ];

  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
    fontWeight: "bold",
    transition: "opacity 0.2s",
  };

  const adminSelectSx = {
    color: "inherit",
    fontWeight: "bold",
    boxShadow: "none",
    ".MuiOutlinedInput-notchedOutline": {
      border: darkMode
        ? "1px solid rgba(255, 255, 255, 0.3)"
        : "1px solid rgba(0, 0, 0, 0.3)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: darkMode ? "1px solid white" : "1px solid black",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: darkMode ? "1px solid white" : "1px solid black",
    },
    "& .MuiSvgIcon-root": { color: darkMode ? "#fff" : "inherit" },
  };

  const adminMenuProps = {
    PaperProps: {
      sx: {
        bgcolor: darkMode ? "#2d2d2d" : "white",
        color: darkMode ? "white" : "black",
      },
    },
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: darkMode ? "#1a202c" : "cadetblue",
        color: darkMode ? "#e2e8f0" : "#000",
        boxShadow: "none",
        transition: "background-color 0.3s ease",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              textTransform: "uppercase",
              letterSpacing: 2,
              fontWeight: "bold",
              margin: 0,
            }}
          >
            mont
          </Typography>
          <Link to="/">
            <img
              src={mountain}
              alt="Montagne"
              className="mountain"
              style={{ width: 45, height: 45, border: "none" }}
            />
          </Link>
        </Box>

        {/* Navigation desktop */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 3,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={linkStyle}
              onMouseOver={(e) => (e.target.style.opacity = 0.7)}
              onMouseOut={(e) => (e.target.style.opacity = 1)}
            >
              {link.label}
            </Link>
          ))}

          {/* Menu admin — visible uniquement pour le rôle admin */}
          {isAuthenticated && role === "admin" && (
            <Select
              className="admin-select"
              onChange={handleAdminNavigate}
              defaultValue=""
              displayEmpty
              size="small"
              sx={adminSelectSx}
              MenuProps={adminMenuProps}
            >
              <MenuItem value="" disabled hidden>
                Menu Admin
              </MenuItem>
              {ADMIN_MENU_ITEMS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          )}

          {/* Connexion / Profil + Déconnexion */}
          {!isAuthenticated ? (
            <Link to="/login" style={linkStyle}>
              Connexion
            </Link>
          ) : (
            <>
              <Link to="/profile" style={linkStyle}>
                Profil
              </Link>
              <span
                onClick={handleLogout}
                style={{ ...linkStyle, cursor: "pointer" }}
                onMouseOver={(e) => (e.target.style.opacity = 0.7)}
                onMouseOut={(e) => (e.target.style.opacity = 1)}
              >
                Déconnexion
              </span>
            </>
          )}

          {/* Panier */}
          <Link
            to="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Badge
              badgeContent={nombreArticles}
              sx={{
                "& .MuiBadge-badge": { backgroundColor: "red", color: "white" },
              }}
            >
              <img
                src={panier}
                alt="panier"
                style={{ width: 28, height: 28, objectFit: "cover" }}
              />
            </Badge>
          </Link>
        </Box>

        {/* Navigation mobile — icône burger + panier */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <Link
            to="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Badge
              badgeContent={nombreArticles}
              sx={{
                "& .MuiBadge-badge": { backgroundColor: "red", color: "white" },
              }}
            >
              <img
                src={panier}
                alt="panier"
                style={{ width: 28, height: 28, objectFit: "cover" }}
              />
            </Badge>
          </Link>

          <IconButton
            color="inherit"
            onClick={toggleDrawer(true)}
            aria-label="menu"
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Drawer mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: darkMode ? "#1a202c" : "#fff",
            color: darkMode ? "#e2e8f0" : "#000",
          },
        }}
      >
        <Box
          sx={{
            width: 260,
            pt: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: darkMode ? "#1a202c" : "#fff",
            color: darkMode ? "#e2e8f0" : "#000",
          }}
          role="presentation"
        >
          <Typography
            variant="h6"
            sx={{
              px: 2,
              pb: 2,
              fontWeight: "bold",
              borderBottom: darkMode ? "1px solid #3d4e5e" : "1px solid #ddd",
            }}
          >
            Menu
          </Typography>

          <List sx={{ flex: 1 }}>
            {navLinks.map((link) => (
              <ListItem
                button
                key={link.to}
                component={Link}
                to={link.to}
                onClick={toggleDrawer(false)}
                sx={{ color: "inherit" }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontWeight: "500" }}
                />
              </ListItem>
            ))}

            {/* Menu admin mobile */}
            {isAuthenticated && role === "admin" && (
              <ListItem>
                <Select
                  onChange={handleAdminNavigate}
                  defaultValue=""
                  displayEmpty
                  fullWidth
                  size="small"
                  sx={{
                    color: "inherit",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(0,0,0,0.3)",
                    },
                    "& .MuiSvgIcon-root": {
                      color: darkMode ? "#fff" : "inherit",
                    },
                  }}
                  MenuProps={adminMenuProps}
                >
                  <MenuItem value="" disabled hidden>
                    Menu Admin
                  </MenuItem>
                  {ADMIN_MENU_ITEMS.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </ListItem>
            )}

            {/* Connexion / Profil */}
            <ListItem
              button
              component={Link}
              to={isAuthenticated ? "/profile" : "/login"}
              onClick={toggleDrawer(false)}
              sx={{
                mt: 2,
                backgroundColor: darkMode
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(95, 158, 160, 0.1)",
              }}
            >
              <ListItemText
                primary={isAuthenticated ? "Mon Profil" : "Connexion"}
                primaryTypographyProps={{
                  fontWeight: "bold",
                  color: darkMode ? "#7ecbd4" : "cadetblue",
                }}
              />
            </ListItem>

            {/* Déconnexion — visible uniquement si connecté */}
            {isAuthenticated && (
              <ListItem
                button
                onClick={handleLogout}
                sx={{
                  backgroundColor: darkMode
                    ? "rgba(255, 80, 80, 0.1)"
                    : "rgba(200, 0, 0, 0.07)",
                }}
              >
                <ListItemText
                  primary="Déconnexion"
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    color: darkMode ? "#f87171" : "#c00",
                  }}
                />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Header;
