export const COMPANY_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "hotel", label: "Hotel" },
  { value: "traiteur", label: "Traiteur" },
  { value: "evenementiel", label: "Evenementiel" },
  { value: "autre", label: "Autre" },
] as const;

export const JOB_STATUSES = {
  active: { label: "Actif", color: "green" },
  inactive: { label: "Inactif", color: "gray" },
  filled: { label: "Pourvue", color: "blue" },
  expired: { label: "Expire", color: "red" },
} as const;


export const SALARY_TYPES = [
  { value: "hourly", label: "Par heure" },
  { value: "daily", label: "Par jour" },
] as const;

export const DASHBOARD_TABS = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "Actives" },
  { value: "inactive", label: "Inactives" },
  { value: "filled", label: "Pourvues" },
] as const;
