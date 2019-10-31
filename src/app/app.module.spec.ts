import { async } from '@angular/core/testing';
import { AppModule } from './app.module';

describe('App Module', () => {
  it('should return the app module ', async(() => {

    const app = AppModule;
    expect(app).toHaveLength(0)
    expect(app).toBeTruthy()
  }))
});