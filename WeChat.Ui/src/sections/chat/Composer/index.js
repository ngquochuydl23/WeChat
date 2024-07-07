import { Box, Popover, Stack } from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import SendIcon from "@mui/icons-material/Send";
import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { uploadMultiFile } from "@/services/storageApi";
import _, { forEach } from "lodash";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import uuidv4 from "@/utils/uuidv4";
import { useSelector } from "react-redux";
import { getFileType } from "@/utils/fileType";
import { getFileFormat, getFileTypeFromMime } from "@/utils/getFileFormat";
import IcPicture from "@/assets/icons/IcPicture";

const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    font-size: 0.875rem;
    font-weight: 500;
    width: 100%;
    font-family: inherit;
    line-height: 1.5;
    padding: 12px;
    background: whitesmoke;
    border-radius: 40px;
    padding-left: 20px;
    color: ${"black"};
    border: none;
    box-shadow: '0 4px 8px rgba(0, 0, 0, 0.16) ,0 0px 4px rgba(0, 0, 0, 0.05)';
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
const Composer = ({ roomId, onSubmitMsg, onTyping, onStopTyping }) => {
    const [timer, setTimer] = useState();
    const [content, setContent] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [typing, setTyping] = useState(false);
    const { user } = useSelector((state) => state.user);
    const [attachments, setAttachments] = useState([]);

    const ref = useRef();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        ref.current?.focus();
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const onEnter = () => {

        if (content.length > 0) {
            onSubmitMsg({
                content: content,
                type: 'text',
                creatorId: user._id,
                roomId: roomId
            });

            setContent('');
        }

        if (attachments.length > 0) {
            uploadMultiFile(attachments)
                .then(({ data }) => {
                    data.files.forEach((attachment, index) => {

                        onSubmitMsg({
                            type: getFileTypeFromMime(attachments[index]),
                            attachment: {
                                url: attachment.url,
                                mime: attachment.mime,
                                fileName: attachments[index].name
                            },
                            creatorId: user._id,
                            roomId: roomId
                        });

                    })
                })
                .catch((err) => console.log(err))
                .finally(() => { setAttachments([]); })
        }

        ref.current?.focus();
    };

    const onTypingMessage = (e) => {
        if (!typing) {
            onTyping();
        }
        setTyping(true);
        setContent(e.target.value);
        clearTimeout(timer);

        const newTimer = setTimeout(() => {
            setTyping(false);
            onStopTyping();
        }, 1000);

        setTimer(newTimer);
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            onEnter(content);
        }
    };

    const handleEmojiClick = (emojiObject, event) => {
        setContent((prevInput) => prevInput + emojiObject.emoji);
    };

    const onPickFile = (event) => {
        var files = event.target.files;

        setAttachments([...attachments, ...files]);
    }

    const removeAttachmentByFileName = (name) => {
        setAttachments(preState => preState.filter(x => x.name !== name))
    }

    return (
        <Stack
            direction="row"
            sx={{ width: "100%", paddingY: "10px", paddingX: "15px", alignItems: "flex-end" }}>
            <Stack
                sx={{
                    width: '100%',
                    backgroundColor: "whitesmoke",
                    borderRadius: attachments.length > 0 ? '15px' : '300px'
                }}>
                {attachments.length > 0 &&
                    <Stack direction="row" mx="15px" mt="15px" spacing="5px">
                        {_.map(attachments, (item) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    height: '80px',
                                    width: '80px',
                                    borderRadius: '15px',
                                    position: 'relative',
                                    justifyContent: 'flex-end'
                                }}>
                                <img
                                    alt={item.name}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        borderRadius: '10px',
                                        objectFit: 'cover',
                                        position: 'relative',
                                        border: '1px solid #d3d3d3'
                                    }}
                                    src={URL.createObjectURL(item)} />
                                <div style={{ position: 'absolute', display: 'flex' }}>
                                    <IconButton
                                        onClick={() => removeAttachmentByFileName(item.name)}
                                        size="small"
                                        sx={{
                                            margin: '5px',
                                            height: '24px',
                                            width: '24px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            '&:hover': {
                                                backgroundColor: 'white'
                                            }
                                        }}>
                                        <CloseIcon sx={{ height: '15px', width: '15px' }} />
                                    </IconButton>
                                </div>
                            </Box>
                        ))}
                        <Box
                            onClick={() => document?.getElementById("pick-image")?.click()}
                            sx={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                                height: '80px',
                                width: '80px',
                                color: 'gray',
                                borderRadius: '15px',
                                border: '2px dashed #d3d3d3',
                                '&:hover': {
                                    backgroundColor: '#f9f9f9'
                                }
                            }}>
                            <AddIcon />
                        </Box>
                    </Stack>
                }
                <Textarea
                    ref={ref}
                    autoFocus
                    onKeyDown={onKeyDown}
                    maxRows="5"
                    value={content}
                    onChange={onTypingMessage}
                    placeholder="Soạn tin nhắn"
                />
            </Stack>

            <Stack direction="row">
                <IconButton
                    aria-label="attach-file"
                    onClick={() => document?.getElementById("pick-file")?.click()}>
                    <AttachFileIcon />
                </IconButton>
                <IconButton
                    onClick={() => document?.getElementById("pick-image")?.click()}
                    aria-label="photos">
                    <IcPicture />
                </IconButton>
                <IconButton
                    aria-label="emoji"
                    onClick={handleClick}>
                    <TagFacesIcon />
                </IconButton>
                {(content.length > 0 || attachments.length > 0) && (
                    <IconButton
                        onClick={onEnter}
                        aria-label="emoji">
                        <SendIcon sx={{ color: '#07C160' }} />
                    </IconButton>
                )}
            </Stack>
            <Popover
                style={{ boxShadow: "2px 6px 18px" }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}>
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    open={open} />
            </Popover>
            <input
                onChange={onPickFile}
                style={{ display: "none" }}
                type="file"
                multiple
                accept="image/*"
                id="pick-image"
            />
            <input
                onChange={onPickFile}
                style={{ display: "none" }}
                type="file"
                multiple
                accept="application/*"
                id="pick-file"
            />
        </Stack>
    );
};

export default Composer;
