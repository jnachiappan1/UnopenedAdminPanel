// ** React Imports
import { useState, Fragment, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiMenu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import BellOutline from "mdi-material-ui/BellOutline";

// ** Third Party Components
import PerfectScrollbarComponent from "react-perfect-scrollbar";

// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import CustomAvatar from "src/@core/components/mui/avatar";
import { useNavigate } from "react-router-dom";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError } from "src/utils/utils";
import { axiosInstance } from "src/network/adapter";
import moment from "moment/moment";
import { Badge } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useNotification } from "src/context/NotificationContext";
// ** Styled Menu component
const Menu = styled(MuiMenu)(({ theme }) => ({
  "& .MuiMenu-paper": {
    width: 380,
    overflow: "hidden",
    marginTop: theme.spacing(4),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  "& .MuiMenu-list": {
    padding: 0,
  },
}));

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const styles = {
  maxHeight: 349,
  "& .MuiMenuItem-root:last-of-type": {
    border: 0,
  },
};

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles,
});

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)({
  width: "2.375rem",
  height: "2.375rem",
  fontSize: "1.125rem",
});

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: "1 1 100%",
  overflow: "hidden",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  marginBottom: theme.spacing(0.75),
}));

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)({
  flex: "1 1 100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

const NotificationDropdown = (props) => {
  // ** Props
  const { settings } = props;

  // ** States
  const [anchorEl, setAnchorEl] = useState(null);

  // ** Hook
  const hidden = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  // ** Vars
  const { direction } = settings;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const { unreadCount, setUnreadCount } = useNotification();

  const handleDropdownOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };
  const fetchData = () => {
    setLoading(true);
    axiosInstance
      .get(ApiEndPoints.NOTIFICATIONS.list, {
        params: {
          isRead: "unread",
        },
      })
      .then((response) => {
        const notifications = response.data.data.notification;
        setNotificationData(notifications);
        const count = notifications.filter(n => !n.isRead).length;
        setUnreadCount(count);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = (id) => {
    setLoading(true);
    axiosInstance
      .patch(ApiEndPoints.NOTIFICATIONS.read(id))
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const ScrollWrapper = ({ children }) => {
    if (hidden) {
      return (
        <Box sx={{ ...styles, overflowY: "auto", overflowX: "hidden" }}>
          {children}
        </Box>
      );
    } else {
      return (
        <PerfectScrollbar
          options={{ wheelPropagation: false, suppressScrollX: true }}
        >
          {children}
        </PerfectScrollbar>
      );
    }
  };

  return (
    <Fragment>
      <IconButton
        color="inherit"
        aria-haspopup="true"
        onClick={handleDropdownOpen}
        aria-controls="customized-menu"
      >
        <Badge badgeContent={unreadCount} color="secondary">
          <NotificationsActiveIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
      >
        <MenuItem disableRipple>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            <CustomChip
              skin="light"
              size="small"
              label={`${unreadCount} New`}
              color="primary"
              sx={{
                height: 20,
                fontSize: "0.75rem",
                fontWeight: 500,
                borderRadius: "10px",
              }}
            />
          </Box>
        </MenuItem>
        <ScrollWrapper>
          {notificationData.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            notificationData.map((notification, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  onSubmit(notification.id);
                  handleDropdownClose();
                }}
              >
                <Box
                  sx={{ width: "100%", display: "flex", alignItems: "center" }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      alt={notification.title}
                      src="/images/avatars/4.png"
                    />
                    {!notification.isRead && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: 'error.main',
                          border: '2px solid white',
                        }}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      mx: 4,
                      flex: "1 1",
                      display: "flex",
                      overflow: "hidden",
                      flexDirection: "column",
                    }}
                  >
                    <MenuItemTitle>{notification.title}</MenuItemTitle>
                    <MenuItemSubtitle variant="body2">
                      {notification.body}
                    </MenuItemSubtitle>
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.disabled" }}>
                    {moment(notification.createdAt).format("DD-MM-YYYY")}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </ScrollWrapper>
        {notificationData.length > 0 && (
          <MenuItem
            disableRipple
            sx={{
              py: 3.5,
              borderBottom: 0,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                handleDropdownClose();
                navigate("/notifications");
              }}
              sx={{
                textDecoration: "none",
                width: "100%",
                textAlign: "center",
              }}
            >
              View All Notifications
            </Button>
          </MenuItem>
        )}
      </Menu>
    </Fragment>
  );
};

export default NotificationDropdown;
