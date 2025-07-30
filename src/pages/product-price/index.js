import { useEffect, useState } from "react";
import { Button, Typography, Card, Box, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageHeader from "src/@core/components/page-header";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import DialogProductPrice from "src/views/dialogs/DialogProductPrice";
import PermissionGuard from "src/views/common/auth/PermissionGuard";
import { useAuth } from "src/hooks/useAuth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const ProductPricePage = () => {
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [priceFormDialogOpen, setPriceFormDialogOpen] = useState(false);
  const [priceFormDialogMode, setPriceFormDialogMode] = useState("edit");
  const [priceToEdit, setPriceToEdit] = useState(null);

  const togglePriceFormDialog = (e, mode = "edit", priceToEdit = null) => {
    setPriceFormDialogOpen((prev) => !prev);
    setPriceFormDialogMode(mode);
    setPriceToEdit(priceToEdit);
  };

  const fetchData = () => {
    setLoading(true);
    axiosInstance
      .get(ApiEndPoints.PRODUCT_PRICE.list)
      .then((response) => {
        setPriceData(response.data.data.productprice);
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
      <Grid container spacing={4} className="match-height">
        <PageHeader
          title={<Typography variant="h5">Product Price</Typography>}
          action={
            <PermissionGuard permissionName="productPrice" action="write">
              <Button
                variant="contained"
                onClick={(e) => togglePriceFormDialog(e, "edit", priceData)}
              >
                Update Price
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
              ) : priceData ? (
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
                      {priceData.price || "0.00"}%
                    </Typography>
                  </Box>
                  <Chip
                    label="Current Product Price"
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
                    This is the current price. You can update this price using
                    the button above.
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
                  <AttachMoneyIcon
                    sx={{ fontSize: 48, color: "text.disabled" }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No price data available
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    Set the initial product price using the button above.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
      <DialogProductPrice
        mode={priceFormDialogMode}
        open={priceFormDialogOpen}
        toggle={togglePriceFormDialog}
        dataToEdit={priceToEdit}
        onSuccess={() => {
          fetchData();
        }}
      />
    </>
  );
};

export default ProductPricePage;
