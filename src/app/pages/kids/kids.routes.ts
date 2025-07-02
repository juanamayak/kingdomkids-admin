import {Routes} from '@angular/router';
import {KidsInformationComponent} from "../../shared/components/kids-information/kids-information.component";
import {KidsComponent} from "./kids.component";

export default [
    { path: '', component: KidsComponent },
    { path: 'detail', component: KidsInformationComponent },
] as Routes;
