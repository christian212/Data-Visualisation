import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { Chart } from 'angular-highcharts';

import { Stack } from '../../../models/Stack';
import { Cell } from './../../../models/Cell';
import { Measurement } from './../../../models/Measurement';
import { StackService } from '../../../services/stack.service';
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
    selector: 'stack-detail',
    templateUrl: './stack-detail.component.html',
    styleUrls: ['./stack-detail.component.css']
})

export class StackDetailComponent implements OnInit {
    stack: Stack;
    cells: Cell[] = [];

    timeseriesMeasurements: Measurement[] = [];
    locusMeasurements: Measurement[] = [];
    undefinedMeasurements: Measurement[] = [];
    otherMeasurements: Measurement[] = [];

    selectedCell: Cell;
    selectedMeasurement: Measurement;

    measurementCount: number = 0;
    measurementData: any;

    timeseriesChart: Chart;
    locusChart: Chart;

    public CircuitType = CircuitType;
    public MeasurementType = MeasurementType;

    constructor(
        private stackService: StackService,
        private measurementService: MeasurementService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.stackService.getStack(+params['id']))
            .subscribe((stack: Stack) => {
                this.stack = stack;

                if (stack.stackCells !== null) {

                    let cells: Cell[] = [];

                    stack.stackCells.forEach(stackCell => {
                        cells.push(stackCell.cell);
                    });

                    cells[0].active = true;
                    this.cells = cells;
                }

                this.measurementCount = stack.measurements.length;

                this.undefinedMeasurements = this.stack.measurements.filter(
                    measurement => measurement.measurementType === 0);

                this.timeseriesMeasurements = this.stack.measurements.filter(
                    measurement => measurement.measurementType === 1);

                this.locusMeasurements = this.stack.measurements.filter(
                    measurement => measurement.measurementType === 2);

                this.otherMeasurements = this.stack.measurements.filter(
                    measurement => measurement.measurementType === 3);
            },
            error => {
                console.log(`There was an issue. ${error._body}.`);

                this.toastyService.error(
                    <ToastOptions>{
                        title: 'Error!',
                        msg: 'Stack existiert nicht oder konnten nicht geladen werden!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 1]);
            });
    }

    editStack(id: number) {
        this.router.navigate(['/stack/edit/', id]);
    }

    deleteStack() {
        this.stackService.deleteStack(this.stack).subscribe(result => {
            console.log('Delete stack result: ', result);
            if (result.ok) {
                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Löschen erfolgreich!',
                        msg: this.stack.name + ' wurde erfolgreich gelöscht!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 1]);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: this.stack.name + ' konnte nicht gelöscht werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    addCell() {

    }

    detailsCell(id: number) {
        this.router.navigate(['/cell/details/', id]);
    }

    editCell(id: number) {
        this.router.navigate(['/cell/edit/', id]);
    }

    selectCell(cell: Cell) {
        this.selectedCell = cell;
    }

    deleteCell() {

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
                let position = this.stack.measurements.indexOf(measurement);
                this.stack.measurements.splice(position, 1);
                this.measurementCount = this.measurementCount - 1;

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
                this.measurementData = measurementData.value;

                if (this.timeseriesChart === undefined) {
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
                } else {
                    this.timeseriesChart.addSerie(measurementData.value[0]);
                    this.timeseriesChart.addSerie(measurementData.value[1]);
                }
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
                this.measurementData = measurementData.value;

                if (this.locusChart === undefined) {
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
                } else {
                    this.locusChart.addSerie(measurementData.value[0]);
                }
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

    loadRawData() {

    }
}
