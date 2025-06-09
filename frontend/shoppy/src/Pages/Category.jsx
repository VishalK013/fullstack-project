import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/ProductSlice";
import { Box, Grid } from "@mui/system";
import {
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
    Pagination,   // <-- import Pagination from MUI
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import FilterListIcon from "@mui/icons-material/FilterList";
import Slider from "@mui/material/Slider";

// Custom ValueLabelComponent to add $ prefix
function ValueLabelComponent(props) {
    const { children, open, value } = props;

    return (
        <Tooltip open={open} enterTouchDelay={0} placement="top" title={`$${value}`}>
            {children}
        </Tooltip>
    );
}

function Category() {
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [page, setPage] = useState(1);
    const productsPerPage = 8;
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.product);

    const clothingTypeOptions = ["T-shirt", "Shirt", "Jacket", "Pants", "Shoes"];

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) return <div>Loading products...</div>;
    if (error) return <div>Error: {error}</div>;

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    return (
        <Box display={"flex"} mt={2} px={3} justifyContent={"space-between"}>
            <Box
                width="300px"
                mt={5}
                sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    p: 2,
                    position: "sticky",
                    height: "fit-content",
                    textAlign: "center",
                    top: "80px",
                }}
            >
                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                    <Typography variant="h6" fontWeight={700} fontSize={16} mb={1}>
                        Filters
                    </Typography>

                    <TuneIcon
                        sx={{
                            transform: "rotate(90deg)",
                            color: "grey.600",
                        }}
                    />
                </Box>
                <Divider />
                <FormGroup
                    sx={{
                        alignItems: "left",
                    }}
                >
                    {clothingTypeOptions.map((type) => (
                        <FormControlLabel
                            key={type}
                            control={<Checkbox size="small" />}
                            label={type}
                            sx={{
                                m: 0,
                                "& .MuiFormControlLabel-label": {
                                    fontSize: "0.8rem",
                                    gap: 0,
                                },
                            }}
                        />
                    ))}
                </FormGroup>
                <Divider />
                <Typography variant="h6" fontWeight={700} fontSize={16} textAlign={"left"} mb={1}>
                    Price
                </Typography>
                <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={500}
                    step={10}
                    sx={{ color: "black" }}
                    components={{ ValueLabel: ValueLabelComponent }}
                />
                <Button variant="contained" startIcon={<FilterListIcon />}>
                    Apply Filter
                </Button>
            </Box>
            <Box display={"flex"} width={"70%"} mt={5} flexDirection={"column"}>
                <Box>
                    <Typography variant="h4" fontWeight={700} mb={3} color="initial">
                        Products
                    </Typography>
                </Box>
                <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"} columnGap={9} rowGap={3}>
                    {currentProducts.map((product) => (
                        <Grid item key={product._id}>
                            <Card
                                sx={{ height: "100%", width: "200px", boxShadow: "none", border: "none", textAlign: "center" }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
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
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Box>


                <Box display="flex" justifyContent="center" mt={4}>
                    <Pagination
                        count={Math.ceil(products.length / productsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default Category;
