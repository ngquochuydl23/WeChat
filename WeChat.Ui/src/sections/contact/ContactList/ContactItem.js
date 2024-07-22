import { readUrl } from "@/utils/readUrl";
import { Avatar, Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Popover, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';
import { unfriend } from "@/services/contactApiService";

const ContactItem = ({ contactId, user, onDoneUnfriend }) => {

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const viewProfile = (event) => {
        event.stopPropagation();
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const doUnfriend = (event) => {
        event.stopPropagation();

        unfriend(contactId)
            .then(({ msg }) => {
                console.log(msg);
                onDoneUnfriend(contactId);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const doBlock = (event) => {
        event.stopPropagation();
    }

    return (
        <Stack
            //onClick={() => navigate('/chat/666e73486a05bacb3157dc36')}
            onClick={viewProfile}
            direction="row"
            py="5px"
            sx={{
                width: '100%',
                mx: '15px',
                px: '10px',
                '&:hover': {
                    backgroundColor: 'whitesmoke',
                    borderRadius: '15px'
                }
            }}>
            <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
                <Avatar
                    sx={{ width: '45px', height: '45px', border: '3px solid #d3d3d3' }}
                    alt="contact.avatar"
                    src={readUrl(user.avatar)} />
                <Box sx={{ width: '100%' }} ml="15px">
                    <Typography fontWeight="600" fontSize="15px" p="0px">
                        {user.fullName}
                    </Typography>
                    <Typography fontWeight="400" fontSize="13px" color="gray">
                        @{user.userName}
                    </Typography>
                </Box>
            </Stack>
            <IconButton
                size="small"
                sx={{ width: '40px', heigth: '40px' }}
                onClick={handleClick}>
                <MoreHorizIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                sx={{
                    ml: '20px',
                    '.MuiPopover-paper': {
                        borderRadius: '5px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.16) ,0 0px 4px rgba(0, 0, 0, 0.05)'
                    }
                }}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <List sx={{ width: '150px' }}>
                    <ListItemButton
                        onClick={viewProfile}
                        sx={{ height: '35px' }}>
                        <ListItemText
                            primary="Xem hồ sơ"
                            primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }} />
                    </ListItemButton>
                    <ListItemButton
                       // onClick={doBlock}
                        sx={{ height: '35px' }}>
                        <ListItemText
                            primary="Nhắn tin"
                            primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }} />
                    </ListItemButton>
                    <ListItemButton
                        onClick={doBlock}
                        sx={{ height: '35px' }}>
                        <ListItemText
                            primary="Chặn"
                            primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }} />
                    </ListItemButton>
                    <ListItemButton
                        onClick={doUnfriend}
                        sx={{ height: '35px' }}>
                        <ListItemText
                            primary="Xóa bạn"
                            primaryTypographyProps={{ fontSize: '14px', fontWeight: '500', color: 'red' }} />
                    </ListItemButton>
                </List>
            </Popover>
        </Stack>
    )
}

export default ContactItem;