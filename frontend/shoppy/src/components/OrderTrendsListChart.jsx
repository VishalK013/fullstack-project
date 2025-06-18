import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderTrends } from "../features/admin/AdminSlice";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { CircularProgress } from "@mui/material";

const OrderTrendsListChart = ({ mini = false }) => {
    const dispatch = useDispatch();
    const { ordersTrends, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getOrderTrends());
    }, [dispatch]);

    if (loading) {
        return <CircularProgress size={mini ? 20 : 40} />;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ordersTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide={mini} />
                <YAxis hide={mini} allowDecimals={false} />
                <Tooltip wrapperStyle={{ fontSize: mini ? 10 : 12 }} />
                {!mini && <Legend />}
                <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#1976d2"
                    strokeWidth={2}
                    dot={{ r: mini ? 2 : 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default OrderTrendsListChart;
