import { Stack, Typography, Link } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import React from "react";
import { CaretLeft } from "phosphor-react";
import ResetPasswordForm from "../../sections/auth/ResetPasswordForm";

const resetPassword = () => {
    return (
        <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
            <Typography variant="h3" paragraph>
                Quên mật khẩu?
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 5 }}>
                Nhập email liên kết với tài khoản để có thể nhận được đường dẫn reset mật Khẩu
            </Typography>
            <ResetPasswordForm />
            <Link component={RouterLink} to="/auth/login" color="black" variant="subtitle2" sx={{ mt: 3, mx: "auto", alignItems: "center", display: "inline-flex" }}>
                <CaretLeft />
                Quay lại để đăng nhập
            </Link>
        </Stack>
    )
}
export default resetPassword;