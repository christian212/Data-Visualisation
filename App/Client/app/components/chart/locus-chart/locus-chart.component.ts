import { Component, Input } from '@angular/core';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { Chart } from 'angular-highcharts';

import { Measurement } from './../../../models/Measurement';
import { MeasurementService } from '../../../services/measurement.service';

@Component({
    selector: 'locus-chart',
    templateUrl: './locus-chart.component.html'
})

export class LocusChartComponent {
    chart: Chart;

    constructor(
        private measurementService: MeasurementService,
        private toastyService: ToastyService) {
    }

    createChart(measurement: Measurement) {
        this.measurementService.getLocus(measurement.id)
            .subscribe((measurementData: any) => {
                console.log('Get measurement data result: ', measurementData);

                if (this.chart === undefined) {
                    this.chart = new Chart({
                        chart: {
                            type: 'spline',
                            zoomType: 'x'
                        },
                        title: {
                            text: 'Ortskurven'
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
                    this.chart.addSerie(measurementData.value[0]);
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
}
