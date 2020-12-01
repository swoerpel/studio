import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { MAP_TEXT_BOUNDARY_SIZE } from 'src/app/shared/constants';
import { makeid } from 'src/app/shared/helpers';
import { Alignment, TextBlock } from 'src/app/shared/models';
import { StudioActions } from 'src/app/state/studio/actions';
import { StudioState } from 'src/app/state/studio/studio.reducer';
import { GetBackgroundSize, GetSelectedTextBlockId, GetTextBlocks } from 'src/app/state/studio/studio.selectors';
@Component({
  selector: 'app-map-text',
  templateUrl: './map-text.component.html',
  styleUrls: ['./map-text.component.scss']
})
export class MapTextComponent implements OnInit,AfterContentInit, OnDestroy {

  public Alignment = Alignment;

  public textBlocks$: Observable<TextBlock[]>;
  public selectedTextBlockId$: Observable<string>;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private studioStore: Store<StudioState>,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.textBlocks$ = this.studioStore.select(GetTextBlocks)
    this.selectedTextBlockId$ = this.studioStore.select(GetSelectedTextBlockId)
    this.selectedTextBlockId$.pipe(
      tap(console.log)
    ).subscribe();
    this.textBlocks$.pipe(
      tap(console.log)
    ).subscribe();
  }

  ngAfterContentInit() {
   
    this.studioStore.select(GetBackgroundSize).pipe(
      tap((maxRatio)=>{
        let textBoundaryRef = this.elementRef.nativeElement.querySelector('div.text-boundary');
        let boundaryContainerRef = this.elementRef.nativeElement.querySelector('div.row.row__text-area');
        let boundaryContainer: ClientRect = boundaryContainerRef?.getBoundingClientRect();
        let newWidth = boundaryContainer.width * MAP_TEXT_BOUNDARY_SIZE;
        let newHeight = newWidth * maxRatio;
        if(newHeight > boundaryContainer.height){
          newHeight = boundaryContainer.height * MAP_TEXT_BOUNDARY_SIZE;
          newWidth = newHeight * (1 / maxRatio);
        }
        textBoundaryRef.style.width = `${newWidth}px`;
        textBoundaryRef.style.height = `${newHeight}px`;
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();
  }

  ngOnDestroy(){
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

  public createTextBlock(){
    this.studioStore.dispatch(StudioActions.CreateTextBlock({
      id: makeid(),
      text: 'stetson chet',
    }))
  }

  public setSelectedTextBlock(id: string){
    this.studioStore.dispatch(StudioActions.SetSelectedTextBlockId({id}));
  } 
  public deleteTextBlock(id: string){
    this.studioStore.dispatch(StudioActions.DeleteTextBlock({id}));
  } 

  public alignText(id: string, alignment: Alignment){
    let textBlockRef = this.elementRef.nativeElement.querySelector(`div#${id}`);
    let textBoundaryRef = this.elementRef.nativeElement.querySelector(`div.text-boundary`);
    let textBlockContainer = textBlockRef.getBoundingClientRect();
    let textBoundaryContainer = textBoundaryRef.getBoundingClientRect();
    console.log("textBoundaryContainer",textBoundaryContainer)
    let position: any = {x:0,y:0};
    switch(alignment){
      case Alignment.HorizontalLeft: {
        position = {x:0}
      } break;
      case Alignment.HorizontalCenter: {
        position = {x:textBoundaryContainer.width / 2 - textBlockContainer.width / 2}
      } break;
      case Alignment.HorizontalRight: {
        position = {x:textBoundaryContainer.width - textBlockContainer.width}
      } break;
      case Alignment.VerticalTop: {
        position = {y:0}
      } break;
      case Alignment.VerticalCenter: {
        position = {y:textBoundaryContainer.height / 2 - textBlockContainer.height / 2}
      } break;
      case Alignment.VerticalBottom: {
        position = {y:textBoundaryContainer.height - textBlockContainer.height}
      } break;
    }
    console.log('position',position)
    this.studioStore.dispatch(StudioActions.SetTextBlockPosition({id,position}))
  }

  public setTextBlockPosition(id: string,position: any,event: CdkDragEnd){
    let textBoundaryRef = this.elementRef.nativeElement.querySelector(`div.text-boundary`);
    let textBlockRef = this.elementRef.nativeElement.querySelector(`div#${id}`);
    let textBoundaryContainer = textBoundaryRef.getBoundingClientRect();
    let textBlockContainer = textBlockRef.getBoundingClientRect();
    console.log('textBoundaryContainer',textBoundaryContainer)
    console.log('position before',position)
    position = {x:position.x + event.distance.x, y:position.y + event.distance.y}
    console.log('position after',position)
    if(position.y < 0){
      position.y = 0;
    }
    if(position.y > textBoundaryContainer.y - textBlockContainer.height){
      position.y = textBoundaryContainer.y;
    }
    if(position.x < 0){
      console.log('left x')
      position.x = 0;
    }
    if(position.x > textBoundaryContainer.width - textBlockContainer.width){
      position.x = textBoundaryContainer.width - textBlockContainer.width;
    }
    this.studioStore.dispatch(StudioActions.SetTextBlockPosition({id,position}))
  }

  private refreshTextBoundaryContainerRef(){
    
  }


}
