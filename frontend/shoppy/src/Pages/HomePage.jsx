import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Hero from '../assets/Hero.png';
import Hero2 from '../assets/Hero2.png';
import vector1 from "../assets/Vector.png";
import vector2 from "../assets/Vector2.png";

function Home() {
    return (
        <Box
            sx={{
                height: '100vh',
                backgroundImage: {
                    xs: 'none',
                    md: 'none',
                    lg: `url(${Hero})`,
                },
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                display: 'flex',
                flexDirection: { xs: "column", md: 'column', lg: 'row' },
            }}
        >
            <Box
                width={{ lg: "70%", md: "100%" }}
                display="flex"
                flexDirection="column"
                alignItems={{ xs: "center", md: "center", lg: "flex-start" }}
                justifyContent="center"
                px={5}
                sx={{
                    height: { md: '100vh', lg: '100vh' },
                    backgroundColor: { xs: "#F2F0F1", md: "#F2F0F1", lg: "transparent" }
                }}
            >
                <Typography
                    variant="h2"
                    width={{ lg: "60%", md: "100%", xs: "100%" }}
                    sx={{
                        fontSize: { xs: 40, md: 50, lg: 60 },
                        textTransform: 'uppercase',
                        fontWeight: 900,
                        textAlign: { xs: 'center', md: 'center', lg: 'left' }
                    }}
                >
                    Find Clothes that matches your style
                </Typography>

                <Typography
                    variant="body1"
                    color="primary"
                    width={{ lg: "65%", md: "65%", xs: "100%" }}
                    sx={{
                        mt: 3,
                        fontSize: { xs: 11, md: 13, lg: 15 },
                        textAlign: { xs: 'center', md: 'center', lg: 'left' }
                    }
                    }
                >
                    Browse through our diverse range of meticulously crafted garments,
                    designed to bring out your individuality and cater to your sense of
                    style.
                </Typography>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{
                        mt: 5,
                        alignSelf: { xs: "center", md: "center", lg: "flex-start" },
                        width: { xs: "100%", md: "190px" },
                    }}
                >
                    Shop Now
                </Button>

                <Box
                    display="flex"
                    gap={4}
                    mt={6}
                    alignItems={"center"}
                    justifyContent={{ xs: "center", md: "center", lg: "flex-start" }}
                    flexWrap="wrap"
                    width={"100%"}
                >
                    <Box pr={{ sm: 4 }} textAlign={{ xs: "center", md: "left" }} width={{ xs: '100%', sm: 'auto' }}>
                        <Typography variant="h4" sx={{ fontSize: { lg: 40, md: 30, sx: 25 }, fontWeight: 900 }}>
                            200+
                        </Typography>
                        <Typography variant="body1" color="primary" sx={{ fontSize: { lg: 14, md: 12, xs: 10 } }}>
                            International Brands
                        </Typography>
                    </Box>

                    <Box
                        px={{ sm: 4 }}
                        width={{ xs: '100%', sm: 'auto' }}
                        textAlign={{ xs: "center", md: "left" }}
                        sx={{
                            borderLeft: {
                                md: '1px solid rgb(199, 196, 198)',
                                xs: 'none'
                            },
                            pt: { xs: 2, sm: 0 },
                        }}
                    >
                        <Typography variant="h4" sx={{ fontSize: { lg: 40, md: 30, sx: 25 }, fontWeight: 900 }}>
                            2,000
                        </Typography>
                        <Typography variant="body1" color="primary" sx={{ fontSize: { lg: 14, md: 12, xs: 10 } }}>
                            High-Quality Products
                        </Typography>
                    </Box>

                    <Box
                        px={{ sm: 4 }}
                        width={{ xs: '100%', sm: 'auto' }}
                        textAlign={{ xs: "center", md: "left" }}
                        sx={{
                            borderLeft: {
                                md: '1px solid rgb(199, 196, 198)',
                                xs: 'none',
                            },
                            pt: { xs: 2, sm: 0 },
                        }}
                    >
                        <Typography variant="h4" sx={{ fontSize: { lg: 40, md: 30, sx: 25 }, fontWeight: 900 }}>
                            30,000+
                        </Typography>
                        <Typography variant="body1" color="primary" sx={{ fontSize: { lg: 14, md: 12, xs: 10 } }}>
                            Happy Customers
                        </Typography>
                    </Box>
                </Box>


                <Box
                    component="img"
                    src={vector1}
                    width={60}
                    sx={{
                        position: "absolute",
                        top: {
                            xs: "700px", 
                            lg: "40%"
                        },
                        left: {
                            xs: "5%",
                            lg: "auto"
                        },
                        right: {
                            xs: "auto",
                            lg: "45%"
                        },
                        display: { xs: 'block', md: 'none', lg: "block" },
                    }}
                />
                <Box
                    component="img"
                    src={vector2}
                    width={95}
                    sx={{
                        position: "absolute",
                        top: { xs: "95%", lg: "15%" },
                        right: "5%",
                        display: { xs: 'block', md: 'none', lg: "block" },
                    }}
                />
            </Box>

            <Box
                component="img"
                src={Hero2}
                alt="Hero 2"
                sx={{
                    width: { xs: "100%" },
                    objectFit: 'cover',
                    display: { xs: 'block', md: 'none', lg: 'none' },
                }}
            />
        </Box >
    );
}

export default Home;
