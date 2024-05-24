import { Stack, Typography } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import { Link as RouterLink } from 'react-router-dom';
import React from "react";
import { Link } from "react-router-dom";
import NewPasswordForm from "../../sections/auth/NewPasswordForm";
const newPassword = () => {
    return (
        <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
            <Typography variant="h3" paragraph>
                Cài lại mật khẩu
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 5 }}>
                Nhập mật khẩu mới
            </Typography>


            <NewPasswordForm />
            <Link component={RouterLink} to="/auth/login" color="black" variant="subtitle2" sx={{ mt: 3, mx: "auto", alignItems: "center", display: "inline-flex" }}>
                <CaretLeft />
                Quay lại để đăng nhập
            </Link>
        </Stack>
    )
}
export default newPassword;