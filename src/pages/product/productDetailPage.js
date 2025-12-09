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
  Dialog,
  DialogContent,
  DialogActions,
  Button,
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
  LocalShipping,
  QrCode2,
  Close,
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

  // Add CSS animation for spinner
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusValue, setStatusValue] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [imageErrorStates, setImageErrorStates] = useState({});
  const [trackShipmentLoading, setTrackShipmentLoading] = useState(false);

  // Helper function to format chip text
  const formatChipText = (text) => {
    return text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Handle image click to open modal
  const handleImageClick = (image) => {
    // Only open modal if image is not in error state
    if (!imageErrorStates[image.id]) {
      setSelectedImage(image);
      setImageModalOpen(true);
    }
  };

  // Handle modal close
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  // Handle image load start
  const handleImageLoadStart = (imageId) => {
    setImageLoadingStates((prev) => ({ ...prev, [imageId]: true }));
    setImageErrorStates((prev) => ({ ...prev, [imageId]: false }));
  };

  // Handle image load success
  const handleImageLoadSuccess = (imageId) => {
    setImageLoadingStates((prev) => ({ ...prev, [imageId]: false }));
    setImageErrorStates((prev) => ({ ...prev, [imageId]: false }));
  };

  // Handle image load error
  const handleImageLoadError = (imageId) => {
    setImageLoadingStates((prev) => ({ ...prev, [imageId]: false }));
    setImageErrorStates((prev) => ({ ...prev, [imageId]: true }));
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

  const handleTrackShipment = () => {
    if (!productData?.shipment_id) {
      toastError("Product ID not found");
      return;
    }
    setTrackShipmentLoading(true);
    axiosInstance
      .get(ApiEndPoints.PRODUCT.trackShipment(productData?.shipment_id))
      .then((response) => {
        window.open(response.data.data.tracking.tracking_url, "_blank");
        toastSuccess(
          response.data.message ||
            "Shipment tracking information retrieved successfully"
        );
        // You can handle the response data here if needed
        // For example, display it in a dialog or update the UI
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setTrackShipmentLoading(false);
      });
  };

  const DetailItem = ({
    icon,
    label,
    value,
    isChip = false,
    chipColor = "default",
    noCapitalize = false,
    isHtml = false, // ✅ Add a flag to indicate HTML rendering
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
        ) : isHtml ? (
          // ✅ Render HTML safely using dangerouslySetInnerHTML
          <Typography
            variant="body1"
            sx={{ wordBreak: "break-word" }}
            component="div"
            dangerouslySetInnerHTML={{ __html: value || "" }}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              wordBreak: "break-word",
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
            {productData.status === "pending" &&
              productData.product_status !== "withdrawn" && (
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
              )}
          </Box>

          {/* Product Images Section */}
          {productData.product_image &&
            productData.product_image.length > 0 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Product Images
                    </Typography>
                    <Box
                      sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}
                    >
                      {productData?.product_image.map((image, index) => (
                        <Box
                          key={image.id}
                          sx={{
                            width: 120,
                            height: 120,
                            cursor: imageErrorStates[image.id]
                              ? "not-allowed"
                              : "pointer",
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "2px solid #e0e0e0",
                            transition: "all 0.3s ease-in-out",
                            position: "relative",
                            opacity: imageErrorStates[image.id] ? 0.6 : 1,
                            "&:hover": {
                              transform: imageErrorStates[image.id]
                                ? "none"
                                : "scale(1.05)",
                              boxShadow: imageErrorStates[image.id]
                                ? "none"
                                : "0 8px 25px rgba(0,0,0,0.15)",
                            },
                          }}
                          onClick={() => handleImageClick(image)}
                        >
                          {/* Loading State */}
                          {imageLoadingStates[image.id] && (
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f8f9fa",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  border: "2px solid #e0e0e0",
                                  borderTop: "2px solid #1976d2",
                                  borderRadius: "50%",
                                  animation: "spin 1s linear infinite",
                                }}
                              />
                            </Box>
                          )}

                          {/* Image */}
                          {!imageErrorStates[image.id] &&
                            (/\.(mp4|webm|ogg)$/i.test(
                              (image?.image || "").toLowerCase()
                            ) ? (
                              <Box
                                component="video"
                                src={`${MEDIA_URL}${image.image}`}
                                muted
                                preload="metadata"
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: imageLoadingStates[image.id]
                                    ? "none"
                                    : "block",
                                  pointerEvents: "none",
                                }}
                                onLoadStart={() =>
                                  handleImageLoadStart(image.id)
                                }
                                onLoadedData={() =>
                                  handleImageLoadSuccess(image.id)
                                }
                                onError={() => handleImageLoadError(image.id)}
                              />
                            ) : (
                              <Box
                                component="img"
                                src={`${MEDIA_URL}${image.image}`}
                                alt={`Product Image ${index + 1}`}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: imageLoadingStates[image.id]
                                    ? "none"
                                    : "block",
                                }}
                                onLoadStart={() =>
                                  handleImageLoadStart(image.id)
                                }
                                onLoad={() => handleImageLoadSuccess(image.id)}
                                onError={() => handleImageLoadError(image.id)}
                              />
                            ))}

                          {/* Error State */}
                          {imageErrorStates[image.id] && (
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f8f9fa",
                                color: "#666",
                                fontSize: "0.75rem",
                                textAlign: "center",
                                padding: 1,
                              }}
                            >
                              <Box>
                                <Box sx={{ fontSize: "1.5rem", mb: 0.5 }}>
                                  📷
                                </Box>
                                <Box>Image {index + 1}</Box>
                                <Box sx={{ fontSize: "0.7rem", opacity: 0.7 }}>
                                  Not Available
                                </Box>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  {productData?.product_status === "sold" && (
                    <Box>
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={trackShipmentLoading}
                        onClick={handleTrackShipment}
                      >
                        Track Shipment
                      </LoadingButton>
                    </Box>
                  )}
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
                icon={<LocalShipping />}
                label="Shipment ID"
                value={productData.shipment_id || "-"}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<QrCode2 />}
                label="Tracking ID"
                value={productData.tracking_id || "-"}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Tag />}
                label="Order ID"
                value={productData.order_id || "-"}
                noCapitalize
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Straighten />}
                label="Length"
                value={productData.length ? `${productData.length} cm` : "-"}
                noCapitalize
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Straighten />}
                label="Width"
                value={productData.width ? `${productData.width} cm` : "-"}
                noCapitalize
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Straighten />}
                label="Height"
                value={productData.height ? `${productData.height} cm` : "-"}
                noCapitalize
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<LineWeight />}
                label="Weight"
                value={productData.weight}
                noCapitalize
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
                isHtml
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
                    label="Second Line Address"
                    value={productData.product_user?.second_line_address || "-"}
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
                    label="Second Line Address"
                    value={productData.buyer_user?.second_line_address || "-"}
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
                Delivery Address
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Address"
                    value={productData.buyer_address?.address || "-"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    icon={<LocationOn />}
                    label="Second Line Address"
                    value={productData.buyer_address?.second_line_address || "-"}
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

      {/* Image Modal Dialog */}
      <Dialog
        open={imageModalOpen}
        onClose={handleCloseImageModal}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            maxWidth: "95vw",
            maxHeight: "95vh",
            width: "auto",
            height: "auto",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
          },
        }}
        sx={{
          "& .MuiDialog-paper": {
            margin: 2,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            position: "relative",
          }}
        >
          {selectedImage && (
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
              {/* Loading State */}
              {imageLoadingStates[selectedImage.id] && (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      border: "3px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "3px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                </Box>
              )}

              {/* Image */}
              {!imageErrorStates[selectedImage.id] &&
                (/\.(mp4|webm|ogg)$/i.test(
                  (selectedImage?.image || "").toLowerCase()
                ) ? (
                  <Box
                    component="video"
                    src={`${MEDIA_URL}${selectedImage.image}`}
                    controls
                    playsInline
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: 1,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                      display: imageLoadingStates[selectedImage.id]
                        ? "none"
                        : "block",
                    }}
                    onLoadStart={() => handleImageLoadStart(selectedImage.id)}
                    onLoadedData={() =>
                      handleImageLoadSuccess(selectedImage.id)
                    }
                    onError={() => handleImageLoadError(selectedImage.id)}
                  />
                ) : (
                  <Box
                    component="img"
                    src={`${MEDIA_URL}${selectedImage.image}`}
                    alt="Product Image"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: 1,
                      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                      display: imageLoadingStates[selectedImage.id]
                        ? "none"
                        : "block",
                    }}
                    onLoadStart={() => handleImageLoadStart(selectedImage.id)}
                    onLoad={() => handleImageLoadSuccess(selectedImage.id)}
                    onError={() => handleImageLoadError(selectedImage.id)}
                  />
                ))}

              {/* Error State */}
              {imageErrorStates[selectedImage.id] && (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 1,
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    backdropFilter: "blur(10px)",
                    border: "2px dashed rgba(255, 255, 255, 0.3)",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box sx={{ fontSize: "4rem" }}>📷</Box>
                  <Box>Image Not Available</Box>
                  <Box sx={{ fontSize: "1rem", opacity: 0.7 }}>
                    The image file could not be loaded
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        {/* Close Button */}
        <IconButton
          onClick={handleCloseImageModal}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(10px)",
            color: "white",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            width: 48,
            height: 48,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            zIndex: 10,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "2px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.5)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Close
            sx={{
              fontSize: 24,
              filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))",
            }}
          />
        </IconButton>

        {/* Image Counter */}
        {selectedImage && productData?.product_image && (
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: "0.875rem",
              fontWeight: 500,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {productData.product_image.findIndex(
              (img) => img.id === selectedImage.id
            ) + 1}{" "}
            of {productData.product_image.length}
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default ProductDetailPage;
