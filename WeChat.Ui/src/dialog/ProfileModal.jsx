import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { enqueueSnackbar } from "notistack";

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

const ProfileModal = ({ open, onClose }) => {
  const classes = useStyles();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Vui lòng nhập họ và tên"),
      phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
      email: Yup.string()
        .email("Vui lòng nhập đúng định dạng email")
        .required("Vui lòng nhập email"),
    }),

    onSubmit: async (values) => {
      const token = localStorage.getItem("accessToken");
      try {
        await axios.put(process.env.REACT_APP_API_ENDPOINT + "user/me", values, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        enqueueSnackbar(`Cập nhật tài khoản thành công`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });

        onClose(false);
      } catch (error) {
        if (!error.response) {
          enqueueSnackbar(`Không thể cập nhập tài khoản`, {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
          return;
        }
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy token từ Local Storage
        const token = localStorage.getItem("accessToken");
        // Nếu token tồn tại
        if (token) {
          const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + "user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          formik.setValues({
            fullName: response.data.user.fullName || "",
            phoneNumber: response.data.user.phoneNumber || "",
            email: response.data.user.email || "",
          });
        } else {
          // Xử lý khi không có token
          console.error("No token found in Local Storage");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
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
            id="fullName"
            className={classes.formField}
            label="Họ và tên"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.fullName}
          />
          <TextField
            id="email"
            className={classes.formField}
            label="Email"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <TextField
            id="phoneNumber"
            className={classes.formField}
            label="Điện thoại"
            fullWidth
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.phoneNumber}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Cập nhật
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
};

export default ProfileModal;
