import React, { Suspense, lazy, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { readUrl } from "@/utils/readUrl";
import { useSelector } from "react-redux";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import _ from "lodash";
import LockIcon from '@mui/icons-material/Lock';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { TabContext, TabPanel } from "@material-ui/lab";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Person2Icon from '@mui/icons-material/Person2';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';

const settingSidebarItems = [
    {
        id: 'my-profile',
        activeIcon: Person2Icon,
        inactiveIcon: Person2OutlinedIcon,
        title: "Thông tin cá nhân",
        tabComponent: lazy(() => import("./PersonalInfoTabContent"))
    },
    {
        id: 'privacy-and-security',
        activeIcon: LockIcon,
        inactiveIcon: LockOutlinedIcon,
        title: "Cài đặt quyền riêng tư",
        tabComponent: lazy(() => import("./PrivacyAndSecurityTabContent"))
    },
    {
        id: 'notifications',
        activeIcon: NotificationsIcon,
        inactiveIcon: NotificationsNoneIcon,
        title: "Tùy chỉnh thông báo",
        tabComponent: lazy(() => import("./NotificationTabContent"))
    }
]

const PersonalSettingDialog = ({ open, onClose }) => {
    const { user } = useSelector((state) => state.user);
    const [tabId, setTabId] = useState(settingSidebarItems[0].id);

    return (
        <Dialog
            disableBackdropClick={true}
            open={open}
            fullWidth
            maxWidth='lg'
            scroll={"body"}
            onClose={onClose}>
            <DialogContent
                sx={{ padding: 0, backgroundColor: '#f5f5f5' }}
                dividers>
                <Stack direction="row">
                    <Box
                        width="250px"
                        px="15px"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: 'white',
                            boxShadow: " 0px 0px 2px rgba(0, 0, 0, 0.25)",
                            height: '80vh'
                        }}>
                        <Typography
                            fontSize="20px"
                            fontWeight="900"
                            mb="10px"
                            px="10px"
                            py="15px">
                            Cài đặt
                        </Typography>
                        <Stack direction="column" spacing="10px">
                            {_.map(settingSidebarItems, (item) => {
                                const active = item.id === tabId;
                                return (
                                    <Button
                                        size="small"
                                        onClick={() => setTabId(item.id)}
                                        startIcon={active ? <item.activeIcon /> : <item.inactiveIcon />}
                                        disableElevation
                                        variant={active ? "contained" : 'text'}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            boxShadow: 0,
                                            borderRadius: '7px',
                                            height: '35px',
                                            color: 'gray',
                                            padding: '4px 10px',
                                            fontWeight: '500',
                                            ...(active && {
                                                fontWeight: '600',
                                                backgroundColor: 'rgba(7, 193, 96, 0.2)',
                                                color: 'rgba(7, 193, 96, 1)'
                                            }),
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                                color: 'rgba(7, 193, 96, 1)'
                                            }
                                        }}>
                                        {item.title}
                                    </Button>
                                )
                            })}
                        </Stack>
                    </Box>
                    <Stack
                        ml="2px"
                        bgcolor="#fff"
                        direction="column"
                        width="100%"
                        display="flex"
                        flexGrow="1"
                        flex="1">
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between">
                            <Typography mt="20px" ml="20px" fontWeight="900" fontSize="20px">
                                {_.find(settingSidebarItems, x => x.id === tabId).title}
                            </Typography>
                            <IconButton
                                sx={{ margin: '10px' }}
                                onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                        <TabContext value={tabId}>
                            {_.map(settingSidebarItems, (item) => {
                                return (
                                    <TabPanel value={item.id}>
                                        <Suspense>
                                            <item.tabComponent />
                                        </Suspense>
                                    </TabPanel>
                                )
                            })}
                        </TabContext>
                    </Stack>
                </Stack>


            </DialogContent>
        </Dialog >
    );
};

export default PersonalSettingDialog;
