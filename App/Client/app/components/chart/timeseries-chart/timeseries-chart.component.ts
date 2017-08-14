import { Component, Input } from '@angular/core';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { Chart } from 'angular-highcharts';

import { Measurement } from './../../../models/Measurement';
import { MeasurementService } from '../../../services/measurement.service';

@Component({
    selector: 'timeseries-chart',
    templateUrl: './timeseries-chart.component.html'
})

export class TimeSeriesChartComponent {
    chart: Chart;

    constructor(
        private measurementService: MeasurementService,
        private toastyService: ToastyService) {
    }

    createChart(measurement: Measurement) {
        this.measurementService.getTimeSeries(measurement.id)
            .subscribe((measurementData: any) => {
                console.log('Get measurement data result: ', measurementData);

                this.chart = new Chart({
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
}
