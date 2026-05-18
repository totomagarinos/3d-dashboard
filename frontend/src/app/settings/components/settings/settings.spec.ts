import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Settings } from '../../models/settings.model';
import { SettingsService } from '../../services/settings.service';
import { Settings as SettingsComponent } from './settings';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), SettingsService],
    }).compileComponents();

    service = TestBed.inject(SettingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function initComponent() {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    // Flush the GET request from loadSettings()
    const req = httpMock.expectOne(apiUrl);
    req.flush(mockSettings);

    fixture.detectChanges();
  }

  it('should render the title "Ajustes / Costos Fijos"', () => {
    initComponent();
    const titleEl = fixture.debugElement.query(By.css('h1'));
    expect(titleEl).not.toBeNull();
    expect(titleEl.nativeElement.textContent).toContain('Ajustes / Costos Fijos');
  });

  it('should render all 6 CustomInput fields with correct labels', () => {
    initComponent();
    const labels = fixture.debugElement.queryAll(By.css('label'));
    const labelTexts = labels.map((l) => l.nativeElement.textContent.trim());

    expect(labelTexts).toContain('Precio electricidad');
    expect(labelTexts).toContain('Consumo impresora');
    expect(labelTexts).toContain('Desgaste máquina');
    expect(labelTexts).toContain('Precio impresora');
    expect(labelTexts).toContain('Margen de error');
    expect(labelTexts).toContain('Costo mano de obra');
  });

  it('should pre-populate form fields from service data on init', fakeAsync(() => {
    initComponent();
    tick();

    const formValue = component.calculatorForm.getRawValue();
    expect(formValue.electricityPricePerKwH).toBe(140);
    expect(formValue.consumptionWatts).toBe(120);
    expect(formValue.machineWearPerHour).toBe(4320);
    expect(formValue.partsPrice).toBe(150000);
    expect(formValue.errorMarginPercentage).toBe(5);
    expect(formValue.laborCostPerHour).toBe(2000);
  }));

  it('should disable submit button while loading', fakeAsync(() => {
    initComponent();
    tick();

    component.loading.set(true);
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(
      By.css('button[type="submit"]'),
    );
    expect(submitBtn).not.toBeNull();
    expect(submitBtn.nativeElement.disabled).toBeTrue();
  }));

  it('should enable submit button when not loading', fakeAsync(() => {
    initComponent();
    tick();

    component.loading.set(false);
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(
      By.css('button[type="submit"]'),
    );
    expect(submitBtn.nativeElement.disabled).toBeFalse();
  }));

  it('should display error message when error signal is set', fakeAsync(() => {
    initComponent();
    tick();

    component.error.set('Failed to save settings');
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('[role="alert"]'));
    expect(errorEl).not.toBeNull();
    expect(errorEl.nativeElement.textContent).toContain('Failed to save settings');
  }));

  it('should display success message when successMessage signal is set', fakeAsync(() => {
    initComponent();
    tick();

    component.successMessage.set('Settings saved!');
    fixture.detectChanges();

    const successEl = fixture.debugElement.query(By.css('.text-green-400'));
    expect(successEl).not.toBeNull();
    expect(successEl.nativeElement.textContent).toContain('Settings saved!');
  }));

  it('should call updateSettings on form submit with full form data', fakeAsync(() => {
    initComponent();
    tick();

    spyOn(service, 'updateSettings').and.callThrough();

    // Change a field
    component.calculatorForm.controls.electricityPricePerKwH.setValue(200);
    fixture.detectChanges();

    component.onSubmit();

    const patchReq = httpMock.expectOne(apiUrl);
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body.electricityPricePerKwH).toBe(200);
    expect(patchReq.request.body.consumptionWatts).toBe(120);
    patchReq.flush({ ...mockSettings, electricityPricePerKwH: 200 });
    tick();

    expect(service.updateSettings).toHaveBeenCalled();
  }));

  it('should set loading=true during submit and loading=false after completion', fakeAsync(() => {
    initComponent();
    tick();

    component.onSubmit();

    expect(component.loading()).toBeTrue();

    const patchReq = httpMock.expectOne(apiUrl);
    patchReq.flush(mockSettings);
    tick();

    expect(component.loading()).toBeFalse();
  }));

  it('should set successMessage and clear it after 3 seconds', fakeAsync(() => {
    jasmine.clock().install();
    initComponent();
    tick();

    component.onSubmit();

    const patchReq = httpMock.expectOne(apiUrl);
    patchReq.flush(mockSettings);
    tick();

    expect(component.successMessage()).toBe('Settings saved!');

    jasmine.clock().tick(3000);
    expect(component.successMessage()).toBeNull();

    jasmine.clock().uninstall();
  }));
});
