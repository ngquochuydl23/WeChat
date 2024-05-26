import {
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { ChatCircleDots, Users } from "phosphor-react";
import {
  unstable_HistoryRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Link } from "react-router-dom/dist";
import { useState } from "react";
import { PowerSettingsNew, Settings } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ProfileModal from "../../dialog/ProfileModal";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import { enqueueSnackbar } from "notistack";
import ChangePasswordModal from "../../dialog/ChangePasswordModal";
import { Icon } from '@mui/material';
const sideBarItems = [
  {
    path: "/chat",
    icon: <ChatCircleDots />,
    title: 'Tin nhắn',
    hasBadge: true,
  },
  {
    path: "/user",
    icon: <Users />,
    title: 'Danh bạ',
    hasBadge: false,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const isSelected = (path) => location.pathname === path;
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openChangPWDialog, setOpenChangPWDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    try {
      localStorage.setItem("accessToken", null);
      dispatch(setUser(null));
      enqueueSnackbar(`Đăng xuất thành công`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      navigate("/auth/login");
    } catch (error) { }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box
      sx={{
        paddingTop: '30px',
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        width: "max-content",

      }}
    >
      <Stack spacing={"10px"} direction="column" alignItems="center">
        {sideBarItems.map((sideBarItem) => (
          <Link to={sideBarItem.path} style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <Box
              key={sideBarItem.path}
              sx={{
                textDecoration: 'none',
                flexDirection: 'column',
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                paddingTop: '15px',
                justifyContent: 'center',
                ...(isSelected(sideBarItem.path) && {
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  borderRadius: 1.5,
                })
              }}>
              {sideBarItem.hasBadge
                ? <Badge badgeContent={4} color="primary">
                  <Icon sx={{ color: 'gray' }}>
                    {sideBarItem.icon}
                  </Icon>
                </Badge>
                : <Icon sx={{ color: 'gray' }}>
                  {sideBarItem.icon}
                </Icon>
              }
              <Typography
                fontSize="12px"
                mt="5px"
                fontWeight="500"
                sx={{
                  textDecoration: 'none',
                  ...(isSelected(sideBarItem.path) ? {
                    color: 'black'
                  } : {
                    color: 'gray'
                  })
                }}>
                {sideBarItem.title}
              </Typography>
            </Box>
          </Link>
        ))
        }
      </Stack >
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          width: "max-content",
          color: "black",
        }}
      >
        <SettingsOutlinedIcon />
      </IconButton>
      <Popover
        sx={{}}

        PaperProps={{
          borderRadius: '5px'
        }}
        style={{ boxShadow: "2px 6px 18px", }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List sx={{}}>
          <ListItem
            onClick={() => setOpenDialog(true)}
            button
            style={{ margin: "0 6px 0 6px" }}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Thông tin tài khoản" />
          </ListItem>

          <ListItem
            onClick={() => setOpenChangPWDialog(true)}
            button
            style={{ margin: "0 6px 0 6px" }}
          >
            <ListItemIcon>
              <ChangeCircleOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Đổi mật khẩu" />
          </ListItem>

          <ListItemButton
            button
            onClick={handleLogout}
            style={{ margin: "0 6px 0 6px", color: "red" }}
          >
            <ListItemIcon>
              <PowerSettingsNew color="error" />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </List>
      </Popover>

      <ChangePasswordModal
        onClose={() => setOpenChangPWDialog(false)}
        open={openChangPWDialog}
      />
      <ProfileModal onClose={() => setOpenDialog(false)} open={openDialog} />
    </Box >
  );
};

export default Sidebar;
