import { createFeatureSelector, createSelector } from "@ngrx/store"
import { ColorState} from '../Color.reducer';

const colorFeatureState = createFeatureSelector<ColorState>('Color');

export const DefaultSelector = createSelector(
    colorFeatureState,
    (state: ColorState): any => null
)
