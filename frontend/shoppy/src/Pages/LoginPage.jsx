import React, { useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Paper,
    Typography,
    Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearStatus } from "../features/user/UserSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";


function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, success, loading, user } = useSelector((state) => state.user);
    console.log("Redux user state:", { error, success, loading, user });

    const formik = useFormik({
        validateOnMount: true,
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Enter a valid email")
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: (values) => {
            dispatch(loginUser(values));
        },
    });

    useEffect(() => {
        if (success && user) {
            toast.success("Login successful! Redirecting...", {
                position: "top-center",
                autoClose: 2000,
            });

            const redirectPath = user.role === "admin" ? "/admin" : "/";

            const timer = setTimeout(() => {
                navigate(redirectPath);
            }, 2000);

            return () => {
                clearTimeout(timer);
                dispatch(clearStatus());
            };
        }
    }, [success, user, navigate, dispatch]);

    useEffect(() => {
        if (error) {
             console.log("Login error:", error);
            toast.error(error, {
                position: "top-center",
                autoClose: 2000,
                onClose: () => dispatch(clearStatus()),
            });
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (error) {
            dispatch(clearStatus());
        }
    }, [formik.values, dispatch]);

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                px: 2,
                pt: "10%",
            }}
        >
            <Typography variant="h3" fontWeight={900} color="initial">Shop.co</Typography>
            <Paper
                component="form"
                onSubmit={formik.handleSubmit}
                elevation={3}
                sx={{
                    width: 500,
                    p: 4,
                    borderRadius: 5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    gap: 3,
                }}
                noValidate
            >
                <Typography variant="h3" fontWeight={900}>
                    Sign in
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                    <MailOutlineIcon color="action" sx={{ fontSize: 27 }} />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        size="small"
                        placeholder="Enter your email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        autoComplete="email"
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                    <LockIcon color="action" sx={{ fontSize: 27 }} />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        size="small"
                        placeholder="Enter your password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        autoComplete="current-password"
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                    Don't have an account?{" "}
                    <MuiLink component={Link} to="/signup" underline="hover">
                        Sign up here!
                    </MuiLink>
                </Typography>

                {error && (
                    <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                        {error}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{ width: 200, fontSize: 15 }}
                >
                    {loading ? "Logging in..." : "Log in"}
                </Button>
            </Paper>
        </Box>
    );
}

export default LoginPage;
