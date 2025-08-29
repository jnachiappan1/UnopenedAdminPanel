import Typography from "@mui/material/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import moment from "moment";
import { Chip, styled } from "@mui/material";

function TableTransactions({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  onViewDetails,
}) {
  const statusColors = {
    success: "#56ca001e",
    failed: "#ff4d4f1e",
    initialized: "#faad141e",
    inprogress: "#1890ff1e",
  };

  const CustomChip = styled(Chip)(({ label }) => ({
    backgroundColor: statusColors[label] || "#8a8d931e",
    textTransform: "capitalize",
    color: 
      label === "success" ? "#45a200" : 
      label === "failed" ? "#ff4d4f" : 
      label === "initialized" ? "#faad14" : 
      label === "inprogress" ? "#1890ff" : 
      "#898b90",
    width: "100px",
  }));

  return (
    <CustomDataGrid
      loading={loading}
      rowCount={totalCount}
      rows={rows}
      columns={[
        {
          field: "transactionType",
          headerName: "Transaction Type",
          minWidth: 200,
          flex: 1,
          renderCell: ({ row }) => (
            <Typography
              noWrap
              variant="body2"
              title={row.transactionType}
              sx={{ textTransform: "capitalize" }}
            >
              {row.transactionType}
            </Typography>
          ),
        },
        {
          field: "amount",
          headerName: "Amount",
          minWidth: 150,
          flex: 1,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={`$${row.amount}`}>
              ${row.amount}
            </Typography>
          ),
        },
        {
          field: "wallet_amount",
          headerName: "Wallet Amount",
          minWidth: 150,
          flex: 1,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={`$${row.wallet_amount}`}>
              ${row.wallet_amount}
            </Typography>
          ),
        },
        {
          field: "payment_transaction_type",
          headerName: "Payment Transaction Type",
          minWidth: 250,
          flex: 1,
          renderCell: ({ row }) => {
            const formattedText = row.payment_transaction_type
              ?.replace(/_/g, " ") // remove underscores
              .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word

            return (
              <Typography noWrap variant="body2" title={formattedText}>
                {formattedText}
              </Typography>
            );
          },
        },

        {
          field: "paid_on",
          headerName: "Paid On",
          minWidth: 200,
          flex: 1,
          renderCell: ({ row }) => (
            <Typography noWrap variant="body2" title={row.paid_on}>
              {moment(row.paid_on).format("DD-MM-YYYY HH:mm")}
            </Typography>
          ),
        },
        {
          field: "status",
          headerName: "Status",
          minWidth: 150,
          flex: 1,
          renderCell: ({ row }) => <CustomChip label={row.status} />,
        },

        // {
        //   field: "Actions",
        //   flex: 0.1,
        //   minWidth: 100,
        //   sortable: false,
        //   headerName: "Actions",
        //   renderCell: ({ row }) => (
        //     <Box display="flex" alignItems="center" gap="10px">
        //       <IconButton
        //         size="small"
        //         color="primary"
        //         variant="outlined"
        //         onClick={() => onViewDetails(row)}
        //       >
        //         <VisibilityIcon />
        //       </IconButton>
        //     </Box>
        //   ),
        // },
      ]}
      currentPage={currentPage}
      pageSize={pageSize}
      setCurrentPage={setCurrentPage}
      setPageSize={setPageSize}
    />
  );
}

export default TableTransactions;
