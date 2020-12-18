import {createAction, props} from '@ngrx/store';
import { Alignment, Dims, Orientation, Point } from '../../../shared/models';

// map layout & spacing
export const DefaultAction = createAction(
    '[Color] Default',
    props<{value: number}>()
)
