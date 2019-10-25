import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { changeColor } from './node.model';

describe('Node Model', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        changeColor
      ],
    }).compileComponents();
  }));
  it('should output the radius if gray', async(() => {
    expect(changeColor).toEqual(2)
  }));
});