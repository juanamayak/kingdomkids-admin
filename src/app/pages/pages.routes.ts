import {Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {CreateContractsComponent} from "./contracts/create-contracts/create-contracts.component";
import {UsersComponent} from "./users/users.component";
import {KidsComponent} from "./kids/kids.component";

export default [
    {
        path: 'kids',
        children: [
            {
                path: '', loadChildren: () => import('./kids/kids.routes')
            },
        ],
    },
] as Routes;
