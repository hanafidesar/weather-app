import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppApi } from '../app.api'; // global variables

// style
import {MatCardModule} from '@angular/material/card';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatCardModule,
    AgmCoreModule.forRoot({
      apiKey: AppApi.API_KEY_GOOGLE_MAP,
      libraries: ['places']
    }),
    BrowserAnimationsModule
  ],
  exports: [ MatCardModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
