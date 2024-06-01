import React, { useEffect, useState } from "react";
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { findUserByPhone } from "@/services/userApiService";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import './override.scss'
import { readUrl } from "@/utils/readUrl";
import { checkIsFriend } from "@/services/friendApiService";
import { useSelector } from "react-redux";


const FindUserDialog = ({ open, onClose }) => {
    const { user } = useSelector((state) => state.user);

    const [loading, setLoading] = useState(false);
    const [foundUser, setFoundUser] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showNotFoundView, setShowNotFoundView] = useState(false);

    const [friend, setFriend] = useState(null);

    const redeemRequest = () => {

    }

    const addFriend = () => {

    }

    const acceptRequest = () => {

    }

    const checkFriend = (userId) => {
        checkIsFriend(userId)
            .then(({ result }) => {
                console.log(result.friend);
                setFriend(result.friend);
            })
            .catch((err) => {
                setFriend(null);
                console.log(err);
            })
    }

    const find = () => {
        setLoading(true);
        findUserByPhone(phoneNumber.replace(/\D/g, '').slice(-10))
            .then(async ({ result }) => {
                checkFriend(result.user._id);
                setFoundUser(result.user);
            })
            .catch((err) => {
                console.log(err);
                if (err === 'User not found.') {
                    setShowNotFoundView(true);
                }
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        // setLoading(false);
        // setFoundUser(null);
        // setPhoneNumber('');
        // setShowNotFoundView(false);
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
                            enableAreaCodes
                            placeholder="Nhập số điện thoại"
                            containerStyle={{
                                marginTop: '10px',
                                width: '100%'
                            }}
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
                                onClick={() => { }}
                                mt="10px"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'whitesmoke',
                                        borderRadius: '15px'
                                    }
                                }}>
                                <Avatar
                                    sx={{ height: '50px', width: '50px' }}
                                    //src={readUrl(foundUser.avatar)} 
                                    src="https://scontent.cdninstagram.com/v/t39.30808-6/443698361_18448590670011882_7684863512991462085_n.jpg?stp=dst-jpg_e35_p720x720&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE3OTkuc2RyLmYzMDgwOCJ9&_nc_ht=scontent.cdninstagram.com&_nc_cat=106&_nc_ohc=kWvlqGv1pY0Q7kNvgGzCzua&edm=APs17CUAAAAA&ccb=7-5&ig_cache_key=MzM3MzM4MDY3OTE3MTk1MDE3Ng%3D%3D.2-ccb7-5&oh=00_AYCjoUwbJZJuw3HPgpcDdEWDn14hOpCguABy_Z0pPKEgNQ&oe=66606B5F&_nc_sid=10d13b" />
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
                                {!friend &&
                                    <Button
                                        variant="contained"
                                        sx={{ paddingX: '25px' }}
                                        size="small"
                                        onClick={addFriend}>
                                        {`Kết bạn`}
                                    </Button>
                                }
                                {(friend && !friend.accepted && friend.sendingRequestUserId === user._id) &&
                                    <Button
                                        variant="outlined"
                                        sx={{ paddingX: '25px' }}
                                        size="small"
                                        onClick={redeemRequest}>
                                        {`Thu hồi`}
                                    </Button>
                                }
                                {(friend && !friend.accepted && friend.sendingRequestUserId !== user._id) &&
                                    <Button
                                        variant="contained"
                                        sx={{ paddingX: '25px' }}
                                        size="small"
                                        onClick={acceptRequest}>
                                        {`Đồng ý`}
                                    </Button>
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
        </Dialog >
    );
};

export default FindUserDialog;
