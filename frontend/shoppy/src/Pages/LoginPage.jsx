import React, { useEffect, useState, useRef } from "react";
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

function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const lastEmailRef = useRef("");
    const dispatch = useDispatch();
    const { error, success, loading, user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (success && user) {
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
            setFormData({ email: "", password: "" }); // Clear form on success
        }

        return () => {
            dispatch(clearStatus());
        };
    }, [dispatch, success, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        lastEmailRef.current = formData.email;
        dispatch(loginUser(formData));
    };

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                px: 2,
                pt: "10%",
            }}
        >
            <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={3}
                sx={{
                    width: 400,
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
                        value={formData.email}
                        fullWidth
                        size="small"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
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
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                            position: "relative",
                        }}
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                    <LockIcon color="action" sx={{ fontSize: 27 }} />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        fullWidth
                        size="small"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        error={Boolean(errors.password)}
                        helperText={errors.password}
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
                            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                            position: "relative",
                        }}
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
