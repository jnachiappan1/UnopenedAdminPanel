import { useEffect, useState, useRef } from "react";
import { CardContent, MenuItem, Select, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PageHeader from "../../@core/components/page-header/index";
import Translations from "../../layouts/components/Translations";
import { axiosInstance } from "../../network/adapter";
import { ApiEndPoints } from "../../network/endpoints";
import { DefaultPaginationSettings } from "../../constants/general.const";
import { toastError } from "../../utils/utils";
import TableTransactions from "src/views/tables/TableTransactions";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";

const OrderTransactionsPage = () => {
  const { userType } = useAuth();
  const searchTimeoutRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE
  );
  const [transactionType, setTransactionType] = useState("add_funds");

  const navigate = useNavigate();

  const handleViewDetails = (transaction) => {
    navigate(`/transactions/${transaction.id}`);
  };

  const fetchData = ({
    currentPage,
    pageSize = DefaultPaginationSettings.ROWS_PER_PAGE,
    search,
  }) => {
    setLoading(true);
    let params = {
      page: currentPage,
      limit: pageSize,
      search: search,
      status: status,
      payment_transaction_type: transactionType,
    };
    axiosInstance
      .get(ApiEndPoints.TRANSACTION.list, { params })
      .then((response) => {
        setTransactionData(response.data.data.trasaction);
        setTotalCount(response.data.data.totalCount);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData({
      currentPage: currentPage,
      pageSize: pageSize,
      search: search,
      status: status,
    });
  }, [currentPage, pageSize, search, status, transactionType]);

  const handleSearchChange = (e) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 500);
  };

  return (
    <>
      <Grid container spacing={4}>
        <PageHeader
          title={
            <Typography variant="h5">
              <Translations text="Order Transactions" />
            </Typography>
          }
        />
        <Grid size={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  p: 5,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Select
                    size="small"
                    defaultValue={" "}
                    sx={{ bgcolor: "#F7FBFF" }}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setStatus(selectedValue === "All" ? "" : selectedValue);
                    }}
                  >
                    <MenuItem disabled value={" "}>
                      <em>Status</em>
                    </MenuItem>
                    <MenuItem value={"All"}>All</MenuItem>
                    <MenuItem value={"success"}>Success</MenuItem>
                    <MenuItem value={"failed"}>Failed</MenuItem>
                    <MenuItem value={"intialized"}>Initialized</MenuItem>
                    <MenuItem value={"inprogress"}>In Progress</MenuItem>
                  </Select>

                  <Select
                    size="small"
                    value={transactionType}
                    sx={{ bgcolor: "#F7FBFF" }}
                    onChange={(e) => setTransactionType(e.target.value)}
                  >
                    <MenuItem value={"add_funds"}>Add Funds</MenuItem>
                    <MenuItem value={"cashout"}>Cashout</MenuItem>
                  </Select>

                  <TextField
                    type="search"
                    size="small"
                    placeholder="Search"
                    onChange={handleSearchChange}
                  />
                </Box>
              </Box>

              <TableTransactions
                search={search}
                loading={loading}
                rows={transactionData}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                onViewDetails={handleViewDetails}
                userType={userType}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default OrderTransactionsPage;
