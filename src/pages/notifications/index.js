import { useEffect, useState, useRef } from "react";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PageHeader from "src/@core/components/page-header";
import Translations from "src/layouts/components/Translations";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { toastError } from "src/utils/utils";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid2";
import TableNotifications from "src/views/tables/TableNotifications";
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
        setNotificationData(response.data.data?.notification);
        setTotalCount(response.data.data.totalCount);
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

  return (
    <>
      <Grid container spacing={4} className="match-height">
        <PageHeader
          title={
            <Typography variant="h5">
              <Translations text="Notifications" />
            </Typography>
          }
        />
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 5 }}>
              <TableNotifications
                search={search}
                loading={loading}
                rows={notificationData}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default NotificationPage;
