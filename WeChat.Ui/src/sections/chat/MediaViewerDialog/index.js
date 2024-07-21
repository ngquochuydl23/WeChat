import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { readUrl } from "@/utils/readUrl";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { uploadFile } from "@/services/storageApi";
import { changeAvatar } from "@/services/profileApiService";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import moment from "moment/";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const MediaViewerDialog = ({ open, onClose, medias }) => {
    const [selectPosition, setSelectPosition] = useState(0);
    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                onClose()
            }
        }
        window.addEventListener('keydown', close)
        return () => window.removeEventListener('keydown', close)
    }, [])

    return (
        <Dialog
            open={open}
            fullWidth
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}
            fullScreen
            sx={{ backgroundColor: 'transparent' }}
            scroll={"body"}
            onClose={onClose}>
            <DialogContent sx={{ padding: 0 }}>
                <Box
                    sx={{
                        position: 'relative',
                        height: '100vh',
                        width: '100%',
                        flexDirection: 'column',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }}>
                    <Box sx={{ maxHeight: '70vh', overflow: 'hidden', borderRadius: '20px', maxWidth: '70vw' }}>
                        <TransformWrapper>
                            <TransformComponent>
                                <img
                                    alt=""
                                    src={readUrl('/api/bucket/665084baa340536c521c22b1/MWE3YWY5MDMzOTMxZjlkOWE3Yjg3MGY3OTA4Y2UyNjIuanBn')}
                                    style={{ height: '100%', width: '100%' }}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </Box>
                    <Stack direction="row" mt="20px">
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                height: '80px',
                                width: '80px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                border: '3px solid #07C160'
                            }}>
                            <img
                                alt=""
                                src={readUrl('/api/bucket/665084baa340536c521c22b1/MWE3YWY5MDMzOTMxZjlkOWE3Yjg3MGY3OTA4Y2UyNjIuanBn')}
                                style={{ height: '70px', width: '70px', objectFit: 'cover', borderRadius: '7.5px' }}
                            />
                        </Box>
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                height: '80px',
                                width: '80px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '10px',
                            }}>
                            <img
                                alt=""
                                src={readUrl('/api/bucket/665084baa340536c521c22b1/MWE3YWY5MDMzOTMxZjlkOWE3Yjg3MGY3OTA4Y2UyNjIuanBn')}
                                style={{ height: '70px', width: '70px', objectFit: 'cover', borderRadius: '7.5px' }}
                            />
                        </Box>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default MediaViewerDialog;
