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
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { ContentState } from "draft-js";
import CustomFileUploads from "../common/CustomFileUploads";
import Grid from "@mui/material/Grid2";

// const fileValidation = yup
//   .mixed()
//   .test("fileSize", "File size must be less than 3MB", (value) => {
//     if (!value || typeof value === "string") return true;
//     if (Array.isArray(value)) {
//       return value.every((file) => file.size <= 3 * 1024 * 1024);
//     }
//     return value.size <= 3 * 1024 * 1024;
//   })
//   .test("fileType", "Only image files are allowed", (value) => {
//     if (!value || typeof value === "string") return true;
//     if (Array.isArray(value)) {
//       return value.every((file) => file.type.startsWith("image/"));
//     }
//     return value.type.startsWith("image/");
//   });

const validationSchema = yup.object().shape({
  name: yup.string().trim().required("Permission name is required."),
  // name: yup
  //   .string()
  //   .trim()
  //   .required("Title is required.")
  //   .max(55, "Title must not exceed 55 characters")
  //   .test(
  //     "no-only-digits",
  //     "Only digits are not allowed.",
  //     (value) => !/^\d+$/.test(value)
  //   ),
  // description: yup.string().trim().required("Description is required."),
  // small_description: yup
  //   .string()
  //   .trim()
  //   .required("Small Description is required.")
  //   .max(200, "Small Description must not exceed 200 characters"),
  // bannerImage: yup
  //   .mixed()
  //   .required("Image is required")
  //   .test("fileSize", "Image is required", (value) => {
  //     if (typeof value === "string") return true;
  //     return !value || value.size <= 1024 * 1024 * 10; // 10MB
  //   })
  //   .test("fileType", "Unsupported file format", (value) => {
  //     if (typeof value === "string") return true;
  //     return !value || /image\/(jpeg|jpg|png)/.test(value.type);
  //   }),
  // bannerMobileImage: yup
  //   .mixed()
  //   .required("Image is required")
  //   .test("fileSize", "Image is required", (value) => {
  //     if (typeof value === "string") return true;
  //     return !value || value.size <= 1024 * 1024 * 10; // 10MB
  //   })
  //   .test("fileType", "Unsupported file format", (value) => {
  //     if (typeof value === "string") return true;
  //     return !value || /image\/(jpeg|jpg|png)/.test(value.type);
  //   }),
});

