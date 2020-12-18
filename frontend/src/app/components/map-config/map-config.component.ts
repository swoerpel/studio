import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ASPECT_RATIOS, BACKGROUND_RATIO_STEP_SIZE, DIALOG_CONTAINER } from 'src/app/shared/constants';
import { Dims, Orientation, Point, TextBlock } from 'src/app/shared/models';
import { TextActions } from 'src/app/state/text/actions';
import { TextState } from 'src/app/state/text/text.reducer';
import { 
  GetAspectRatio, 
  GetBackgroundSizeRatio, 
  GetOrientation, 
} from 'src/app/state/map/map.selectors';
import { 
  GetSelectedTextBlock, 
  GetSelectedTextBlockId, 
  GetSelectedTextBlockValue, 
  GetTextBlocks 
} from 'src/app/state/text/text.selectors';
import { DialogComponent } from '../dialog/dialog.component';
import { last } from 'lodash';
import { MapState } from 'src/app/state/map/Map.reducer';
import { MapActions } from 'src/app/state/map/actions';
@Component({
  selector: 'app-map-config',
  templateUrl: './map-config.component.html',
  styleUrls: ['./map-config.component.scss']
})
export class MapConfigComponent implements OnInit, AfterContentInit, OnDestroy {

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

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private mapStore: Store<MapState>,
    private textStore: Store<TextState>,
  ) { }

  ngOnInit(): void {
    this.textBlocks$ = this.textStore.select(GetTextBlocks);
    this.textStore.select(GetSelectedTextBlockValue).pipe(
      switchMap(() => this.textStore.select(GetSelectedTextBlock)),
      tap((tb: TextBlock)=>this.calculateTextBlockStyle(tb)),
      takeUntil(this.unsubscribe)
    ).subscribe();

    this.textBlockStyles$ = combineLatest([
      this.mapStore.select(GetOrientation),
      this.mapStore.select(GetBackgroundSizeRatio),
      this.mapStore.select(GetAspectRatio),
      this.textStore.select(GetTextBlocks),
    ]).pipe(
      map(last),
      map((tbs: TextBlock[]) =>
        tbs.reduce((obj,tb: TextBlock)=>({...obj,[tb.id]:this.calculateTextBlockStyle(tb)}),{})
      ),
    )

    this.mapStore.select(GetBackgroundSizeRatio).pipe(
      tap((backgroundSizeRatio) => {
        this.backgroundSizeRatio = backgroundSizeRatio
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
    this.mapStore.select(GetAspectRatio).pipe(
      tap((aspectRatio) => {
        this.aspectRatio = aspectRatio;
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
    this.mapStore.select(GetOrientation).pipe(
      tap((orientation) => {
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
      this.textStore.dispatch(MapActions.SetOrientation({orientation}))
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
      this.textStore.dispatch(MapActions.SetAspectRatio({aspectRatio}))
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
      this.textStore.dispatch(MapActions.SetBackgroundSizeRatio({backgroundSizeRatio: this.backgroundSizeRatio}))
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
