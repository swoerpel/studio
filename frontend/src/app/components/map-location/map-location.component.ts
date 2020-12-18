import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { tap, takeUntil, map } from 'rxjs/operators';
import { MAP_LOCATION_BOUNDARY_SIZE, MAP_TEXT_BOUNDARY_SIZE } from 'src/app/shared/constants';
import { LocationState } from 'src/app/state/location/location.reducer';
import { LocationActions } from 'src/app/state/location/actions';
import { LocationSelectors } from 'src/app/state/location/selectors';
import { MapSelectors } from 'src/app/state/map/selectors';
import { MapState } from 'src/app/state/map/map.reducer';
import { FormControl, FormGroup } from '@angular/forms';
import { LatLng } from 'src/app/shared/models';
import { formatLatLngText } from 'src/app/shared/helpers';
import { head, last } from 'lodash';
enum Tab{
  Markers,
  Routes
}

@Component({
  selector: 'app-map-location',
  templateUrl: './map-location.component.html',
  styleUrls: ['./map-location.component.scss']
})
export class MapLocationComponent implements OnInit {

  @ViewChild('mapBoundary') mapBoundaryRef: ElementRef;

  public Tab = Tab;

  public activeTab: Tab = Tab.Markers; 

  public styles = {};

  public lat = 43.0731;
  public lng = -89.4012;
  public zoom = 14;

  public centerFormGroup = new FormGroup({
    lat: new FormControl(),
    lng: new FormControl(),
  })

  public zoomFormControl = new FormControl();


  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private mapStore: Store<MapState>,
    private locationStore: Store<LocationState>,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.locationStore.select(LocationSelectors.GetCenter).pipe(
      map((latLng: LatLng) => formatLatLngText(latLng.lat,latLng.lng)),
      map((t) => ({lat:head(t),lng:last(t)})),
      tap((latLng) => this.centerFormGroup.patchValue(latLng)),
      takeUntil(this.unsubscribe)
    ).subscribe();
    this.locationStore.select(LocationSelectors.GetZoom).pipe(
      tap((zoom: number)=> this.zoomFormControl.patchValue(zoom)),
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  ngAfterViewInit(){
    this.mapStore.select(MapSelectors.GetMapDisplaySize).pipe(
      tap((ratio)=>{
        if(!document.querySelector('boundary-div')){
          let boundaryContainerRef = this.elementRef.nativeElement.querySelector('div.column.column__map.column__map--display');
          let boundaryContainer = boundaryContainerRef?.getBoundingClientRect();
          let newWidth = boundaryContainer.width * MAP_LOCATION_BOUNDARY_SIZE;
          let newHeight = newWidth * ratio;
          if(newHeight > boundaryContainer.height){
            newHeight = boundaryContainer.height * MAP_LOCATION_BOUNDARY_SIZE;
            newWidth = newHeight * (1 / ratio);
          }
          let newDiv = document.createElement('div');
          newDiv.className = 'chet';
          newDiv.style.position = 'absolute';
          newDiv.style.top = `${(boundaryContainer.height - newHeight) / 2}`;
          newDiv.style.left = `${(boundaryContainer.width - newWidth) / 2}px`;
          newDiv.style.width = `${newWidth}px`;
          newDiv.style.height = `${newHeight}px`;
          newDiv.style.outline = 'dotted black 2px';
          newDiv.style['pointer-events'] = 'none';
          newDiv.style['background-color'] = 'transparent';
          newDiv.style['z-index'] = '1000';
          let container = document.querySelector('div.column.column__map.column__map--display')
          container.append(newDiv);
        }
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  ngOnDestroy(){
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

  searchPlace(place){
    console.log("place",place)
  }

  centerChange(center: LatLng){
    this.locationStore.dispatch(LocationActions.SetCenter({center}))
  }

  zoomChange(zoom: number){
    console.log("zoom",zoom)
    this.locationStore.dispatch(LocationActions.SetZoom({zoom}))
  }

  boundsChange(bounds){

  }

}
