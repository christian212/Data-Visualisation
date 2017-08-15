import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { Cell } from '../../../models/Cell';
import { Measurement, MeasurementType } from './../../../models/Measurement';
import { CellService } from '../../../services/cell.service';

@Component({
    selector: 'cell-detail',
    templateUrl: './cell-detail.component.html',
    styleUrls: ['./cell-detail.component.css']
})

export class CellDetailComponent implements OnInit {
    cell: Cell;
    measurements: Measurement[] = [];

    selectedMeasurement: Measurement;

    public MeasurementType = MeasurementType;

    constructor(
        private cellService: CellService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.cellService.getCell(+params['id']))
            .subscribe((cell: Cell) => {
                console.log('Get cell result: ', cell);

                this.cell = cell;
                this.measurements = cell.measurements;
            },
            error => {
                console.log(`There was an issue. ${error._body}.`);

                this.toastyService.error(
                    <ToastOptions>{
                        title: 'Error!',
                        msg: 'Zelle existiert nicht oder konnten nicht geladen werden!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 2]);
            });
    }

    editCell(id: number) {
        this.router.navigate(['/cell/edit/', id]);
    }

    deleteCell() {
        this.cellService.deleteCell(this.cell).subscribe(result => {
            console.log('Delete cell result: ', result);
            if (result.ok) {
                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Löschen erfolgreich!',
                        msg: this.cell.name + ' wurde erfolgreich gelöscht!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 2]);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: this.cell.name + ' konnte nicht gelöscht werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }
}
