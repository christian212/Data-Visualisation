import { Location } from '@angular/common';
import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { Cell } from '../../../models/Cell';
import { CellService } from '../../../services/cell.service';

@Component({
    selector: 'cell-edit',
    templateUrl: './cell-edit.component.html'
})
export class CellEditComponent implements OnInit {
    cell: Cell;

    constructor(
        private cellService: CellService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.cellService.getCell(+params['id']))
            .subscribe((cell: Cell) => this.cell = cell,
            error => {
                console.log(`There was an issue. ${error._body}.`);

                this.toastyService.error(
                    <ToastOptions>{
                        title: 'Error!',
                        msg: 'Cell existiert nicht oder konnten nicht geladen werden!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/']);
            });
    }

    updateCell(cell) {
        this.cellService.updateCell(cell).subscribe(result => {
            console.log('Put cell result: ', result);

            this.toastyService.success(
                <ToastOptions>{
                    title: 'Speichern erfolgreich!',
                    msg: cell.name + ' mit der ID ' + cell.id + ' wurde erfolgreich gespeichert!',
                    showClose: true,
                    timeout: 15000
                }
            );
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: cell.name + ' mit der ID ' + cell.id + ' konnte nicht gespeichert werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    goBack(): void {
        this.location.back();
    }
}
