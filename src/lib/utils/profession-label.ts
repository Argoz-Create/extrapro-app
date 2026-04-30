import type { Profession } from "@/lib/types/database";

type LangLike = "fr" | "en";
type PartialProfession = Pick<Profession, "name_fr" | "name_en">;

export function professionLabel(
  profession: PartialProfession | null | undefined,
  lang: LangLike
): string {
  if (!profession) return "";
  if (lang === "en" && profession.name_en) return profession.name_en;
  return profession.name_fr;
}
