import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ListComponent } from '../../list/list.component';
import { StackService } from '../../../services/stack.service';
import { Stack } from '../../../models/Stack';

@Component({
    selector: 'stack-list',
    templateUrl: './stack-list.component.html',
    styleUrls: ['./stack-list.component.css']
})
export class StackListComponent implements ListComponent, OnInit {

    stacks: Stack[];
    count: number;
    data: any;

    constructor(
        private stackService: StackService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.stackService.getStacks().subscribe(result => {
            console.log('Get stack result: ', result);
            console.log('TransferHttp [GET] /api/stacks/allresult', result);
            this.stacks = result as Stack[];
            this.count = result.length;
        });
    }

    add() {
        let newStackName: string = "Neuer Stack";
        this.stackService.addStack(newStackName).subscribe(result => {
            console.log('Post user result: ', result);
            if (result.ok) {
                this.stacks.push(result.json());
                this.count = this.count + 1;
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
        });
    }

    details(id: number) {
        this.router.navigate(['/stack/details/', id]);
    }

    delete(stack) {
        this.stackService.deleteStack(stack).subscribe(result => {
            console.log('Delete stack result: ', result);
            if (result.ok) {
                let position = this.stacks.indexOf(stack);
                this.stacks.splice(position, 1);
                this.count = this.count - 1;
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
        });
    }
}