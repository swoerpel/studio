import { AfterContentInit, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, delay, first, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ASPECT_RATIOS, BACKGROUND_RATIO_STEP_SIZE, DIALOG_CONTAINER } from 'src/app/shared/constants';
import { Bounds, Dims, LatLng, Marker, Orientation, Point, TextBlock } from 'src/app/shared/models';
import { TextActions } from 'src/app/state/text/actions';
import { TextSelectors } from 'src/app/state/text/selectors';
import { TextState } from 'src/app/state/text/text.reducer';
import { MapSelectors } from 'src/app/state/map/selectors';
import { DialogComponent } from '../dialog/dialog.component';
import { last } from 'lodash';
import { MapState } from 'src/app/state/map/map.reducer';
import { MapActions } from 'src/app/state/map/actions';
import { LocationState } from 'src/app/state/location/location.reducer';
import { LocationSelectors } from 'src/app/state/location/selectors';
import { MapStylingService } from 'src/app/services/map-styling.service';
import { GoogleMapsAPIWrapper, AgmMap} from '@agm/core';



@Component({
  selector: 'app-map-config',
  templateUrl: './map-config.component.html',
  styleUrls: ['./map-config.component.scss']
})
export class MapConfigComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild('map') agmMap: AgmMap;
  @ViewChild('textBoundary') textBoundaryRef: ElementRef;
  @ViewChildren('textBlock') textBlocksRef: QueryList<ElementRef>;

  public Orientation: typeof Orientation = Orientation;
  public aspectRatios = [...ASPECT_RATIOS];
  public aspectRatio;
  public backgroundSizeRatio;

  public orientation: Orientation;

  public mapZoneRef;
  public mapContainerRef;
  public mapDisplayRef;
  public mapBackgroundRef;

  public textBlocks$: Observable<TextBlock[]>;

  public textBlockStyles$: Observable<any>;
  public bounds$: Observable<Bounds>;

  public styles: any = {};
  // public styles$: Obserable<any>; // future

  public zoom$: Observable<number>;
  public center$: Observable<LatLng>;
  public boundsPadding = {top:0,bottom:0,right:0,left:0};
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private mapStore: Store<MapState>,
    private textStore: Store<TextState>,
    private locationStore: Store<LocationState>,
    private mapStylingService: MapStylingService
  ) { }

  ngOnInit(): void {
    this.styles = this.mapStylingService.generateStyles()
    this.bounds$ = this.locationStore.select(LocationSelectors.GetBounds)
    this.textBlocks$ = this.textStore.select(TextSelectors.GetTextBlocks);
    this.textStore.select(TextSelectors.GetSelectedTextBlockValue).pipe(
      switchMap(() => this.textStore.select(TextSelectors.GetSelectedTextBlock)),
      tap((tb: TextBlock)=>this.calculateTextBlockStyle(tb)),
      takeUntil(this.unsubscribe)
    ).subscribe();

    this.textBlockStyles$ = combineLatest([
      this.mapStore.select(MapSelectors.GetOrientation),
      this.mapStore.select(MapSelectors.GetBackgroundSizeRatio),
      this.mapStore.select(MapSelectors.GetAspectRatio),
      this.textStore.select(TextSelectors.GetTextBlocks),
    ]).pipe(
      map(last),
      map((tbs: TextBlock[]) =>
        tbs.reduce((obj,tb: TextBlock)=>({...obj,[tb.id]:this.calculateTextBlockStyle(tb)}),{})
      ),
    )

    this.mapStore.select(MapSelectors.GetBackgroundSizeRatio).pipe(
      tap((backgroundSizeRatio: number) => {
        this.backgroundSizeRatio = backgroundSizeRatio
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
    this.mapStore.select(MapSelectors.GetAspectRatio).pipe(
      tap((aspectRatio: number) => {
        this.aspectRatio = aspectRatio;
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
    this.mapStore.select(MapSelectors.GetOrientation).pipe(
      tap((orientation: Orientation) => {
        this.orientation = orientation;
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();

  }

  ngAfterContentInit() {
    this.mapZoneRef = this.elementRef.nativeElement.querySelector('div.container__map-zone');
    this.mapContainerRef = this.elementRef.nativeElement.querySelector('div.map');
    this.mapDisplayRef = this.elementRef.nativeElement.querySelector('div.map__display');
    this.mapBackgroundRef = this.elementRef.nativeElement.querySelector('div.map__background');
    this.setAspectRatio(this.aspectRatio, false);
    this.setOrientation(this.orientation, false);
    this.updateBackgroundSizeRatio(true, true);
  }

  ngOnDestroy(){
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
  public calculateTextBlockStyle(tb: TextBlock){
    if(!this?.textBoundaryRef){return;}
    let bound = this.textBoundaryRef.nativeElement.getBoundingClientRect();
    let origin:Point = {
      x: bound.width * tb.position.x,
      y: bound.height * tb.position.y,
    }
    let scaledDims:Dims = {
      width: bound.width * tb.dimensions.width,
      height: bound.height * tb.dimensions.height,
    }
    return {
      'position': 'absolute',
      'top': `${origin.y}px`,
      'left': `${origin.x}px`,
      'white-space':'nowrap',
      'width': `${scaledDims.width}px`,
      'height': `${scaledDims.height}px`,
      'font-size': `${scaledDims.height}px`,
      'letter-spacing':`${tb.letterSpacing}rem`,
      'padding': 0,
      'font-weight':`${tb.fontWeight}`,
    };
  }

  public setOrientation(orientation: Orientation, dispatchAction: boolean = true){
    if(dispatchAction){
      this.mapStore.dispatch(MapActions.SetOrientation({orientation}))
    }
    this.orientation = orientation;
    this.setAspectRatio(this.aspectRatio);
  }

  public setAspectRatio(aspectRatio: number, dispatchAction: boolean = true){
    let mapContainer: ClientRect = this.mapZoneRef.getBoundingClientRect();
    let newHeight = mapContainer.height * 0.95;
    let newWidth = newHeight  * aspectRatio;
    if(this.orientation == Orientation.Portrait){
      this.mapContainerRef.style.width = `${newWidth}px`
      this.mapContainerRef.style.height = `${newHeight}px`
    }else if(this.orientation == Orientation.Landscape){
      this.mapContainerRef.style.width = `${newHeight}px`
      this.mapContainerRef.style.height = `${newWidth}px`
    }
    if(dispatchAction){
      this.mapStore.dispatch(MapActions.SetAspectRatio({aspectRatio}))
    }
  }

  public updateBackgroundSizeRatio(increase: boolean, dispatchAction: boolean = true){
    if(increase && this.backgroundSizeRatio < 1){
      this.backgroundSizeRatio += BACKGROUND_RATIO_STEP_SIZE;
    } else if(!increase && this.backgroundSizeRatio > 0){
      this.backgroundSizeRatio -= BACKGROUND_RATIO_STEP_SIZE;
    }
    this.backgroundSizeRatio = Math.round(this.backgroundSizeRatio * 10000) / 10000;
    this.mapBackgroundRef.style.flex = this.backgroundSizeRatio
    this.mapDisplayRef.style.flex = (1 - this.backgroundSizeRatio);
    if(dispatchAction){
      this.mapStore.dispatch(MapActions.SetBackgroundSizeRatio({backgroundSizeRatio: this.backgroundSizeRatio}))
    }
  }

  public configureMapLocation(){
    this.dialog.open(
      DialogComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
      minWidth: DIALOG_CONTAINER.WIDTH,
      minHeight: DIALOG_CONTAINER.HEIGHT,
      data:{
        component: 'app-map-location',
        title: 'Adjust Map Location and Center'
      }
    }).afterClosed().pipe().subscribe();
  }

  public configureMapText(){
    this.dialog.open(
      DialogComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
      minWidth: DIALOG_CONTAINER.WIDTH,
      minHeight: DIALOG_CONTAINER.HEIGHT,
      data:{
        component: 'app-map-text',
        title: 'Adjust Map Text'
      }
    }).afterClosed().pipe().subscribe();;
  }
}



