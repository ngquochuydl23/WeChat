
import { getDevices } from "@/services/deviceApiService";
import { Box, CircularProgress, Icon, Stack, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import _ from "lodash";
import { useEffect, useState } from "react";


const DeviceItem = ({
    isCurrentDevice,
    deviceToken,
    deviceName,
    platform,
    appVersion,
    appName,
    lastAccess,
    location
}) => {
    return (
        <Stack direction="row" bgcolor="whitesmoke" px="15px" py="10px" borderRadius="10px">
            <Icon>

            </Icon>
            <Box>
                <Typography fontWeight="600" fontSize="14px">
                    {deviceName}
                </Typography>
                <Typography mt="5px" fontWeight="500" fontSize="14px" color="black">
                    {appName} - {appVersion}
                </Typography>
                <Typography fontWeight="400" fontSize="14px" color="gray">
                    {location}
                </Typography>
            </Box>
        </Stack>
    )
}

const DeviceManagementTabContent = () => {
    const [loading, setLoading] = useState(false);
    const [devices, setDevices] = useState([]);

    const getCurrentDeviceId = () => {
        const token = localStorage.getItem("social-v2.wechat.accessToken");
        const { deviceId } = jwtDecode(token);
        return deviceId;
    }

    const getCurrentDevice = () => {
        return _.find(devices, x => x._id === getCurrentDeviceId());
    }

    const getOtherDevices = () => {
        return _.filter(devices, x => x._id !== getCurrentDeviceId())
    }

    useEffect(() => {
        setLoading(true);
        getDevices()
            .then(({ result }) => { setDevices(result.devices) })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false))
    }, [])


    return (
        <>
            {loading
                ? <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                    <CircularProgress />
                </Box>
                : <Box sx={{ width: '100%' }}>
                    <Box mb="20px">
                        <Typography fontWeight="500" fontSize="14px" mb="20px">
                            {`Thiết bị hiện tại`}
                        </Typography>
                        <DeviceItem
                            isCurrentDevice={true}
                            {...(getCurrentDevice())}
                        />
                    </Box>
                    {getOtherDevices().length > 0 &&
                        <Box>
                            <Typography fontWeight="500" fontSize="14px" mb="20px">
                                {`Thiết bị khác`}
                            </Typography>
                            <Stack direction="column" spacing="15px">
                                {_.map(getOtherDevices(), device => {
                                    return (
                                        <DeviceItem
                                            isCurrentDevice={false}
                                            {...device} />
                                    )
                                })}
                            </Stack>
                        </Box>
                    }
                </Box>
            }
        </>
    )
}

export default DeviceManagementTabContent;