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
import { StackListComponent } from './components/list/stack-list/stack-list.component';
import { StackDetailComponent } from './containers/detail/stack-detail/stack-detail.component';
import { StackEditComponent } from './containers/edit/stack-edit/stack-edit.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';

import { ListDirective } from './directives/list.directive';
import { ListService } from './services/list.service';
import { StackService } from './services/stack.service';
import { FileUploadModule } from 'ng2-file-upload';

import { BrowserXhr } from '@angular/http';
import { NgProgressModule, NgProgressBrowserXhr } from 'ngx-progressbar';

import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MarkdownToHtmlModule } from 'ng2-markdown-to-html';

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
                path: 'home', component: HomeComponent,

                // *** SEO Magic ***
                // We're using "data" in our Routes to pass in our <title> <meta> <link> tag information
                // Note: This is only happening for ROOT level Routes, you'd have to add some additional logic if you wanted this for Child level routing
                // When you change Routes it will automatically append these to your document for you on the Server-side
                //  - check out app.component.ts to see how it's doing this
                data: {
                    title: 'Home',
                    meta: [{ name: 'description', content: 'This is an example Description Meta tag!' }],
                    links: [
                        { rel: 'canonical', href: 'http://blogs.example.com/blah/nice' },
                        { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/' }
                    ]
                }
            },
            {
                path: 'database', component: DatabaseComponent,
                data: {
                    title: 'Datenbank',
                    meta: [{ name: 'description', content: 'Datenbank' }],
                    links: [
                        { rel: 'canonical', href: 'http://blogs.example.com/counter/something' },
                        { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/counter' }
                    ]
                }
            },
            {
                path: 'upload', component: UploadComponent,
                data: {
                    title: 'Upload',
                    meta: [{ name: 'description', content: 'Upload' }],
                    links: [
                        { rel: 'canonical', href: 'http://blogs.example.com/counter/something' },
                        { rel: 'alternate', hreflang: 'es', href: 'http://es.example.com/counter' }
                    ]
                }
            },
            { path: 'stack/details/:id', component: StackDetailComponent },
            { path: 'stack/edit/:id', component: StackEditComponent }
        ]),

        NgProgressModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
        MarkdownToHtmlModule.forRoot(),
        FileUploadModule
    ],
    providers: [
        ConnectionResolver,
        TranslateModule,

        LinkService,
        StackService,
        ListService,

        // { provide: BrowserXhr, useClass: NgProgressBrowserXhr }
    ],
    entryComponents: [StackListComponent, NotFoundComponent]
})
export class AppModule { 
    
}