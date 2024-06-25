import { Box, Container, Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <Box
            height="100vh"
            alignItems="center"
            justifyContent="center">
            <Container maxWidth="sm">
                <Outlet />
            </Container>
        </Box>
    )
}
export default AuthLayout;