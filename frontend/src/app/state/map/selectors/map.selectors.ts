import { createFeatureSelector, createSelector } from "@ngrx/store"
import { Dims, Orientation } from "src/app/shared/models";
import { MapState} from '../map.reducer';

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


export const GetBackgroundSize = createSelector(
    mapFeatureState,
    GetAspectRatio,
    GetBackgroundSizeRatio,
    GetOrientation,
    (state: MapState, aspectRatio, backgroundSizeRatio, orientation): any => {
        let dims: Dims = {
            width: aspectRatio,
            height: 1 * backgroundSizeRatio,
        }
        if(orientation === Orientation.Landscape){
            dims = {
                width: 1,
                height: aspectRatio * backgroundSizeRatio,
            }
        }
        return (dims.width > dims.height) ? dims.height / dims.width : 1
    }
)

export const GetMapDisplaySize = createSelector(
    mapFeatureState,
    GetAspectRatio,
    GetBackgroundSizeRatio,
    GetOrientation,
    (state: MapState, aspectRatio, backgroundSizeRatio, orientation): any => {
        let dims: Dims = {
            width: aspectRatio,
            height: 1 * (1 - backgroundSizeRatio),
        } 
        if(orientation === Orientation.Landscape){
            dims = {
                width: 1,
                height: aspectRatio * (1 - backgroundSizeRatio),
            }
        }
        return dims.height / dims.width;
    }
)
