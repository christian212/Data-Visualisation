import { Measurement } from './../../../models/Measurement';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { Chart } from 'angular-highcharts';

import { Cell } from '../../../models/Cell';
import { CellService } from '../../../services/cell.service';
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
    selector: 'cell-detail',
    templateUrl: './cell-detail.component.html',
    styleUrls: ['./cell-detail.component.css']
})

export class CellDetailComponent implements OnInit {
    cell: Cell;

    timeseriesMeasurements: Measurement[];
    locusMeasurements: Measurement[];
    undefinedMeasurements: Measurement[];
    otherMeasurements: Measurement[];

    selectedMeasurement: Measurement;
    measurementCount: number = 0;
    measurementData: any;

    timeseriesChart: Chart;
    locusChart: Chart;

    public CircuitType = CircuitType;
    public MeasurementType = MeasurementType;

    constructor(
        private cellService: CellService,
        private measurementService: MeasurementService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.cellService.getCell(+params['id']))
            .subscribe((cell: Cell) => {
                this.cell = cell;
                this.measurementCount = cell.measurements.length;

                this.undefinedMeasurements = this.cell.measurements.filter(
                    measurement => measurement.measurementType === 0);

                this.timeseriesMeasurements = this.cell.measurements.filter(
                    measurement => measurement.measurementType === 1);

                this.locusMeasurements = this.cell.measurements.filter(
                    measurement => measurement.measurementType === 2);

                this.otherMeasurements = this.cell.measurements.filter(
                    measurement => measurement.measurementType === 3);
            },
            error => {
                console.log(`There was an issue. ${error._body}.`);

                this.toastyService.error(
                    <ToastOptions>{
                        title: 'Error!',
                        msg: 'Zelle existiert nicht oder konnten nicht geladen werden!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 2]);
            });
    }

    editCell(id: number) {
        this.router.navigate(['/cell/edit/', id]);
    }

    deleteCell() {
        this.cellService.deleteCell(this.cell).subscribe(result => {
            console.log('Delete cell result: ', result);
            if (result.ok) {
                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Löschen erfolgreich!',
                        msg: this.cell.name + ' wurde erfolgreich gelöscht!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 2]);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: this.cell.name + ' konnte nicht gelöscht werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    plotCell() {

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
                let position = this.cell.measurements.indexOf(measurement);
                this.cell.measurements.splice(position, 1);
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
                            text: 'Spannung / Strom'
                        }
                    },
                    credits: {
                        enabled: false
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
                this.measurementData = measurementData.value;
                this.locusChart = new Chart({
                    chart: {
                        type: 'spline',
                        zoomType: 'x'
                    },
                    title: {
                        text: 'Ortskurve'
                    },
                    xAxis: {
                        title: {
                            text: 'Realteil'
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Imaginärteil'
                        }
                    },
                    credits: {
                        enabled: false
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
