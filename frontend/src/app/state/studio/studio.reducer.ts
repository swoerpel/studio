import { createReducer, on } from "@ngrx/store";
import { DEFAULT_FONT_SIZE, DEFAULT_FONT_WEIGHT, DEFAULT_LETTER_SPACING, FONT_SIZE_INCREMENT, FONT_WEIGHT_INCREMENT, LETTER_SPACING_SIZE_INCREMENT, MAX_FONT_WEIGHT, MIN_FONT_WEIGHT } from 'src/app/shared/constants';
import { makeid } from 'src/app/shared/helpers';
import { Orientation, TextBlock } from 'src/app/shared/models';
import { StudioActions} from './actions';


const initialId = makeid();

const generateDefaultTextBlock = (
        id = makeid(),
        text = 'Madison, WI'
): TextBlock => ({
    id,
    text,
    origin:{x:0,y:0},
    fontSize: DEFAULT_FONT_SIZE,
    letterSpacing: DEFAULT_LETTER_SPACING,
    fontWeight: DEFAULT_FONT_WEIGHT,
    position: {x:0,y:0,width:0.389815255,height:0.231281}
});


export interface StudioState {
    backgroundSizeRatio: number;
    aspectRatio: number;
    orientation: Orientation;
    // textAreaPadding: number;

    selectedTextBlockId: string;
    textBlocks:TextBlock[];
}

const initialState: StudioState = {
    backgroundSizeRatio: 0.2,
    aspectRatio: 0.8,
    // textAreaPadding: 3,
    orientation: Orientation.Portrait,
    selectedTextBlockId:initialId,
    textBlocks: [generateDefaultTextBlock(initialId)]
}

export const studioReducer = createReducer<StudioState>(
    initialState,

    on(StudioActions.SetBackgroundSizeRatio, (state, action): StudioState => {
        return {
            ...state,
            backgroundSizeRatio: action.backgroundSizeRatio,
        }
    }),
    on(StudioActions.SetAspectRatio, (state, action): StudioState => {
        return {
            ...state,
            aspectRatio: action.aspectRatio,
        }
    }),
    on(StudioActions.SetOrientation, (state, action): StudioState => {
        return {
            ...state,
            orientation: action.orientation,
        }
    }),
    // on(StudioActions.SetTextAreaPadding, (state, action): StudioState => {
    //     return {
    //         ...state,
    //         textAreaPadding: action.textAreaPadding,
    //     }
    // }),
    on(StudioActions.CreateTextBlock, (state, action): StudioState => {
        return {
            ...state,
            selectedTextBlockId: action.id,
            textBlocks: [...state.textBlocks, generateDefaultTextBlock(action.id, action.text)],
        }
    }),

    on(StudioActions.DeleteTextBlock, (state, action): StudioState => {
        return {
            ...state,
            selectedTextBlockId: action.id,
            textBlocks: state.textBlocks.filter((tb: TextBlock) => tb.id !== action.id)
        }
    }),

    on(StudioActions.SetSelectedTextBlockId, (state, action): StudioState => {
        return {
            ...state,
            selectedTextBlockId: action.id,
        }
    }),

    on(StudioActions.SetTextBlockOrigin, (state, action): StudioState => {
        return {
            ...state,
            textBlocks: state.textBlocks.map((textBlock:TextBlock) =>{
                if(textBlock.id === action.id){
                    return {
                        ...textBlock,
                        origin: {
                            ...textBlock.origin,
                            ...action.origin
                        },
                        position: {...textBlock.position}
                    }
                }
                return textBlock;
            })
        }
    }),

    on(StudioActions.SetTextBlockValue, (state, action): StudioState => {
        return {
            ...state,
            textBlocks: state.textBlocks.map((textBlock:TextBlock) =>{
                if(textBlock.id === action.id){
                    return {
                        ...textBlock,
                        text: action.text
                    }
                }
                return textBlock;
            })
        }
    }),
    on(StudioActions.UpdateTextBlockFontSize, (state, action): StudioState => {
        return {
            ...state,
            textBlocks: state.textBlocks.map((textBlock:TextBlock) =>{
                if(textBlock.id === action.id){
                    return {
                        ...textBlock,
                        fontSize: (action.increase) ? 
                            textBlock.fontSize + FONT_SIZE_INCREMENT :
                            textBlock.fontSize - FONT_SIZE_INCREMENT
                    }
                }
                return textBlock;
            })
        }
    }),
    on(StudioActions.UpdateTextBlockLetterSpacing, (state, action): StudioState => {
        return {
            ...state,
            textBlocks: state.textBlocks.map((textBlock:TextBlock) =>{
                if(textBlock.id === action.id){
                    return {
                        ...textBlock,
                        letterSpacing: (action.increase) ? 
                            textBlock.letterSpacing + LETTER_SPACING_SIZE_INCREMENT :
                            textBlock.letterSpacing - LETTER_SPACING_SIZE_INCREMENT
                    }
                }
                return textBlock;
            })
        }
    }),
    on(StudioActions.UpdateTextBlockFontWeight, (state, action): StudioState => {
        return {
            ...state,
            textBlocks: state.textBlocks.map((textBlock:TextBlock) =>{
                if(textBlock.id === action.id){
                    let newFontWeight = (action.increase) ? 
                        textBlock.fontWeight + FONT_WEIGHT_INCREMENT:
                        textBlock.fontWeight - FONT_WEIGHT_INCREMENT;
                    if(newFontWeight >= MIN_FONT_WEIGHT && newFontWeight <= MAX_FONT_WEIGHT ){
                        return {
                            ...textBlock,
                            fontWeight: newFontWeight
                        }
                    }
                }
                return textBlock;
            })
        }
    }),
    on(StudioActions.SetTextBlockPosition, (state, action): StudioState => {
        return {
            ...state,
            textBlocks: state.textBlocks.map((textBlock:TextBlock) =>{
                if(textBlock.id === action.id){
                    return {
                        ...textBlock,
                        position: {...action.position}
                    }
                }
                return textBlock;
            })
        }
    }),


);
