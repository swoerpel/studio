import {createAction, props} from '@ngrx/store';
import { Alignment, Dims, LatLng, Orientation, Point } from 'src/app/shared/models';

export const SetCenter = createAction(
    '[Location] Set Center',
    props<{center: LatLng}>()
)

export const SetZoom = createAction(
    '[Location] Set Zoom',
    props<{zoom: number}>()
)

export const SetAddress = createAction(
    '[Location] Set Address',
    props<{address: string}>()
)
