import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOutUser } from '../features/user/UserSlice';
import { selectCartQuantity, getCart, clearCart } from '../features/carts/CartSlice';
import { toast } from 'react-toastify';
import UserAvatar from './UserAvatar';
import { fetchOrderCount } from '../features/order/OrderSlice';
import { fetchAllWishListCount } from '../features/wishlist/WishListSlice';


function Navbar() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const orderCount = useSelector((state) => state.orders.orderCount);
  const wishlistCount = useSelector((state) => state.wishlist.wishlistCount);
  const quantity = useSelector(selectCartQuantity);

  useEffect(() => {
    if (user) {
      dispatch(getCart());
      dispatch(fetchOrderCount());
      dispatch(fetchAllWishListCount());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logOutUser());
    dispatch(clearCart());
    toast.error("Logged out successfully", {
      position: "top-center",
      autoClose: 700,
      hideProgressBar: true
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleCartClick = () => {
    toast.success("Redirecting to Cart!", { autoClose: 700, hideProgressBar: true });
    navigate("/cart");
  };

  const handleOrdersClick = () => {
    toast.info("Opening your orders...", { autoClose: 700, hideProgressBar: true });
    navigate("/orders");
  };

  const handleWishList = () => {
    toast.info("Opening wishlist cart...", { autoClose: 700, hideProgressBar: true })
    navigate("/wishlist")
  }

  return (
    <Box>
      {!user && bannerVisible && (
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

          {user && (
            <Box sx={{ display: { xs: "none", md: 'none', lg: 'flex' }, gap: 3 }}>
              <Button color="inherit" onClick={() => {
                toast.success("Redirecting to product page!", { autoClose: 700, hideProgressBar: true });
                navigate("/");
              }}
                sx={{ fontWeight: 700, textTransform: 'none' }}>
                Shop
              </Button>
              <Button color="inherit"
                onClick={() => {
                  toast.success("Redirecting to product page!", { autoClose: 700, hideProgressBar: true });
                  navigate("/products");
                }}
                sx={{ fontWeight: 700, textTransform: 'none' }}>
                Products
              </Button>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: "center" }}>
            <Tooltip title="Shooping Cart">
              <IconButton onClick={handleCartClick} aria-label="cart">
                <Badge badgeContent={quantity} color="primary">
                  <ShoppingCartOutlinedIcon sx={{ fontSize: { xs: 20 } }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {user && (
              <Tooltip title="Wishlist Cart">
                <IconButton onClick={handleWishList} aria-label="orders">
                  <Badge badgeContent={wishlistCount} color="primary">
                    <ListAltIcon sx={{ fontSize: { xs: 20 } }} />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {user && (
              <Tooltip title="My Orders">
                <IconButton onClick={handleOrdersClick} aria-label="orders">
                  <Badge badgeContent={orderCount} color="primary">
                    <ShoppingBagIcon sx={{ fontSize: { xs: 20 } }} />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="My Profile">
                  <span>
                    <UserAvatar
                      size={30}
                      onClick={() => navigate("/profile")}
                      showIconButton
                    />
                  </span>
                </Tooltip>
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    backgroundColor: "red",
                    fontWeight: 'bold',
                    p: 1,
                    fontSize: { xs: 6, sm: 10, md: 12 },
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 2 }}>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button onClick={() => {
              toast.success("Redirecting to Shop!", { autoClose: 700, hideProgressBar: true });
              navigate('/');
            }}>
              <ListItemText sx={{ fontWeight: 900 }} primary="Shop" />
            </ListItem>

            <ListItem button onClick={() => {
              toast.success("Redirecting to Products!", { autoClose: 700, hideProgressBar: true });
              navigate('/products');
            }}>
              <ListItemText sx={{ fontWeight: 900 }} primary="Product" />
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>

    </Box>
  );
}

export default Navbar;
