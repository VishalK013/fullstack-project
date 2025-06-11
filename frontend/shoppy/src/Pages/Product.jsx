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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Avatar,
    TextField,
    Button,
    CircularProgress,
    Box,
    Typography,
    Dialog,
    Grow,
    Pagination, // <-- import Pagination here
} from "@mui/material";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";

const Product = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [page, setPage] = useState(1);
    const PRODUCTS_PER_PAGE = 5;

    const dispatch = useDispatch();
    const { loading, error, products, addProductSuccess } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(fetchProducts({ page, limit: 1000 }));
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
            clothingType: "",
            rating: "",
            sold: "",
            colors: "",
            sizes: "",
            image: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            price: Yup.number().typeError("Must be a number").positive("Positive only").required(),
            description: Yup.string().required("Required"),
            category: Yup.string().required("Required"),
            clothingType: Yup.string().required("Clothing type is required"),
            rating: Yup.number().typeError("Must be a number").min(0).max(5).required(),
            sold: Yup.number().typeError("Must be a number").min(0, "Cannot be negative").required("Sold quantity is required"),
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

    const openForm = () => {
        setIsEditing(false);
        setEditProductId(null);
        formik.resetForm();
        setFormDialogOpen(true);
    };

    const handleEdit = (product) => {
        formik.setValues({
            ...product,
            image: `http://localhost:5000${product.image}`,
            sold: product.sold || 0,
            clothingType: product.clothingType || "",
        });
        setIsEditing(true);
        setEditProductId(product._id);
        setFormDialogOpen(true);
    };

    useEffect(() => {
        console.log("Formik values:", formik.values);
    }, [formik.values]);

    const renderedProducts = useMemo(() => (
        <TableContainer component={Paper} sx={{ borderRadius: 4, mt: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Sr. No</strong></TableCell>
                        <TableCell><strong>Image</strong></TableCell>
                        <TableCell><strong>Title</strong></TableCell>
                        <TableCell><strong>Category</strong></TableCell>
                        <TableCell><strong>Price ($)</strong></TableCell>
                        <TableCell><strong>Colors </strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products
                        .slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE)
                        .map((product, index) => (
                            <TableRow key={product._id}>
                                <TableCell>{(page - 1) * PRODUCTS_PER_PAGE + index + 1}</TableCell>
                                <TableCell>
                                    <Avatar
                                        variant="rounded"
                                        src={`http://localhost:5000${product.image}`}
                                        loading="lazy"
                                        alt={product.name}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography fontWeight="bold">{product.name}</Typography>
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>
                                    {Array.isArray(product.colors) && product.colors.length > 0 ? (
                                        <Box display="flex" justifyContent={"center"} alignItems={"center"} gap={1} flexWrap="wrap">
                                            {product.colors.map((color, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: "50%",
                                                        backgroundColor: color,
                                                        border: "1px solid #ccc",
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" textAlign={"center"} fontWeight={700} color="#808080">
                                            Not Available
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleEdit(product)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(product._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer >
    ), [products, page]);

    return (
        <Box width="100%" py={4} px={{ xs: 2, sm: 4, md: 10 }} textAlign="right">
            <Button variant="contained" onClick={openForm}>Add Product</Button>

            <Box mt={2}>{renderedProducts}</Box>

            <Box mt={3} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(products.length / PRODUCTS_PER_PAGE)}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                />
            </Box>

            <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} TransitionComponent={Grow}
                PaperProps={{ sx: { borderRadius: 4, padding: 3 } }}>
                <Box component="form" onSubmit={formik.handleSubmit}
                    sx={{ backgroundColor: "#f5f5f5", borderRadius: 4, p: 4, maxWidth: 500 }}>
                    <Typography fontWeight={700} variant="h5" mb={2} textAlign="center">
                        {isEditing ? "Edit Product" : "Add New Product"}
                    </Typography>

                    {["name", "price", "description", "category", "clothingType", "rating", "sold", "colors", "sizes"].map((field) => (
                        <TextField
                            key={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            type={["price", "rating", "sold"].includes(field) ? "number" : "text"}
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
