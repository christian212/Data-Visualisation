import { Component, OnInit, Input, Output, EventEmitter, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from '../../../../../node_modules/ngx-pagination/dist/ngx-pagination.module';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { ListComponent } from '../../list/list.component';
import { MeasurementService } from '../../../services/measurement.service';
import { Measurement } from '../../../models/Measurement';

enum MeasurementType {
    Undefined,
    Zeitreihe,
    Ortskurve,
    Sonstige
}

@Component({
    selector: 'measurement-list',
    templateUrl: './measurement-list.component.html',
    styleUrls: ['./measurement-list.component.css']
})
export class MeasurementListComponent implements ListComponent, OnInit {

    @Input() searchTerm: string;
    @Output() countUpdated = new EventEmitter();

    measurements: Measurement[];
    selectedMeasurement: Measurement;
    count: number = 0;

    public MeasurementType = MeasurementType;

    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 8,
        currentPage: 1
    };

    constructor(
        private measurementService: MeasurementService,
        private toastyService: ToastyService,
        private router: Router) { }

    ngOnInit() {
        this.measurementService.getMeasurements().subscribe(result => {
            console.log('Get measurement result: ', result);
            console.log('TransferHttp [GET] /api/measurements/allresult', result);
            this.measurements = result as Measurement[];
            this.count = result.length;
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: 'Messungen konnten nicht geladen werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    add() {
        let newMeasurementName: string = 'Neue Messung';
        this.measurementService.addMeasurement(newMeasurementName).subscribe(result => {
            console.log('Post user result: ', result);
            if (result.ok) {
                this.measurements.unshift(result.json());
                this.count = this.count + 1;
                this.countUpdated.emit(this.count);

                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Hinzufügen erfolgreich!',
                        msg: 'Ein neue Messung wurde erfolgreich hinzugefügt!',
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
                    msg: 'Es konnte keine neue Messung hinzugefügt werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    details(id: number) {
        this.router.navigate(['/measurement/details/', id]);
    }

    edit(id: number) {
        this.router.navigate(['/measurement/edit/', id]);
    }

    select(measurement: Measurement) {
        this.selectedMeasurement = measurement;
    }

    delete() {
        let measurement = this.selectedMeasurement;

        this.measurementService.deleteMeasurement(measurement).subscribe(result => {
            console.log('Delete measurement result: ', result);
            if (result.ok) {
                let position = this.measurements.indexOf(measurement);
                this.measurements.splice(position, 1);
                this.count = this.count - 1;
                this.countUpdated.emit(this.count);

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
}
