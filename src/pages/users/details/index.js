import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  Email,
  Phone,
  LocationOn,
  Public,
  VerifiedUser,
  Tag,
  Badge,
} from "@mui/icons-material";
import { axiosInstance } from "../../../network/adapter";
import { ApiEndPoints } from "../../../network/endpoints";
import { toastError } from "src/utils/utils";
import FallbackSpinner from "src/@core/components/spinner";
import Grid from "@mui/material/Grid2";
const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(ApiEndPoints.USERS.getById(id))
      .then((response) => {
        console.log(response.data.data);
        setUserData(response.data.data.user);
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <FallbackSpinner />;
  if (!userData) return <Typography>No user found.</Typography>;

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
            // p: 0.5,
            // mb: 2,
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBack sx={{ color: "primary.main" }} fontSize="small" />
        </IconButton>
        <Typography varient="h6">User Details</Typography>
      </Box>

      <Card elevation={1}>
        <CardContent sx={{ p: 4 }}>
          {/* User Profile Section */}
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "grey.300",
                color: "grey.600",
                fontSize: "2rem",
                fontWeight: 600,
                mb: 2,
              }}
            >
              {getInitials(userData.full_name)}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {userData.full_name}
              </Typography>

              <Chip
                label={userData.status}
                color={userData.status === "active" ? "success" : "error"}
                size="small"
                sx={{ textTransform: "capitalize" }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Details Section */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Details
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem icon={<Tag />} label="User ID" value={userData.id} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Person />}
                label="Full Name"
                value="prince12123"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Email />}
                label="Email"
                value={userData.email}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Phone />}
                label="Phone"
                value={`${userData.country_code} ${userData.phone_number}`}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<LocationOn />}
                label="Address"
                value={userData.address}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<LocationOn />}
                label="City, State"
                value={`${userData.city}, ${userData.state}`}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Public />}
                label="Country"
                value={userData.country}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<LocationOn />}
                label="Pincode"
                value={userData.pincode}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<Person />}
                label="Gender"
                value={userData.gender}
                isChip={true}
                chipColor="default"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={<VerifiedUser />}
                label="Account Verified"
                value={userData.verify_account ? "Verified" : "Not Verified"}
                isChip={true}
                chipColor={userData.verify_account ? "success" : "error"}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetailPage;
