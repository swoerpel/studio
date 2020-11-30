import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTextComponent } from './map-text.component';

describe('MapTextComponent', () => {
  let component: MapTextComponent;
  let fixture: ComponentFixture<MapTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
