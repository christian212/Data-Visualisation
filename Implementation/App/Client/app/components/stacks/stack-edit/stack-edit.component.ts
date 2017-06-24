import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { IStack } from '../../../models/Stack';
import { StackService } from '../../../shared/stack.service';

@Component({
    selector: 'stack-edit',
    templateUrl: './stack-edit.component.html'
})
export class StackEditComponent implements OnInit {
    stack: IStack;

    constructor(
        private stackService: StackService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) { }

    ngOnInit() {
        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.stackService.getStack(+params['id']))
            .subscribe((stack: IStack) => this.stack = stack);
    }

    updateStack(stack) {
        this.stackService.updateStack(stack).subscribe(result => {
            console.log('Put stack result: ', result);
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
        });
    }

    goBack(): void {
        this.location.back();
    }
}
