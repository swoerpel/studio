import { createReducer, on } from "@ngrx/store";
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
    position:{x:0,y:0}
});


export interface StudioState {
    backgroundSizeRatio: number;
    aspectRatio: number;
    orientation: Orientation;

    selectedTextBlockId: string;
    textBlocks:TextBlock[];
}

const initialState: StudioState = {
    backgroundSizeRatio: 0.2,
    aspectRatio: 0.8,
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
    on(StudioActions.CreateTextBlock, (state, action): StudioState => {
        console.log('state.textBlocks',state.textBlocks)
        console.log('action',action)
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

    on(StudioActions.SetTextBlockPosition, (state, action): StudioState => {
        return {
            ...state,
            textBlocks: state.textBlocks.map((textBlock:TextBlock) =>{
                if(textBlock.id === action.id){
                    return {
                        ...textBlock,
                        position: {
                            ...textBlock.position,
                            ...action.position
                        }
                    }
                }else{
                    return textBlock;
                }
            })
        }
    }),

);
