import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { CircuitType } from '../../../models/Battery';
import { Stack } from '../../../models/Stack';
import { Cell } from './../../../models/Cell';
import { Measurement, MeasurementType } from './../../../models/Measurement';
import { StackService } from '../../../services/stack.service';

@Component({
    selector: 'stack-detail',
    templateUrl: './stack-detail.component.html',
    styleUrls: ['./stack-detail.component.css']
})

export class StackDetailComponent implements OnInit {
    stack: Stack;
    cells: Cell[] = [];
    measurements: Measurement[] = [];

    selectedCell: Cell;
    selectedMeasurement: Measurement;

    public CircuitType = CircuitType;
    public MeasurementType = MeasurementType;

    constructor(
        private stackService: StackService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.stackService.getStack(+params['id']))
            .subscribe((stack: Stack) => {
                this.stack = stack;
                this.measurements = stack.measurements;

                if (stack.stackCells !== null) {
                    stack.stackCells.forEach(stackCells => {
                        this.cells.push(stackCells.cell);
                    });

                    this.cells[0].active = true;
                }
            },
            error => {
                console.log(`There was an issue. ${error._body}.`);

                this.toastyService.error(
                    <ToastOptions>{
                        title: 'Error!',
                        msg: 'Stack existiert nicht oder konnten nicht geladen werden!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 1]);
            });
    }

    editStack(id: number) {
        this.router.navigate(['/stack/edit/', id]);
    }

    deleteStack() {
        this.stackService.deleteStack(this.stack).subscribe(result => {
            console.log('Delete stack result: ', result);
            if (result.ok) {
                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Löschen erfolgreich!',
                        msg: this.stack.name + ' wurde erfolgreich gelöscht!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 1]);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: this.stack.name + ' konnte nicht gelöscht werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    addCell() {

    }

    detailsCell(id: number) {
        this.router.navigate(['/cell/details/', id]);
    }

    editCell(id: number) {
        this.router.navigate(['/cell/edit/', id]);
    }

    selectCell(cell: Cell) {
        this.selectedCell = cell;
    }

    deleteCell() {

    }
}
