import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { tap, takeUntil, map, withLatestFrom } from 'rxjs/operators';
import { MAP_LOCATION_BOUNDARY_SIZE, MAP_TEXT_BOUNDARY_SIZE } from 'src/app/shared/constants';
import { LocationState } from 'src/app/state/location/location.reducer';
import { LocationActions } from 'src/app/state/location/actions';
import { LocationSelectors } from 'src/app/state/location/selectors';
import { MapSelectors } from 'src/app/state/map/selectors';
import { MapState } from 'src/app/state/map/map.reducer';
import { FormControl, FormGroup } from '@angular/forms';
import { Bounds, Dims, LatLng, Point } from 'src/app/shared/models';
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

    this.locationStore.select(LocationSelectors.AddressUpdated).pipe(
      withLatestFrom(this.locationStore.select(LocationSelectors.GetCenter)),
      map(last),
      tap((center: LatLng)=> {
        this.lat = center.lat;
        this.lng = center.lng;
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  ngAfterViewInit(){
    this.mapStore.select(MapSelectors.GetMapDisplaySize).pipe(
      tap((ratio)=>{
        if(!document.querySelector('boundary-div')){
          let boundaryContainerRef = this.elementRef.nativeElement.querySelector('div.column.column__map.column__map--display');
          let boundaryContainer = boundaryContainerRef?.getBoundingClientRect();
          let width = boundaryContainer.width * MAP_LOCATION_BOUNDARY_SIZE;
          let height = width * ratio;
          if(height > boundaryContainer.height){
            height = boundaryContainer.height * MAP_LOCATION_BOUNDARY_SIZE;
            width = height * (1 / ratio);
          }
          let boundaryCorner: Point = {
            x: (boundaryContainer.height - height) / 2,
            y: (boundaryContainer.width - width) / 2
          }
          let boundaryDims: Dims = {width,height};
          let boundaryDiv: HTMLElement = this.createBoundaryDiv(boundaryCorner,boundaryDims);
          let container = document.querySelector('div.column.column__map.column__map--display')
          container.append(boundaryDiv);
        }
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  ngOnDestroy(){
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

  public searchPlace(place){
    let center: LatLng = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }
    let address = place.formatted_address;
    this.locationStore.dispatch(LocationActions.SetCenter({center}));
    this.locationStore.dispatch(LocationActions.SetAddress({address}));
  }

  centerChange(center: LatLng){
    this.locationStore.dispatch(LocationActions.SetCenter({center}))
  }

  zoomChange(zoom: number){
    this.locationStore.dispatch(LocationActions.SetZoom({zoom}))
  }

  boundsChange(bounds: google.maps.LatLngBounds){
    // This is where I will need to format the bounds so they
    // fit the aspect ratio in the map location component and
    // the home screen
    let croppedBounds: Bounds = this.cropMapBounds(bounds.toJSON())
  }

  private cropMapBounds(bounds: Bounds){
    console.log("bounds.north",bounds.north)
    console.log("bounds.south",bounds.south)
    console.log("bounds.east",bounds.east)
    console.log("bounds.west",bounds.west)
    return {
      ...bounds
    }
  }

  private createBoundaryDiv(corner: Point, dims: Dims): HTMLElement{
    let newDiv = document.createElement('div');
    newDiv.className = 'chet';
    newDiv.style.position = 'absolute';
    newDiv.style.top = `${corner.x}`;
    newDiv.style.left = `${corner.y}px`;
    newDiv.style.width = `${dims.width}px`;
    newDiv.style.height = `${dims.height}px`;
    newDiv.style.outline = 'dotted black 2px';
    newDiv.style['pointer-events'] = 'none';
    newDiv.style['background-color'] = 'transparent';
    newDiv.style['z-index'] = '1000';
    return newDiv;
  }

}
