import Router from "./routes";
import ThemeProvider from './theme';
import React, { useEffect } from "react";
import { SnackbarProvider } from 'notistack';
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const lastAccessRoomId = localStorage.getItem("lastAccessRoomId");
    const chatPath = lastAccessRoomId ? '/chat/' + lastAccessRoomId : '/chat';

    navigate(localStorage.getItem("social-v2.wechat.accessToken") ? chatPath : '/auth/login');
  }, []);

  return (
    <ThemeProvider>
      <SnackbarProvider>
        <Router />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
