import { Avatar, Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import SubjectIcon from '@mui/icons-material/Subject';
import { filterRoomInfo } from "../../utils/filterRoomInfo";

const RoomHeader = ({ room, members, loggingUserId, onToggleRoomDetail }) => {
  const info = filterRoomInfo(loggingUserId, room, members);


  return (
    <Stack
      px="15px"
      py="10px"
      spacing="15px"
      bgcolor="rgba(255, 255, 255, 0.9)"
      direction="row">
      {!Boolean(info)
        ? <Stack direction="row" spacing="10px">
          <Skeleton
            background="#f5f5f5"
            variant="circular">
            <Avatar sx={{ aspectRatio: 1 }} />
          </Skeleton>
        </Stack>
        : <Avatar
          alt={info?.title}
          src={info?.avatar} />
      }
      <Box sx={{ width: '100%' }}>
        <Typography
          sx={{ width: '100%', color: 'black', fontSize: "16px" }}
          variant="subtitle1">
          {info?.title || <Skeleton width="30%" />}
        </Typography>
        <Typography
          sx={{
            fontWeight: "500",
            color: '#696969',
          }}
          fontSize="14px"
          variant="body1">
          {info?.subtitle || <Skeleton width="20%" />}
        </Typography>
      </Box>
      <IconButton
        onClick={onToggleRoomDetail}
        aria-label="emoji">
        <SubjectIcon />
      </IconButton>
    </Stack>
  )
}

export default RoomHeader;