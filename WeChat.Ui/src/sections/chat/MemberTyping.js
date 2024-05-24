import { Avatar } from "@material-ui/core"
import { Box, Stack, Typography } from "@mui/material"
import _ from "lodash";
import { useSelector } from "react-redux";
import Lottie from 'react-lottie';
import typingAnimation from '../../lotties/typing-lotties.json'

const MemberTyping = ({ members, typingUserIds }) => {
  const { user } = useSelector((state) => state.user);
  return (
    <Stack direction="column" spacing="20px">
      {typingUserIds
        .filter(itemId => itemId !== user._id)
        .map(itemId => {
          const member = members.find(x => x._id === itemId);
          return (
            <Stack
              py="10px"
              spacing="15px"
              bgcolor="whitesmoke"
              direction="row">
              <Avatar
                alt={member.fullName}
                src={member.avatar} />
              <Box>
                <Typography
                  sx={{ fontSize: '13px', mb: '5px' }}>
                  {member.fullName}
                </Typography>
                <Stack
                  sx={{
                    borderRadius: '10px',
                    backgroundColor: 'white'
                  }}
                  direction="column">
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: typingAnimation,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice"
                      }
                    }}
                    height={40}
                    width={100}
                  />
                </Stack>
              </Box>
            </Stack>
          )
        })}
    </Stack>
  )
}

export default MemberTyping;