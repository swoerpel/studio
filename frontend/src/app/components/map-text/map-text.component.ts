import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { MAP_TEXT_BOUNDARY_SIZE } from 'src/app/shared/constants';
import { makeid } from 'src/app/shared/helpers';
import { Alignment, Dim, MapTextType, Point, TextBlock, TextBlockPosition } from 'src/app/shared/models';
import { StudioActions } from 'src/app/state/studio/actions';
import { StudioState } from 'src/app/state/studio/studio.reducer';
import { GetBackgroundSize, GetSelectedTextBlockId, GetSelectedTextBlockPosition, GetSelectedTextBlockValue, GetTextBlocks } from 'src/app/state/studio/studio.selectors';
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
    private cdr: ChangeDetectorRef,
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
      }),
      takeUntil(this.unsubscribe)
    ).subscribe();

    this.studioStore.select(GetSelectedTextBlockPosition).subscribe(console.log);
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

  public setSelectedTextBlockStyle(textBlock: TextBlock){
    return {
      'font-size': `${textBlock.fontSize}rem`,
      'height': `${textBlock.fontSize}rem`,
      'letter-spacing':`${textBlock.letterSpacing}rem`,
      'font-weight':`${textBlock.fontWeight}`,
    };
  }
  public updateTextBlockPosition(id: string){
    let boundary = this.textBoundaryRef?.nativeElement.getBoundingClientRect();
    let textBlock = this.textBlocksRef?.find((block: any)=>block.nativeElement.id === id)
      ?.nativeElement.getBoundingClientRect();
    let position = {
      x: (textBlock.x - boundary.x) / boundary.width,
      y: (textBlock.y - boundary.y) / boundary.height,
    }
    this.studioStore.dispatch(StudioActions.SetTextBlockPosition({id,position}))
  }
  
  public setTextBlockPosition(position: Point){
    let boundary = this.textBoundaryRef?.nativeElement.getBoundingClientRect();
    return{
      x: position.x * boundary?.width || 0,
      y: position.y* boundary?.height || 0,
    }
  }

  public updateTextBlockDimensions(id: string){
    let boundary = this.textBoundaryRef?.nativeElement.getBoundingClientRect();
    let textBlock = this.textBlocksRef?.find((block: any)=>block.nativeElement.id === id)
      ?.nativeElement.getBoundingClientRect();
    let dimensions = {
      x: textBlock.width / boundary.width,
      y: textBlock.height / boundary.height,
    }
    console.log('dimensions',dimensions)
  }


  public updateFontSize(id,increase: boolean){
    this.updateTextBlockDimensions(id)
    this.studioStore.dispatch(StudioActions.UpdateTextBlockFontSize({id,increase}));
  }
  public updateLetterSpacing(id: string, increase: boolean){
    this.updateTextBlockDimensions(id)
    this.studioStore.dispatch(StudioActions.UpdateTextBlockLetterSpacing({id, increase}));
  } 
  public updateFontWeight(id: string, increase: boolean){
    this.updateTextBlockDimensions(id)
    this.studioStore.dispatch(StudioActions.UpdateTextBlockFontWeight({id, increase}));
  } 
  public setSelectedTextBlock(id: string){
    this.studioStore.dispatch(StudioActions.SetSelectedTextBlockId({id}));
  } 
  public deleteTextBlock(id: string){
    this.studioStore.dispatch(StudioActions.DeleteTextBlock({id}));
  } 

  public alignText(id: string, alignment: Alignment){
    let textBlock:any = this.textBlocksRef.find((block: any)=>block.nativeElement.id === id)
      .nativeElement.getBoundingClientRect();
    let boundary = this.textBoundaryRef.nativeElement.getBoundingClientRect();
    let origin: any = {x:0,y:0};
    switch(alignment){
      case Alignment.HorizontalLeft: {
        origin = {x:0}
      } break;
      case Alignment.HorizontalCenter: {
        origin = {x:boundary.width / 2 - textBlock.width / 2}
      } break;
      case Alignment.HorizontalRight: {
        origin = {x:boundary.width - textBlock.width}
      } break;
      case Alignment.VerticalTop: {
        origin = {y:0}
      } break;
      case Alignment.VerticalCenter: {
        origin = {y:boundary.height / 2 - textBlock.height / 2}
      } break;
      case Alignment.VerticalBottom: {
        origin = {y:boundary.height - textBlock.height}
      } break;
    }
    console.log('origin',origin)
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

}
