import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { Chart } from 'angular-highcharts';

import { Battery } from '../../../models/Battery';
import { Stack } from '../../../models/Stack';
import { Measurement } from './../../../models/Measurement';
import { BatteryService } from '../../../services/battery.service';
import { MeasurementService } from '../../../services/measurement.service';

enum CircuitType {
    Undefined = 0,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

enum MeasurementType {
    Undefined,
    Zeitreihe,
    Ortskurve,
    Sonstige
}

@Component({
    selector: 'battery-detail',
    templateUrl: './battery-detail.component.html',
    styleUrls: ['./battery-detail.component.css']
})

export class BatteryDetailComponent implements OnInit {
    battery: Battery;
    stacks: Stack[] = [];

    get undefinedMeasurements(): Measurement[] {
        return this.battery.measurements.filter(
            measurement => measurement.measurementType === 0);
    }
    get timeseriesMeasurements(): Measurement[] {
        return this.battery.measurements.filter(
            measurement => measurement.measurementType === 1);
    }
    get locusMeasurements(): Measurement[] {
        return this.battery.measurements.filter(
            measurement => measurement.measurementType === 2);
    }
    get otherMeasurements(): Measurement[] {
        return this.battery.measurements.filter(
            measurement => measurement.measurementType === 3);
    }

    selectedStack: Stack;
    selectedMeasurement: Measurement;

    timeseriesChart: Chart;
    locusChart: Chart;

    public CircuitType = CircuitType;
    public MeasurementType = MeasurementType;

    constructor(
        private batteryService: BatteryService,
        private measurementService: MeasurementService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.batteryService.getBattery(+params['id']))
            .subscribe((battery: Battery) => {
                this.battery = battery;

                if (battery.batteryStacks !== null) {

                    let stacks: Stack[] = [];

                    battery.batteryStacks.forEach(batteryStack => {
                        stacks.push(batteryStack.stack);
                    });

                    stacks[0].active = true;
                    this.stacks = stacks;
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

    addMeasurement() {
        this.router.navigate(['/upload']);
    }

    detailsMeasurement(id: number) {
        this.router.navigate(['/measurement/details/', id]);
    }

    editMeasurement(id: number) {
        this.router.navigate(['/measurement/edit/', id]);
    }

    selectMeasurement(measurement: Measurement) {
        this.selectedMeasurement = measurement;
    }

    deleteMeasurement() {
        let measurement = this.selectedMeasurement;

        this.measurementService.deleteMeasurement(measurement).subscribe(result => {
            console.log('Delete measurement result: ', result);
            if (result.ok) {
                let position = this.battery.measurements.indexOf(measurement);
                this.battery.measurements.splice(position, 1);

                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Löschen erfolgreich!',
                        msg: measurement.name + ' wurde erfolgreich gelöscht!',
                        showClose: true,
                        timeout: 15000
                    }
                );
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: measurement.name + ' konnte nicht gelöscht werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    plotTimeseries(measurement: Measurement) {
        this.measurementService.getTimeSeries(measurement.id)
            .subscribe((measurementData: any) => {
                console.log('Get measurement data result: ', measurementData);

                this.timeseriesChart = new Chart({
                    chart: {
                        type: 'line',
                        zoomType: 'x'
                    },
                    title: {
                        text: 'Zeitreihen'
                    },
                    xAxis: {
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: 'Spannung in V / Strom in A'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        shared: true,
                        crosshairs: true,
                        valueDecimals: 3
                    },
                    series: measurementData.value
                });
            },
            error => {
                console.log(`There was an issue. ${error._body}.`);

                this.toastyService.error(
                    <ToastOptions>{
                        title: 'Error!',
                        msg: 'Messdaten konnten nicht geladen werden!',
                        showClose: true,
                        timeout: 15000
                    }
                );
            });
    }

    plotLocus(measurement: Measurement) {
        this.measurementService.getLocus(measurement.id)
            .subscribe((measurementData: any) => {
                console.log('Get measurement data result: ', measurementData);

                this.locusChart = new Chart({
                    chart: {
                        type: 'spline',
                        zoomType: 'x'
                    },
                    title: {
                        text: measurement.name
                    },
                    xAxis: {
                        title: {
                            text: 'Realteil in m\u03A9'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Imaginärteil in m\u03A9'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        formatter: function () {
                            return 'Frequenz: <b>' + this.point.frequency + ' Hz</b>'
                                + '<br />Realteil: <b>' + this.point.x.toFixed(3) + ' m\u03A9</b>'
                                + '<br />Imaginärteil: <b>' + this.point.y.toFixed(3) + ' m\u03A9</b>'
                                + '<br />Impedanz: <b>' + Math.sqrt(Math.pow(this.point.y, 2) + Math.pow(this.point.y, 2)).toFixed(3) + ' m\u03A9</b>';
                        }
                    },
                    series: measurementData.value
                });
            },
            error => {
                console.log(`There was an issue. ${error._body}.`);

                this.toastyService.error(
                    <ToastOptions>{
                        title: 'Error!',
                        msg: 'Messdaten konnten nicht geladen werden!',
                        showClose: true,
                        timeout: 15000
                    }
                );
            });
    }
}
