import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Checkbox, CircularProgress, Divider, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';
import _ from 'lodash';
import Chip from '@mui/material/Chip';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { uploadFile } from '@/services/storageApi';
import { readUrl } from '@/utils/readUrl';
import { getFriends } from '@/services/friendApiService';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { initRoomChat } from '@/services/roomApiService';
import { useNavigate } from 'react-router-dom';

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
            avatar={
                <Avatar
                    alt={fullName}
                    src={readUrl(avatar)} />}
            label={fullName}>
            <CloseIcon />
        </Chip>
    )
}

const UserItem = ({ user, checked, onChange }) => {
    const { fullName, avatar } = user;
    return (
        <Stack alignItems="center" direction="row" spacing="15px">
            <Avatar alt={fullName} src={readUrl(avatar)} />
            <Typography fontWeight="600" fontSize="15px" sx={{ width: '100%' }}>
                {fullName}
            </Typography>
            <Checkbox
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleIcon />}
                sx={{ mr: '20px', borderRadius: '300px' }}
                checked={checked}
                onChange={onChange} />
        </Stack>
    )
}

const CreateGroupChatDialog = ({ open, onClose }) => {
    const navigate = useNavigate();

    const [thumbnail, setThumbnail] = useState('');
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [timer, setTimer] = useState();
    const [content, setContent] = useState("");
    const [typing, setTyping] = useState(false);
    const [hasSearch, setHasSearched] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchUserLoading, setSearchUserLoading] = useState(false);

    const searchUser = () => {
        setHasSearched(true);
        setSearchUserLoading(true);

        getFriends(content.trim())
            .then(({ result }) => {
                console.log(result);
                setContacts(result.friends);

                // setUsers(_.map(res.data.users, (item) => ({
                //     user: item,
                //     checked: selectedUsers.findIndex(x => x._id === item._id) !== -1
                // })));
            })
            .catch(err => {
                console.log(err);


            })
            .finally(() => {
                setSearchUserLoading(false);
            });
    }

    const onChangeUserItem = (e, selectedItem) => {
        const items = _.map(contacts, (item) => {
            if (item.user._id === selectedItem.user._id) {
                item.checked = !selectedItem.checked;
            }
            return item;
        });
        setContacts(items);
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
        const otherIds = _.map(selectedUsers, item => item._id);

        initRoomChat(title, otherIds)
            .then(({ result }) => {
                console.log(result);
                navigate('/chat/' + result.room._id);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const onPickFile = (event) => {
        setUploading(true);
        uploadFile(event.target.files[0])
            .then(res => {
                const { url } = res.data.files[0];
                setThumbnail(url);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setUploading(false);
            })
    }


    useEffect(() => {
        setThumbnail('');
        setUploading(false);
        setTitle('');
        setTimer(null);
        setContent('');
        setHasSearched(false);
        setContacts([]);
        setSelectedUsers([]);
        setSearchUserLoading(false);
    }, [open])


    useEffect(() => {
        searchUser();

    }, [])

    return (
        <Dialog
            open={open}
            scroll={"body"}
            onClose={onClose}
            maxWidth="sm">
            <DialogTitle sx={{ fontWeight: '800', m: 0, p: 2 }}>
                Tạo nhóm
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ py: 0 }}>
                <Stack direction="row" display="flex">
                    <Box
                        onClick={() => document.getElementById('room.thumnail.picker')?.click()}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            display: 'flex',
                            height: '70px',
                            position: 'relative',
                            aspectRatio: 1,
                            borderRadius: '200px',
                            backgroundColor: uploading ? 'white' : '#f5f5f5',
                            border: '2px solid #d3d3d3'
                        }}>
                        {!thumbnail &&
                            <input
                                onChange={onPickFile}
                                style={{ display: "none" }}
                                type="file"
                                multiple
                                accept="image/*"
                                id="room.thumnail.picker" />
                        }
                        {uploading &&
                            <Box sx={{ display: 'flex', position: 'absolute', zIndex: 2 }}>
                                <CircularProgress color="success" sx={{ color: 'white' }} />
                            </Box>
                        }
                        {!thumbnail
                            ? <CameraAltIcon sx={{ color: 'gray' }} />
                            : <Avatar
                                sx={{ height: '100%', width: '100%', margin: '2px' }}
                                src={readUrl(thumbnail)} />
                        }
                    </Box>
                    <TextField
                        value={title}
                        fullWidth
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ ml: '15px' }}
                        label="Tên nhóm"
                        variant="standard" />
                </Stack>
                <TextField
                    size='small'
                    onChange={onEnterSearching}
                    sx={{
                        mt: '15px',
                        fontSize: '14px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderRadius: `20px`,
                            }
                        },
                    }}
                    fullWidth
                    label="Nhập số điện thoại hoặc tên"
                    variant="outlined" />
                <Stack direction="row" mt="20px" width="552px" minHeight="300px">
                    <Box flex="2">
                        <Typography sx={{ fontWeight: '600', fontSize: '15px' }}>Kết quả tìm kiếm</Typography>
                        {Boolean(searchUserLoading)
                            ? <Stack py="10px" direction="column" spacing="10px">
                                <Stack direction="row" spacing="10px">
                                    <Skeleton background="#f5f5f5" variant="circular">
                                        <Avatar />
                                    </Skeleton>
                                    <Skeleton width="60%" />
                                </Stack>
                                <Stack direction="row" spacing="10px">
                                    <Skeleton background="#f5f5f5" variant="circular">
                                        <Avatar />
                                    </Skeleton>
                                    <Skeleton width="60%" />
                                </Stack>
                                <Stack direction="row" spacing="10px">
                                    <Skeleton background="#f5f5f5" variant="circular">
                                        <Avatar />
                                    </Skeleton>
                                    <Skeleton width="60%" />
                                </Stack>
                            </Stack>
                            : <Stack sx={{ overflowY: 'auto' }} spacing="15px" py="10px">
                                {_.map(contacts, (contact) => (
                                    <UserItem
                                        user={contact.user}
                                        checked={contact.checked}
                                        onChange={(e) => onChangeUserItem(e, contact)} />
                                ))}
                            </Stack>
                        }
                        {!contacts && hasSearch &&
                            <Typography sx={{ fontWeight: '600' }}>Không tìm thấy</Typography>
                        }
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box ml="20px" flex="1.3">
                        <Typography sx={{ fontWeight: '600', fontSize: '15px' }}>Đã chọn</Typography>
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
                <Button onClick={onClose} variant='contained' color='error'>
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