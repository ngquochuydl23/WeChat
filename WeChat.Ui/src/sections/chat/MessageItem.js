import {
    Typography,
    Stack,
    Avatar,
    Box,
    Chip,
    Tooltip,
    IconButton,
    Popover,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    ListItemIcon,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReplayIcon from "@mui/icons-material/Replay";
import { enqueueSnackbar } from "notistack";
import { filterMsgSystem } from "../../utils/fitlerMsg";
import { readUrl } from "../../utils/readUrl";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export const NotificationMessage = ({ user, content, members }) => {
    return (
        <Stack px="15px" py="10px" justifyContent="center" spacing="15px" direction="row">
            <Chip
                sx={{ fontSize: "12px", justifyContent: "flex-start", color: "rgb(1,98,196)", fontWeight: "600" }}
                avatar={
                    <Avatar
                        src={readUrl(user.avatar)}
                        alt={user.fullName} />
                }
                label={
                    <Typography fontSize="14px" fontWeight="600">
                        {user.fullName}
                        <span style={{ fontWeight: "400" }}>
                            {filterMsgSystem(content)}
                        </span>
                    </Typography>
                }
            />
        </Stack>
    );
};

const MsgContent = ({ type = "text", content, attachment, isRightMsg = false, sx }) => {
    return (
        <Stack sx={{ maxWidth: "700px" }} direction="column">
            {type === "image" && attachment && (
                <img
                    alt={attachment.fileName}
                    style={{
                        objectFit: "cover",
                        marginTop: "10px",
                        borderRadius: content ? "12px 12px 0px 0px " : "12px",
                        width: "200px",
                        height: "200px",
                        marginBottom: content ? "0px" : "10px",
                    }}
                    src={readUrl(attachment.url)} />
            )}
            {type === "file" && attachment && (
                <Stack
                    direction="row"
                    sx={{
                        height: '70px',
                        minWidth: '300px',
                        padding: "10px",
                        alignItems: 'center',
                        borderRadius: content ? '15px 15px 0px 0px ' : '10px',
                        marginBottom: content ? '0px' : '10px',
                    }}>
                    <Box
                        sx={{
                            marginLeft: "10px",
                            height: "40px",
                            width: "40px",
                            aspectRatio: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "200px"
                        }}>
                        <AttachFileIcon />
                    </Box>
                    <Box
                        onClick={() => window.location.assign(attachment.url)}
                        sx={{ width: "100%", marginX: "10px" }}>
                        <Typography fontWeight="700" fontSize="14px">
                            {attachment.fileName || "Không xác định"}
                        </Typography>
                        <Typography fontWeight="500" fontSize="14px">
                            {attachment.fileSize || "Không xác định"}
                        </Typography>
                    </Box>
                </Stack>
            )}
            {content && content.length > 0 && (
                <Stack
                    direction="column"
                    sx={{
                        border: '1px solid #EBE9ED',
                        paddingX: "10px",
                        paddingY: '7px',
                        borderRadius: (attachment) ? '0px 0px 12px 12px' : '20px',
                        backgroundColor: isRightMsg ? '#07C160' : "whitesmoke",
                        ...sx
                    }}>
                    <Typography
                        width="auto"
                        color={isRightMsg ? "white" : "black"}
                        fontWeight="500"
                        fontSize="15px"
                        variant="body1">
                        {content}
                    </Typography>
                    {/* <Typography alignSelf="flex-end" mt="5px" color="black" fontWeight="500" fontSize="12px" variant="body1">
                        {"20:54"}
                    </Typography> */}
                </Stack>
            )}
        </Stack>
    );
};

export const LeftMessage = ({ user, content, redeem = false, type = "text", attachment, sx }) => {
    return redeem ? (
        <Box
            sx={{
                display: "flex",
                alignSelf: "flex-end",
                marginInlineEnd: "15px",
                borderRadius: "15px",
                minWidth: "180px",
                maxWidth: "350px",
                justifyContent: "flex-end",
                border: "2px solid #d3d3d3",
                paddingX: "7px",
                paddingY: "7px",
                marginBottom: "10px",
            }}>
            <Typography color="black" fontWeight="500" fontStyle="italic" fontSize="15px" variant="body1">
                {user.fullName} đã thu hồi tin nhắn.
            </Typography>
        </Box>
    ) : (
        <MsgContent
            sx={{ borderRadius: '5px 20px 20px 5px', ...sx }}
            content={content}
            type={type}
            attachment={attachment} />
    );
};

export const RightMessage = ({
    sx,
    content,
    seen = false,
    sent = true,
    onRedeemMsg,
    msgId,
    redeem = false,
    type,
    attachment,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                enqueueSnackbar(`Sao chép vào clipboard thành công`, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                });

                handleClose();
            })
            .catch((error) => {
                console.error("Lỗi khi sao chép tin nhắn vào clipboard: ", error);
            });
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return redeem ? (
        <Box
            sx={{
                marginBottom: "10px",
                display: "flex",
                alignSelf: "flex-end",
                borderRadius: "15px",
                width: "180px",
                justifyContent: "flex-end",
                border: "2px solid #d3d3d3",
                paddingX: "7px",
                paddingY: "7px",
            }}>
            <Typography textAlign="center" color="black" fontWeight="500" fontStyle="italic" fontSize="15px" variant="body1">
                {"Bạn đã thu hồi tin nhắn"}
            </Typography>
        </Box>
    ) : (
        <Stack justifyContent="flex-end" spacing="15px" direction="row">
            {/* <IconButton
                size="small"
                sx={{ aspectRatio: 1 }}
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}>
                <MoreHorizIcon />
            </IconButton> */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}>
                <List>
                    <ListItemButton
                        onClick={() => {
                            copyToClipboard(content);
                        }}>
                        <ListItemIcon>
                            <ContentCopyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sao chép tin nhắn" />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={() => onRedeemMsg(msgId)}>
                        <ListItemIcon>
                            <ReplayIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Thu hồi tin nhắn" sx={{ color: "red" }} />
                    </ListItemButton>
                </List>
            </Popover>
            <MsgContent
                sx={{ borderRadius: '20px 5px 5px 20px', ...sx }}
                isRightMsg
                content={content}
                type={type}
                attachment={attachment} />
        </Stack>
    );
};
