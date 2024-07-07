import React, { useState } from "react";
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


const MediaViewerDialog = ({
    open,
    onClose,
    medias
}) => {
  

    return (
        <Dialog
            disableBackdropClick={true}
            open={open}
            fullWidth
            maxWidth='sm'
            scroll={"body"}
            onClose={onClose}>
            <DialogTitle sx={{ m: 0, px: 2, py: '7.5px', borderBottom: 'none' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    Thông tin cá nhân
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ padding: 0 }}>
               
                   
                  
               
            </DialogContent>
          
        </Dialog>
    );
};

export default MediaViewerDialog;
