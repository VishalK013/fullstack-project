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
    Button,
    CircularProgress,
    Box,
    Typography,
    Dialog,
    Grow,
    Pagination,
} from "@mui/material";
import { useFormik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentIcon from "@mui/icons-material/Comment";
import ProductFormDialog from "../components/ProductFormDialog";
import * as Yup from "yup";
import ProductReviewDialog from "../components/ProductReviewDialog";
import { xyzURL } from "../common/util";

const Product = () => {
    const [mode, setMode] = useState("add");
    const [editProductId, setEditProductId] = useState(null);
    const [formDialogOpen, setFormDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);


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


    const handleViewReviews = (productId) => {
        setSelectedProductId(productId);
        setReviewDialogOpen(true);
    };

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
            sold: Yup.number().typeError("Must be a number").min(0, "Cannot be negative").required("Sold quantity is required"),
            image: Yup.mixed().test("fileType", "Unsupported Format", value => {
                if (!value || typeof value === "string") return true;
                return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
            }),
        }),
        onSubmit: async (values) => {
            const payload = mode === "edit" ? values : new FormData();
            if (mode !== "edit") {
                Object.entries(values).forEach(([key, val]) => {
                    if (key === "image" && !val) return;
                    payload.append(key, val);
                });
            }

            try {
                if (mode === "edit") {
                    await dispatch(editProduct({ id: editProductId, productData: payload }));
                } else {
                    await dispatch(addProduct(payload));
                }

                formik.resetForm();
                setEditProductId(null);
                setFormDialogOpen(false);
            } catch (error) {
                console.error("Submission error:", error);
            }
        }
    });

    const openAddForm = () => {
        setMode("add");
        formik.resetForm();
        setFormDialogOpen(true);
    };

    const handleEdit = (product) => {
        setMode("edit");
        formik.setValues({
            ...product,
            image: `${xyzURL}${product.image}`,
            sold: product.sold || 0,
            clothingType: product.clothingType || "",
        });
        setEditProductId(product._id);
        setFormDialogOpen(true);
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
                                        src={`${xyzURL}${product.image}`}
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
                                        <Box display="flex" justifyContent="center" alignItems="center" gap={1} flexWrap="wrap">
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
                                        <Typography variant="body2" textAlign="center" fontWeight={700} color="#808080">
                                            Not Available
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleViewReviews(product._id)}>
                                        <CommentIcon />
                                    </IconButton>
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
        </TableContainer>
    ), [products, page]);

    return (
        <Box width="100%" px={{ xs: 2, sm: 4, md: 10 }} textAlign="right">
            <Button variant="contained" onClick={openAddForm}>Add Product</Button>

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

            <ProductFormDialog
                open={formDialogOpen}
                onClose={() => setFormDialogOpen(false)}
                formik={formik}
                loading={loading}
                mode={mode}
            />

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
            {selectedProductId && (
                <ProductReviewDialog
                    open={reviewDialogOpen}
                    onClose={() => setReviewDialogOpen(false)}
                    productId={selectedProductId}
                />
            )}

        </Box>
    );
};

export default Product;
