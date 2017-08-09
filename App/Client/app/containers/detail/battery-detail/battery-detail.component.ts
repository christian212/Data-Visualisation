import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { Battery } from '../../../models/Battery';
import { BatteryService } from '../../../services/battery.service';

enum CircuitType {
    Undefined,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

@Component({
    selector: 'battery-detail',
    templateUrl: './battery-detail.component.html'
})

export class BatteryDetailComponent implements OnInit {
    battery: Battery;

    public stacks: any[] = [
        { name: 'Stack 1', description: 'Beschreibung 1', active: true },
        { name: 'Stack 2', description: 'Beschreibung 2' },
        { name: 'Stack 3', description: 'Beschreibung 3' }
    ];

    public CircuitType = CircuitType;

    constructor(
        private batteryService: BatteryService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
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

                this.router.navigate(['/database/', 0]);
            });
    }

    editBattery(id: number) {
        this.router.navigate(['/battery/edit/', id]);
    }

    deleteBattery() {
        this.batteryService.deleteBattery(this.battery).subscribe(result => {
            console.log('Delete battery result: ', result);
            if (result.ok) {
                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Löschen erfolgreich!',
                        msg: this.battery.name + ' wurde erfolgreich gelöscht!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 0]);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: this.battery.name + ' konnte nicht gelöscht werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    plotBattery() {

    }

    addStack() {

    }

    editStack(id: number) {

    }

    deleteStack() {

    }

    plotStack() {

    }
}
