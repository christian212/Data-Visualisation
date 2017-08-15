import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { Highcharts } from 'angular-highcharts';

import { TimeSeriesChartComponent } from './../../../components/chart/timeseries-chart/timeseries-chart.component';
import { LocusChartComponent } from './../../../components/chart/locus-chart/locus-chart.component';
import { Measurement, MeasurementType } from '../../../models/Measurement';
import { MeasurementService } from '../../../services/measurement.service';

@Component({
    selector: 'measurement-detail',
    templateUrl: './measurement-detail.component.html'
})

export class MeasurementDetailComponent implements OnInit {
    measurement: Measurement;
    rawMeasurementData: any;
    rawDataIndex: number;
    chart: Highcharts.Chart;

    public MeasurementType = MeasurementType;

    @ViewChild(TimeSeriesChartComponent)
    private timeSeriesChartComponent: TimeSeriesChartComponent;
    @ViewChild(LocusChartComponent)
    private locusChartComponent: LocusChartComponent;

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
                console.log('Get measurement result: ', measurement);

                this.measurement = measurement;

                if (this.measurement.measurementType === MeasurementType.Zeitreihe) {
                    this.timeSeriesChartComponent.createChart(this.measurement);
                } else if (this.measurement.measurementType === MeasurementType.Ortskurve) {
                    this.locusChartComponent.createChart(this.measurement);
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

    plotRawMeasurement(index: number) {
        this.rawDataIndex = index;
        this.measurementService.getRawTimeSeries(this.measurement.id, index, 0, 0)
            .subscribe((rawMeasurementData: any) => {
                console.log('Get raw measurement data result: ', rawMeasurementData);
                this.rawMeasurementData = rawMeasurementData.value;

                console.log(`Rendering chart`);

                this.chart = new Highcharts.Chart('rawChart', {
                    chart: {
                        type: 'line',
                        zoomType: 'x'
                    },
                    title: {
                        text: 'Rohdaten'
                    },
                    xAxis: {
                        type: 'datetime',
                        events: {
                            afterSetExtremes: this.afterSetExtremes.bind(this)
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Spannung in V / Strom in A'
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
                    series: rawMeasurementData.value
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

    // Load new data depending on the selected min and max
    afterSetExtremes(extremes) {
        console.log(`Loading data async`);
        this.chart.showLoading('Loading data from server...');

        function removeDigits(x, n) {
            return (x - (x % Math.pow(10, n))) / Math.pow(10, n);
        }

        let lowerBound = removeDigits(Math.ceil(extremes.min), 3) as number;
        let upperBound = removeDigits(Math.floor(extremes.max), 3) as number;

        console.log(`Lower bound: ` + lowerBound + ', upper bound: ' + upperBound);

        this.measurementService.getRawTimeSeries(this.measurement.id, this.rawDataIndex, lowerBound, upperBound)
        .subscribe((rawMeasurementData: any) => {
            console.log('Get raw measurement data result: ', rawMeasurementData);
            this.rawMeasurementData = rawMeasurementData.value;

                this.chart.series[0].setData(this.rawMeasurementData[0].data);
                this.chart.series[1].setData(this.rawMeasurementData[1].data);

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
