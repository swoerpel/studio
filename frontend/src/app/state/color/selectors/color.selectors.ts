import { createFeatureSelector, createSelector } from "@ngrx/store"
import { ColorPalette } from "src/app/shared/models";
import { ColorState} from '../Color.reducer';

const colorFeatureState = createFeatureSelector<ColorState>('color');

export const GetActiveColorPalettes = createSelector(
    colorFeatureState,
    (state: ColorState): ColorPalette[] => state.activeColorPalettes,
)
export const GetStaticColorPalettes = createSelector(
    colorFeatureState,
    (state: ColorState): ColorPalette[] => state.staticColorPalettes,
)
export const GetSelectedActivePaletteId = createSelector(
    colorFeatureState,
    (state: ColorState): string => state.selectedActivePaletteId,
)
export const GetSelectedStaticPaletteId = createSelector(
    colorFeatureState,
    (state: ColorState): string => state.selectedStaticPaletteId,
)

export const GetSelectedPalette = createSelector(
    colorFeatureState,
    (state: ColorState): ColorPalette => state.activeColorPalettes.find((cp: ColorPalette)=>cp.id === state.selectedActivePaletteId),
)
