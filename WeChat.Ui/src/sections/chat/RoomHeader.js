import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import SubjectIcon from '@mui/icons-material/Subject';

const RoomHeader = ({ header, onToggleRoomDetail }) => {
  return (
    <Stack
      px="15px"
      py="10px"
      spacing="15px"
      bgcolor="rgba(255, 255, 255, 0.9)"
      direction="row">
      <Avatar
        alt={header.avatar}
        src={header.title} />
      <Box sx={{ width: '100%' }}>
        <Typography
          sx={{ width: '100%', color: 'black', fontSize: "16px" }}
          variant="subtitle1">
          {header.title}
        </Typography>
        <Stack
          sx={{ width: '100%' }}
          justifyContent="space-between"
          spacing="10px"
          direction="row">
          <Typography
            sx={{
              fontWeight: "500",
              color: '#696969',
            }}
            fontSize="14px"
            variant="body1">
            {header.subtitle}
          </Typography>
        </Stack>
      </Box>
      <IconButton
        // onClick={() => setShowRoomInfo(!showRoomInfo)}
        aria-label="emoji">
        <SubjectIcon />
      </IconButton>
    </Stack>
  )
}

export default RoomHeader;