import React, { useState } from "react";
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {Link as RouterLink} from "react-router-dom"
import { Alert, Button, IconButton, InputAdornment, Link, Stack } from "@mui/material";
import {yupResolver} from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";
import { Visibility , VisibilityOff  } from "@mui/icons-material";
const NewPasswordForm = () =>{
    const [showPassword , setShowPassword] = useState(false);
    
    const NewPasswordSchema = Yup.object().shape({
        newPassword:  Yup.string().required("Nhập đúng mật khẩu"),
        confirmPassword:  Yup.string().required("Nhập đúng mật khẩu").oneOf([Yup.ref('newPassword'), null],"Mật khẩu phải trùng"),
    });

    const defaultValues = {
        
        newPassword:"",
        confirmPassword :""
    }

    const methods  = useForm({
        resolver : yupResolver(NewPasswordSchema),
        defaultValues,
    });

    const {reset, setError, handleSubmit, formState: {errors, isSubmitting, isSubmitSuccessful},
    }= methods;

    const  onSubmit = async (data)=> {
        try{

        }
        catch(error){
            console.log(error);
            reset();
            setError("afterSubmit",{
                ...error,
                message: error.message,
            })

        }
    }
    return (
    
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
            {!!errors.afterSumit && <Alert severity="error">{errors.afterSumit.message}</Alert>}

      
        <RHFTextField name="newPassword" label = "New Password" type={showPassword ? "text" :"password"} 
        InputProps ={{
            endAdornment:(
                <InputAdornment>
                    <IconButton onClick={() => {
                        setShowPassword(!showPassword);
                    }}>
                       {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            )
        }}/>
        <RHFTextField name="confirmPassword" label = "Confirm Password" type={showPassword ? "text" :"password"} 
        InputProps ={{
            endAdornment:(
                <InputAdornment>
                    <IconButton onClick={() => {
                        setShowPassword(!showPassword);
                    }}>
                       {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            )
        }}/>
        </Stack>
        
        <Button fullWidth color="inherit" size="large" type="submit" variant="contained" >
            Xác nhận
        </Button>
    </ FormProvider>
    );
};
export default NewPasswordForm;