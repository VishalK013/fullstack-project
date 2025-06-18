import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrder } from '../features/order/OrderSlice';
import { fetchUserReviews } from '../features/review/ReviewSlice';
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
import socket from '../Socket';
import { toast } from 'react-toastify';
import ReviewModal from '../components/ReviewModal';

const statusColors = {
    Pending: 'warning',
    Shipped: 'info',
    Delivered: 'success',
    Cancelled: 'error',
};

const UserOrder = () => {
    const dispatch = useDispatch();
    const [reviewProducts, setReviewProducts] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [modalShownOnce, setModalShownOnce] = useState(false);

    const { userOrder, loading, error } = useSelector((state) => state.orders);
    const { reviews } = useSelector((state) => state.review);

    useEffect(() => {
        socket.connect();

        socket.on("order-status-updated", (data) => {
            toast.info(`Order status updated to ${data.newStatus}`);
            dispatch(fetchUserOrder());
        });

        socket.on("order-delivered", ({ orderId }) => {
            const reviewedProductIds = reviews.map(r =>
                typeof r.product === 'string' ? r.product : r.product._id
            );

            const deliveredOrder = userOrder.find(o => o._id === orderId);
            if (deliveredOrder) {
                const products = deliveredOrder.items
                    .filter(item => !reviewedProductIds.includes(item.product._id.toString()))
                    .map(item => ({
                        orderId,
                        productId: item.product._id,
                        name: item.product.name,
                        image: item.product.image,
                        rating: 0,
                        comment: "",
                    }));

                if (products.length > 0) {
                    setReviewProducts(products);
                    setShowReviewModal(true);
                }
            }
        });

        dispatch(fetchUserOrder());
        dispatch(fetchUserReviews());

        return () => {
            socket.off("order-status-updated");
            socket.off("order-delivered");
            socket.disconnect();
        };
    }, [dispatch]);

    useEffect(() => {
        if (modalShownOnce || !userOrder?.length || !reviews?.length) return;

        const reviewedProductIds = reviews.map(r =>
            typeof r.product === 'string' ? r.product : r.product._id
        );

        const productsToReview = [];

        userOrder
            .filter(order => order.status === 'Delivered')
            .forEach(order => {
                order.items.forEach(item => {
                    const productId = item.product._id.toString();
                    if (!reviewedProductIds.includes(productId)) {
                        productsToReview.push({
                            orderId: order._id,
                            productId,
                            name: item.product.name,
                            image: item.product.image,
                            rating: 0,
                            comment: "",
                        });
                    }
                });
            });

        if (productsToReview.length > 0) {
            setReviewProducts(productsToReview);
            setShowReviewModal(true);
            setModalShownOnce(true);
        }
    }, [userOrder, reviews, modalShownOnce]);

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

            <ReviewModal
                open={showReviewModal}
                products={reviewProducts}
                setProducts={setReviewProducts}
                onClose={() => {
                    setShowReviewModal(false);
                    setReviewProducts([]);
                }}
                onSubmit={() => {
                    toast.success("Thanks for your feedback!");
                    setShowReviewModal(false);
                    setReviewProducts([]);
                }}
            />
        </Box>
    );
};

export default UserOrder;
