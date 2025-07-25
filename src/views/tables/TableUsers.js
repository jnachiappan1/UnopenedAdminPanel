import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import { MEDIA_URL } from "src/network/endpoints";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

function TableUsers({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  toggleDelete,
  onViewDetails,
  canDelete
}) {
  const statusColors = {
    inactive: "#FFB400",
    active: "#66bb6a",
  };
  const CustomChip = styled(Chip)(({ label }) => ({
    backgroundColor: statusColors[label] || statusColors.default,
    textTransform: "capitalize",
    color: "#fff",
    width: "100px",
  }));

  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        {
          field: "full_name",
          flex: 0.5,
          minWidth: 300,
          sortable: false,
          headerName: "Full Name",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.full_name}>
              {row.full_name}
            </Typography>
          ),
        },
        {
          field: "email",
          flex: 0.5,
          minWidth: 300,
          sortable: false,
          headerName: "Email",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.email}>
              {row.email}
            </Typography>
          ),
        },
        {
          field: "phone_number",
          flex: 0.5,
          minWidth: 300,
          sortable: false,
          headerName: "Phone Number",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.phone_number}>
              {row.phone_number}
            </Typography>
          ),
        },
        {
          field: "country",
          flex: 0.5,
          minWidth: 300,
          sortable: false,
          headerName: "Country",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.country}>
              {row.country}
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
          minWidth: 200,
          sortable: false,
          headerName: "Actions",
          renderCell: ({ row }) => (
            <Box display="flex" alignItems="center" gap="15px">
              {canDelete && <IconButton
                size="small"
                color="primary"
                onClick={(e) => toggleDelete(e, row)}
              >
                <DeleteIcon />
              </IconButton>}
             
              <Button
                variant="outlined"
                size="small"
                onClick={() => onViewDetails(row)}
              >
                User Details
              </Button>
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

export default TableUsers;
