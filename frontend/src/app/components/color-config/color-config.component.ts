import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ColorPalette } from 'src/app/shared/models';
import { ColorActions } from 'src/app/state/color/actions';
import { ColorState } from 'src/app/state/color/color.reducer';
import { ColorSelectors } from 'src/app/state/color/selectors';

import { DIALOG_CONTAINER } from '../../shared/constants';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-color-config',
  templateUrl: './color-config.component.html',
  styleUrls: ['./color-config.component.scss']
})
export class ColorConfigComponent implements OnInit {
  
  public activeColorPalettes$: Observable<ColorPalette[]>;
  public selectedActivePaletteId$: Observable<string>;
  
  constructor(
    private colorStore: Store<ColorState>,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.activeColorPalettes$ = this.colorStore.select(ColorSelectors.GetActiveColorPalettes)
    this.selectedActivePaletteId$ = this.colorStore.select(ColorSelectors.GetSelectedActivePaletteId)
  }

  selectActivePalette(palette){
    this.colorStore.dispatch(ColorActions.SetSelectedActivePalette({colorPaletteId: palette.id}))
  }

  public addColorPalettes(){
    this.dialog.open(
      DialogComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
      data:{
        component: 'app-map-color-palettes',
        title: 'Add Color Palettes'
      }
    }).afterClosed().pipe().subscribe();;

  }

  public viewColorAssignments(){
    this.dialog.open(
      DialogComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
      data:{
        component: 'app-map-color-assignment',
        title: 'Assign Map Colors'
      }
    }).afterClosed().pipe().subscribe();
  }

}
