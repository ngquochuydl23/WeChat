import { Box, Stack, Drawer, LinearProgress, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Composer from "./Composer";
import RoomDetail from "./RoomDetail";
import _ from "lodash";
import { LeftMessage, RightMessage } from "./MessageItem";
import { useEffect } from "react";
import { socketManager } from '../../socket';
import { useSelector } from "react-redux";
import RoomHeader from "./RoomHeader";


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

  const getRoomHeader = () => {
    if (!room) {
      return {
        avatar: '',
        title: 'Room mất',
        subtitle: "Đang online"
      }
    }

    if (room.singleRoom) {
      const { avatar, fullName } = members.find(x => x._id !== user._id);
      return {
        avatar: avatar,
        title: fullName,
        subtitle: "Đang online"
      }
    }
    return {
      avatar: '',
      title: 'Chat nhóm title',
      subtitle: "35 thành viên"
    }
  }

  const onSentMsg = ({ sentMsg }) => {
    console.log(sentMsg);
  }

  const onEnteredNewMsg = async (msg) => {
    if (messages.length >= 0) {
      console.log(roomId);
      socket.emit('user.sendMsg', roomId, {
        type: 'text',
        content: msg
      }, onSentMsg);
    }
  }

  const onConnected = () => {
    setConnected(true);
    setLoading(false);
    console.log("onConnected");
  }

  const onDisconnected = () => {
    setLoading(false);
    setConnected(false);
    console.log("onDisconnected");
  }

  const onJoined = (response) => {
    if (response) {
      setConnected(true);
      setLoading(false);
      setMembers(response.members)
      setRoom(response.room);
      setMessages(response.messages)
    }
  }

  const onReceiveIncommingMsg = async (roomId, msg) => {
    setMessages((pre) => [msg, ...pre]);
    console.log(msg);
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

    socket.on('incomingMsg', onReceiveIncommingMsg);
    socket.io.on("error", (error) => {
      console.log(error)
      socket.connect();
    });

    return () => {
      socket.off('join');
      socket.off('incomingMsg');
      socket.emit('leave', roomId);
      socket.off('stopTyping', () => { });
      socket.off('typing', () => { });
    };
  }, [roomId]);

  return (
    <Stack
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'whitesmoke'
      }}>
      <RoomHeader header={getRoomHeader()} />
      <Box>
        {connected
          ? (!messageTimeout &&
            <Alert severity="success">
              Kết nối thành công
            </Alert>)
          : null
        }
        {loading &&
          <Alert severity="warning">Mất kết nối</Alert>
        }
      </Box>
      {loading ? (
        <>
          <Alert severity="info">Đang kết nối</Alert>
          <LinearProgress color="info" />
        </>
      ) : (
        <Stack
          sx={{
            display: 'flex',
            overflowX: 'none',
            overflowY: 'auto',
            flexDirection: 'column-reverse',
            height: '100%',
            width: '100%',
          }}>
          {_.map(messages, (message, index) => {
            if (message.creatorId === user._id) {
              return (
                <RightMessage
                  key={index}
                  {...message}
                />
              )
            }
            return (
              <LeftMessage
                content={message.content}
                user={members.find(x => x._id === message.creatorId)}
              />
            )
          })}
        </Stack>
      )}
      <Composer
        onSubmitMsg={onEnteredNewMsg}
      />
      <Drawer
        anchor="right"
        open={showRoomInfo}
        onClose={() => setShowRoomInfo(false)}>
        <RoomDetail user={user} />
      </Drawer>
    </Stack>
  )
}


export default Room;