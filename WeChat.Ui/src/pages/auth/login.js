import { Link as RouterLink, useNavigate } from "react-router-dom"
import {
    Stack,
    Typography,
    Link,
    TextField,
    Button,
    IconButton,
    InputAdornment
} from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "@/services/loginApiService";


const Login = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            phoneNumber: '',
            password: ''
        },
        validationSchema: Yup.object().shape({
            phoneNumber: Yup
                .string()
                .required('Vui lòng nhập số điện thoại'),
            password: Yup.string()
                .required('Vui lòng nhập mật khẩu')
        }),
        onSubmit: async values => {
            login(values)
                .then(({ result }) => {
                    enqueueSnackbar('Đăng nhập thành công', {
                        variant: 'success',
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right'
                        }
                    });

                    localStorage.setItem("social-v2.wechat.accessToken", result.token);
                    navigate("/chat");
                })
                .catch(error => {
                    console.log(error);
                    if (!error) {
                        enqueueSnackbar('Không thể kết nối đến máy chủ', {
                            variant: 'error',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            }
                        });
                        return;
                    }

                    if (error === 'Password is incorrect.') {
                        enqueueSnackbar('Sai mật khẩu', {
                            variant: 'error',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            }
                        });
                    } else if (error === 'User not found.') {
                        enqueueSnackbar('User không tồn tại trên hệ thống', {
                            variant: 'error',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            }
                        });
                    } else if (error === 'Account has not been verified.') {
                        enqueueSnackbar('Tài khoản chưa được xác thực qua email', {
                            variant: 'error',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            }
                        });
                    } else {
                        enqueueSnackbar(error, {
                            variant: 'error',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right'
                            }
                        });
                    }
                })
        },
    });

    return (
        <Stack
            spacing={2}
            sx={{
                mb: 5,
                position: "relative"
            }}>
            <Typography variant="h4">
                Đăng nhập
            </Typography>
            <Stack direction="row" spacing={0.5}>
                <Typography variant="body2">
                    Người mới?
                </Typography>
                <Link to="/auth/register" component={RouterLink} variant="subtitle2">
                    Tạo Tài Khoản
                </Link>
            </Stack>
            <form onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        id="phoneNumber"
                        label="Số điện thoại"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.phoneNumber && formik.touched.phoneNumber}
                        helperText={formik.errors.phoneNumber}
                        value={formik.values.phoneNumber}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        label="Mật khẩu"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.password && formik.touched.password}
                        helperText={formik.errors.password}
                        value={formik.values.password}
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment>
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <Stack alignItems={"flex-end"} sx={{ my: 2 }}>
                    <Link
                        component={RouterLink}
                        to="/auth/reset-Password"
                        varient="body2"
                        color="inherit"
                        underline="always">
                        Quên Mật Khẩu?
                    </Link>
                </Stack>
                <Button
                    fullWidth
                    color="inherit"
                    size="large"
                    type="submit"
                    variant="contained">
                    Đăng nhập
                </Button>
            </form>
        </Stack>
    )
}
export default Login;