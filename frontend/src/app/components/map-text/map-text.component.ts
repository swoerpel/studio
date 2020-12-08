import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, delay, first, map, skip, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { MAP_TEXT_BOUNDARY_SIZE } from 'src/app/shared/constants';
import { makeid } from 'src/app/shared/helpers';
import { Alignment, Dim, MapTextType, Point, TextBlock } from 'src/app/shared/models';
import { StudioActions } from 'src/app/state/studio/actions';
import { StudioState } from 'src/app/state/studio/studio.reducer';
import { GetBackgroundSize, GetSelectedTextBlockId, GetSelectedTextBlockPosition, GetSelectedTextBlockValue, GetTextBlocks } from 'src/app/state/studio/studio.selectors';
import { head } from 'lodash';
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
  public selectedTextBlockPosition$: Observable<Point>;


  public textBlockValueFormControl: FormControl = new FormControl('',{updateOn: 'blur'});

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private studioStore: Store<StudioState>,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.textBlocks$ = this.studioStore.select(GetTextBlocks);
    this.selectedTextBlockId$ = this.studioStore.select(GetSelectedTextBlockId);
    this.selectedTextBlockPosition$ = this.studioStore.select(GetSelectedTextBlockPosition);

    this.studioStore.select(GetSelectedTextBlockValue).pipe(
      tap((text:string) => this.textBlockValueFormControl.patchValue(text,{emitEvent: false})),
      takeUntil(this.unsubscribe)
    ).subscribe();

    this.textBlockValueFormControl.valueChanges.pipe(
      withLatestFrom(this.selectedTextBlockId$),
      map(([text,id])=>({id,text})),
      tap((payload)=>this.studioStore.dispatch(StudioActions.SetTextBlockValue(payload))),
      // allows time for template to update so the new text is populated
      // when the text block dimensions are read
      debounceTime(100), 
      tap(({id})=> this.updateTextBlockDimensions(id)),
      takeUntil(this.unsubscribe)
    ).subscribe();

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
    this.selectedTextBlockId$.pipe(
      first(),
      tap((id: string)=>{
        this.updateTextBlockDimensions(id);
      })
    ).subscribe();
  }

  ngOnDestroy(){
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }
  
  // INTERACT WITH TEMPLATE================================================================
  public toTextBlockPixelPosition(position: Point): Point{
    // grab correct boundary size with width attribute rather than boundRect
    let width = this.textBoundaryRef?.nativeElement.style.width
    let height = this.textBoundaryRef?.nativeElement.style.height
    let boundary: Dim = {
      width: width?.substring(0,width.length - 2), //cut off 'px'
      height: height?.substring(0,height.length - 2),
    }
    return {
      x: position.x * boundary?.width || 0,
      y: position.y * boundary?.height || 0,
    }
  }

  public toTextBlockRatioPosition(pixelPosition: Point): Point{
    let boundary = this.textBoundaryRef?.nativeElement.getBoundingClientRect();
    return {
      x: (pixelPosition.x - boundary.x) / boundary.width,
      y: (pixelPosition.y - boundary.y) / boundary.height,
    }
  }

  public setSelectedTextBlockStyle(textBlock: TextBlock){
    return {
      'font-size': `${textBlock.fontSize}rem`,
      'height': `${textBlock.fontSize}rem`,
      'letter-spacing':`${textBlock.letterSpacing}rem`,
      'font-weight':`${textBlock.fontWeight}`,
    };
  }
  // =====================================================================================


  // INTERACT WITH STORE=====================================================================
  public createTextBlock(){
    this.studioStore.dispatch(StudioActions.CreateTextBlock({
      id: makeid(),
      text: 'sample',
    }))
  }
  public deleteTextBlock(id: string){
    this.studioStore.dispatch(StudioActions.DeleteTextBlock({id}));
  } 
  public setSelectedTextBlock(id: string){
    this.studioStore.dispatch(StudioActions.SetSelectedTextBlockId({id}));
  } 

  public updateTextBlockPosition(id: string){
    let textBlock = this.textBlocksRef?.find((block: any)=>block.nativeElement.id === id)
      ?.nativeElement.getBoundingClientRect();
    let textBlockPixelPosition: Point = {
      x: textBlock.x,
      y: textBlock.y
    }
    let position = this.toTextBlockRatioPosition(textBlockPixelPosition)
    this.studioStore.dispatch(StudioActions.SetTextBlockPosition({id,position}))
  }

  public updateTextBlockDimensions(id: string){
    let boundary = this.textBoundaryRef?.nativeElement.getBoundingClientRect();
    let textBlock = this.textBlocksRef?.find((block: any)=>block.nativeElement.id === id)
      ?.nativeElement.getBoundingClientRect();
    let dimensions: Dim = {
      width: textBlock.width / boundary.width,
      height: textBlock.height / boundary.height,
    }
    this.studioStore.dispatch(StudioActions.SetTextBlockDimensions({id, dimensions}));
  }

  public updateFontSize(id,increase: boolean){
    this.updateTextBlockDimensions(id);
    this.updateTextBlockPosition(id);
    this.studioStore.dispatch(StudioActions.UpdateTextBlockFontSize({id,increase}));
  }
  public updateLetterSpacing(id: string, increase: boolean){
    this.updateTextBlockDimensions(id);
    this.updateTextBlockPosition(id);
    this.studioStore.dispatch(StudioActions.UpdateTextBlockLetterSpacing({id, increase}));
  } 
  public updateFontWeight(id: string, increase: boolean){
    this.updateTextBlockDimensions(id);
    this.updateTextBlockPosition(id);
    this.studioStore.dispatch(StudioActions.UpdateTextBlockFontWeight({id, increase}));
  } 
  
  public alignText(id: string, alignment: Alignment, ratioPosition: Point){
    let textBlock:any = this.textBlocksRef.find((block: any)=>block.nativeElement.id === id)
      .nativeElement.getBoundingClientRect();
    let boundary = this.textBoundaryRef.nativeElement.getBoundingClientRect();
    let newRatioPosition: any = {};
    switch(alignment){
      case Alignment.HorizontalLeft: {
        newRatioPosition = {...ratioPosition, x: 0}
      } break;
      case Alignment.VerticalTop: {
        newRatioPosition = {...ratioPosition, y: 0}
      } break;
      case Alignment.HorizontalRight: {
        newRatioPosition = {...ratioPosition, x: 1 - (textBlock.width / boundary.width) }
      } break;
      case Alignment.VerticalBottom: {
        newRatioPosition = {...ratioPosition, y: 1 - (textBlock.height / boundary.height) }
      } break;
      case Alignment.HorizontalCenter: {
        newRatioPosition = {...ratioPosition, x: 0.5 - (textBlock.width / boundary.width) / 2 }
      } break;
      case Alignment.VerticalCenter: {
        newRatioPosition = {...ratioPosition, y: 0.5 - (textBlock.height / boundary.height) / 2 }
      } break;
    }
    this.studioStore.dispatch(StudioActions.SetTextBlockPosition({id,position: newRatioPosition}))
  }
  // =====================================================================================


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
