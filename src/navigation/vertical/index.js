// ** Icon imports
import HomeIcon from "mdi-material-ui/Home";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LockIcon from "@mui/icons-material/Lock";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PublicIcon from "@mui/icons-material/Public";
import HelpCenterOutlinedIcon from "@mui/icons-material/HelpCenterOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

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
      icon: Inventory2Icon,
      path: "/product",
    },
    {
      title: "Product Price Management",
      icon: CurrencyRupeeOutlinedIcon,
      path: "/product-price-management",
    },
    {
      title: "Coupon",
      icon: LocalOfferOutlinedIcon,
      path: "/coupon",
    },
    {
      title: "Category",
      icon: CategoryOutlinedIcon,
      path: "/category",
    },
    {
      title: "Cashout Fees",
      icon: AttachMoneyOutlinedIcon,
      path: "/cashout-fees",
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
          icon: Groups2OutlinedIcon,
          path: "/roles",
        },
        {
          title: "Sub Admin",
          icon: PersonOutlineOutlinedIcon,
          path: "/sub-admin",
        },
      ],
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
        {
          title: "Contact Us",
          icon: ContactSupportIcon,
          path: "/contact-us",
        },
      ],
    },
  ];
};

export default navigation;
