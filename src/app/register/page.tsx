import { RegisterForm } from "@/components/auth/register-form";
import { AuthHeading } from "@/components/auth/auth-heading";
import Link from "next/link";

export const metadata = {
  title: "Inscription — EXTRAPRO",
  description: "Creez votre compte professionnel EXTRAPRO.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background py-8">
      <div className="max-w-sm w-full mx-auto p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-primary to-primary-dark flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="font-bold text-xl text-text-primary tracking-tight">
            EXTRAPRO
          </span>
        </Link>

        {/* Heading */}
        <AuthHeading translationKey="auth.register" />

        {/* Form */}
        <RegisterForm />
      </div>
    </main>
  );
}
