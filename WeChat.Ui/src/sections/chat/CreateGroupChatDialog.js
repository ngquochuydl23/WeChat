import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Checkbox, Divider, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';
import _ from 'lodash';
import Chip from '@mui/material/Chip';


const SelectedUserItem = ({ user, onRemove }) => {
    const { fullName, avatar } = user;
    const handleDelete = (chipToDelete) => () => {

    };

    return (
        <Chip
            sx={{
                justifyContent: 'flex-start',
                backgroundColor: 'rgba(135, 206, 235, 0.3)',
                color: 'rgb(1,98,196)',
                fontWeight: '600',
                '.MuiChip-label': {
                    width: '100%'
                }
            }}
            clickable
            deleteIcon={<CloseIcon color='rgb(1,98,196)' />}
            onDelete={handleDelete}
            avatar={<Avatar src={avatar} />}
            label={fullName}>
            <CloseIcon />
        </Chip>
    )
}

const UserItem = ({ user, checked, onChange }) => {
    const { fullName, avatar } = user;
    return (
        <Stack
            alignItems="center"
            direction="row"
            spacing="15px">
            <Checkbox
                checked={checked}
                onChange={onChange} />
            <Avatar src={avatar} />
            <Typography fontWeight="500">
                {fullName}
            </Typography>
        </Stack>
    )
}

const CreateGroupChatDialog = ({ open, onClose, onCreateGroupChat }) => {
    const [title, setTitle] = useState('');
    const [timer, setTimer] = useState();
    const [content, setContent] = useState("");
    const [typing, setTyping] = useState(false);
    const [hasSearch, setHasSearched] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchUserLoading, setSearchUserLoading] = useState(false);

    const searchUser = () => {
        setHasSearched(true);
        setSearchUserLoading(true);
        axios
            .get(process.env.REACT_APP_API_ENDPOINT + "user/", {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("accessToken"),
                },
                params: {
                    notIncludeMe: true,
                    search: content.trim()
                }
            })
            .then(res => {
                setUsers(_.map(res.data.users, (item) => ({
                    user: item,
                    checked: selectedUsers.findIndex(x => x._id === item._id) !== -1
                })));
            })
            .catch(err => {
                console.log(err);


            })
            .finally(() => {
                setSearchUserLoading(false);
            });
    }

    const onChangeUserItem = (e, selectedItem) => {
        const items = _.map(users, (item) => {
            if (item.user._id === selectedItem.user._id) {
                item.checked = !selectedItem.checked;
            }
            return item;
        });
        setUsers(items);
        if (selectedItem.checked) {
            setSelectedUsers([...selectedUsers, selectedItem.user])
        } else {
            setSelectedUsers(_.filter(selectedUsers, item => item._id !== selectedItem.user._id))
        }
    }

    const onEnterSearching = (e) => {
        if (!typing) {
            setSearchUserLoading(true);
        }
        setTyping(true);
        setContent(e.target.value);
        clearTimeout(timer);

        const newTimer = setTimeout(() => {
            setTyping(false);
            searchUser();
        }, 1000);

        setTimer(newTimer);
    }

    const onCreateGroup = () => {
        const members = _.map(selectedUsers, item => item._id);
        onCreateGroupChat({
            members,
            title
        })
    }

    useEffect(() => {
        searchUser();
    }, [])
    

    return (
        <Dialog
            open={open}
            scroll={"body"}
            onClose={onClose}
            maxWidth="sm"
            aria-labelledby="profile-modal-title"
            aria-describedby="profile-modal-description">
            <DialogTitle
                sx={{ fontWeight: '800', m: 0, p: 2 }}
                id="customized-dialog-title">
                Tạo nhóm
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
            <DialogContent dividers>
                <Stack direction="row">
                    <Box sx={{
                        height: '60px',
                        width: '60px',
                        aspectRatio: 1,
                        borderRadius: '200px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #d3d3d3'
                    }}>
                    </Box>
                    <TextField
                        value={title}
                        fullWidth
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ ml: '15px' }}
                        id="standard-basic"
                        label="Tên nhóm"
                        variant="standard" />
                </Stack>
                <TextField
                    size='small'
                    onChange={onEnterSearching}
                    sx={{ mt: '15px', fontSize: '14px' }}
                    fullWidth
                    id="outlined-basic"
                    label="Nhập số điện thoại"
                    variant="outlined" />

                <Stack direction="row" mt="20px" width="552px" minHeight="300px">
                    <Box flex="2">
                        <Typography sx={{ fontWeight: '600' }}>Kết quả tìm kiếm</Typography>
                        {Boolean(searchUserLoading)
                            ? <Stack
                                py="10px"
                                direction="column"
                                spacing="10px">
                                <Stack direction="row" spacing="10px">
                                    <Skeleton
                                        background="#f5f5f5"
                                        variant="circular">
                                        <Avatar />
                                    </Skeleton>
                                    <Skeleton width="60%" />
                                </Stack>
                                <Stack direction="row" spacing="10px">
                                    <Skeleton
                                        background="#f5f5f5"
                                        variant="circular">
                                        <Avatar />
                                    </Skeleton>
                                    <Skeleton width="60%" />
                                </Stack>
                                <Stack direction="row" spacing="10px">
                                    <Skeleton
                                        background="#f5f5f5"
                                        variant="circular">
                                        <Avatar />
                                    </Skeleton>
                                    <Skeleton width="60%" />
                                </Stack>
                            </Stack>
                            : <Stack
                                sx={{ overflowY: 'auto' }}
                                spacing="15px"
                                py="10px">
                                {_.map(users, (item) => (
                                    <UserItem
                                        user={item.user}
                                        checked={item.checked}
                                        onChange={(e) => onChangeUserItem(e, item)} />
                                ))}
                            </Stack>
                        }
                        {!users && hasSearch &&
                            <Typography sx={{ fontWeight: '600' }}>Không tìm thấy</Typography>
                        }
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box ml="20px" flex="1.3">
                        <Typography sx={{ fontWeight: '600' }}>Đã chọn</Typography>
                        <Stack direction="column" py="10px" spacing="10px">
                            {_.map(selectedUsers, item => (
                                <SelectedUserItem user={item} />
                            ))}
                        </Stack>
                    </Box>
                </Stack>
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
                    disabled={selectedUsers.length < 2}
                    onClick={() => {
                        onCreateGroup();
                        onClose();
                        setContent('');
                        
                    }}
                    variant='contained'
                    color='info'
                    autoFocus >
                    Tạo nhóm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateGroupChatDialog;