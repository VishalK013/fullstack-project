import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    CircularProgress,
} from "@mui/material";
import ProductSummaryLineChart from "../components/ProductSummaryLineChart";
import OrderTrendsListChart from "../components/OrderTrendsListChart";
import GroupIcon from "@mui/icons-material/Group";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrderCount, fetchAllOrders } from "../features/order/OrderSlice";
import { fetchAllProductCount } from "../features/product/ProductSlice";
import { fetchUserCount } from "../features/user/UserSlice";
import { Inventory2, Receipt } from "@mui/icons-material";
import { height } from "@mui/system";

const DashboardContent = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const allOrderCount = useSelector((state) => state.orders.allOrderCount);
    const totalProducts = useSelector((state) => state.product.allProductCount);
    const totalUsers = useSelector((state) => state.user.userCount);
    const orders = useSelector((state) => state.orders.orders) || [];
    const pendingOrderCount = orders.filter((o) => o.status === "Pending").length;
    const deliveredOrderCount = orders.filter((o) => o.status === "Delivered").length;


    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                dispatch(fetchAllOrderCount()),
                dispatch(fetchAllProductCount()),
                dispatch(fetchUserCount()),
                dispatch(fetchAllOrders())
            ]);
            setLoading(false);
        };
        loadData();
    }, [dispatch]);

    const StatBox = ({ label, value }) => (
        <Box>
            <Typography variant="subtitle1" fontWeight={600}>
                {label}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
                {value}
            </Typography>
        </Box>
    );

    const cardStyles = (bgColor) => ({
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        backgroundColor: bgColor,
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": { boxShadow: 8 },
        height: "160px"
    });

    if (loading) {
        return (
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                <Paper elevation={4} sx={{ ...cardStyles("#E3F2FD"), height: "250px", width: "250px" }}>
                    <GroupIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                    <StatBox label="Total Users" value={totalUsers} />
                </Paper>

                <Paper elevation={4} sx={{ ...cardStyles("#E8F5E9"), height: "250px", width: "250px" }}>
                    <Inventory2 sx={{ fontSize: 50, color: "#388E3C" }} />
                    <StatBox label="Total Products" value={totalProducts} />
                </Paper>

                <Paper elevation={4} sx={{ ...cardStyles("#FFF3E0"), height: "250px", width: "250px" }}>
                    <Receipt sx={{ fontSize: 50, color: "#F57C00" }} />
                    <StatBox label="Total Orders" value={allOrderCount} />
                </Paper>

                <Paper elevation={4} sx={{ ...cardStyles("#E57373"), height: "250px", width: "250px" }}>
                    <Receipt sx={{ fontSize: 50, color: "#C62828" }} />
                    <StatBox label="Pending Orders" value={pendingOrderCount} />
                </Paper>

                <Paper elevation={4} sx={{ ...cardStyles("#A5D6A7 "), height: "250px", width: "250px" }}>
                    <Receipt sx={{ fontSize: 50, color: "#388E3C" }} />
                    <StatBox label="Delivered Orders" value={deliveredOrderCount} />
                </Paper>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: 3,
                    mt: 4,
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        ...cardStyles("#E1F5FE"),
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "250px",
                        flex: "1",
                        minWidth: "400px",
                        display: "flex",
                        p: 2,
                        borderRadius: 3,
                    }}
                >
                    <Box width={"150px"} textAlign={"center"} color={"#1565C0"}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Products Summary
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {totalProducts}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            height: "100%",
                            backgroundColor: "white",
                            borderRadius: 2,
                            p: 1,
                        }}
                    >
                        <ProductSummaryLineChart mini />
                    </Box>
                </Paper>

                <Paper
                    elevation={4}
                    sx={{
                        ...cardStyles("#FFF3E0"),
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        height: "250px",
                        flex: "1",
                        minWidth: "400px",
                        display: "flex",
                        p: 2,
                        borderRadius: 3,
                    }}
                >
                    <Box width={"150px"} textAlign={"center"} color={"#E65100"}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Orders Trends
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                            {allOrderCount}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            height: "100%",
                            backgroundColor: "white",
                            borderRadius: 2,
                            p: 1,
                        }}
                    >
                        <OrderTrendsListChart mini />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default DashboardContent;
