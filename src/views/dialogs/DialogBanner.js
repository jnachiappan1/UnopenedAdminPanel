import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
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
  Grid,
  IconButton,
  TextField
} from '@mui/material'
import CloseIcon from 'mdi-material-ui/Close'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { axiosInstance } from '../../network/adapter'
import { ApiEndPoints, MEDIA_URL } from '../../network/endpoints'
import * as yup from 'yup'
import { toastError, toastSuccess } from '../../utils/utils'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import CustomFileUploads from '../common/CustomFileUploads'

const validationSchema = yup.object().shape({
  pageType: yup.string().trim().required('Please enter your title.').max(25, 'Title must be at most 25 characters.'),
  bannerImage: yup.mixed().required('required'),
  bannerMobileImage: yup.mixed().required('required'),
})

const DialogBanner = (props) => {
  const { mode, open, toggle, dataToEdit, onSuccess } = props

  const [loading, setLoading] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      pageType: '',
      bannerImage: '',
      bannerMobileImage: ''
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    if (open) {
      setLoading(false)
      setDialogTitle(mode === 'Edit Banner')
      reset({
        pageType: dataToEdit?.pageType || '',
        bannerImage: dataToEdit?.bannerImage || '',
        bannerMobileImage: dataToEdit?.bannerMobileImage || '',
      });
    }
  }, [dataToEdit, mode, open, reset])

  const onSubmit = data => {
    const payload = new FormData()
    payload.append('pageType', data.pageType)
    payload.append('banneImage', data.bannerImage)
    payload.append('banneMobileImage', data.bannerMobileImage)
    // data.images.forEach(file => {
    //   payload.append('images', file)
    // })

    setLoading(true)

    let apiInstance = null

    if (mode === 'edit') {
      apiInstance = axiosInstance.put(ApiEndPoints.BANNER.edit(dataToEdit._id), payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
    apiInstance
      .then(response => response.data)
      .then(response => {
        onSuccess()
        toastSuccess(response.message)
        toggle()
      })
      .catch(error => {
        console.error('API error:', error.response ? error.response.data : error);
        toastError(error.response?.data?.message || 'An error occurred');
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <Dialog open={open} onClose={toggle} fullWidth maxWidth='sm' scroll='paper'>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>{dialogTitle}</Box>
          <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
          <form id='form' onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <FormLabel required htmlFor='pageTYpe' error={Boolean(errors.pageType)}>
                    Page Type
                  </FormLabel>
                  <Controller
                    name='pageType'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        placeholder='Enter Page Type'
                        onChange={onChange}
                        id='pageType'
                        value={value}
                        error={Boolean(errors.pageType)}
                      />
                    )}
                  />
                  {errors.pageType && <FormHelperText sx={{ color: 'error.main' }}>{errors.pageType.message}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
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
                        subtitle="(Max file size 3mb)"
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
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel
                    required
                    htmlFor="bannerMobileImage"
                    error={Boolean(errors.bannerMobileImage)}
                  >
                    Banner Mobile Image
                  </FormLabel>
                  <Controller
                    name="bannerMobileImage"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomFileUploads
                        multiple={false}
                        minHeight="0px"
                        subtitle="(Max file size 3mb)"
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
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <LoadingButton size='large' type='submit' form='form' variant='contained' loading={loading}>
            Submit
          </LoadingButton>
          <Button size='large' variant='outlined' onClick={toggle}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DialogBanner
