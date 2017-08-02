import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { Stack } from '../../../models/Stack';
import { StackService } from '../../../services/stack.service';

enum CircuitType {
    Undefined = 0,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

@Component({
    selector: 'stack-detail',
    templateUrl: './stack-detail.component.html'
})

export class StackDetailComponent implements OnInit {
    stack: Stack;

    public cells: any[] = [
        { name: 'Zelle 1', description: 'Beschreibung 1', active: true },
        { name: 'Zelle 2', description: 'Beschreibung 2' },
        { name: 'Zelle 3', description: 'Beschreibung 3' }
    ];

    public CircuitType = CircuitType;

    constructor(
        private stackService: StackService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.stackService.getStack(+params['id']))
            .subscribe((stack: Stack) => this.stack = stack,
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

                this.router.navigate(['/database/']);
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

    plotStack() {

    }

    addCell() {

    }

    editCell(id: number) {

    }

    deleteCell() {

    }

    plotCell() {

    }
}
