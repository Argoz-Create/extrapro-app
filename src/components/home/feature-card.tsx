interface FeatureCardProps {
  icon: string;
  title: string;
  text: string;
}

export function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-[#FAFAFA] px-4 py-3 text-center">
      <div className="mb-2 text-xl">{icon}</div>
      <div className="font-semibold text-[#09090B]">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{text}</div>
    </div>
  );
}
