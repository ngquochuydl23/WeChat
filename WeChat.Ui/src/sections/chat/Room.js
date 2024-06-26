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


    const onEnteredNewMsg = async (msg) => {
        if (messages.length >= 0) {

            const newMsg = {
                uuid: uuidv4(),
                seen: false,
                sent: false,
                content: msg,
                type: 'text',
                creatorId: user._id,
                roomId: roomId
            }

            sendMsg(roomId, newMsg)
                .then(({ result, msg }) => { console.log(result) })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    const sendFileMsg = async (msg) => {
        socket.emit('user.sendMsg', roomId, msg, ({ message }) => {
            console.log(message);
        });
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

    const redeemMsg = (msgId) => {
        socket.emit('user.redeemMsg', msgId, (response) => {
            setMessages((pre) => pre.map(item => {
                if (item._id === msgId) {
                    item.redeem = true;
                }
                return item;
            }));
        });
    }

    const onConnected = () => {
        console.log("onConnected");
        setLoading(false);
    }

    const onDisconnected = () => {
        console.log("onDisconnected");
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

    const onAddedMember = async (room, members, msg) => {
        setMessages((pre) => [msg, ...pre]);
        setMembers(members)
        setRoom(room);
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


    const handleJoinRoom = ({ status, response, error }) => {
        console.log("Join room: " + status);

        if (response) {
            localStorage.setItem("lastAccessRoomId", roomId);

            seen(roomId);
            setLoading(false);
            setMembers(response.users)
            setRoom(response.room);
            setMessages(response.messages)
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
            <Stack sx={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'absolute', zIndex: 1 }}>
                <Box sx={{ position: 'absolute', zIndex: 1, width: '100%' }}>
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
                </Box>
                <Stack
                    sx={{
                        display: 'flex',
                        overflowX: 'none',
                        overflowY: 'auto',
                        flexDirection: 'column-reverse',
                        height: '100%',
                        width: '100%',
                        paddingX: '10px'
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
                        onTyping={() => typingMsg(true)}
                        onStopTyping={() => typingMsg(false)}
                        onSubmitMsg={onEnteredNewMsg}
                        onSendFileMsg={sendFileMsg}
                    />
                }
                <Drawer
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
                </Drawer>
            </Stack>
        </div>
    )
}


export default Room;