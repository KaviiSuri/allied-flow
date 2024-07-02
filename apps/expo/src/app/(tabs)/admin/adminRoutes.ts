import Products from "./products"
import Clients from "./clients"
import TeamMembers from "./teamMembers"

export const adminRoutes = [
        {
            path:'products',
            name:'Products',
            component: Products,
            icon: require('../../../app/assets/images/home-icon.svg')
        },
        {
            path:'clients',
            name:'Clients',
            component: Clients,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            icon: require('../../../app/assets/images/clients-icon.svg')
        },
        {
            path:'team-members',
            name:'Team Members',
            component: TeamMembers,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            icon: require('../../../app/assets/images/user-icon.svg')
        }
]