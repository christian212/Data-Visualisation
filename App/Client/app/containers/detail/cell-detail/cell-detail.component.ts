import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { Cell } from '../../../models/Cell';
import { CellService } from '../../../services/cell.service';

enum CircuitType {
    Undefined = 0,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

@Component({
    selector: 'cell-detail',
    templateUrl: './cell-detail.component.html'
})

export class CellDetailComponent implements OnInit {
    cell: Cell;

    public measurements: any[] = [
        { name: 'Messung 1', description: 'Beschreibung 1', active: true },
        { name: 'Messung 2', description: 'Beschreibung 2' },
        { name: 'Messung 3', description: 'Beschreibung 3' }
    ];

    public CircuitType = CircuitType;

    constructor(
        private cellService: CellService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.cellService.getCell(+params['id']))
            .subscribe((cell: Cell) => this.cell = cell,
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

    plotCell() {

    }

    addCell() {

    }

    editMeasurement(id: number) {

    }

    deleteMeasurement() {

    }

    plotMeasurement() {

    }
}
