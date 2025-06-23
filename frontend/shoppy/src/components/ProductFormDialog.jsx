import React from "react";
import {
    Dialog,
    Typography,
    Box,
    TextField,
    Button,
    CircularProgress,
    Grow,
} from "@mui/material";

const ProductFormDialog = ({
    open,
    onClose,
    formik,
    loading,
    mode = "add",
}) => {
    const handleImageChange = (e) => {
        const file = e.currentTarget.files[0];
        formik.setFieldValue("image", file);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Grow}
            PaperProps={{ sx: { borderRadius: 4, padding: 3 } }}
        >
            <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{ backgroundColor: "#f5f5f5", borderRadius: 4, p: 4, maxWidth: 500 }}
            >
                <Typography fontWeight={700} variant="h5" mb={2} textAlign="center">
                    {mode === "edit" ? "Edit Product" : "Add New Product"}
                </Typography>

                {["name", "price", "description", "category", "clothingType", "sold", "colors", "sizes"].map((field) => (
                    <TextField
                        key={field}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        type={["price","sold"].includes(field) ? "number" : "text"}
                        fullWidth
                        sx={{ '& .MuiInputBase-input': { height: '10px' } }}
                        margin="normal"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[field]}
                        error={formik.touched[field] && Boolean(formik.errors[field])}
                        helperText={formik.touched[field] && formik.errors[field]}
                        inputProps={field === "rating" ? { step: "0.1" } : {}}
                    />
                ))}

                <Box display="flex" flexDirection="column" alignItems="center">
                    <Button component="label" variant="contained" sx={{ mt: 2 }}>
                        Upload Image
                        <input
                            type="file"
                            name="image"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                            onBlur={formik.handleBlur}
                        />
                    </Button>
                    {formik.touched.image && formik.errors.image && (
                        <Typography color="error" sx={{ mt: 1 }}>{formik.errors.image}</Typography>
                    )}

                    <Button variant="contained" type="submit" disabled={loading} sx={{ mt: 2 }}>
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : mode === "edit" ? "Update Product" : "Add Product"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ProductFormDialog;
