import { Typography, Stack, Avatar } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

export const LeftMessage = ({ user, content }) => {
  return (
    <Stack
      px="15px"
      py="10px"
      spacing="15px"
      bgcolor="whitesmoke"
      direction="row">
      <Avatar
        alt={user.fullName}
        src={user.avatar} />
      <Stack
        sx={{
          padding: '10px',
          borderRadius: '10px',
          backgroundColor: 'white'
        }}
        direction="column">
        <strong>{user.fullName}</strong>
        <Typography
          sx={{ maxWidth: '700px', minWidth: '100px' }}
          color="black"
          fontWeight="500"
          fontSize="15px"
          variant="body1">
          {content}
        </Typography>
        <Typography
          mt="5px"
          color="black"
          fontWeight="500"
          fontSize="12px"
          variant="body1">
          {'20:54'}
        </Typography>
      </Stack>
    </Stack>
  )
}

export const RightMessage = ({ content, seen = false, sent = true }) => {
  return (
    <Stack
      px="15px"
      py="10px"
      justifyContent="flex-end"
      spacing="15px"
      bgcolor="whitesmoke"
      direction="row">
      <Stack
        sx={{
          padding: '10px',
          borderRadius: '10px',
          backgroundColor: 'white'
        }}
        direction="column">
        <Typography
          sx={{ maxWidth: '700px', minWidth: '100px' }}
          color="black"
          fontWeight="500"
          fontSize="15px"
          variant="body1">
          {content}
        </Typography>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: '100%' }}
          direction="row">
          <Typography
            mt="5px"
            mr="5px"
            color="black"
            fontWeight="500"
            fontSize="12px"
            variant="body1">
            {'20:54'}
          </Typography>
          {sent
            ? (seen)
              ? <DoneAllIcon
                fontVariant="small"
                sx={{ color: "#0162C4" }} />
              : <DoneIcon
                fontSize="small"
                sx={{ color: "#0162C4" }} />
            : <Typography
              color="#0162C4"
              fontWeight="500"
              fontSize="10px"
              variant="body1">
              {`Sending`}
            </Typography>
          }
        </Stack>
      </Stack>
    </Stack>
  )
}

