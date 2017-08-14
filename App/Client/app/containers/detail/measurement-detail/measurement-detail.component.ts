import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { Chart } from 'angular-highcharts';

import { Measurement, MeasurementType } from '../../../models/Measurement';
import { MeasurementService } from '../../../services/measurement.service';

@Component({
    selector: 'measurement-detail',
    templateUrl: './measurement-detail.component.html'
})

export class MeasurementDetailComponent implements OnInit {
    measurement: Measurement;

    measurementData: any;

    chart: Chart;

    public MeasurementType = MeasurementType;

    constructor(
        private measurementService: MeasurementService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.measurementService.getMeasurement(+params['id']))
            .subscribe((measurement: Measurement) => {
                this.measurement = measurement;

                if (this.measurement.measurementType === MeasurementType.Zeitreihe) {
                    this.route.params
                        .switchMap((params: Params) => this.measurementService.getTimeSeries(+params['id']))
                        .subscribe((measurementData: any) => {
                            console.log('Get measurement data result: ', measurementData);
                            this.measurementData = measurementData.value;
                            this.plotMeasurementData('Messdaten vom Server', measurementData.value);
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
                } else if (this.measurement.measurementType === MeasurementType.Ortskurve) {
                    this.route.params
                        .switchMap((params: Params) => this.measurementService.getLocus(+params['id']))
                        .subscribe((measurementData: any) => {
                            console.log('Get measurement data result: ', measurementData);
                            this.measurementData = measurementData.value;
                            this.plotMeasurementData('Messdaten vom Server', measurementData.value);
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
            },
            error => {
                console.log(`There was an issue. ${error._body}.`);

                this.toastyService.error(
                    <ToastOptions>{
                        title: 'Error!',
                        msg: 'Measurement existiert nicht oder konnten nicht geladen werden!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 3]);
            });
    }

    editMeasurement(id: number) {
        this.router.navigate(['/measurement/edit/', id]);
    }

    deleteMeasurement() {
        this.measurementService.deleteMeasurement(this.measurement).subscribe(result => {
            console.log('Delete measurement result: ', result);
            if (result.ok) {
                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Löschen erfolgreich!',
                        msg: this.measurement.name + ' wurde erfolgreich gelöscht!',
                        showClose: true,
                        timeout: 15000
                    }
                );

                this.router.navigate(['/database/', 3]);
            }
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: this.measurement.name + ' konnte nicht gelöscht werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    plotMeasurementData(legendName: string, data: any) {
        if (this.measurement.measurementType === MeasurementType.Zeitreihe) {
            this.chart = new Chart({
                chart: {
                    type: 'line',
                    zoomType: 'x'
                },
                title: {
                    text: this.measurement.name
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
                series: data
            });
        } else if (this.measurement.measurementType === MeasurementType.Ortskurve) {
            this.chart = new Chart({
                chart: {
                    type: 'spline',
                    zoomType: 'x'
                },
                title: {
                    text: this.measurement.name
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
                series: data
            });
        }

    }

}
