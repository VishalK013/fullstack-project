import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../features/order/OrderSlice";
import {
    ListItem,
    Typography,
    Divider,
    Paper,
    Box,
    Avatar,
    Stack,
    useTheme,
    useMediaQuery,
} from "@mui/material";

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    if (loading) return <Typography>Loading orders...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <Box
            px={{ xs: 2, sm: 3, md: 4 }}
            py={4}
            width={{ xs: 450, md: 600, lg: 800 }}
            maxWidth="900px"
            sx={{ backgroundColor: "#f5f5f5", margin: "0 auto" }}
        >
            <Typography variant="h5" gutterBottom>
                All Orders
            </Typography>

            {orders.length === 0 ? (
                <Typography>No orders yet.</Typography>
            ) : (
                <Box>
                    {orders.map((order) => (
                        <Paper
                            key={order._id}
                            elevation={2}
                            sx={{ mb: 2, width: "100%", px: 2, py: 2 }}
                        >
                            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                <Box width="100%">
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Order ID: {order._id}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        User: {order.user?.name} ({order.user?.email})
                                    </Typography>
                                    <Typography variant="body2" mt={1}>
                                        Shipping Address : {order.shippingAddress}
                                    </Typography>
                                    <Typography variant="body2" >
                                        Total: ₹{order.totalAmount}
                                    </Typography>

                                    <Box mt={2}>
                                        <Typography variant="subtitle2">Items:</Typography>
                                        <Stack spacing={2} mt={1}>
                                            {order.items.map((item) => (
                                                
                                                <Stack
                                                    key={item.product._id}
                                                    direction={isSmallScreen ? "column" : "row"}
                                                    alignItems={isSmallScreen ? "flex-start" : "center"}
                                                    spacing={2}
                                                >
                                                    <Avatar
                                                        variant="square"
                                                        src={`http://localhost:5000${item.product.image}`}
                                                        alt={item.product.name}
                                                        sx={{ width: 56, height: 56 }}
                                                    />
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {item.product.name}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {item.quantity} × ₹{item.price}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Box>
                            </ListItem>
                            <Divider />
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default AdminOrders;
