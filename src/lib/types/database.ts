export type CompanyType =
  | "restaurant"
  | "hotel"
  | "traiteur"
  | "evenementiel"
  | "autre";

export type JobStatus = "active" | "inactive" | "filled" | "expired";

export type DonationStatus = "pending" | "confirmed" | "transferred";

export type SalaryType = "hourly" | "daily";

export interface Region {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  postal_code: string;
  region_id: string;
  created_at: string;
}

export interface Profession {
  id: string;
  name_fr: string;
  name_en: string;
  category: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Employer {
  id: string;
  auth_user_id: string;
  company_name: string;
  company_type: CompanyType;
  contact_name: string;
  email: string;
  phone: string;
  city_id: string | null;
  address: string | null;
  siret: string | null;
  is_verified: boolean;
  total_hires: number;
  total_donations: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobAd {
  id: string;
  employer_id: string;
  profession_id: string;
  city_id: string;
  title: string;
  description: string | null;
  work_date: string;
  start_time: string;
  end_time: string;
  hourly_rate: number | null;
  daily_rate: number | null;
  contact_phone: string;
  contact_name: string | null;
  status: JobStatus;
  is_urgent: boolean;
  view_count: number;
  call_click_count: number;
  hire_confirmed: boolean;
  donation_generated: boolean;
  published_at: string;
  expires_at: string | null;
  filled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobAdWithRelations extends JobAd {
  professions: Pick<Profession, "name_fr" | "icon">;
  cities: Pick<City, "name">;
}

export interface Donation {
  id: string;
  employer_id: string;
  job_ad_id: string | null;
  amount: number;
  currency: string;
  status: DonationStatus;
  charity_name: string;
  created_at: string;
  confirmed_at: string | null;
}

export interface PlatformStats {
  id: string;
  stat_date: string;
  total_ads_posted: number;
  total_ads_active: number;
  total_hires: number;
  total_donations: number;
  total_donation_amount: number;
  total_employers: number;
  total_call_clicks: number;
}

export interface EmployerStats {
  total_hires: number;
  total_donations: number;
  active_ads: number;
  total_views: number;
}
