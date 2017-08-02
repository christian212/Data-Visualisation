import { Location } from '@angular/common';
import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { Battery } from '../../../models/Battery';
import { BatteryService } from '../../../services/battery.service';

enum CircuitType {
    Undefined = 0,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

@Component({
    selector: 'battery-edit',
    templateUrl: './battery-edit.component.html'
})
export class BatteryEditComponent implements OnInit {
    battery: Battery;

    constructor(
        private batteryService: BatteryService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.batteryService.getBattery(+params['id']))
            .subscribe((battery: Battery) => this.battery = battery,
            error => {
                console.log(`There was an issue. ${error._body}.`);

                this.toastyService.error(
                    <ToastOptions>{
                        title: 'Error!',
                        msg: 'Battery existiert nicht oder konnten nicht geladen werden!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/']);
            });
    }

    updateBattery(battery) {
        this.batteryService.updateBattery(battery).subscribe(result => {
            console.log('Put battery result: ', result);

            this.toastyService.success(
                <ToastOptions>{
                    title: 'Speichern erfolgreich!',
                    msg: battery.name + ' mit der ID ' + battery.id + ' wurde erfolgreich gespeichert!',
                    showClose: true,
                    timeout: 15000
                }
            );
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: battery.name + ' mit der ID ' + battery.id + ' konnte nicht gespeichert werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    goBack(): void {
        this.location.back();
    }
}
