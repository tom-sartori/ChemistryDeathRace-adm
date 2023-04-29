import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsListToolbarComponent } from './questions-list-toolbar.component';

describe('QuestionsListToolbarComponent', () => {
  let component: QuestionsListToolbarComponent;
  let fixture: ComponentFixture<QuestionsListToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionsListToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsListToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
