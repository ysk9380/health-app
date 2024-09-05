import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ServicesIcon from "@mui/icons-material/Build";
import DoctorsIcon from "@mui/icons-material/LocalHospital";
import AppointmentsIcon from "@mui/icons-material/Event";
import PharmacyIcon from "@mui/icons-material/LocalPharmacy";
import PatientPortalIcon from "@mui/icons-material/Person";
import ContactUsIcon from "@mui/icons-material/ContactMail";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import CancelIcon from "@mui/icons-material/Cancel";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { clearPatient } from "../store/patient-slice";
import PartialName from "./partial-name";

const NavBar: React.FC = () => {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector((state: RootState) => state.auth.username);
  const currentPatientProfile = useSelector(
    (state: RootState) => state.currentPatient.profile
  );

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuItemClick = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    setDrawerOpen(false);
    navigate("/login");
  };

  const handleClearPatientSelection = () => {
    dispatch(clearPatient());
    navigate("/patients");
  };

  const handleNavigationClick = (url: string) => {
    navigate(url);
  };

  const drawer = (
    <List>
      {username ? (
        <>
          <ListItem component={Link} to="/" onClick={handleMenuItemClick}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t("navigation.home")} />
          </ListItem>

          <ListItem
            component={Link}
            to="/services"
            onClick={handleMenuItemClick}
          >
            <ListItemIcon>
              <ServicesIcon />
            </ListItemIcon>
            <ListItemText primary={t("navigation.services")} />
          </ListItem>
          <ListItem
            component={Link}
            to="/doctors"
            onClick={handleMenuItemClick}
          >
            <ListItemIcon>
              <DoctorsIcon />
            </ListItemIcon>
            <ListItemText primary={t("navigation.doctors")} />
          </ListItem>
          <ListItem
            component={Link}
            to="/appointments"
            onClick={handleMenuItemClick}
          >
            <ListItemIcon>
              <AppointmentsIcon />
            </ListItemIcon>
            <ListItemText primary={t("navigation.appointments")} />
          </ListItem>
          <ListItem
            component={Link}
            to="/pharmacy"
            onClick={handleMenuItemClick}
          >
            <ListItemIcon>
              <PharmacyIcon />
            </ListItemIcon>
            <ListItemText primary={t("navigation.pharmacy")} />
          </ListItem>
          {currentPatientProfile ? (
            <ListItem
              sx={{
                backgroundColor: "#FFDB58",
                "&:hover": {
                  backgroundColor: "#DAA520",
                },
              }}
              onClick={() => handleNavigationClick("/patients/information")}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <PartialName
                name={`${currentPatientProfile.firstname} ${currentPatientProfile.lastname}`}
              />
              <ListItemIcon
                sx={{ marginLeft: 1, fontSize: 16 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearPatientSelection();
                }}
              >
                <CancelIcon fontSize="small" /> {/* Add the CancelIcon here */}
              </ListItemIcon>
            </ListItem>
          ) : (
            <ListItem component={Link} to="/patients">
              <ListItemIcon>
                <PatientPortalIcon />
              </ListItemIcon>
              <ListItemText primary={t("navigation.patientPortal")} />
            </ListItem>
          )}
          <ListItem component={Link} to="/login" onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={t("navigation.logout")} />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem
            component={Link}
            to="/contact-us"
            onClick={handleMenuItemClick}
          >
            <ListItemIcon>
              <ContactUsIcon />
            </ListItemIcon>
            <ListItemText primary={t("navigation.contactUs")} />
          </ListItem>
          <ListItem component={Link} to="/login" onClick={handleMenuItemClick}>
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary={t("navigation.login")} />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flex: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ textTransform: "none" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} />
            <Typography variant="h6" component="span">
              {t("navigation.hospital")}
            </Typography>
          </Button>
        </Box>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleDrawerToggle}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <>
            {username ? (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/services"
                  sx={{ textTransform: "none" }}
                >
                  <ServicesIcon sx={{ mr: 0.5 }} /> {t("navigation.services")}
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/doctors"
                  sx={{ textTransform: "none" }}
                >
                  <DoctorsIcon sx={{ mr: 0.5 }} /> {t("navigation.doctors")}
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/appointments"
                  sx={{ textTransform: "none" }}
                >
                  <AppointmentsIcon sx={{ mr: 0.5 }} />{" "}
                  {t("navigation.appointments")}
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/pharmacy"
                  sx={{ textTransform: "none" }}
                >
                  <PharmacyIcon sx={{ mr: 0.5 }} /> {t("navigation.pharmacy")}
                </Button>
                {currentPatientProfile ? (
                  <Button
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#FFDB58",
                      color: "#2F4F4F",
                      "&:hover": {
                        backgroundColor: "#DAA520",
                        color: "#2F4F4F",
                      },
                    }}
                    onClick={() =>
                      handleNavigationClick("/patients/information")
                    }
                  >
                    <PersonIcon sx={{ mr: 0.5 }} />{" "}
                    <PartialName
                      name={`${currentPatientProfile.firstname} ${currentPatientProfile.lastname}`}
                    />
                    <span
                      style={{
                        marginLeft: 8,
                        cursor: "pointer",
                        paddingTop: 6,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearPatientSelection();
                      }}
                    >
                      <CancelIcon sx={{ fontSize: 16 }} />
                    </span>
                  </Button>
                ) : (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/patients"
                    sx={{ textTransform: "none" }}
                  >
                    <PatientPortalIcon sx={{ mr: 0.5 }} />{" "}
                    {t("navigation.patientPortal")}
                  </Button>
                )}
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ textTransform: "none" }}
                >
                  <LogoutIcon sx={{ mr: 0.5 }} /> {t("navigation.logout")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/contact-us"
                  sx={{ textTransform: "none" }}
                >
                  <ContactUsIcon sx={{ mr: 0.5 }} /> {t("navigation.contactUs")}
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{ textTransform: "none" }}
                >
                  <LoginIcon sx={{ mr: 0.5 }} /> {t("navigation.login")}
                </Button>
              </>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
