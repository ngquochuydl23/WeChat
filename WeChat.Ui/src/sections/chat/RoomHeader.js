import { Avatar, Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import SubjectIcon from '@mui/icons-material/Subject';
import { filterRoomInfo } from "../../utils/filterRoomInfo";
import { readUrl } from "@/utils/readUrl";

const RoomHeader = ({ room, members, loggingUserId, onToggleRoomDetail }) => {
    const info = filterRoomInfo(loggingUserId, room, members);
    return (
        <Stack
            sx={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(6px)',
                //  borderBottom: '1px solid #EBE9ED',
                //  boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.16) ,0 0px 4px rgba(0, 0, 0, 0.05)'
            }}
            px="15px"
            py="10px"
            spacing="15px"
            direction="row">
            {!Boolean(info)
                ? <Stack direction="row" spacing="10px">
                    <Skeleton background="#f5f5f5" variant="circular">
                        <Avatar sx={{ aspectRatio: 1, width: '50px', height: '50px' }} />
                    </Skeleton>
                </Stack>
                : <Avatar
                    sx={{
                        aspectRatio: 1,
                        width: '50px',
                        height: '50px',
                        border: '1px solid #d3d3d3',
                        ...((info?.avatar) ? {
                            padding: 0
                        } : {
                            padding: '7px',
                            backgroundColor: 'whitesmoke'
                        }),
                    }}
                    alt={info?.title}
                    src={info?.avatar ? readUrl(info?.avatar) : require('@/assets/Illustration/no_thumbnail_room.png')} />
            }
            <Box sx={{ width: '100%' }}>
                <Typography sx={{ width: '100%', color: 'black', fontSize: "16px" }} variant="subtitle1">
                    {info?.title || <Skeleton width="30%" />}
                </Typography>

                <Typography
                    sx={{ fontWeight: "500", color: '#696969' }}
                    fontSize="14px"
                    variant="body1">
                    {info?.subtitle || <Skeleton width="20%" />}
                </Typography>
            </Box>
            <IconButton onClick={onToggleRoomDetail} aria-label="emoji">
                <SubjectIcon />
            </IconButton>
        </Stack>
    )
}

export default RoomHeader;