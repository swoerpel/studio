import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapColorAssignmentComponent } from './map-color-assignment.component';

describe('MapColorAssignmentComponent', () => {
  let component: MapColorAssignmentComponent;
  let fixture: ComponentFixture<MapColorAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapColorAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapColorAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
