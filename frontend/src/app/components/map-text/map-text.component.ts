import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
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
export class MapTextComponent implements OnInit,AfterViewInit, OnDestroy {

  public Alignment = Alignment;

  @ViewChild('textBoundary') textBoundaryRef: ElementRef;
  @ViewChildren('textBlock') textBlocksRef: QueryList<ElementRef>;

  public textBlocks$: Observable<TextBlock[]>;
  public selectedTextBlockId$: Observable<string>;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private studioStore: Store<StudioState>,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.textBlocks$ = this.studioStore.select(GetTextBlocks).pipe(
      // map((blocks)=>{
      //   let newBlocks = blocks.map((block,i)=>{
      //     if(i === blocks.length - 1){
      //       return{
      //         ...block,
      //         position: {
      //           x: block.position.x - 100,
      //           y: block.position.y
      //         }
      //       }
      //     }
      //     return block;
      //   })
      //   return newBlocks
      // })
    )
    this.selectedTextBlockId$ = this.studioStore.select(GetSelectedTextBlockId)

    this.textBlocks$.subscribe(console.log);
  }

  ngAfterViewInit(){
    this.studioStore.select(GetBackgroundSize).pipe(
      tap((maxRatio)=>{
        let boundaryContainerRef = this.elementRef.nativeElement.querySelector('div.row.row__text-area');
        let boundaryContainer: ClientRect = boundaryContainerRef?.getBoundingClientRect();
        let newWidth = boundaryContainer.width * MAP_TEXT_BOUNDARY_SIZE;
        let newHeight = newWidth * maxRatio;
        if(newHeight > boundaryContainer.height){
          newHeight = boundaryContainer.height * MAP_TEXT_BOUNDARY_SIZE;
          newWidth = newHeight * (1 / maxRatio);
        }
        this.textBoundaryRef.nativeElement.style.width = `${newWidth}px`;
        this.textBoundaryRef.nativeElement.style.height = `${newHeight}px`;
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
    let textBlockRef:any = this.textBlocksRef.find((block: any)=>block.nativeElement.id === id)
    // textBlockRef.reset();
    let textBlockContainer = textBlockRef.nativeElement.getBoundingClientRect();
    let textBoundaryContainer = this.textBoundaryRef.nativeElement.getBoundingClientRect();
    let position: any = {x:0,y:0};
    console.log("boundary X & Y ->",Math.round(textBoundaryContainer.x),Math.round(textBoundaryContainer.y))
    console.log("textblock X & Y ->",Math.round(textBlockContainer.x),Math.round(textBlockContainer.y))
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
    console.log('position.x',position.x)
    this.studioStore.dispatch(StudioActions.SetTextBlockPosition({id,position}))
  }

  public setTextBlockPosition(id: string,position: any,event: CdkDragEnd){

    let textBlockRef:any = this.textBlocksRef.find((block: any)=>block.nativeElement.id === id)
    let textBoundaryContainer = this.textBoundaryRef.nativeElement.getBoundingClientRect();
    let textBlockContainer = textBlockRef.nativeElement.getBoundingClientRect();
    console.log("event.distance",event.distance)
    position = {x:position.x + event.distance.x, y:position.y + event.distance.y}
    if(position.y < 0){
      position.y = 0;
    }
    if(position.y > textBoundaryContainer.y){//} - textBlockContainer.height){
      position.y = textBoundaryContainer.y;
    }
    if(position.x < 0){
      position.x = 0;
    }
    if(position.x > textBoundaryContainer.width - textBlockContainer.width){
      position.x = textBoundaryContainer.width - textBlockContainer.width;
    }
    console.log("position",position)
    this.studioStore.dispatch(StudioActions.SetTextBlockPosition({id,position}))
  }

}
