import { Component, OnInit } from '@angular/core';
import { completeColorPalettes } from '../../shared/colors'; 
import{ makeid } from '../../shared/helpers';
import { head, last} from 'lodash';
import { ColorState } from 'src/app/state/color/color.reducer';
import { ColorSelectors } from 'src/app/state/color/selectors';
import { Store } from '@ngrx/store';
import { ColorPalette } from 'src/app/shared/models';
import { Observable } from 'rxjs';
import { ColorActions } from 'src/app/state/color/actions';
@Component({
  selector: 'app-map-color-palettes',
  templateUrl: './map-color-palettes.component.html',
  styleUrls: ['./map-color-palettes.component.scss']
})
export class MapColorPalettesComponent implements OnInit {

  public activeColorPalettes$: Observable<ColorPalette[]>;
  public staticColorPalettes$: Observable<ColorPalette[]>;
  public selectedActivePaletteId$: Observable<string>;
  public selectedStaticPaletteId$: Observable<string>;

  constructor(
    private colorStore: Store<ColorState>,
  ) { }

  ngOnInit(): void {
    this.activeColorPalettes$ = this.colorStore.select(ColorSelectors.GetActiveColorPalettes)
    this.staticColorPalettes$ = this.colorStore.select(ColorSelectors.GetStaticColorPalettes)
    this.selectedActivePaletteId$ = this.colorStore.select(ColorSelectors.GetSelectedActivePaletteId)
    this.selectedStaticPaletteId$ = this.colorStore.select(ColorSelectors.GetSelectedStaticPaletteId)
  }

  selectStaticPalette(palette){
    this.colorStore.dispatch(ColorActions.SetSelectedStaticPalette({colorPaletteId: palette.id}))
  }

  selectActivePalette(palette){
    this.colorStore.dispatch(ColorActions.SetSelectedActivePalette({colorPaletteId: palette.id}))
  }

  applySelectedColor(){
    this.colorStore.dispatch(ColorActions.ApplySelectedStaticPalette())
  }

  unapplySelectedColor(){
    this.colorStore.dispatch(ColorActions.UnapplySelectedActivePalette())
  }

}
