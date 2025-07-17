import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PageHeader from "src/@core/components/page-header";
import Translations from "src/layouts/components/Translations";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { toastError, toastSuccess } from "src/utils/utils";
import Grid from "@mui/material/Grid2";
import DialogConfirmation from "src/views/dialogs/DialogConfirmation";
// import Tableproduct from "src/views/tables/Tableproduct";
// import Dialogproducts from "src/views/dialogs/Dialogproduct";
// import TablePermission from "src/views/tables/TablePermission";
// import Dialogpermission from "src/views/dialogs/DialogPermission";
import { useNavigate } from "react-router-dom";
import TableRoles from "src/views/tables/TableRoles";

const RolesPage = () => {
  const searchTimeoutRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [careerData, setCareerData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE
  );
  const [careerFormDialogOpen, setCareerFormDialogOpen] = useState(false);
  const [careerFormDialogMode, setCareerFormDialogMode] = useState("add");
  const [careerToEdit, setCareerToEdit] = useState(null);
  const [permissionList, setPermissionList] = useState([]);
  const [dataToDelete, setDataToDelete] = useState(null);

  const togglecareerFormDialog = (e, mode = "add", careerToEdit = null) => {
    setCareerFormDialogOpen((prev) => !prev);
    setCareerFormDialogMode(mode);
    setCareerToEdit(careerToEdit);
  };

  const [confirmationDialogLoading, setConfirmationDialogLoading] =
    useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [careerToDelete, setcareerToDelete] = useState(null);
  const navigate = useNavigate();

  const toggleConfirmationDialog = (e, dataToDelete = null) => {
    setConfirmationDialogOpen((prev) => !prev);
    setDataToDelete(dataToDelete); 
  };

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
      .get(ApiEndPoints.ROLE.list, { params })
      .then((response) => {
        setRoles(response.data.data.role);
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

  const fetchPermissionsData = () => {
    setLoading(true);
    axiosInstance
      .get(ApiEndPoints.PERMISSION.list)
      .then((response) => {
        const permissionData = response.data.data.permission;
        const mapped = permissionData.map(({ name, id }) => ({
          name,
          permission_id: id,
          read: false,
          write: false,
          add: false,
          remove: false,
        }));
        setPermissionList(mapped);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchPermissionsData();
  }, []);

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
        .delete(ApiEndPoints.ROLE.delete(dataToDelete.id))
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
    [dataToDelete, currentPage, pageSize, search]
  );
  return (
    <>
      <Grid container spacing={4} className="match-height">
        <PageHeader
          title={
            <Typography variant="h5">
              <Translations text="Roles" />
            </Typography>
          }
          action={
            <Button variant='contained' onClick={togglecareerFormDialog}>
              Add Category
            </Button>
            // <Button
            //   variant="contained"
            //   onClick={() =>
            //     navigate("/roles/add", {
            //       state: { permissions: permissionList },
            //     })
            //   }
            // >
            //   Add Role
            // </Button>
          }
        />
        <Grid size={12}>
          <Card>
            <Box
              sx={{
                p: 5,
                pb: 0,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box></Box>
              <Box
                sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
              >
                <TextField
                  type="search"
                  size="small"
                  placeholder="Search"
                  onChange={handleSearchChange}
                />
              </Box>
            </Box>
            <Box sx={{ p: 5 }}>
              <TableRoles
                search={search}
                loading={loading}
                rows={roles}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                toggleDelete={toggleConfirmationDialog}
                toggleEdit={fetchPermissionsData}
                permissionList={permissionList}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <DialogConfirmation
        loading={confirmationDialogLoading}
        title="Delete Role"
        subtitle="Are you sure you want to delete this Role?"
        open={confirmationDialogOpen}
        toggle={toggleConfirmationDialog}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

export default RolesPage;
