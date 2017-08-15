import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { Battery, CircuitType } from '../../../models/Battery';
import { Stack } from '../../../models/Stack';
import { Measurement, MeasurementType } from './../../../models/Measurement';
import { BatteryService } from '../../../services/battery.service';

@Component({
    selector: 'battery-detail',
    templateUrl: './battery-detail.component.html',
    styleUrls: ['./battery-detail.component.css']
})

export class BatteryDetailComponent implements OnInit {
    battery: Battery;
    stacks: Stack[] = [];
    measurements: Measurement[] = [];

    selectedStack: Stack;
    selectedMeasurement: Measurement;

    public CircuitType = CircuitType;
    public MeasurementType = MeasurementType;

    constructor(
        private batteryService: BatteryService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.batteryService.getBattery(+params['id']))
            .subscribe((battery: Battery) => {
                console.log('Get battery result: ', battery);

                this.battery = battery;
                this.measurements = battery.measurements;

                if (battery.batteryStacks !== null) {
                    battery.batteryStacks.forEach(batteryStack => {
                        this.stacks.push(batteryStack.stack);
                    });

                    this.stacks[0].active = true;
                }
            },
            error => {
                console.log(`There was an issue. ${error._body}.`);

                this.toastyService.error(
                    <ToastOptions>{
                        title: 'Error!',
                        msg: 'System existiert nicht oder konnten nicht geladen werden!',
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

    addStack() {

    }

    detailsStack(id: number) {
        this.router.navigate(['/stack/details/', id]);
    }

    editStack(id: number) {
        this.router.navigate(['/stack/edit/', id]);
    }

    selectStack(stack: Stack) {
        this.selectedStack = stack;
    }

    deleteStack() {

    }
}
