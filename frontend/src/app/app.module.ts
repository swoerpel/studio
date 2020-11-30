import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { StudioComponent } from './components/studio/studio.component';
import { MapConfigComponent } from './components/map-config/map-config.component';
import { ColorConfigComponent } from './components/color-config/color-config.component';
import { MapLocationComponent } from './components/map-location/map-location.component';
import { MapTextComponent } from './components/map-text/map-text.component';
import { MapColorPalettesComponent } from './components/map-color-palettes/map-color-palettes.component';
import { MapColorAssignmentComponent } from './components/map-color-assignment/map-color-assignment.component';
import { HeaderComponent } from './components/header/header.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    StudioComponent,
    MapConfigComponent,
    ColorConfigComponent,
    MapLocationComponent,
    MapTextComponent,
    MapColorPalettesComponent,
    MapColorAssignmentComponent,
    HeaderComponent,
    DrawerComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}, {}),
    MaterialModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
