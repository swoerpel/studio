import { Component, OnInit } from '@angular/core';
import { completeColorPalettes } from '../../shared/colors'; 
import{ makeid } from '../../shared/helpers';
import { head, last} from 'lodash';
@Component({
  selector: 'app-map-color-palettes',
  templateUrl: './map-color-palettes.component.html',
  styleUrls: ['./map-color-palettes.component.scss']
})
export class MapColorPalettesComponent implements OnInit {

  public staticColorPalettes = completeColorPalettes.map((p,i)=>({
    ...p,
    selected: i === 0,
    id: makeid()
  }));
  public activeColorPalettes = [];
  public selectedStaticPaletteId = head(this.staticColorPalettes).id;
  public selectedActivePaletteId = '';
  constructor() { }

  ngOnInit(): void {
  }

  selectStaticPalette(palette){
    this.selectedStaticPaletteId = palette.id;
    this.staticColorPalettes.forEach((p)=>{
      if(p.id !== palette.id)
        p.selected = false;
      else
        p.selected = true;
    })
  }

  selectActivePalette(palette){
      this.selectedActivePaletteId = palette?.id;
      this.activeColorPalettes.forEach((p)=>{
        if(p.id !== palette.id)
          p.selected = false;
        else
          p.selected = true;
      })
  }

  applySelectedColor(){
    let palette = {
      ...this.staticColorPalettes.find((p)=>p.id ===this.selectedStaticPaletteId),
      id:makeid(),
    };
    this.activeColorPalettes.push(palette);
    this.selectActivePalette(palette)
  }

  unapplySelectedColor(){
    this.activeColorPalettes = this.activeColorPalettes.filter(
      (p) =>!(this.selectedActivePaletteId === p.id)
    );
    this.selectActivePalette(last(this.activeColorPalettes))

  }

}
