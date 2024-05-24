import React, { useState } from "react";
import * as Yup from 'yup';
import { Button, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const   RegisterForm = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const navigate = useNavigate();


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            email: ""
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required("Nhập họ và tên"),
            email: Yup.string().required("Vui lòng nhập email").email("Vui lòng nhập đúng định dạng email"),
            phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
            confirmPassword: Yup.string().required("Vui lòng nhập lại mật khẩu"),
            password: Yup.string().required("Nhập mật khẩu ít nhất 8 ký tự chứa 0-9, a-z, A-Z và ký tự đặc biệt"),
        }),
        onSubmit: async values => {
            await axios
                .post("http://localhost:8000/auth/signup", values)
                .then(res => {
                    navigate('/auth/verify')
                    localStorage.setItem('email', values.email);
                })
                .catch(err => {
                    console.log(err);
                    enqueueSnackbar(`Đăng ký không thành công`, {
                        variant: 'error',
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right'
                        }
                    });
                });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
                <TextField
                    fullWidth
                    id="name"
                    label="Họ và tên"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.name && formik.touched.name}
                    helperText={formik.errors.name}
                    value={formik.values.name}
                />
                <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.errors.email && formik.touched.email}
                    helperText={formik.errors.email}
                    value={formik.values.email}
                />
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
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                                        onClick={() => {
                                            setShowPassword(!showPassword);
                                        }}>
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        fullWidth
                        id="confirmPassword"
                        label="Nhập lại mật khẩu"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.confirmPassword && formik.touched.confirmPassword}
                        helperText={formik.errors.confirmPassword}
                        value={formik.values.confirmPassword}
                        type={showPasswordConfirm ? "text" : "password"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment>
                                    <IconButton
                                        onClick={() => {
                                            setShowPasswordConfirm(!showPasswordConfirm);
                                        }}>
                                        {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <Button fullWidth color="inherit" size="large" type="submit" variant="contained" >
                    Đăng ký
                </Button>
            </Stack>


        </form>
    )
}
export default RegisterForm;