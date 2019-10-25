import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameOverComponent } from './gameOver.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        GameOverComponent
      ],
    }).compileComponents();
  }));
  it('should Game Over component', async(() => {
    const fixture = TestBed.createComponent(GameOverComponent);
    const comp = fixture.debugElement.componentInstance;
    expect(comp).toBeFalsy();
  }));
});