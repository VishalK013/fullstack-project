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
    Tooltip,
} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/carts/CartSlice';
import WishListButton from './WishListButton';
import { fetchWishList } from '../features/wishlist/WishListSlice';
import { xyzURL } from '../common/util';
import { isAuthenticated } from '../api/Api';

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
        if (isAuthenticated()) {
            dispatch(fetchWishList());
        }
    }, [dispatch, fetchAction, limit]);

    if (status === 'loading') return <p>{loadingText}</p>;
    if (status === 'failed') return <p>Error: {error || errorText}</p>;

    const handleAddToCart = (product) => {
        dispatch(addToCart({ productId: product._id, quantity: 1 }));
        toast.success("Product added to cart!", { autoClose: 700, hideProgressBar: true });
    };

    const handleViewAll = () => {
        if (limit < MAX_LIMIT) {
            setLimit(prev => Math.min(prev + 4, MAX_LIMIT));
        } else {
            toast.info("Redirecting to all products...", { autoClose: 700, hideProgressBar: true });
            navigate("/products");
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
                        <Card
                            sx={{
                                height: '100%',
                                width: "300px",
                                boxShadow: 'none',
                                border: 'none',
                                textAlign: "center",
                                position: "relative",
                                overflow: "visible"
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="300"
                                position="relative"
                                image={`${xyzURL}${product.image}`}
                                alt={product.name}
                                sx={{ borderRadius: 5, cursor: "pointer" }}
                                onClick={() => navigate(`/products/${product._id}`)}
                            />

                            <Tooltip title="Add to Wishlist">
                                <span 
                                    style={{
                                        position:"absolute",
                                        top:"0px",
                                        right:"0px"
                                    }}
                                >
                                    <WishListButton
                                        productId={product._id}
                                        iconSize="small"
                                        cursor="pointer"
                                    />
                                </span>
                            </Tooltip>

                            <CardContent>
                                <Typography variant="h6" component="div" gutterBottom>
                                    {product.name}
                                </Typography>
                                <Box display="flex" alignItems="center" justifyContent={"center"} gap={1}>
                                    <Rating value={Number(product.rating) || 0} readOnly precision={0.5} size="medium" />
                                    <Typography variant="body2" color="text.secondary">
                                        ({product.numReviews || 0} review{product.numReviews === 1 ? '' : 's'})
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
