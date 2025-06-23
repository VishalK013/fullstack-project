import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Avatar,
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { updateUserProfile } from "../features/user/UserSlice";
import { xyzURL } from "../common/util";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const fileInputRef = useRef(null);

    const [profilePic, setProfilePic] = useState("");

    useEffect(() => {
        if (user?.image) {
            setProfilePic(user.image);
        }
    }, [user?.image]);

    const originalData = {
        username: user?.username || "",
        email: user?.email || "",
        profilePic: user?.image || "",
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: user?.username || "",
            email: user?.email || "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
        }),
        onSubmit: (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("email", values.email);
            if (values.password) {
                formData.append("password", values.password);
            }

            const file = fileInputRef.current?.files[0];
            if (file) {
                formData.append("image", file);
            }
            console.log('object', file)

            const id = user?._id || user?.id;

            dispatch(updateUserProfile({ id, formData }));

            resetForm({ values: { ...values, password: "" } });
        },
    });

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const hasChanges = () => {
        return (
            formik.values.username !== originalData.username ||
            formik.values.email !== originalData.email ||
            profilePic !== originalData.profilePic ||
            formik.values.password !== ""
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 10,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 5,
                    textAlign: "center",
                    padding: 4,
                    width: { xs: "90%", sm: "400px" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    Edit Profile
                </Typography>

                <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Avatar
                        src={profilePic.startsWith("data:") ? profilePic : `${xyzURL}${profilePic}`}
                        sx={{ width: 100, height: 100, cursor: "pointer" }}
                        onClick={handleAvatarClick}
                    />
                    <IconButton
                        size="small"
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            backgroundColor: "white",
                            boxShadow: 1,
                            ":hover": { backgroundColor: "#eee" },
                        }}
                        onClick={handleAvatarClick}
                    >
                        <CameraAltIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={(e) => {
                            handleFileChange(e);
                        }}
                    />
                </Box>

                <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={!hasChanges()}
                    >
                        Update Profile
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default ProfilePage;
