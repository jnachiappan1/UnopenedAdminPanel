import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
// import { MEDIA_URL } from '../../network/endpoints'
import moment from "moment";
import { Avatar } from "@mui/material";
import { MEDIA_URL } from "src/network/endpoints";

function TableBanner({
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
    inactive: "#FFB400",
    active: "#325B5B",
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
          field: "pageType",
          minWidth: 150,
          sortable: false,
          headerName: "Page Type",
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.pageType}>
              {row.pageType}
            </Typography>
          ),
        },

        {
          field: "bannerImage",
          flex: 0.1,
          minWidth: 150,
          sortable: false,
          headerName: "Banner Image",
          renderCell: ({ row }) => {
            return (
              <img
                alt=""
                src={`${MEDIA_URL}${row.bannerImage}`}
                style={{ height: "30px", width: "50px" }}
              />
            );
          },
        },
        {
          field: "bannerMobileImage",
          flex: 0.1,
          minWidth: 150,
          sortable: false,
          headerName: "Banner Mobile Image",
          renderCell: ({ row }) => (
            <img
              alt=""
              src={`${MEDIA_URL}${row.bannerMobileImage}`}
              style={{ height: "30px", width: "50px" }}
            />
          ),
        },

        {
          field: "Actions",
          flex: 0,
          minWidth: 170,
          sortable: false,
          headerName: "Actions",
          renderCell: ({ row }) => (
            <Box display="flex" alignItems="center" gap="10px">
              <IconButton
                size="small"
                color="primary"
                variant="outlined"
                onClick={(e) => toggleEdit(e, "edit", row)}
              >
                <EditIcon />
              </IconButton>
              {/* <IconButton
                size="small"
                color="secondary"
                onClick={(e) => toggleDelete(e, row)}
              >
                <DeleteIcon />
              </IconButton> */}
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

export default TableBanner;
