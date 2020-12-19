import {createAction, props} from '@ngrx/store';
import { Alignment, Bounds, Dims, Orientation, Point } from '../../../shared/models';

// map layout & spacing
export const SetBackgroundSizeRatio = createAction(
    '[Map] Set Background Size Ratio',
    props<{backgroundSizeRatio: number}>()
)
export const SetAspectRatio = createAction(
    '[Map] Set Aspect Ratio',
    props<{aspectRatio: number}>()
)
export const SetOrientation = createAction(
    '[Map] Set Orientation',
    props<{orientation: Orientation}>()
)