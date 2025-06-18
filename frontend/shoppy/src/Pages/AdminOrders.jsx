import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../features/order/OrderSlice";
import {
    Box,
    Typography,
    Paper,
    Stack,
    Avatar,
    Divider,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    useTheme,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    const handleStatusChange = (orderId, newStatus) => {
        dispatch(updateOrderStatus({ orderId, status: newStatus }))
            .unwrap()
            .then(() => toast.success("Status updated", { autoClose: 1000 }))
            .catch((err) => toast.error(err, { autoClose: 1000 }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={6}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" mt={4}>
                Error: {error}
            </Typography>
        );
    }

    return (
        <Box px={{ xs: 2, sm: 4 }} py={4} Width="1100px" mx="auto">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Orders Overview
            </Typography>

            {orders.length === 0 ? (
                <Typography>No orders yet.</Typography>
            ) : (
                <Stack spacing={3}>
                    {orders.map((order) => (
                        <Paper
                            key={order._id}
                            elevation={3}
                            sx={{
                                p: 3,
                                width: "800px",
                                borderRadius: 3,
                                bgcolor: "#fff",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            }}
                        >
                            <Stack
                                direction={isMobile ? "column" : "row"}
                                justifyContent="space-between"
                                spacing={2}
                                mb={2}
                            >
                                <Box flex={1}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Order ID
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {order._id}
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary" mt={2}>
                                        Customer
                                    </Typography>
                                    <Typography variant="body1">
                                        {order.user?.name} ({order.user?.email})
                                    </Typography>

                                    <Typography variant="subtitle2" color="text.secondary" mt={2}>
                                        Shipping Address
                                    </Typography>
                                    <Typography variant="body2">{order.shippingAddress}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            label="Status"
                                            value={order.status}
                                            onChange={(e) =>
                                                handleStatusChange(order._id, e.target.value)
                                            }
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="Shipped">Shipped</MenuItem>
                                            <MenuItem value="Delivered">Delivered</MenuItem>
                                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <Typography variant="subtitle2" color="text.secondary" mt={2}>
                                        Total Amount
                                    </Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        ₹{order.totalAmount}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Ordered Items
                                </Typography>
                                <Stack spacing={2}>
                                    {order.items.map((item) => (
                                        <Stack
                                            key={item.product._id}
                                            direction="row"
                                            alignItems="center"
                                            spacing={2}
                                        >
                                            <Avatar
                                                variant="square"
                                                src={`http://localhost:5000${item.product.image}`}
                                                alt={item.product.name}
                                                sx={{ width: 64, height: 64 }}
                                            />
                                            <Box>
                                                <Typography fontWeight="bold">
                                                    {item.product.name}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {item.quantity} × ₹{item.price} = ₹
                                                    {item.quantity * item.price}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default AdminOrders;
