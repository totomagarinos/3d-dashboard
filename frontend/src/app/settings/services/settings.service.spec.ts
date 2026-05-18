import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SettingsService } from './settings.service';
import { Settings } from '../models/settings.model';

describe('SettingsService', () => {
  let service: SettingsService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:4000/api/settings';

  const mockSettings: Settings = {
    electricityPricePerKwH: 140,
    consumptionWatts: 120,
    machineWearPerHour: 4320,
    partsPrice: 150000,
    errorMarginPercentage: 5,
    laborCostPerHour: 2000,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), SettingsService],
    });

    service = TestBed.inject(SettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('loadSettings()', () => {
    it('should fetch settings via GET and populate settingsData signal', fakeAsync(() => {
      service.loadSettings();

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockSettings);

      tick();

      const result = service.settingsData();
      expect(result).toEqual(mockSettings);
    }));

    it('should keep settingsData as null on network error', fakeAsync(() => {
      service.loadSettings();

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('Network error'));

      tick();

      const result = service.settingsData();
      expect(result).toBeNull();
    }));
  });

  describe('updateSettings()', () => {
    it('should PATCH the full data and update settingsData on success', fakeAsync(() => {
      const updatedSettings: Settings = {
        electricityPricePerKwH: 200,
        consumptionWatts: 150,
        machineWearPerHour: 5000,
        partsPrice: 200000,
        errorMarginPercentage: 10,
        laborCostPerHour: 2500,
      };

      let result: Settings | undefined;

      service.updateSettings(updatedSettings).subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updatedSettings);
      req.flush(updatedSettings);

      tick();

      expect(result).toEqual(updatedSettings);
      expect(service.settingsData()).toEqual(updatedSettings);
    }));

    it('should NOT update settingsData on PATCH error', fakeAsync(() => {
      // First load initial settings
      service.loadSettings();
      const loadReq = httpMock.expectOne(apiUrl);
      loadReq.flush(mockSettings);
      tick();
      expect(service.settingsData()).toEqual(mockSettings);

      let errorCaught = false;

      service.updateSettings({ electricityPricePerKwH: 999 }).subscribe({
        error: () => {
          errorCaught = true;
        },
      });

      const patchReq = httpMock.expectOne(apiUrl);
      patchReq.error(new ProgressEvent('Update failed'));
      tick();

      expect(errorCaught).toBeTrue();
      // settingsData should remain the initial value
      expect(service.settingsData()).toEqual(mockSettings);
    }));

    it('should return an Observable that emits the updated settings on success', fakeAsync(() => {
      const partialUpdate: Partial<Settings> = { electricityPricePerKwH: 999 };
      const returnedSettings: Settings = {
        ...mockSettings,
        electricityPricePerKwH: 999,
      };

      let emittedValue: Settings | undefined;

      service.updateSettings(partialUpdate).subscribe((val) => {
        emittedValue = val;
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(returnedSettings);
      tick();

      expect(emittedValue).toEqual(returnedSettings);
    }));
  });
});
