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
  FormControl,
  FormLabel,
  FormHelperText,
  TextField,
  MenuItem,
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
  Straighten,
  LineWeight,
  AccountBalance,
  Payment,
  LocationOn,
  Email,
  Phone,
} from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import moment from "moment";
import { axiosInstance } from "../../network/adapter";
import { ApiEndPoints, MEDIA_URL } from "../../network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import FallbackSpinner from "src/@core/components/spinner";
import { LoadingButton } from "@mui/lab";
import PermissionGuard from "src/views/common/auth/PermissionGuard";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusValue, setStatusValue] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  // Helper function to format chip text
  const formatChipText = (text) => {
    return text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  useEffect(() => {
    axiosInstance
      .get(ApiEndPoints.PRODUCT.getById(id))
      .then((response) => {
        setProductData(response.data.data.product[0]);
        setStatusValue(response.data.data.product[0]?.status || "");
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleUpdateStatus = (e) => {
    e?.preventDefault();
    if (!statusValue || statusValue === " ") {
      setStatusError("Please select a status.");
      return;
    }
    setStatusError("");
    const payload = new FormData();
    payload.append("status", statusValue);
    setStatusLoading(true);
    axiosInstance
      .patch(ApiEndPoints.PRODUCT.edit(productData.id), payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data)
      .then((res) => {
        toastSuccess(res.message || "Status updated successfully");
        setProductData((prev) =>
          prev ? { ...prev, status: statusValue } : prev
        );
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => setStatusLoading(false));
  };

  const DetailItem = ({
    icon,
    label,
    value,
    isChip = false,
    chipColor = "default",
    noCapitalize = false,
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
            sx={{
              wordBreak: "break-all",
              textTransform: noCapitalize ? "none" : "capitalize",
            }}
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

            {/* Update Status Inline */}
            {/* Status Update Section */}
            <PermissionGuard permissionName="product" action="write">
              <Card
                variant="outlined"
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Update Product Status
                  </Typography>
                  <Box
                    component="form"
                    id="status-form"
                    onSubmit={handleUpdateStatus}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      alignItems: { xs: "stretch", sm: "flex-end" },
                    }}
                  >
                    <FormControl fullWidth size="small">
                      <TextField
                        select
                        fullWidth
                        id="status"
                        name="status"
                        size="small"
                        value={statusValue}
                        onChange={(e) => setStatusValue(e.target.value)}
                        error={Boolean(statusError)}
                      >
                        <MenuItem value="" disabled>
                          Select Status
                        </MenuItem>
                        <MenuItem value="pending">⏳ Pending</MenuItem>
                        <MenuItem value="approved">✅ Approve</MenuItem>
                        <MenuItem value="rejected">❌ Reject</MenuItem>
                      </TextField>
                      {statusError && (
                        <FormHelperText sx={{ color: "error.main" }}>
                          {statusError}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <LoadingButton
                      size="medium"
                      type="submit"
                      form="status-form"
                      variant="contained"
                      loading={statusLoading}
                    >
                      Update
                    </LoadingButton>
                  </Box>
                </CardContent>
              </Card>
            </PermissionGuard>
          </Box>

          {/* Product Images Section */}
          {productData.product_image &&
            productData.product_image.length > 0 && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Product Images
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                  {productData?.product_image.map((image, index) => (
                    <Avatar
                      key={image.id}
                      src={`${MEDIA_URL}${image.image}`}
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
                icon={<AccountBalance />}
                label="Platform Fee"
                value={`$${productData.platform_fee}`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Payment />}
                label="Seller Final Price"
                value={`$${productData.seller_final_price}`}
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
                icon={<Straighten />}
                label="Dimensions"
                value={productData.dimensions}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<LineWeight />}
                label="Weight"
                value={productData.weight}
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
                icon={<Verified />}
                label="Product Activity Status"
                value={
                  productData.product_activity_status
                    ? formatChipText(productData.product_activity_status)
                    : "-"
                }
                isChip={!!productData.product_activity_status}
                chipColor="default"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Payment />}
                label="Payment Completed"
                value={productData.is_payment_completed ? "Yes" : "No"}
                isChip={true}
                chipColor={
                  productData.is_payment_completed ? "success" : "warning"
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
            <Grid size={{ xs: 12 }}>
              <DetailItem
                icon={<Notes />}
                label="Description"
                value={productData.description}
              />
            </Grid>
          </Grid>

          {/* Seller (Product User) Details */}
          {(productData.product_user || productData.user_id) && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Seller Details
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={
                        productData.product_user?.profile_picture
                          ? `${MEDIA_URL}${productData.product_user.profile_picture}`
                          : undefined
                      }
                      alt={productData.product_user?.full_name || "Seller"}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {productData.product_user?.full_name || "-"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<Email />}
                    label="Email"
                    value={productData.product_user?.email || "-"}
                    noCapitalize
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<Phone />}
                    label="Phone"
                    value={
                      productData.product_user
                        ? `${productData.product_user.country_code || ""} ${
                            productData.product_user.phone_number || "-"
                          }`.trim()
                        : "-"
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Address"
                    value={productData.product_user?.address || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Country"
                    value={productData.product_user?.country || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="State"
                    value={productData.product_user?.state || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="City"
                    value={productData.product_user?.city || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Pincode"
                    value={productData.product_user?.pincode || "-"}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* Buyer Details */}
          {productData.buyer_user && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Buyer Details
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<Person />}
                    label="Full Name"
                    value={productData.buyer_user?.full_name || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<Email />}
                    label="Email"
                    value={productData.buyer_user?.email || "-"}
                    noCapitalize
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<Phone />}
                    label="Phone"
                    value={
                      productData.buyer_user
                        ? `${productData.buyer_user.country_code || ""} ${
                            productData.buyer_user.phone_number || "-"
                          }`.trim()
                        : "-"
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Address"
                    value={productData.buyer_user?.address || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Country"
                    value={productData.buyer_user?.country || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="State"
                    value={productData.buyer_user?.state || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="City"
                    value={productData.buyer_user?.city || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Pincode"
                    value={productData.buyer_user?.pincode || "-"}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* Buyer Address */}
          {productData.buyer_address && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Buyer Address
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<Person />}
                    label="Full Name"
                    value={productData.buyer_address?.full_name || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<Phone />}
                    label="Phone"
                    value={
                      productData.buyer_address
                        ? `${productData.buyer_address.country_code || ""} ${
                            productData.buyer_address.phone_number || "-"
                          }`.trim()
                        : "-"
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Address"
                    value={productData.buyer_address?.address || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="City"
                    value={productData.buyer_address?.city || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="State"
                    value={productData.buyer_address?.state || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Country"
                    value={productData.buyer_address?.country || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Pincode"
                    value={productData.buyer_address?.pincode || "-"}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductDetailPage;
