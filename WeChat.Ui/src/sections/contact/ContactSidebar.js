import { Box, Typography, Stack, IconButton, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import _ from "lodash";
import { useEffect, useState } from "react";
import { filterRoomInfo } from "../../utils/filterRoomInfo";
import ReactSearchBox from "react-search-box";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';




const ContactSidebar = () => {
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);

    


    useEffect(() => {
        setLoading(true);
        
    }, [])

    return (
        <Stack
            sx={{ overflowX: "hidden", overflowY: "hidden", height: "100vh", width: "500px" }}>
            <Stack direction="row" sx={{ paddingX: "15px", paddingY: "10px" }}>
                <Box sx={{ width: "100%" }}>
                    <Typography fontWeight="1000" fontSize="bold" variant="h4">
                        {`Danh bạ`}
                    </Typography>
                </Box>
                {/* <IconButton size="medium" onClick={() => setOpenFindUserDialog(true)}>
                    <PersonAddAltOutlinedIcon />
                </IconButton>
                <IconButton size="medium" onClick={() => setOpenCreateGroupChat(true)}>
                    <DriveFileRenameOutlineIcon />
                </IconButton> */}
            </Stack>
            <Box px="15px">
                <ReactSearchBox
                    clearOnSelect
                    autoFocus={false}
                    iconBoxSize="40px"
                    data={[]}
                    leftIcon={
                        <Box pt="5px" color="#d3d3d3" justifyContent="center" alignItems="center">
                            <SearchTwoToneIcon />
                        </Box>
                    }
                    placeholder="Tìm kiếm"
                    // value={search}
                    // onChange={onChange}
                />
            </Box>
            {/* {search.length > 0
                ? <Stack sx={{ height: "100%", overflowY: "none" }}>
                    {searching
                        ? <Stack spacing="15px" direction="column" pt="10px" px="20px" sx={{ width: '100%' }}>
                            <UserSkeleton />
                            <UserSkeleton />
                            <UserSkeleton />
                        </Stack>
                        : <Box height="100%">
                            {(searchResult.roomSearchings && searchResult.roomSearchings.length > 0) &&
                                <Box height="100%">
                                    <Typography mt="10px" ml="15px" color="black" fontWeight="600" fontSize="16px">
                                        Liên hệ
                                    </Typography>
                                    <Scrollbars autoHide>
                                        {_.map(searchResult.roomSearchings, (roomItem) => (
                                            <RoomChatItem
                                                unreadMsg={1}
                                                {...roomItem}
                                                {...filterRoomInfo(user._id, roomItem, roomItem.users)}
                                                members={roomItem.users}
                                                loggingUserId={user._id}
                                                onClick={() => setSearchResult({ roomSearchings: [], conversation: [] })}
                                            />
                                        ))}
                                    </Scrollbars>
                                </Box>
                            }
                        </Box>
                    }
                </Stack>
                : (loading && !socket.connected)
                    ? <Box>
                        Loading
                    </Box>
                    : <Scrollbars autoHide style={{ width: '100%', height: '100%', marginTop: '10px' }}>
                        {_.map(rooms, (roomItem) => (
                            <RoomChatItem
                                unreadMsg={roomItem.unreadMsg || 0}
                                {...roomItem}
                                {...filterRoomInfo(user._id, roomItem, roomItem.users)}
                                members={roomItem.users}
                                loggingUserId={user._id}
                                onLeavedRoom={() => setRooms(preState => preState.filter(x => x._id !== roomItem._id))}
                                typing={roomItem.typing}
                                onDeletedMsg={() => {

                                }}
                            />
                        ))}
                    </Scrollbars>
            } */}
        </Stack>
    );
};

export default ContactSidebar;
