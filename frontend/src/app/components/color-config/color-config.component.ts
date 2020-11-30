import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MapColorPalettesComponent } from '../map-color-palettes/map-color-palettes.component';
import { DIALOG_CONTAINER } from '../../shared/constants';
import { MapColorAssignmentComponent } from '../map-color-assignment/map-color-assignment.component';

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
    const dialogRef = this.dialog.open(
      MapColorPalettesComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  public viewColorAssignments(){
    const dialogRef = this.dialog.open(
      MapColorAssignmentComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
