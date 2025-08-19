import { useEffect, useState, useRef, useCallback } from "react";
import { Button, MenuItem, Select, Typography } from "@mui/material";
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
import DialogCoupon from "src/views/dialogs/DialogCoupon";
import TableCoupon from "src/views/tables/TableCoupon";

const CouponPage = () => {
  const { userType } = useAuth();
  const searchTimeoutRef = useRef();
  const [loading, setLoading] = useState(false);
  const [couponData, setCouponData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE
  );
  const [couponFormDialogOpen, setCouponFormDialogOpen] = useState(false);
  const [couponFormDialogMode, setCouponFormDialogMode] = useState("add");
  const [couponToEdit, setCouponToEdit] = useState(null);

  const toggleCouponFormDialog = (e, mode = "add", couponToEditArg = null) => {
    setCouponFormDialogOpen((prev) => !prev);
    setCouponFormDialogMode(mode);
    setCouponToEdit(couponToEditArg);
  };

  const [confirmationDialogLoading, setConfirmationDialogLoading] =
    useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const toggleConfirmationDialog = (e, dataToDelete = null) => {
    setConfirmationDialogOpen((prev) => !prev);
    setCouponToDelete(dataToDelete);
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
      .get(ApiEndPoints.COUPON.list, { params })
      .then((response) => {
        setCouponData(response.data.data.coupons);
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
        .delete(ApiEndPoints.COUPON.delete(couponToDelete.id))
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
    [couponToDelete, currentPage, pageSize]
  );
  return (
    <>
      <Grid container spacing={4}>
        <PageHeader
          title={<Typography variant="h5">Coupons</Typography>}
          action={
            <PermissionGuard permissionName="coupon" action="add">
              <Button
                variant="contained"
                onClick={(e) => toggleCouponFormDialog(e, "add")}
              >
                Add Coupon
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
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "10px",
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
            <Box sx={{ p: 5 }}>
              <TableCoupon
                search={search}
                loading={loading}
                rows={couponData}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                toggleEdit={toggleCouponFormDialog}
                toggleDelete={toggleConfirmationDialog}
                userType={userType}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <DialogCoupon
        mode={couponFormDialogMode}
        open={couponFormDialogOpen}
        toggle={toggleCouponFormDialog}
        dataToEdit={couponToEdit}
        onSuccess={() => {
          fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
          });
        }}
      />
      <DialogConfirmation
        loading={confirmationDialogLoading}
        title="Delete Coupon"
        subtitle="Are you sure you want to delete this Coupon?"
        open={confirmationDialogOpen}
        toggle={toggleConfirmationDialog}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

export default CouponPage;
