interface DrawerItem {
  path: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  action?: string;
  subject?: string;
};

export default [
  {
    path: "dashboard",
    name: "Dashboard",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/dashboard-icon.png"),
  },
  {
    path: "inquiries",
    name: "Inquiries",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/inquiries-icon.png"),
  },

  {
    path: "orders",
    name: "Orders",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/orders-icon.png"),
  },
  {
    path: "samples",
    name: "Samples",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/samples-icon.png"),
  },
  {
    path: "products",
    name: "Products",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/home-icon.png"),
  },
  {
    path: "clients",
    name: "Clients",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/client-icon.png"),
  },
  {
    path: "teamMembers",
    name: "Team Members",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/user-icon.svg"),
    action: "read",
    subject: "User",
  },
] as DrawerItem[];
