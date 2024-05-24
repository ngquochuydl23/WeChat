import { Stack, Divider } from "@mui/material";
import React, { useState } from "react";
import MenuRoomChat from "../../sections/chat/MenuRoomChat";
import Room from "../../sections/chat/Room";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import StartNewChat from "../../sections/chat/StartNewChat";
import { socketManager } from '../../socket';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

const Chats = () => {
  const navigate = useNavigate();
  const socket = socketManager('rooms');

  const { user } = useSelector((state) => state.user);
  const { roomId } = useParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);


  const onSubscribe = (response) => {
    if (response) {
      setRooms(response.rooms);
      console.log(response.rooms);
    }
  }

  const onReceiveIncomingMsg = (roomId, room) => {  
    setRooms((preState) => [room, ...(preState.filter(x => x._id !== roomId))]);
  }

  const onConnected = () => {
    setConnected(true);
    setLoading(false);
  }

  const onDisconnected = () => {
    setLoading(false);
    setConnected(false);
  }

  const createGroupChat = (data) => {
    socket.emit('initRoomChat', data, ({ room }) => {
      setRooms((preState) => [room, ...preState]);
      navigate("/chat/" + room._id);
    });
  }

  useEffect(() => {
    socket.emit('subscribe', user._id, onSubscribe);
    socket.on('rooms.incomingMsg', onReceiveIncomingMsg);

    return () => {
      socket.off('subscribe');
      socket.off('rooms.incomingMsg');
      socket.emit('leave', user._id);
    }
  }, [connected, loading])


  useEffect(() => {
    setLoading(true);
    socket.on('connect', onConnected);
    socket.on('disconnect', onDisconnected);

    return () => {
      socket.off('connect', onConnected);
      socket.off('disconnect', onDisconnected);
    }
  }, [])

  return (
    <Stack
      direction="row"
      sx={{ height: '100%' }}>
      <MenuRoomChat
        key={roomId}
        rooms={rooms}
        onCreateGroupChat={createGroupChat} />
      <Divider
        orientation="vertical"
        flexItem />
      {(Boolean(roomId))
        ? <Room />
        : <StartNewChat />
      }
    </Stack>
  );
};

export default Chats;
