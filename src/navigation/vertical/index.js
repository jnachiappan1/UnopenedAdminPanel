// ** Icon imports
import HomeIcon from "mdi-material-ui/Home";
import PictureInPictureAltOutlinedIcon from "@mui/icons-material/PictureInPictureAltOutlined";
import TaskIcon from "@mui/icons-material/Task";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PeopleIcon from "@mui/icons-material/People";
import LockIcon from "@mui/icons-material/Lock";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

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
      title: "Users",
      icon: TaskIcon,
      path: "/users",
    },
    {
      title: "Product",
      icon: CategoryOutlinedIcon,
      path: "/product",
    },
    {
      title: "Terms & Conditions",
      icon: TaskIcon,
      path: "/terms-and-conditions",
    },
    {
      title: "Privacy Policy",
      icon: PolicyOutlinedIcon,
      path: "/privacy-policy",
    },
    {
      title: "Help & Support",
      icon: TaskIcon,
      path: "/help-support",
    },
    // Dropdown
    {
      sectionTitle: "User Management",
    },
    {
      title: "Sub Admin Management",
      icon: AdminPanelSettingsOutlinedIcon,
      children: [
        {
          title: "Permission",
          icon: LockIcon,
          path: "/permission",
        },
        {
          title: "Roles",
          icon: PeopleIcon,
          path: "/roles",
        },
        {
          title: "Sub Admin",
          icon: PersonOutlineOutlinedIcon,
          path: "/sub-admin",
        },
      ],
    },
  ];
};

export default navigation;
