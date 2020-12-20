import { Injectable } from '@angular/core';
import { COLOR_INDEX_MAPPING } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class MapStylingService {

  constructor() { }

  public generateStyles(colors: string[] = ["#e95145","#f6bf7a","#589da1","#f5d9bc","#f5ede1","#000001"]){
    if(!colors || colors.length === 0){ return []; }
    return [
        { "featureType": "all", "elementType": "labels", "stylers": [{"visibility": "off"}]},
        { "featureType": "administrative", "elementType": "all", "stylers": [{"visibility": "off"}]},
        { "featureType": "transit", "elementType": "all", "stylers": [{"visibility": "off"}]},        
        { "featureType": "road", "stylers": [{"color": colors[COLOR_INDEX_MAPPING.road]}]},
        { "featureType": "water","stylers": [{"color": colors[COLOR_INDEX_MAPPING.water]}]},
        { "featureType": "landscape.natural","stylers": [{"color": colors[COLOR_INDEX_MAPPING.natural]}]},
        { "featureType": "landscape.man_made","stylers": [{"color": colors[COLOR_INDEX_MAPPING.man_made]}]},
        { "featureType": "poi", "stylers": [{"color": colors[COLOR_INDEX_MAPPING.poi]}]},
    ];
  }
}
