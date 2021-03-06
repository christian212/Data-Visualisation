﻿import { NgModule, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpModule, Http, XHRBackend } from '@angular/http';
import { AuthenticateXHRBackend } from './authenticate-xhr.backend';
import { FormsModule } from '@angular/forms';

import { Ng2BootstrapModule } from 'ngx-bootstrap';

// i18n support
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LinkService } from './shared/link.service';
import { ConnectionResolver } from './shared/route.resolver';
import { ORIGIN_URL } from './shared/constants/baseurl.constants';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './containers/home/home.component';
import { DatabaseComponent } from './containers/database/database.component';
import { UploadComponent } from './containers/upload/upload.component';
import { TimeSeriesChartComponent } from './components/chart/timeseries-chart/timeseries-chart.component';
import { LocusChartComponent } from './components/chart/locus-chart/locus-chart.component';
import { BatteryListComponent } from './components/list/battery-list/battery-list.component';
import { StackListComponent } from './components/list/stack-list/stack-list.component';
import { CellListComponent } from './components/list/cell-list/cell-list.component';
import { MeasurementListComponent } from './components/list/measurement-list/measurement-list.component';
import { MeasurementGroupedListComponent } from './components/list/measurement-grouped-list/measurement-grouped-list.component';
import { BatteryDetailComponent } from './containers/detail/battery-detail/battery-detail.component';
import { StackDetailComponent } from './containers/detail/stack-detail/stack-detail.component';
import { CellDetailComponent } from './containers/detail/cell-detail/cell-detail.component';
import { MeasurementDetailComponent } from './containers/detail/measurement-detail/measurement-detail.component';
import { BatteryEditComponent } from './containers/edit/battery-edit/battery-edit.component';
import { StackEditComponent } from './containers/edit/stack-edit/stack-edit.component';
import { CellEditComponent } from './containers/edit/cell-edit/cell-edit.component';
import { MeasurementEditComponent } from './containers/edit/measurement-edit/measurement-edit.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';

import { ListDirective } from './directives/list.directive';
import { ListService } from './services/list.service';
import { BatteryService } from './services/battery.service';
import { StackService } from './services/stack.service';
import { CellService } from './services/cell.service';
import { MeasurementService } from './services/measurement.service';
import { FileService } from './services/file.service';

import { FileUploadModule } from 'ng2-file-upload';
import { ToastyModule } from 'ng2-toasty';
import { GoTopButtonModule } from 'ng2-go-top-button';

import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MarkdownToHtmlModule } from 'ng2-markdown-to-html';
import { ChartModule } from 'angular-highcharts';

import { routing } from './app.routing';

import { AccountModule } from './account/account.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { ConfigService } from './shared/utils/config.service';

export function createTranslateLoader(http: Http, baseHref) {
    // Temporary Azure hack
    if (baseHref === undefined && typeof window !== 'undefined') {
        baseHref = window.location.origin;
    }
    // i18n files are in `wwwroot/assets/`
    return new TranslateHttpLoader(http, `${baseHref}/assets/i18n/`, '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        NavBarComponent,
        DatabaseComponent,
        UploadComponent,
        TimeSeriesChartComponent,
        LocusChartComponent,
        BatteryListComponent,
        StackListComponent,
        CellListComponent,
        MeasurementListComponent,
        MeasurementGroupedListComponent,
        BatteryDetailComponent,
        StackDetailComponent,
        CellDetailComponent,
        MeasurementDetailComponent,
        BatteryEditComponent,
        StackEditComponent,
        CellEditComponent,
        MeasurementEditComponent,
        HomeComponent,
        NotFoundComponent,

        ListDirective
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        Ng2BootstrapModule.forRoot(), // You could also split this up if you don't want the Entire Module imported

        TransferHttpModule, // Our Http TransferData method

        // i18n support
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http, [ORIGIN_URL]]
            }
        }),

        // App Routing
        routing,

        NgxPaginationModule,
        Ng2SearchPipeModule,
        MarkdownToHtmlModule.forRoot(),
        FileUploadModule,
        ChartModule,
        ToastyModule.forRoot(),
        GoTopButtonModule,
        AccountModule,
        DashboardModule
    ],
    providers: [
        ConnectionResolver,
        TranslateModule,

        LinkService,
        BatteryService,
        StackService,
        CellService,
        MeasurementService,
        FileService,
        ListService,

        ConfigService, {
            provide: XHRBackend,
            useClass: AuthenticateXHRBackend
        }
    ],
    entryComponents: [
        BatteryListComponent,
        StackListComponent,
        CellListComponent,
        MeasurementListComponent,
        NotFoundComponent]
})

export class AppModule { }
