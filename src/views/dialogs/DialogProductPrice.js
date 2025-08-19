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
  price: yup.string().required("Price is required."),
});

const DialogProductPrice = (props) => {
  const {
    mode,
    open,
    toggle,
    dataToEdit,
    onSuccess,
    valueKey = "price",
  } = props;
  const [loading, setLoading] = useState(false);

  // Determine endpoint based on valueKey
  const getEndpoint = () => {
    switch (valueKey) {
      case "price_charge":
        return ApiEndPoints.PRODUCT_PRICE_CHARGES.edit;
      case "price":
      default:
        return ApiEndPoints.PRODUCT_PRICE.edit;
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      price: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      setLoading(false);
      reset({
        price: (dataToEdit && dataToEdit[valueKey]) || "",
      });
    }
  }, [mode, dataToEdit, open, reset, valueKey]);

  const onSubmit = (data) => {
    const payload = {
      [valueKey]: data.price,
    };
    setLoading(true);
    const apiInstance = axiosInstance.patch(
      getEndpoint()(dataToEdit?.id),
      payload
    );

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
          Update {valueKey === "price_charge" ? "Platform Charges" : "Price"}
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
        <form id="product-price-form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth>
            <FormLabel htmlFor="price" error={Boolean(errors.price)}>
              {valueKey === "price_charge" ? "Platform Charges" : "Price"}
            </FormLabel>
            <Controller
              name="price"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  placeholder={`Enter ${
                    valueKey === "price_charge" ? "Platform Charges" : "Price"
                  }`}
                  autoFocus
                  onChange={onChange}
                  id="price"
                  value={value}
                  error={Boolean(errors.price)}
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
            {errors.price && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.price.message}
              </FormHelperText>
            )}
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          size="large"
          type="submit"
          form="product-price-form"
          variant="contained"
          loading={loading}
        >
          Update {valueKey === "price_charge" ? "Platform Charges" : "Price"}
        </LoadingButton>
        <Button variant="outlined" onClick={toggle}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogProductPrice;
