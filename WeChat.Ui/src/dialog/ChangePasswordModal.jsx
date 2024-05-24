import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Dialog,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 8,
    width: 400,
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
}));

function ChangePasswordModal({ open, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);
  const [showNewPasswordConfirm, setNewShowPasswordConfirm] = useState(false);

  const classes = useStyles();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
      newPassword: Yup.string()
        .required("Vui lòng nhập mật khẩu mới")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Mật khẩu mới phải chứa ít nhất 8 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt"
        ),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref("newPassword"), null],
          "Xác nhận mật khẩu mới không khớp"
        )
        .required("Vui lòng xác nhận mật khẩu mới"),
    }),
    onSubmit: async (values) => {
      const token = localStorage.getItem("accessToken");
      try {
        const { password, newPassword } = values; 
        const payload = { password, newPassword };
        await axios.post(
          process.env.REACT_APP_API_ENDPOINT + "user/me/change-password",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("vào");

        enqueueSnackbar(`Đổi mật khẩu thành công`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });

        onClose(false);
      } catch (error) {
        if (!error.response) {
          enqueueSnackbar(`Không thể đổi mật khẩu`, {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
          return;
        }
        const { error: errorMsg } = error.response.data;
        if (errorMsg === 'Old password is incorrect.') {
          enqueueSnackbar('Mật khẩu hiện tại không đúng', { 
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
    <>
      <Dialog
        //  disableBackdropClick={true}
        open={open}
        scroll={"body"}
        onClose={() => {
          onClose();
        }}
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
        className={classes.modal}
        //   onMouseDown={handleModalClick}
      >
        <form onSubmit={formik.handleSubmit}>
          <Stack
            alignItems="center"
            spacing={"20px"}
            className={classes.paper}
            sx={{
              ...classes.paper,
            }}
            direction={"column"}
          >
            <Avatar className={classes.avatar} />
            <Typography variant="h5" align="center" gutterBottom>
              Thông tin tài khoản
            </Typography>
            <TextField
              className={classes.formField}
              fullWidth
              id="password"
              label="Mật khẩu hiện tại"
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
                      }}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className={classes.formField}
              fullWidth
              id="newPassword"
              label="Mật khẩu mới"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.newPassword && formik.touched.newPassword}
              helperText={formik.errors.newPassword}
              value={formik.values.newPassword}
              type={showNewPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton
                      onClick={() => {
                        setNewShowPassword(!showNewPassword);
                      }}
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className={classes.formField}
              fullWidth
              id="confirmPassword"
              label="Nhập lại mật khẩu"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.errors.confirmPassword && formik.touched.confirmPassword
              }
              helperText={formik.errors.confirmPassword}
              value={formik.values.confirmPassword}
              type={showNewPasswordConfirm ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton
                      onClick={() => {
                        setNewShowPasswordConfirm(!showNewPasswordConfirm);
                      }}
                    >
                      {showNewPasswordConfirm ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Cập nhật
            </Button>
          </Stack>
        </form>
      </Dialog>
    </>
  );
}

export default ChangePasswordModal;
