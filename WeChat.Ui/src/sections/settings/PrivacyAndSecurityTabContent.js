import { Box, Icon, Stack, Typography } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IcTwoStepAuthentication from "@/assets/icons/IcTwoStepAuthentication";
import IcUserBlock from "@/assets/icons/IcUserBlock";


const PrivacyAndSecurityTabContent = ({ onNavigate }) => {
    return (
        <Stack direction="column" spacing="15px">
            <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" fontSize="15x">Xác thực 2 lớp</Typography>
                <Box mt="10px" bgcolor="white" borderRadius="15px" padding="15px" display="flex" justifyContent="space-between">
                    <Stack direction="row">
                        <Icon>
                            <IcTwoStepAuthentication />
                        </Icon>
                        <Typography ml="15px" fontSize="14px">Cài đặt xác thực 2 lớp</Typography>
                    </Stack>
                    <ArrowForwardIosIcon sx={{ color: 'gray' }} fontSize="14px" />
                </Box>
            </Box>
            <Box sx={{ width: '100%' }} onClick={() => onNavigate('block-users')}>
                <Typography variant="subtitle1" fontSize="15x">Chặn tin nhắn</Typography>
                <Box mt="10px" bgcolor="white" borderRadius="15px" padding="15px" display="flex" justifyContent="space-between">
                    <Stack direction="row">
                        <Icon>
                            <IcUserBlock />
                        </Icon>
                        <Typography ml="15px" fontSize="14px">Danh sách chặn</Typography>
                    </Stack>
                    <ArrowForwardIosIcon sx={{ color: 'gray' }} fontSize="14px" />
                </Box>
            </Box>
        </Stack>
    )
}

export default PrivacyAndSecurityTabContent;