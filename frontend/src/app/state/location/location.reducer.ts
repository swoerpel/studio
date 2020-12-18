import { createReducer, on } from "@ngrx/store";
import { DEFAULT_FONT_SIZE, DEFAULT_FONT_WEIGHT, DEFAULT_LETTER_SPACING, FONT_SIZE_INCREMENT, FONT_WEIGHT_INCREMENT, LETTER_SPACING_SIZE_INCREMENT, MAX_FONT_WEIGHT, MIN_FONT_WEIGHT } from 'src/app/shared/constants';
import { makeid } from 'src/app/shared/helpers';
import { LatLng, Orientation, TextBlock } from 'src/app/shared/models';
import { LocationActions} from './actions';


export interface LocationState {
    center: LatLng
    zoom: number;
}

const initialState: LocationState = {
    center: {
        lat: 43.0731,
        lng:-89.4012
    },
    zoom: 14,
}

export const locationReducer = createReducer<LocationState>(
    initialState,
    on(LocationActions.SetCenter, (state, action): LocationState => {
        return {
            ...state,
            center: {...action.center}
        }
    }),
    on(LocationActions.SetZoom, (state, action): LocationState => {
        return {
            ...state,
            zoom: action.zoom,
        }
    }),
);
