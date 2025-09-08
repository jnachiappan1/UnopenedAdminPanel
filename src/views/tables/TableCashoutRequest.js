import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
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

function TableCashOutRequest({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  toggleEdit,
}) {
  const statusColors = {
    approved: "#4CAF50", // green
    pending: "#FFB400", // amber
    rejected: "#F44336", // red
    default: "#BDBDBD", // fallback grey
  };

  const CustomChip = styled(Chip)(({ label }) => ({
    backgroundColor: `${statusColors[label] || statusColors.default}1e`, // light tint
    textTransform: "capitalize",
    color: statusColors[label] || statusColors.default,
    width: "100px",
    fontWeight: 500,
  }));

  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        {
          field: "full_name",
          minWidth: 200,
          flex: 1,
          sortable: false,
          headerName: "User Name",
          renderCell: ({ row }) => (
            <Typography
              noWrap
              variant="body2"
              title={row.cashout_user?.full_name}
            >
              {row.cashout_user?.full_name}
            </Typography>
          ),
        },
        {
          field: "email",
          minWidth: 250,
          flex: 1,
          sortable: false,
          headerName: "Email",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.cashout_user?.email}>
              {row.cashout_user?.email}
            </Typography>
          ),
        },
        {
          field: "type",
          minWidth: 200,
          flex: 1,
          sortable: false,
          headerName: "Type",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.type}>
              {row.type}
            </Typography>
          ),
        },
        {
          field: "cashoutId",
          minWidth: 180,
          flex: 1,
          sortable: false,
          headerName: "Cashout ID",
          renderCell: ({ row }) => (
            <Typography
              noWrap
              variant="body2"
              title={row.venmo || row.cash_app}
            >
              {row.venmo || row.cash_app}
            </Typography>
          ),
        },
        {
          field: "amount",
          minWidth: 180,
          flex: 1,
          sortable: false,
          headerName: "Amount",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.amount}>
              {row.amount}
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
          field: "Actions",
          flex: 0,
          minWidth: 100,
          sortable: false,
          headerName: "Actions",
          renderCell: ({ row }) => (
            <Box display="flex" alignItems="center" gap="10px">
              <PermissionGuard permissionName="cashout" action="write">
                <IconButton
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={(e) => toggleEdit(e, row)}
                  disabled={row.status === "pending" ? false : true}
                >
                  <EditIcon />
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

export default TableCashOutRequest;
