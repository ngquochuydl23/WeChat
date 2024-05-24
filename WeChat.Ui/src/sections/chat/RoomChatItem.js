import { Box, Typography, Stack, } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { filterChatTime } from "../../utils/chatTimeUtil";
import { filterMsgSystem } from "../../utils/fitlerMsg";
import PhotoIcon from '@mui/icons-material/Photo';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const RoomChatItem = ({
  _id,
  lastMsg,
  title,
  avatar,
  members
}) => {

  const param = useParams();
  const { user } = useSelector((state) => state.user);

  const fitlerLastMsgContent = () => {
    if (lastMsg.type === 'text') {
      return (
        <Typography
          sx={{
            fontWeight: "500",
            color: '#696969',
            // ...(unreadMsg > 0 && {
            //   fontWeight: "600",
            //   color: '#000',
            // })
          }}
          fontSize="14px"
          variant="body1">
          {lastMsg.creatorId === user._id && "Bạn: "} {lastMsg.content}
        </Typography>
      )
    } else if (lastMsg.type === 'image') {
      return (
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
            fontWeight: "500",
            color: '#696969',
          }}
          fontSize="14px"
          variant="body1">
          {lastMsg.creatorId === user._id && "Bạn:  "} <PhotoIcon sx={{ color: '#d9d9d9', mr: '5px' }} /> Hình ảnh
        </Typography>
      )
    } else if (lastMsg.type === 'file') {
      return (
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyItems: 'center',
            fontWeight: "500",
            color: '#696969',
          }}
          fontSize="14px"
          variant="body1">
          {lastMsg.creatorId === user._id && "Bạn:  "} <FolderOpenIcon sx={{ color: '#d9d9d9', mr: '5px' }} /> tập tin
        </Typography>
      )
    }

    const creator = members.find(x => x._id === lastMsg.creatorId);
    return (
      <Typography
        sx={{ fontWeight: "500", color: '#696969' }}
        fontSize="14px"
        variant="body1">
        {creator._id === user._id ? "Bạn" : creator.fullName} {filterMsgSystem(lastMsg.content, members)}
      </Typography>
    )
  }

  return (
    <Stack
      component={Link}
      to={"/chat/" + _id}
      px="15px"
      py="10px"
      spacing="15px"
      direction="row"
      sx={{
        textDecoration: 'none',
        width: '100%',
        '&:hover': {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        },
        ...((param.roomId === _id) && {
          backgroundColor: "rgb(1, 98, 196, 0.1)",
          '&:hover': {
            backgroundColor: "rgb(1, 98, 196, 0.1)",
          },
        })
      }}>
      <Avatar
        alt={title}
        src={avatar} />
      <Box sx={{ width: '100%' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ width: '100%', overflow: 'none' }}>
          <Typography
            sx={{
              color: 'black',
              fontSize: "15px",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            variant="subtitle1">
            {title}
          </Typography>
          <Typography
            sx={{
              textAlign: 'right',
              color: 'gray',
              fontWeight: '500',
              fontSize: "12px"
            }}>
            {filterChatTime(lastMsg.createdAt)}
          </Typography>
        </Stack>
        <Stack
          sx={{ width: '100%' }}
          justifyContent="space-between"
          spacing="10px"
          direction="row">
          {fitlerLastMsgContent()}
          {/* {(Boolean(unreadMsg) && unreadMsg > 0)
              && <Chip
                size="small"
                sx={{
                  color: 'white',
                  backgroundColor: '#0162C4'
                }}
                label={unreadMsg} />
            } */}
        </Stack>
      </Box >
    </Stack >
  )
}

export default RoomChatItem;