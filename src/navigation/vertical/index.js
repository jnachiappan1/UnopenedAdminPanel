// ** Icon imports
import HomeIcon from "mdi-material-ui/Home";
import PictureInPictureAltOutlinedIcon from '@mui/icons-material/PictureInPictureAltOutlined';

const navigation = () => {
  return [
    {
      title: "Dashboard",
      icon: HomeIcon,
      path: "/dashboard",
    },
    // {
    //   title:'Banner',
    //   icon: PictureInPictureAltOutlinedIcon,
    //   path: '/banner'
    // },
  ];
};

export default navigation;
