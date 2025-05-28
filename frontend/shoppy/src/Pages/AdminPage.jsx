import React, { useEffect, useState } from "react";
import {
  Box, Paper, Typography, Grid, CircularProgress, Button,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Toolbar, AppBar
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { logOutUser } from "../features/user/UserSlice";

const drawerWidth = 240;

function AdminPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOutUser());
  };

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setTimeout(() => {
        setStats({
          totalProducts: 125,
          totalOrders: 320,
          totalUsers: 54,
        });
        setLoading(false);
      }, 1000);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={4} sx={cardStyles("#e3f2fd")}>
                <StorefrontIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                <StatBox label="Total Products" value={stats.totalProducts} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={4} sx={cardStyles("#fff3e0")}>
                <ShoppingCartIcon sx={{ fontSize: 50, color: "#fb8c00" }} />
                <StatBox label="Total Orders" value={stats.totalOrders} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={4} sx={cardStyles("#e8f5e9")}>
                <PeopleIcon sx={{ fontSize: 50, color: "#43a047" }} />
                <StatBox label="Total Users" value={stats.totalUsers} />
              </Paper>
            </Grid>
          </Grid>
        );
      case "Orders":
        return <Typography variant="h5">Orders section coming soon...</Typography>;
      case "Products":
        return <Typography variant="h5">Manage your products here.</Typography>;
      case "Users":
        return <Typography variant="h5">User list and actions will be here.</Typography>;
      default:
        return <Typography variant="h6">Select a section</Typography>;
    }
  };

  return (
    <>

      <AppBar position="fixed" sx={{ backgroundColor: "#212121", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Admin Dashboard
          </Typography>
          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ backgroundColor: "white" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", mt: 10 }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#f5f5f5"
            },
          }}
        >
          <Toolbar />
          <List>
            {["Dashboard", "Orders", "Products", "Users"].map((text, index) => (
              <ListItem
                button
                key={text}
                selected={activeSection === text}
                onClick={() => setActiveSection(text)}
                sx={{cursor:"pointer"}}
              >
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3, display: "flex", justifyContent: "center " }} >
          {renderContent()}
        </Box>
      </Box>
    </>
  );
}

const StatBox = ({ label, value }) => (
  <Box>
    <Typography variant="subtitle1" fontWeight={600}>{label}</Typography>
    <Typography variant="h4" fontWeight={700}>{value}</Typography>
  </Box>
);

const cardStyles = (bgColor,) => ({
  p: 3,
  display: "flex",
  alignItems: "center",
  gap: 2,
  backgroundColor: bgColor,
  transition: "0.3s",
  "&:hover": { boxShadow: 6 }
});

export default AdminPage;
