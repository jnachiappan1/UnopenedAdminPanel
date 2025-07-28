import { useEffect, useState, useRef, useCallback } from "react";
import {
  Button,
  CardContent,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PageHeader from "../../@core/components/page-header/index";
import Translations from "../../layouts/components/Translations";
import { axiosInstance } from "../../network/adapter";
import { ApiEndPoints } from "../../network/endpoints";
import { DefaultPaginationSettings } from "../../constants/general.const";
import { toastError, toastSuccess } from "../../utils/utils";
import DialogConfirmation from "../../views/dialogs/DialogConfirmation";
import TableUsers from "src/views/tables/TableUsers";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { getPermissionNames, hasPermission } from "src/utils/permissions";
import { useAuth } from "src/hooks/useAuth";

const UsersPage = () => {
  const { permissionsWithNames, userType } = useAuth();
  const searchTimeoutRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [userData, setuserData] = useState([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE
  );
  const [confirmationDialogLoading, setConfirmationDialogLoading] =
    useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [userToDelete, setuserToDelete] = useState(null);

  const navigate = useNavigate();

  const canDelete = hasPermission(permissionsWithNames, "Users", "remove");
  console.log("canDelete", canDelete);
  const handleViewDetails = (user) => {
    navigate(`/users/${user.id}`);
  };

  const toggleConfirmationDialog = (e, dataToDelete = null) => {
    setConfirmationDialogOpen((prev) => !prev);
    setuserToDelete(dataToDelete);
  };

  const fetchData = ({
    currentPage,
    pageSize = DefaultPaginationSettings.ROWS_PER_PAGE,
    search,
  }) => {
    setLoading(true);
    let params = {
      page: currentPage,
      limit: pageSize,
      search: search,
      status: status,
    };
    axiosInstance
      .get(ApiEndPoints.USERS.list, { params })
      .then((response) => {
        setuserData(response.data.data.userList);
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

  const onConfirmDelete = useCallback(
    (e) => {
      e?.preventDefault();
      setConfirmationDialogLoading(true);
      axiosInstance
        .delete(ApiEndPoints.USERS.delete(userToDelete.id))
        .then((response) => response.data)
        .then((response) => {
          fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
          });
          toggleConfirmationDialog();
          toastSuccess(response.message);
        })
        .catch((error) => {
          toastError(error);
        })
        .finally(() => {
          setConfirmationDialogLoading(false);
        });
    },
    [userToDelete, currentPage, pageSize]
  );

  return (
    <>
      <Grid container spacing={4}>
        <PageHeader
          title={
            <Typography variant="h5">
              <Translations text="Users" />
            </Typography>
          }
        />
        <Grid size={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  pb: 5,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Select
                    size="small"
                    defaultValue={" "}
                    sx={{ bgcolor: "#F7FBFF" }}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setStatus(selectedValue === "All" ? "" : selectedValue);
                    }}
                  >
                    <MenuItem disabled value={" "}>
                      <em>Status</em>
                    </MenuItem>
                    <MenuItem value={"All"}>All</MenuItem>
                    <MenuItem value={"active"}>Active</MenuItem>
                    <MenuItem value={"inactive"}>Inactive</MenuItem>
                  </Select>
                  <TextField
                    type="search"
                    size="small"
                    placeholder="Search"
                    onChange={handleSearchChange}
                  />
                </Box>
              </Box>

              <TableUsers
                search={search}
                loading={loading}
                rows={userData}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                toggleDelete={toggleConfirmationDialog}
                onViewDetails={handleViewDetails}
                canDelete={canDelete}
                userType={userType}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DialogConfirmation
        loading={confirmationDialogLoading}
        title="Delete User"
        subtitle="Are you sure you want to delete this User?"
        open={confirmationDialogOpen}
        toggle={toggleConfirmationDialog}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

export default UsersPage;
