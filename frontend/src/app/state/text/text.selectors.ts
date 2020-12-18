import { createFeatureSelector, createSelector } from "@ngrx/store"
import { Orientation, TextBlock, Dims } from '../../shared/models';
import { TextState } from './text.reducer';
import { GetAspectRatio, GetBackgroundSizeRatio, GetOrientation} from '../map/map.selectors';
const textFeatureState = createFeatureSelector<TextState>('text');



export const GetBackgroundSize = createSelector(
    textFeatureState,
    GetAspectRatio,
    GetBackgroundSizeRatio,
    GetOrientation,
    (state: TextState, aspectRatio, backgroundSizeRatio, orientation): any => {
        let dims: Dims = {
            width: aspectRatio,
            height: 1 * backgroundSizeRatio,
        }
        if(orientation === Orientation.Landscape){
            dims = {
                width: 1,
                height: aspectRatio * backgroundSizeRatio,
            }
        }
        return (dims.width > dims.height) ? dims.height / dims.width : 1
    }
)

export const GetMapDisplaySize = createSelector(
    textFeatureState,
    GetAspectRatio,
    GetBackgroundSizeRatio,
    GetOrientation,
    (state: TextState, aspectRatio, backgroundSizeRatio, orientation): any => {
        let dims: Dims = {
            width: aspectRatio,
            height: 1 * (1 - backgroundSizeRatio),
        } 
        if(orientation === Orientation.Landscape){
            dims = {
                width: 1,
                height: aspectRatio * (1 - backgroundSizeRatio),
            }
        }
        return dims.height / dims.width;
    }
)

export const GetTextBlocks = createSelector(
    textFeatureState,
    (state: TextState): any => state.textBlocks
)

export const GetSelectedTextBlockId = createSelector(
    textFeatureState,
    (state: TextState): any => state.selectedTextBlockId
)

export const GetSelectedTextBlock = createSelector(
    textFeatureState,
    (state: TextState): any => state.textBlocks.find((tb=>tb.id ===state.selectedTextBlockId))
)

export const GetSelectedTextBlockValue = createSelector(
    textFeatureState,
    (state: TextState): any => state.textBlocks.find((tb=>tb.id ===state.selectedTextBlockId))?.text
)

export const GetSelectedTextBlockPosition = createSelector(
    textFeatureState,
    (state: TextState): any => state.textBlocks.find((tb=>tb.id ===state.selectedTextBlockId))?.position
)


