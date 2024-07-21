import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { readUrl } from "@/utils/readUrl";
import { filterRoomInfo } from "@/utils/filterRoomInfo";
import { useFormik } from "formik";
import * as Yup from "yup";
import { patchRoomTitle } from "@/services/roomApiService";

const RenameRoomDialog = ({ open, onClose, room, loggingUserId, members }) => {
    const info = filterRoomInfo(loggingUserId, room, members);

    const handleClose = () => {
        formik.resetForm();
        onClose();
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: info.title || '',
        },
        validationSchema: Yup.object().shape({
            title: Yup
                .string()
                .required('Tên không được để trống'),
        }),
        onSubmit: async values => {
            if (room.singleRoom) {

            } else {
                patchRoomTitle(room._id, values.title)
                    .then(({ result }) => {
                        console.log(result);
                        handleClose();
                    })
                    .catch((err) => console.log(err))
            }
        },
    });




    return (
        <Dialog
            disableBackdropClick={true}
            open={open}
            fullWidth
            maxWidth='xs'
            scroll={"body"}
            onClose={onClose}>
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle sx={{ m: 0, px: 2, py: '7.5px', borderBottom: 'none' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        {room.singleRoom ? "Đặt biệt hiệu" : "Đổi tên nhóm"}
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ padding: 0 }}>
                    <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', width: '100%', paddingX: '30px' }} >
                        <Avatar
                            sx={{
                                width: "90px",
                                height: "90px",
                                position: 'relative',
                                mt: '15px',
                                ...((info.avatar) ? {
                                    padding: 0,
                                    border: '5px solid #d3d3d3',
                                } : {
                                    padding: '7px',
                                    backgroundColor: 'whitesmoke',
                                    border: '1px solid #d3d3d3',
                                }),
                            }}
                            alt={info.title}
                            src={info.avatar ? readUrl(info.avatar) : require('@/assets/Illustration/no_thumbnail_room.png')} />
                        <Typography fontSize="14px" fontWeight="500" my="20px" textAlign="center">
                            {`Bạn có chắc muốn đổi tên nhóm, khi xác nhận tên nhóm mới sẽ hiện với tất cả thành viên.`}
                        </Typography>
                        <TextField
                            autoFocus
                            sx={{ marginX: '30px', width: '100%' }}
                            InputProps={{ height: '30px' }}
                            size="small"
                            disabled={false}
                            label="Tên mới"
                            id="title"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.title && formik.touched.title}
                            helperText={formik.errors.title}
                            value={formik.values.title}
                            onFocus={event => {
                                event.target.select();
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ marginTop: '15px' }}>
                    <Button sx={{ color: 'gray' }} variant="text" type="button" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="text" type="submit">
                        Đổi tên
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RenameRoomDialog;
