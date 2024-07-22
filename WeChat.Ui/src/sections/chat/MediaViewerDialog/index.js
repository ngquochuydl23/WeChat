import React, { useEffect, useState } from "react";
import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    Stack,
} from "@mui/material";
import { readUrl } from "@/utils/readUrl";
import CloseIcon from '@mui/icons-material/Close';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { mediaViewerSubject } from "@/pages/chat/ChatPage";
import _ from "lodash";


const MediaViewerDialog = ({ open, onClose }) => {
    const [selectPosition, setSelectPosition] = useState(0);
    const [medias, setMedias] = useState([]);

    mediaViewerSubject.subscribe({
        next: (medias) => {
            setMedias(medias)
        }
    });

    const closeDialog = () => {
        setMedias([]);
        setSelectPosition(0);
        onClose();
    }

    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                closeDialog()
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
            onClose={closeDialog}>
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
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton
                            sx={{ position: 'relative', color: 'white', display: 'flex', mr: '15px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            onClick={closeDialog}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ height: '70vh', overflow: 'hidden', borderRadius: '20px', maxWidth: '70vw' }}>
                        {(medias && medias.length > 0) &&
                            <TransformWrapper>
                                <TransformComponent>
                                    <img
                                        alt=""
                                        src={readUrl(medias[selectPosition].url)}
                                        style={{ height: '70vh', objectFit: 'fill' }}
                                    />
                                </TransformComponent>
                            </TransformWrapper>
                        }
                    </Box>
                    <Stack direction="row" mt="20px">
                        {_.map(medias, (media, index) => {
                            return (
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        height: '80px',
                                        width: '80px',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '10px',
                                        border: index === selectPosition ? '3px solid #07C160' : 'none'
                                    }}>
                                    <img
                                        alt=""
                                        src={readUrl(media.url)}
                                        style={{ height: '70px', width: '70px', objectFit: 'cover', borderRadius: '7.5px' }}
                                    />
                                </Box>
                            )
                        })}
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default MediaViewerDialog;
