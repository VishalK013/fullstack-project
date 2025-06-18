import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Routes & Pages
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import AdminPage from "./Pages/AdminPage";
import Product from './Pages/Product';
import UserList from './Pages/UserList';
import SinglePageProduct from './Pages/SinglePageProduct';
import CartPage from './Pages/CartPage';
import UnauthorizedPage from './Pages/UnauthorizedPage';
import ProfilePage from './Pages/ProfilePage';
import UserOrder from './Pages/UserOrder';
import Wishlist from './Pages/Wishlist';
import Category from './Pages/Category';


import Navbar from './components/Navbar';
import Footer from './Pages/Footer';
import ProtectedRoute from './components/auth/Protectedroute';
import ScrollToTop from './components/ScrollToTop';


import theme from "./Theme";
import { checkTokenExpiration } from "./features/user/UserSlice";
import { setOrderToReview, updateOrderStatus } from './features/order/OrderSlice';
import socket from './Socket';

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin") || ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <ScrollToTop />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin' element={<ProtectedRoute allowedRoles={["admin"]}><AdminPage /></ProtectedRoute>} />
        <Route path='/admin/product' element={<ProtectedRoute allowedRoles={['admin']}><Product /></ProtectedRoute>} />
        <Route path='/admin/users' element={<ProtectedRoute allowedRoles={['admin']}><UserList /></ProtectedRoute>} />
        <Route path='/products' element={<ProtectedRoute allowedRoles={["user", "admin"]}><Category /></ProtectedRoute>} />
        <Route path='/products/:id' element={<ProtectedRoute allowedRoles={["user", "admin"]}><SinglePageProduct /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute allowedRoles={["user", "admin"]}><ProfilePage /></ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute allowedRoles={["user", "admin"]}><UserOrder /></ProtectedRoute>} />
        <Route path='/wishlist' element={<ProtectedRoute allowedRoles={["user", "admin"]}><Wishlist /></ProtectedRoute>} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/unauthorized' element={<UnauthorizedPage />} />
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  );
};

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkTokenExpiration());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {

      socket.io.opts.query = { userId: user.id };
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("order-status-updated", ({ orderId, status }) => {
        dispatch(updateOrderStatus({ orderId, status }));
      });

      socket.on("order-delivered", ({ orderId }) => {
        dispatch(setOrderToReview(orderId))
      })

      return () => {
        socket.off("order-status-updated");
        socket.off("order-delivered");
        socket.disconnect();
      };
    }
  }, [user, dispatch]);





  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
