import React, { useState } from "react";
import * as Yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useFormik } from "formik"
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
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
      try {
        const res = await axios.post(process.env.REACT_APP_API_ENDPOINT + "auth/login", values);
        const { token } = res.data;

        enqueueSnackbar('Đăng nhập thành công', { 
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right'
          }
        });

        localStorage.setItem("accessToken", token);
        navigate("/chat");
      } catch (error) {
        if (!error.response) {
          enqueueSnackbar('Không thể kết nối đến máy chủ', { 
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
          return;
        }
        const { error: errorMsg } = error.response.data;
        if (errorMsg === 'Password is incorrect.') {
          enqueueSnackbar('Sai mật khẩu', { 
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        } else if (errorMsg === 'User not found.') {
          enqueueSnackbar('User không tồn tại trên hệ thống', { 
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        } else if (errorMsg === 'Account has not been verified.') {
          enqueueSnackbar('Tài khoản chưa được xác thực qua email', { 
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        } else {
          enqueueSnackbar(errorMsg, { 
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });
        }
      }
    },
  });

  return (
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
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}>
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
  );
};
export default LoginForm;
