import {
    Component, OnInit,
    // animation imports
    trigger, state, style, transition, animate, Inject
} from '@angular/core';
import { IStack } from '../../models/Stack';
import { StackService } from '../../shared/stack.service';

@Component({
    selector: 'stacks',
    templateUrl: './stacks.component.html',
    styleUrls: ['./stacks.component.css'],
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
export class StacksComponent implements OnInit {

    stacks: IStack[];
    selectedStack: IStack;

    constructor(private stackService: StackService) { }

    ngOnInit() {
        this.stackService.getStacks().subscribe(result => {
            console.log('Get stack result: ', result);
            console.log('TransferHttp [GET] /api/stacks/allresult', result);
            this.stacks = result as IStack[];
        });
    }

    onSelect(stack: IStack): void {
        this.selectedStack = stack;
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
}