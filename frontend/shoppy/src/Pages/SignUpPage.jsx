import React, { useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Paper,
    Typography,
    Link as MuiLink,
    FormControl,
    FormHelperText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockIcon from "@mui/icons-material/Lock";
import { clearStatus, signupUser } from "../features/user/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const inputRow = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    width: "100%",
};


function SignUpPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, success, error } = useSelector((state) => state.user);

    useEffect(() => {
        if (success) {
            toast.success("Signup successful! Redirecting to login...", {
                position: "top-center",
                autoClose: 2000,
            });

            const timer = setTimeout(() => {
                navigate("/login");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    useEffect(() => {
        return () => dispatch(clearStatus());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            role: "user",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: (values) => {
            dispatch(signupUser(values));
        },
    });

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "background.default",
                px: 2,
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
                    gap: 3,
                    bgcolor: "#fff",
                }}
            >
                <Typography variant="h4" fontWeight={900} textAlign="center">
                    Sign Up
                </Typography>

                {/* Username */}
                <FormControl fullWidth>
                    <Box sx={inputRow}>
                        <PersonIcon color="action" sx={{ fontSize: 24 }} />
                        <TextField
                            name="username"
                            label="Username"
                            type="text"
                            size="small"
                            fullWidth
                            placeholder="Enter your username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
                            autoComplete="email"
                            FormHelperTextProps={{
                                sx: {
                                    right: 0,
                                    top: "20%",
                                    fontSize: "0.75rem",
                                    color: "error.main",
                                    width: "auto",
                                    position: "absolute",
                                },
                            }}
                            sx={{
                                backgroundColor: "#edebeb",
                                position: "relative", // required for absolute positioning
                            }}
                        />

                    </Box>
                </FormControl>

                {/* Email */}
                <FormControl fullWidth>
                    <Box sx={inputRow}>
                        <MailOutlineIcon color="action" sx={{ fontSize: 24 }} />
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            size="small"
                            fullWidth
                            placeholder="Enter your email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            autoComplete="email"
                            FormHelperTextProps={{
                                sx: {
                                    right: 0,
                                    top: "20%",
                                    fontSize: "0.75rem",
                                    color: "error.main",
                                    width: "auto",
                                    position: "absolute",
                                },
                            }}
                            sx={{
                                backgroundColor: "#edebeb",
                                position: "relative", // required for absolute positioning
                            }}
                        />

                    </Box>
                </FormControl>

                {/* Password */}
                <FormControl fullWidth>
                    <Box sx={inputRow}>
                        <LockIcon color="action" sx={{ fontSize: 24 }} />
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
                            FormHelperTextProps={{
                                sx: {
                                    right: 0,
                                    top: "20%",
                                    fontSize: "0.75rem",
                                    color: "error.main",
                                    width: "auto",
                                    position: "absolute",
                                },
                            }}
                            sx={{
                                backgroundColor: "#edebeb",
                            }}
                        />
                    </Box>
                </FormControl>

                {/* Error Display */}
                {error && (
                    <Typography color="error" textAlign="center">
                        {error}
                    </Typography>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ width: "100%", mt: 1, fontSize: 15 }}
                >
                    {loading ? "Signing up..." : "Sign up"}
                </Button>

                {/* Footer link */}
                <Typography variant="body2" textAlign="center" mt={1}>
                    Already have an account?{" "}
                    <MuiLink component={Link} to="/login" underline="hover">
                        Login here
                    </MuiLink>
                </Typography>
            </Paper>
        </Box>
    );
}

export default SignUpPage;
