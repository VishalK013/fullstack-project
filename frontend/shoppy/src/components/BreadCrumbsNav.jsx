import React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Typography, Link } from "@mui/material";

const BreadCrumbsNav = ({ productName }) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2, ml: 2 }}>
            <Link component={RouterLink} underline="hover" color="inherit" to="/">
                Home
            </Link>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;

                let label = value;

                if (isLast && value.length === 24 && productName) {
                    label = productName;
                } else {
                    label = label.charAt(0).toUpperCase() + label.slice(1);
                }

                return isLast ? (
                    <Typography color="text.primary" key={to}>
                        {label}
                    </Typography>
                ) : (
                    <Link component={RouterLink} underline="hover" color="inherit" to={to} key={to}>
                        {label}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
};

export default BreadCrumbsNav;
