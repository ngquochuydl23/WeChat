import { Box, Typography, Stack, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CreateGroupChatDialog from "./CreateGroupChatDialog";
import _ from "lodash";
import RoomChatItem from "./RoomChatItem";
import { useState } from "react";
import { filterRoomInfo } from "../../utils/filterRoomInfo";
import FindRoomChat from "../../dialog/FindRoomChat";

const MenuRoomChat = ({ rooms, onCreateGroupChat }) => {
  const { user } = useSelector((state) => state.user);
  const [openFindRoom, setOpenFindRoom] = useState(false);
  const [openCreateGroupChat, setOpenCreateGroupChat] = useState(false);

  return (
    <Stack
      sx={{
        overflowX: "hidden",
        overflowY: "hidden",
        height: "100vh",
        width: "500px",
      }}
    >
      <Stack direction="row" sx={{ paddingX: "15px", paddingY: "10px" }}>
        <Box sx={{ width: "100%" }}>
          <Typography fontWeight="1000" fontSize="bold" variant="h4">
            {`Tin nhắn`}
          </Typography>
        </Box>
        <IconButton size="medium" onClick={() => setOpenFindRoom(true)}>
          <PersonSearchIcon />
        </IconButton>
        <IconButton size="medium" onClick={() => setOpenCreateGroupChat(true)}>
          <DriveFileRenameOutlineIcon />
        </IconButton>
      </Stack>
      <Stack sx={{ height: "100%", overflowY: "scroll" }}>
        {_.map(rooms, (roomItem) => (
          <RoomChatItem
            {...roomItem}
            {...filterRoomInfo(user._id, roomItem, roomItem.users)}
            members={roomItem.users}
            loggingUserId={user._id}
          />
        ))}
      </Stack>
      <CreateGroupChatDialog
        open={openCreateGroupChat}
        onClose={() => setOpenCreateGroupChat(false)}
        onCreateGroupChat={onCreateGroupChat}
      />

      <FindRoomChat open={openFindRoom} onClose={() => setOpenFindRoom(false)}/>
    </Stack>
  );
};

export default MenuRoomChat;
