import { Popover, Stack } from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import SendIcon from "@mui/icons-material/Send";
import { useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import SendFileMsgDialog from "./SendFileMsgDialog";


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
const Composer = ({ onSubmitMsg, onTyping, onStopTyping, onSendFileMsg }) => {
  const [timer, setTimer] = useState();
  const [content, setContent] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [typing, setTyping] = useState(false);
  const [file, setFile] = useState(null);

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
      onSubmitMsg(content);
      setContent("");
      ref.current?.focus();
    }
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
    var file = event.target.files[0];
    console.log(file);
    setFile(file);
  }

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        backgroundColor: "white",
        paddingY: "10px",
        paddingX: "15px",
        alignItems: "flex-end",
      }}>
      <Textarea
        ref={ref}
        autoFocus
        onKeyDown={onKeyDown}
        maxRows="5"
        value={content}
        onChange={onTypingMessage}
        placeholder="Soạn tin nhắn"
      />
      <Stack direction="row">
        <IconButton
          aria-label="attach-file"
          onClick={() => document?.getElementById("pick-file")?.click()}>
          <AttachFileIcon />
        </IconButton>
        <IconButton
          onClick={() => document?.getElementById("pick-image")?.click()}
          aria-label="photos">
          <CropOriginalIcon />
        </IconButton>
        <IconButton
          aria-label="emoji"
          onClick={handleClick}>
          <TagFacesIcon />
        </IconButton>
        {content.length > 0 && (
          <IconButton
            onClick={onEnter}
            aria-label="emoji">
            <SendIcon sx={{ color: "#0162C4" }} />
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
      <SendFileMsgDialog
        file={file}
        open={Boolean(file)}
        onClose={() => setFile(null)}
        onSendMsg={onSendFileMsg} />
    </Stack>
  );
};

export default Composer;
