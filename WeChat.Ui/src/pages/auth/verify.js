import { Stack, Typography } from "@mui/material";
import React from "react" ;
import VerifyForm from "../../sections/auth/VerifyForm";

const VerifyPage = () =>{
    return(
        <>
        <Stack spacing={2} sx={{mb:5 ,position:"relative"}}>
            <Typography variant="h3" align="center">
                Xác thực email
            </Typography>
            <VerifyForm/>
        </Stack>
        
        </>
    )
}
export default VerifyPage;