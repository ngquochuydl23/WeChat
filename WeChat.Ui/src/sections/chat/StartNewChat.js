import { Box, Typography, Stack } from "@mui/material";

const StartNewChat = () => {
    return (
        <Stack
            sx={{
                backgroundColor: 'white',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <Typography variant="h5">
                Chào mừng bạn đến với `{ }`
            </Typography>
            <Typography>
                Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu hóa cho máy tính của bạn.
            </Typography>
        </Stack>
    )
}

export default StartNewChat;