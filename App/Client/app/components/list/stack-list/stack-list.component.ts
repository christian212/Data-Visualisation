import { Component, OnInit, Input, Output, EventEmitter, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from '../../../../../node_modules/ngx-pagination/dist/ngx-pagination.module';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { ListComponent } from '../../list/list.component';
import { StackService } from '../../../services/stack.service';
import { Stack } from '../../../models/Stack';

enum CircuitType {
    Undefined,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

@Component({
    selector: 'stack-list',
    templateUrl: './stack-list.component.html',
    styleUrls: ['./stack-list.component.css']
})
export class StackListComponent implements ListComponent, OnInit {

    @Input() searchTerm: string;
    @Output() countUpdated = new EventEmitter();

    stacks: Stack[];
    selectedStack: Stack;
    count: number = 0;

    public CircuitType = CircuitType;

    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 2,
        currentPage: 1
    };

    constructor(
        private stackService: StackService,
        private toastyService: ToastyService,
        private router: Router) { }

    ngOnInit() {
        this.stackService.getStacks().subscribe(result => {
            console.log('Get stack result: ', result);
            console.log('TransferHttp [GET] /api/stacks/allresult', result);
            this.stacks = result as Stack[];
            this.count = result.length;
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: 'Stacks konnten nicht geladen werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    add() {
        let newStackName: string = 'Neuer Stack';
        this.stackService.addStack(newStackName).subscribe(result => {
            console.log('Post user result: ', result);
            if (result.ok) {
                this.stacks.unshift(result.json());
                this.count = this.count + 1;
                this.countUpdated.emit(this.count);

                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Hinzufügen erfolgreich!',
                        msg: 'Ein neuer Stack wurde erfolgreich hinzugefügt!',
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
                    msg: 'Es konnte kein neuer Stack hinzugefügt werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    details(id: number) {
        this.router.navigate(['/stack/details/', id]);
    }

    edit(id: number) {
        this.router.navigate(['/stack/edit/', id]);
    }

    select(stack: Stack) {
        this.selectedStack = stack;
    }

    delete() {
        let stack = this.selectedStack;

        this.stackService.deleteStack(stack).subscribe(result => {
            console.log('Delete stack result: ', result);
            if (result.ok) {
                let position = this.stacks.indexOf(stack);
                this.stacks.splice(position, 1);
                this.count = this.count - 1;
                this.countUpdated.emit(this.count);

                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Löschen erfolgreich!',
                        msg: stack.name + ' wurde erfolgreich gelöscht!',
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
                    msg: stack.name + ' konnte nicht gelöscht werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }
}
