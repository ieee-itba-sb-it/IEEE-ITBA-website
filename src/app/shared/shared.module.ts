import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer.component';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MatMenuModule} from '@angular/material/menu';
import {RouterModule, Routes} from '@angular/router';
import {LoadingSpinnerComponent} from './components/loading-spinner/loading-spinner.component';
import {Error401Component} from './components/error401/error401.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { EventCardComponent } from './components/event-card/event-card.component';
import { NewsCardComponent } from './components/news-card/news-card.component';
import {MatCardModule} from '@angular/material/card';
import { SponsorComponentComponent } from './components/sponsor-component/sponsor-component.component';
import {MatTabsModule} from '@angular/material/tabs';
import {CustomMissingTranslationHandler} from './CustomMissingTranslationHandler';
import {IndividualCardComponent} from './components/individual-card/individual-card.component';
import {TeamCardComponent} from './components/team-card/team-card.component';
import {EventCardShortComponent} from './components/event-card-short/event-card-short.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {HttpLoaderFactory} from './translation-helpers';
import { StudentChapterComponent } from './components/student-chapter-card/student-chapter.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { EventTitleComponent } from './components/event-title/event-title.component';
import { EventBannerComponent } from './components/event-banner/event-banner.component';
import { EventContentCardComponent } from './components/event-content-card/event-content-card.component';
import { EventFaqAccordionComponent } from './components/event-faq-accordion/event-faq-accordion.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { EventSectionComponent } from './components/event-section/event-section.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { SwiperModule } from 'swiper/angular';
import { EventFactsBannerComponent } from './components/event-facts-banner/event-facts-banner.component';
import { ButtonComponent } from './components/button/button.component';
import {EventEditorModalComponent} from "./components/event-editor-modal/event-editor-modal.component";
import { EventEditorButtonComponent } from './components/event-editor-button/event-editor-button.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FloatingButtonComponent } from './components/floating-button/floating-button.component';
import { UserEditorModalComponent } from './components/user-editor-modal/user-editor-modal.component';
import { EventDateComponent } from './components/event-date/event-date.component';
import { EventDateSectionComponent } from './components/event-date-section/event-date-section.component';
import { EventDateChipsComponent } from './components/event-date-chips/event-date-chips.component';
import {FormatDateEventPipe} from "./pipes/FormatDateEventPipe";

// TODO: Modify this, ContactPageComponent does not belong here!
const routes: Routes = [];

export const routing = RouterModule.forChild(routes);

@NgModule({
    declarations: [NavbarComponent, FooterComponent, LoadingSpinnerComponent, Error401Component,
        EventCardComponent, NewsCardComponent, SponsorComponentComponent, IndividualCardComponent,
        TeamCardComponent, EventCardShortComponent, StudentChapterComponent, PaginationComponent,
        EventTitleComponent, EventBannerComponent, EventContentCardComponent, EventFaqAccordionComponent,
        EventSectionComponent, ImageCarouselComponent, EventFactsBannerComponent, ButtonComponent,
        EventEditorModalComponent, EventEditorButtonComponent, FloatingButtonComponent, UserEditorModalComponent,
        EventDateComponent, EventDateSectionComponent, EventDateChipsComponent, FormatDateEventPipe],
    imports: [
        routing,
        CommonModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler},
            extend: true
        }),
        FlexLayoutModule,
        MDBBootstrapModule.forRoot(),
        MatMenuModule,
        MatButtonToggleModule,
        MatCardModule,
        MatTabsModule,
        MatChipsModule,
        MatIconModule,
        MatProgressSpinnerModule,
        NgOptimizedImage,
        MatExpansionModule,
        SwiperModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [NavbarComponent, FooterComponent, LoadingSpinnerComponent, Error401Component,
        EventCardComponent, NewsCardComponent, SponsorComponentComponent, IndividualCardComponent,
        TeamCardComponent, EventCardShortComponent, StudentChapterComponent, PaginationComponent,
        EventTitleComponent, EventBannerComponent, EventContentCardComponent, EventFaqAccordionComponent,
        EventSectionComponent, ImageCarouselComponent, EventFactsBannerComponent, ButtonComponent,
        EventEditorButtonComponent, FloatingButtonComponent, EventDateComponent, EventDateSectionComponent,
        EventDateChipsComponent, FormatDateEventPipe],
})
export class SharedModule { }
