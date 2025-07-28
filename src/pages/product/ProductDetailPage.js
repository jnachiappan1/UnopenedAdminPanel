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
  Person,
} from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import moment from "moment";
import { axiosInstance } from "../../network/adapter";
import { ApiEndPoints } from "../../network/endpoints";
import { toastError } from "src/utils/utils";
import FallbackSpinner from "src/@core/components/spinner";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to format chip text
  const formatChipText = (text) => {
    return text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  useEffect(() => {
    axiosInstance
      .get(ApiEndPoints.PRODUCT.getById(id))
      .then((response) => {
        console.log(response.data.data);
        // Extract the first product from the array since getById returns an array
        setProductData(response.data.data.product[0]);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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
          <Typography
            variant="body1"
            sx={{ wordBreak: "break-all", textTransform: "capitalize" }}
          >
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  );

  if (loading) return <FallbackSpinner />;
  if (!productData) return <Typography>No product found.</Typography>;

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
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, mb: 1, textTransform: "capitalize" }}
            >
              {productData.name}
            </Typography>
            <Chip
              label={formatChipText(productData.status)}
              color={productData.status === "approved" ? "success" : "warning"}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip
              label={formatChipText(productData.product_status)}
              color={
                productData.product_status === "in_review" ? "info" : "default"
              }
              size="small"
            />
          </Box>

          {/* Product Images Section */}
          {productData.product_image &&
            productData.product_image.length > 0 && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Product Images
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                  {productData.product_image.map((image, index) => (
                    <Avatar
                      key={image.id}
                      src={image.image}
                      alt={`Product Image ${index + 1}`}
                      sx={{ width: 100, height: 100 }}
                      variant="rounded"
                    />
                  ))}
                </Box>
                <Divider sx={{ mb: 3 }} />
              </>
            )}

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
                icon={<Person />}
                label="User ID"
                value={productData.user_id}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Category />}
                label="Category"
                value={
                  productData.product_category?.name ||
                  `Category ID: ${productData.category_id}`
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<AttachMoney />}
                label="MSRP"
                value={`$${productData.msrp}`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<AttachMoney />}
                label="Price"
                value={`$${productData.price}`}
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
                value={formatChipText(productData.status)}
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
                value={formatChipText(productData.product_status)}
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
