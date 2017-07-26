import { Component, OnInit, Input, Output, EventEmitter, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from '../../../../../node_modules/ngx-pagination/dist/ngx-pagination.module';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { ListComponent } from '../../list/list.component';
import { CellService } from '../../../services/cell.service';
import { Cell } from '../../../models/Cell';

@Component({
    selector: 'cell-list',
    templateUrl: './cell-list.component.html',
    styleUrls: ['./cell-list.component.css']
})
export class CellListComponent implements ListComponent, OnInit {

    @Input() searchTerm: string;
    @Output() countUpdated = new EventEmitter();

    cells: Cell[];
    selectedCell: Cell;
    count: number = 0;

    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 2,
        currentPage: 1
    };

    constructor(
        private cellService: CellService,
        private toastyService: ToastyService,
        private router: Router) { }

    ngOnInit() {
        this.cellService.getCells().subscribe(result => {
            console.log('Get cell result: ', result);
            console.log('TransferHttp [GET] /api/cells/allresult', result);
            this.cells = result as Cell[];
            this.count = result.length;
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: 'Zellen konnten nicht geladen werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    add() {
        let newCellName: string = 'Neue Zelle';
        this.cellService.addCell(newCellName).subscribe(result => {
            console.log('Post user result: ', result);
            if (result.ok) {
                this.cells.unshift(result.json());
                this.count = this.count + 1;
                this.countUpdated.emit(this.count);

                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Hinzufügen erfolgreich!',
                        msg: 'Eine neue Zelle wurde erfolgreich hinzugefügt!',
                        showClose: true,
                        timeout: 15000
                    }
                );
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: 'Es konnte keine neue Zelle hinzugefügt werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    details(id: number) {
        this.router.navigate(['/cell/details/', id]);
    }

    edit(id: number) {
        this.router.navigate(['/cell/edit/', id]);
    }

    select(cell: Cell) {
        this.selectedCell = cell;
    }

    delete() {
        let cell = this.selectedCell;

        this.cellService.deleteCell(cell).subscribe(result => {
            console.log('Delete cell result: ', result);
            if (result.ok) {
                let position = this.cells.indexOf(cell);
                this.cells.splice(position, 1);
                this.count = this.count - 1;
                this.countUpdated.emit(this.count);

                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Löschen erfolgreich!',
                        msg: cell.name + ' wurde erfolgreich gelöscht!',
                        showClose: true,
                        timeout: 15000
                    }
                );
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: cell.name + ' konnte nicht gelöscht werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }
}
