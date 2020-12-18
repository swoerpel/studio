import { createReducer, on } from "@ngrx/store";
import { ColorActions } from './actions';

export interface ColorState {
}

const initialState: ColorState = {
}

export const colorReducer = createReducer<ColorState>(
    initialState,
    on(ColorActions.DefaultAction, (state, action): ColorState => {
        return {
            ...state,
        }
    }),
);
