import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Avatar,
  Box,
  Button,
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
import { useSelector } from "react-redux";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';


const ProfileDialog = ({ open, onClose }) => {
  const { user } = useSelector((state) => state.user);


  const onPickFile = (event) => {
    var file = event.target.files[0];
  }

  return (
    <Dialog
      disableBackdropClick={true}
      open={open}
      maxWidth='sm'
      scroll={"body"}
      onClose={onClose}>
      <DialogTitle sx={{ m: 0, px: 2 }} id="customized-dialog-title">
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          Thông tin cá nhân
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{ padding: 0 }}
        dividers>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            paddingLeft: '10px',
            paddingRight: '10px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end'
          }}>
          <img
            style={{
              borderRadius: '15px',
              position: 'relative',
              height: '200px',
              width: '100%',
              objectFit: 'cover',
              marginBottom: '70px'
            }}
            alt={""}
            src={readUrl("/api/bucket/665084baa340536c521c22b1/ZGUyM2UyNmM3YzhhZWY3MjEwOTVjODVkMTc1ODdkNzcuanBn")}
          />
          <div style={{ position: 'absolute', zIndex: 1, display: 'flex' }}>
            <Box
              sx={{
                display: 'flex',
                border: '4px solid #d3d3d3',
                borderRadius: '200px',
                ml: '20px',
                position: 'relative',
                alignItems: 'flex-end',
                justifyContent: 'flex-end'
              }}>
              <Avatar
                sx={{ height: '100px', width: '100px' }}
                src={readUrl(user.avatar)}
              />
              <Box
                onClick={() => document.getElementById('pick-avatar').click()}
                sx={{
                  display: 'flex',
                  position: 'absolute',
                  zIndex: 2,
                  borderRadius: '100px',
                  padding: '5px',
                  color: '#121212',
                  backgroundColor: '#f5f5f5',
                  '&:hover': {
                    backgroundColor: "#d3d3d3",
                  },
                }}>
                <input
                  onChange={onPickFile}
                  style={{ display: "none" }}
                  type="file"
                  multiple
                  accept="image/*"
                  id="pick-avatar" />
                <CameraAltIcon />
              </Box>
            </Box>
            <Box mt="50px" ml="20px">
              <Typography variant="h5" pb="0px">{user.fullName}</Typography>
              <Typography color="#696969">{`@hyomin`}</Typography>
            </Box>
          </div>
        </div>

        <Box px="20px" mt="20px" mb="20px">
          <Typography gutterBottom>
            Moment of Love 2022 🤎
            여러모로 나에겐 선물 같았던 2022년. 고마웠어~ 안녕!
          </Typography>
        </Box>
        <Divider orientation="horizontal" />
        <Box px="20px" mt="20px" mb="20px">
          <Typography variant="h6" fontSize="16px">{`Thông tin cá nhân`}</Typography>

          <Stack direction="row" mt="10px">
            <Typography
              fontSize="14px"
              fontWeight="500"
              sx={{ width: '200px' }}>
              {`Tên người dùng`}
            </Typography>
            <Typography
              fontSize="14px"
              fontWeight="500"
              sx={{ width: '200px' }}>
              @{`Hyomin`}
            </Typography>
          </Stack>

          <Stack direction="row" mt="10px">
            <Typography
              fontSize="14px"
              fontWeight="500"
              sx={{ width: '200px' }}>
              {`Giới tính`}
            </Typography>
            <Typography
              fontSize="14px"
              fontWeight="500"
              sx={{ width: '200px' }}>
              {`Nữ`}
            </Typography>
          </Stack>

          <Stack direction="row" mt="10px">
            <Typography
              fontSize="14px"
              fontWeight="500"
              sx={{ width: '200px' }}>
              {`Ngày sinh`}
            </Typography>
            <Typography
              fontSize="14px"
              fontWeight="500"
              sx={{ width: '200px' }}>
              {`14 tháng 2, 2003`}
            </Typography>
          </Stack>
        </Box>
        <Divider orientation="horizontal" />
        <Box px="20px" mt="20px" mb="20px">
          <Typography variant="h6" fontSize="16px">{`Hình ảnh`}</Typography>

          <Stack direction="row" mt="10px">
            <Typography
              fontSize="14px"
              fontWeight="500"
              sx={{ width: '200px' }}>
              {`Tên người dùng`}
            </Typography>
            <Typography
              fontSize="14px"
              fontWeight="500"
              sx={{ width: '200px' }}>
              @{`Hyomin`}
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button height="50px" fullWidth sx={{ backgroundColor: 'rgba(7, 193, 96, 0.1)' }}>
          Cập nhật hồ sơ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileDialog;
