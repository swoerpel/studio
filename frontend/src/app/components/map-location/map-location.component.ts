import { Component, OnInit } from '@angular/core';

enum Tab{
  Markers,
  Routes
}

@Component({
  selector: 'app-map-location',
  templateUrl: './map-location.component.html',
  styleUrls: ['./map-location.component.scss']
})
export class MapLocationComponent implements OnInit {

  public Tab = Tab;

  public activeTab: Tab = Tab.Markers; 

  constructor() { }

  ngOnInit(): void {
  }

}
