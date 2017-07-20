import { Component, OnInit, Input, Output, EventEmitter, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from '../../../../../node_modules/ngx-pagination/dist/ngx-pagination.module';
import { DomSanitizer } from '@angular/platform-browser';

import { ListComponent } from '../../list/list.component';
import { StackService } from '../../../services/stack.service';
import { Stack } from '../../../models/Stack';

enum CircuitType {
    Undefined = 0,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

@Component({
    selector: 'stack-list',
    templateUrl: './stack-list.component.html',
    styleUrls: ['./stack-list.component.css']
})
export class StackListComponent implements ListComponent, OnInit {

    @Input() searchTerm: string;
    @Output() countUpdated = new EventEmitter();

    stacks: Stack[];
    count: number = 0;

    public alerts: any = [];

    public CircuitType = CircuitType;

    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 2,
        currentPage: 1
    };

    constructor(
        private stackService: StackService,
        private router: Router,
        sanitizer: DomSanitizer
    ) {
        this.alerts = this.alerts.map((alert: any) => ({
            type: alert.type,
            msg: sanitizer.sanitize(SecurityContext.HTML, alert.msg)
        }));
    }

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
                this.countUpdated.emit(this.count);
                this.details(result.json().id);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
        });
    }

    details(id: number) {
        this.router.navigate(['/stack/details/', id]);
    }

    edit(id: number) {
        this.router.navigate(['/stack/edit/', id]);
    }

    delete(stack) {
        this.stackService.deleteStack(stack).subscribe(result => {
            console.log('Delete stack result: ', result);
            if (result.ok) {
                let position = this.stacks.indexOf(stack);
                this.stacks.splice(position, 1);
                this.count = this.count - 1;
                this.countUpdated.emit(this.count);
                this.alerts.push({
                    type: 'info',
                    msg: '<div class="alert-icon"><i class="now-ui-icons travel_info"></i></div><strong>' + stack.name + '</strong> wurde erfolgreich gelöscht!'
                });
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
            this.alerts.push({
                type: 'danger',
                msg: '<div class="alert-icon"><i class="now-ui-icons objects_support-17"></i></div><strong>' + stack.name + '</strong> konnte nicht gelöscht werden!'
            });
        });
    }
}