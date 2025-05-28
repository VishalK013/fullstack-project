import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, fetchProducts } from "../features/product/ProductSlice";
import {
    TextField,
    Button,
    CircularProgress,
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
} from "@mui/material";

const ProductForm = () => {
    const dispatch = useDispatch();

    const { loading, error, products, addProductSuccess } = useSelector(
        (state) => state.product
    );

    const [formValues, setFormValues] = useState({
        name: "",
        price: "",
        description: "",
        category: "",
        rating: "",
        image: null,
    });

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (addProductSuccess) {
            setFormValues({
                name: "",
                price: "",
                description: "",
                category: "",
                rating: "",
                image: null,
            });
            dispatch(fetchProducts());
        }
    }, [addProductSuccess, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setFormValues((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(formValues).forEach(([key, val]) => {
            formData.append(key, val);
        });

        dispatch(addProduct(formData));
    };

    return (
        <>
            <Box display={"flex"} flexDirection={"column"}>
                <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
                    {products &&
                        products.map((product) => (
                            <Card key={product._id} sx={{ width: 250 }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={`http://localhost:5000${product.image}`}
                                    alt={product.name}
                                />
                                <CardContent>
                                    <Typography variant="h6">{product.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {product.description}
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        ₹{product.price}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                </Box>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        p: 5,
                        borderRadius: 5,
                        maxWidth: 450,
                        mx: "auto",
                        backgroundColor: "#f5f5f5",
                        textAlign: "center",
                    }}
                >
                    <TextField
                        label="Name"
                        name="name"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        value={formValues.name}
                        required
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        value={formValues.price}
                        required
                    />
                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        value={formValues.description}
                        required
                    />
                    <TextField
                        label="Category"
                        name="category"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        value={formValues.category}
                        required
                    />
                    <TextField
                        label="Rating"
                        name="rating"
                        type="number"
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        value={formValues.rating}
                        required
                    />
                    <Button
                        component="label"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Upload Image
                        <input
                            type="file"
                            name="image"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                    </Button>

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 2, textAlign: "center" }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Add Product"}
                    </Button>

                    {error && <Typography color="error" mt={2}>{error}</Typography>}
                    {addProductSuccess && (
                        <Typography color="success.main" mt={2}>
                            Product added successfully!
                        </Typography>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default ProductForm;
