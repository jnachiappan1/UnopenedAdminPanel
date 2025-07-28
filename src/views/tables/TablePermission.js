import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import PermissionGuard from "src/views/common/auth/PermissionGuard";

function TablePermission({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  toggleEdit,
  toggleDelete,
  userType,
}) {
  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        {
          field: "permissions",
          headerName: "Permissions",
          minWidth: 250,
          flex: 1,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.name}>
              {row.name}
            </Typography>
          ),
        },
        {
          field: "Actions",
          flex: 0.1,
          minWidth: 170,
          sortable: false,
          headerName: "Actions",
          renderCell: ({ row }) => (
            <Box display="flex" alignItems="center" gap="10px">
              <PermissionGuard permissionName="permission" action="write">
                <IconButton
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={(e) => toggleEdit(e, "edit", row)}
                >
                  <EditIcon />
                </IconButton>
              </PermissionGuard>
              <PermissionGuard permissionName="permission" action="remove">
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

export default TablePermission;
