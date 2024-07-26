import { Box, Typography, Stack, Chip, AvatarGroup, Popover, List, ListItemButton, ListItemIcon, ListItemText, Icon, SvgIcon, } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { filterChatTime } from "../../utils/chatTimeUtil";
import { filterMsgSystem } from "../../utils/filterMsg";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { readUrl } from "@/utils/readUrl";
import Lottie from "react-lottie";
import typingAnimation from '../../lotties/typing-lotties.json';
import { useState } from "react";
import IcPinRoom from "@/assets/icons/IcPinRoom";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { leaveRoom, pinRoom, removePinRoom } from "@/services/roomApiService";
import IcPicture from "@/assets/icons/IcPicture";
import IcRoomMute from "@/assets/icons/IcRoomMute";
import IcPinRoomFilled from "@/assets/icons/IcPinRoomFilled";
import IcUnpinRoom from "@/assets/icons/IcUnpinRoom";

const RoomChatItem = ({
    _id,
    lastMsg,
    title,
    avatar,
    singleRoom,
    members,
    onClick,
    unreadMsgCount,
    typing,
    onDeletedMsg,
    onLeavedRoom,
    userConfig
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

    const getCreatorLastMsg = () => {
        return members?.find(mem => mem._id === lastMsg.creatorId);
    }

    const muteRoom = () => {

    }

    const doPinRoom = () => {
        setAnchorEl(null);
        pinRoom(_id)
            .then(({ result }) => {
                console.log(result.msg);
            })
            .catch((err) => console.log(err))
    }

    const doRemovePinRoom = () => {
        setAnchorEl(null);
        removePinRoom(_id)
            .then(({ result }) => {
                console.log(result.msg);
            })
            .catch((err) => console.log(err))
    }

    const leaveRoomChat = () => {
        setAnchorEl(null);
        leaveRoom(_id)
            .then(({ result }) => {
                console.log(result.msg);
                onLeavedRoom();
            })
            .catch((err) => console.log(err))
    }

    const deleteMsgInRoom = () => {
        setAnchorEl(null);
        if (true) {
            onDeletedMsg();
        }
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
                overflow: 'hidden',
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
                sx={{
                    height: '50px',
                    width: '50px',
                    aspectRatio: 1,
                    border: '1px solid #d3d3d3',
                    ...((avatar) ? {
                        padding: 0
                    } : {
                        padding: '7px',
                        backgroundColor: 'whitesmoke'
                    }),
                }}
                alt={title}
                src={avatar ? readUrl(avatar) : require('@/assets/Illustration/no_thumbnail_room.png')} />
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
                <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', overflow: 'hidden' }}>
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
                    ? <Stack
                        flex="1"
                        overflow="hidden"
                        flexDirection="row"
                        spacing="10px"
                        direction="row">
                        <Stack
                            width="100%"
                            direction="row"
                            textOverflow="ellipsis"
                            sx={{
                                fontWeight: "500",
                                wordWrap: "break-word",
                                overflowWrap: 'break-word',
                                color: '#696969',
                                ...((lastMsg.creatorId !== user._id && unreadMsgCount > 0) && {
                                    fontWeight: "600",
                                    color: '#000',
                                }),
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "flex",
                                flex: 1,
                                lineClamp: "1",
                                WebkitLineClamp: "1",
                                WebkitBoxOrient: "vertical",
                            }}
                            fontSize="14px"
                            variant="body1">
                            <p style={{ marginRight: '2.5px', display: 'flex', marginBlockStart: 0, marginBlockEnd: 0 }}>
                                {lastMsg.creatorId === user._id
                                    ? (lastMsg.type !== 'system-notification' ? `Bạn: ` : 'Bạn ')
                                    : (singleRoom ? "" : getCreatorLastMsg()?.firstName + (lastMsg.type !== 'system-notification' ? ": " : " "))
                                }
                            </p>
                            {lastMsg.type === 'text' &&
                                <Typography
                                    display="flex"
                                    flex="1"
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        fontWeight: "500",
                                        wordWrap: "break-word",
                                        overflowWrap: 'break-word',
                                        color: '#696969',
                                        ...((lastMsg.creatorId !== user._id && unreadMsgCount > 0) && {
                                            fontWeight: "600",
                                            color: '#000',
                                        }),
                                        lineClamp: "1",
                                        WebkitLineClamp: "1",
                                        WebkitBoxOrient: "vertical",
                                    }}
                                    fontSize="14px"
                                    variant="body1">
                                    {lastMsg.content}
                                </Typography>
                            }
                            {lastMsg.type === 'image' &&
                                <Stack direction="row">
                                    <IcPicture sx={{ color: '#d9d9d9', mr: '5px', width: '20px', height: '20px' }} />
                                    <Typography
                                        sx={{
                                            fontWeight: "500",
                                            color: '#696969',
                                            ...((lastMsg.creatorId !== user._id && unreadMsgCount > 0) && {
                                                fontWeight: "600",
                                                color: '#000',
                                            }),
                                        }}
                                        fontSize="14px"
                                        variant="body1">
                                        hình ảnh
                                    </Typography>
                                </Stack>
                            }
                            {lastMsg.type === 'file' &&
                                <Stack direction="row">
                                    <FolderOpenIcon sx={{ color: '#d9d9d9', mr: '5px' }} />
                                    <Typography
                                        sx={{
                                            fontWeight: "500",
                                            color: '#696969',
                                            ...((lastMsg.creatorId !== user._id && unreadMsgCount > 0) && {
                                                fontWeight: "600",
                                                color: '#000',
                                            }),
                                        }}
                                        fontSize="14px"
                                        variant="body1">
                                        Tập tin
                                    </Typography>
                                </Stack>
                            }
                            {lastMsg.type === 'system-notification' &&
                                <Typography
                                    width="100%"
                                    textOverflow="ellipsis"
                                    sx={{
                                        fontWeight: "500",
                                        wordWrap: "break-word",
                                        overflowWrap: 'break-word',
                                        color: '#696969',
                                        ...((lastMsg.creatorId !== user._id && unreadMsgCount > 0) && {
                                            fontWeight: "600",
                                            color: '#000',
                                        }),
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "flex",
                                        flex: 1,
                                        lineClamp: "1",
                                        WebkitLineClamp: "1",
                                        WebkitBoxOrient: "vertical",
                                    }}
                                    fontSize="14px"
                                    variant="body1">
                                    {filterMsgSystem(lastMsg.content, members)}
                                </Typography>
                            }
                        </Stack>
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
                        {userConfig.pinned &&
                            <IcPinRoomFilled />
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
            </Box >
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
                    {userConfig.pinned
                        ? <ListItemButton
                            sx={{ height: '35px' }}
                            onClick={doRemovePinRoom}>
                            <ListItemIcon sx={{ minWidth: '34px' }}>
                                <IcUnpinRoom />
                            </ListItemIcon>
                            <ListItemText
                                primary="Bỏ ghim hội thoại"
                                primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }} />
                        </ListItemButton>
                        : <ListItemButton
                            sx={{ height: '35px' }}
                            onClick={doPinRoom}>
                            <ListItemIcon sx={{ minWidth: '34px' }}>
                                <IcPinRoom />
                            </ListItemIcon>
                            <ListItemText
                                primary="Ghim hội thoại"
                                primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }} />
                        </ListItemButton>
                    }
                    <ListItemButton
                        sx={{ height: '35px' }}
                        onClick={() => {

                            setAnchorEl(null);
                        }}>
                        <ListItemIcon sx={{ minWidth: '34px', color: 'gray' }}>
                            <IcRoomMute />
                        </ListItemIcon>
                        <ListItemText
                            primary="Tắt thông báo"
                            primaryTypographyProps={{ fontSize: '14px', fontWeight: '500' }} />
                    </ListItemButton>
                    {!singleRoom &&
                        <ListItemButton
                            sx={{ height: '35px' }}
                            onClick={leaveRoomChat}>
                            <ListItemIcon sx={{ minWidth: '34px', color: 'red' }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Rời nhóm"
                                primaryTypographyProps={{ fontSize: '14px', fontWeight: '500', color: 'red' }} />
                        </ListItemButton>
                    }
                    <ListItemButton
                        sx={{ height: '35px' }}
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
        </Stack >
    )
}

export default RoomChatItem;