import { Box, Typography, Stack, IconButton, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CreateGroupChatDialog from "./CreateGroupChatDialog";
import _ from "lodash";
import RoomChatItem from "./RoomChatItem";
import { useState } from "react";
import { filterRoomInfo } from "../../utils/filterRoomInfo";
import ReactSearchBox from "react-search-box";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Scrollbars from "react-custom-scrollbars-2";
import UserSkeleton from "@/components/UserSkeleton";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

const MenuRoomChat = ({ rooms, onCreateGroupChat }) => {

  const { user } = useSelector((state) => state.user);
  const [timer, setTimer] = useState();
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState({
    contacts: [],
    conversation: []
  });

  const [openCreateGroupChat, setOpenCreateGroupChat] = useState(false);


  const doSearch = (value) => {
    console.log(value);
  }

  const onChange = (value) => {
    setSearching(value.length > 0);
    setSearch(value);
    clearTimeout(timer);
    setTimer(setTimeout(() => doSearch(value), 1000));
  }

  return (
    <Stack
      sx={{
        overflowX: "hidden",
        overflowY: "hidden",
        height: "100vh",
        width: "500px",
      }}>
      <Stack direction="row" sx={{ paddingX: "15px", paddingY: "10px" }}>
        <Box sx={{ width: "100%" }}>
          <Typography fontWeight="1000" fontSize="bold" variant="h4">
            {`Tin nhắn`}
          </Typography>
        </Box>
        <IconButton size="medium" onClick={() => setOpenCreateGroupChat(true)}>
          <PersonAddAltOutlinedIcon />
        </IconButton>
        <IconButton size="medium" onClick={() => setOpenCreateGroupChat(true)}>
          <DriveFileRenameOutlineIcon />
        </IconButton>
      </Stack>
      <Box px="15px">
        <ReactSearchBox
          clearOnSelect
          autoFocus={false}
          iconBoxSize="40px"
          leftIcon={
            <Box
              pt="5px"
              color="#d3d3d3"
              justifyContent="center"
              alignItems="center">
              <SearchTwoToneIcon />
            </Box>
          }
          placeholder="Tìm kiếm"
          value={search}
          onChange={onChange}
        />
      </Box>
      {search.length > 0
        ? <Stack
          sx={{
            height: "100%",
            overflowY: searching ? "none" : "scroll"
          }}>
          {searching
            ? <Stack
              spacing="15px"
              direction="column"
              pt="20px"
              px="20px"
              sx={{ width: '100%' }}>
              <UserSkeleton />
              <UserSkeleton />
              <UserSkeleton />
            </Stack>
            : <Box>
              {(result.contacts && result.contacts.length > 0) &&
                <Box>
                  Contacts
                </Box>
              }
            </Box>
          }
        </Stack>
        : <Scrollbars style={{ width: '100%', height: '100%' }}>
          {_.map(rooms, (roomItem) => (
            <RoomChatItem
              {...roomItem}
              {...filterRoomInfo(user._id, roomItem, roomItem.users)}
              members={roomItem.users}
              loggingUserId={user._id}
            />
          ))}
        </Scrollbars>

      }
      <CreateGroupChatDialog
        open={openCreateGroupChat}
        onClose={() => setOpenCreateGroupChat(false)}
        onCreateGroupChat={onCreateGroupChat}
      />
    </Stack>
  );
};

export default MenuRoomChat;
