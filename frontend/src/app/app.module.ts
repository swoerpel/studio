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

import { mapReducer } from './state/map/map.reducer';
import { textReducer } from './state/text/text.reducer';
import { locationReducer } from './state/location/location.reducer';
import { colorReducer } from './state/color/color.reducer';

import { MapEffects } from './state/map/map.effects';
import { TextEffects } from './state/text/text.effects';
import { LocationEffects } from './state/location/location.effects';
import { ColorEffects } from './state/color/color.effects';

import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core';
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
      map: mapReducer,
      text: textReducer,
      location: locationReducer,
      color: colorReducer,
      router: routerReducer
    }, {}),
    EffectsModule.forRoot([
      MapEffects,
      TextEffects,
      LocationEffects,
      ColorEffects,
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
  providers: [GoogleMapsAPIWrapper ,MarkerManager],

  bootstrap: [AppComponent]
})
export class AppModule { }
