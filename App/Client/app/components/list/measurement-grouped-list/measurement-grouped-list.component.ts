import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';
import { PaginationInstance } from '../../../../../node_modules/ngx-pagination/dist/ngx-pagination.module';

import { TimeSeriesChartComponent } from './../../../components/chart/timeseries-chart/timeseries-chart.component';
import { LocusChartComponent } from './../../../components/chart/locus-chart/locus-chart.component';
import { Measurement, MeasurementType } from './../../../models/Measurement';
import { MeasurementService } from '../../../services/measurement.service';

@Component({
    selector: 'measurement-grouped-list',
    templateUrl: './measurement-grouped-list.component.html',
    styleUrls: ['./measurement-grouped-list.component.css']
})
export class MeasurementGroupedListComponent {
    @Input() measurements: Measurement[] = [];

    selectedMeasurement: Measurement;

    get undefinedMeasurements(): Measurement[] {
        return this.measurements.filter(
            measurement => measurement.measurementType === 0);
    }
    get timeseriesMeasurements(): Measurement[] {
        return this.measurements.filter(
            measurement => measurement.measurementType === 1);
    }
    get locusMeasurements(): Measurement[] {
        return this.measurements.filter(
            measurement => measurement.measurementType === 2);
    }
    get otherMeasurements(): Measurement[] {
        return this.measurements.filter(
            measurement => measurement.measurementType === 3);
    }

    public MeasurementType = MeasurementType;

    itemsPerPage: number = 10;

    public configTimeseries: PaginationInstance = {
        id: 'timeseries',
        itemsPerPage: this.itemsPerPage,
        currentPage: 1
    };

    public configLocus: PaginationInstance = {
        id: 'locus',
        itemsPerPage: this.itemsPerPage,
        currentPage: 1
    };

    @ViewChild(TimeSeriesChartComponent)
    private timeSeriesChartComponent: TimeSeriesChartComponent;
    @ViewChild(LocusChartComponent)
    private locusChartComponent: LocusChartComponent;

    constructor(
        private measurementService: MeasurementService,
        private toastyService: ToastyService,
        private router: Router) {
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
                let position = this.measurements.indexOf(measurement);
                this.measurements.splice(position, 1);

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
        this.timeSeriesChartComponent.createChart(measurement);
    }

    plotLocus(measurement: Measurement) {
        this.locusChartComponent.createChart(measurement);
    }
}
