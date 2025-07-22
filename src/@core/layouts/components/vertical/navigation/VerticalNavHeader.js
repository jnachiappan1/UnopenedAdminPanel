// ** Next Import
import { NavLink } from "react-router-dom";

// ** MUI Imports
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Logo from "src/@core/components/logo";

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  // justifyContent: 'space-between',
  justifyContent: "center",
  paddingRight: theme.spacing(4.5),
  transition: "padding .25s ease-in-out",
  minHeight: theme.mixins.toolbar.minHeight,
}));

const StyledLink = styled("div")({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  // paddingBlock: "20px",
});

const VerticalNavHeader = (props) => {
  // ** Props
  const {
    navHover,
    settings,
    collapsedNavWidth,
    navigationBorderWidth,
    verticalNavMenuBranding: userVerticalNavMenuBranding,
  } = props;

  // ** Hooks & Vars
  const { navCollapsed } = settings;

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userVerticalNavMenuBranding) {
        return 0;
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 30) / 8;
      }
    } else {
      return 6;
    }
  };

  return (
    <MenuHeaderWrapper
      className="nav-header"
      sx={{ pl: menuHeaderPaddingLeft() }}
    >
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <StyledLink>
            {/* TODO: Add custom logo */}
            <Box sx={{ pt: 2 }}>
              <Logo />
            </Box>
            {/* <HeaderTitle variant='h6' sx={{ ...menuCollapsedStyles, ...(navCollapsed && !navHover ? {} : { ml: 3 }) }}>
              {themeConfig.templateName}
            </HeaderTitle> */}
          </StyledLink>
        </NavLink>
      )}

      {/* {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{ p: 0, backgroundColor: 'transparent !important' }}
        >
          <Close fontSize='small' />
        </IconButton>
      ) : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
          sx={{ p: 0, color: 'text.primary', backgroundColor: 'transparent !important' }}
        >
          {navCollapsed ? MenuUnlockedIcon() : MenuLockedIcon()}
        </IconButton>
      )} */}
    </MenuHeaderWrapper>
  );
};

export default VerticalNavHeader;
