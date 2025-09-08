import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "../../network/adapter";
import { ApiEndPoints, MEDIA_URL } from "../../network/endpoints";
import * as yup from "yup";
import { toastError, toastSuccess } from "../../utils/utils";
import Grid from "@mui/material/Grid2";

const validationSchema = yup.object().shape({});

const DialogCashOutRequest = (props) => {
  const { mode, open, toggle, dataToEdit, onSuccess } = props;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });
  console.log(dataToEdit);

  useEffect(() => {
    if (open) {
      setLoading(false);
      reset({
        status: dataToEdit?.status || "",
      });
    } else {
    }
  }, [mode, dataToEdit, open, reset]);

  const onSubmit = (data) => {
    const payload = {
      status: data.status,
    };
    setLoading(true);
    let apiInstance = null;
    apiInstance = axiosInstance.patch(
      ApiEndPoints.CASHOUT_REQUEST.edit(dataToEdit.id),
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
          Update Status
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
        <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel htmlFor="status" error={Boolean(errors.status)}>
                  Status
                </FormLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      select
                      fullWidth
                      id="status"
                      name="status"
                      value={value}
                      onChange={onChange}
                      error={Boolean(errors.status)}
                      defaultValue={" "}
                    >
                      <MenuItem value=" " disabled>
                        Select Status
                      </MenuItem>
                      <MenuItem value="approved">Approve</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="rejected">Reject</MenuItem>
                    </TextField>
                  )}
                />
                {errors.status && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.status.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          size="large"
          type="submit"
          form="product-form"
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

export default DialogCashOutRequest;
