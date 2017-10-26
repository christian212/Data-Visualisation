import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './containers/home/home.component';
import { DatabaseComponent } from './containers/database/database.component';
import { UploadComponent } from './containers/upload/upload.component';
import { PlotComponent } from './containers/plot/plot.component';
import { BatteryDetailComponent } from './containers/detail/battery-detail/battery-detail.component';
import { BatteryEditComponent } from './containers/edit/battery-edit/battery-edit.component';
import { StackDetailComponent } from './containers/detail/stack-detail/stack-detail.component';
import { StackEditComponent } from './containers/edit/stack-edit/stack-edit.component';
import { CellDetailComponent } from './containers/detail/cell-detail/cell-detail.component';
import { CellEditComponent } from './containers/edit/cell-edit/cell-edit.component';
import { MeasurementDetailComponent } from './containers/detail/measurement-detail/measurement-detail.component';
import { MeasurementEditComponent } from './containers/edit/measurement-edit/measurement-edit.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';

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
    data: { title: 'Datenbank' }
},
{
    path: 'database/:category',
    component: DatabaseComponent,
    data: { title: 'Datenbank' }
},
{
    path: 'upload',
    component: UploadComponent,
    data: { title: 'Upload' }
},
{
    path: 'plot',
    component: PlotComponent,
    data: { title: 'Plot' }
},
{
    path: 'battery/details/:id',
    component: BatteryDetailComponent,
    data: { title: 'System Details' }
},
{
    path: 'battery/edit/:id',
    component: BatteryEditComponent,
    data: { title: 'System Bearbeiten' }
},
{
    path: 'stack/details/:id',
    component: StackDetailComponent,
    data: { title: 'Stack Details' }
},
{
    path: 'stack/edit/:id',
    component: StackEditComponent,
    data: { title: 'Stack Bearbeiten' }
},
{
    path: 'cell/details/:id',
    component: CellDetailComponent,
    data: { title: 'Zellen Details' }
},
{
    path: 'cell/edit/:id',
    component: CellEditComponent,
    data: { title: 'Zelle Bearbeiten' }
},
{
    path: 'measurement/details/:id',
    component: MeasurementDetailComponent,
    data: { title: 'Messungs Details' }
},
{
    path: 'measurement/edit/:id',
    component: MeasurementEditComponent,
    data: { title: 'Messung Bearbeiten' }
},
{
    path: '**',
    component: NotFoundComponent,
    data: { title: 'Error' }
},
  { path: 'account', loadChildren: 'app/account/account.module#AccountModule' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);