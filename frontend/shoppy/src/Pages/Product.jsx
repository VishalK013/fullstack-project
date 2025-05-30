import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProduct,
    fetchProducts,
    deleteProduct,
    resetAddProductSuccess,
    editProduct
} from "../features/product/ProductSlice";
import {
    TextField,
    Button,
    CircularProgress,
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Grid,
    Dialog,
    Grow,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const Product = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const dispatch = useDispatch();
    const { loading, error, products, addProductSuccess } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (addProductSuccess) {
            formik.resetForm();
            dispatch(fetchProducts());
            const timer = setTimeout(() => {
                dispatch(resetAddProductSuccess());
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [addProductSuccess, dispatch]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            price: "",
            description: "",
            category: "",
            rating: "",
            image: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            price: Yup.number().typeError("Must be a number").positive("Positive only").required(),
            description: Yup.string().required("Required"),
            category: Yup.string().required("Required"),
            rating: Yup.number().typeError("Must be a number").min(0).max(5).required(),
            image: Yup.mixed().test("fileType", "Unsupported Format", value => {
                if (!value || typeof value === "string") return true;
                return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
            }),
        }),
        onSubmit: async (values) => {
            const payload = isEditing ? values : new FormData();
            if (!isEditing) {
                Object.entries(values).forEach(([key, val]) => {
                    if (key === "image" && !val) return;
                    payload.append(key, val);
                });
            }

            try {
                if (isEditing) {
                    await dispatch(editProduct({ id: editProductId, productData: payload }));
                } else {
                    await dispatch(addProduct(payload));
                }

                formik.resetForm();
                setIsEditing(false);
                setEditProductId(null);
                setFormDialogOpen(false);
            } catch (error) {
                console.error("Submission error:", error);
            }
        }
    });

    const handleImageChange = (e) => {
        const file = e.currentTarget.files[0];
        formik.setFieldValue("image", file);
    };

    const handleDelete = (id) => {
        setProductToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        await dispatch(deleteProduct(productToDelete));
        await dispatch(fetchProducts());
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleEdit = (product) => {
        formik.setValues({
            ...product,
            image: `http://localhost:5000${product.image}`,
        });
        setIsEditing(true);
        setEditProductId(product._id);
        setFormDialogOpen(true);
    };

    const renderedProducts = useMemo(() => (
        <Grid container spacing={5} justifyContent="center" padding={5} bgcolor="#f5f5f5" borderRadius={4}>
            {products.map((product) => (
                <Grid key={product._id}>
                    <Card sx={{ width: 300, borderRadius: 4, display: "flex", flexDirection: "column" }}>
                        <CardMedia
                            component="img"
                            image={`http://localhost:5000${product.image}`}
                            alt={product.name}
                            sx={{ height: 200, objectFit: "cover" }}
                        />
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">{product.name}</Typography>
                            <Typography variant="body2"><strong>Category:</strong> {product.category}</Typography>
                            <Typography variant="body2"><strong>Description:</strong> {product.description}</Typography>
                            <Typography variant="body2"><strong>Price:</strong> ${product.price}</Typography>
                            <Typography variant="body2"><strong>Rating:</strong> {product.rating}</Typography>
                        </CardContent>
                        <Box display="flex" justifyContent="space-between" p={2} gap={2}>
                            <Button variant="contained" onClick={() => handleEdit(product)}>Edit</Button>
                            <Button variant="outlined" color="error" onClick={() => handleDelete(product._id)}>Delete</Button>
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    ), [products]);

    const openForm = () => {
        setIsEditing(false);
        setEditProductId(null);
        formik.resetForm();
        setFormDialogOpen(true);
    };

    return (
        <Box width="100%" py={4} px={{ xs: 2, sm: 4, md: 10 }} textAlign="center">
            <Button variant="contained" onClick={openForm}>Add Product</Button>

            <Box mt={2}>{renderedProducts}</Box>

            <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} TransitionComponent={Grow}
                PaperProps={{ sx: { borderRadius: 4, padding: 3 } }}>
                <Box component="form" onSubmit={formik.handleSubmit}
                    sx={{ backgroundColor: "#f5f5f5", borderRadius: 4, p: 4, maxWidth: 500 }}>
                    <Typography fontWeight={700} variant="h5" mb={2} textAlign="center">
                        {isEditing ? "Edit Product" : "Add New Product"}
                    </Typography>

                    {["name", "price", "description", "category", "rating"].map((field) => (
                        <TextField
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            type={["price", "rating"].includes(field) ? "number" : "text"}
                            fullWidth
                            sx={{
                                '& .MuiInputBase-input': {
                                    height: '10px'
                                }
                            }}
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values[field]}
                            error={formik.touched[field] && Boolean(formik.errors[field])}
                            helperText={formik.touched[field] && formik.errors[field]}
                            inputProps={field === "rating" ? { step: "0.1" } : {}
                            }
                        />
                    ))}

                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
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
                            {loading ? <CircularProgress size={24} /> : isEditing ? "Update Product" : "Add Product"}
                        </Button>
                    </Box>

                    {error && <Typography color="error" mt={2}>{error}</Typography>}
                    {addProductSuccess && <Typography color="success.main" mt={2}>Product added successfully!</Typography>}
                </Box>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} TransitionComponent={Grow}
                PaperProps={{ sx: { borderRadius: 4, padding: 3 } }}>
                <Box p={5}>
                    <Typography variant="h6" mb={2}>Are you sure you want to delete this product?</Typography>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="contained" sx={{ backgroundColor: "red" }} onClick={confirmDelete}>Delete</Button>
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
};

export default Product;
