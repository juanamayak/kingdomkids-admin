import {Routes} from '@angular/router';
import {KidsComponent} from './pages/kids/kids.component';
import {KidsInformationComponent} from '../../shared/components/kids-information/kids-information.component';

export default [
    { path: '', component: KidsComponent },
    { path: 'detail', component: KidsInformationComponent },
] as Routes;

