import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import PermissionGuard from "src/views/common/auth/PermissionGuard";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

function TableCoupon({
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
    inactive: "#8a8d931e",
    active: "#56ca001e",
    expired: "#ff56301e",
  };
  const CustomChip = styled(Chip)(({ label }) => ({
    backgroundColor: statusColors[label] || statusColors.inactive,
    textTransform: "capitalize",
    color: label === "active" ? "#45a200" : label === "expired" ? "#ff5630" : "#898b90",
    width: "100px",
  }));

  const formatDateTime = (iso) => {
    try {
      return iso ? new Date(iso).toLocaleString() : "-";
    } catch {
      return iso || "-";
    }
  };

  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        {
          field: "title",
          headerName: "Title",
          minWidth: 220,
          flex: 1,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.title}>
              {row.title}
            </Typography>
          ),
        },
        {
          field: "code",
          headerName: "Code",
          minWidth: 140,
          flex: 0.4,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.code}>
              {row.code}
            </Typography>
          ),
        },
        {
          field: "start_date",
          headerName: "Start Date",
          minWidth: 200,
          flex: 0.6,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={formatDateTime(row.start_date)}>
              {formatDateTime(row.start_date)}
            </Typography>
          ),
        },
        {
          field: "end_date",
          headerName: "End Date",
          minWidth: 200,
          flex: 0.6,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={formatDateTime(row.end_date)}>
              {formatDateTime(row.end_date)}
            </Typography>
          ),
        },
        {
          field: "minimum_purchase_amount",
          headerName: "Min Purchase",
          minWidth: 140,
          flex: 0.4,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={`$${row.minimum_purchase_amount}`}>{`$${row.minimum_purchase_amount}`}</Typography>
          ),
        },
        {
          field: "discount_amount",
          headerName: "Discount",
          minWidth: 120,
          flex: 0.3,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={`$${row.discount_amount}`}>{`$${row.discount_amount}`}</Typography>
          ),
        },
        {
          field: "usage_limit",
          headerName: "Usage Limit",
          minWidth: 120,
          flex: 0.3,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={`${row.usage_limit}`}>{row.usage_limit}</Typography>
          ),
        },
        {
          field: "applicable_user",
          headerName: "Applicable User",
          minWidth: 160,
          flex: 0.4,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.applicable_user} sx={{ textTransform: "capitalize" }}>
              {row.applicable_user}
            </Typography>
          ),
        },
        {
          field: "status",
          headerName: "Status",
          minWidth: 140,
          flex: 0.3,
          renderCell: ({ row }) => <CustomChip label={row.status} />,
        },
        {
          field: "Actions",
          flex: 0.1,
          minWidth: 170,
          sortable: false,
          headerName: "Actions",
          renderCell: ({ row }) => (
            <Box display="flex" alignItems="center" gap="10px">
              <PermissionGuard permissionName="coupon" action="write">
                <IconButton
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={(e) => toggleEdit(e, "edit", row)}
                >
                  <EditIcon />
                </IconButton>
              </PermissionGuard>
              <PermissionGuard permissionName="coupon" action="remove">
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

export default TableCoupon;
