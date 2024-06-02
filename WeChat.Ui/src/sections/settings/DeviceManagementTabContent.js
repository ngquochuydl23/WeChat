
import { getDevices } from "@/services/deviceApiService";
import { Box, Card, CircularProgress, Icon, Stack, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import _ from "lodash";
import { useEffect, useState } from "react";
import platform from "platform";
import IcFirefoxBrowser from "@/assets/icons/IcFirefoxBrower";
import IcGoogleChormeBrowser from "@/assets/icons/IcGoogleChromeBrowser";
import IcAndroid from "@/assets/icons/IcAndroid";
import IcMsEdgeBrowser from "@/assets/icons/IcMsEdgeBrowser";
import IcOperaBrowser from "@/assets/icons/IcOperaBrowser";
import IcSafariBrowser from "@/assets/icons/IcSafariBrowser";
import IcIos from "@/assets/icons/IcIos";

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
    const FilterPlatformView = () => {
        return (
            <Icon sx={{ height: '56px', width: '56px', padding: '10px', borderRadius: '15px' }}>
                {(platform === 'ios') &&
                    <IcIos />
                }
                {(platform === 'android') &&
                    <IcAndroid />
                }
                {(platform === 'browser' && deviceName.includes("Chrome")) &&
                    <IcGoogleChormeBrowser />
                }
                {(platform === 'browser' && deviceName.includes("Firefox")) &&
                    <IcFirefoxBrowser />
                }
                {(platform === 'browser' && deviceName.includes("Microsoft Edge")) &&
                    <IcMsEdgeBrowser />
                }
                {(platform === 'browser' && deviceName.includes("Opera")) &&
                    <IcOperaBrowser />
                }
                {(platform === 'browser' && deviceName.includes("Safari")) &&
                    <IcSafariBrowser />
                }
            </Icon>
        )
    }
    return (
        <Stack
            direction="row"
            bgcolor="white"
            px="15px"
            py="10px"
            borderRadius="10px"
            sx={{ border: '0.2px solid #d3d3d3' }}>
            <FilterPlatformView />
            <Box ml="15px">
                <Typography fontWeight="600" fontSize="15px">
                    {deviceName}
                </Typography>
                <Typography mt="5px" fontWeight="500" fontSize="13.5px" color="black">
                    {appName} - {appVersion}
                </Typography>
                {location &&
                    <Typography fontWeight="400" fontSize="13.5px" color="gray">
                        {location.city}, {location.country}
                    </Typography>
                }
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
                ?
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                    <CircularProgress />
                </Box>
                : <Box sx={{ width: '100%', paddingX: '24px' }}>
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