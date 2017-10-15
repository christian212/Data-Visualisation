import { Component, Input } from '@angular/core';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { Highcharts } from 'angular-highcharts';

import { Measurement } from './../../../models/Measurement';
import { MeasurementService } from '../../../services/measurement.service';

@Component({
    selector: 'timeseries-chart',
    templateUrl: './timeseries-chart.component.html'
})

export class TimeSeriesChartComponent {
    chart: Highcharts.Chart;
    measurement: Measurement;
    measurementData: any;

    constructor(
        private measurementService: MeasurementService,
        private toastyService: ToastyService) {
    }

    createChart(measurement: Measurement) {
        this.measurement = measurement;

        this.measurementService.getTimeSeries(measurement.id, 0, 0)
            .subscribe((measurementData: any) => {
                console.log('Get measurement data result: ', measurementData);
                this.measurementData = measurementData.value;

                console.log(`Rendering chart`);

                this.chart = new Highcharts.Chart('chart', {
                    chart: {
                        type: 'spline',
                        zoomType: 'x'
                    },
                    title: {
                        text: 'Zeitreihen'
                    },
                    xAxis: {
                        type: 'datetime',
                        events: {
                            afterSetExtremes: this.afterSetExtremes.bind(this)
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Spannung in V / Strom in A / Ladung in As'
                        }
                    },
                    scrollbar: {
                        liveRedraw: false
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        shared: true,
                        crosshairs: true,
                        valueDecimals: 3
                    },
                    series: this.measurementData
                });

                let extremes = this.chart.xAxis[0].getExtremes();

                this.chart.zoomOut = function () {
                    this.chart.xAxis[0].setExtremes(extremes.min, extremes.max);
                }.bind(this);
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

    // Load new data depending on the selected min and max
    afterSetExtremes(extremes) {
        console.log(`Loading data async`);
        this.chart.showLoading('Loading data from server...');

        console.log(`Lower bound: ` + extremes.min + ', upper bound: ' + extremes.max);

        this.measurementService.getTimeSeries(this.measurement.id, extremes.min, extremes.max)
            .subscribe((measurementData: any) => {
                console.log('Get measurement data result: ', measurementData);
                this.measurementData = measurementData.value;

                for (var index = 0; index < this.measurementData.length; index++) {
                    this.chart.series[index].setData(this.measurementData[index].data);
                }

                this.chart.hideLoading();
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
