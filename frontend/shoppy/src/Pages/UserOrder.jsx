import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrder } from '../features/order/OrderSlice';
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Chip,
    Avatar,
    Grid,
} from '@mui/material';

const statusColors = {
    Pending: 'warning',
    Shipped: 'info',
    Delivered: 'success',
    Cancelled: 'error',
};

const UserOrder = () => {
    const dispatch = useDispatch();
    const { userOrder, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchUserOrder());
    }, [dispatch]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f2f2f2', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Orders
            </Typography>

            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && userOrder.length === 0 && (
                <Typography variant="body1">You haven’t placed any orders yet.</Typography>
            )}

            {userOrder.map((order) => (
                <Card key={order._id} sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                                Order ID: {order._id}
                            </Typography>
                            <Chip
                                label={order.status}
                                color={statusColors[order.status] || 'default'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Shipping Address: {order.shippingAddress}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Order Total: <strong>₹{order.totalAmount}</strong>
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            {order.items.map((item, i) => (
                                <Grid key={i} item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar
                                            src={`http://192.168.1.1:5000${item.product?.image}`}
                                            variant="square"
                                            sx={{ width: 64, height: 64, borderRadius: 1 }}
                                        />
                                        <Box>
                                            <Typography fontWeight={600}>
                                                {item.product?.name || 'Product'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Qty: {item.quantity} &nbsp;|&nbsp; ₹{item.price} each
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold">
                                                ₹{item.total}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default UserOrder;
