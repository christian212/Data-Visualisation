import { Component, OnInit, trigger, state, style, transition, animate, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { IStack } from '../../../models/Stack';
import { ListComponent }      from '../../list/list.component';
import { StackService } from '../../../shared/stack.service';

@Component({
    selector: 'stack-list',
    templateUrl: './stack-list.component.html',
    styleUrls: ['./stack-list.component.css'],
    animations: [
        trigger('flyInOut', [
            state('in', style({ transform: 'translateY(0)' })),
            transition('void => *', [
                style({ transform: 'translateY(-100%)' }),
                animate(1000)
            ]),
            transition('* => void', [
                animate(1000, style({ transform: 'translateY(100%)' }))
            ])
        ])
    ]
})
export class StackListComponent implements ListComponent, OnInit {

    data: any;
    stacks: IStack[];
    count: number = 0;
    selectedStack: IStack;

    constructor(
        private stackService: StackService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.stackService.getStacks().subscribe(result => {
            console.log('Get stack result: ', result);
            console.log('TransferHttp [GET] /api/stacks/allresult', result);
            this.stacks = result as IStack[];
        });
        this.count = this.stacks.length;
    }

    onSelect(stack: IStack) {
        this.selectedStack = stack;
        this.router.navigate(['/stack', stack.id]);
    }

    deleteStack(stack) {
        this.stackService.deleteStack(stack).subscribe(result => {
            console.log('Delete stack result: ', result);
            if (result.ok) {
                let position = this.stacks.indexOf(stack);
                this.stacks.splice(position, 1);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
        });
    }

    add() {
        let newStackName: any = "Neuer Stack";
        this.stackService.addStack(newStackName).subscribe(result => {
            console.log('Post user result: ', result);
            if (result.ok) {
                this.stacks.push(result.json());
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
        });
    }
}