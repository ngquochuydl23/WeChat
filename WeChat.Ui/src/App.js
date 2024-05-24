import Router from "./routes";
import ThemeProvider from './theme';
import ThemeSettings from './components/settings';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading, stopLoading } from "./redux/slices/userSlice";
import { SnackbarProvider, useSnackbar } from 'notistack';
import axios from "axios";

export default function App() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(setLoading());
      axios
        .get(process.env.REACT_APP_API_ENDPOINT + "/user", {
          headers: {
            Authorization: 'Bearer ' + token,
          }
        })
        .then(res => {
          dispatch(setUser(res.data.user));
        })
        .catch(err => {
          console.log(err);
          enqueueSnackbar(`Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại`, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right'
            }
          });

        })
      //   .finally(() => dispatch(stopLoading()))
    }
  }, [dispatch]);

  return (
    <ThemeProvider>
      <ThemeSettings>
        <SnackbarProvider
        >
          <Router />
        </SnackbarProvider>
      </ThemeSettings>
    </ThemeProvider>
  );
}
