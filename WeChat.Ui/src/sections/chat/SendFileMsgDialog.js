import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Box, Divider, Stack, } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import { getFileType } from '../../utils/fileType';
import { readUrl } from '../../utils/readUrl';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LinearProgress from '@mui/material/LinearProgress';

const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
      box-sizing: border-box;
      font-size: 0.875rem;
      font-weight: 500;
      width: 100%;
      font-family: inherit;
      line-height: 1.5;
      padding: 12px;
      border-radius: 12px 12px 12px 12px;
      color: ${"black"};
      background: white;
      border: none;
      resize: none;
      font-size: 14px;
      &:hover {
        
      }
      &:focus {
        outline: 0;
      }
      // firefox
      &:focus-visible {
        outline: 0;
      }
    `
);

const SendFileMsgDialog = ({
    open,
    onClose,
    file,
    onSendMsg
}) => {
    const ref = useRef();
    const [content, setContent] = useState('');
    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        if (file) {
            console.log(file);
            var bodyFormData = new FormData();
            bodyFormData.append('', file);

            axios({
                method: "post",
                url: process.env.REACT_APP_API_ENDPOINT + 'storage/upload',
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": localStorage.getItem("accessToken")
                },
            })
                .then(res => {
                    setAttachment({
                        ...(res.data.files[0]),
                        fileName: file.name,
                        fileSize: file.size
                    });
                })
                .catch(err => console.log(err))
        }
    }, [file])

    return (
        <Dialog
            open={open}
            scroll={"body"}
            onClose={onClose}
            maxWidth="md"
            aria-labelledby="profile-modal-title"
            aria-describedby="profile-modal-description">
            <DialogTitle
                sx={{ fontWeight: '800', m: 0, p: 2 }}
                id="customized-dialog-title">
                Gửi hình ảnh
            </DialogTitle>
            <Divider />
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}>
                <CloseIcon />
            </IconButton>
            <DialogContent
                sx={{ p: 0 }}
                dividers>
                {(file && getFileType(file) === 'image') &&
                    <img
                        style={{
                            marginLeft: '10px',
                            marginRight: '10px',
                            objectFit: 'cover',
                            width: '400px',
                            height: '400px',
                            borderRadius: '20px'
                        }}
                        alt={file.name}
                        src={attachment ? readUrl(attachment?.url) : URL.createObjectURL(file)}
                    />
                }
                {(file && getFileType(file) === 'file') &&
                    <Stack
                        direction="row"
                        sx={{
                            width: '400px',
                            height: '70px',
                            padding: "10px",
                            alignItems: 'center',
                            borderRadius: "10px",
                            backgroundColor: "whitesmoke",
                        }}>
                        <Box
                            sx={{
                                marginLeft: '10px',
                                height: '40px',
                                width: '40px',
                                aspectRatio: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '200px',
                                backgroundColor: 'white'
                            }}>
                            <AttachFileIcon />
                        </Box>
                        <Box
                            onClick={() => window.location.assign(attachment.url)}
                            sx={{ width: '100%', marginX: '10px' }}>
                            <Typography
                                fontWeight="700"
                                fontSize="14px">
                                {attachment ? attachment.fileName : file.name}
                            </Typography>
                            <Typography
                                fontWeight="500"
                                fontSize="14px">
                                {attachment ? attachment.fileSize : file.size}
                            </Typography>
                        </Box>
                    </Stack>
                }
                {(file && !attachment) &&
                    <LinearProgress />
                }
                <Divider sx={{ mt: '10px' }} />
                <Textarea
                    ref={ref}
                    autoFocus
                    maxRows="5"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Soạn tin nhắn"
                />
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button
                    onClick={onClose}
                    variant='contained'
                    color='error' >
                    Hủy
                </Button>
                <Button
                    disabled={!attachment}
                    onClick={() => {
                        onSendMsg({
                            type: getFileType(file),
                            content,
                            attachment
                        });
                        onClose();
                        setContent('');
                        setAttachment(null);
                    }}
                    variant='contained'
                    color='info'
                    autoFocus >
                    Gửi
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SendFileMsgDialog;