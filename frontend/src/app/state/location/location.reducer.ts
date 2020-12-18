import { createReducer, on } from "@ngrx/store";
import { DEFAULT_FONT_SIZE, DEFAULT_FONT_WEIGHT, DEFAULT_LETTER_SPACING, FONT_SIZE_INCREMENT, FONT_WEIGHT_INCREMENT, LETTER_SPACING_SIZE_INCREMENT, MAX_FONT_WEIGHT, MIN_FONT_WEIGHT } from 'src/app/shared/constants';
import { makeid } from 'src/app/shared/helpers';
import { Orientation, TextBlock } from 'src/app/shared/models';
import { LocationActions} from './actions';


export interface LocationState {
}

const initialState: LocationState = {

}

export const locationReducer = createReducer<LocationState>(
    initialState,
    // on(LocationActions.default, (state, action): LocationState => {
    //     return {
    //         ...state,
    //     }
    // }),
);
