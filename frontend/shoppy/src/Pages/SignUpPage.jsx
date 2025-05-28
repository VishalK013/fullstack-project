import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Paper,
    Typography,
    Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockIcon from "@mui/icons-material/Lock";
import { clearStatus, signupUser } from "../features/user/UserSlice";
import { useDispatch, useSelector } from "react-redux";

const inputRow = {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    width: "100%",
};

const inputStyle = {
    backgroundColor: "#edebeb",
    "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
    },
};

function SignUpPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "user"
    });

    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();
    const { loading,success, error } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            navigate("/login");
        }

        return () => {
            dispatch(clearStatus());
        };
    }, [dispatch, success, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        if (error) dispatch(clearStatus());
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

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

        dispatch(signupUser(formData));

        setFormData({
            username: "",
            email: "",
            password: "",
            role: "user"
        });
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
            >
                <Typography variant="h3" fontWeight={900}>
                    Sign up
                </Typography>

                <Box sx={inputRow}>
                    <PersonIcon color="action" sx={{ fontSize: 27 }} />
                    <TextField
                        label="Username"
                        name="username"
                        type="text"
                        value={formData.username}
                        fullWidth
                        size="small"
                        placeholder="Enter your username"
                        onChange={handleChange}
                        error={Boolean(errors.username)}
                        helperText={errors.username}
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
                            ...inputStyle,
                            position: "relative",
                        }}
                    />
                </Box>

                <Box sx={inputRow}>
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
                            ...inputStyle,
                            position: "relative",
                        }}
                    />
                </Box>

                <Box sx={inputRow}>
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
                            ...inputStyle,
                            position: "relative",
                        }}
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                    Already have an account?{" "}
                    <MuiLink component={Link} to="/login" underline="hover">
                        Click here!
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
                    {loading ? "Signing up..." : "Sign up"}
                </Button>
            </Paper>
        </Box>
    );
}

export default SignUpPage;
