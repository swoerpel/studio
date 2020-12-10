import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { tap, takeUntil, map } from 'rxjs/operators';
import { MAP_LOCATION_BOUNDARY_SIZE, MAP_TEXT_BOUNDARY_SIZE } from 'src/app/shared/constants';
import { StudioState } from 'src/app/state/studio/studio.reducer';
import { GetBackgroundSize } from 'src/app/state/studio/studio.selectors';

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

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private studioStore: Store<StudioState>,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.studioStore.select(GetBackgroundSize).pipe(
      map((maxRatio: number)=>1 - maxRatio),
      tap((maxRatio)=>{
        console.log('maxRatio',maxRatio)
        // let boundaryContainerRef = this.elementRef.nativeElement.querySelector('div.column.column__map.column__map--display');
        // let boundaryContainer: ClientRect = boundaryContainerRef?.getBoundingClientRect();
        if(!document.querySelector('boundary-div')){
          let newDiv = document.createElement('div');
          newDiv.className = 'chet';
          newDiv.style.position = 'absolute';
          newDiv.style.top = '0px';
          newDiv.style.left = '0px';
          newDiv.style.width = '300px';
          newDiv.style.height = '300px';
          newDiv.style['background-color'] = 'red';
          newDiv.style['z-index'] = '1000';
          let container = document.querySelector('div.column.column__map.column__map--display')
          container.append(newDiv);
        }
        
        // boundaryContainerRef.nativeElement.append(newDiv);
        // console.log("boundaryContainer",boundaryContainer)
        // let newHeight = boundaryContainer.height * MAP_LOCATION_BOUNDARY_SIZE;
        // let newWidth = newHeight * maxRatio;
        // if(newHeight > boundaryContainer.height){
        //   newHeight = boundaryContainer.height * MAP_TEXT_BOUNDARY_SIZE;
        //   newWidth = newHeight * (1 / maxRatio);
        // }
        // console.log('newWidth',newWidth,'newHeight',newHeight)

        // this.mapBoundaryRef.nativeElement.style.width = `${newWidth}px`;
        // this.mapBoundaryRef.nativeElement.style.height = `${newHeight}px`;
        // this.mapBoundaryRef.nativeElement.style.top = `${5}px`;
        // this.mapBoundaryRef.nativeElement.style.left = `${5}px`;
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

  centerChange(center){

  }

  zoomChange(zoom){

  }

  boundsChange(bounds){

  }

}
