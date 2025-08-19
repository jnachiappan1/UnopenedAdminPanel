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

const validationSchema = yup.object().shape({
  name: yup.string().trim().required("Permission name is required."),
});

const Dialogpermission = (props) => {
  const { mode, open, toggle, dataToEdit, onSuccess } = props;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      setLoading(false);
      reset({
        name: dataToEdit?.name || "",
      });
    }
  }, [mode, dataToEdit, open, reset]);

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
    };
    setLoading(true);

    let apiInstance = null;
    if (mode === "edit") {
      apiInstance = axiosInstance.patch(
        ApiEndPoints.PERMISSION.edit(dataToEdit.id),
        payload
      );
    } else {
      apiInstance = axiosInstance.post(ApiEndPoints.PERMISSION.create, payload);
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
          {mode === "add" ? "Add Permission" : "Edit Permission"}
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
          <FormControl fullWidth>
            <FormLabel required htmlFor="name" error={Boolean(errors.name)}>
              Permission
            </FormLabel>
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  placeholder="Enter Permission"
                  multiline
                  autoFocus
                  onChange={onChange}
                  id="name"
                  value={value}
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.name.message}
              </FormHelperText>
            )}
          </FormControl>
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

export default Dialogpermission;
