import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "../../network/adapter";
import { ApiEndPoints } from "../../network/endpoints";
import * as yup from "yup";
import { toastError, toastSuccess } from "../../utils/utils";
import { CleaveNumberInput } from "src/@core/components/cleave-components";

const validationSchema = yup.object().shape({
  title: yup.string().trim().required("Title is required."),
  subtitle: yup.string().trim().nullable(),
  code: yup.string().trim().required("Code is required."),
  start_date: yup
    .date()
    .typeError("Start Date is required.")
    .required("Start Date is required."),
  end_date: yup
    .date()
    .typeError("End Date is required.")
    .min(yup.ref("start_date"), "End Date must be after Start Date")
    .required("End Date is required."),
  minimum_purchase_amount: yup
    .number()
    .typeError("Minimum Purchase Amount must be a number.")
    .min(0, "Minimum Purchase Amount cannot be negative.")
    .required("Minimum Purchase Amount is required."),
  discount_amount: yup
    .number()
    .typeError("Discount Amount must be a number.")
    .min(0, "Discount Amount cannot be negative.")
    .test(
      "discount-less-than-minimum",
      "Discount Amount must be less than Minimum Purchase Amount.",
      function (value) {
        const { minimum_purchase_amount } = this.parent;
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          minimum_purchase_amount === undefined ||
          minimum_purchase_amount === null ||
          minimum_purchase_amount === ""
        ) {
          return true; // Handled by other validators (e.g., required)
        }
        return Number(value) < Number(minimum_purchase_amount);
      }
    )
    .required("Discount Amount is required."),
  applicable_user: yup
    .string()
    .oneOf(["all", "new", "existing"], "Select a valid option.")
    .required("Applicable User is required."),
  usage_limit: yup
    .number()
    .typeError("Usage Limit must be a number.")
    .integer("Usage Limit must be an integer.")
    .min(1, "Usage Limit must be at least 1.")
    .required("Usage Limit is required."),
});

