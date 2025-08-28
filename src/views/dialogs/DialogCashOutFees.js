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
  cashout_fees: yup.string().required("Cashout fees is required."),
});

const DialogCashOutFees = (props) => {
  const { mode, open, toggle, dataToEdit, onSuccess } = props;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cashout_fees: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      setLoading(false);
      reset({
        cashout_fees: dataToEdit?.cashout_fees || "",
      });
    }
  }, [mode, dataToEdit, open, reset]);

  const onSubmit = (data) => {
    const payload = {
      cashout_fees: data.cashout_fees,
    };
    setLoading(true);

    let apiInstance = null;
    apiInstance = axiosInstance.patch(
      ApiEndPoints.CASHOUT_FEES.edit(dataToEdit.id),
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
          Update Cashout Fee
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
        <form id="category-form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth>
            <FormLabel
              required
              htmlFor="cashout_fees"
              error={Boolean(errors.cashout_fees)}
            >
              Cashout Fee
            </FormLabel>
            <Controller
              name="cashout_fees"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  placeholder="Enter Category"
                  multiline
                  autoFocus
                  onChange={onChange}
                  id="cashout_fees"
                  value={value}
                  error={Boolean(errors.cashout_fees)}
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
            {errors.cashout_fees && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.cashout_fees.message}
              </FormHelperText>
            )}
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          size="large"
          type="submit"
          form="category-form"
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

export default DialogCashOutFees;
