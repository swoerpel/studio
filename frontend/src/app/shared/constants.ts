import { PrintSize } from './models';

export const ASPECT_RATIOS =  [.647,.667,.675,.75,.8,1];

export const BACKGROUND_RATIO_STEP_SIZE = 0.05;

export const DIALOG_CONTAINER = {
    WIDTH: '80%',
    HEIGHT: '80%'
}

export const DEFAULT_FONT_SIZE = 4;
export const FONT_SIZE_INCREMENT = 0.25;

export const DEFAULT_LETTER_SPACING = 0;
export const LETTER_SPACING_SIZE_INCREMENT = 0.1;

export const DEFAULT_FONT_WEIGHT = 300;
export const MIN_FONT_WEIGHT = 300;
export const MAX_FONT_WEIGHT = 500;
export const FONT_WEIGHT_INCREMENT = 100;

export const MAP_TEXT_BOUNDARY_SIZE = 0.98;

export const PRINT_SIZES: PrintSize[] = [
    {
        name: 'small_poster',
        type: 'ansi_b',
        aspectRatio: .647,
        viewingDistance: 5,
        dims: {
            width: 11,
            height: 17,
        }
    },
    {
        name: 'small_medium_poster',
        type: '',
        aspectRatio: .8,
        viewingDistance: 10,
        dims: {
            width: 16,
            height: 20,
        }
    },
    {
        name: 'medium_poster',
        type: 'arch_c',
        aspectRatio: .75,
        viewingDistance: 15,
        dims: {
            width: 18,
            height: 24,
        }
    },
    {
        name: 'large_poster',
        type: 'arch_d',
        aspectRatio: .667,
        viewingDistance: 30,
        dims: {
            width: 24,
            height: 36,
        }
    },
    {
        name: 'movie_poster',
        type: 'one_sheet',
        aspectRatio: .675,
        viewingDistance: 50,
        dims: {
            width: 27,
            height: 40,
        }
    },
    {
        name: 'large_movie_poster',
        type: 'bus_stop',
        aspectRatio: .667,
        viewingDistance: 50,
        dims: {
            width: 40,
            height: 60,
        }
    },
]
