import { Link as RouterLink, useNavigate } from "react-router-dom"
import {
    Stack,
    Typography,
    Button,
    Box,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Avatar
} from "@mui/material";
import React, { useEffect, useState } from "react";
import platform from "platform";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/slices/userSlice";
import { socketManager } from "@/socket";
import generateQrCode from "@/utils/qrCodeGenerateUtil";
import { readUrl } from "@/utils/readUrl";


const socket = socketManager('QRCodeAuth');

const LoginViaQrCode = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [generating, setGenerating] = useState(true);
    const [loggingUser, setLoggingUser] = useState(null);

    const requestGenerateQrCode = () => {
        const deviceName = platform.name + " v" + platform.version;
        const os = platform.os.family + ' ' + platform.os.version;

        socket.emit('generateQRCode', { deviceName, os }, onGeneratedQrCode);
    }

    const onConnected = () => {
        setLoading(false);
        requestGenerateQrCode();
    }

    const onDisconnected = () => {
        setLoading(false);
    }

    const onGeneratedQrCode = ({ token }) => {
        setGenerating(false);
        const qrCode = generateQrCode(token, require('@/assets/wechat_logo.png'), 280);

        var canvasHtml = document.getElementById("canvas");
        if (canvasHtml === null) {
            return;
        }

        if (canvasHtml?.lastElementChild !== null) {
            canvasHtml.removeChild(canvasHtml?.lastElementChild);
        }
        qrCode.append(canvasHtml);
    }

    const onMobileScanned = (user, payload) => {
        setLoggingUser(user);
    }

    const onLoggingIn = (accessToken) => {

    }

    const onReject = () => {
        setLoggingUser(null);
    }

    useEffect(() => {
        requestGenerateQrCode();
    }, [socket.connected]);

    useEffect(() => {
        setGenerating(true);

        socket.on('connect', onConnected);
        socket.on('disconnect', onDisconnected);
        socket.on('mobile.scan', onMobileScanned);
        socket.on('mobile.loggingIn', onLoggingIn);
        socket.on('mobile.reject', onReject);
        socket.on("connect_error", (err) => {
            console.log(err);
        });

        return () => {
            socket.off('connect', onConnected);
            socket.off('mobile.scan', onMobileScanned);
            socket.off('mobile.loggingIn', onLoggingIn);
            socket.off('mobile.reject', onReject);
            socket.off("connect_error");
            socket.off('disconnect', onDisconnected);
        }
    }, []);

    return (
        <Stack alignItems="center">
            {loggingUser
                ? <Box
                    mt="100px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    sx={{ width: '100%' }}>
                    <Typography fontSize="22px" fontWeight="800" mt="20px">
                        Đăng nhập trên thiết bị di động
                    </Typography>
                    <Avatar
                        sx={{ height: '100px', width: '100px', border: '5px solid #d3d3d3', marginTop: '50px' }}
                        alt={loggingUser.fullName}
                        src={readUrl(loggingUser.avatar)} />
                    <Typography fontSize="20px" fontWeight="600" mt="20px">
                        {loggingUser.fullName}
                    </Typography>
                    <Typography textAlign="center" width="70%" mt="10px">
                        Quét mã đăng nhập thành công. Vui lòng chọn "Đăng nhập" trên thiết bị di động của bạn
                    </Typography>
                </Box>
                : <Box
                    mt="30px"
                    sx={{
                        display: 'flex',
                        padding: '10px',
                        bgcolor: generating ? 'white' : 'whitesmoke',
                        width: '300px',
                        height: '300px',
                        borderRadius: '20px',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <div id="canvas" />
                    {generating && <CircularProgress color="success" />}
                </Box>
            }
            {!loggingUser &&
                <Stack alignItems="center">
                    <Typography fontSize="20px" fontWeight="700" mt="30px">
                        Đăng nhập WeChat bằng mã QR Code
                    </Typography>
                    <Stepper activeStep={0} sx={{ mt: '20px' }} orientation="vertical">
                        <Step key={1} >
                            <StepLabel >
                                <Typography fontSize="16px" fontWeight="500">
                                    {`Mở WeChat trên điện thoại của bạn`}
                                </Typography>
                            </StepLabel>
                        </Step>
                        <Step key={2} active>
                            <StepLabel>
                                <Typography fontSize="16px" fontWeight="500">
                                    {`Bấm vào thanh menu chọn Quét Mã`}
                                </Typography>
                            </StepLabel>
                        </Step>
                        <Step key={3} active>
                            <StepLabel>
                                <Typography fontSize="16px" fontWeight="500">
                                    {`Đưa điện thoại vào mà QR để đăng nhập`}
                                </Typography>
                            </StepLabel>
                        </Step>
                    </Stepper>
                    <Button

                        onClick={() => navigate('/auth/loginViaPhoneNumber')}
                        variant="outlined" sx={{ mt: '20px' }}>
                        Đăng nhập với số điện thoại
                    </Button>
                </Stack>
            }

        </Stack>
    )
}
export default LoginViaQrCode;