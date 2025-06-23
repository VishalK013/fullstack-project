import React, { useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Button,
    IconButton,
    Divider,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchWishList,
    removeWishList,
} from "../features/wishlist/WishListSlice";
import { addToCart } from "../features/carts/CartSlice";
import { toast } from "react-toastify";
import ew from "../assets/ew.jpeg"
import { xyzURL } from "../common/util";

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items: wishlistItems, loading } = useSelector((state) => state.wishlist);

    useEffect(() => {
        dispatch(fetchWishList());
    }, [dispatch]);

    const handleRemove = (productId) => {
        toast.error("Removed from wishlist", { autoClose: 700, hideProgressBar: true });
        dispatch(removeWishList(productId));
    };

    const handleAddToCart = (product) => {
        toast.success("Product added to cart...", { autoClose: 700, hideProgressBar: true });
        dispatch(addToCart({ productId: product._id, quantity: 1 }));
        dispatch(removeWishList(product._id));
    };


    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Your Wishlist
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : !Array.isArray(wishlistItems) || wishlistItems.length === 0 ? (
                <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} sx={{ pt: 5, pb: 2, backgroundColor: "#e6e6e6" }}>
                    <Box
                        component="img"
                        src={ew}
                    />
                    <Typography variant="body1" color="primary" py={2}>You're wishlist is empty !</Typography>
                </Box>
            ) : (
                wishlistItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;

                    return (
                        <Card
                            key={product._id}
                            sx={{
                                display: "flex",
                                mb: 2,
                                p: 2,
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CardMedia
                                    component="img"
                                    image={`${xyzURL}${product.image}`}
                                    alt={product.name}
                                    sx={{ width: 120, height: 120, objectFit: "contain", mr: 2 }}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        ₹{product.price}
                                    </Typography>
                                </CardContent>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                <Button
                                    variant="contained"
                                    startIcon={<ShoppingCartIcon />}
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
                                </Button>
                                <Tooltip title="Remove this item">
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemove(product._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Card>
                    );
                })
            )}
        </Box>
    );
};

export default Wishlist;
