import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";

type StatCardProps = {
  icon: PhosphorIcon;
  value: string;
  label: string;
};

export function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <Card className="p-4 text-center">
      <div className="flex justify-center mb-2">
        <Icon size={20} weight="duotone" className="text-primary" />
      </div>
      <p className="mt-1 text-xl font-display font-bold text-success">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </Card>
  );
}
