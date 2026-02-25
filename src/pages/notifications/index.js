import { useEffect, useState, useRef } from "react";
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import PageHeader from "src/@core/components/page-header";
import Translations from "src/layouts/components/Translations";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { toastError } from "src/utils/utils";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid2";
import { useNotification } from "src/context/NotificationContext";
const NotificationPage = () => {
  const searchTimeoutRef = useRef();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [notificationData, setNotificationData] = useState([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE,
  );
  const { t } = useTranslation();
  const { setUnreadCount } = useNotification();
  const fetchData = ({
    currentPage,
    pageSize = DefaultPaginationSettings.ROWS_PER_PAGE,
    search,
    status,
  }) => {
    setLoading(true);
    let params = {
      page: currentPage,
      limit: pageSize,
      search: search,
      status: status,
    };

    axiosInstance
      .get(ApiEndPoints.NOTIFICATIONS.list, { params })
      .then((response) => {
        const notifications = response.data.data?.notification;
        setNotificationData(notifications);
        setTotalCount(response.data.data.totalCount);
        const count = notifications?.filter((n) => !n.isRead).length || 0;
        setUnreadCount(count);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const markAllAsRead = () => {
    setLoading(true);
    axiosInstance
      .patch(
        ApiEndPoints.NOTIFICATIONS.markAllRead(),
        {}, // empty body
        {
          params: {
            all_read: true, // query param in config
          },
        },
      )
      .then(() => {
        fetchData({
          currentPage: currentPage,
          pageSize: pageSize,
          search: search,
          status: status,
        });
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData({
      currentPage: currentPage,
      pageSize: pageSize,
      search: search,
      status: status,
    });
  }, [currentPage, pageSize, search, status]);

  const handleSearchChange = (e) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 500);
  };
  const onSubmit = (id) => {
    setLoading(true);
    axiosInstance
      .patch(ApiEndPoints.NOTIFICATIONS.read(id))
      .then((response) => {
        fetchData({
          currentPage: currentPage,
          pageSize: pageSize,
          search: search,
          status: status,
        });
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Grid container spacing={4} className="match-height">
        <PageHeader
          title={
            <Typography variant="h5">
              <Translations text="Notifications" />
            </Typography>
          }
          action={
            <Button variant="contained" onClick={markAllAsRead}>
              Mark All As Read
            </Button>
          }
        />

        <Grid size={{ xs: 12 }}>
          <Card>
            <Box sx={{ p: 5, maxHeight: "70vh", overflowY: "auto" }}>
              {notificationData.map((notification) => (
                <Box
                  onClick={() => onSubmit(notification.id)}
                  key={notification.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    p: 2,
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    {notification.title.charAt(0).toUpperCase()}
                    {!notification.isRead && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "#f44336",
                          border: "2px solid white",
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1">
                      {notification.title}
                    </Typography>
                    <Typography variant="body2">{notification.body}</Typography>
                  </Box>
                  <Box sx={{ flexShrink: 0, textAlign: "right" }}>
                    <Typography variant="caption">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default NotificationPage;
