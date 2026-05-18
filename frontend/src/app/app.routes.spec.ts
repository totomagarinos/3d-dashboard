import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { routes } from './app.routes';

describe('App Routes', () => {
  let router: Router;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:4000/api/settings';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should lazy-load SettingsComponent when navigating to /settings', fakeAsync(() => {
    router.navigateByUrl('/settings');
    tick();

    const req = httpMock.expectOne(apiUrl);
    req.flush({
      electricityPricePerKwH: 140,
      consumptionWatts: 120,
      machineWearPerHour: 4320,
      partsPrice: 150000,
      errorMarginPercentage: 5,
      laborCostPerHour: 2000,
    });
    tick();

    expect(router.url).toBe('/settings');
  }));
});
