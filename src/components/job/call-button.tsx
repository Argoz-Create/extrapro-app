"use client";

import { Phone } from "@phosphor-icons/react";
import { logCallClick } from "@/lib/actions/interactions";
import { track } from "@/lib/analytics/events";

type CallButtonProps = {
  phone: string;
  jobAdId: string;
  contactName?: string | null;
  companyName?: string | null;
  profession?: string | null;
  city?: string | null;
};

export function CallButton({ phone, jobAdId, contactName, companyName, profession, city }: CallButtonProps) {
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    logCallClick(jobAdId);
    track.clickCall(jobAdId, profession ?? null, city ?? null);
  }

  const displayName = contactName || companyName;

  return (
    <a
      href={`tel:${phone}`}
      onClick={handleClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-white transition-all duration-200 ease-out hover:bg-primary-dark active:scale-[0.98]"
    >
      <Phone size={16} weight="duotone" />
      <span>{phone}</span>
      {displayName && (
        <>
          <span className="text-white/60">|</span>
          <span className="truncate">{displayName}</span>
        </>
      )}
    </a>
  );
}
