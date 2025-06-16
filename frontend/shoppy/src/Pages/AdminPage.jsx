import React, { useEffect, useState } from "react";
import Products from "./Product";
import UserList from "./UserList";
import AdminOrders from "./AdminOrders";
import {
  Box, Paper, Typography, Grid, CircularProgress, Button,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Toolbar, AppBar
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";

import { useDispatch, useSelector } from "react-redux";
import { fetchUserCount, logOutUser } from "../features/user/UserSlice";
import { fetchAllOrderCount } from "../features/order/OrderSlice";
import { fetchAllProductCount } from "../features/product/ProductSlice";

const drawerWidth = 240;

function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("adminActiveSection") || "Dashboard";
  });

  const dispatch = useDispatch();
  const allOrderCount = useSelector((state) => state.orders.allOrderCount);
  const totalProducts = useSelector((state) => state.product.allProductCount);
  const totalUsers = useSelector((state) => state.user.userCount);

  const handleLogout = () => {
    dispatch(logOutUser());
  };

  useEffect(() => {
    dispatch(fetchAllOrderCount()).finally(() => setLoading(false));
    dispatch(fetchAllProductCount()).finally(() => setLoading(false));
    dispatch(fetchUserCount()).finally(() => setLoading(false));
  }, [dispatch]);

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={4} sx={cardStyles("#e3f2fd")}>
                <StorefrontIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                <StatBox label="Total Products" value={totalProducts} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={4} sx={cardStyles("#fff3e0")}>
                <ShoppingCartIcon sx={{ fontSize: 50, color: "#fb8c00" }} />
                <StatBox label="Total Orders" value={allOrderCount || 0} />
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={4} sx={cardStyles("#e8f5e9")}>
                <PeopleIcon sx={{ fontSize: 50, color: "#43a047" }} />
                <StatBox label="Total Users" value={totalUsers} />
              </Paper>
            </Grid>
          </Grid>
        );
      case "Orders":
        return <AdminOrders />;
      case "Products":
        return <Products />;
      case "Users":
        return <UserList />;
      default:
        return <Typography variant="h6">Select a section</Typography>;
    }
  };

  const iconMap = {
    Dashboard: <StorefrontIcon />,
    Orders: <ShoppingCartIcon />,
    Products: <StorefrontIcon />,
    Users: <PeopleIcon />,
  };

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

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#212121",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "white" }}>
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
              bgcolor: "#f5f5f5",
            },
          }}
        >
          <Toolbar />
          <List>
            {["Dashboard", "Orders", "Products", "Users"].map((text) => (
              <ListItem
                key={text}
                selected={activeSection === text}
                onClick={() => {
                  setActiveSection(text);
                  localStorage.setItem("adminActiveSection", text);
                }}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    activeSection === text ? "#e0e0e0" : "inherit",
                }}
              >
                <ListItemIcon>{iconMap[text]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
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

const cardStyles = (bgColor) => ({
  p: 3,
  display: "flex",
  alignItems: "center",
  gap: 2,
  backgroundColor: bgColor,
  transition: "0.3s",
  "&:hover": { boxShadow: 6 }
});

export default AdminPage;
