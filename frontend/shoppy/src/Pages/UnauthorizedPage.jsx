import React from "react";
import { Typography, Box } from "@mui/material";

const UnauthorizedPage = () => (
    <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h4" color="error">Unauthorized</Typography>
        <Typography>You do not have permission to view this page.</Typography>
    </Box>
);

export default UnauthorizedPage;
