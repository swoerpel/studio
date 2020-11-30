import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DIALOG_CONTAINER } from 'src/app/shared/constants';
import { MapLocationComponent } from '../map-location/map-location.component';
import { MapTextComponent } from '../map-text/map-text.component';

@Component({
  selector: 'app-map-config',
  templateUrl: './map-config.component.html',
  styleUrls: ['./map-config.component.scss']
})
export class MapConfigComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  public configureMapLocation(){
    const dialogRef = this.dialog.open(
      MapLocationComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  public configureMapText(){
    const dialogRef = this.dialog.open(
      MapTextComponent, {
      width: DIALOG_CONTAINER.WIDTH,
      height: DIALOG_CONTAINER.HEIGHT,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
