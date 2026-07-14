import {Routes} from '@angular/router';
import {KidsComponent} from './pages/kids/kids.component';
import {KidsInformationComponent} from '../../shared/components/kids-information/kids-information.component';
import {CheckinsComponent} from './pages/checkins/checkins.component';

export default [
    { path: '', component: KidsComponent },
    { path: 'detail', component: KidsInformationComponent },
    { path: 'checkins', component: CheckinsComponent },
] as Routes;

