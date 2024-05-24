import { Box, Stack, Drawer, LinearProgress, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Composer from "./Composer";
import RoomDetail from "./RoomDetail";
import _ from "lodash";
import { LeftMessage, NotificationMessage, RightMessage } from "./MessageItem";
import { useEffect } from "react";
import { socketManager } from '../../socket';
import { useSelector } from "react-redux";
import RoomHeader from "./RoomHeader";
import MemberTyping from "./MemberTyping";
import { v4 as uuidv4 } from 'uuid';
import DispersedComposer from "./DispersedComposer";


const Room = () => {
  const { roomId } = useParams();
  const socket = socketManager('chatRoom');
  const [messageTimeout, setMessageTimeout] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [connected, setConnected] = useState(false);
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

      socket.emit('user.sendMsg', roomId, newMsg, ({ message }) => {

      });
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
    setConnected(true);
    setLoading(false);
  }

  const onDisconnected = () => {
    setLoading(false);
    setConnected(false);
  }

  const onJoined = (response) => {
    if (response) {
      setConnected(true);
      setLoading(false);
      setMembers(response.room.users)
      setRoom(response.room);
      setMessages(response.messages)
    }
  }

  const onReceiveIncomingMsg = async (roomId, msg) => {
    setMessages((pre) => [msg, ...pre]);
  }

  const onAddedMember = async (room, msg) => {
    setMessages((pre) => [msg, ...pre]);
    setMembers(room.users)
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

  const onIncomingRedeemMsg = async (msg) => {
    console.log('incomingRedeemMsg: ' + msg._id);
    setMessages((pre) => pre.map(item => {
      if (item._id === msg._id) {
        item.redeem = true;
        return msg;
      }
      return item;
    }));
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMessageTimeout(true);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      setMessageTimeout(false);
    };
  }, [connected]);

  useEffect(() => {
    setLoading(true);
    socket.on('connect', onConnected);
    socket.on('disconnect', onDisconnected);

    return () => {
      setLoading(false);
      socket.off('connect', onConnected);
      socket.off('disconnect', onDisconnected);
    }
  }, []);

  useEffect(() => {

    socket.emit('join', roomId, onJoined);

    socket.on('incomingMsg', onReceiveIncomingMsg);
    socket.on('incomingTyping', onReceiveIncomingTyping);
    socket.on('roomDispersion', onRoomDispersion);
    socket.on('addMember', onAddedMember);
    socket.on('incomingRedeemMsg', onIncomingRedeemMsg)
    socket.io.on("error", (error) => {
      console.log(error)
      socket.connect();
    });

    return () => {
      socket.off('join');
      socket.off('incomingMsg');
      socket.off('incomingTyping');
      socket.off('roomDispersion');
      socket.off('addMember');
      socket.off('incomingRedeemMsg');
      socket.emit('leave', roomId);
    };
  }, [roomId]);

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'whitesmoke',
        overflow: 'hidden'
      }}>
      <RoomHeader
        loading={loading}
        room={room}
        members={members}
        loggingUserId={user._id}
        onToggleRoomDetail={() => { setShowRoomInfo(!showRoomInfo) }} />

      <Box>
        {!loading && connected
          ? (!messageTimeout &&
            <Alert severity="success">
              Kết nối thành công
            </Alert>)
          : !loading &&
          <Alert severity="error">
            Mất kết nối
          </Alert>
        }
        {loading &&
          <Box>
            <Alert severity="info">Đang kết nối</Alert>
            <LinearProgress color="info" />
          </Box>
        }
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
        {_.map(messages, (message, idx) => {
          if (message.type === 'system-notification') {
            return <NotificationMessage
              key={idx}
              members={members}
              user={members.find(x => x._id === message.creatorId)}
              {...message}
            />
          } else {
            if (message.creatorId === user._id) {
              return (
                <RightMessage
                  key={idx}
                  {...message}
                  msgId={message._id}
                  onRedeemMsg={redeemMsg}
                />
              )
            }
            return (
              <LeftMessage
                key={idx}
                content={message.content}
                redeem={message.redeem}
                attachment={message.attachment}
                type={message.type}
                user={members.find(x => x._id === message.creatorId)}
              />
            )
          }
        })}
      </Stack>
      {room?.dispersed
        ? <DispersedComposer
          room={room}
          members={members} />
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
  )
}


export default Room;