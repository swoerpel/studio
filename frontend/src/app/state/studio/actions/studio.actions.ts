import { Point } from '@angular/cdk/drag-drop';
import {createAction, props} from '@ngrx/store';
import { Alignment, Orientation } from 'src/app/shared/models';

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
export const SetTextBlockPosition = createAction(
    '[Studio] Set Text Block Position',
    props<{id: string; position: Point;}>()
)
export const SetTextBlockValue = createAction(
    '[Studio] Set Text Block Value',
    props<{id: string; text: string;}>()
)
export const UpdateTextBlockFontSize = createAction(
    '[Studio] Update Text Block Font Size',
    props<{id: string; increase: boolean}>()
)