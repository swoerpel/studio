import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DIALOG_CONTAINER } from '../../shared/constants';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-color-config',
  templateUrl: './color-config.component.html',
  styleUrls: ['./color-config.component.scss']
})
export class ColorConfigComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
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
