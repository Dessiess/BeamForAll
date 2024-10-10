import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  }

  updateItem<T>(key: string, value: T): void {
    if (this.getItem(key) !== null) {
      this.setItem(key, value);
    } else {
      console.error(`No item found in localStorage for key "${key}"`);
    }
  }

  deleteItem(key: string): void {
    if (this.getItem(key) !== null) {
      localStorage.removeItem(key);
    } else {
      console.error(`No item found in localStorage for key "${key}"`);
    }
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
