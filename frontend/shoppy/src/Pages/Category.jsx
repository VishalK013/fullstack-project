import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchClothingTypes,
    fetchColors,
    fetchProducts,
    resetProductState,
} from "../features/product/ProductSlice";
import {
    Box,
    Grid,
    Button,
    Card,
    CardContent,
    CardMedia,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Rating,
    Typography,
    Tooltip,
    Slider,
    List,
    ListItem,
    ListItemText,
    Skeleton,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckIcon from "@mui/icons-material/Check";
import BreadCrumbsNav from "../components/BreadCrumbsNav";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import WishListButton from "../components/WishListButton";
import { fetchWishList } from "../features/wishlist/WishListSlice";
import { xyzURL } from "../common/util";

const sizeOptions = ["XS", "S", "M", "L", "XL"];
const sizeLabels = {
    XS: "Extra Small",
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra Large",
};

const typoStyle = {
    variant: "h6",
    fontWeight: 700,
    fontSize: 16,
    textAlign: "left",
    mb: 1,
};

const ValueLabelComponent = ({ children, open, value }) => (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={`$${value}`}>
        {children}
    </Tooltip>
);

function Category() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products, clothingType, colors, limit, loading, error } = useSelector((state) => state.product);

    const [localSkip, setLocalSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [clothingTypes, setClothingTypes] = useState(new Set());
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [selectedColors, setSelectedColors] = useState(new Set());
    const [sizes, setSizes] = useState(new Set());

    const toggleSetItem = (set, setFn, value) => {
        const updated = new Set(set);
        updated.has(value) ? updated.delete(value) : updated.add(value);
        setFn(updated);
    };

    const buildFilters = (skipOverride = localSkip) => ({
        skip: skipOverride,
        limit,
        clothingType: Array.from(clothingTypes).map((c) => c.toLowerCase()),
        colors: Array.from(selectedColors).map((c) => c.toLowerCase()),
        sizes: Array.from(sizes),
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
    });

    const applyFilters = () => {
        dispatch(resetProductState());
        setLocalSkip(0);
        setHasMore(true);
        dispatch(fetchProducts(buildFilters(0)));
    };

    const loadMoreProducts = () => {
        if (loading || !hasMore) return;
        const newSkip = localSkip + limit;
        dispatch(fetchProducts(buildFilters(newSkip))).then((action) => {
            const { products: newProducts = [], total = 0 } = action.payload || {};
            setLocalSkip(newSkip);
            if (newProducts.length === 0 || newSkip >= total) {
                setHasMore(false);
            }
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = document.documentElement.scrollTop;
            if (
                window.innerHeight + document.documentElement.scrollTop + 500 >= document.documentElement.scrollHeight &&
                hasMore &&
                !loading
            ) {
                loadMoreProducts();
            }
            if (scrollTop < 100 && localSkip > 0 && !loading) {
                dispatch(resetProductState());
                setLocalSkip(0);
                setHasMore(true);
                dispatch(fetchProducts(buildFilters(0)));
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading, localSkip]);

    useEffect(() => {
        dispatch(fetchClothingTypes());
        dispatch(fetchColors());
        dispatch(resetProductState());
        dispatch(fetchProducts(buildFilters(0)));
        dispatch(fetchWishList());
    }, [dispatch]);

    const handleSinglePage = (product) => {
        toast.success(`Redirecting to ${product.name}`, { autoClose: 700, hideProgressBar: true });
        navigate(`/products/${product._id}`)
    };

    if (error) return <div>Error: {error}</div>;

    return (
        <Box>
            <Box mt={3} ml={1}>
                <BreadCrumbsNav />
            </Box>
            <Box display="flex" flexDirection={{ xs: "column", sm: "column", md: "row", lg: "row" }} px={3} justifyContent="space-between">

                <Box width={{ sm: "100%", md: "300px" }} mt={2} sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2, height: "fit-content", textAlign: "center" }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography sx={typoStyle}>Filters</Typography>
                        <TuneIcon sx={{ transform: "rotate(90deg)", color: "grey.600" }} />
                    </Box>
                    <Divider />
                    <List>
                        {clothingType.map((type) => (
                            <ListItem key={type} onClick={() => toggleSetItem(clothingTypes, setClothingTypes, type)} sx={{ cursor: "pointer" }}>
                                <ListItemText
                                    primary={type}
                                    sx={{
                                        color: clothingTypes.has(type) ? "black" : "grey",
                                        fontWeight: clothingTypes.has(type) ? "bold" : "normal",
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <Typography sx={typoStyle} mt={2}>Price</Typography>
                    <Slider
                        value={priceRange}
                        onChange={(e, val) => setPriceRange(val)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={500}
                        step={10}
                        sx={{ color: "black" }}
                        components={{ ValueLabel: ValueLabelComponent }}
                    />
                    <Typography sx={typoStyle}>Colors</Typography>
                    <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center" mt={2} mb={2}>
                        {colors.map((color, id) => (
                            <Box
                                key={id}
                                onClick={() => toggleSetItem(selectedColors, setSelectedColors, color)}
                                sx={{
                                    width: 35,
                                    height: 35,
                                    bgcolor: color,
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                }}
                            >
                                {selectedColors.has(color) && (
                                    <CheckIcon
                                        sx={{
                                            fontSize: 20,
                                            color: "white",
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>
                    <Divider />
                    <Typography sx={typoStyle} mt={2}>Size</Typography>
                    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1} mt={1} mb={2}>
                        {sizeOptions.map((size) => (
                            <Button
                                key={size}
                                variant={sizes.has(size) ? "contained" : "outlined"}
                                onClick={() => toggleSetItem(sizes, setSizes, size)}
                                sx={{
                                    fontSize: "0.7rem",
                                    fontWeight: 500,
                                    borderRadius: 5,
                                    py: 0.5,
                                    height: "30px",
                                    width: "100px",
                                    ...(sizes.has(size) && {
                                        backgroundColor: "#000",
                                        color: "#fff",
                                        "&:hover": { backgroundColor: "#222" },
                                    }),
                                }}
                            >
                                <Typography variant="body1" pl={1} sx={{ fontSize: "0.65rem", mt: 0.2 }}>
                                    {size} {sizeLabels[size]}
                                </Typography>
                            </Button>
                        ))}
                    </Box>
                    <Button variant="contained" startIcon={<FilterListIcon />} onClick={applyFilters}>
                        Apply Filter
                    </Button>
                </Box>

                <Box
                    display="flex"
                    flexDirection="column"
                    textAlign="center"
                    width="100%"
                    mt={2}
                    px={{ xs: 1, sm: 2, md: 10 }}
                >
                    <Typography
                        variant="h4"
                        textAlign={{ xs: "center", md: "left" }}
                        fontWeight={700}
                        mb={3}
                    >
                        Products
                    </Typography>

                    <Grid
                        container
                        spacing={3}
                        justifyContent={{ xs: "center", md: "space-between" }}
                    >
                        <AnimatePresence>
                            {loading && products.length === 0
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${i}`}>
                                        <Card sx={{ width: "100%", maxWidth: 300, mx: "auto", borderRadius: 3 }}>
                                            <Skeleton
                                                variant="rectangular"
                                                width={300}
                                                height={300}
                                                sx={{ borderRadius: 5 }}
                                            />
                                            <CardContent>
                                                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                                    <Skeleton height={25} width="80%" />
                                                    <Skeleton height={20} width="40%" />
                                                    <Skeleton height={25} width="50%" />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                                : products.map((product) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <Card
                                                sx={{
                                                    width: "300px",
                                                    maxWidth: 300,
                                                    height: "100%",
                                                    mx: "auto",
                                                    boxShadow: "none",
                                                    border: "none",
                                                    textAlign: "center",
                                                    position: "relative"
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="300"
                                                    image={`${xyzURL}${product.image}`}
                                                    alt={product.name}
                                                    loading="lazy"
                                                    onClick={() => handleSinglePage(product)}
                                                    sx={{ borderRadius: 5, cursor: "pointer" }}
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
                                                            productId={product._id}
                                                            iconSize="small"
                                                            cursor="pointer"
                                                        />
                                                    </span>
                                                </Tooltip>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        {product.name}
                                                    </Typography>
                                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                                        <Rating value={Number(product.rating) || 0} readOnly precision={0.5} size="medium" />
                                                        <Typography variant="body2" color="text.secondary">
                                                            ({product.numReviews || 0} review{product.numReviews === 1 ? "" : "s"})
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" fontWeight={700} fontSize={22} mt={1}>
                                                        ${product.price}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </Grid>
                                ))}

                            {products.length > 0 && loading &&
                                Array.from({ length: 4 }).map((_, i) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={`loading-skeleton-${i}`}>
                                        <Card sx={{ width: "100%", maxWidth: 300, mx: "auto", borderRadius: 3 }}>
                                            <Skeleton variant="rectangular" width="100%" height={300} />
                                            <CardContent>
                                                <Skeleton height={25} width="80%" />
                                                <Skeleton height={20} width="40%" />
                                                <Skeleton height={25} width="50%" />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                        </AnimatePresence>
                    </Grid>

                    {loading && products.length > 0 && (
                        <Typography mt={3}>Loading more products...</Typography>
                    )}
                    {!hasMore && !loading && (
                        <Typography mt={3}>You've reached the end!</Typography>
                    )}
                </Box>

            </Box>
        </Box>
    );
}

export default Category;
