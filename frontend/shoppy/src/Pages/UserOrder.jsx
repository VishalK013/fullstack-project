import React, { useEffect, useState } from 'react';
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
    Button,
    Collapse,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder, fetchUserOrder } from '../features/order/OrderSlice';
import { fetchUserReviews } from '../features/review/ReviewSlice';
import socket from '../Socket';
import { toast } from 'react-toastify';
import ReviewModal from '../components/ReviewModal';
import { xyzURL } from '../common/util';
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Stack } from '@mui/system';

const statusColors = {
    Pending: 'warning',
    Shipped: 'info',
    Delivered: 'success',
    Cancelled: 'error',
};

const UserOrder = () => {
    const dispatch = useDispatch();
    const [openState, setOpenState] = useState({});
    const [selectedTab, setSelectedTab] = useState('All');
    const [reviewProducts, setReviewProducts] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [modalShownOnce, setModalShownOnce] = useState(false);

    const { userOrder, loading, error } = useSelector((state) => state.orders);
    const { reviews } = useSelector((state) => state.review);

    useEffect(() => {
        socket.connect();

        socket.on("order-status-updated", (data) => {
            toast.info(`Order status updated to ${data.newStatus}`, { autoClose: 700, hideProgressBar: true });
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

    const handleCancelOrder = (orderId) => {
        dispatch(cancelOrder(orderId))
            .unwrap()
            .then(() => {
                toast.success("Order cancelled successfully", {
                    autoClose: 700,
                    hideProgressBar: true,
                });
            })
            .catch((error) =>
                toast.error(error || "Cancelation failed", {
                    autoClose: 700,
                    hideProgressBar: true,
                })
            );
    };

    const handleToggle = (orderId) => {
        setOpenState((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
    };
    const filteredOrders = userOrder.filter((order) => {
        if (selectedTab === 'All') return true;
        return order.status === selectedTab;
    });

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f2f2f2', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Orders
            </Typography>

            <Box sx={{ display: 'flex', mt: 2, mb: 3 }}>
                {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status, index, arr) => (
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

            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && userOrder.length === 0 && (
                <Typography variant="body1">You haven’t placed any orders yet.</Typography>
            )}

            {filteredOrders.map((order) => (
                <Card key={order._id} sx={{ mb: 3 }}>
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                Order ID: {order._id}
                            </Typography>

                            <Stack direction="column" spacing={2} alignItems="center">
                                <Chip
                                    label={order.status}
                                    color={statusColors[order.status] || 'default'}
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />

                                {(order.status === "Pending" || order.status === "Shipped") && (
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ width: "100px", backgroundColor: "red", fontSize: 10, py: 1, px: 1 }}
                                        onClick={() => handleCancelOrder(order._id)}
                                    >
                                        Cancel Order
                                    </Button>
                                )}
                            </Stack>
                        </Box>


                        <Typography variant="body2" sx={{ mb: 1 }}>
                            Shipping Address: {order.shippingAddress}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Order Total: <strong>₹{order.totalAmount}</strong>
                        </Typography>

                        <Button
                            variant="text"
                            endIcon={openState[order._id] ? <ExpandLess /> : <ExpandMore />}
                            onClick={() => handleToggle(order._id)}
                            sx={{ textTransform: "none", fontWeight: 500 }}
                            color="primary"
                        >
                            {openState[order._id] ? "Hide Products" : "View Products"}
                        </Button>

                        <Collapse in={!!openState[order._id]}>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                                {order.items.map((item, i) => (
                                    <Grid key={i} item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                src={`${xyzURL}${item.product?.image}`}
                                                variant="square"
                                                sx={{ width: "65px", height: "65px", borderRadius: 1 }}
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
                        </Collapse>
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
                    toast.success("Thanks for your feedback!", {
                        autoClose: 700,
                        hideProgressBar: true,
                    });
                    setShowReviewModal(false);
                    setReviewProducts([]);
                }}
            />
        </Box>
    );
};

export default UserOrder;
