import {createAction, props} from '@ngrx/store';
import { Alignment, Orientation, Point, TextBlockPosition } from 'src/app/shared/models';

// map layout & spacing
export const SetBackgroundSizeRatio = createAction(
    '[Studio] Set Background Size Ratio',
    props<{backgroundSizeRatio: number}>()
)
export const SetAspectRatio = createAction(
    '[Studio] Set Aspect Ratio',
    props<{aspectRatio: number}>()
)
export const SetOrientation = createAction(
    '[Studio] Set Orientation',
    props<{orientation: Orientation}>()
)
// export const SetTextAreaPadding = createAction(
//     '[Studio] Set Text Area Padding',
//     props<{textAreaPadding: number;}>()
// )

// map text area
export const CreateTextBlock = createAction(
    '[Studio] Create New Text Block',
    props<{id: string; text: string;}>()
)
export const DeleteTextBlock = createAction(
    '[Studio] Delete Text Block',
    props<{id: string;}>()
)
export const SetSelectedTextBlockId = createAction(
    '[Studio] Set Selected Text Block Id',
    props<{id: string;}>()
)
export const SetTextBlockOrigin = createAction(
    '[Studio] Set Text Block Origin',
    props<{id: string; origin: Point;}>()
)
export const SetTextBlockValue = createAction(
    '[Studio] Set Text Block Value',
    props<{id: string; text: string;}>()
)
export const UpdateTextBlockFontSize = createAction(
    '[Studio] Update Text Block Font Size',
    props<{id: string; increase: boolean}>()
)
export const UpdateTextBlockLetterSpacing = createAction(
    '[Studio] Update Text Block Letter Spacing',
    props<{id: string; increase: boolean}>()
)
export const UpdateTextBlockFontWeight = createAction(
    '[Studio] Update Text Block Font Weight',
    props<{id: string; increase: boolean}>()
)
// export const SetTextBlockPosition = createAction(
//     '[Studio] Set Text Block Position',
//     props<{id: string; position: TextBlockPosition;}>()
// )
export const SetTextBlockPosition = createAction(
    '[Studio] Set Text Block Position',
    props<{id: string; position: Point;}>()
)