const DialogCoupon = (props) => {
  const { mode, open, toggle, dataToEdit, onSuccess } = props;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      code: "",
      start_date: "",
      end_date: "",
      minimum_purchase_amount: "",
      discount_amount: "",
      applicable_user: "all",
      usage_limit: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      setLoading(false);
      reset({
        title: dataToEdit?.title || "",
        subtitle: dataToEdit?.subtitle || "",
        code: dataToEdit?.code || "",
        start_date: dataToEdit?.start_date
          ? new Date(dataToEdit.start_date).toISOString().slice(0, 16)
          : "",
        end_date: dataToEdit?.end_date
          ? new Date(dataToEdit.end_date).toISOString().slice(0, 16)
          : "",
        minimum_purchase_amount: dataToEdit?.minimum_purchase_amount ?? "",
        discount_amount: dataToEdit?.discount_amount ?? "",
        applicable_user: dataToEdit?.applicable_user || "all",
        usage_limit: dataToEdit?.usage_limit ?? "",
      });
    }
  }, [mode, dataToEdit, open, reset]);

  const onSubmit = (data) => {
    const payload = {
      title: data.title.trim(),
      subtitle: data.subtitle?.trim() || "",
      code: data.code.trim().toUpperCase(),
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
      minimum_purchase_amount: Number(data.minimum_purchase_amount),
      discount_amount: Number(data.discount_amount),
      // applicable_user: data.applicable_user,
      applicable_user: "all",
      usage_limit: Number(data.usage_limit),
    };
    setLoading(true);

    let apiInstance = null;
    if (mode === "edit") {
      apiInstance = axiosInstance.patch(
        ApiEndPoints.COUPON.edit(dataToEdit.id),
        payload
      );
    } else {
      apiInstance = axiosInstance.post(ApiEndPoints.COUPON.create, payload);
    }

    apiInstance
      .then((response) => response.data)
      .then((response) => {
        onSuccess();
        toastSuccess(response.message);
        toggle();
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const startDateValue = watch("start_date");

  return (
    <Dialog open={open} onClose={toggle} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="fm-h6" textTransform={"capitalize"}>
          {mode === "add" ? "Add Coupon" : "Edit Coupon"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={toggle}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}
      >
        <form id="coupon-form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormLabel required htmlFor="title" error={Boolean(errors.title)}>
              Title
            </FormLabel>
            <Controller
              name="title"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  placeholder="Enter Title"
                  autoFocus
                  onChange={onChange}
                  id="title"
                  value={value}
                  error={Boolean(errors.title)}
                />
              )}
            />
            {errors.title && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.title.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormLabel htmlFor="subtitle" error={Boolean(errors.subtitle)}>
              Subtitle
            </FormLabel>
            <Controller
              name="subtitle"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  placeholder="Enter Subtitle"
                  multiline
                  minRows={2}
                  onChange={onChange}
                  id="subtitle"
                  value={value}
                  error={Boolean(errors.subtitle)}
                />
              )}
            />
            {errors.subtitle && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.subtitle.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormLabel required htmlFor="code" error={Boolean(errors.code)}>
              Code
            </FormLabel>
            <Controller
              name="code"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  placeholder="Enter Code"
                  onChange={(e) => onChange(e.target.value)}
                  id="code"
                  value={value}
                  error={Boolean(errors.code)}
                />
              )}
            />
            {errors.code && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.code.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormLabel
              required
              htmlFor="start_date"
              error={Boolean(errors.start_date)}
            >
              Start Date
            </FormLabel>
            <Controller
              name="start_date"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type="datetime-local"
                  onChange={(e) => {
                    onChange(e);
                    e.target.blur();
                  }}
                  id="start_date"
                  value={value}
                  error={Boolean(errors.start_date)}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            {errors.start_date && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.start_date.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormLabel
              required
              htmlFor="end_date"
              error={Boolean(errors.end_date)}
            >
              End Date
            </FormLabel>
            <Controller
              name="end_date"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type="datetime-local"
                  onChange={(e) => {
                    onChange(e);
                    e.target.blur();
                  }}
                  id="end_date"
                  value={value}
                  error={Boolean(errors.end_date)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: startDateValue || undefined }}
                />
              )}
            />
            {errors.end_date && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.end_date.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormLabel
              required
              htmlFor="minimum_purchase_amount"
              error={Boolean(errors.minimum_purchase_amount)}
            >
              Minimum Purchase Amount
            </FormLabel>
            <Controller
              name="minimum_purchase_amount"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  placeholder="Enter Minimum Purchase Amount"
                  onChange={onChange}
                  id="minimum_purchase_amount"
                  value={value}
                  error={Boolean(errors.minimum_purchase_amount)}
                  slots={{
                    input: CleaveNumberInput, // Custom input component
                  }}
                  slotProps={{
                    input: {
                      style: {
                        width: "100%", // Ensures full width
                        height: "100%", // Matches MUI input height
                        padding: "18px 14px", // Matches MUI default padding
                        fontSize: "16px", // Adjust font size
                        border: "1px solid #0000003b", // Prevents unwanted border changes
                        outline: "none", // Removes focus outline
                        background: "transparent", // Matches MUI's default look
                        borderRadius: "10px",
                        color: "#3a3541de",
                      },
                    },
                  }}
                />
              )}
            />
            {errors.minimum_purchase_amount && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.minimum_purchase_amount.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormLabel
              required
              htmlFor="discount_amount"
              error={Boolean(errors.discount_amount)}
            >
              Discount Amount
            </FormLabel>
            <Controller
              name="discount_amount"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  placeholder="Enter Discount Amount"
                  onChange={onChange}
                  id="discount_amount"
                  value={value}
                  error={Boolean(errors.discount_amount)}
                  slots={{
                    input: CleaveNumberInput, // Custom input component
                  }}
                  slotProps={{
                    input: {
                      style: {
                        width: "100%", // Ensures full width
                        height: "100%", // Matches MUI input height
                        padding: "18px 14px", // Matches MUI default padding
                        fontSize: "16px", // Adjust font size
                        border: "1px solid #0000003b", // Prevents unwanted border changes
                        outline: "none", // Removes focus outline
                        background: "transparent", // Matches MUI's default look
                        borderRadius: "10px",
                        color: "#3a3541de",
                      },
                    },
                  }}
                />
              )}
            />
            {errors.discount_amount && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.discount_amount.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <FormLabel
              required
              htmlFor="applicable_user"
              error={Boolean(errors.applicable_user)}
            >
              Applicable User
            </FormLabel>
            <Controller
              name="applicable_user"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  select
                  onChange={onChange}
                  id="applicable_user"
                  value={value}
                  error={Boolean(errors.applicable_user)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="new">New Users</MenuItem>
                  <MenuItem value="existing">Existing Users</MenuItem>
                </TextField>
              )}
            />
            {errors.applicable_user && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.applicable_user.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth>
            <FormLabel
              required
              htmlFor="usage_limit"
              error={Boolean(errors.usage_limit)}
            >
              Usage Limit
            </FormLabel>
            <Controller
              name="usage_limit"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  placeholder="Enter Usage Limit"
                  onChange={onChange}
                  id="usage_limit"
                  value={value}
                  error={Boolean(errors.usage_limit)}
                  slots={{
                    input: CleaveNumberInput, // Custom input component
                  }}
                  slotProps={{
                    input: {
                      style: {
                        width: "100%", // Ensures full width
                        height: "100%", // Matches MUI input height
                        padding: "18px 14px", // Matches MUI default padding
                        fontSize: "16px", // Adjust font size
                        border: "1px solid #0000003b", // Prevents unwanted border changes
                        outline: "none", // Removes focus outline
                        background: "transparent", // Matches MUI's default look
                        borderRadius: "10px",
                        color: "#3a3541de",
                      },
                    },
                  }}
                />
              )}
            />
            {errors.usage_limit && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.usage_limit.message}
              </FormHelperText>
            )}
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          size="large"
          type="submit"
          form="coupon-form"
          variant="contained"
          loading={loading}
        >
          Submit
        </LoadingButton>
        <Button variant="outlined" onClick={toggle}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogCoupon;
