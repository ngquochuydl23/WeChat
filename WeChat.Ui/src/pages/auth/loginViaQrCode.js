import { Link as RouterLink, useNavigate } from "react-router-dom"
import {
    Stack,
    Typography,
    Link,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Box,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    CircularProgress
} from "@mui/material";
import React, { useEffect, useState } from "react";
import platform from "platform";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/slices/userSlice";
import { socketManager } from "@/socket";
import generateQrCode from "@/utils/qrCodeGenerateUtil";


const socket = socketManager('QRCodeAuth');

const LoginViaQrCode = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [generating, setGenerating] = useState(true);

    const onConnected = () => {
        setLoading(false);
    }

    const onDisconnected = () => {
        setLoading(false);
    }

    const onGeneratedQrCode = ({ token }) => {
        setGenerating(false);
        console.log(token);
        const qrCode = generateQrCode(token, require('@/assets/wechat_logo.png'), 280);

        if (document.getElementById("canvas").lastElementChild !== null) {
            document.getElementById("canvas")
                .removeChild(document.getElementById("canvas").lastElementChild);
        }
        qrCode.append(document.getElementById("canvas"));
    }

    const onMobileScanned = (user, payload) => {
        console.log("onMobileScanned");
    }

    useEffect(() => {
        if (socket.connected) {
            const deviceName = platform.name + " v" + platform.version;
            const os = platform.os.family + ' ' + platform.os.version;

            socket.emit('generateQRCode', { deviceName, os }, onGeneratedQrCode);
        }

        return () => {
            socket.emit('leave', 1234);
        };
    }, [socket.connected]);

    useEffect(() => {
        setGenerating(true);
        socket.on('connect', onConnected);
        socket.on('disconnect', onDisconnected);
        socket.on('mobile.scan', onMobileScanned);

        return () => {
            socket.off('connect', onConnected);
            socket.off('mobile.scan')
            socket.off('disconnect', onDisconnected);
        }
    }, []);

    return (
        <Stack alignItems="center">
            <Box
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
    )
}
export default LoginViaQrCode;