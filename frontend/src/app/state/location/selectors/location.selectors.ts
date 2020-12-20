import { createFeatureSelector, createSelector } from "@ngrx/store"
import { Bounds, Dims, LatLng, Orientation, Point } from '../../../shared/models';
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

// There are two ways of declaring a location, with
// zoom & center, or just the bounds object. 
// the next two selectors reflect these different methods
export const GetLocation = createSelector(
    locationFeatureState,
    (state: LocationState): any => ({center:state.center,zoom: state.zoom})
)
export const GetBounds = createSelector(
    locationFeatureState,
    (state: LocationState): any => state.bounds
)



export const AddressUpdated = createSelector(
    locationFeatureState,
    (state: LocationState): any => state.address
)
export const GetDefaultLocation = createSelector(
    GetCenter,
    GetZoom,
    GetBounds,
    (
        center:LatLng, 
        zoom: number, 
        bounds: Bounds
    ): any => ({center,zoom,bounds})
)




