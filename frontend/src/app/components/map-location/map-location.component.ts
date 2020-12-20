import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil, map, withLatestFrom, first, skip, debounceTime } from 'rxjs/operators';
import { MAP_LOCATION_BOUNDARY_SIZE, MAP_TEXT_BOUNDARY_SIZE } from 'src/app/shared/constants';
import { LocationState } from 'src/app/state/location/location.reducer';
import { LocationActions } from 'src/app/state/location/actions';
import { LocationSelectors } from 'src/app/state/location/selectors';
import { MapSelectors } from 'src/app/state/map/selectors';
import { MapState } from 'src/app/state/map/map.reducer';
import { FormControl, FormGroup } from '@angular/forms';
import { Bounds, Dims, LatLng, Marker, Point } from 'src/app/shared/models';
import { formatLatLngText } from 'src/app/shared/helpers';
import { head, last } from 'lodash';
import { AgmMap, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core';
import { MapActions } from 'src/app/state/map/actions';
import { MapStylingService } from 'src/app/services/map-styling.service';
enum Tab{
  Markers,
  Routes
}

@Component({
  selector: 'app-map-location',
  templateUrl: './map-location.component.html',
  styleUrls: ['./map-location.component.scss'],
})
export class MapLocationComponent implements OnInit {

  @ViewChild('mapContainer') mapContainer: ElementRef<any>;
  @ViewChild('map') map: AgmMap;

  public boundaryOutlineClassName: string = 'boundary-outline';

  public Tab = Tab;

  public activeTab: Tab = Tab.Markers; 

  public styles = {};

  // public lat;// = 43.0731;
  // public lng;// = -89.4012;
  // public zoom;// = 14;
  public location$: Observable<{center: LatLng, zoom: number}>;

  
  public centerFormGroup = new FormGroup({
    lat: new FormControl(),
    lng: new FormControl(),
  })

  public zoomFormControl = new FormControl();
  public bounds$: Observable<Bounds>;

  public markers: Marker[] = [
    // {
    //     lat: this.lat,
    //     lng: this.lng,
    //     label: 'A',
    //     draggable: true
    // },
  ]


  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private mapStore: Store<MapState>,
    private locationStore: Store<LocationState>,
    private elementRef: ElementRef,
    private mapStylingService: MapStylingService
  ) { }

  ngOnInit(): void {
    this.styles = this.mapStylingService.generateStyles();
    this.bounds$ = this.locationStore.select(LocationSelectors.GetBounds).pipe()
    this.location$ = this.locationStore.select(LocationSelectors.GetLocation).pipe(debounceTime(200));
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
      tap((center: LatLng)=> this.centerChange(center)),
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  ngAfterViewInit(){
    this.mapStore.select(MapSelectors.GetMapDisplaySize).pipe(
      tap((ratio: number)=>{
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



  public markerDragEnd(m: Marker, $event: MouseEvent): void {
    // console.log('dragEnd', m, $event);
  }

  public searchPlace(place): void{
    let center: LatLng = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }
    let address = place.formatted_address;
    this.locationStore.dispatch(LocationActions.SetCenter({center}));
    this.locationStore.dispatch(LocationActions.SetAddress({address}));
  }

  public centerChange(center: LatLng): void{
    this.locationStore.dispatch(LocationActions.SetCenter({center}))
  }

  public zoomChange(zoom: number): void{
    this.locationStore.dispatch(LocationActions.SetZoom({zoom}))
  }

  public boundsChange(bounds: google.maps.LatLngBounds): void{
    this.cropMapBounds(bounds.toJSON()).pipe(
      first(),
      map((bounds:Bounds)=>this.locationStore.dispatch(LocationActions.SetBounds({bounds})))
    ).subscribe();
  }

  private cropMapBounds(bounds: Bounds): Observable<Bounds>{
    return this.locationStore.select(LocationSelectors.GetCenter).pipe(
      map((center:LatLng)=>{
        let boundaryContainerRef = this.elementRef.nativeElement.querySelector(`div.${this.boundaryOutlineClassName}`);
        let boundaryContainer = boundaryContainerRef?.getBoundingClientRect();
        let mapContainer = this.mapContainer.nativeElement?.getBoundingClientRect();
        // let width = boundaryContainerRef?.style.width
        // let height = boundaryContainerRef?.style.height
        // let boundaryContainer: Dims = {
        //   width: parseFloat(width?.substring(0,width.length - 2)), //cut off 'px'
        //   height: parseFloat(height?.substring(0,height.length - 2)),
        // }
        // width = this.mapContainer.nativeElement?.style.width
        // height = this.mapContainer.nativeElement?.style.height
        // let mapContainer: Dims = {
        //   width: parseFloat(width?.substring(0,width.length - 2)), //cut off 'px'
        //   height: parseFloat(height?.substring(0,height.length - 2)),
        // }
        let boundaryRadii: Point = {
          x: (1 - boundaryContainer.width / mapContainer.width),
          y: (1 - boundaryContainer.height / mapContainer.height),
        }
        let mapRadii: Point = {
          x: (bounds.east - bounds.west) / 2,
          y: (bounds.north - bounds.south) / 2
        }
        let boundOffsets: Bounds = {
          north: -mapRadii.y * (boundaryRadii.y - 1),
          south: mapRadii.y * (boundaryRadii.y - 1),
          east: -mapRadii.x * (boundaryRadii.x - 1),
          west: mapRadii.x * (boundaryRadii.x - 1)
        }
        let croppedBounds: Bounds = {
          north: center.lat + boundOffsets.north,
          east: center.lng + boundOffsets.east,
          south: center.lat + boundOffsets.south,
          west: center.lng + boundOffsets.west
        }
        return croppedBounds;
      }),
    )
  }

  private createBoundaryDiv(corner: Point, dims: Dims): HTMLElement{
    let newDiv = document.createElement('div');
    newDiv.className = this.boundaryOutlineClassName;
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
