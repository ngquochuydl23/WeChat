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
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Popover,
    Stack,
    Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { findUserByPhone } from "@/services/userApiService";
import PhoneInput from 'react-phone-input-2';
import { acceptRequest, checkContact, redeemRequest, sendRequest, unfriend } from "@/services/contactApiService";
import { useSelector } from "react-redux";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LoadingButton from '@mui/lab/LoadingButton';
import { readUrl } from "@/utils/readUrl";
import 'react-phone-input-2/lib/material.css';
import './override.scss'
import { findSingleRoom, initRoomChat } from "@/services/roomApiService";
import { useNavigate } from "react-router-dom";
import ProfileDialog from "../ProfileDialog";


const FindUserDialog = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);

    const [anchorEl, setAnchorEl] = useState(null);
    const openPopover = Boolean(anchorEl);
    const id = openPopover ? 'simple-popover' : undefined;
    const [actionLoading, setActionLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [foundUser, setFoundUser] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showNotFoundView, setShowNotFoundView] = useState(false);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);

    const [friend, setFriend] = useState(null);

    const redeem = () => {
        setActionLoading(true);
        redeemRequest(friend._id)
            .then(({ msg }) => {
                console.log(msg);
                setFriend(null);
            })
            .catch((err) => { console.log(err) })
            .finally(() => setActionLoading(false))
    }

    const addFriend = () => {
        setActionLoading(true);
        sendRequest(foundUser._id)
            .then(({ result, msg }) => {
                console.log(msg);
                setFriend(result.contact);
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setActionLoading(false);
            })
    }

    const accept = () => {
        setActionLoading(true);
        acceptRequest(friend._id)
            .then(({ msg }) => {
                console.log(msg);
                setFriend({ accepted: true })
            })
            .catch((err) => console.log(err))
            .finally(() => setActionLoading(false))
    }

    const checkFriend = (userId) => {
        checkContact(userId)
            .then(({ result }) => {
                setFriend(result.contact);
            })
            .catch((err) => {
                setFriend(null);
                console.log(err);
            })
    }

    const navigateToChat = () => {
        findSingleRoom(foundUser._id)
            .then(({ result }) => {
                onClose();
                navigate('/chat/' + result.room._id);
            })
            .catch(async (err) => {

                if (err === 'Room not found.') {

                    const { result } = await initRoomChat(null, [foundUser._id]);
                    if (result) {
                        navigate('/chat/' + result.room._id);
                        onClose();
                        return;
                    }
                }
                console.log(err);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const find = () => {
        setLoading(true);
        findUserByPhone('0' + phoneNumber.replace(/\D/g, '').slice(-9))
            .then(({ result }) => {
                setFoundUser(result.user);

                if (result.user._id !== user._id)
                    checkFriend(result.user._id);
                else setFriend(false);
            })
            .catch((err) => {
                console.log(err);
                if (err === 'User not found.') {
                    setShowNotFoundView(true);
                }
            })
            .finally(() => setLoading(false))
    }

    const removeFriend = () => {
        setLoading(true);
        unfriend(friend._id)
            .then(({ msg }) => setFriend(null))
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    }

    const blockUser = () => {

    }

    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            find();
        }
    }

    useEffect(() => {
        setLoading(false);
        setActionLoading(false);
        setFoundUser(null);
        setPhoneNumber('');
        setShowNotFoundView(false);
        setOpenProfileDialog(false);
    }, [open])

    return (
        <Dialog
            disableBackdropClick={true}
            open={open}
            fullWidth
            maxWidth='xs'
            scroll={"body"}
            onClose={onClose}>
            <DialogTitle sx={{ m: 0, px: 2, py: '7.5px', borderBottom: 'none' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    {showNotFoundView ? "Không tìm thấy người dùng" : "Thêm bạn"}
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ padding: 0 }}>
                {!showNotFoundView
                    ? <div style={{ height: '300px', paddingLeft: '15px', paddingRight: '15px' }}>
                        <PhoneInput
                            disabled={loading}
                            specialLabel="Số điện thoại"
                            enableSearch
                            autoFormat={false}
                            onKeyDown={onKeyDown}
                            placeholder="Nhập số điện thoại"
                            containerStyle={{ marginTop: '10px', width: '100%' }}
                            searchPlaceholder="Nhập tên quốc gia"
                            inputProps={{
                                name: 'Số điện thoại',
                                required: true,
                                autoFocus: true,
                            }}
                            dropdownStyle={{ width: '300px', borderRadius: '8px', height: '400px', overflowX: 'none' }}
                            searchStyle={{ borderRadius: '20px', height: '35px', width: '100%', paddingLeft: '20px' }}
                            country={'vn'}
                            value={phoneNumber}
                            onChange={phone => setPhoneNumber(phone)}
                        />
                        {loading &&
                            <Box
                                display="flex"
                                sx={{ width: '100%', height: '200px' }}
                                alignItems="center"
                                justifyContent="center">
                                <CircularProgress />
                            </Box>
                        }
                        {(!loading && foundUser) &&
                            <Stack
                                direction="row"
                                alignItems="center"
                                display="flex"
                                padding="10px"
                                onClick={() => { setOpenProfileDialog(true) }}
                                mt="10px"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'whitesmoke',
                                        borderRadius: '15px'
                                    }
                                }}>
                                <Avatar
                                    sx={{ height: '50px', width: '50px' }}
                                    src={readUrl(foundUser.avatar)} />
                                <Stack direction="column" display="flex" flex="1">
                                    <Typography
                                        variant="subtitle1"
                                        fontSize="15px"
                                        ml="15px">
                                        {foundUser.fullName}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        color="gray"
                                        fontWeight="400"
                                        fontSize="14px"
                                        ml="15px">
                                        @{foundUser.userName}
                                    </Typography>
                                </Stack>
                                {(!friend && foundUser._id === user._id) &&
                                    <Button
                                        variant="outlined"
                                        sx={{ paddingX: '25px' }}
                                        size="small"
                                        onClick={() => setOpenProfileDialog(true)}>
                                        {`Xem`}
                                    </Button>
                                }
                                {(!friend && foundUser._id !== user._id) &&
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ paddingX: '25px' }}
                                        size="small"
                                        loading={actionLoading}
                                        onClick={(e) => {
                                            addFriend();
                                            e.stopPropagation();
                                        }}>
                                        {`Kết bạn`}
                                    </LoadingButton>
                                }
                                {(friend && !friend.accepted && friend.sendingRequestUserId === user._id) &&
                                    <LoadingButton
                                        variant="outlined"
                                        sx={{ paddingX: '25px' }}
                                        size="small"
                                        loading={actionLoading}
                                        onClick={(e) => {
                                            redeem();
                                            e.stopPropagation();
                                        }}>
                                        {`Thu hồi`}
                                    </LoadingButton>
                                }
                                {(friend && !friend.accepted && friend.sendingRequestUserId !== user._id) &&
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ paddingX: '25px' }}
                                        size="small"
                                        loading={actionLoading}
                                        onClick={(e) => {
                                            accept();
                                            e.stopPropagation();
                                        }}>
                                        {`Đồng ý`}
                                    </LoadingButton>
                                }
                                {(friend && friend.accepted) &&
                                    <Stack direction="row" alignItems="center">
                                        <Button
                                            variant="outlined"
                                            sx={{ paddingX: '25px', height: '30px' }}
                                            size="small"
                                            onClick={(e) => {
                                                navigateToChat();
                                                e.stopPropagation();
                                            }}>
                                            {`Nhắn tin`}
                                        </Button>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => setAnchorEl(e.currentTarget)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Popover
                                            sx={{
                                                mt: '10px',
                                                '.MuiPopover-paper': {
                                                    borderRadius: '10px',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.16) ,0 0px 4px rgba(0, 0, 0, 0.05)'
                                                }
                                            }}
                                            id={id}
                                            open={openPopover}
                                            anchorEl={anchorEl}
                                            onClose={() => setAnchorEl(null)}
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                            <List sx={{ width: '200px' }}>
                                                <ListItemButton onClick={blockUser}>
                                                    {/* <ListItemIcon>
                                                        <Person2OutlinedIcon />
                                                    </ListItemIcon> */}
                                                    <ListItemText
                                                        primary="Chặn người dùng"
                                                        primaryTypographyProps={{
                                                            fontSize: '14px',
                                                            fontWeight: '500'
                                                        }} />
                                                </ListItemButton>
                                                <ListItemButton onClick={removeFriend}>
                                                    {/* <ListItemIcon>
                                                        <SettingsOutlinedIcon />
                                                    </ListItemIcon> */}
                                                    <ListItemText
                                                        primary="Xóa bạn"
                                                        primaryTypographyProps={{
                                                            fontSize: '14px',
                                                            fontWeight: '500',
                                                            color: 'red'
                                                        }} />
                                                </ListItemButton>
                                            </List>
                                        </Popover>
                                    </Stack>
                                }
                            </Stack>
                        }
                    </div>
                    : <Typography gutterBottom p="15px">
                        {`Số điện thoại chưa được đăng ký trên WeChat hoặc không cho phép tìm`}
                    </Typography>
                }
            </DialogContent>
            <DialogActions>
                {showNotFoundView
                    ? <Button
                        onClick={() => setShowNotFoundView(false)}
                        variant="text"
                        size="large">
                        Tìm người khác
                    </Button>
                    : <Button
                        onClick={find}
                        variant="contained"
                        size="large"
                        sx={{ width: '100px', borderRadius: '30px' }}>
                        Tìm
                    </Button>
                }
            </DialogActions>
            <ProfileDialog
                user={foundUser}
                hideBackdrop
                owned={foundUser ? foundUser._id === user._id : false}
                open={openProfileDialog}
                onClose={() => setOpenProfileDialog(false)} />
        </Dialog>
    );
};

export default FindUserDialog;
