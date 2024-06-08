import Router from "./routes";
import ThemeProvider from './theme';
import React, { useEffect } from "react";
import { SnackbarProvider } from 'notistack';
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("App.useEffect");

    const lastAccessRoomId = localStorage.getItem("lastAccessRoomId");

    console.log("lastAccessRoomId: " + lastAccessRoomId);

    const chatPath = lastAccessRoomId ? '/chat/' + lastAccessRoomId : '/chat';
    console.log("lastAccessRoomId: " + lastAccessRoomId);
    console.log("chatPath: " + chatPath);

    

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
