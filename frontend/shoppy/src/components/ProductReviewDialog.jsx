import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchproductByProductid,
    resetReviewStatus,
    deleteReview,
} from "../features/review/ReviewSlice";
import {
    Dialog,
    Box,
    Typography,
    CircularProgress,
    Button,
    IconButton,
    Rating,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const ProductReviewDialog = ({ open, onClose, productId }) => {
    const dispatch = useDispatch();
    const { productReviews, loading, error } = useSelector((state) => state.review);

    useEffect(() => {
        if (open && productId) {
            dispatch(fetchproductByProductid(productId));
        }

        return () => {
            dispatch(resetReviewStatus());
        };
    }, [dispatch, open, productId]);

    const handleDelete = async (reviewId) => {
        try {
            await dispatch(deleteReview(reviewId)).unwrap();
            toast.error("Review deleted", { autoClose: 700, hideProgressBar: true });

            dispatch(fetchproductByProductid(productId));
        } catch (error) {
            toast.error(`Failed to delete review: ${error}`, { autoClose: 700, hideProgressBar: true });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Box p={3}>
                <Typography variant="h6" mb={2}>
                    Product Reviews
                </Typography>

                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : productReviews.length === 0 ? (
                    <Typography>No reviews found for this product.</Typography>
                ) : (
                    productReviews.map((review) => (
                        <Box
                            key={review._id}
                            mb={2}
                            p={2}
                            sx={{
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                backgroundColor: "#f9f9f9",
                                position: "relative"
                            }}
                        >
                            <Typography fontWeight={700} py={1} sx={{ textTransform: "capitalize" }}>
                                {review.user?.username || "Anonymous"}
                            </Typography>
                            <Typography py={1}><Rating value={review.rating} precision={0.5}/></Typography>
                            <Typography py={1}>{review.comment}</Typography>

                            <IconButton
                                size="small"
                                color="error"
                                sx={{ position: "absolute", top: 10, right: 10 }}
                                onClick={() => handleDelete(review._id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))
                )}

                <Box textAlign="right" mt={2}>
                    <Button variant="outlined" onClick={onClose}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ProductReviewDialog;
