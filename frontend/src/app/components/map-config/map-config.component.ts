import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { DIALOG_CONTAINER } from 'src/app/shared/constants';
import { MapLocationComponent } from '../map-location/map-location.component';
import { MapTextComponent } from '../map-text/map-text.component';

@Component({
  selector: 'app-map-config',
  templateUrl: './map-config.component.html',
  styleUrls: ['./map-config.component.scss']
})
export class MapConfigComponent implements OnInit, AfterContentInit {

  public aspectRatios$ = [.647,.667,.675,.75,.8,1]
  public selectedAspectRatioIndex = 4;
  public backgroundSizeRatio = 0.20;
  public backgroundSizeRatioStep = 0.05;

  public portraitMode: boolean = true;

  public mapZoneRef;
  public mapContainerRef;
  public mapDisplayRef;
  public mapBackgroundRef;

  constructor(
    private dialog: MatDialog,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
  }

  
  ngAfterContentInit() {
    this.mapZoneRef = this.elementRef.nativeElement.querySelector('div.container__map-zone');
    this.mapContainerRef = this.elementRef.nativeElement.querySelector('div.map');
    this.mapDisplayRef = this.elementRef.nativeElement.querySelector('div.map__display');
    this.mapBackgroundRef = this.elementRef.nativeElement.querySelector('div.map__background');
    this.selectAspectRatio(this.aspectRatios$[this.selectedAspectRatioIndex]);
    this.selectLayout(this.portraitMode);
    this.updateBackgroundSizeRadius(true);
  }

  public selectAspectRatio(aspectRatio: number){
    this.selectedAspectRatioIndex = this.aspectRatios$.indexOf(aspectRatio);
    let mapContainer: ClientRect = this.mapZoneRef.getBoundingClientRect();
    let newHeight = mapContainer.height * 0.75;
    let newWidth = newHeight  * aspectRatio;
    if(this.portraitMode){
      this.mapContainerRef.style.width = `${newWidth}px`
      this.mapContainerRef.style.height = `${newHeight}px`
    }else{
      this.mapContainerRef.style.width = `${newHeight}px`
      this.mapContainerRef.style.height = `${newWidth}px`
    }
  
  }

  public selectLayout(portraitMode: boolean){
    this.portraitMode = portraitMode;
    this.selectAspectRatio(this.aspectRatios$[this.selectedAspectRatioIndex]);
  }

  public updateBackgroundSizeRadius(increase: boolean){
    if(increase && this.backgroundSizeRatio < 1){
      this.backgroundSizeRatio += this.backgroundSizeRatioStep;
    } else if(!increase && this.backgroundSizeRatio > 0){
      this.backgroundSizeRatio -= this.backgroundSizeRatioStep;
    }
    this.backgroundSizeRatio = Math.round(this.backgroundSizeRatio * 10000) / 10000;
    this.mapBackgroundRef.style.flex = this.backgroundSizeRatio
    this.mapDisplayRef.style.flex = (1 - this.backgroundSizeRatio);
  }

  public configureMapLocation(){
    const dialogRef = this.dialog.open(
      MapLocationComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
    });
    dialogRef.afterClosed().pipe(tap(console.log)).subscribe();
  }

  public configureMapText(){
    const dialogRef = this.dialog.open(
      MapTextComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
    });
    dialogRef.afterClosed().pipe(tap(console.log)).subscribe();
  }
}
