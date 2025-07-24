declare module 'rwanda' {
  export const provinces: string[];
  
  export interface District {
    name: string;
    province: string;
  }
  
  export interface Sector {
    name: string;
    district: string;
  }
  
  export const districts: District[];
  export const sectors: Sector[];
} 