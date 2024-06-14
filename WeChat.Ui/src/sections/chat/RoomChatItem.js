import { Box, Typography, Stack, Chip, AvatarGroup, Popover, List, ListItemButton, ListItemIcon, ListItemText, Icon, } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { filterChatTime } from "../../utils/chatTimeUtil";
import { filterMsgSystem } from "../../utils/fitlerMsg";
import PhotoIcon from '@mui/icons-material/Photo';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { readUrl } from "@/utils/readUrl";
import Lottie from "react-lottie";
import typingAnimation from '../../lotties/typing-lotties.json';
import { useState } from "react";
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import IcPinRoom from "@/assets/icons/IcPinRoom";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const RoomChatItem = ({
    _id,
    lastMsg,
    title,
    avatar,
    members,
    onClick,
    unreadMsgCount = 0,
    typing,
    onDeletedMsg
}) => {

    const param = useParams();
    const { user } = useSelector((state) => state.user);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const onContextMenu = (event) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    }

    const muteRoom = () => {

    }

    const pinRoom = () => {

    }

    const deleteMsgInRoom = () => {
        setAnchorEl(null);
        if (true) {
            onDeletedMsg();
        }
    }

    const fitlerLastMsgContent = () => {
        if (lastMsg.type === 'text') {
            return (
                <Typography
                    textOverflow="ellipsis"
                    sx={{
                        fontWeight: "500",
                        color: '#696969',
                        ...((lastMsg.creatorId !== user._id && unreadMsgCount > 0) && {
                            fontWeight: "600",
                            color: '#000',
                        }),
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                    }}
                    fontSize="14px"
                    variant="body1">
                    {lastMsg.creatorId === user._id && "Bạn: "} {lastMsg.content}
                </Typography>
            )
        } else if (lastMsg.type === 'image') {
            return (
                <Typography
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyItems: 'center',
                        fontWeight: "500",
                        color: '#696969',
                    }}
                    fontSize="14px"
                    variant="body1">
                    {lastMsg.creatorId === user._id && "Bạn:  "} <PhotoIcon sx={{ color: '#d9d9d9', mr: '5px' }} /> Hình ảnh
                </Typography>
            )
        } else if (lastMsg.type === 'file') {
            return (
                <Typography
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyItems: 'center',
                        fontWeight: "500",
                        color: '#696969',
                    }}
                    fontSize="14px"
                    variant="body1">
                    {lastMsg.creatorId === user._id && "Bạn:  "} <FolderOpenIcon sx={{ color: '#d9d9d9', mr: '5px' }} /> tập tin
                </Typography>
            )
        }

        const creator = members.find(x => x._id === lastMsg.creatorId);
        return (
            <Typography
                textOverflow="ellipsis"
                sx={{
                    fontWeight: "500", color: '#696969',
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                }}
                fontSize="14px"
                variant="body1">
                {creator._id === user._id ? "Bạn" : creator.fullName} {filterMsgSystem(lastMsg.content, members)}
            </Typography>
        )
    }

    return (
        <Stack
            component={Link}
            to={"/chat/" + _id}
            onClick={onClick}
            onContextMenu={onContextMenu}
            px="15px"
            py="10px"
            spacing="15px"
            direction="row"
            sx={{
                textDecoration: 'none',
                width: '100%',
                '&:hover': {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                },
                ...((param.roomId === _id) && {
                    backgroundColor: "rgb(1, 98, 196, 0.1)",
                    '&:hover': {
                        backgroundColor: "rgb(1, 98, 196, 0.1)",
                    },
                })
            }}>
            <Avatar
                sx={{ height: '50px', width: '50px', aspectRatio: 1 }}
                alt={title}
                src={readUrl(avatar)} />
            <Box sx={{ width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', overflow: 'none' }}>
                    <Typography
                        sx={{
                            color: 'black',
                            fontSize: "15px",
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        variant="subtitle1">
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: 'right',
                            color: 'gray',
                            fontWeight: '500',
                            fontSize: "12px",
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        }}>
                        {filterChatTime(lastMsg.createdAt)}
                    </Typography>
                </Stack>
                {(!typing)
                    ? <Stack sx={{ width: '100%' }} justifyContent="space-between" spacing="10px" direction="row">
                        {fitlerLastMsgContent()}
                        {(Boolean(unreadMsgCount) && unreadMsgCount > 0 && lastMsg.creatorId !== user._id) &&
                            <Chip
                                size="small"
                                sx={{
                                    color: 'white',
                                    backgroundColor: '#07C160',
                                    // aspectRatio: 1,
                                    '.MuiChip-label': {
                                        //fontSize: '9px'
                                    }
                                }}
                                label={unreadMsgCount} />
                        }
                        {(lastMsg.creatorId === user._id && lastMsg.seenBys) &&
                            <AvatarGroup max={4} sx={{ height: '20px' }}>
                                {(lastMsg.seenBys.filter(x => x !== user._id))
                                    .map(id => {
                                        const seenBy = members.find(mem => mem._id === id);
                                        return (
                                            <Avatar
                                                key={id}
                                                alt={seenBy?.fullName}
                                                sx={{ width: "20px", height: "20px" }}
                                                src={readUrl(seenBy?.avatar)} />
                                        )
                                    })}
                            </AvatarGroup>

                        }
                    </Stack>
                    : <Box sx={{ height: '20px', width: '40px', backgroundColor: 'whitesmoke', borderRadius: '20px' }}>
                        <Lottie
                            options={{
                                loop: true,
                                autoplay: true,
                                animationData: typingAnimation,
                                rendererSettings: { preserveAspectRatio: "xMidYMid slice" }
                            }}
                            height={"100%"}
                            width={"100%"}
                        />
                    </Box>
                }
            </Box>
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
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'center', horizontal: 'center' }}>
                <List sx={{ width: '200px' }}>
                    <ListItemButton
                        onClick={() => {

                            setAnchorEl(null);
                        }}>
                        <ListItemIcon sx={{ minWidth: '34px' }}>
                            <IcPinRoom />
                        </ListItemIcon>
                        <ListItemText
                            primary="Ghim hội thoại"
                            primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }} />
                    </ListItemButton>
                    <ListItemButton
                        onClick={() => {

                            setAnchorEl(null);
                        }}>
                        <ListItemIcon sx={{ minWidth: '34px' }}>
                            <VolumeMuteRoundedIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Tắt thông báo"
                            primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }} />
                    </ListItemButton>
                    <ListItemButton
                        onClick={deleteMsgInRoom}>
                        <ListItemIcon sx={{ minWidth: '34px', color: 'red' }}>
                            <DeleteOutlineOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="Xóa đoạn chat"
                            primaryTypographyProps={{ fontSize: '14px', fontWeight: '500', color: 'red' }} />
                    </ListItemButton>
                </List>
            </Popover>
        </Stack>
    )
}

export default RoomChatItem;