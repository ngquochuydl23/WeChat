import { Box, Icon, Stack, Typography } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IcTwoStepAuthentication from "@/assets/icons/IcTwoStepAuthentication";
import IcUserBlock from "@/assets/icons/IcUserBlock";


const PrivacyAndSecurityTabContent = ({ onNavigate }) => {
    return (
        <Stack direction="column" spacing="15px" bgcolor='white'>
            <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" fontSize="15x" px="24px">Xác thực 2 lớp</Typography>
                <Box

                    mt="10px"
                    bgcolor="white"
                    borderRadius="5px"
                    paddingY="15px"
                    display="flex"
                    px="24px"
                    justifyContent="space-between"
                    sx={{
                        "&:hover": {
                            backgroundColor: 'whitesmoke',
                        }
                    }}>
                    <Stack direction="row">
                        <Icon>
                            <IcTwoStepAuthentication />
                        </Icon>
                        <Typography ml="15px" fontSize="15px" fontWeight="500">Cài đặt xác thực 2 lớp</Typography>
                    </Stack>
                    <ArrowForwardIosIcon sx={{ color: 'gray' }} fontSize="14px" />
                </Box>
            </Box>
            <Box
                sx={{ width: '100%' }}
                onClick={() => onNavigate('block-users')}>
                <Typography variant="subtitle1" fontSize="15x" px="24px" >Chặn tin nhắn</Typography>
                <Box
                    px="24px"
                    mt="10px"
                    bgcolor="white"
                    borderRadius="5px"
                    paddingY="15px"
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                        "&:hover": {
                            backgroundColor: 'whitesmoke'
                        }
                    }}>
                    <Stack direction="row">
                        <Icon>
                            <IcUserBlock />
                        </Icon>
                        <Typography ml="15px" fontSize="15px" fontWeight="500">Danh sách chặn</Typography>
                    </Stack>
                    <ArrowForwardIosIcon sx={{ color: 'gray' }} fontSize="14px" />
                </Box>
            </Box>
        </Stack>
    )
}

export default PrivacyAndSecurityTabContent;