import React from 'react';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Rating } from '@mui/material';

function ReviewPage() {
    return (
        <Box sx={{ width: "90%", mx: "auto", mt: 10, mb: 5 }}>
            <Typography
                variant="h3"
                textTransform="uppercase"
                fontWeight={700}
                mb={5}
                textAlign="center"
                sx={{
                    fontSize: {
                        xs: '1.8rem',
                        sm: '2.2rem',
                        md: '2.5rem',
                        lg: '3rem'
                    }
                }}
            >
                our happy customers
            </Typography>

            <Box
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                flexWrap="wrap"
                justifyContent="center"
                gap={4}
            >

                <Box
                    sx={{
                        width: { xs: '100%', sm: '90%', md: '30%' },
                        border: '1px solid rgb(228, 228, 228)',
                        boxShadow: 2,
                        borderRadius: 2,
                        mx: "auto",
                        p: 3
                    }}
                >
                    <Rating value={5} readOnly />
                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <Typography fontWeight={700} sx={{ fontSize: { xs: 16, sm: 18 } }} mr={1}>
                            Sarah
                        </Typography>
                        <CheckCircleIcon color="success" fontSize="small" />
                    </Box>
                    <Typography color="primary" sx={{ fontSize: { xs: 14, sm: 15 } }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat veritatis, iste perferendis doloribus sapiente veniam...
                    </Typography>
                </Box>

                <Box
                    sx={{
                        width: { xs: '100%', sm: '90%', md: '30%' },
                        border: '1px solid rgb(228, 228, 228)',
                        boxShadow: 2,
                        borderRadius: 2,
                        mx: "auto",
                        p: 3
                    }}
                >
                    <Rating value={5} readOnly />
                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <Typography fontWeight={700} sx={{ fontSize: { xs: 16, sm: 18 } }} mr={1}>
                            Alex K
                        </Typography>
                        <CheckCircleIcon color="success" fontSize="small" />
                    </Box>
                    <Typography color="primary" sx={{ fontSize: { xs: 14, sm: 15 } }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat veritatis, iste perferendis doloribus sapiente veniam...
                    </Typography>
                </Box>


                <Box
                    sx={{
                        width: { xs: '100%', sm: '90%', md: '30%' },
                        border: '1px solid rgb(228, 228, 228)',
                        boxShadow: 2,
                        borderRadius: 2,
                        mx: "auto",
                        p: 3
                    }}
                >
                    <Rating value={5} readOnly />
                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <Typography fontWeight={700} sx={{ fontSize: { xs: 16, sm: 18 } }} mr={1}>
                            James L
                        </Typography>
                        <CheckCircleIcon color="success" fontSize="small" />
                    </Box>
                    <Typography color="primary" sx={{ fontSize: { xs: 14, sm: 15 } }}>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quaerat veritatis, iste perferendis doloribus sapiente veniam...
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default ReviewPage;
