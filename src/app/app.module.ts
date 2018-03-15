import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'hammerjs';
import { AppComponent } from './app.component';
import { LoginComponent } from 'app/login/login.component';
import { AppConfiguration } from 'app/app.configuration';
import { RapportComponent } from 'app/rapport/rapport.component';
import { ProfilComponent } from 'app/profil/profil.component';
import { LogService } from 'app/log/log.service';

import {
  PxRestApiModule,
  PxConfiguration,
  PxRapportService,
  PxMitarbeiterService,
  PxAuftragService,
  PxPositionsartService,
  PxLoginService,
  PxHttpService,
  PxConnectionSettingsService,
  PxLocalStorageService
} from '@proffix/restapi-angular-library';
import { AppRoutingModule } from './app.routing';

/* Angular Material START */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatMenuModule,
  MatSidenavModule,
  MatCardModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatFormFieldControl,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatTableModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
} from '@angular/material';
import { AuthGuard } from 'app/auth.guard';
import { DateFormatPipe } from 'app/rapport/date.pipe';
/* Angular Material ENDE */

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfilComponent,
    RapportComponent,
    DateFormatPipe
  ],
  imports: [
    BrowserModule,
    PxRestApiModule.forRoot(),
    /* Angular Material START */
    BrowserAnimationsModule,
    MatMenuModule,
    MatSidenavModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
    /* Angular Material ENDE */
  ],
  providers: [
    AppConfiguration,
    {provide: PxConfiguration, useExisting: AppConfiguration},
    LogService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
