import { createFeatureSelector, createSelector } from "@ngrx/store"
import { Orientation, TextBlock, Dims } from '../../../shared/models';
import { TextState } from '../text.reducer';
import { GetAspectRatio, GetBackgroundSizeRatio, GetOrientation} from '../../map/selectors/map.selectors';

const textFeatureState = createFeatureSelector<TextState>('text');

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


