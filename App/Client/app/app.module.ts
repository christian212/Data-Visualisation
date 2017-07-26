import { NgModule, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
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
import { PlotComponent } from './containers/plot/plot.component';
import { StackListComponent } from './components/list/stack-list/stack-list.component';
import { StackDetailComponent } from './containers/detail/stack-detail/stack-detail.component';
import { StackEditComponent } from './containers/edit/stack-edit/stack-edit.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';

import { ListDirective } from './directives/list.directive';
import { ListService } from './services/list.service';
import { StackService } from './services/stack.service';
import { FileUploadModule } from 'ng2-file-upload';
import { ToastyModule } from 'ng2-toasty';

import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MarkdownToHtmlModule } from 'ng2-markdown-to-html';
import { ChartModule } from 'angular-highcharts';

export function createTranslateLoader(http: Http, baseHref) {
    // Temporary Azure hack
    if (baseHref === null && typeof window !== 'undefined') {
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
        PlotComponent,
        StackListComponent,
        StackDetailComponent,
        StackEditComponent,
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
        RouterModule.forRoot([
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
                path: '**',
                component: NotFoundComponent,
                data: { title: 'Error' }
            }
        ]),

        NgxPaginationModule,
        Ng2SearchPipeModule,
        MarkdownToHtmlModule.forRoot(),
        FileUploadModule,
        ChartModule,
        ToastyModule.forRoot()
    ],
    providers: [
        ConnectionResolver,
        TranslateModule,

        LinkService,
        StackService,
        ListService
    ],
    entryComponents: [StackListComponent, NotFoundComponent]
})
export class AppModule {

}
