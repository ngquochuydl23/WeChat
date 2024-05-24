import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SearchRounded } from "@mui/icons-material";
import _ from "lodash";
import axios from "axios";

function FindRoomChat({ open, onClose }) {
  const [searchText, setSearchText] = React.useState("");
  const [findingResult, setFindingResult] = React.useState([]);

  const findUser = async (text) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        process.env.REACT_APP_API_ENDPOINT + `user/?search=${text}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFindingResult(response.data.users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      findUser(searchText);
    }, 200);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchText]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Stack p={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Tìm kiếm phòng trò chuyện
        </Typography>
        <TextField
          fullWidth
          id="search"
          label="Nhập tên phòng hoặc tên người dùng"
          variant="outlined"
          InputProps={{
            startAdornment: <SearchRounded color="disabled" />,
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Typography variant="h6" align="left" gutterBottom>
          Kết quả tìm kiếm
        </Typography>
        <Box sx={{ maxHeight: 300, overflow: "auto" }}>
          <List sx={{ height: 300 }}>
            {findingResult.length > 0 ? (
              _.map(findingResult, (user) => (
                <ListItemButton
                  key={user._id}
                  onClick={() => {
                    onClose();
                  }}
                >
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText primary={user.fullName} />
                </ListItemButton>
              ))
            ) : (
              <Typography align="center" gutterBottom>
                Không tìm thấy người dùng phù hợp
              </Typography>
            )}
          </List>
        </Box>
        {/* Bấm Xác nhận hoặc Hủy */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
          <Button variant="contained" color="inherit" onClick={onClose}>
            Đóng
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default FindRoomChat;
