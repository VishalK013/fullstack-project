import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Hero from '../assets/Hero.png';
import Hero2 from '../assets/Hero2.png';
import vector1 from "../assets/Vector.png";
import vector2 from "../assets/Vector2.png";
import versace from "../assets/Versace.png"
import zara from "../assets/Zara.png"
import gucci from "../assets/Gucci.png"
import prada from "../assets/Prada.png"
import CK from "../assets/CK.png"
import Navbar from '../components/Navbar';
import NewArrival from '../components/NewArrival';

function Home() {
    return (

        <Box>
            <Box
                sx={{
                    minHeight: '100vh',
                    height: 'auto',
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
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", md: 'column', lg: 'column' },

                }}
            >
                <Box
                    width={{ xs: "100%", md: "100%", lg: "80%" }}
                    display="flex"
                    flexDirection="column"
                    alignItems={{ xs: "center", md: "center", lg: "flex-start" }}
                    px={5}
                    pb={5}
                    pt={10}
                    sx={{
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
                        }}
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
                            <Typography variant="h4" sx={{ fontSize: { lg: 40, md: 30, xs: 25 }, fontWeight: 900 }}>
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
                            <Typography variant="h4" sx={{ fontSize: { lg: 40, md: 30, xs: 25 }, fontWeight: 900 }}>
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
                            <Typography variant="h4" sx={{ fontSize: { lg: 40, md: 30, xs: 25 }, fontWeight: 900 }}>
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
                                xs: "900px",
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
                            display: { xs: 'block', sm: "none", md: 'none', lg: "block" },
                        }}
                    />
                    <Box
                        component="img"
                        src={vector2}
                        width={95}
                        sx={{
                            position: "absolute",
                            top: { xs: "50%", lg: "15%" },
                            right: "5%",
                            display: { xs: 'block', sm: "none", md: 'none', lg: "block" },
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
                        display: { xs: 'block', sm: "none", md: 'none', lg: 'none' },
                    }}
                />
                <Box backgroundColor="black" height={120} gap={3} display={"flex"} width={"100%"} flexWrap={"wrap"} alignItems={"center"} justifyContent={"space-evenly"}>
                    <Box
                        component="img"
                        src={versace}
                        width={150}
                        height={35}
                    />
                    <Box
                        component="img"
                        src={zara}
                        width={110}
                        height={35}
                    />
                    <Box
                        component="img"
                        src={gucci}
                        width={150}
                        height={35}
                    />
                    <Box
                        component="img"
                        src={prada}
                        width={150}
                        height={35}
                    />
                    <Box
                        component="img"
                        src={CK}
                        width={200}
                        height={35}
                    />
                </Box>
            </Box >
            <NewArrival/>
        </Box>
    );
}

export default Home;
