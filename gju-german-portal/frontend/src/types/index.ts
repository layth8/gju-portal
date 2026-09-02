export type GermanLevel = "B1" | "B2" | "TestDaF";

export type VisaCategory =
  | "Sperrkonto"
  | "Health Insurance"
  | "Embassy Appointment"
  | "Documents";

export interface Major {
  id: number;
  name: string;
  school: string;
}

export interface University {
  id: number;
  name: string;
  city: string;
  state: string;
  min_german_level: string;
  min_english_level: string;
  website_url: string;
  description: string;
  majors: Major[];
}

export interface UniversityCreate {
  name: string;
  city: string;
  state: string;
  min_german_level: string;
  min_english_level: string;
  website_url: string;
  description: string;
  major_ids: number[];
}

export type UniversityUpdate = Partial<UniversityCreate>;

export interface VisaStep {
  id: number;
  step_number: number;
  title: string;
  description: string;
  category: VisaCategory | string;
  recommended_weeks_before: number;
}

export interface UniversityFilters {
  major_id?: number;
  german_level?: string;
  city?: string;
}

export type AppTab = "explorer" | "language" | "visa" | "admin";
