import { createFeatureSelector, createSelector } from "@ngrx/store"
import { Dims, Orientation } from '../../../shared/models';
import { LocationState } from '../location.reducer';

const locationFeatureState = createFeatureSelector<LocationState>('location');

export const GetCenter = createSelector(
    locationFeatureState,
    (state: LocationState): any => state.center
)

export const GetZoom = createSelector(
    locationFeatureState,
    (state: LocationState): any => state.zoom
)

export const AddressUpdated = createSelector(
    locationFeatureState,
    (state: LocationState): any => state.address
)
