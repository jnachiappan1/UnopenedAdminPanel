import { Typography, Chip } from "@mui/material";
import moment from "moment";
import CustomDataGrid from "src/@core/components/data-grid";

const TableNotifications = ({
  rows,
  loading,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
}) => {
  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      minWidth: 100,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        const serial = (currentPage - 1) * pageSize + rowIndex + 1;

        return (
          <Typography noWrap variant="body2">
            {serial}
          </Typography>
        );
      },
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 200,
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography
          noWrap
          variant="body2"
          title={row.title}
          textTransform="capitalize"
        >
          {row.title}
        </Typography>
      ),
    },

    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => {
        return (
          <Typography noWrap variant="body2" title={row?.meta_data?.email}>
            {row?.meta_data?.email || "—"}
          </Typography>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Date",
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => {
        const fullDateTime = moment(row.createdAt).format(
          "DD MMM YYYY, hh:mm A",
        );

        return (
          <Typography noWrap variant="body2" title={fullDateTime}>
            {fullDateTime}
          </Typography>
        );
      },
    },

    {
      field: "body",
      headerName: "Message",
      minWidth: 400,
      flex: 2,
      sortable: false,
      renderCell: ({ row }) => (
        <Typography
          noWrap
          variant="body2"
          title={row.body}
          sx={{
            maxWidth: 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.body}
        </Typography>
      ),
    },
    {
      field: "isRead",
      headerName: "Status",
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      renderCell: ({ row }) => (
        <Chip
          label={row.isRead ? "Read" : "Unread"}
          color={row.isRead ? "success" : "warning"}
          size="small"
          sx={{ textTransform: "capitalize" }}
        />
      ),
    },
  ];

  return (
    <CustomDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      rowCount={totalCount}
      currentPage={currentPage}
      pageSize={pageSize}
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
    />
  );
};

export default TableNotifications;
