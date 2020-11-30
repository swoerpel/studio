import { createFeatureSelector, createSelector } from "@ngrx/store"
import { Dim } from 'src/app/shared/models';
import { Orientation, StudioState} from './studio.reducer';

const studioFeatureState = createFeatureSelector<StudioState>('studio');

export const GetBackgroundSizeRatio = createSelector(
    studioFeatureState,
    (state: StudioState): any => state.backgroundSizeRatio
)

export const GetAspectRatio = createSelector(
    studioFeatureState,
    (state: StudioState): any => state.aspectRatio
)

export const GetOrientation = createSelector(
    studioFeatureState,
    (state: StudioState): any => state.orientation
)

export const GetBackgroundSize = createSelector(
    studioFeatureState,
    GetAspectRatio,
    GetBackgroundSizeRatio,
    GetOrientation,
    (state: StudioState, aspectRatio, backgroundSizeRatio, orientation): any => {
        let dims: Dim = {
            width: aspectRatio,
            height: 1 * backgroundSizeRatio,
        }
        if(orientation === Orientation.Landscape){
            dims = {
                width: 1,
                height: aspectRatio * backgroundSizeRatio,
            }
        }
        console.log('dims',dims)
        if(dims.width > dims.height){
            console.log('width > height')
            return {
                widthRatio: 1,
                heightRatio: dims.height / dims.width
            }
        }
        else{
            console.log('height > width')
            return {
                widthRatio: dims.height / dims.width,
                heightRatio: 1
            }
        }
    }
)
