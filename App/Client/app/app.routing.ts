import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './containers/home/home.component';
import { DatabaseComponent } from './containers/database/database.component';
import { UploadComponent } from './containers/upload/upload.component';
import { BatteryDetailComponent } from './containers/detail/battery-detail/battery-detail.component';
import { BatteryEditComponent } from './containers/edit/battery-edit/battery-edit.component';
import { StackDetailComponent } from './containers/detail/stack-detail/stack-detail.component';
import { StackEditComponent } from './containers/edit/stack-edit/stack-edit.component';
import { CellDetailComponent } from './containers/detail/cell-detail/cell-detail.component';
import { CellEditComponent } from './containers/edit/cell-edit/cell-edit.component';
import { MeasurementDetailComponent } from './containers/detail/measurement-detail/measurement-detail.component';
import { MeasurementEditComponent } from './containers/edit/measurement-edit/measurement-edit.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { AuthGuard } from './auth.guard';
import { BatteryListComponent } from './components/list/battery-list/battery-list.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Home' }
    },
    {
        path: 'database',
        component: DatabaseComponent,
        canActivate: [AuthGuard],
        data: { title: 'Datenbank' }
    },
    {
        path: 'database/:category',
        component: DatabaseComponent,
        canActivate: [AuthGuard],
        data: { title: 'Datenbank' }
    },
    {
        path: 'upload',
        component: UploadComponent,
        canActivate: [AuthGuard],
        data: { title: 'Upload' }
    },
    {
        path: 'battery/details/:id',
        component: BatteryDetailComponent,
        canActivate: [AuthGuard],
        data: { title: 'System Details' }
    },
    {
        path: 'battery/edit/:id',
        component: BatteryEditComponent,
        canActivate: [AuthGuard],
        data: { title: 'System Bearbeiten' }
    },
    {
        path: 'stack/details/:id',
        component: StackDetailComponent,
        canActivate: [AuthGuard],
        data: { title: 'Stack Details' }
    },
    {
        path: 'stack/edit/:id',
        component: StackEditComponent,
        canActivate: [AuthGuard],
        data: { title: 'Stack Bearbeiten' }
    },
    {
        path: 'cell/details/:id',
        component: CellDetailComponent,
        canActivate: [AuthGuard],
        data: { title: 'Zellen Details' }
    },
    {
        path: 'cell/edit/:id',
        component: CellEditComponent,
        canActivate: [AuthGuard],
        data: { title: 'Zelle Bearbeiten' }
    },
    {
        path: 'measurement/details/:id',
        component: MeasurementDetailComponent,
        canActivate: [AuthGuard],
        data: { title: 'Messungs Details' }
    },
    {
        path: 'measurement/edit/:id',
        component: MeasurementEditComponent,
        canActivate: [AuthGuard],
        data: { title: 'Messung Bearbeiten' }
    },
    {
        path: '**',
        component: NotFoundComponent,
        data: { title: 'Error' }
    },
    //{ path: 'account', loadChildren: 'account/account.module#AccountModule' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);