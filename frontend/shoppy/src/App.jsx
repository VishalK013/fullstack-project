import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Navbar from './components/Navbar';
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import theme from "./Theme";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import AdminPage from "./Pages/AdminPage";
import ProtectedRoute from './components/auth/Protectedroute';
import UnauthorizedPage from './Pages/UnauthorizedPage';
import Product from './Pages/Product';
import UserList from './Pages/UserList';
import SinglePageProduct from './Pages/SinglePageProduct';
import CartPage from './Pages/CartPage';
import { useDispatch } from 'react-redux';
import { checkTokenExpiration } from "./features/user/UserSlice"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Pages/Footer';
import Category from './Pages/Category';


const AppRoutes = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin") || ["/login", "/signup"].includes(location.pathname);


  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/products' element={<Category />}></Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/product'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Product />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/users'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route path='/product/:id' element={<SinglePageProduct />}></Route>
        <Route path='/cart' element={<CartPage />}></Route>
        <Route path='/unauthorized' element={<UnauthorizedPage />}></Route>
      </Routes>

      {!hideNavbar && <Footer />}
    </>
  );
};

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkTokenExpiration());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

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
