import { Divider,IconButton,Stack } from "@mui/material";
import {  GithubLogo, GoogleLogo, TwitchLogo } from "phosphor-react";


import React from "react";
const AuthSocial = () =>{
    return (
        <>
        <div>
            <Divider sx={{my:2, typography:"overline", color : "text.disabled", '&::before, ::after': {
                borderTopStyle : "solid"
            }}} >
                Đăng Nhập
            </Divider>
            <Stack direction={"row"} justifyContent="center" spacing={2} >
                <IconButton >
                    <GoogleLogo color="Red" />
                </IconButton>
                <IconButton >
                    <GithubLogo color="black" />
                </IconButton>
                <IconButton >
                    <TwitchLogo color="#1C9CEA" />
                </IconButton>
            </Stack>
        </div>

        </>
    )
}
export default AuthSocial;