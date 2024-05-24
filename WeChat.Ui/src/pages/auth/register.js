import {Link as RouterLink} from "react-router-dom"
import { Link,Stack, Typography } from "@mui/material";
import React from "react";
import RegisterForm from "../../sections/auth/RegisterForm";
import AuthSocial from "../../sections/auth/AuthSocial";
const register = () =>{
    return(
        <>
            <Stack spacing={2} sx={{mb:5 ,position:"relative"}}>
                <Typography variant="h4">
                    Đăng Ký Tài Khoản
                </Typography>
                <Stack direction={"row"} spacing = {0.5}>
                    <Typography variant="body2">
                        Đã có tài khoản?
                    </Typography>
                    <Link component={RouterLink} to="/auth/login" variant="subtitle2">
                        Đăng Nhập
                    </Link>
                </Stack>
                {/* form dk */}

                <RegisterForm/>
                <Typography component={"div"} sx={{color:"text.secondary", mt :3, typography:'caption' ,textAlign:'center' }}>
                {'Khi Đăng Ký Tôi Đồng Ý Với '}
                <Link underline="always" color="text.primary">
                    Điều Khoản Dịch Vụ 
                </Link>
                    {' và '}
                    <Link underline="always" color="text.primary">
                        Chính Sách Riêng Tư
                    </Link>
                </Typography>
                <AuthSocial />
            </Stack>
        </>

    )
}
export default register