import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PermissionGuard from "src/views/common/auth/PermissionGuard";

function Tableproduct({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  toggleEdit,
  toggleDelete,
}) {
  const statusColors = {
    approved: "#4CAF50", // green
    pending: "#FFB400", // amber
    rejected: "#F44336", // red
    default: "#BDBDBD", // fallback grey
  };

  const productStatusColors = {
    active: "#4CAF50", // green
    sold: "#9C27B0", // purple
    in_review: "#2196F3", // blue
    withdrawn: "#607D8B", // blue grey
    rejected: "#F44336", // red
    default: "#BDBDBD",
  };

  // ✅ CustomChip for general status
  const CustomChip = styled(Chip)(({ label }) => ({
    backgroundColor: `${statusColors[label] || statusColors.default}1e`,
    textTransform: "capitalize",
    color: statusColors[label] || statusColors.default,
    width: "100px",
    fontWeight: 500,
  }));

  // ✅ ProductStatusChip uses raw `status` for colors
  const ProductStatusChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== "status", // don't pass `status` to DOM
  })(({ status }) => ({
    backgroundColor: `${
      productStatusColors[status] || productStatusColors.default
    }1e`,
    textTransform: "capitalize",
    color: productStatusColors[status] || productStatusColors.default,
    width: "120px",
    fontWeight: 500,
  }));

  const navigate = useNavigate();

  // ✅ Helper for formatting
  const formatStatus = (status) =>
    status
      ? status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
      : "";

  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        {
          field: "name",
          minWidth: 400,
          flex: 1,
          sortable: false,
          headerName: "Name",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.name}>
              {row.name}
            </Typography>
          ),
        },
        {
          field: "brand",
          minWidth: 150,
          flex: 0.5,
          sortable: false,
          headerName: "Brand",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.brand}>
              {row.brand}
            </Typography>
          ),
        },
        {
          field: "price",
          minWidth: 150,
          flex: 0.5,
          sortable: false,
          headerName: "Price",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.price}>
              {row.price}
            </Typography>
          ),
        },
        {
          field: "msrp",
          minWidth: 150,
          flex: 0.5,
          sortable: false,
          headerName: "MSRP",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.msrp}>
              {row.msrp}
            </Typography>
          ),
        },
        {
          field: "updatedAt",
          minWidth: 180,
          flex: 0.5,
          sortable: false,
          headerName: "Created At",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.updatedAt}>
              {moment(row.updatedAt).format("DD-MM-YYYY HH:mm")}
            </Typography>
          ),
        },
        {
          field: "status",
          minWidth: 180,
          flex: 0.1,
          sortable: false,
          headerName: "Status",
          renderCell: ({ row }) => <CustomChip label={row.status} />,
        },
        {
          field: "product_status",
          minWidth: 180,
          flex: 0.1,
          sortable: false,
          headerName: "Product Status",
          renderCell: ({ row }) => {
            const statusKey = row.product_status;
            return (
              <ProductStatusChip
                label={formatStatus(statusKey)} // nice label
                status={statusKey} // raw key for color
              />
            );
          },
        },
        {
          field: "Actions",
          flex: 0.1,
          minWidth: 250,
          sortable: false,
          headerName: "Actions",
          renderCell: ({ row }) => (
            <Box display="flex" alignItems="center" gap="10px">
              <Button
                size="small"
                variant="outlined"
                sx={{ width: "120px" }}
                onClick={() => navigate(`/product/${row.id}`)}
              >
                {row.status === "pending" && row.product_status !== "withdrawn"
                  ? "View & Update"
                  : "View Details"}
              </Button>
              <PermissionGuard permissionName="product" action="remove">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => toggleDelete(e, row)}
                >
                  <DeleteIcon />
                </IconButton>
              </PermissionGuard>
            </Box>
          ),
        },
      ]}
      currentPage={currentPage}
      pageSize={pageSize}
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
    />
  );
}

export default Tableproduct;
