import { Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import PageHeader from "src/@core/components/page-header";
import Translations from "src/layouts/components/Translations";
import { useEffect, useState } from "react";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import FallbackSpinner from "src/@core/components/spinner";
import { toastError } from "src/utils/utils";
import Grid from "@mui/material/Grid2";
import DialogLegalContent from "src/views/dialogs/DialogLegalContent";
import PermissionGuard from "src/views/common/auth/PermissionGuard";

const SellerAgreementPage = () => {
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState([]);
  const [openTermsAndConditionDialog, setOpenTermsAndConditionDialog] =
    useState(false);
  const [termsAndConditionDataToEdit, setTermsAndConditionDataToEdit] =
    useState(null);

  const toggleTermsAndConditionDialog = (e, dataToEdit) => {
    setOpenTermsAndConditionDialog((prev) => !prev);
    setTermsAndConditionDataToEdit(dataToEdit);
  };
  // Remove the old permission checking variable since we'll use PermissionGuard

  const fetchData = () => {
    setLoading(true);
    axiosInstance
      .get(ApiEndPoints.LEGAL_CONTENT.list("seller_agreement"))
      .then((response) => {
        setTerms(response.data.data?.legalContent);
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

  if (loading) {
    return <FallbackSpinner />;
  }
  return (
    <>
      <Grid container spacing={4}>
        <PageHeader
          title={
            <Typography variant="h5">
              <Translations text="Seller Agreement" />
            </Typography>
          }
          action={
            <PermissionGuard permissionName="seller agreement" action="write">
              <Button
                variant="contained"
                onClick={(e) => toggleTermsAndConditionDialog(e, terms)}
              >
                Edit Seller Agreement
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
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                component="div"
                sx={{ fontSize: "15px", fontWeight: 600 }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: terms?.content,
                  }}
                />
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <DialogLegalContent
        open={openTermsAndConditionDialog}
        toggle={toggleTermsAndConditionDialog}
        dataToEdit={{
          type: "seller_agreement",
          content: termsAndConditionDataToEdit,
        }}
        onSuccess={fetchData}
      />
    </>
  );
};

export default SellerAgreementPage;
