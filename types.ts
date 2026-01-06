export enum DocType {
  NOTES = 'NOTES',
  EXAM = 'EXAM',
  BOOK = 'BOOK',
  SLIDE = 'SLIDE'
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  price: number; // 0 means free
  author: string;
  type: DocType;
  tags: string[];
  thumbnailUrl: string;
  aiSummary?: string;
  purchased: boolean;
  rating: number;
  boundDeviceId?: string; // DRM: Locked to this device ID upon purchase
}

export interface User {
  id: string;
  name: string;
  balance: number;
  library: string[]; // List of purchased document IDs
  deviceId: string; // The unique ID of the current logged-in device
}

export type ViewState = 'HOME' | 'MARKET' | 'LIBRARY' | 'UPLOAD';