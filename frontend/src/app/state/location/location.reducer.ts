import { createReducer, on } from "@ngrx/store";
import { DEFAULT_FONT_SIZE, DEFAULT_FONT_WEIGHT, DEFAULT_LETTER_SPACING, FONT_SIZE_INCREMENT, FONT_WEIGHT_INCREMENT, LETTER_SPACING_SIZE_INCREMENT, MAX_FONT_WEIGHT, MIN_FONT_WEIGHT } from 'src/app/shared/constants';
import { makeid } from 'src/app/shared/helpers';
import { Bounds, LatLng, Orientation, TextBlock } from 'src/app/shared/models';
import { LocationActions} from './actions';

const getDefaultLocation = () => ({
    center: {
        lat: 43.0731,
        lng:-89.4012
    },
    zoom: 14,
    address: 'Madison, WI, USA',
    bounds: {
        east: -89.37497550549573,
        north: 43.09105901761856,
        south: 43.05514098238143,
        west: -89.42742449450428,

    },
});

export interface LocationState {
    center: LatLng
    zoom: number;
    address: string;
    bounds: Bounds;
}

const initialState: LocationState = {
  ...getDefaultLocation()
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
    on(LocationActions.SetAddress, (state, action): LocationState => {
        return {
            ...state,
            address: action.address,
        }
    }),
    on(LocationActions.SetBounds, (state, action): LocationState => {
        return {
            ...state,
            bounds: {...action.bounds},
        }
    }),
);
