import { readUrl } from "@/utils/readUrl";
import { Avatar, Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Popover, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';
import { unfriend } from "@/services/contactApiService";
import { filterRoomInfo } from "@/utils/filterRoomInfo";
import { useSelector } from "react-redux";

const GroupItem = ({ room }) => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const { title } = filterRoomInfo(user._id, room, room.users);

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


    }

    const doBlock = (event) => {
        event.stopPropagation();
    }

    return (
        <Stack
            onClick={() => navigate('/chat/' + room._id)}
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
                    sx={{
                        height: '45px',
                        width: '45px',
                        aspectRatio: 1,
                        border: '1px solid #d3d3d3',
                        ...((room.thumbnail) ? {
                            padding: 0,
                            border: '3px solid #d3d3d3'
                        } : {
                            padding: '7px',
                            backgroundColor: 'whitesmoke'
                        }),
                    }}
                    src={room.thumbnail ? readUrl(room.thumbnail) : require('@/assets/Illustration/no_thumbnail_room.png')} />
                <Box sx={{ width: '100%' }} ml="15px">
                    <Typography fontWeight="600" fontSize="15px" p="0px">
                        {title}
                    </Typography>
                    <Typography fontWeight="400" fontSize="13px" color="gray">
                        {room.memberCount} thành viên
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

export default GroupItem;