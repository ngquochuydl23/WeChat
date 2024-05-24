import { Box, Typography, Stack, Avatar } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useState } from "react";
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';

const RoomDetail = ({
  user,

}) => {
  
  const [muted, setMuted] = useState(false);
  const [pinned, setPinned] = useState(false);



  return (
    <Box sx={{ width: '400px', height: '100%' }}>
      <Box
        py="30px"
        sx={{
          width: '100%',
          justifyContent: "center",
          alignItems: "center",
          display: 'flex',
          flexDirection: 'column'
        }}>
        <Avatar
          sx={{
            width: '100px',
            height: '100px'
          }}
          alt={user.fullName}
          src={user.avatar} />
        <Typography
          mt="20px"
          fontSize="20px"
          fontWeight="800">
          {user.fullName}
        </Typography>
        <Stack
          justifyContent="center"
          spacing="20px"
          mt="30px"
          px="30px"
          direction="row"
          sx={{ width: '100%' }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center">
            <IconButton
              onClick={() => setMuted(!muted)}
              sx={{ background: "rgba(0, 0, 0, 0.1)" }}
              size="large"
              aria-label="emoji">
              {muted
                ? <NotificationsOffOutlinedIcon />
                : <NotificationsNoneOutlinedIcon />
              }
            </IconButton>
            <Typography fontSize="14px">
              {muted
                ? 'Bật thông báo'
                : 'Tắt thông báo'
              }
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center">
            <IconButton
              onClick={() => setPinned(!pinned)}
              sx={{ background: "rgba(0, 0, 0, 0.1)" }}
              size="large"
              aria-label="emoji">
              {pinned
                ? <PushPinOutlinedIcon />
                : <PushPinOutlinedIcon />
              }
            </IconButton>
            <Typography fontSize="14px">
              {pinned
                ? 'Bỏ ghim hội thoại'
                : 'Ghim hội thoại'
              }
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default RoomDetail;