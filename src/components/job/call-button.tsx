"use client";

import { logCallClick } from "@/lib/actions/interactions";
import { useTranslation } from "@/lib/i18n/context";

type CallButtonProps = {
  phone: string;
  jobAdId: string;
  contactName?: string | null;
  companyName?: string | null;
};

export function CallButton({ phone, jobAdId, contactName, companyName }: CallButtonProps) {
  const { t } = useTranslation();

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    logCallClick(jobAdId);
  }

  const displayName = contactName || companyName;

  return (
    <a
      href={`tel:${phone}`}
      onClick={handleClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-b from-primary to-primary-dark px-6 py-3 text-base font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(22,163,74,0.3)] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(34,197,94,0.3)] active:scale-[0.98]"
    >
      <span>{"\u{1F4DE}"} {phone}</span>
      {displayName && (
        <>
          <span className="text-white/60">|</span>
          <span className="truncate">{displayName}</span>
        </>
      )}
    </a>
  );
}
