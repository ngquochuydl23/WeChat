import { Stack, Divider } from "@mui/material";
import React from "react";
import MenuRoomChat from "../../sections/chat/MenuRoomChat";
import Room from "../../sections/chat/Room";
import { useParams } from "react-router-dom";
import StartNewChat from "../../sections/chat/StartNewChat";
import MediaViewerDialog from "@/sections/chat/MediaViewerDialog";

const Chats = () => {
    const { roomId } = useParams();
    return (
        <Stack direction="row" sx={{ height: '100%' }}>
            <MenuRoomChat />
            <Divider orientation="vertical" flexItem />
            {(Boolean(roomId)) ? <Room /> : <StartNewChat />}
            {/* <MediaViewerDialog
                open={true} /> */}
        </Stack>
    );
};

export default Chats;
