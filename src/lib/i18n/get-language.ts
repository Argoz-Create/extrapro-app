import { cookies } from "next/headers";

export async function getLanguage(): Promise<"fr" | "en"> {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get("extrapro-lang")?.value as "fr" | "en" | undefined;
    if (lang === "en" || lang === "fr") {
      return lang;
    }
  } catch {
    // SSR or cookies not available
  }
  return "fr"; // Default to French
}
