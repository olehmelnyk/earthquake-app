export interface Earthquake {
  id: string;
  title: string;
  magnitude: number;
  depth: number;
  location: string;
  date: string;
  description?: string;
}

export interface FilterValues {
  location?: string;
  minMagnitude?: number;
  maxMagnitude?: number;
  startDate?: string;
  endDate?: string;
}
