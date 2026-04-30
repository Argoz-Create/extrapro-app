import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type StatCardProps = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <Card className="p-4 text-center">
      <div className="flex justify-center mb-2">
        <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
      </div>
      <p className="mt-1 text-xl font-display font-bold text-success">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </Card>
  );
}
