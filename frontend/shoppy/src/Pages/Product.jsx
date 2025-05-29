import React, { useEffect, useMemo, useRef, useState } from "react";
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
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const Product = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const formRef = useRef(null);
    const dispatch = useDispatch();

    const { loading, error, products, addProductSuccess } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (addProductSuccess) {
            console.log("Product added successfully, resetting form and refetching...");
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
            price: Yup.number()
                .typeError("Price must be a number")
                .positive("Price must be positive")
                .required("Price is required"),
            description: Yup.string().required("Description is required"),
            category: Yup.string().required("Category is required"),
            rating: Yup.number()
                .typeError("Rating must be a number")
                .min(0, "Rating cannot be less than 0")
                .max(5, "Rating cannot be more than 5")
                .required("Rating is required"),
            image: Yup.mixed()
                .test(
                    "fileType",
                    "Unsupported File Format",
                    value => {
                        if (!value) return true;
                        if (typeof value === "string") return true;

                        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
                    }
                )
        }),
        onSubmit: async (values) => {
            console.log("Submitting form. Values:", values);

            const isFormDataNeeded = !isEditing;
            const payload = isFormDataNeeded ? new FormData() : values;

            if (isFormDataNeeded) {
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

                await dispatch(fetchProducts());
                formik.resetForm();
                setIsEditing(false);
                setEditProductId(null);
            } catch (error) {
                console.error("Error during submission:", error);
            }
        }

    });

    const handleImageChange = (event) => {
        const file = event.currentTarget.files[0];
        formik.setFieldValue("image", file);
    };

    const handleDelete = (id) => {

        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id)).then(() => {
                dispatch(fetchProducts());
            });
        }
    };

    const scrollToForm = () => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    const handleEdit = (product) => {
        formik.setValues({
            ...product,
            image: `http://localhost:5000${product.image}`,
        });
        setIsEditing(true);
        setEditProductId(product._id);
        scrollToForm();
    };

    const renderedProducts = useMemo(() => {
        return (
            <Grid container spacing={5} justifyContent={"center"} padding={5} backgroundColor="#f5f5f5" borderRadius={4}>
                {products.map((product) => (
                    <Grid key={product._id}>
                        <Card sx={{ height: "100%", width: "300px", display: "flex", flexDirection: "column", borderRadius: 4 }}>
                            <CardMedia
                                component="img"
                                image={`http://localhost:5000${product.image}`}
                                alt={product.name}
                                sx={{ height: 200, objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2"><strong>Category:</strong> {product.category}</Typography>
                                <Typography variant="body2"><strong>Description:</strong> {product.description}</Typography>
                                <Typography variant="body2"><strong>Price:</strong> &#36;{product.price}</Typography>
                                <Typography variant="body2"><strong>Rating:</strong> {product.rating}</Typography>
                            </CardContent>
                            <Box display="flex" justifyContent="space-between" gap={2} p={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleEdit(product)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }, [products]);

    return (
        <Box width="100%" py={4} px={{ xs: 2, sm: 4, md: 10 }} textAlign={"center"}>
            <Box mb={6}>{renderedProducts}</Box>

            <Box
                component="form"
                ref={formRef}
                onSubmit={formik.handleSubmit}
                sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: 4,
                    p: 4,
                    width: "100%",
                    maxWidth: 500,
                    mx: "auto",
                }}
            >
                {isEditing ? <Typography fontWeight={700} variant="h5" mb={2} textAlign="center">Edit Product</Typography> : <Typography fontWeight={700} variant="h5" mb={2} textAlign="center"> Add New Product</Typography>}
                {["name", "price", "description", "category", "rating"].map((field) => (
                    <TextField
                        key={field}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        type={field === "price" || field === "rating" ? "number" : "text"}
                        sx={{width:"100%"}}
                        margin="normal"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[field]}
                        error={formik.touched[field] && Boolean(formik.errors[field])}
                        helperText={formik.touched[field] && formik.errors[field]}
                        required
                        inputProps={field === "rating" ? { step: "0.1" } : {}}
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
                        <Typography color="error" sx={{ mt: 1 }}>
                            {formik.errors.image}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        sx={{ mt: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : isEditing ? "Update Product" : "Add Product"}
                    </Button>
                </Box>

                {error && (
                    <Typography color="error" mt={2}>
                        {error}
                    </Typography>
                )}
                {addProductSuccess && (
                    <Typography color="success.main" mt={2}>
                        Product added successfully!
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default Product;
