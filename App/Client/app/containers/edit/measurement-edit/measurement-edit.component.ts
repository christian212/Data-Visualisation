import { Location } from '@angular/common';
import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { Measurement } from '../../../models/Measurement';
import { MeasurementService } from '../../../services/measurement.service';

@Component({
    selector: 'measurement-edit',
    templateUrl: './measurement-edit.component.html'
})
export class MeasurementEditComponent implements OnInit {
    measurement: Measurement;

    constructor(
        private measurementService: MeasurementService,
        private toastyService: ToastyService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params
            // (+) converts string 'id' to a number
            .switchMap((params: Params) => this.measurementService.getMeasurement(+params['id']))
            .subscribe((measurement: Measurement) => this.measurement = measurement,
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

                this.router.navigate(['/database/']);
            });
    }

    updateMeasurement(measurement) {
        this.measurementService.updateMeasurement(measurement).subscribe(result => {
            console.log('Put measurement result: ', result);

            this.toastyService.success(
                <ToastOptions>{
                    title: 'Speichern erfolgreich!',
                    msg: measurement.name + ' mit der ID ' + measurement.id + ' wurde erfolgreich gespeichert!',
                    showClose: true,
                    timeout: 15000
                }
            );
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: measurement.name + ' mit der ID ' + measurement.id + ' konnte nicht gespeichert werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    goBack(): void {
        this.location.back();
    }
}
