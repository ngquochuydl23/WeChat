import React, { useState } from "react";
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
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
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import { uploadFile } from "@/services/storageApi";
import { changeAvatar } from "@/services/profileApiService";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import moment from "moment/";


const ProfileDialog = ({
	open,
	onClose,
	editProfileClick,
	hideBackdrop = false,
	user,
	owned = false
}) => {
	const dispatch = useDispatch();
	const [uploadingAvatar, setUploadingAvatar] = useState(false);

	const patchNewAvatar = (url) => {
		if (owned) {
			changeAvatar(url)
				.then((res) => {
					dispatch(setUser(res.result.user));
				})
				.catch(err => console.log(err))
				.finally(() => setUploadingAvatar(false))
		}
	}

	const onPickFile = (event) => {
		if (owned) {
			setUploadingAvatar(true);
			uploadFile(event.target.files[0])
				.then(res => {
					const { url } = res.data.files[0];
					patchNewAvatar(url);
				})
				.catch(err => {
					console.log(err);
				})
		}
	}

	if (user == null) {
		return null;
	}

	return (
		<Dialog
			disableBackdropClick={true}
			open={open}
			fullWidth
			hideBackdrop={hideBackdrop}
			maxWidth='sm'
			scroll={"body"}
			onClose={onClose}>
			<DialogTitle sx={{ m: 0, px: 2, py: '7.5px', borderBottom: 'none' }}>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					Thông tin cá nhân
					<IconButton onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Stack>
			</DialogTitle>
			<DialogContent sx={{ padding: 0 }}>
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
					<input
						onChange={onPickFile}
						style={{ display: "none" }}
						type="file"
						multiple
						accept="image/*"
						id="pick.cover" />
					<img
						style={{
							borderRadius: '15px',
							position: 'relative',
							height: '200px',
							width: '100%',
							objectFit: 'cover',
							marginBottom: '70px'
						}}
						alt={"user.cover"}
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
								alignItems: uploadingAvatar ? 'center' : 'flex-end',
								justifyContent: uploadingAvatar ? 'center' : 'flex-end'
							}}>
							<Avatar
								alt="user.avatar"
								sx={{ height: '100px', width: '100px' }}
								src={readUrl(user.avatar)}
							/>
							{owned && ((uploadingAvatar)
								? <Box sx={{ display: 'flex', position: 'absolute', zIndex: 2 }}>
									<CircularProgress color="success" sx={{ color: 'white' }} />
								</Box>
								: <Box
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
								</Box>)
							}
						</Box>
						<Box mt="40px" ml="20px">
							<Stack direction="row" alignItems="center" p={0}>
								<Typography mt="10px" variant="h5" pb="0px">{user.fullName}</Typography>
								{owned &&
									<IconButton
										onClick={editProfileClick}
										sx={{ color: 'gray', ml: '15px' }} >
										<DriveFileRenameOutlineIcon />
									</IconButton>
								}
							</Stack>
							<Typography color="#696969">@{user.userName}</Typography>
						</Box>
					</div>
				</div>
				<Box px="20px" mt="20px" mb="20px">
					<Typography gutterBottom style={{ wordWrap: 'break-word' }}>{user.bio}</Typography>
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
							@{user.userName}
						</Typography>
					</Stack>
					<Stack direction="row" mt="10px">
						<Typography
							fontSize="14px"
							fontWeight="500"
							sx={{ width: '200px' }}>
							{`Giới tính`}
						</Typography>
						{user.gender &&
							<Typography
								fontSize="14px"
								fontWeight="500"
								sx={{ width: '200px' }}>
								{user.gender === 'female' ? "Nữ" : "Nam"}
							</Typography>
						}
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
							{user.birthday ? moment(user.birthday).locale('vn').format('LL') : "Chưa có"}
						</Typography>
					</Stack>
				</Box>
				<Divider orientation="horizontal" />
				<Box px="20px" mt="20px" mb="20px">
					<Typography variant="h6" fontSize="16px">{`Hình ảnh`}</Typography>
					<Stack direction="row" mt="10px">

					</Stack>
				</Box>
			</DialogContent>
			{owned &&
				<DialogActions>
					<Button
						size="large"
						onClick={editProfileClick}
						height="50px"
						fullWidth
						sx={{ backgroundColor: 'rgba(7, 193, 96, 0.1)' }}>
						Cập nhật hồ sơ
					</Button>
				</DialogActions>
			}
		</Dialog>
	);
};

export default ProfileDialog;
