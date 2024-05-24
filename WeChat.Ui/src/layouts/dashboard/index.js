import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Stack } from "@mui/material";
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { readUrl } from "@/utils/readUrl";


const DashboardLayout = () => {
  const theme = useTheme();
  const { user, isLoading } = useSelector((state) => state.user);

  if (!isLoading && !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Stack direction="row">
      <Box
        p={2}
        sx={{
          backgroundColor: 'white',
          boxShadow: " 0px 0px 2px rgba(0, 0, 0, 0.25)",
          width: '100px',
          height: "100vh",
        }}>
        <Stack
          direction="column"
          alignItems={"center"}
          justifyContent="space-between"
          sx={{ height: "100%" }}>
          <Avatar
            sx={{ width: '60px', height: '60px' }}
            alt={"Nguyễn Quốc Huy"}
            src={readUrl("/storage-api/bucket/665084baa340536c521c22b1/OTdjOTQ4NzE4ZTU3YTFiYzVjZWJjMmRiMWQ5MWQwZDEuanBn")} />
          <Sidebar />
        </Stack>
      </Box>
      <Box sx={{ overflowY: 'scroll', width: '100%' }}>
      <Outlet />
    </Box>
    </Stack >
  );
};

export default DashboardLayout;
