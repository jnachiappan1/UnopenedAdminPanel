import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import PermissionGuard from "src/views/common/auth/PermissionGuard";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";

function TableContactUs({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  toggleEdit,
}) {
  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        {
          field: "full_name",
          headerName: "Full Name",
          minWidth: 180,
          flex: 1,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.full_name}>
              {row.full_name}
            </Typography>
          ),
        },
        {
          field: "phone_number",
          headerName: "Phone Number",
          minWidth: 180,
          flex: 1,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.phone_number}>
              {`${row.country_code}${row.phone_number}`}
            </Typography>
          ),
        },
        {
          field: "email",
          headerName: "Email",
          minWidth: 250,
          flex: 1,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.email}>
              {row.email}
            </Typography>
          ),
        },
        {
          field: "message",
          headerName: "Message",
          minWidth: 300,
          flex: 1,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.message}>
              {row.message}
            </Typography>
          ),
        },
        {
          field: "Actions",
          flex: 0.1,
          minWidth: 170,
          sortable: false,
          headerName: "Reply",
          renderCell: ({ row }) => (
            <Box display="flex" alignItems="center" gap="10px">
              <PermissionGuard permissionName="contactUs" action="write">
                <IconButton
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={(e) => toggleEdit(e, "edit", row)}
                >
                  <ReplyOutlinedIcon />
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

export default TableContactUs;
