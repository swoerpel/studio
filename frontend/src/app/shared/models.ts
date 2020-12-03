export enum MapTextType {LatLng, CityName, Custom}

export enum Alignment {
    HorizontalLeft,
    HorizontalCenter,
    HorizontalRight,
    VerticalTop,
    VerticalCenter,
    VerticalBottom,
}

export enum Orientation { Portrait, Landscape }
export interface PrintSize {
    name: string;
    aspectRatio: number;
    viewingDistance: number; // in feet for now
    dims: Dim;
    type: string;
}

export interface TextBlock{
    id: string;
    text: string;
    fontSize: number;
    letterSpacing: number;
    fontWeight: number;
    position: Point;
    dimensions: Dim;
}

export interface Dim{
    width: number;
    height: number;
}

export interface Point{
    x?: number;
    y?: number;
}
