// ** MUI Imports
import Box from '@mui/material/Box'

// ** Components
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

const AppBarContent = props => {
  // ** Props
  const {  settings } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* <Autocomplete hidden={hidden} settings={settings} /> */}
      {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
      {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
      {/* <NotificationDropdown settings={settings} /> */}
      <UserDropdown settings={settings} />
    </Box>
  )
}

export default AppBarContent
