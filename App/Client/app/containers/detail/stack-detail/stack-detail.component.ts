import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

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

    public CircuitType = CircuitType;

    constructor(
        private stackService: StackService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.stackService.getStack(+params['id']))
            .subscribe((stack: Stack) => this.stack = stack);
    }

    edit(id: number) {
        this.router.navigate(['/stack/edit/', id]);
    }

    delete(stack) {
        this.stackService.deleteStack(stack).subscribe(result => {
            console.log('Delete stack result: ', result);
            if (result.ok) {
                this.router.navigate(['/database/']);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
        });
    }

}