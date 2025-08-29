import { useEffect, useState } from "react";
import { Button, Typography, Card, Box, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageHeader from "src/@core/components/page-header";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError } from "src/utils/utils";
import DialogCashOutFees from "src/views/dialogs/DialogCashOutFees";
import PermissionGuard from "src/views/common/auth/PermissionGuard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const CashOutFeesPage = () => {
  const [loading, setLoading] = useState(false);
  const [feesData, setFeesData] = useState(null);
  const [feesFormDialogOpen, setFeesFormDialogOpen] = useState(false);
  const [feesFormDialogMode, setFeesFormDialogMode] = useState("edit");
  const [feesToEdit, setFeesToEdit] = useState(null);

  const toggleFeesFormDialog = (e, mode = "edit", feesToEdit = null) => {
    setFeesFormDialogOpen((prev) => !prev);
    setFeesFormDialogMode(mode);
    setFeesToEdit(feesToEdit);
  };

  const fetchData = () => {
    setLoading(true);
    axiosInstance
      .get(ApiEndPoints.CASHOUT_FEES.list)
      .then((response) => {
        setFeesData(response.data.data.cashOutFees);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={4}>
        <PageHeader
          title={<Typography variant="h5">Cashout Fees</Typography>}
          action={
            <PermissionGuard permissionName="cashoutFees" action="write">
              <Button
                variant="contained"
                onClick={(e) => toggleFeesFormDialog(e, "edit", feesData)}
              >
                Update Fees
              </Button>
            </PermissionGuard>
          }
        />
        <Grid size={12}>
          <Card>
            <Box
              sx={{
                p: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "300px",
              }}
            >
              {loading ? (
                <Typography variant="h6" color="text.secondary">
                  Loading...
                </Typography>
              ) : feesData ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      {feesData.cashout_fees || "0.00"}%
                    </Typography>
                  </Box>
                  <Chip
                    label="Current Cashout Fee"
                    color="primary"
                    variant="outlined"
                    size="large"
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ maxWidth: "400px" }}
                  >
                    This is the current cashout fee charged to users. You can
                    update this value using the button above.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <AccountBalanceWalletIcon
                    sx={{ fontSize: 48, color: "text.disabled" }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No data available
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Set the initial cashout fee using the button above.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
      <DialogCashOutFees
        mode={feesFormDialogMode}
        open={feesFormDialogOpen}
        toggle={toggleFeesFormDialog}
        dataToEdit={feesToEdit}
        onSuccess={() => {
          fetchData();
        }}
      />
    </>
  );
};

export default CashOutFeesPage;
