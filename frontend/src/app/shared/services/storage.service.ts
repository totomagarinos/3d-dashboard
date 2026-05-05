import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  getData<T>(key: string): T | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        return JSON.parse(savedData);
      }
      return null;
    } catch (error) {
      console.error('Error reading localStorage', error);
      return null;
    }
  }

  setData<T>(key: string, data: T): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
    } catch (error) {
      console.log('Error setting data in localStorage');
    }
  }

  removeData(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.removeItem(key);
  }
}
