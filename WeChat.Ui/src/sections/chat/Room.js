import { Box, Stack, Drawer, LinearProgress, Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Composer from "./Composer";
import RoomDetail from "./RoomDetail";
import { useEffect } from "react";
import { socketManager } from '@/socket';
import { useSelector } from "react-redux";
import RoomHeader from "./RoomHeader";
import MemberTyping from "./MemberTyping";
import { v4 as uuidv4 } from 'uuid';
import DispersedComposer from "./DispersedComposer";
import _ from "lodash";
import { seenMsg, sendMsg } from "@/services/messagesApiService";
import { groupMsg } from "@/utils/groupMsg";
import GroupMsgItem from "./GroupMsgItem";
import InfiniteScroll from "react-infinite-scroll-component";
import Scrollbars from "react-custom-scrollbars-2";
import MediaViewerDialog from "./MediaViewerDialog";

const socket = socketManager('chatRoom');

const Room = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [messageTimeout, setMessageTimeout] = useState(false);
    const { user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [showRoomInfo, setShowRoomInfo] = useState(false);

    const [room, setRoom] = useState();
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [userTypingIds, setUserTypingIds] = useState([]);
    const [medias, setMedias] = useState([]);

    const onEnteredNewMsg = async (msg) => {
        sendMsg(roomId, msg)
            .then(({ result, msg }) => { console.log(result) })
            .catch((err) => {
                console.log(err);
            })
    }

    const typingMsg = (typing) => {
        socket.emit('user.typing', roomId, {
            type: typing,
            isTyping: true
        });
    }

    const dispersedRoom = (roomId) => {
        setShowRoomInfo(false);

        socket.emit('user.disperseRoom', roomId, ({ emitter, msg }) => {
            console.log(msg);
        });
    }

    const addMember = (roomId, memberId) => {
        socket.emit('user.addMember', roomId, memberId, (response) => {
            setShowRoomInfo(false);
        });
    }

    const onConnected = () => {
        setLoading(false);
    }

    const onDisconnected = () => {
        setLoading(false);
    }

    const onReceiveIncomingMsg = async (roomId, msg) => {
        if (msg.creatorId !== user._id) {
            seen(roomId);
        }
        setMessages((pre) => [msg, ...pre]);
    }

    const seen = (roomId) => {
        if (roomId)
            seenMsg(roomId)
                .then(({ msg }) => { console.log(msg) })
                .catch((err) => {
                    console.log(err);
                })
    }

    const onAddedMember = async (roomId, members, msg) => {
        setMessages((pre) => [msg, ...pre]);
        setMembers(members);
    }

    const onReceiveIncomingTyping = async (roomId, isTyping, typingUserId) => {
        if (!isTyping) {
            setUserTypingIds(userTypingIds.filter(ids => ids !== typingUserId))
        } else {
            let temp = userTypingIds.filter(ids => ids !== typingUserId)
            temp.push(typingUserId);
            setUserTypingIds(temp)
        }
    }

    const onRoomDispersion = async ({ room, messages }) => {
        setRoom(room);
        setMessages(messages);
    }

    const onIncomingRedeemMsg = async (roomId, msg) => {
        setMessages((pre) => pre.map(item => {
            if (item._id === msg._id) {
                item.redeemed = true;
                return item;
            }
            return item;
        }));
    }

    const onUpdateRoom = async (room) => {
        setRoom(room)
    }

    const handleJoinRoom = ({ status, response, error }) => {
        console.log("Join room: " + status);

        if (response) {
            localStorage.setItem("lastAccessRoomId", roomId);
            console.log(response.medias)

            seen(roomId);
            setLoading(false);
            setMembers(response.users);
            setRoom(response.room);
            setMessages(response.messages);
            setMedias(response.medias);
        }

        if (error) {
            localStorage.clear("lastAccessRoomId");
            navigate('/chat')
        }
    }

    useEffect(() => {
        if (socket.connected && roomId) {
            socket.emit('join', roomId, handleJoinRoom);
        }

        const timeoutId = setTimeout(() => {
            setMessageTimeout(true);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
            setMessageTimeout(false);
        };
    }, [socket.connected]);



    useEffect(() => {
        setLoading(true);

        socket.on('connect', onConnected);
        socket.on('disconnect', onDisconnected);

        socket.on('incomingMsg', onReceiveIncomingMsg);
        socket.on('incomingTyping', onReceiveIncomingTyping);
        socket.on('incomingRedeemMsg', onIncomingRedeemMsg);


        socket.on('roomDispersion', onRoomDispersion);
        socket.on('addMember', onAddedMember);
        socket.on('updateRoom', onUpdateRoom);

        socket.io.on("error", (error) => {
            console.log(error);
            socket.connect();
        });

        return () => {
            setLoading(false);
            socket.off('connect', onConnected);
            socket.off('disconnect', onDisconnected);

            socket.off('join');
            socket.off('incomingMsg');
            socket.off('incomingTyping');
            socket.off('incomingRedeemMsg');

            socket.off('roomDispersion');
            socket.off('addMember');
            socket.off('v');
        }
    }, []);

    useEffect(() => {
        if (socket.connected) {
            socket.emit('join', roomId, handleJoinRoom);
        }

        return () => {
            socket.emit('leave', roomId);
        };
    }, [roomId]);

    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh', position: 'relative' }}>
            {room?.theme &&
                <img
                    alt="room.background"
                    style={{ width: '100%', height: '100vh', position: 'relative' }}
                    src={require('@/assets/Illustration/room_background_green.png')} />
            }
            <Stack
                direction="row"
                sx={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'absolute', zIndex: 1 }}>
                <Box sx={{ height: '100vh', display: 'flex', flex: 1, flexDirection: 'column', position: 'relative' }}>
                    <Stack sx={{ position: 'absolute', zIndex: 1, width: '100%' }}>
                        <RoomHeader
                            loading={loading}
                            room={room}
                            members={members}
                            loggingUserId={user._id}
                            onToggleRoomDetail={() => { setShowRoomInfo(!showRoomInfo) }} />
                        <Box>
                            {(!loading && !socket.connected) && <Alert severity="error">Mất kết nối</Alert>}
                            {loading &&
                                <Box>
                                    <Alert severity="info">Đang kết nối</Alert>
                                    <LinearProgress color="info" />
                                </Box>
                            }
                        </Box>
                    </Stack>
                    <Stack
                        sx={{
                            display: 'flex',
                            overflowX: 'none',
                            overflowY: 'scroll',
                            flexDirection: 'column-reverse',
                            height: '100%',
                            width: '100%',
                            paddingX: '10px',
                            '&::-webkit-scrollbar': {
                                width: '7px'
                            },
                            "&::-webkit-scrollbar-track": {
                                background: 'white'
                            },
                            ' ::-webkit-scrollbar-thumb': {
                                borderRadius: '10px',
                                background: 'rgba(136, 136, 136, 0.3)',
                                width: '3px',
                            }

                            //       /* Handle on hover */
                            //       ::-webkit-scrollbar-thumb:hover {
                            // background: #555;
                            //       }
                        }}>

                        {(members.length > 0 && userTypingIds.length > 0) &&
                            <MemberTyping
                                typingUserIds={userTypingIds}
                                members={members} />
                        }
                        {/* Msg from socket */}
                        {_.map(groupMsg(messages), (item, idx) => {

                            return (
                                <GroupMsgItem
                                    key={item.datetime}
                                    user={user}
                                    members={members}
                                    datetime={item.datetime}
                                    groupsInDay={item.groupsInDay} />
                            )
                        })}
                        <Box mb="80px" />
                    </Stack>
                    {room?.dispersed
                        ? <DispersedComposer room={room} members={members} />
                        : <Composer
                            roomId={roomId}
                            onTyping={() => typingMsg(true)}
                            onStopTyping={() => typingMsg(false)}
                            onSubmitMsg={onEnteredNewMsg}
                        />
                    }
                    {/* <Drawer
                        anchor="right"
                        open={showRoomInfo}
                        onClose={() => setShowRoomInfo(false)}>
                        <RoomDetail
                            loading={loading}
                            room={room}
                            members={members}
                            loggingUserId={user._id}
                            onDispersedRoom={dispersedRoom}
                            onAddMember={addMember} />
                    </Drawer> */}
                </Box>
                {
                    showRoomInfo &&
                    <RoomDetail
                        medias={medias}
                        loading={loading}
                        room={room}
                        members={members}
                        loggingUserId={user._id}
                        onDispersedRoom={dispersedRoom}
                        onAddMember={addMember} />
                }
                <MediaViewerDialog />
            </Stack >
        </div >
    )
}


export default Room;