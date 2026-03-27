import { z } from "zod/v4";

const frenchPhoneRegex =
  /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export const loginSchema = z.object({
  email: z.email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caracteres"),
});

export const registerSchema = z.object({
  company_name: z.string().min(1, "Le nom de l'entreprise est requis"),
  company_type: z.enum(
    ["restaurant", "hotel", "traiteur", "evenementiel", "autre"],
    { error: "Veuillez choisir un type d'entreprise" }
  ),
  contact_name: z.string().min(1, "Le nom du contact est requis"),
  email: z.email("Adresse email invalide"),
  phone: z
    .string()
    .regex(frenchPhoneRegex, "Numero de telephone francais invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caracteres"),
  accept_terms: z.literal(true, {
    error: "Vous devez accepter les conditions d'utilisation",
  }),
});

export const createAdSchema = z
  .object({
    profession_id: z.string().min(1, "Veuillez choisir une profession"),
    city_id: z.string().min(1, "Veuillez choisir une ville"),
    new_city_name: z.string().optional(),
    new_city_postal_code: z.string().optional(),
    work_date: z.string().min(1, "La date de travail est requise"),
    work_end_date: z.string().optional(),
    start_time: z.string().min(1, "L'heure de debut est requise"),
    end_time: z.string().min(1, "L'heure de fin est requise"),
    salary: z.coerce.number().positive("Le salaire doit etre positif"),
    salary_type: z.enum(["hourly", "daily", "flat"]),
    contact_phone: z
      .string()
      .regex(frenchPhoneRegex, "Numero de telephone francais invalide"),
    contact_name: z.string().optional(),
    required_skill: z.string().max(200, "Maximum 200 caracteres").optional(),
    description: z.string().max(500, "Maximum 500 caracteres").optional(),
    is_urgent: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const today = new Date().toISOString().split("T")[0];
      return data.work_date >= today;
    },
    { message: "La date doit etre aujourd'hui ou dans le futur", path: ["work_date"] }
  )
  .refine(
    (data) => {
      if (data.work_end_date) return data.work_end_date >= data.work_date;
      return true;
    },
    { message: "La date de fin doit etre apres la date de debut", path: ["work_end_date"] }
  )
  .refine((data) => data.end_time > data.start_time, {
    message: "L'heure de fin doit etre apres l'heure de debut",
    path: ["end_time"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateAdInput = z.infer<typeof createAdSchema>;
