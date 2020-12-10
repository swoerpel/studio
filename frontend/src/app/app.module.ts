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


import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StudioEffects } from './state/studio/studio.effects';
import { studioReducer } from './state/studio/studio.reducer';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';

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
    MaterialModule,
    FlexLayoutModule,
    StoreModule.forRoot({
      studio: studioReducer,
      router: routerReducer
    }, {}),
    EffectsModule.forRoot([
      StudioEffects
    ]),
    StoreDevtoolsModule.instrument({
      name: 'ATTC',
      maxAge: 25,
    }),
    StoreRouterConnectingModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBcEArLj7I5WyhLDHT_9krt8DshG5sfqWA',
      libraries: ["places"]
    }),
    MatGoogleMapsAutocompleteModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
