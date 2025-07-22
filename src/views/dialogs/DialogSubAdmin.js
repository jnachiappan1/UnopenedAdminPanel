import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
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
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@mui/material'
import CloseIcon from 'mdi-material-ui/Close'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import * as yup from 'yup'
import { toastError, toastSuccess } from 'src/utils/utils'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FormValidationMessages } from 'src/constants/form.const'

const validationSchema = yup.object().shape({
  name: yup.string().trim().required('Name is required.'),
  email: yup.string().email('Enter a valid email').required('Email is required.'),
  // phone_number: yup.string().required('Phone number is required.'),
  // country_code: yup.string().required('Country code is required.'),
  // password: yup
  //   .string()
  //   .min(FormValidationMessages.PASSWORD.minLength, FormValidationMessages.PASSWORD.minLengthErrorMessage)
  //   .matches(FormValidationMessages.PASSWORD.pattern, FormValidationMessages.PASSWORD.patternErrorMessage)
  //   .required(FormValidationMessages.PASSWORD.required),
  role_id: yup.string().required('Role is required.')
  // status: yup.string().oneOf(['active', 'inactive']).required('Status is required.') // Uncomment if needed
})

const DialogSubAdmin = props => {
  const { mode, open, toggle, dataToEdit, onSuccess, roles } = props
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [phoneDialCode, setPhoneDialCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    // setValue,
    // clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      // country_code: '+91',
      // phone_number: '',
      // password: '',
      role_id: '',
      status: 'active'
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  })
  // const handlePhoneChange = (value, country) => {
  //   setPhone(value)
  //   setValue('phone_number', value)
  //   if (country) {
  //     clearErrors('phone_number')
  //     const { country: countryCode, dialCode, name } = country
  //     setPhoneDialCode(dialCode)
  //   }
  // }
  // const handleTogglePassword = () => {
  //   setShowPassword(!showPassword)
  // }
  useEffect(() => {
    if (open) {
      reset({
        name: dataToEdit?.name || '',
        email: dataToEdit?.email || '',
        // country_code: dataToEdit?.country_code || '+91',
        // phone_number: dataToEdit?.phone_number || '',
        // password: '',
        role_id: dataToEdit?.role_id || '',
        status: dataToEdit?.status || 'active'
      })
    }
  }, [dataToEdit, mode, open, reset])

  const onSubmit = data => {
    const payload = {
      name: data.name,
      email: data.email,
      // country_code: '+' + phoneDialCode,
      // phone_number: '+' + phone,
      // password: data.password,
      role_id: data.role_id
    }

    setLoading(true)

    let apiInstance = null
    if (mode === 'edit') {
      apiInstance = axiosInstance.patch(ApiEndPoints.SUB_ADMIN.edit(dataToEdit.id), payload)
    } else {
      apiInstance = axiosInstance.post(ApiEndPoints.SUB_ADMIN.create, payload)
    }

    apiInstance
      .then(response => response.data)
      .then(response => {
        onSuccess()
        toastSuccess(response.message)
        toggle()
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
    console.log('payload', payload)
  }
  console.log('roles', roles)

  return (
    <Dialog open={open} onClose={toggle} fullWidth maxWidth='sm' scroll='paper'>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='fm-h6'>{mode === 'add' ? 'Add Sub Admin' : 'Edit Sub Admin'}</Typography>
        <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
        <form id='subadmin-form' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            {/* Name Field */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='name' error={Boolean(errors.name)}>
                  Name
                </FormLabel>
                <Controller
                  name='name'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Enter Name'
                      onChange={onChange}
                      id='name'
                      value={value}
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Email Field */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='email' error={Boolean(errors.email)}>
                  Email
                </FormLabel>
                <Controller
                  name='email'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Enter Email'
                      onChange={onChange}
                      id='email'
                      value={value}
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              {/* <FormControl fullWidth>
                <FormLabel required={mode === 'add'} htmlFor='phone_number' error={Boolean(errors.phone_number)}>
                  Phone Number
                </FormLabel>
                <Controller
                  name='phone_number'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <PhoneInput
                      error={Boolean(errors.phone_number)}
                      inputStyle={{
                        width: '100%',
                        height: '100%',
                        border: Boolean(errors.phone_number) ? '1px solid red' : '1px solid #ccc',
                        borderRadius: '10px'
                      }}
                      enableSearch={true}
                      PhoneInputCountryFlag-borderColor='red'
                      placeholder='Phone number'
                      value={value}
                      onChange={handlePhoneChange}
                    />
                  )}
                />
              </FormControl>

              {errors.phone_number && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.phone_number.message}</FormHelperText>
              )} */}
            </Grid>

            {/* Password Field (Only show in Add Mode) */}
            {/* {mode === 'add' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel required htmlFor='password' error={Boolean(errors.password)}>
                    Password
                  </FormLabel>
                  <Controller
                    name='password'
                    control={control}
                    defaultValue=''
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        id='password'
                        placeholder={'Enter Password'}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete='current-password'
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.password)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleTogglePassword} edge='start'>
                                {showPassword ? <Visibility fontSize='small' /> : <VisibilityOff fontSize='small' />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )} */}

            {/* Role Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='role_id' error={Boolean(errors.role_id)}>
                  Role
                </FormLabel>
                <Controller
                  name='role_id'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      defaultValue={''}
                      onChange={e => {
                        onChange(e)
                      }}
                      value={value}
                      displayEmpty
                      error={Boolean(errors.role_id)}
                      sx={{ bgcolor: '#F7FBFF', textTransform: 'capitalize' }}
                    >
                      <MenuItem disabled value={''}>
                        Select Role
                      </MenuItem>
                      {roles?.map(role => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.role_id && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.role_id.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions>
        <LoadingButton size='large' type='submit' form='subadmin-form' variant='contained' loading={loading}>
          Submit
        </LoadingButton>
        <Button size='large' variant='outlined' onClick={toggle}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogSubAdmin
