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

    public cells: any[] = [
        { name: 'Zelle 1', description: 'Beschreibung 1', active: true },
        { name: 'Zelle 2', description: 'Beschreibung 2' },
        { name: 'Zelle 3', description: 'Beschreibung 3' }
    ];

    public CircuitType = CircuitType;

    constructor(
        private stackService: StackService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.stackService.getStack(+params['id']))
            .subscribe((stack: Stack) => this.stack = stack);
    }

    editStack(id: number) {
        this.router.navigate(['/stack/edit/', id]);
    }

    deleteStack(stack) {
        this.stackService.deleteStack(stack).subscribe(result => {
            console.log('Delete stack result: ', result);
            if (result.ok) {
                this.router.navigate(['/database/']);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
        });
    }

    plotStack() {

    }

    addCell() {

    }

    editCell(id: number) {
        this.router.navigate(['/stack/edit/', id]);
    }

    deleteCell(stack) {
        this.stackService.deleteStack(stack).subscribe(result => {
            console.log('Delete stack result: ', result);
            if (result.ok) {
                this.router.navigate(['/database/']);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
        });
    }

    plotCell() {

    }
}
