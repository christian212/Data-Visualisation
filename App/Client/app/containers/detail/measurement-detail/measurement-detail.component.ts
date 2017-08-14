import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { Chart } from 'angular-highcharts';

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
}
