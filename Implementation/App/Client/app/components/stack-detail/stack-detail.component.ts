import { Component, Input } from '@angular/core';
import { IStack } from '../../models/Stack';
import { StackService } from '../../shared/stack.service';

@Component({
    selector: 'stack-detail',
    templateUrl: './stack-detail.component.html'
})
export class StackDetailComponent {
    @Input() stack: IStack;

    constructor(private stackService: StackService) { }


    updateStack(stack) {
        this.stackService.updateStack(stack).subscribe(result => {
            console.log('Put stack result: ', result);
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
        });
    }
}
