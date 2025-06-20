const lightColor = "58, 53, 65";
const darkColor = "231, 227, 252";

export const customColors = {
  main: (mode) => (mode === "light" ? lightColor : darkColor),
  dark: darkColor,
  light: lightColor,
};

const DefaultPalette = (mode, skin, themeColor) => {
  // ** Vars

  const mainColor = mode === "light" ? lightColor : darkColor;

  const primaryGradient = () => {
    if (themeColor === "primary") {
      return "#C6A7FE";
    } else if (themeColor === "secondary") {
      return "#9C9FA4";
    } else if (themeColor === "success") {
      return "#93DD5C";
    } else if (themeColor === "error") {
      return "#FF8C90";
    } else if (themeColor === "warning") {
      return "#FFCF5C";
    } else {
      return "#6ACDFF";
    }
  };

  const defaultBgColor = () => {
    if (skin === "bordered" && mode === "light") {
      return "#FFF";
    } else if (skin === "bordered" && mode === "dark") {
      return "#312D4B";
    } else if (mode === "light") {
      return "#F4F5FA";
    } else return "#28243D";
  };

  return {
    customColors: {
      // dark: darkColor,
      // main: mainColor,
      // light: lightColor,
      darkBg: "#28243D",
      lightBg: "#F4F5FA",
      primaryGradient: primaryGradient(),
      bodyBg: mode === "light" ? "#F4F5FA" : "#28243D",
      tableHeaderBg: mode === "light" ? "#F9FAFC" : "#3D3759",
    },
    common: {
      black: "#000",
      white: "#FFF",
    },
    mode: mode,
    primary: {
      light: "#65bb63",
      //main: "#3fab3c",
      main: "#31AD52",
      dark: "#2c772a",
      contrastText: "#FFF",
    },
    secondary: {
      light: "#023c56",
      main: "#03577B",
      dark: "#023c56",
      contrastText: "#FFF",
    },
    success: {
      light: "#6AD01F",
      main: "#56CA00",
      dark: "#4CB200",
      contrastText: "#FFF",
    },
    error: {
      light: "#FF6166",
      main: "#FF4C51",
      dark: "#E04347",
      contrastText: "#FFF",
    },
    warning: {
      light: "#FFCA64",
      main: "#FFB400",
      dark: "#E09E00",
      contrastText: "#FFF",
    },
    info: {
      light: "#32BAFF",
      main: "#16B1FF",
      dark: "#139CE0",
      contrastText: "#FFF",
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#D5D5D5",
      A200: "#AAAAAA",
      A400: "#616161",
      A700: "#303030",
    },
    neutral: {
      90: "#150425",
      80: "#332640",
      70: "#574766",
      60: "#826C99",
      50: "#B8A3CC",
      40: "#C9B9DA",
      30: "#DBD0E6",
      20: "#F5EFFA",
      10: "#FCFCFD",
    },
    text: {
      primary: `rgba(${mainColor}, 0.87)`,
      secondary: `rgba(${mainColor}, 0.68)`,
      disabled: `rgba(${mainColor}, 0.38)`,
    },
    divider: `rgba(${mainColor}, 0.12)`,
    background: {
      paper: mode === "light" ? "#FFF" : "#312D4B",
      default: defaultBgColor(),
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.3)`,
      disabledBackground: `rgba(${mainColor}, 0.18)`,
      focus: `rgba(${mainColor}, 0.12)`,
    },
  };
};

export default DefaultPalette;