const Dialogpermission = (props) => {
  const { mode, open, toggle, dataToEdit, onSuccess } = props;
  const [loading, setLoading] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      // brand: "",
      // small_description: "",
      // description: "",
      // bannerImage: [],
      // bannerMobileImage: [],
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      setLoading(false);
      reset({
        name: dataToEdit?.name || "",
        // brand: dataToEdit?.brand || "",

        // small_description: dataToEdit?.small_description || "",
        // bannerImage: dataToEdit?.bannerImage || null,
        // bannerMobileImage: dataToEdit?.bannerMobileImage || null,
        // description: dataToEdit?.description || "",
      });
    //   if (dataToEdit?.description) {
    //     const contentBlock = htmlToDraft(dataToEdit.description);
    //     if (contentBlock) {
    //       const contentState = ContentState.createFromBlockArray(
    //         contentBlock.contentBlocks
    //       );
    //       setEditorState(EditorState.createWithContent(contentState));
    //     }
    //   } else {
    //     setEditorState(EditorState.createEmpty());
    //   }
    // } else {
    //   setEditorState(EditorState.createEmpty());
    }
  }, [mode, dataToEdit, open, reset]);

  const onSubmit = (data) => {
    console.log("Form Data:", data);

    // const payload = new FormData();
    const payload = {
      name: data.name,
      // description: data.description,
    };
    // payload.append("name", data.name);
    // payload.append("description", data.description);

    setLoading(true);

    let apiInstance = null;

    // if (mode === "edit") {
    //   apiInstance = axiosInstance.put(
    //     ApiEndPoints.PERMISSION.edit(dataToEdit.id),
    //     payload,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    // } else {
    //   apiInstance = axiosInstance.post(
    //     ApiEndPoints.PERMISSION.create, // <-- FIXED HERE
    //     payload,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    // }

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
    <Dialog open={open} onClose={toggle} fullWidth maxWidth="lg" scroll="paper">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="fm-h6" textTransform={"capitalize"}>
          {mode === "add" ? "Add Permissions" : "Edit Product"}
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
            {/* Title Field */}
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth sx={{ mb: 4 }}>
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
            </Grid>
            <Grid size={{ xs: 12 }}>
              {/* <FormControl fullWidth sx={{ mb: 4 }}>
                <FormLabel
                  required
                  htmlFor="brand"
                  error={Boolean(errors.brand)}
                >
                  Brand
                </FormLabel>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder="Enter Brand Name"
                      multiline
                      autoFocus
                      onChange={onChange}
                      id="brand"
                      value={value}
                      error={Boolean(errors.brand)}
                    />
                  )}
                />
                {errors.brand && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.brand.message}
                  </FormHelperText>
                )}
              </FormControl> */}
            </Grid>

            {/* Small Description Field */}
            {/* <Grid size={{ xs: 12 }}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <FormLabel
                  required
                  htmlFor="small_description"
                  error={Boolean(errors.small_description)}
                >
                  Small Description
                </FormLabel>
                <Controller
                  name="small_description"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder="Enter Small Description"
                      multiline
                      onChange={onChange}
                      id="small_description"
                      value={value}
                      error={Boolean(errors.small_description)}
                    />
                  )}
                />
                {errors.small_description && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.small_description.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid> */}

            {/* Banner Image Upload */}
            {/* <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel
                  required
                  htmlFor="bannerImage"
                  error={Boolean(errors.bannerImage)}
                >
                  Banner Image
                </FormLabel>
                <Controller
                  name="bannerImage"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomFileUploads
                      multiple={false}
                      minHeight="0px"
                      subtitle="Recommended resolution: 1440 x 655 px"
                      files={value}
                      onChange={onChange}
                      title={"Upload Image"}
                      MediaUrl={MEDIA_URL}
                    />
                  )}
                />
                {errors.bannerImage && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.bannerImage.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid> */}

            {/* Mobile Banner Image Upload */}
            {/* <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <FormLabel
                  required
                  htmlFor="bannerMobileImage"
                  error={Boolean(errors.bannerMobileImage)}
                >
                  Mobile Banner Image
                </FormLabel>
                <Controller
                  name="bannerMobileImage"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomFileUploads
                      multiple={false}
                      minHeight="0px"
                      subtitle="Recommended resolution: 360 x 230 px"
                      files={value}
                      onChange={onChange}
                      title={"Upload Image"}
                      MediaUrl={MEDIA_URL}
                    />
                  )}
                />
                {errors.bannerMobileImage && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.bannerMobileImage.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid> */}

            <Grid size={12}>
              {/* <FormControl fullWidth>
                <FormLabel
                  required
                  htmlFor="description"
                  error={Boolean(errors.description)}
                >
                  Description
                </FormLabel>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "8px",
                    minHeight: "350px",
                  }}
                >
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Editor
                        editorState={editorState}
                        onEditorStateChange={(state) => {
                          setEditorState(state);
                          const content = draftToHtml(
                            convertToRaw(state.getCurrentContent())
                          );
                          field.onChange(content); // Update hidden input with HTML
                        }}
                        toolbar={{
                          options: [
                            "inline",
                            "blockType",
                            "fontSize",
                            "list",
                            "textAlign",
                            "colorPicker",
                            "link",
                            "embedded",
                            "emoji",
                            "remove",
                            "history",
                          ],
                          inline: {
                            options: [
                              "bold",
                              "italic",
                              "underline",
                              "strikethrough",
                            ],
                          },
                          list: { options: ["unordered", "ordered"] },
                          textAlign: {
                            options: ["left", "center", "right", "justify"],
                          },
                          link: { options: ["link"] },
                        }}
                      />
                    )}
                  />
                </Box>
                {errors.description && (
                  <FormHelperText sx={{ color: "error.main" }}>
                    {errors.description.message}
                  </FormHelperText>
                )}
              </FormControl> */}
            </Grid>
            <Grid item xs={12} md={6}>
              {/* <FormControl fullWidth>
                  <FormLabel htmlFor='status' error={Boolean(errors.status)}>
                    Status
                  </FormLabel>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <RadioGroup row name='status' onChange={onChange} value={value}>
                        <FormControlLabel value={'active'} control={<Radio />} label='Active' />
                        <FormControlLabel value={'inactive'} control={<Radio />} label='Inactive' />
                      </RadioGroup>
                    )}
                  />
                  {errors.status && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.status.message}</FormHelperText>
                  )}
                </FormControl> */}
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
        <Button
          variant="outlined"
          onClick={toggle}
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: "inherit",
              color: "#31AD52",
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Dialogpermission;
