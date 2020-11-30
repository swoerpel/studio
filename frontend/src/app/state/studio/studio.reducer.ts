import { createReducer, on } from "@ngrx/store";
import { StudioActions} from './actions';

export enum Orientation { Portrait, Landscape }

export interface StudioState {
    backgroundSizeRatio: number;
    aspectRatio: number;
    orientation: Orientation;
}

const initialState: StudioState = {
    backgroundSizeRatio: 0.2,
    aspectRatio: 0.8,
    orientation: Orientation.Portrait,
}

export const studioReducer = createReducer<StudioState>(
    initialState,

    on(StudioActions.SetBackgroundSizeRatio, (state, action): StudioState => {
        return {
            ...state,
            backgroundSizeRatio: action.backgroundSizeRatio,
        }
    }),
    on(StudioActions.SetAspectRatio, (state, action): StudioState => {
        return {
            ...state,
            aspectRatio: action.aspectRatio,
        }
    }),
    on(StudioActions.SetOrientation, (state, action): StudioState => {
        return {
            ...state,
            orientation: action.orientation,
        }
    }),

);
