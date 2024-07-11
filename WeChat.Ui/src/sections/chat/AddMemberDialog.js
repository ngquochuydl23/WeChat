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
import Skeleton from '@mui/material/Skeleton';
import _ from 'lodash';
import Chip from '@mui/material/Chip';
import { readUrl } from '@/utils/readUrl';
import { getContacts } from '@/services/contactApiService';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { addMember } from '@/services/roomApiService';
import { useNavigate } from 'react-router-dom';

const SelectedUserItem = ({ user, onRemove }) => {
    const { fullName, avatar, _id } = user;
    const handleDelete = () => {
        onRemove(_id);
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
            onDelete={handleDelete}
            avatar={
                <Avatar
                    alt={fullName}
                    src={readUrl(avatar)} />}
            label={fullName}>
            <IconButton onClick={handleDelete}>
                <CloseIcon />
            </IconButton>
        </Chip>
    )
}

const UserItem = ({ user, checked = false, onChange, isinGroup }) => {
    const { fullName, avatar } = user;
    return (
        <Stack alignItems="center" direction="row" spacing="15px">
            <Avatar alt={fullName} src={readUrl(avatar)} />
            <Stack direction="column" sx={{ width: '100%' }}>
                <Typography fontWeight="600" fontSize="15px">
                    {fullName}
                </Typography>
                {isinGroup &&
                    <Typography fontWeight="500" fontSize="12px" color="gray">
                        Đã tham gia
                    </Typography>
                }
            </Stack>
            <Checkbox
                disabled={isinGroup}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<CheckCircleIcon />}
                sx={{ mr: '20px', borderRadius: '300px' }}
                checked={isinGroup ? true : checked}
                onChange={onChange} />
        </Stack>
    )
}

const AddMemberDialog = ({ open, onClose, room, members }) => {
    const navigate = useNavigate();
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

        getContacts(content.trim())
            .then(({ result }) => {
                setContacts(result.contacts);
            })
            .catch(err => {
                console.log(err);


            })
            .finally(() => {
                setHasSearched(false);
                setSearchUserLoading(false);
            });
    }


    const onChangeUserItem = (e, user) => {
        const id = user._id;

        if (selectedUsers.find(x => x === id)) {
            setSelectedUsers(_.filter(selectedUsers, x => x !== id))
        } else {
            setSelectedUsers([...selectedUsers, id])
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

    const onAddMembers = () => {
        addMember(room._id, selectedUsers)
            .then(({ msg }) => {
                console.log(msg);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (!open) {
            setTimer(null);
            setContent('');
            setHasSearched(false);
            setContacts([]);
            setSelectedUsers([]);
            setSearchUserLoading(false);
        } else {

        }
    }, [open])

    useEffect(() => {
        searchUser();
    }, []);

    return (
        <Dialog
            open={open}
            scroll={"body"}
            onClose={onClose}
            maxWidth="sm">
            <DialogTitle sx={{ fontWeight: '800', m: 0, p: 2 }}>
                Thêm thành viên
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ py: 0 }}>
                <TextField
                    size='small'
                    onChange={onEnterSearching}
                    sx={{
                        mt: '5px',
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
                        <Typography sx={{ fontWeight: '600', fontSize: '15px' }}>
                            {content.length > 0 ? 'Kết quả tìm kiếm' : 'Tất cả liên hệ'}
                        </Typography>
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
                                {_.map(contacts, ({ user }) => {
                                    return (
                                        <UserItem
                                            isinGroup={room.members.includes(user._id)
                                                && !room.userConfigs.find(x => x.userId === user._id).leaved}
                                            user={user}
                                            checked={selectedUsers.find(x => x === user._id)}
                                            onChange={(e) => onChangeUserItem(e, user)} />
                                    )
                                })}
                            </Stack>
                        }
                        {!contacts && hasSearch &&
                            <Typography sx={{ fontWeight: '600' }}>Không tìm thấy</Typography>
                        }
                    </Box>
                    {selectedUsers.length > 0 &&
                        <Divider orientation="vertical" flexItem />
                    }
                    {selectedUsers.length > 0 &&
                        <Box ml="20px" flex="1.3">
                            <Typography sx={{ fontWeight: '600', fontSize: '15px' }}>Đã chọn</Typography>
                            <Stack direction="column" py="10px" spacing="10px">
                                {_.map(selectedUsers, item => (
                                    <SelectedUserItem
                                        onRemove={() => {
                                            setSelectedUsers(_.filter(selectedUsers, x => x !== item))
                                        }}
                                        user={contacts.find(x => x.user._id === item).user} />
                                ))}
                            </Stack>
                        </Box>
                    }
                </Stack>
            </DialogContent>
            <Divider />
            <DialogActions>
                <Button onClick={onClose} variant='contained' color='error'>
                    Hủy
                </Button>
                <Button
                    disabled={selectedUsers.length < 1}
                    onClick={() => {
                        onAddMembers();
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

export default AddMemberDialog;