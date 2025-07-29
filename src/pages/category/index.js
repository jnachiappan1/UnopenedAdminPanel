import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PageHeader from "src/@core/components/page-header";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { toastError, toastSuccess } from "src/utils/utils";
import Grid from "@mui/material/Grid2";
import DialogConfirmation from "src/views/dialogs/DialogConfirmation";
import { useAuth } from "src/hooks/useAuth";
import PermissionGuard from "src/views/common/auth/PermissionGuard";
import TableCategory from "src/views/tables/TableCategory";
import DialogCategory from "src/views/dialogs/DialogCategory";
const CategoryPage = () => {
  const { userType } = useAuth();
  const searchTimeoutRef = useRef();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE
  );
  const [categoryFormDialogOpen, setCategoryFormDialogOpen] = useState(false);
  const [categoryFormDialogMode, setCategoryFormDialogMode] = useState("add");
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const toggleCategoryFormDialog = (e, mode = "add", categoryToEdit = null) => {
    setCategoryFormDialogOpen((prev) => !prev);
    setCategoryFormDialogMode(mode);
    setCategoryToEdit(categoryToEdit);
  };

  const [confirmationDialogLoading, setConfirmationDialogLoading] =
    useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const toggleConfirmationDialog = (e, dataToDelete = null) => {
    setConfirmationDialogOpen((prev) => !prev);
    setCategoryToDelete(dataToDelete);
  };

  // Remove the old permission checking variables since we'll use PermissionGuard
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
    };
    axiosInstance
      .get(ApiEndPoints.CATEGORY.list, { params })
      .then((response) => {
        setCategoryData(response.data.data.category);
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
    });
  }, [currentPage, pageSize, search]);

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
        .delete(ApiEndPoints.CATEGORY.delete(categoryToDelete.id))
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
    [categoryToDelete, currentPage, pageSize]
  );
  return (
    <>
      <Grid container spacing={4} className="match-height">
        <PageHeader
          title={<Typography variant="h5">Category</Typography>}
          action={
            <PermissionGuard permissionName="category" action="add">
              <Button
                variant="contained"
                onClick={(e) => toggleCategoryFormDialog(e, "add")}
              >
                Add Category
              </Button>
            </PermissionGuard>
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
                justifyContent: "end",
              }}
            >
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
              <TableCategory
                search={search}
                loading={loading}
                rows={categoryData}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                toggleEdit={toggleCategoryFormDialog}
                toggleDelete={toggleConfirmationDialog}
                userType={userType}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <DialogCategory
        mode={categoryFormDialogMode}
        open={categoryFormDialogOpen}
        toggle={toggleCategoryFormDialog}
        dataToEdit={categoryToEdit}
        onSuccess={() => {
          fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
          });
        }}
      />
      <DialogConfirmation
        loading={confirmationDialogLoading}
        title="Delete Category"
        subtitle="Are you sure you want to delete this Category?"
        open={confirmationDialogOpen}
        toggle={toggleConfirmationDialog}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

export default CategoryPage;
