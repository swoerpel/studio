import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs/operators';
import { StudioState } from 'src/app/state/studio/studio.reducer';
import { Dim } from 'src/app/shared/models';
import { GetBackgroundSize } from 'src/app/state/studio/studio.selectors';
import { Subject } from 'rxjs';
import { MAP_TEXT_BOUNDARY_SIZE } from 'src/app/shared/constants';

@Component({
  selector: 'app-map-text',
  templateUrl: './map-text.component.html',
  styleUrls: ['./map-text.component.scss']
})
export class MapTextComponent implements OnInit,AfterContentInit, OnDestroy {

  public textBoundaryRef: any;
  public boundaryContainerRef: any;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private studioStore: Store<StudioState>,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
   
  }

  ngAfterContentInit() {
    this.textBoundaryRef = this.elementRef.nativeElement.querySelector('div.text-boundary');
    this.boundaryContainerRef = this.elementRef.nativeElement.querySelector('div.row.row__text-area');
    this.studioStore.select(GetBackgroundSize).pipe(
      tap(({widthRatio, heightRatio})=>{
        let boundaryContainer: ClientRect = this.boundaryContainerRef.getBoundingClientRect();
        let newWidth = boundaryContainer.width * MAP_TEXT_BOUNDARY_SIZE;
        let newHeight = newWidth * heightRatio;
        if(newHeight > boundaryContainer.height){
          newHeight = boundaryContainer.height * MAP_TEXT_BOUNDARY_SIZE;
          newWidth = newHeight * (1 / heightRatio);
        }
        this.textBoundaryRef.style.width = `${newWidth}px`;
        this.textBoundaryRef.style.height = `${newHeight}px`;
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  ngOnDestroy(){
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

}
