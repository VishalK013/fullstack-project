import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { topSellings } from "../features/product/ProductSlice"
import { addToCart } from "../features/carts/CartSlice"
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
import { Link } from 'react-router-dom';

function TopSellings() {
    // console.log("TopSellings rendered");
    const dispatch = useDispatch();
    const { topSelling, error, status } = useSelector((state) => state.product)

    useEffect(() => {
        if (status !== 'success') {
            dispatch(topSellings());
        }
    }, [dispatch, status]);


    if (status === 'loading') return <p>Loading top sellings...</p>;
    if (status === 'failed') return <p>Error: {error}</p>;

    const handleAddToCart = (product) => {
        dispatch(addToCart({ productId: product._id, quantity: 1 }));
    }

    return (
        <Box px={2} py={4} textAlign={"center"}>
            <Typography variant="h3" fontWeight="900" mt={5} mb={5} gutterBottom>
                Top Sellings
            </Typography>
            <Grid container spacing={3} justifyContent={"center"}>
                {topSelling.map((product) => (
                    <Grid key={product._id}>
                        <Card sx={{ height: '100%', boxShadow: 'none', border: 'none', textAlign: "center" }}>
                            <CardMedia
                                component="img"
                                height="300"
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
                                    <Rating
                                        value={product.rating}
                                        readOnly
                                        precision={0.5}
                                        size="medium"
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {product.rating}/5
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="black" fontWeight={700} mt={1} fontSize={22} gutterBottom>
                                    ${product.price}
                                </Typography>
                                <Box alignItems={"center"} gap={2} mt={2} display={"flex"} flexDirection={"column"}>
                                    <Link to={`/product/${product._id}`}>
                                        <Button variant="contained" color="primary">
                                            Buy Now
                                        </Button>
                                    </Link>
                                    <Button variant="contained" color="primary" onClick={() => handleAddToCart(product)}>
                                        Add to Cart
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Button variant='outlined' sx={{ my: 3 }}>
                View All
            </Button>
        </Box>
    )
}

export default TopSellings