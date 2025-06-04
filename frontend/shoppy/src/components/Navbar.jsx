import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../features/user/UserSlice';
import { selectCartQuantity, getCart, clearCart } from '../features/carts/CartSlice';

function Navbar() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const quantity = useSelector(selectCartQuantity);
  console.log("Cart quantity in Navbar:", quantity);

  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logOutUser());
    dispatch(clearCart());
    navigate("/");
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <Box>
      {bannerVisible && (
        <Typography
          variant="body2"
          color="primary"
          sx={{
            position: 'relative',
            backgroundColor: 'black',
            color: 'white',
            textAlign: 'center',
            fontSize: { xs: 9, md: 11, lg: 13 },
            py: 1,
          }}
        >
          Sign up and get 20% off to your first order — Sign up Now
          <IconButton
            onClick={() => setBannerVisible(false)}
            size="small"
            sx={{
              position: 'absolute',
              right: { xs: 20, md: 40, lg: 60 },
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Typography>
      )}

      <AppBar position="static" color="default" elevation={1} sx={{ px: { xs: 0, sm: 0, md: 2, lg: 3 } }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: "center" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: { md: 'block', lg: 'none' } }}>
              <IconButton onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              SHOP.CO
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: 'none', lg: 'flex' }, gap: 3 }}>
            <Button color="inherit" sx={{ fontWeight: 700, textTransform: 'none' }}>
              Shop
            </Button>
            <Button color="inherit" sx={{ fontWeight: 700, textTransform: 'none' }}>
              On Sale
            </Button>
            <Button color="inherit" sx={{ fontWeight: 700, textTransform: 'none' }}>
              New Arrival
            </Button>
            <Button color="inherit" sx={{ fontWeight: 700, textTransform: 'none' }}>
              Brands
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Paper
              component="form"
              sx={{
                display: { xs: "none", sm: "flex", md: "flex", lg: "flex" },
                alignItems: 'center',
                px: 1,
                py: 0.5,
                borderRadius: 10,
                width: { xs: 100, sm: 150, md: 300, lg: 500 },
                backgroundColor: '#F2F0F1',
              }}
              elevation={0}
            >
              <SearchIcon fontSize="small" sx={{ color: 'gray' }} />
              <InputBase
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
                sx={{ ml: 1, flex: 1 }}
              />
            </Paper>

            <IconButton component={Link} to="/cart" aria-label="cart">
              <Badge badgeContent={quantity}  color="primary">
                <ShoppingCartOutlinedIcon  sx={{fontSize:{xs:20}}} />
              </Badge>
            </IconButton>

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: 8, sm: 10, md: 12, lg: 14 } }}>
                  Welcome, {user.username}
                </Typography>
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: "red",
                    fontWeight: 'bold',
                    p:1,
                    fontSize: { xs: 6, sm: 10 , md: 12},
                    width: { xs: 50, sm: 80, md: 100 },
                    ml: 1,
                  }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  component={Link}
                  to="/signup"
                  variant="outlined"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontSize: { xs: 8, sm: 10, md: 12 },
                    p: 1,
                    width: { xs: 50, sm: 80, md: 100 },
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontSize: { xs: 8, sm: 10, md: 12 },
                    p: 1,
                    width: { xs: 50, sm: 80, md: 100 },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            p: 2,
          }}
        >
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            <ListItem button>
              <ListItemText primary="Shop" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="On Sale" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="New Arrival" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Brands" />
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>
    </Box>
  );
}

export default Navbar;
