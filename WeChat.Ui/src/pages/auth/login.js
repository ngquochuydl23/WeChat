import {Link as RouterLink} from "react-router-dom"
import { Stack, Typography,Link } from "@mui/material";
import React from "react" ;
import AuthSocial from "../../sections/auth/AuthSocial";
import LoginForm from "../../sections/auth/LoginForm";

const Login = () =>{
    return(
        <>
        <Stack spacing={2} sx={{mb:5 ,position:"relative"}}>
            <Typography variant="h4">
                Đăng Nhập
            </Typography>
            <Stack direction="row" spacing={0.5}>
                <Typography variant="body2">
                    Người mới?
                </Typography>
                <Link to="/auth/register" component={RouterLink} variant= "subtitle2">
                    Tạo Tài Khoản
                </Link>
            </Stack>
            {/* login */}
            <LoginForm/>
            <AuthSocial />
        </Stack>
        
        </>
    )
}
export default Login;