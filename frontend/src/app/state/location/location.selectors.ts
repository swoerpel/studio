import { createFeatureSelector, createSelector } from "@ngrx/store"
import { Dims, Orientation } from '../../shared/models';
import { LocationState } from './location.reducer';

const locationFeatureState = createFeatureSelector<LocationState>('location');

export const DefaultSelector = createSelector(
    locationFeatureState,
    (state: LocationState): any => null
)
