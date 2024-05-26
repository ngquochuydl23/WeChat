import Router from "./routes";
import ThemeProvider from './theme';
import React, { useEffect } from "react";
import { SnackbarProvider } from 'notistack';
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("App.useEffect");
    navigate(localStorage.getItem("social-v2.wechat.accessToken") ? '/chat' : '/auth/login');
  }, []);

  return (
    <ThemeProvider>
      <SnackbarProvider>
        <Router />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
