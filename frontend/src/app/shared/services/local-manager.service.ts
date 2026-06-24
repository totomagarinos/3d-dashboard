import { Injectable } from '@angular/core';

export enum LocalKeys {
  ACCESS_TOKEN = 'token',
  REFRESH_TOKEN = 'refreshToken',
}

@Injectable({
  providedIn: 'root',
})
export class LocalManager {
  getData<T>(key: string): T | null {
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
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
    } catch (error) {
      console.log('Error setting data in localStorage');
    }
  }

  removeData(key: string): void {
    localStorage.removeItem(key);
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
