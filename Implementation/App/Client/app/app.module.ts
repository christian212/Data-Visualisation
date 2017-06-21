import { NgModule, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { Ng2BootstrapModule } from 'ngx-bootstrap';

// i18n support
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { DropdownSplitComponent } from './components/dropdown-split/dropdown-split.component';
import { HomeComponent } from './containers/home/home.component';
import { DatabaseComponent } from './containers/database/database.component';
import { StacksComponent } from './components/stacks/stacks.component';
import { StackDetailComponent } from './components/stack-detail/stack-detail.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';

import { LinkService } from './shared/link.service';
import { StackService } from './shared/stack.service';
import { ConnectionResolver } from './shared/route.resolver';
import { ORIGIN_URL } from './shared/constants/baseurl.constants';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

import { BrowserXhr } from '@angular/http';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressBrowserXhr } from 'ngx-progressbar';

import { HeroJobAdComponent } from './components/ad/hero-job-ad.component';
import { AdBannerComponent } from './components/ad/ad-banner.component';
import { HeroProfileComponent } from './components/ad/hero-profile.component';
import { AdDirective } from './directives/ad.directive';
import { AdService } from './shared/ad.service';

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
        NavMenuComponent,
        DropdownSplitComponent,
        DatabaseComponent,
        StacksComponent,
        StackDetailComponent,
        HomeComponent,
        NotFoundComponent,

        AdBannerComponent,
        HeroJobAdComponent,
        HeroProfileComponent,
        AdDirective
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        NgProgressModule,
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
                path: 'stacks', component: StacksComponent,
                data: {
                    title: 'Stacks',
                    meta: [{ name: 'description', content: '' }]
                }
            }
        ])
    ],
    providers: [
        LinkService,
        StackService,
        ConnectionResolver,
        TranslateModule,

        AdService
    ],
    entryComponents: [ HeroJobAdComponent, HeroProfileComponent ]
})
export class AppModule {
}