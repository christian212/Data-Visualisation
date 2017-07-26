import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { Measurement } from '../../../models/Measurement';
import { MeasurementService } from '../../../services/measurement.service';

enum MeasurementType {
    Undefined,
    Zeitreihe,
    Ortskurve,
    Sonstige
}

@Component({
    selector: 'measurement-detail',
    templateUrl: './measurement-detail.component.html'
})

export class MeasurementDetailComponent implements OnInit {
    measurement: Measurement;

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

                this.router.navigate(['/database/']);
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

    plotMeasurement() {

    }

}
