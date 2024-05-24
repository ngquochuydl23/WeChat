import {
  Typography,
  Stack,
  Avatar,
  Box,
  Chip,
  Tooltip,
  IconButton,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemIcon,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReplayIcon from "@mui/icons-material/Replay";
import { enqueueSnackbar } from "notistack";
import { filterMsgSystem } from "../../utils/fitlerMsg";
import { readUrl } from "../../utils/readUrl";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export const NotificationMessage = ({ user, content, members }) => {
  return (
    <Stack
      px="15px"
      py="10px"
      justifyContent="center"
      spacing="15px"
      bgcolor="whitesmoke"
      direction="row"
    >
      {content === "created this room." && (
        <Chip
          sx={{
            fontSize: "12px",
            justifyContent: "flex-start",
            color: "rgb(1,98,196)",
            fontWeight: "600",
          }}
          avatar={<Avatar src={user.avatar} />}
          label={
            <Typography fontSize="14px" fontWeight="600">
              {user.fullName}
              <span style={{ fontWeight: "400" }}>
                {filterMsgSystem(content)}
              </span>
            </Typography>
          }
        />
      )}
      {/^add/.test(content) && (
        <Chip
          sx={{
            fontSize: "12px",
            justifyContent: "flex-start",
            color: "rgb(1,98,196)",
            fontWeight: "600",
          }}
          avatar={<Avatar src={user.avatar} />}
          label={
            <Typography fontSize="14px" fontWeight="600">
              {user.fullName}
              <span style={{ fontWeight: "400" }}>
                {filterMsgSystem(content, members)}
              </span>
            </Typography>
          }
        />
      )}
    </Stack>
  );
};

const MsgContent = ({ type = "text", content, attachment }) => {
  return (
    <Stack sx={{ maxWidth: "700px", minWidth: "100px" }} direction="column">
      {type === "image" && attachment && (
        <img
          alt={attachment.fileName}
          style={{
            objectFit: "cover",
            marginTop: "10px",
            borderRadius: content ? "15px 15px 0px 0px " : "15px",
            width: "200px",
            height: "200px",
            marginBottom: content ? "0px" : "10px",
          }}
          src={readUrl(attachment.url)}
        />
      )}
      {type === "file" && attachment && (
        <Stack
          direction="row"
          sx={{
            height: '70px',
            minWidth: '300px',
            padding: "10px",
            alignItems: 'center',
            borderRadius: content ? '15px 15px 0px 0px ' : '10px',
            marginBottom: content ? '0px' : '10px',
            backgroundColor: "white",
          }}
        >
          <Box
            sx={{
              marginLeft: "10px",
              height: "40px",
              width: "40px",
              aspectRatio: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "200px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <AttachFileIcon />
          </Box>
          <Box
            onClick={() => window.location.assign(attachment.url)}
            sx={{ width: "100%", marginX: "10px" }}
          >
            <Typography fontWeight="700" fontSize="14px">
              {attachment.fileName || "Không xác định"}
            </Typography>
            <Typography fontWeight="500" fontSize="14px">
              {attachment.fileSize || "Không xác định"}
            </Typography>
          </Box>
        </Stack>
      )}
      {content && content.length > 0 && (
        <Stack
          sx={{
            padding: "10px",
            borderRadius: (attachment) ? '0px 0px 15px 15px' : '10px',
            backgroundColor: "white",
          }}
          direction="column"
        >
          <Typography
            color="black"
            fontWeight="500"
            fontSize="15px"
            variant="body1"
          >
            {content}
          </Typography>
          <Typography
            alignSelf="flex-end"
            mt="5px"
            color="black"
            fontWeight="500"
            fontSize="12px"
            variant="body1"
          >
            {"20:54"}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export const LeftMessage = ({
  user,
  content,
  redeem = false,
  type = "text",
  attachment,
}) => {
  return redeem ? (
    <Stack spacing="15px" bgcolor="whitesmoke" mb="10px" direction="row">
      <Avatar alt={user.fullName} src={user.avatar} />
      <Box
        sx={{
          display: "flex",
          alignSelf: "flex-end",
          marginInlineEnd: "15px",
          borderRadius: "15px",
          minWidth: "180px",
          maxWidth: "350px",
          justifyContent: "flex-end",
          border: "2px solid #d3d3d3",
          paddingX: "7px",
          paddingY: "7px",
          marginBottom: "10px",
        }}
      >
        <Typography
          color="black"
          fontWeight="500"
          fontStyle="italic"
          fontSize="15px"
          variant="body1"
        >
          {user.fullName} đã thu hồi tin nhắn.
        </Typography>
      </Box>
    </Stack>
  ) : (
    <Stack mb="10px" spacing="15px" bgcolor="whitesmoke" direction="row">
      <Avatar alt={user.fullName} src={user.avatar} />
      <Box>
        <Typography sx={{ fontSize: "13px", mb: "5px" }}>
          {user.fullName}
        </Typography>
        <MsgContent content={content} type={type} attachment={attachment} />
      </Box>
    </Stack>
  );
};

export const RightMessage = ({
  content,
  seen = false,
  sent = true,
  onRedeemMsg,
  msgId,
  redeem = false,
  type,
  attachment,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        enqueueSnackbar(`Sao chép vào clipboard thành công`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });

        handleClose();
      })
      .catch((error) => {
        console.error("Lỗi khi sao chép tin nhắn vào clipboard: ", error);
      });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return redeem ? (
    <Box
      sx={{
        marginBottom: "10px",
        display: "flex",
        alignSelf: "flex-end",
        borderRadius: "15px",
        width: "180px",
        justifyContent: "flex-end",
        border: "2px solid #d3d3d3",
        paddingX: "7px",
        paddingY: "7px",
      }}
    >
      <Typography
        textAlign="center"
        color="black"
        fontWeight="500"
        fontStyle="italic"
        fontSize="15px"
        variant="body1"
      >
        {"Bạn đã thu hồi tin nhắn"}
      </Typography>
    </Box>
  ) : (
    <Stack
      mb="10px"
      justifyContent="flex-end"
      spacing="15px"
      bgcolor="whitesmoke"
      direction="row"
    >
      <IconButton
        size="small"
        sx={{ aspectRatio: 1 }}
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List>
          <ListItemButton
            onClick={() => {
              copyToClipboard(content);
            }}
          >
            <ListItemIcon>
              <ContentCopyIcon />
            </ListItemIcon>
            <ListItemText primary="Sao chép tin nhắn" />
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={() => onRedeemMsg(msgId)}>
            <ListItemIcon>
              <ReplayIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Thu hồi tin nhắn" sx={{ color: "red" }} />
          </ListItemButton>
        </List>
      </Popover>
      <MsgContent content={content} type={type} attachment={attachment} />
    </Stack>
  );
};
