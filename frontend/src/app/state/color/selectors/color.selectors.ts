import { createFeatureSelector, createSelector } from "@ngrx/store"
import { ColorState} from '../Color.reducer';

const colorFeatureState = createFeatureSelector<ColorState>('color');

export const GetActiveColorPalettes = createSelector(
    colorFeatureState,
    (state: ColorState): any => state.activeColorPalettes,
)
export const GetStaticColorPalettes = createSelector(
    colorFeatureState,
    (state: ColorState): any => state.staticColorPalettes,
)
export const GetSelectedActivePaletteId = createSelector(
    colorFeatureState,
    (state: ColorState): any => state.selectedActivePaletteId,
)
export const GetSelectedStaticPaletteId = createSelector(
    colorFeatureState,
    (state: ColorState): any => state.selectedStaticPaletteId,
)
