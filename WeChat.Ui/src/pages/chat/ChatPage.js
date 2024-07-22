import { Stack, Divider } from "@mui/material";
import React, { useState } from "react";
import MenuRoomChat from "../../sections/chat/MenuRoomChat";
import Room from "../../sections/chat/Room";
import { useParams } from "react-router-dom";
import StartNewChat from "../../sections/chat/StartNewChat";
import MediaViewerDialog from "@/sections/chat/MediaViewerDialog";
import { Subject } from 'rxjs';


export const mediaViewerSubject = new Subject(null);

const Chats = () => {
    const { roomId } = useParams();
    const [openViewer, setOpenViewer] = useState(false);


    const onNext = (medias) => {
        setOpenViewer(Boolean(medias) && medias.length > 0);
    }

    mediaViewerSubject.subscribe({ next: onNext });


    return (
        <Stack direction="row" sx={{ height: '100%' }}>
            <MenuRoomChat />
            <Divider orientation="vertical" flexItem />
            {(Boolean(roomId)) ? <Room /> : <StartNewChat />}
            <MediaViewerDialog
                open={openViewer}
                onClose={() => mediaViewerSubject.next(null)} />
        </Stack>
    );
};

export default Chats;
