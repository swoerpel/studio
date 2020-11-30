import {createAction, props} from '@ngrx/store';
import { Orientation } from '../studio.reducer';

export const SetBackgroundSizeRatio = createAction(
    '[Studio] Set Background Size Ratio',
    props<{backgroundSizeRatio: number}>()
)

export const SetAspectRatio = createAction(
    '[Studio] Set Aspect Ratio',
    props<{aspectRatio: number}>()
)

export const SetOrientation = createAction(
    '[Studio] Set Orientation',
    props<{orientation: Orientation}>()
)