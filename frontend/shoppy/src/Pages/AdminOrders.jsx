import React, { useEffect, useState } from "react";
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
    CircularProgress, Button,
    Collapse,
} from "@mui/material";
import { toast } from "react-toastify";
import { xyzURL } from "../common/util";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const AdminOrders = () => {
    const [openState, setOpenState] = useState({})
    const [selectedTab, setSelectedTab] = useState("All")
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
            .then(() => toast.success("Status updated", { autoClose: 700, hideProgressBar: true }))
            .catch((err) => toast.error(err, { autoClose: 700, hideProgressBar: true }));
    };

    const handleToggle = (orderId) => {
        setOpenState((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    const filteredOrders = orders.filter((order) => {
        if (selectedTab == "All") return true;
        return order.status === selectedTab;
    })

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
        <Box px={{ xs: 2, sm: 4 }} Width="100%" mx="auto">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Orders Overview
            </Typography>

            <Box sx={{ display: 'flex', mt: 2, mb: 3 }}>
                {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((status, index, arr) => (
                    <Button
                        key={status}
                        variant={selectedTab === status ? 'contained' : 'outlined'}
                        onClick={() => setSelectedTab(status)}
                        sx={{
                            borderRadius: 0,
                            minWidth: 100,
                            flex: '1',
                            borderRight: index < arr.length - 1 ? 'none' : undefined,
                        }}
                    >
                        {status}
                    </Button>
                ))}
            </Box>

            {orders.length === 0 ? (
                <Typography>No orders yet.</Typography>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    {filteredOrders.map((order) => (
                        <Paper
                            key={order._id}
                            elevation={3}
                            sx={{
                                p: 3,
                                width: "100%",
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
                                            disabled={order.status === "Delivered" || order.status === "Cancelled"}
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

                            <Button variant="text"
                                endIcon={openState[order._id] ? <ExpandLess /> : <ExpandMore />}
                                onClick={() => handleToggle(order._id)}
                                color="primary">
                                {openState[order._id] ? "Hide Products" : "View products"}
                            </Button>

                            <Collapse in={openState[order._id]}>
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
                                                    src={`${xyzURL}${item.product.image}`}
                                                    alt={item.product.name}
                                                    sx={{ width: "65px", height: "65px" }}
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
                            </Collapse>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default AdminOrders;
