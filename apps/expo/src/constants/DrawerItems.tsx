export default [
  {
    path: "index",
    name: "Dashboard",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/dashboard-icon.png"),
    action: undefined,
    subject: undefined,
  },
  {
    path: "inquiries",
    name: "Inquiries",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/inquiries-icon.png"),
    action: undefined,
    subject: undefined,
  },

  {
    path: "orders",
    name: "Orders",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/orders-icon.png"),
    action: undefined,
    subject: undefined,
  },
  {
    path: "samples",
    name: "Samples",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/samples-icon.png"),
    action: undefined,
    subject: undefined,
  },
  {
    path: "products",
    name: "Products",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/home-icon.png"),
    action: undefined,
    subject: undefined,
  },
  {
    path: "clients",
    name: "Clients",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/client-icon.png"),
    action: "read",
    subject: "Team",
  },
  {
    path: "teamMembers",
    name: "Team Members",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: require("../app/assets/images/user-icon.svg"),
    action: "read",
    subject: "User",
  },
] as const;
