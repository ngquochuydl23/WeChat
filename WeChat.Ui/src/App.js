import Router from "./routes";
import ThemeProvider from './theme';
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setLoading, stopLoading } from "./redux/slices/userSlice";
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "./services/userApiService";

export default function App() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("social-v2.wechat.accessToken")) {

      dispatch(setLoading());
      getMyProfile()
        .then(res => {
          const { user } = res.result;
          console.log(user)
          dispatch(setUser(user));
          navigate("/chat");
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
        .finally(() => dispatch(stopLoading()))
    }
  }, [dispatch]);

  return (
    <ThemeProvider>
      <SnackbarProvider>
        <Router />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
