import React from "react";
import { Box, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, AppBar, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser } from "../features/user/UserSlice";

const drawerWidth = 240;

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { text: "Orders", icon: <ReceiptIcon />, path: "/admin/orders" },
    { text: "Products", icon: <Inventory2Icon />, path: "/admin/products" },
    { text: "Users", icon: <GroupIcon />, path: "/admin/users" },
  ];

  const handleLogout = () => {
    dispatch(logOutUser());
  };
  
  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#212121", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight="bold" color="white">Admin Dashboard</Typography>
          <Button variant="outlined" onClick={handleLogout} startIcon={<LogoutIcon />} sx={{ backgroundColor: "white" }}>
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
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#f5f5f5",
            },
          }}
        >
          <Toolbar />
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: location.pathname === item.path ? "#e0e0e0" : "inherit",
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />{/* All child routes will be rendered here */}
        </Box>
      </Box>
    </>
  );
};

export default AdminPage;
