import { Box, Typography, Avatar, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AddMemberDialog from "./AddMemberDialog";
import { filterRoomInfo } from "../../utils/filterRoomInfo";
import { readUrl } from "@/utils/readUrl";

const RoomDetail = ({
    room,
    members,
    loggingUserId,
    onDispersedRoom,
    onAddMember
}) => {
    const info = filterRoomInfo(loggingUserId, room, members);
    const [open, setOpen] = useState(false);

    return (
        <Box sx={{ width: "350px", height: "100%", display: "flex", flexDirection: "column" }} >
            <Box
                py="30px"
                sx={{ width: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }} >
                <Avatar
                    sx={{ width: "120px", height: "120px" }}
                    alt={info.title}
                    src={readUrl(info.avatar)}
                />
                {room.singleRoom ? (
                    <Box sx={{ width: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                        <Typography mt="20px" fontSize="18px" fontWeight="800">{info.title}</Typography>
                        <Typography mt="20px" fontSize="16px" fontWeight="500">{info.email}</Typography>
                        <Typography mt={"5px"} fontSize="16px" fontWeight="500">{info.phoneNumber}</Typography>
                    </Box>
                ) : (
                    <Box sx={{ width: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                        <Typography mt="20px" fontSize="18px" fontWeight="800">{info.title} </Typography>
                        <Typography mt="10px" fontSize="16px" fontWeight="500">
                            {info.subtitle}
                            {!room.singleRoom &&
                                <IconButton onClick={() => setOpen(true)}>
                                    <PersonAddAltOutlinedIcon />
                                </IconButton>
                            }
                        </Typography>
                    </Box>
                )}
                {room.singleRoom && (
                    <Button sx={{ marginTop: "20px" }} variant="contained">
                        Xem trang cá nhân
                    </Button>
                )}
            </Box>
            <Box sx={{ display: "flex", flex: 1, flexGrow: 1 }}>
            </Box>
            {(loggingUserId === room.creatorId && !room.singleRoom) && (
                <Button
                    sx={{ marginX: "15px", marginY: "10px" }}
                    onClick={() => onDispersedRoom(room._id)}
                    color="error"
                    variant="contained">
                    Giải tán nhóm
                </Button>
            )}
            {!room.singleRoom &&
                <AddMemberDialog
                    room={room}
                    members={members}
                    open={open}
                    addMemberToRoom={onAddMember}
                    onClose={() => setOpen(false)}
                />
            }
        </Box>
    );
};

export default RoomDetail;
