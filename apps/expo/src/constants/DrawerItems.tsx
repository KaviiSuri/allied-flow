import DashboardIcon from "../app/assets/images/dashboard-icon.png";
import InquiriesIcon from "../app/assets/images/inquiries-icon.png";
import OrdersIcon from "../app/assets/images/orders-icon.png";
import SamplesIcon from "../app/assets/images/samples-icon.png";
import HomeIcon from "../app/assets/images/home-icon.png";
import ClientIcon from "../app/assets/images/client-icon.png";
import UserIcon from "../app/assets/images/user-icon.png";

export default [
  {
    path: "index",
    name: "Dashboard",
    icon: DashboardIcon,
    action: undefined,
    subject: undefined,
    hideDesktop: false,
    mobileView: true,
  },
  {
    path: "inquiries",
    name: "Inquiries",
    icon: InquiriesIcon,
    action: undefined,
    subject: undefined,
    hideDesktop: false,
    mobileView: true,
  },

  {
    path: "orders",
    name: "Orders",
    icon: OrdersIcon,
    action: undefined,
    subject: undefined,
    hideDesktop: false,
    mobileView: true,
  },
  {
    path: "samples",
    name: "Samples",
    icon: SamplesIcon,
    action: undefined,
    subject: undefined,
    hideDesktop: false,
    mobileView: true,
  },
  {
    path: "products",
    name: "Products",
    icon: HomeIcon,
    action: "read",
    subject: "Product",
    hideDesktop: false,
    mobileView: false,
  },
  {
    path: "clients",
    name: "Clients",
    icon: ClientIcon,
    action: "read",
    subject: "Team",
    hideDesktop: false,
    mobileView: false,
  },
  {
    path: "teamMembers",
    name: "Team Members",
    icon: UserIcon,
    action: "read",
    subject: "User",
    hideDesktop: false,
    mobileView: false,
  },
  {
    path: "notifications",
    name: "Notifications",
    icon: UserIcon,
    action: "read",
    subject: "User",
    hideDesktop: true,
    mobileView: true,
  },
  {
    path: "inquiry/sendQuote",
    name: "",
    hideDesktop: true,
    mobileView: false,
  },
  {
    path: "inquiry/[inquiryNumber]",
    name: "",
    hideDesktop: true,
    mobileView: false,
  },
] as const;
