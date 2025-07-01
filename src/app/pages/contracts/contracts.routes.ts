import {Routes} from '@angular/router';
import {CreateContractsComponent} from "./create-contracts/create-contracts.component";
import {CreatedContractsComponent} from "./created-contracts/created-contracts.component";
import {AuthorizedContractsComponent} from "./authorized-contracts/authorized-contracts.component";
import {SentContractsComponent} from "./sent-contracts/sent-contracts.component";
import {ActiveContractsComponent} from "./active-contracts/active-contracts.component";
import {FinishedContractsComponent} from "./finished-contracts/finished-contracts.component";
import {CanceledContractsComponent} from "./canceled-contracts/canceled-contracts.component";
import {DocumentationContractsComponent} from "./documentation-contracts/documentation-contracts.component";
import {TrashContractsComponent} from "./trash-contracts/trash-contracts.component";
import {ContractDetailsComponent} from "../../shared/components/contract-details/contract-details.component";
import {ClientsInformationComponent} from "../../shared/components/clients-information/clients-information.component";

export default [
    { path: 'detail', component: ContractDetailsComponent },
    { path: 'client', component: ClientsInformationComponent },
    { path: 'create', component: CreateContractsComponent },
    { path: 'created', component: CreatedContractsComponent },
    { path: 'authorized', component: AuthorizedContractsComponent },
    { path: 'documentation/:contractUuid', component: DocumentationContractsComponent },
    { path: 'sent', component: SentContractsComponent },
    { path: 'active', component: ActiveContractsComponent },
    { path: 'finished', component: FinishedContractsComponent },
    { path: 'canceled', component: CanceledContractsComponent },
    { path: 'trash', component: TrashContractsComponent }
] as Routes;
