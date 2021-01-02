import {createAction, props} from '@ngrx/store';
import { Alignment, Dims, Orientation, Point } from '../../../shared/models';

// map layout & spacing
export const SetSelectedStaticPalette = createAction(
    '[Color] Set Selected Static Palette',
    props<{colorPaletteId: string}>()
)
export const SetSelectedActivePalette = createAction(
    '[Color] Set Selected Active Palette',
    props<{colorPaletteId: string}>()
)
export const ApplySelectedStaticPalette = createAction(
    '[Color] Apply Selected Static Palette',
)
export const UnapplySelectedActivePalette = createAction(
    '[Color] Unapply Selected Active Palette',
)
