import { Component } from '@angular/core';
import {TableModule} from "primeng/table";
import {SkeletonModule} from "primeng/skeleton";

@Component({
  selector: 'app-table-skeleton',
    imports: [
        TableModule,
        SkeletonModule
    ],
  templateUrl: './table-skeleton.component.html',
  styleUrl: './table-skeleton.component.scss'
})
export class TableSkeletonComponent {

}
