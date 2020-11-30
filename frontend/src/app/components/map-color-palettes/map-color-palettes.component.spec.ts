import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapColorPalettesComponent } from './map-color-palettes.component';

describe('MapColorPalettesComponent', () => {
  let component: MapColorPalettesComponent;
  let fixture: ComponentFixture<MapColorPalettesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapColorPalettesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapColorPalettesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
