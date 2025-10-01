import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ReactiveFormsModule jest kluczowy dla ustawień
import { RouterModule } from '@angular/router'; // RouterModule jest kluczowy dla routingu

// Angular Material Modules (zaimportowane indywidualnie dla pewności)
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card'; 
import { MatRadioModule } from '@angular/material/radio'; 
import { MatSidenavModule } from '@angular/material/sidenav'; // Dodano dla pełnej kompatybilności

import {
  MaterialModule,
  CloudAppEventsService,
  CloudAppConfigService,
  CloudAppRestService,
  AlertService,
  CloudAppStoreService,
  CloudAppSettingsService,
  AlertModule // Zapewnia cloudapp-alert
} from '@exlibris/exl-cloudapp-angular-lib';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    
    // Forms and Routing
    FormsModule, 
    ReactiveFormsModule, // Kluczowy dla [formGroup] w ustawieniach
    RouterModule, 
    AppRoutingModule,
    
    // Angular Material Modules
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    DragDropModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatCardModule,
    MatRadioModule,
    MatSidenavModule,

    // Ex Libris Library Modules
    MaterialModule, 
    AlertModule
  ],
  providers: [
    CloudAppEventsService,
    CloudAppConfigService,
    CloudAppRestService,
    AlertService,
    CloudAppStoreService,
    CloudAppSettingsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }