import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProductById, fetchProducts } from '../features/product/ProductSlice'
import { addToCart } from "../features/carts/CartSlice"
import {
    Box,
    Button,
    Typography,
    IconButton,
    Stack,
    CircularProgress,
    Collapse,
    Rating,
    Tooltip,
    useTheme,
    useMediaQuery,
    Avatar
} from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { toast } from 'react-toastify'
import BreadCrumbsNav from '../components/BreadCrumbsNav'
import WishListButton from '../components/WishListButton'
import { fetchWishList } from '../features/wishlist/WishListSlice'
import { xyzURL } from '../common/util'
import { fetchproductByProductid } from '../features/review/ReviewSlice'
import ProductReviews from '../components/ProductReviews'

function SinglePageProduct() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1)
    const [selectedStar, setSelectedStar] = useState(null);
    const { productReviews } = useSelector(state => state.review)
    const { selectedProduct: product, loading, error } = useSelector(state => state.product)
    const { products: allProducts } = useSelector(state => state.product);
    const otherProducts = allProducts?.filter(p => p._id !== product?._id);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    useEffect(() => {
        dispatch(fetchProductById(id));
        dispatch(fetchProducts());
        dispatch(fetchWishList());
        dispatch(fetchproductByProductid(id))
    }, [dispatch, id]);

    const reviewCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };

    productReviews.forEach((rev) => {
        reviewCounts[Math.floor(rev.rating)] += 1;
    });

    const totalReviews = productReviews.length;

    const filteredReviews = selectedStar
        ? productReviews.filter((rev) => Math.floor(rev.rating) === selectedStar)
        : productReviews;

    const handleAddToCart = (product) => {
        toast.success("Product added to cart!", { autoClose: 700, hideProgressBar: true })
        dispatch(addToCart({ productId: product._id, quantity }));
    };

    const handletoggle = () => setOpen((prev) => !prev);
    const increment = () => setQuantity((q) => q + 1);
    const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />
    if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>
    if (!product) return <Typography align="center" mt={4}>Product not found</Typography>

    return (
        <Box>
            <BreadCrumbsNav productName={product?.name} />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    textAlign: { xs: "center", sm: "left" },
                    gap: 3,
                    p: 3,
                }}
            >
                <Box sx={{ flex: '1' }}>
                    <Box
                        component="img"
                        src={`${xyzURL}${product.image}`}
                        alt={product.name}
                        sx={{
                            maxWidth: '100%',
                            height: { xs: 250, sm: 300 },
                            objectFit: 'contain',
                            borderRadius: 2,
                        }}
                    />
                </Box>

                <Box sx={{ flex: '1' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {product.description}
                    </Typography>

                    <Typography variant="subtitle1" fontWeight={600}>
                        Price: ${product.price}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Category: {product.category || 'N/A'}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Rating: {product.rating ? product.rating.toFixed(1) : 'No rating'}
                    </Typography>

                    <Box display={"flex"} alignItems="center" justifyContent={{ xs: "center", sm: "flex-start" }} spacing={1} mt={2}>
                        <Tooltip title="Decrease quantity">
                            <IconButton
                                color="primary"
                                onClick={decrement}
                                sx={{ backgroundColor: "#f5f5f5" }}
                                aria-label="decrease quantity"
                            >
                                <RemoveIcon />
                            </IconButton>
                        </Tooltip>

                        <Typography variant="h6" minWidth={32} textAlign="center">
                            {quantity}
                        </Typography>

                        <Tooltip title="Increase quantity">
                            <IconButton
                                color="primary"
                                onClick={increment}
                                sx={{
                                    backgroundColor: "black",
                                    "&:hover": { backgroundColor: "black" },
                                }}
                                aria-label="increase quantity"
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => handleAddToCart(product)}
                    >
                        Add to Cart
                    </Button>
                </Box>
            </Box>

            <ProductReviews
                open={open}
                handletoggle={handletoggle}
                reviewCounts={reviewCounts}
                totalReviews={totalReviews}
                selectedStar={selectedStar}
                setSelectedStar={setSelectedStar}
                filteredReviews={filteredReviews}
                xyzURL={xyzURL}
            />

            <Typography variant="h5" fontWeight={700} mt={3} mb={2}>
                Related Products
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 3,
                    backgroundColor: '#f5f5f5',
                }}
            >
                {otherProducts?.map(p => (
                    <Box
                        key={p._id}
                        sx={{
                            flex: '1 1 250px',
                            maxWidth: '300px',
                            borderRadius: 2,
                            backgroundColor: "white",
                            p: 2,
                            textAlign: 'center',
                            position: "relative",
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 3 },
                        }}
                        onClick={() => {
                            toast.success(`Redirecting to ${p.name}`, { autoClose: 700, hideProgressBar: true });
                            window.location.href = `/products/${p._id}`;
                        }}
                    >
                        <Box
                            component="img"
                            src={`${xyzURL}${p.image}`}
                            alt={p.name}
                            sx={{ width: '100%', height: 160, objectFit: 'contain', mb: 1 }}
                        />
                        <Tooltip title="Add to Wishlist" placement="bottom">
                            <span
                                style={{
                                    position: "absolute",
                                    top: "0px",
                                    right: "0px"
                                }}
                            >
                                <WishListButton
                                    productId={p._id}
                                    iconSize="small"
                                    cursor="pointer"
                                />
                            </span>
                        </Tooltip>
                        <Typography variant="subtitle1">{p.name}</Typography>
                        <Typography variant="body2" color="text.secondary">${p.price}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}
export default SinglePageProduct
