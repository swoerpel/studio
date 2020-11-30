import { createFeatureSelector, createSelector } from "@ngrx/store"
import { StudioState} from './studio.reducer';

const studioFeatureState = createFeatureSelector<StudioState>('map');

export const defaultSelector = createSelector(
    studioFeatureState,
    (state: StudioState): any => null
    
)
