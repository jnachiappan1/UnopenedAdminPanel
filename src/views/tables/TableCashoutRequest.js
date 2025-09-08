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

  const navigate = useNavigate();
  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        {
          field: "type",
          minWidth: 200,
          sortable: false,
          headerName: "Type",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.type}>
              {row.type}
            </Typography>
          ),
        },
        {
          field: "venmo",
          minWidth: 180,
          sortable: false,
          headerName: "Venmo",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.venmo}>
              {row.venmo}
            </Typography>
          ),
        },
        {
          field: "cash_app",
          minWidth: 180,
          sortable: false,
          headerName: "Cash App",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.cash_app}>
              {row.cash_app}
            </Typography>
          ),
        },
        {
          field: "amount",
          minWidth: 180,
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
          sortable: false,
          headerName: "Status",
          renderCell: ({ row }) => <CustomChip label={row.status} />,
        },
        {
          field: "Actions",
          flex: 0.1,
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
