import {createAction, props} from '@ngrx/store';
import { Alignment, Dims, Orientation, Point } from 'src/app/shared/models';

export const CreateTextBlock = createAction(
    '[Text] Create New Text Block',
    props<{id: string; text: string;}>()
)
export const DeleteTextBlock = createAction(
    '[Text] Delete Text Block',
    props<{id: string;}>()
)
export const SetSelectedTextBlockId = createAction(
    '[Text] Set Selected Text Block Id',
    props<{id: string;}>()
)
export const SetTextBlockOrigin = createAction(
    '[Text] Set Text Block Origin',
    props<{id: string; origin: Point;}>()
)
export const SetTextBlockValue = createAction(
    '[Text] Set Text Block Value',
    props<{id: string; text: string;}>()
)
export const UpdateTextBlockFontSize = createAction(
    '[Text] Update Text Block Font Size',
    props<{id: string; increase: boolean}>()
)
export const UpdateTextBlockLetterSpacing = createAction(
    '[Text] Update Text Block Letter Spacing',
    props<{id: string; increase: boolean}>()
)
export const UpdateTextBlockFontWeight = createAction(
    '[Text] Update Text Block Font Weight',
    props<{id: string; increase: boolean}>()
)
export const SetTextBlockPosition = createAction(
    '[Text] Set Text Block Position',
    props<{id: string; position: Point;}>()
)
export const SetTextBlockDimensions = createAction(
    '[Text] Set Text Block Dimensions',
    props<{id: string; dimensions: Dims;}>()
)