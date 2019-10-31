import { async } from '@angular/core/testing';
import { HelpComponent } from './help.component';

describe('Help Component', () => {
  it('should return the Help Component', async(() => {

    const help = HelpComponent;
    expect(help).toHaveLength(2)
  }))
});