import { createReducer, on } from "@ngrx/store";
import { completeColorPalettes } from "src/app/shared/colors";
import { ColorPalette } from "src/app/shared/models";
import { ColorActions } from './actions';
import { head, last } from 'lodash';
import { makeid } from "src/app/shared/helpers";


var concatId = (id: string) => {
    return id + '_' + makeid()
}

const cpIndex = 26;
// const cpIndex = Math.floor(Math.random() * completeColorPalettes.length);
const initialActivePalette: ColorPalette = {...completeColorPalettes[cpIndex], id: concatId(completeColorPalettes[cpIndex].id)};

export interface ColorState {
    staticColorPalettes: ColorPalette[];
    activeColorPalettes: ColorPalette[];
    selectedStaticPaletteId: string;
    selectedActivePaletteId: string;
}

const initialState: ColorState = {
    activeColorPalettes: [initialActivePalette],
    staticColorPalettes: completeColorPalettes,
    selectedStaticPaletteId: head(completeColorPalettes).id,
    selectedActivePaletteId: initialActivePalette.id,
}

export const colorReducer = createReducer<ColorState>(
    initialState,
    on(ColorActions.SetSelectedStaticPalette, (state, action): ColorState => {
        return {
            ...state,
            selectedStaticPaletteId: action.colorPaletteId
        }
    }),
    on(ColorActions.SetSelectedActivePalette, (state, action): ColorState => {
        return {
            ...state,
            selectedActivePaletteId: action.colorPaletteId
        }
    }),
    on(ColorActions.ApplySelectedStaticPalette, (state): ColorState => {
        let cp: ColorPalette = state.staticColorPalettes.find((cp: ColorPalette) => cp.id === state.selectedStaticPaletteId);
        cp = {...cp, id: concatId(cp.id)};
        return {
            ...state,
            activeColorPalettes: [...state.activeColorPalettes, cp],
            selectedActivePaletteId: cp.id,
        }
    }),
    on(ColorActions.UnapplySelectedActivePalette, (state): ColorState => {
        let activeColorPalettes = state.activeColorPalettes.filter((cp: ColorPalette, i: number) => cp.id !== state.selectedActivePaletteId);
        return {
            ...state,
            activeColorPalettes,
            selectedActivePaletteId: activeColorPalettes.length > 0 ? last(activeColorPalettes).id : '',
        }
    }),
);
