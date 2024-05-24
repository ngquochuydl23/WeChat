import { Box, Typography } from "@mui/material";

const DispersedComposer = ({ room, members }) => {
    const findDispersingMember = () => {
        return members.find(x => x._id === room.creatorId);
    }

    return (
        <Box
            sx={{
                backgroundColor: 'white',
                paddingX: '15px',
                paddingY: '10px',
                marginTop: '20px'
            }}>
            <Typography
                fontWeight="600"
                variant="body1"
                color="red"
                sx={{}}>
                {findDispersingMember().fullName + ' đã giải tán nhóm'}
            </Typography>
            <Typography fontSize="14px">
                Bạn không thể tiếp tục cuộc trò chuyện này. Vui lòng tìm hiểu thêm
            </Typography>
        </Box>
    );
};

export default DispersedComposer;
