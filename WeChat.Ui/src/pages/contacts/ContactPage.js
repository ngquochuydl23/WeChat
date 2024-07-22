import React, { Suspense, lazy, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    Icon,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import _ from "lodash";
import TranslateIcon from '@mui/icons-material/Translate';
import Scrollbars from "react-custom-scrollbars-2";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PeopleIcon from '@mui/icons-material/People';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { TabContext, TabPanel } from "@material-ui/lab";


const settingSidebarItems = [
    {
        id: 'my-profile',
        activeIcon: PersonIcon,
        inactiveIcon: PermIdentityIcon,
        title: "Danh sách bạn bè",
        tabComponent: lazy(() => import("../../sections/contact/ContactList")),
        enableBadge: false,
    },
    {
        id: 'privacy-and-security',
        activeIcon: PeopleIcon,
        inactiveIcon: PeopleAltOutlinedIcon,
        title: "Nhóm và cộng đồng",
        tabComponent: lazy(() => import("../../sections/contact/GroupList")),
        enableBadge: false,
    },
    {
        id: 'notifications',
        activeIcon: PersonAddIcon,
        inactiveIcon: PersonAddOutlinedIcon,
        title: "Lời mời kết bạn",
        tabComponent: lazy(() => import("../../sections/contact/ContactList")),
        enableBadge: true,
    }
]

const ContactPage = () => {
    const { user } = useSelector((state) => state.user);
    const [tabId, setTabId] = useState(settingSidebarItems[0].id);

    const getTabById = () => _.find(settingSidebarItems, x => x.id === tabId);


    return (
        <Box sx={{ height: '100vh' }}>
            <Stack direction="row" sx={{ height: '100%' }}>
                <Box
                    width="300px"
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

                            const active = (item.id === tabId);
                            if (item.parentId) {
                                return null;
                            }

                            return (
                                <Button
                                    size="medium"
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
                                        padding: '10px 10px',
                                        ...(active && {
                                            backgroundColor: 'rgba(7, 193, 96, 0.2)',
                                            color: 'rgba(7, 193, 96, 1)'
                                        }),
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                            color: 'rgba(7, 193, 96, 1)'
                                        },
                                        '&.MuiButton-endIcon': {
                                            marginLeft: 'auto',
                                            alignSelf: 'flex-end'
                                        }
                                    }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            width: '100%',
                                            textAlign: 'left',
                                            ...(active && {
                                                fontWeight: '600',
                                                color: 'rgba(7, 193, 96, 1)'
                                            }),
                                            fontWeight: '500'
                                        }}>
                                        {item.title}
                                    </Typography>
                                    {item.enableBadge &&
                                        <span>
                                            <Chip
                                                size="small"
                                                sx={{
                                                    height: '20px',
                                                    width: '20px',
                                                    color: 'white',
                                                    backgroundColor: '#07C160',
                                                    '.MuiChip-label': {
                                                        padding: 0,
                                                        fontSize: '12px'
                                                    },
                                                }}
                                                label={4} />
                                        </span>
                                    }
                                </Button>
                            )
                        })}
                    </Stack>
                </Box>
                <Box
                    flexDirection="column"
                    display="flex"
                    flex="1"
                    ml="2px"
                    bgcolor="white">
                    <Typography fontWeight="900" fontSize="24px" mt="20px" ml="20px">
                        {getTabById().title}
                    </Typography>
                    <Scrollbars style={{ width: '100%', height: '100%' }}>
                        <TabContext value={tabId}>
                            {_.map(settingSidebarItems, (item) => {
                                return (
                                    <TabPanel
                                        itemID={item.id}
                                        value={item.id}
                                        style={{ paddingLeft: 0, paddingRight: 0, paddingTop: '24px', paddingBottom: '24px', width: "100%" }}>
                                        <Suspense>
                                            <item.tabComponent onNavigate={setTabId} />
                                        </Suspense>
                                    </TabPanel>
                                )
                            })}
                        </TabContext>
                    </Scrollbars>
                </Box>
            </Stack>
        </Box>
    );
};

export default ContactPage;
