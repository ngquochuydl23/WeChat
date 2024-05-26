import { Avatar, Box, List, ListItemButton, ListItemIcon, ListItemText, Popover, Stack } from "@mui/material";
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { readUrl } from "@/utils/readUrl";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ProfileDialog from "@/sections/chat/ProfileDialog";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonalSettingDialog from "@/sections/settings/PersonalSettingDialog";


const MainLayout = () => {
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openSettingDialog, setOpenSettingDialog] = useState(false);


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
          height: '100vh'
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
          sx={{
            ml: '20px',
            '.MuiPopover-paper': {
              borderRadius: '5px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.16) ,0 0px 4px rgba(0, 0, 0, 0.05)'
            }
          }}
          id={id}
          open={open}
          anchorEl={anchorEl}
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
            <ListItemButton
              onClick={() => {
                setOpenProfileDialog(true);
                setAnchorEl(null);
              }}>
              <ListItemIcon>
                <Person2OutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Xem hồ sơ"
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: '500'
                }} />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setOpenSettingDialog(true);
                setAnchorEl(null);
              }}>
              <ListItemIcon>
                <SettingsOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Cài đặt"
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: '500'
                }} />
            </ListItemButton>
          </List>
        </Popover>
      </Box>
      <Box sx={{ width: '100%', height: '100vh' }}>
        <Outlet />
      </Box>
      <ProfileDialog
        open={openProfileDialog}
        onClose={() => setOpenProfileDialog(false)} />
      <PersonalSettingDialog
        open={openSettingDialog}
        onClose={() => setOpenSettingDialog(false)} />
    </Stack >
  );
};

export default MainLayout;
