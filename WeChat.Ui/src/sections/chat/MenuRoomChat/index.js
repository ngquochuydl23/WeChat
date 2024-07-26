import { Box, Typography, Stack, IconButton, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import CreateGroupChatDialog from "../CreateGroupChatDialog";
import _ from "lodash";
import RoomChatItem from "../RoomChatItem";
import { useEffect, useState } from "react";
import { filterRoomInfo } from "@/utils/filterRoomInfo";
import ReactSearchBox from "react-search-box";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Scrollbars from "react-custom-scrollbars-2";
import UserSkeleton from "@/components/UserSkeleton";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import FindUserDialog from "../FindUserDialog";
import { searchRoomChatByName } from "@/services/roomApiService";
import { socketManager } from "@/socket";
import './searchBoxOverrideStyle.scss';

const socket = socketManager('rooms');


const MenuRoomChat = () => {
    const { user } = useSelector((state) => state.user);


    const [rooms, setRooms] = useState([]);
    const [timer, setTimer] = useState();
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [loading, setLoading] = useState(false);

    const [searchResult, setSearchResult] = useState({
        roomSearchings: [],
        conversation: []
    });

    const [openCreateGroupChat, setOpenCreateGroupChat] = useState(false);
    const [openFindUserDialog, setOpenFindUserDialog] = useState(false);

    const doSearch = (value) => {
        setSearching(true);
        searchRoomChatByName(value)
            .then(({ result }) => {

                setSearchResult({
                    ...searchResult,
                    roomSearchings: result.rooms
                })
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setSearching(false);
            })
    }

    const onChange = (value) => {
        if (value.length > 0) {
            setSearching(true);
            setSearch(value);
            clearTimeout(timer);
            setTimer(setTimeout(() => doSearch(value), 500));
        } else {
            clearTimeout(timer);
            setSearching(false);
            setSearch('');
        }
    }

    const onSubscribe = (response) => {
        if (response) {
            setRooms(response.rooms);
        }
    }

    const onIncomingPinRoom = async (roomId, { userConfig }) => {
        setRooms((preState) => {
            return preState
                .map(room => {
                    if (room._id === roomId) {
                        return {
                            ...room,
                            userConfig: {
                                ...room.userConfig,
                                ...userConfig
                            }
                        }
                    }
                    return room;
                })
                .sort((a, b) => {
                    if (a.userConfig.pinned === b.userConfig.pinned) {
                        return new Date(a.userConfig.pinnedAt) - new Date(b.userConfig.pinnedAt);
                    }
                    return a.userConfig.pinned ? -1 : 1;
                });
        });
    }

    const incomingRemovePinRoom = async (roomId, { lastMsg, userConfig }) => {
        setRooms((preState) => {
            return preState
                .map(room => {
                    if (room._id === roomId) {
                        return {
                            ...room,
                            userConfig: {
                                ...room.userConfig,
                                ...userConfig
                            }
                        }
                    }
                    return room;
                })
                .sort((a, b) => {
                    return new Date(b.lastMsg.createdAt) - new Date(a.lastMsg.createdAt);
                })
                .sort((a, b) => {
                    if (a.userConfig.pinned === b.userConfig.pinned) {
                        return new Date(a.userConfig.pinnedAt) - new Date(b.userConfig.pinnedAt);
                    }
                    return a.userConfig.pinned ? -1 : 1;
                });
        });
    }

    const onReceiveIncomingMsg = (roomId, action, data) => {
        if (action === 'newMsg') {
            setRooms((preState) => {
                const rooms = [
                    {
                        ...data.room,
                        unreadMsgCount: data.unreadMsgCount
                    },
                    ...(preState.filter(x => x._id !== roomId))
                ]
                return rooms.sort((a, b) => {
                    if (a.userConfig.pinned === b.userConfig.pinned) {
                        return new Date(a.userConfig.pinnedAt) - new Date(b.userConfig.pinnedAt);
                    }
                    return a.userConfig.pinned ? -1 : 1;
                });
            });

        } else if (action === 'typing') {

            setRooms((preState) => preState.map(item => {
                return {
                    ...item,
                    typing: (
                        item._id === data.room._id
                        && data.typing
                        && data.typingUserId !== user._id
                    )
                };
            }));
        } else {

            setRooms((preState) => preState.map(item => {
                if (item._id === data.room._id) {
                    return {
                        ...data.room,
                        unreadMsgCount: data.unreadMsgCount
                    };
                }
                return item;
            }));
        }
    }

    const onConnected = () => {
        setLoading(false);
        socket.emit('subscribe', user._id, onSubscribe);
    }

    const onDisconnected = () => {
        setLoading(false);
    }

    useEffect(() => {
        setLoading(false);
        if (socket.connected) {
            socket.emit('subscribe', user._id, onSubscribe);
        }

        return () => {
            socket.emit('leave', user._id);
        }
    }, [socket.connected])


    useEffect(() => {
        setLoading(true);
        socket.on('connect', onConnected);
        socket.on('disconnect', onDisconnected);
        socket.on('rooms.incomingMsg', onReceiveIncomingMsg);
        socket.on('rooms.incomingPinRoom', onIncomingPinRoom);
        socket.on('rooms.incomingRemovePinRoom', incomingRemovePinRoom);
        return () => {
            socket.off('connect', onConnected);
            socket.off('rooms.incomingMsg')
            socket.off('rooms.incomingPinRoom');
            socket.off('rooms.incomingRemovePinRoom');
            socket.off('disconnect', onDisconnected);
        }
    }, [])

    return (
        <Stack
            sx={{ overflowX: "hidden", overflowY: "hidden", height: "100vh", width: "500px" }}>
            <Stack direction="row" sx={{ paddingX: "15px", paddingY: "10px" }}>
                <Box sx={{ width: "100%" }}>
                    <Typography fontWeight="1000" fontSize="bold" variant="h4">
                        {`Tin nhắn`}
                    </Typography>
                </Box>
                <IconButton size="medium" onClick={() => setOpenFindUserDialog(true)}>
                    <PersonAddAltOutlinedIcon />
                </IconButton>
                <IconButton size="medium" onClick={() => setOpenCreateGroupChat(true)}>
                    <DriveFileRenameOutlineIcon />
                </IconButton>
            </Stack>
            <Box px="15px">
                <div className="searchBox">
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
                        value={search}
                        onChange={onChange}
                    />
                </div>
            </Box>
            {search.length > 0
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
                                                onClick={() => {
                                                    setSearch('');
                                                    setSearching(false);
                                                    setSearchResult({ roomSearchings: [], conversation: [] })
                                                }}
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
            }
            <CreateGroupChatDialog
                open={openCreateGroupChat}
                onClose={() => setOpenCreateGroupChat(false)}
            />
            <FindUserDialog
                open={openFindUserDialog}
                onClose={() => setOpenFindUserDialog(false)} />
        </Stack>
    );
};

export default MenuRoomChat;
