import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Chip, styled } from "@mui/material";
import PermissionGuard from "src/views/common/auth/PermissionGuard";

const TableRoles = ({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  toggleDelete,
  permissionList,
  userType,
}) => {
  const navigate = useNavigate();
  const statusColors = {
    inactive: "#8a8d931e",
    active: "#56ca001e",
  };
  const CustomChip = styled(Chip)(({ label }) => ({
    backgroundColor: statusColors[label] || statusColors.default,
    textTransform: "capitalize",
    color: label === "active" ? "#45a200" : "#898b90",
    width: "100px",
  }));
  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        {
          field: "name",
          minWidth: 300,
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
          field: "status",
          minWidth: 10,
          flex: 0.5,
          sortable: false,
          headerName: "Status",
          renderCell: ({ row }) => <CustomChip label={row.status} />,
        },
        {
          field: "Actions",
          flex: 0,
          minWidth: 150,
          sortable: false,
          headerName: "Actions",
          renderCell: ({ row }) => (
            <Box display="flex" alignItems="center" gap="10px">
              <PermissionGuard permissionName="roles" action="write">
                <IconButton
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={() =>
                    navigate(`/roles/edit/${row.id}`, {
                      state: { dataToEdit: row, permissions: permissionList },
                    })
                  }
                >
                  <EditIcon />
                </IconButton>
              </PermissionGuard>
              <PermissionGuard permissionName="roles" action="remove">
                <IconButton
                  size="small"
                  variant="outlined"
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
};

export default TableRoles;
