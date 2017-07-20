import { Location } from '@angular/common';
import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

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

    public alerts: any = [];

    constructor(
        private stackService: StackService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        sanitizer: DomSanitizer
    ) {
        this.alerts = this.alerts.map((alert: any) => ({
            type: alert.type,
            msg: sanitizer.sanitize(SecurityContext.HTML, alert.msg)
        }));
    }

    ngOnInit() {
        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.stackService.getStack(+params['id']))
            .subscribe((stack: Stack) => this.stack = stack);
    }

    updateStack(stack) {
        this.stackService.updateStack(stack).subscribe(result => {
            console.log('Put stack result: ', result);
            this.alerts.push({
                type: 'success',
                msg: '<div class="alert-icon"><i class="now-ui-icons ui-2_like"></i></div><strong>' + stack.name + '</strong> wurde gespeichert!'
            });
        }, error => {
            console.log(`There was an issue. ${error._body}.`);
            this.alerts.push({
                type: 'danger',
                msg: '<div class="alert-icon"><i class="now-ui-icons objects_support-17"></i></div><strong>' + stack.name + '</strong> konnte nicht gespeichert werden!'
            });
        });
    }

    goBack(): void {
        this.location.back();
    }
}