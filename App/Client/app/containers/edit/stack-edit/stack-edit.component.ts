import { Location } from '@angular/common';
import { Component, Input, OnInit, SecurityContext } from '@angular/core';
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
    selector: 'stack-edit',
    templateUrl: './stack-edit.component.html'
})
export class StackEditComponent implements OnInit {
    stack: Stack;

    constructor(
        private stackService: StackService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.stackService.getStack(+params['id']))
            .subscribe((stack: Stack) => this.stack = stack);
    }

    updateStack(stack) {
        this.stackService.updateStack(stack).subscribe(result => {
            console.log('Put stack result: ', result);

            this.toastyService.success(
                <ToastOptions>{
                    title: 'Speichern erfolgreich!',
                    msg: stack.name + ' wurde erfolgreich gespeichert!',
                    showClose: true,
                    timeout: 15000
                }
            );
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: stack.name + ' konnte nicht gespeichert werden!',
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
