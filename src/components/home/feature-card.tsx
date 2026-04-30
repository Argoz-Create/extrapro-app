import React from "react";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  text: string;
}

export function FeatureCard({ icon: Icon, title, text }: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-[#FAFAFA] px-4 py-3 text-center">
      <div className="mb-2 flex justify-center">
        <Icon className="h-6 w-6 text-primary" strokeWidth={2} />
      </div>
      <div className="font-semibold text-[#09090B]">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{text}</div>
    </div>
  );
}
