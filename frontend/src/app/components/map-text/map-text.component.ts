import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { MAP_TEXT_BOUNDARY_SIZE } from 'src/app/shared/constants';
import { makeid } from 'src/app/shared/helpers';
import { Alignment, MapTextType, Point, TextBlock } from 'src/app/shared/models';
import { StudioActions } from 'src/app/state/studio/actions';
import { StudioState } from 'src/app/state/studio/studio.reducer';
import { GetBackgroundSize, GetSelectedTextBlockId, GetSelectedTextBlockValue, GetTextBlocks } from 'src/app/state/studio/studio.selectors';
@Component({
  selector: 'app-map-text',
  templateUrl: './map-text.component.html',
  styleUrls: ['./map-text.component.scss']
})
export class MapTextComponent implements OnInit,AfterViewInit, OnDestroy {

  public Alignment = Alignment;
  public MapTextType = MapTextType;

  @ViewChild('textBoundary') textBoundaryRef: ElementRef;
  @ViewChildren('textBlock') textBlocksRef: QueryList<ElementRef>;

  public textBlocks$: Observable<TextBlock[]>;
  public selectedTextBlockId$: Observable<string>;
  public selectedTextBlockValue$: Observable<string>;

  public textAreaPadding$: Observable<any>;

  public textBlockValueFormControl: FormControl = new FormControl('',{updateOn: 'blur'});

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private studioStore: Store<StudioState>,
    private elementRef: ElementRef,
    private _renderer : Renderer2
  ) { }

  ngOnInit(): void {
    this.textBlocks$ = this.studioStore.select(GetTextBlocks);
    this.selectedTextBlockId$ = this.studioStore.select(GetSelectedTextBlockId);
    this.studioStore.select(GetSelectedTextBlockValue).pipe(
      tap((text:string) => this.textBlockValueFormControl.patchValue(text,{emitEvent: false})),
      takeUntil(this.unsubscribe)
    ).subscribe();

    this.textBlockValueFormControl.valueChanges.pipe(
      withLatestFrom(this.selectedTextBlockId$),
      map(([text,id])=>({id,text})),
      tap((payload)=>this.studioStore.dispatch(StudioActions.SetTextBlockValue(payload))),
      takeUntil(this.unsubscribe)
    ).subscribe();

    // this.textAreaPadding$ = this.studioStore.select(GetTextAreaPadding).pipe(
    //   map((textAreaPadding: number)=>{
    //     return {'outline-offset': `-${textAreaPadding}rem`};
    //   })
    // )

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
        // this.textBoundaryRef.nativeElement.style['box-sizing'] = `content-box`;
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();

  }


  ngOnDestroy(){
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

  setSelectedTextBlockStyle(textBlock: TextBlock){
    return {
      'font-size': `${textBlock.fontSize}rem`,
      'height': `${textBlock.fontSize}rem`,
      'letter-spacing':`${textBlock.letterSpacing}rem`,
      'font-weight':`${textBlock.fontWeight}`,
    };
  }

  public updateFontSize(id,increase: boolean){
    this.studioStore.dispatch(StudioActions.UpdateTextBlockFontSize({id,increase}));
  }
  public updateLetterSpacing(id: string, increase: boolean){
    this.studioStore.dispatch(StudioActions.UpdateTextBlockLetterSpacing({id, increase}));
  } 
  public updateFontWeight(id: string, increase: boolean){
    this.studioStore.dispatch(StudioActions.UpdateTextBlockFontWeight({id, increase}));
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

  public setSelectedTextBlockValue(mapTextType: MapTextType){
    switch(mapTextType){
      case MapTextType.CityName:{

      }break;
      case MapTextType.LatLng:{

      }break;
      case MapTextType.Custom:{

      }break;
    }
  }

  public deleteTextBlock(id: string){
    this.studioStore.dispatch(StudioActions.DeleteTextBlock({id}));
  } 



  public alignText(id: string, alignment: Alignment){
    let textBlockRef:any = this.textBlocksRef.find((block: any)=>block.nativeElement.id === id)
    let textBlockContainer = textBlockRef.nativeElement.getBoundingClientRect();
    let textBoundaryContainer = this.textBoundaryRef.nativeElement.getBoundingClientRect();

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
    this.studioStore.dispatch(StudioActions.SetTextBlockPosition({id,position}))
  }

  public updateTextBlockPosition(id: string,position: any,event: CdkDragEnd){
    let newPosition = {
      x:position.x + event.distance.x, 
      y:position.y + event.distance.y
    }
    this.setTextBlockPosition(id,newPosition);
  }

  public setTextBlockPosition(id: string,position: Point){
    let textBlockRef:any = this.textBlocksRef.find((block: any)=>block.nativeElement.id === id)
    if(!textBlockRef){
      return;
    }
    let textBoundaryContainer = this.textBoundaryRef.nativeElement.getBoundingClientRect();
    let textBlockContainer = textBlockRef.nativeElement.getBoundingClientRect();
    
    if(position.y < 0){
      position.y = 0;
    }
    if(position.y > textBoundaryContainer.height - textBlockContainer.height){
      position.y = textBoundaryContainer.height - textBlockContainer.height;
    }
    if(position.x < 0){
      position.x = 0;
    }
    if(position.x > textBoundaryContainer.width - textBlockContainer.width){
      position.x = textBoundaryContainer.width - textBlockContainer.width;
    }
    this.studioStore.dispatch(StudioActions.SetTextBlockPosition({id,position}))
  }

}
