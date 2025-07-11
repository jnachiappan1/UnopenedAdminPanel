// ** Icon imports
import HomeIcon from "mdi-material-ui/Home";
import PictureInPictureAltOutlinedIcon from '@mui/icons-material/PictureInPictureAltOutlined';
import TaskIcon from '@mui/icons-material/Task'
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';


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
    {
      title: 'Users',
      icon: TaskIcon,
      path: '/users'
    },
    {
      title: 'Product',
      icon: CategoryOutlinedIcon,
      path: '/product'
    },
    {
      title: 'Terms & Conditions',
      icon: TaskIcon,
      path: '/terms-and-conditions'
    },
    {
      title: 'Privacy Policy',
      icon: PolicyOutlinedIcon,
      path: '/privacy-policy'
    },
    {
      title: 'Help & Support',
      icon: TaskIcon,
      path: '/help-support'
    },
 

  ];
};

export default navigation;
