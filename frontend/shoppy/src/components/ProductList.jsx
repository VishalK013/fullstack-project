import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Rating,
    Box,
    Button,
} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/carts/CartSlice';

function ProductList({
    fetchAction,
    productsSelector,
    title,
    loadingText,
    errorText,
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [limit, setLimit] = useState(4);
    const MAX_LIMIT = 8;


    const { products, error, status } = useSelector(productsSelector);

    useEffect(() => {
        dispatch(fetchAction({ page: 1, limit }));
    }, [dispatch, fetchAction, limit]);

    if (status === 'loading') return <p>{loadingText}</p>;
    if (status === 'failed') return <p>Error: {error || errorText}</p>;

    const handleAddToCart = (product) => {
        dispatch(addToCart({ productId: product._id, quantity: 1 }));
        toast.success("Product added to cart!", { autoClose: 500 });
    };

    const handleViewAll = () => {
        if (limit < MAX_LIMIT) {
            setLimit(prev => Math.min(prev + 4, MAX_LIMIT));
        } else {
            toast.info("Redirecting to all products...");
            setTimeout(() => {
                navigate("/products");
            }, 2000);
        }
    };

    return (
        <Box px={2} py={4} textAlign={"center"}>
            <Typography variant="h3" fontWeight="900" mt={5} mb={5} gutterBottom>
                {title}
            </Typography>
            <Grid container spacing={3} justifyContent={"center"}>
                {products.map((product) => (
                    <Grid item key={product._id}>
                        <Card sx={{ height: '100%', width:"300px", boxShadow: 'none', border: 'none', textAlign: "center" }}>
                            <CardMedia
                                component="img"
                                height="300"
                                width="100%"
                                loading="lazy"
                                image={`http://localhost:5000${product.image}`}
                                alt={product.name}
                                sx={{ borderRadius: 5 }}
                            />
                            <CardContent>
                                <Typography variant="h6" component="div" gutterBottom>
                                    {product.name}
                                </Typography>
                                <Box display="flex" alignItems="center" justifyContent={"center"} gap={1}>
                                    <Rating value={product.rating} readOnly precision={0.5} size="medium" />
                                    <Typography variant="body2" color="text.secondary">
                                        {product.rating}/5
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="black" fontWeight={700} mt={1} fontSize={22} gutterBottom>
                                    ${product.price}
                                </Typography>
                                <Box alignItems={"center"} gap={2} mt={2} display={"flex"} flexDirection={"column"}>
                                    <Button variant="contained" color="primary" onClick={() => handleAddToCart(product)}>
                                        Add to Cart
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Button variant='outlined' onClick={handleViewAll} sx={{ my: 3 }}>
                {limit < MAX_LIMIT ? 'View All' : 'More Items'}
            </Button>
        </Box>
    );
}

export default ProductList;
