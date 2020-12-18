import { createReducer, on } from "@ngrx/store";
import { Orientation } from "src/app/shared/models";
import { MapActions } from './actions';

export interface MapState {
    backgroundSizeRatio: number;
    aspectRatio: number;
    orientation: Orientation;
}

const initialState: MapState = {
    backgroundSizeRatio: 0.2,
    aspectRatio: 0.8,
    orientation: Orientation.Portrait,
}

export const mapReducer = createReducer<MapState>(
    initialState,
    on(MapActions.SetBackgroundSizeRatio, (state, action): MapState => {
        return {
            ...state,
            backgroundSizeRatio: action.backgroundSizeRatio,
        }
    }),
    on(MapActions.SetAspectRatio, (state, action): MapState => {
        return {
            ...state,
            aspectRatio: action.aspectRatio,
        }
    }),
    on(MapActions.SetOrientation, (state, action): MapState => {
        return {
            ...state,
            orientation: action.orientation,
        }
    }),
);
