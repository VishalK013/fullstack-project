import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProductById } from '../features/product/ProductSlice'
import { addToCart } from "../features/carts/CartSlice"

import {
    Box,
    Button,
    Typography,
    IconButton,
    Stack,
    CircularProgress,
} from '@mui/material'

import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'

function SinglePageProduct() {
    const { id } = useParams()
    const dispatch = useDispatch()

    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        dispatch(fetchProductById(id))
    }, [dispatch, id])

    const handleAddToCart = (product) => {
        dispatch(addToCart({ productId: product._id, quantity }));
    }

    const { selectedProduct: product, loading, error } = useSelector(state => state.product)


    const increment = () => setQuantity(q => q + 1)
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1))

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />
    if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>
    if (!product) return <Typography align="center" mt={4}>Product not found</Typography>

    return (
        <Box
            sx={{
                maxWidth: "100%",
                height: "100%",
                mx: 'auto',
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                gap: 4,
                flexWrap: 'wrap',
            }}
        >
            <Box sx={{ flex: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box
                    component="img"
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    sx={{ maxWidth: '100%', height: 300, borderRadius: 2, objectFit: 'contain' }}
                />
            </Box>

            <Box sx={{ flex: '55%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {product.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    {product.description}
                </Typography>

                <Typography variant="subtitle1" mb={1}>
                    <strong>Price:</strong> ${product.price}
                </Typography>
                <Typography variant="subtitle1" mb={1}>
                    <strong>Category:</strong> {product.category || 'N/A'}
                </Typography>
                <Typography variant="subtitle1" mb={3}>
                    <strong>Rating:</strong> {product.rating ? product.rating.toFixed(1) : 'No rating'}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton color="primary" onClick={decrement} sx={{ backgroundColor: "#f5f5f5" }} aria-label="decrease quantity">
                        <RemoveIcon />
                    </IconButton>
                    <Typography variant="h6" minWidth={32} textAlign="center">
                        {quantity}
                    </Typography>
                    <IconButton color="primary" onClick={increment} sx={{
                        backgroundColor: "black", '&:hover': {
                            backgroundColor: "black",
                        },
                    }} aria-label="increase quantity">
                        <AddIcon />
                    </IconButton>
                </Stack>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4 }}
                    onClick={() => handleAddToCart(product)}
                >
                    Add to Cart
                </Button>
            </Box>
        </Box>
    )
}

export default SinglePageProduct
