import { createFeatureSelector, createSelector } from "@ngrx/store"
import { Dim, Orientation } from 'src/app/shared/models';
import { StudioState} from './studio.reducer';

const studioFeatureState = createFeatureSelector<StudioState>('studio');

export const GetBackgroundSizeRatio = createSelector(
    studioFeatureState,
    (state: StudioState): any => state.backgroundSizeRatio
)

export const GetAspectRatio = createSelector(
    studioFeatureState,
    (state: StudioState): any => state.aspectRatio
)

export const GetOrientation = createSelector(
    studioFeatureState,
    (state: StudioState): any => state.orientation
)

// export const GetTextAreaPadding = createSelector(
//     studioFeatureState,
//     (state: StudioState): any => state.textAreaPadding
// )

export const GetBackgroundSize = createSelector(
    studioFeatureState,
    GetAspectRatio,
    GetBackgroundSizeRatio,
    GetOrientation,
    (state: StudioState, aspectRatio, backgroundSizeRatio, orientation): any => {
        let dims: Dim = {
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

export const GetTextBlocks = createSelector(
    studioFeatureState,
    (state: StudioState): any => state.textBlocks
)

export const GetSelectedTextBlockId = createSelector(
    studioFeatureState,
    (state: StudioState): any => state.selectedTextBlockId
)

export const GetSelectedTextBlockValue = createSelector(
    studioFeatureState,
    (state: StudioState): any => state.textBlocks.find((tb=>tb.id ===state.selectedTextBlockId))?.text
)


