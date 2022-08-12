import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullData } from './Components/Detailed Data Cards/FullData.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { SatDetailLayoutComponent } from './sat-detail-layout/sat-detail-layout.component';
import { FullyDetailCardsComponent } from './Components/fully-detail-cards/fully-detail-cards.component';
import { AccordionCategoryComponent } from './Components/accordion-category/accordion-category.component';
import { SystemAccodionComponent } from './Components/system-accodion/system-accodion.component';
import { EditCriteriaLayoutComponent } from './edit-criteria-layout/edit-criteria-layout.component';
import { ManualUpdateLayoutComponent } from './manual-update-layout/manual-update-layout.component';
import { ManualOverrideComponent } from './edit-criteria-layout/manual-override/manual-override.component';


@NgModule({
  declarations: [
    AppComponent,
    FullData,
    HomeLayoutComponent,
    SatDetailLayoutComponent,
    FullyDetailCardsComponent,
    AccordionCategoryComponent,
    SystemAccodionComponent,
    EditCriteriaLayoutComponent,
    ManualUpdateLayoutComponent,
    ManualOverrideComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
