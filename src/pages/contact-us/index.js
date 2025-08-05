import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PageHeader from "src/@core/components/page-header";
import Translations from "src/layouts/components/Translations";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { toastError, toastSuccess } from "src/utils/utils";
import Grid from "@mui/material/Grid2";
import TablePermission from "src/views/tables/TablePermission";
import Dialogpermission from "src/views/dialogs/DialogPermission";
import { useAuth } from "src/hooks/useAuth";
import { hasPermission } from "src/utils/permissions";
import PermissionGuard from "src/views/common/auth/PermissionGuard";
import TableContactUs from "src/views/tables/TableContactUs";
import DialogContactUs from "src/views/dialogs/DialogContactUs";

const ContactUsPage = () => {
  const { userType } = useAuth();
  const searchTimeoutRef = useRef();
  const [loading, setLoading] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    DefaultPaginationSettings.ROWS_PER_PAGE
  );
  const [contactFormDialogOpen, setContactFormDialogOpen] = useState(false);
  const [contactFormDialogMode, setContactFormDialogMode] = useState("add");
  const [contactToEdit, setContactToEdit] = useState(null);

  const toggleContactFormDialog = (e, mode = "add", contactToEdit = null) => {
    setContactFormDialogOpen((prev) => !prev);
    setContactFormDialogMode(mode);
    setContactToEdit(contactToEdit);
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
    };
    axiosInstance
      .get(ApiEndPoints.CONTACT_US.list, { params })
      .then((response) => {
        setContactData(response.data.data?.contactUs);
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
    });
  }, [currentPage, pageSize, search]);

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
              <Translations text="Contacts" />
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
                sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
              >
                <TextField
                  type="search"
                  size="small"
                  placeholder="Search"
                  onChange={handleSearchChange}
                />
              </Box>
            </Box>
            <Box sx={{ p: 5 }}>
              <TableContactUs
                search={search}
                loading={loading}
                rows={contactData}
                totalCount={totalCount}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                setPageSize={setPageSize}
                pageSize={pageSize}
                toggleEdit={toggleContactFormDialog}
                userType={userType}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <DialogContactUs
        mode={contactFormDialogMode}
        open={contactFormDialogOpen}
        toggle={toggleContactFormDialog}
        dataToEdit={contactToEdit}
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

export default ContactUsPage;
