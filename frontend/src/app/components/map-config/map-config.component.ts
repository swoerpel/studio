import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ASPECT_RATIOS, BACKGROUND_RATIO_STEP_SIZE, DIALOG_CONTAINER } from 'src/app/shared/constants';
import { Orientation, StudioState } from 'src/app/state/studio/studio.reducer';
import { GetAspectRatio, GetBackgroundSizeRatio, GetOrientation } from 'src/app/state/studio/studio.selectors';
import { DialogComponent } from '../dialog/dialog.component';
import { takeUntil, tap } from 'rxjs/operators';
import { StudioActions } from 'src/app/state/studio/actions';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-map-config',
  templateUrl: './map-config.component.html',
  styleUrls: ['./map-config.component.scss']
})
export class MapConfigComponent implements OnInit, AfterContentInit, OnDestroy {

  public Orientation: typeof Orientation = Orientation;
  public aspectRatios = [...ASPECT_RATIOS];
  public aspectRatio;
  public backgroundSizeRatio;

  public orientation: Orientation;

  public mapZoneRef;
  public mapContainerRef;
  public mapDisplayRef;
  public mapBackgroundRef;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private studioStore: Store<StudioState>,
  ) { }

  ngOnInit(): void {
    this.studioStore.select(GetBackgroundSizeRatio).pipe(
      tap((backgroundSizeRatio) => {
        this.backgroundSizeRatio = backgroundSizeRatio
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
    this.studioStore.select(GetAspectRatio).pipe(
      tap((aspectRatio) => {
        this.aspectRatio = aspectRatio;
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
    this.studioStore.select(GetOrientation).pipe(
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

  public setOrientation(orientation: Orientation, dispatchAction: boolean = true){
    if(dispatchAction){
      this.studioStore.dispatch(StudioActions.SetOrientation({orientation}))
    }
    this.orientation = orientation;
    this.setAspectRatio(this.aspectRatio);
  }

  public setAspectRatio(aspectRatio: number, dispatchAction: boolean = true){
    if(dispatchAction){
      this.studioStore.dispatch(StudioActions.SetAspectRatio({aspectRatio}))
    }
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
      this.studioStore.dispatch(StudioActions.SetBackgroundSizeRatio({backgroundSizeRatio: this.backgroundSizeRatio}))
    }
    
  }

  public configureMapLocation(){
    this.dialog.open(
      DialogComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
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
      data:{
        component: 'app-map-text',
        title: 'Adjust Map Text'
      }
    }).afterClosed().pipe().subscribe();;
  }
}
