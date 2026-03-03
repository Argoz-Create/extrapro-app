import { Card } from "@/components/ui/card";

type StatCardProps = {
  icon: string;
  value: string;
  label: string;
};

export function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <Card className="p-4 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="mt-1 text-xl font-bold text-primary">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </Card>
  );
}
