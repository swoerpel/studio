export interface PrintSize {
    name: string;
    aspectRatio: number;
    viewingDistance: number; // in feet for now
    dims: Dim;
    type: string;
}

export interface Dim{
    width: number;
    height: number;
}