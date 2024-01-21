import { writable, type Writable } from 'svelte/store';

export interface ApiConfig {
  endpoint: string;
  apiKey: string;
}

export interface AppSettings {
  refreshRate: number;
  apiConfig: ApiConfig;
}

// Default settings
const defaultSettings: AppSettings = {
  refreshRate: 5000,
  apiConfig: {
    endpoint: 'https://api.example.com',
    apiKey: 'your-api-key',
  },
};

export const settings: Writable<AppSettings> = writable(defaultSettings);