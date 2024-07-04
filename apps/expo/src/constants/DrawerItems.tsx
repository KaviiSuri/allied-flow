import Home from "~/app/(tabs)";
import TeamMembers from "~/app/(tabs)/teamMembers";
import Dashboard from "~/app/(tabs)/dashboard";
import Inquiries from "~/app/(tabs)/inquiries";
import Orders from "~/app/(tabs)/orders";
import Samples from "~/app/(tabs)/samples";

export default [
    {
        path:'dashboard',
        name:'Dashboard',
        component: Dashboard,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        icon: require('../app/assets/images/dashboard-icon.png')
    },
    {
        path:'inquiries',
        name:'Inquiries',
        component: Inquiries,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        icon: require('../app/assets/images/inquiries-icon.png')
    },

    {
        path:'orders',
        name:'Orders',
        component: Orders,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        icon: require('../app/assets/images/orders-icon.png')
    },
    {
        path:'samples',
        name:'Samples',
        component: Samples,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        icon: require('../app/assets/images/samples-icon.png')
    },
    {
      path:'admin/teamMembers',
      name:'Team Members',
      component: TeamMembers,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      icon: require('../app/assets/images/dashboard-icon.png')
  },
 ]