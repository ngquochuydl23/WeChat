import { Avatar, Box, List, ListItemButton, ListItemIcon, ListItemText, Popover, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { readUrl } from "@/utils/readUrl";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ProfileDialog from "@/sections/chat/ProfileDialog";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonalSettingDialog from "@/sections/settings/PersonalSettingDialog";
import { setLoading, setUser, stopLoading } from "@/redux/slices/userSlice";
import { getMyProfile } from "@/services/profileApiService";
import { useSnackbar } from "notistack";


const MainLayout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [openSettingDialog, setOpenSettingDialog] = useState({
        chooseTabId: null,
        open: false
    });
    const { enqueueSnackbar } = useSnackbar();

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

    useEffect(() => {
        dispatch(setLoading());
        getMyProfile()
            .then(res => {
                const { user } = res.result;
                dispatch(setUser(user));
                navigate("/chat");
            })
            .catch(err => {
                dispatch(setUser(null));
                enqueueSnackbar(`Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại`, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    },
                    preventDuplicate: true
                });
            })
            .finally(() => dispatch(stopLoading()))
    }, []);

    if (isLoading) {
        return <div>Loading</div>
    }

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
                                setOpenSettingDialog({ chooseTabId: null, open: true });
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
                user={user}
                owned={true}
                hideBackdrop={false}
                editProfileClick={() => {
                    setOpenProfileDialog(false);
                    setOpenSettingDialog({ chooseTabId: 'my-profile', open: true });
                }}
                open={openProfileDialog}
                onClose={() => setOpenProfileDialog(false)} />
            <PersonalSettingDialog
                chooseTabId={openSettingDialog.chooseTabId}
                open={openSettingDialog.open}
                onClose={() => setOpenSettingDialog({ chooseTabId: null, open: false })} />

        </Stack >
    );
};

export default MainLayout;
