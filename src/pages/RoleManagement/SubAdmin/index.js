import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Button,
  CardContent,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import PageHeader from "src/@core/components/page-header";
import Translations from "src/layouts/components/Translations";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { toastError, toastSuccess } from "src/utils/utils";
import DialogConfirmation from "../../../views/dialogs/DialogConfirmation";
import DialogSubAdmin from "../../../views/dialogs/DialogSubAdmin";
import TableSubAdmin from "../../../views/tables/TableSubAdmin";
import Grid from "@mui/material/Grid2";
import { useAuth } from "src/hooks/useAuth";
import { hasPermission } from "src/utils/permissions";
import PermissionGuard from "src/views/common/auth/PermissionGuard";

const SubAdminPage = () => {
  const { permissionsWithNames, userType } = useAuth();

  const searchTimeoutRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [subAdminList, setSubAdminList] = useState([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE
  );
  const [roles, setRoles] = useState([]);
  //Add Product Category Form
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [dataToEdit, setDataToEdit] = useState(null);

  const toggleDialog = (e, mode = "add", dataToEdit = null) => {
    setOpenDialog((prev) => !prev);
    setDialogMode(mode);
    setDataToEdit(dataToEdit);
  };

  // Confirmation
  const [confirmationDialogLoading, setConfirmationDialogLoading] =
    useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);

  const toggleConfirmationDialog = (e, dataToDelete = null) => {
    setConfirmationDialogOpen((prev) => !prev);
    setDataToDelete(dataToDelete);
  };
  // Remove the old permission checking variables since we'll use PermissionGuard
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
      .get(ApiEndPoints.SUB_ADMIN.list, { params })
      .then((response) => {
        setSubAdminList(response.data.data.subAdmin);
        setTotalCount(response.data.data.totalCount);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchRoles = () => {
    setLoading(true);
    axiosInstance
      .get(ApiEndPoints.ROLE.list)
      .then((response) => {
        setRoles(response.data.data.role);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchRoles();
  }, []);
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
        .delete(ApiEndPoints.SUB_ADMIN.delete(dataToDelete.id))
        .then((response) => response.data)
        .then((response) => {
          fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
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
    [currentPage, dataToDelete, pageSize, search]
  );
  return (
    <>
      <Grid container spacing={4}>
        <Grid size={12}>
          <PageHeader
            title={
              <Typography variant="h5">
                <Translations text="Sub Admin" />
              </Typography>
            }
            action={
              <PermissionGuard permissionName="sub admin" action="add">
                <Button variant="contained" onClick={toggleDialog}>
                  Add Sub Admin
                </Button>
              </PermissionGuard>
            }
          />
        </Grid>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  pb: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 5,
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
              <TableSubAdmin
                search={search}
                loading={loading}
                rows={subAdminList}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                toggleDelete={toggleConfirmationDialog}
                toggleEdit={toggleDialog}
                userType={userType}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DialogSubAdmin
        mode={dialogMode}
        open={openDialog}
        toggle={toggleDialog}
        dataToEdit={dataToEdit}
        onSuccess={() => {
          fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
          });
        }}
        roles={roles}
      />
      <DialogConfirmation
        loading={confirmationDialogLoading}
        title="Delete Sub Admin"
        subtitle="Are you sure you want to delete this Sub Admin?"
        open={confirmationDialogOpen}
        toggle={toggleConfirmationDialog}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

export default SubAdminPage;
