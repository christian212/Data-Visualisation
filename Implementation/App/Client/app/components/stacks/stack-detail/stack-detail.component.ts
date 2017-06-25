import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { IStack } from '../../../models/Stack';
import { StackService } from '../../../shared/stack.service';

@Component({
    selector: 'stack-detail',
    templateUrl: './stack-detail.component.html'
})
export class StackDetailComponent implements OnInit {
    stack: IStack;

    constructor(
        private stackService: StackService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.stackService.getStack(+params['id']))
            .subscribe((stack: IStack) => this.stack = stack);
    }

    edit(id: number) {
        this.router.navigate(['/stack/edit/', id]);
    }

}