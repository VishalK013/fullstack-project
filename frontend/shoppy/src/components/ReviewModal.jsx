import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField,
    Box,
    Rating,
    Avatar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { submitReview, resetReviewStatus } from '../features/review/ReviewSlice';

const ReviewModal = ({ open, products, setProducts, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const { submitting } = useSelector(state => state.review);

    const handleChange = (index, field, value) => {
        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);
    };

    const handleSubmit = async () => {
        for (let i = 0; i < products.length; i++) {
            const { productId, rating, comment } = products[i];
            if (rating > 0 || comment.trim()) {
                await dispatch(submitReview({ productId, rating, comment }));
            }
        }

        dispatch(resetReviewStatus());
        onSubmit();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Rate Your Products</DialogTitle>
            <DialogContent dividers>
                {products.map((product, index) => (
                    <Box key={product.productId} sx={{ mb: 3 }}>
                        <Avatar
                            src={`http://192.168.1.1:5000${product?.image}`}
                            variant="square"
                            sx={{ width: 64, height: 64, borderRadius: 1 }}
                        />
                        <Typography fontWeight={600}>{product.name}</Typography>

                        <Rating
                            value={product.rating}
                            precision={0.5}
                            onChange={(e, value) => handleChange(index, "rating", value)}
                        />

                        <TextField
                            label="Write a review (optional)"
                            multiline
                            fullWidth
                            rows={3}
                            margin="normal"
                            value={product.comment}
                            onChange={(e) => handleChange(index, "comment", e.target.value)}
                        />
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    variant="contained"
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewModal;
