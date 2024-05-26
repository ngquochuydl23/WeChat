import { Avatar, Box, List, ListItemButton, ListItemIcon, ListItemText, Popover, Stack } from "@mui/material";
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { readUrl } from "@/utils/readUrl";
import SendIcon from '@mui/icons-material/Send';
import Person2Icon from '@mui/icons-material/Person2';
import ProfileDialog from "@/sections/chat/ProfileDialog";

const DashboardLayout = () => {
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const { user, isLoading } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!user) {
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
          <Box sx={{ border: '4px solid #d3d3d3', borderRadius: '200px' }}>
            <Avatar
              onClick={handleClick}
              sx={{ width: '57px', height: '57px' }}
              alt={user.fullName}
              src={readUrl(user.avatar)} />
          </Box>
          <Sidebar />
        </Stack>
        <Popover
          sx={{ ml: '20px' }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          PaperProps={{
            elevation: 0,
            borderRadius: '5px',
            border: '1px solid #d3d3d3'
          }}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}>
          <List sx={{ width: '240px' }}>
            <ListItemButton onClick={() => setOpenProfileDialog(true)}>
              <ListItemIcon>
                <Person2Icon color="#d3d3d3" />
              </ListItemIcon>
              <ListItemText primary="Xem hồ sơ" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary="Sent mail" />
            </ListItemButton>
          </List>
        </Popover>
      </Box>
      <Box sx={{ overflowY: 'scroll', width: '100%' }}>
        <Outlet />
      </Box>
      <ProfileDialog
        open={openProfileDialog}
        onClose={() => setOpenProfileDialog(false)} />
    </Stack >
  );
};

export default DashboardLayout;
