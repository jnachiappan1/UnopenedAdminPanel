import { useEffect, useState, useRef } from "react";
import { MenuItem, Select, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PageHeader from "src/@core/components/page-header";
import Translations from "src/layouts/components/Translations";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { toastError } from "src/utils/utils";
import Grid from "@mui/material/Grid2";
import TableCashOutRequest from "src/views/tables/TableCashoutRequest";
import DialogCashOutFees from "src/views/dialogs/DialogCashOutFees";
import DialogCashOutRequest from "src/views/dialogs/DialogCashoutRequest";

const CashOutRequestPage = () => {
  const searchTimeoutRef = useRef();
  const [loading, setLoading] = useState(false);
  const [cashOutData, setCashOutData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE
  );

  const [cashOutRequestFormDialogOpen, setCashOutRequestFormDialogOpen] =
    useState(false);
  const [cashOutRequestToEdit, setCashOutRequestToEdit] = useState(null);

  const toggleCashOutRequestFormDialog = (e, dataToEdit = null) => {
    setCashOutRequestFormDialogOpen((prev) => !prev);
    setCashOutRequestToEdit(dataToEdit);
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
    };
    axiosInstance
      .get(ApiEndPoints.CASHOUT_REQUEST.list, { params })
      .then((response) => {
        setCashOutData(response.data.data.cashOut);
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
  }, [currentPage, pageSize, search, status]);

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
              <Translations text="Cashout Requests" />
            </Typography>
          }
        />
        <Grid size={12}>
          <Card>
            <Box
              sx={{
                p: 5,
                pb: 0,
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
                  <MenuItem value={"approved"}>Approved</MenuItem>
                  <MenuItem value={"pending"}>Pending</MenuItem>
                  <MenuItem value={"rejected"}>Rejected</MenuItem>
                </Select>
                <TextField
                  type="search"
                  size="small"
                  placeholder="Search"
                  onChange={handleSearchChange}
                />
              </Box>
            </Box>
            <Box sx={{ p: 5 }}>
              <TableCashOutRequest
                search={search}
                loading={loading}
                rows={cashOutData}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                toggleEdit={toggleCashOutRequestFormDialog}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <DialogCashOutRequest
        open={cashOutRequestFormDialogOpen}
        toggle={toggleCashOutRequestFormDialog}
        dataToEdit={cashOutRequestToEdit}
        onSuccess={() => {
          fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
          });
        }}
      />
    </>
  );
};

export default CashOutRequestPage;
