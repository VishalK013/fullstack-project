import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { addToCart, removeFromCart } from "../features/carts/CartSlice"

const CartItem = React.memo(({ item, onIncrement, onDecrement, onRemove }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 2,
                border: "1px solid #ccc",
                width: "700px",
            }}
        >
            <Box
                component="img"
                src={`http://localhost:5000${item.product?.image || item.image}`}
                width={100}
                loading="lazy"
            />
            <Box>
                <Typography variant="h6">{item.product?.name || item.name}</Typography>
                <Typography color="text.secondary">
                    Price: ${item.product?.price?.toFixed(2) || item.price?.toFixed(2) || "0.00"}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton aria-label="decrease" onClick={onDecrement} disabled={item.quantity === 1}>
                    <RemoveIcon />
                </IconButton>
                <Typography
                    sx={{
                        mx: 1,
                        minWidth: 25,
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    {item.quantity || 0}
                </Typography>
                <IconButton aria-label="increase" onClick={onIncrement}>
                    <AddIcon />
                </IconButton>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "red" }}
                    startIcon={<DeleteIcon />}
                    onClick={() => onRemove(item.product || item._id)}
                >
                    Remove
                </Button>
            </Box>
        </Paper>
    );
});

const CartPage = () => {

    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);

    const totalPrice = cartItems.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return acc + price * quantity;
    }, 0);

    if (!cartItems || cartItems.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6">Your cart is empty</Typography>
            </Box>
        );
    }


    return (
        <Box
            sx={{
                p: 2,
            }}
        >
            <Box
                sx={{
                    maxWidth: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: { xs: "center", md: "center", lg: "space-between" },
                    flexWrap: "wrap",
                    gap: 2,
                    mx: "auto",
                    mt: 4,
                    p: 2,
                }}
                border
                boxShadow
            >
                {cartItems.map((item) => (

                    <CartItem
                        key={item._id}
                        item={item}
                        onIncrement={() =>
                            dispatch(addToCart({ productId: item.product?._id || item.product, quantity: 1 }))
                        }
                        onDecrement={() =>
                            item.quantity > 1 &&
                            dispatch(addToCart({ productId: item.product?._id || item.product, quantity: -1 }))
                        }
                        onRemove={() =>
                            dispatch(removeFromCart(item.product?._id || item.product))
                        }
                    />

                ))}
            </Box>
            <Box
                sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Typography variant="h6" mb={0}>
                    Total: ${totalPrice.toFixed(2)}
                </Typography>
                <Button variant="contained" color="primary" size="large">
                    Checkout
                </Button>
            </Box>
        </Box>
    );
};

export default CartPage;
