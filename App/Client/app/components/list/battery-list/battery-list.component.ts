import { Component, OnInit, Input, Output, EventEmitter, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationInstance } from '../../../../../node_modules/ngx-pagination/dist/ngx-pagination.module';
import { ToastyService, ToastOptions } from 'ng2-toasty';

import { ListComponent } from '../../list/list.component';
import { BatteryService } from '../../../services/battery.service';
import { Battery } from '../../../models/Battery';

import { AuthGuard } from '../../../auth.guard';

enum CircuitType {
    Undefined = 0,
    Reihenschaltung,
    Parallelschaltung,
    Sonstige
}

@Component({
    selector: 'battery-list',
    templateUrl: './battery-list.component.html',
    styleUrls: ['./battery-list.component.css']
})
export class BatteryListComponent implements ListComponent, OnInit {

    @Input() searchTerm: string;
    @Output() countUpdated = new EventEmitter();

    batteries: Battery[] = [];
    selectedBattery: Battery;
    count: number = 0;

    public CircuitType = CircuitType;

    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 2,
        currentPage: 1
    };

    constructor(
        private batteryService: BatteryService,
        private toastyService: ToastyService,
        private router: Router) { }

    ngOnInit() {
        this.batteryService.getBatteries().subscribe(result => {
            console.log('Get battery result: ', result);
            console.log('TransferHttp [GET] /api/batteries/allresult', result);
            this.batteries = result as Battery[];
            this.count = result.length;
        }, error => {
            console.log(`There was an issue. ${error._body}.`);

            this.toastyService.error(
                <ToastOptions>{
                    title: 'Error!',
                    msg: 'Systeme konnten nicht geladen werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    add() {
        let newBatteryName: string = 'Neues System';
        this.batteryService.addBattery(newBatteryName).subscribe(result => {
            console.log('Post user result: ', result);
            if (result.ok) {
                this.batteries.unshift(result.json());
                this.count = this.count + 1;
                this.countUpdated.emit(this.count);

                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Hinzufügen erfolgreich!',
                        msg: 'Ein neues System wurde erfolgreich hinzugefügt!',
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
                    msg: 'Es konnte kein neues System hinzugefügt werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }

    details(id: number) {
        this.router.navigate(['/battery/details/', id]);
    }

    edit(id: number) {
        this.router.navigate(['/battery/edit/', id]);
    }

    select(battery: Battery) {
        this.selectedBattery = battery;
    }

    delete() {
        let battery = this.selectedBattery;

        this.batteryService.deleteBattery(battery).subscribe(result => {
            console.log('Delete battery result: ', result);
            if (result.ok) {
                let position = this.batteries.indexOf(battery);
                this.batteries.splice(position, 1);
                this.count = this.count - 1;
                this.countUpdated.emit(this.count);

                this.toastyService.success(
                    <ToastOptions>{
                        title: 'Löschen erfolgreich!',
                        msg: battery.name + ' wurde erfolgreich gelöscht!',
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
                    msg: battery.name + ' konnte nicht gelöscht werden!',
                    showClose: true,
                    timeout: 15000
                }
            );
        });
    }
}
