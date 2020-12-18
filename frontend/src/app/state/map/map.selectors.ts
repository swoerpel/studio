import { createFeatureSelector, createSelector } from "@ngrx/store"
import { MapState} from './Map.reducer';

const mapFeatureState = createFeatureSelector<MapState>('map');

export const GetBackgroundSizeRatio = createSelector(
    mapFeatureState,
    (state: MapState): any => state.backgroundSizeRatio
)

export const GetAspectRatio = createSelector(
    mapFeatureState,
    (state: MapState): any => state.aspectRatio
)

export const GetOrientation = createSelector(
    mapFeatureState,
    (state: MapState): any => state.orientation
)