import { createReducer, on } from "@ngrx/store";
import { TextActions } from './actions';
import { Orientation, TextBlock } from '../../shared/models';
import { makeid } from '../../shared/helpers';
import { 
    DEFAULT_FONT_SIZE, 
    DEFAULT_FONT_WEIGHT, 
    DEFAULT_LETTER_SPACING, 
    FONT_SIZE_INCREMENT, 
    FONT_WEIGHT_INCREMENT, 
    LETTER_SPACING_SIZE_INCREMENT, 
    MAX_FONT_WEIGHT, 
    MIN_FONT_WEIGHT 
} from '../../shared/constants';

const initialId = makeid();

const generateDefaultTextBlock = (
        id = makeid(),
        text = 'Madison, WI'
): TextBlock => ({
    id,
    text,
    fontSize: DEFAULT_FONT_SIZE,
    letterSpacing: DEFAULT_LETTER_SPACING,
    fontWeight: DEFAULT_FONT_WEIGHT,
    position: {x:0,y:0},
    dimensions:{ width:0.389815255, height:0.231281 }
});


export interface TextState {
    selectedTextBlockId: string;
    textBlocks:TextBlock[];
}

const initialState: TextState = {
    selectedTextBlockId:initialId,
    textBlocks: [generateDefaultTextBlock(initialId)]
}

export const textReducer = createReducer<TextState>(
    initialState,
    on(TextActions.CreateTextBlock, (state, action): TextState => {
        return {
            ...state,
            selectedTextBlockId: action.id,
            textBlocks: [...state.textBlocks, generateDefaultTextBlock(action.id, action.text)],
        }
    }),
    on(TextActions.DeleteTextBlock, (state, action): TextState => {
        return {
            ...state,
            selectedTextBlockId: action.id,
            textBlocks: state.textBlocks.filter((tb: TextBlock) => tb.id !== action.id)
        }
    }),
    on(TextActions.SetSelectedTextBlockId, (state, action): TextState => {
        return {
            ...state,
            selectedTextBlockId: action.id,
        }
    }),
    on(TextActions.SetTextBlockValue, (state, action): TextState => {
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
    on(TextActions.UpdateTextBlockFontSize, (state, action): TextState => {
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
    on(TextActions.UpdateTextBlockLetterSpacing, (state, action): TextState => {
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
    on(TextActions.UpdateTextBlockFontWeight, (state, action): TextState => {
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
    on(TextActions.SetTextBlockPosition, (state, action): TextState => {
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
    on(TextActions.SetTextBlockDimensions, (state, action): TextState => {
        return {
            ...state,
            textBlocks: state.textBlocks.map((textBlock:TextBlock) =>{
                if(textBlock.id === action.id){
                    return {
                        ...textBlock,
                        dimensions: {...action.dimensions}
                    }
                }
                return textBlock;
            })
        }
    }),


);
