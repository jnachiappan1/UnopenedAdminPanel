import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Tag,
  Category,
  Store,
  AttachMoney,
  QrCode,
  Notes,
  CheckCircle,
  Update,
  CalendarToday,
  Verified,
} from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import moment from "moment";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location?.state?.product || null;

  if (!productData) return <Typography>No product found.</Typography>;

  const DetailItem = ({
    icon,
    label,
    value,
    isChip = false,
    chipColor = "default",
  }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
      <Box sx={{ mr: 2, mt: 0.5, color: "text.secondary" }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        {isChip ? (
          <Chip
            label={value}
            color={chipColor}
            size="small"
            variant="outlined"
          />
        ) : (
          <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 5, display: "flex", alignItems: "center", gap: "10px" }}>
        <IconButton
          size="small"
          sx={{
            border: "2px solid",
            borderColor: "primary.main",
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBack sx={{ color: "primary.main" }} fontSize="small" />
        </IconButton>
        <Typography variant="h6">Product Details</Typography>
      </Box>

      <Card elevation={1}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {productData.name}
            </Typography>
            <Chip
              label={productData.status}
              color={productData.status === "approved" ? "success" : "warning"}
              size="small"
              sx={{ textTransform: "capitalize", mr: 1 }}
            />
            <Chip
              label={productData.product_status}
              color={
                productData.product_status === "in_review" ? "info" : "default"
              }
              size="small"
              sx={{ textTransform: "capitalize" }}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Details
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Tag />}
                label="Product ID"
                value={productData.id}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Store />}
                label="Brand"
                value={productData.brand}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Category />}
                label="Category ID"
                value={productData.category_id}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<AttachMoney />}
                label="MSRP"
                value={productData.msrp}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<AttachMoney />}
                label="Price"
                value={productData.price}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<QrCode />}
                label="Barcode"
                value={productData.barcode}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Notes />}
                label="Description"
                value={productData.description}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<CheckCircle />}
                label="Status"
                value={productData.status}
                isChip={true}
                chipColor={
                  productData.status === "approved" ? "success" : "warning"
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Verified />}
                label="Product Status"
                value={productData.product_status}
                isChip={true}
                chipColor={
                  productData.product_status === "in_review"
                    ? "info"
                    : "default"
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<CalendarToday />}
                label="Created At"
                value={moment(productData.createdAt).format(
                  "YYYY MMM DD, hh:mm A"
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Update />}
                label="Updated At"
                value={moment(productData.updatedAt).format(
                  "YYYY MMM DD, hh:mm A"
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetailPage;
