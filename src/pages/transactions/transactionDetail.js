import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  ArrowBack,
  Payment,
  Person,
  AttachMoney,
  Schedule,
  Receipt,
  AccountBalance,
  CreditCard,
  CheckCircle,
  Pending,
  Error,
} from "@mui/icons-material";
import { axiosInstance } from "../../network/adapter";
import { ApiEndPoints } from "../../network/endpoints";
import { toastError } from "src/utils/utils";
import FallbackSpinner from "src/@core/components/spinner";
import Grid from "@mui/material/Grid2";
import moment from "moment";

const TransactionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to format chip text
  const formatChipText = (text) => {
    return text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle sx={{ color: "#2e7d32" }} />;
      case "pending":
        return <Pending sx={{ color: "#f57c00" }} />;
      case "failed":
        return <Error sx={{ color: "#c62828" }} />;
      default:
        return <Pending sx={{ color: "#f57c00" }} />;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#2e7d32";
      case "pending":
        return "#f57c00";
      case "failed":
        return "#c62828";
      default:
        return "#f57c00";
    }
  };

  useEffect(() => {
    axiosInstance
      .get(ApiEndPoints.TRANSACTION.getById(id))
      .then((response) => {
        setTransactionData(response.data.data.transaction);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <FallbackSpinner />;
  if (!transactionData) return <Typography>No transaction found.</Typography>;

  const DetailItem = ({
    icon,
    label,
    value,
    isChip = false,
    chipColor = "primary",
    isStatus = false,
  }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderBottom: "1px solid #e0e0e0",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "#f5f5f5",
          color: "#666",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {label}
        </Typography>
        {isChip ? (
          <Chip
            label={formatChipText(value)}
            color={chipColor}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        ) : isStatus ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getStatusIcon(value)}
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: getStatusColor(value) }}
            >
              {formatChipText(value)}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {value || "N/A"}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <Grid container spacing={4}>
        <Grid size={12}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton
              onClick={() => navigate("/transactions")}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Transaction Details
            </Typography>
          </Box>
        </Grid>

        <Grid size={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Transaction Information
              </Typography>

              <DetailItem
                icon={<Receipt />}
                label="Transaction ID"
                value={transactionData.transaction_id}
              />

              <DetailItem
                icon={<AttachMoney />}
                label="Amount"
                value={`$${transactionData.amount}`}
              />

              <DetailItem
                icon={<Payment />}
                label="Payment Method"
                value={transactionData.payment_method}
              />

              <DetailItem
                icon={<AccountBalance />}
                label="Status"
                value={transactionData.status}
                isStatus={true}
              />

              <DetailItem
                icon={<Schedule />}
                label="Created At"
                value={moment(transactionData.created_at).format(
                  "DD-MM-YYYY HH:mm:ss"
                )}
              />

              {transactionData.updated_at && (
                <DetailItem
                  icon={<Schedule />}
                  label="Updated At"
                  value={moment(transactionData.updated_at).format(
                    "DD-MM-YYYY HH:mm:ss"
                  )}
                />
              )}

              {transactionData.description && (
                <DetailItem
                  icon={<Receipt />}
                  label="Description"
                  value={transactionData.description}
                />
              )}

              {transactionData.currency && (
                <DetailItem
                  icon={<AttachMoney />}
                  label="Currency"
                  value={transactionData.currency}
                />
              )}

              {transactionData.fee && (
                <DetailItem
                  icon={<AttachMoney />}
                  label="Transaction Fee"
                  value={`$${transactionData.fee}`}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                User Information
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 2,
                    bgcolor: "primary.main",
                  }}
                >
                  {transactionData.user_name
                    ? transactionData.user_name.charAt(0).toUpperCase()
                    : "U"}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {transactionData.user_name || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {transactionData.user_email || "N/A"}
                  </Typography>
                </Box>
              </Box>

              {transactionData.user_phone && (
                <DetailItem
                  icon={<Person />}
                  label="Phone"
                  value={transactionData.user_phone}
                />
              )}

              {transactionData.user_address && (
                <DetailItem
                  icon={<Person />}
                  label="Address"
                  value={transactionData.user_address}
                />
              )}
            </CardContent>
          </Card>

          {transactionData.payment_details && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Payment Details
                </Typography>

                {Object.entries(transactionData.payment_details).map(
                  ([key, value]) => (
                    <DetailItem
                      key={key}
                      icon={<CreditCard />}
                      label={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      value={value}
                    />
                  )
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default TransactionDetailPage; 