import React, { Suspense, lazy, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Icon,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import _ from "lodash";
import LockIcon from '@mui/icons-material/Lock';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { TabContext, TabPanel } from "@material-ui/lab";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Person2Icon from '@mui/icons-material/Person2';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import TranslateIcon from '@mui/icons-material/Translate';
import DevicesIcon from '@mui/icons-material/Devices';
import Scrollbars from "react-custom-scrollbars-2";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const settingSidebarItems = [
    {
        id: 'my-profile',
        activeIcon: Person2Icon,
        inactiveIcon: Person2OutlinedIcon,
        title: "Thông tin cá nhân",
        tabComponent: lazy(() => import("./PersonalInfoTabContent")),
        parentId: null,
    },
    {
        id: 'privacy-and-security',
        activeIcon: LockIcon,
        inactiveIcon: LockOutlinedIcon,
        title: "Cài đặt quyền riêng tư",
        tabComponent: lazy(() => import("./PrivacyAndSecurityTabContent")),
        parentId: null,
    },
    {
        id: 'notifications',
        activeIcon: NotificationsIcon,
        inactiveIcon: NotificationsNoneIcon,
        title: "Tùy chỉnh thông báo",
        tabComponent: lazy(() => import("./NotificationTabContent")),
        parentId: null,
    },
    {
        id: 'language-setting',
        activeIcon: TranslateIcon,
        inactiveIcon: TranslateIcon,
        title: "Cài đặt ngôn ngữ",
        tabComponent: lazy(() => import("./LanguageSettingTabContent")),
        parentId: null,
    },
    {
        id: 'device-management',
        activeIcon: DevicesIcon,
        inactiveIcon: DevicesIcon,
        title: "Quản lí thiết bị",
        tabComponent: lazy(() => import("./DeviceManagementTabContent")),
        parentId: null,
    },
    {
        id: 'block-users',
        title: "Danh sách chặn",
        tabComponent: lazy(() => import("./BlockUserTabContent")),
        parentId: 'privacy-and-security',
    }
]

const PersonalSettingDialog = ({ chooseTabId, open, onClose }) => {
    const { user } = useSelector((state) => state.user);
    const [tabId, setTabId] = useState(chooseTabId || settingSidebarItems[0].id);

    const getTabById = () => _.find(settingSidebarItems, x => x.id === tabId);

    return (
        <Dialog
            disableBackdropClick={true}
            open={open}
            fullWidth
            maxWidth='md'
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
                            minHeight: '80vh',
                            height: '100%'
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

                                const active = (item.id === tabId) || (item.id === getTabById(tabId).parentId);
                                if (item.parentId) {
                                    return null;
                                }

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
                            <Stack direction="row" mt="20px" ml="20px" alignItems="center">
                                {getTabById().parentId &&
                                    <IconButton
                                        sx={{ height: '40px', width: '40px', marginRight: '15px' }}
                                        onClick={() => setTabId(getTabById().parentId)}>
                                        <ArrowBackIcon />
                                    </IconButton>
                                }
                                <Typography fontWeight="900" fontSize="20px">
                                    {getTabById().title}
                                </Typography>
                            </Stack>
                            <IconButton
                                sx={{ margin: '10px' }}
                                onClick={onClose}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                        <Scrollbars style={{ width: '100%', height: '100%' }}>
                            <TabContext value={tabId} >
                                {_.map(settingSidebarItems, (item) => {
                                    return (
                                        <TabPanel
                                            itemID={item.id}
                                            value={item.id}
                                            style={{ paddingLeft: 0, paddingRight: 0, paddingTop: '24px', paddingBottom: '24px' }}>
                                            <Suspense>
                                                <item.tabComponent onNavigate={setTabId} />
                                            </Suspense>
                                        </TabPanel>
                                    )
                                })}
                            </TabContext>
                        </Scrollbars>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog >
    );
};

export default PersonalSettingDialog;
