import { createReducer, on } from "@ngrx/store";
import { StudioActions} from './actions';

export interface StudioState {
}

const initialState: StudioState = {
}

export const studioReducer = createReducer<StudioState>(
    initialState,

    on(StudioActions.DefaultAction, (state, action): StudioState => {
        return {
            ...state,
        }
    }),

);
