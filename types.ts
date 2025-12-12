export enum Sex {
  Male = 'ذكر',
  Female = 'أنثى'
}

export enum Status {
  Active = 'نشط',
  Breeding = 'إنتاج',
  Lost = 'مفقود',
  Sold = 'مباع'
}

export interface User {
  name: string;
  email: string;
  loftName: string; // اسم اللوفت (المسكن)
  photoUrl?: string;
}

export interface RaceResult {
  id: string;
  date: string;
  releaseLocation: string; // اسم منطقة الاطلاق
  stage: string; // المرحلة
  rank: number; // الرتبة
  velocity: number; // السرعة
}

export interface ImportedResult extends Omit<RaceResult, 'id'> {
  ringNumber: string;
}

export interface Pigeon {
  id: string;
  ringNumber: string;
  color: string;
  strain: string; // السلالة
  sex: Sex;
  hatchDate: string;
  status: Status;
  notes?: string;
  raceResults?: RaceResult[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface VelocityResult {
  velocity: number; // m/min
  flightTimeMinutes: number;
}