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
  },
  {
    path: "inquiries",
    name: "Inquiries",
    icon: InquiriesIcon,
    action: undefined,
    subject: undefined,
  },

  {
    path: "orders",
    name: "Orders",
    icon: OrdersIcon,
    action: undefined,
    subject: undefined,
  },
  {
    path: "samples",
    name: "Samples",
    icon: SamplesIcon,
    action: undefined,
    subject: undefined,
  },
  {
    path: "products",
    name: "Products",
    icon: HomeIcon,
    action: "read",
    subject: "Product",
  },
  {
    path: "clients",
    name: "Clients",
    icon: ClientIcon,
    action: "read",
    subject: "Team",
  },
  {
    path: "teamMembers",
    name: "Team Members",
    icon: UserIcon,
    action: "read",
    subject: "User",
  },
  {
    path: "notifications",
    name: "Notifications",
    icon: UserIcon,
    action: "read",
    subject: "User",
  },
] as const;
