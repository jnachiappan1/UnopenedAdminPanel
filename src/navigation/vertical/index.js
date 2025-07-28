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
import PublicIcon from "@mui/icons-material/Public";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";

const navigation = () => {
  return [
    {
      title: "Dashboard",
      icon: HomeIcon,
      path: "/dashboard",
    },
    {
      title: "Users",
      icon: GroupOutlinedIcon,
      path: "/users",
    },
    {
      title: "Product",
      icon: CategoryOutlinedIcon,
      path: "/product",
    },
    {
      sectionTitle: "Content Management",
    },
    {
      title: "Content Management",
      icon: PublicIcon,
      children: [
        {
          title: "Terms & Conditions",
          icon: TaskOutlinedIcon,
          path: "/terms-and-conditions",
        },
        {
          title: "Privacy Policy",
          icon: PolicyOutlinedIcon,
          path: "/privacy-policy",
        },
        {
          title: "Help & Support",
          icon: HelpCenterOutlinedIcon,
          path: "/help-support",
        },
      ],
    },
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
