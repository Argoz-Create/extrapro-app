"use client";

import { useState } from "react";
import { User, Phone, ChatCircle, Envelope } from "@phosphor-icons/react";
import { logCallClick } from "@/lib/actions/interactions";
import { track } from "@/lib/analytics/events";
import { useTranslation } from "@/lib/i18n/context";

type ContactDetailsProps = {
  phone: string;
  jobAdId: string;
  contactName?: string | null;
  contactEmail?: string | null;
  contactWhatsapp?: string | null;
  companyName?: string | null;
  profession?: string | null;
  city?: string | null;
};

export function ContactDetails({
  phone,
  jobAdId,
  contactName,
  contactEmail,
  contactWhatsapp,
  companyName,
  profession,
  city,
}: ContactDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!isOpen) {
      // Server-side call-click counter (always — internal analytics).
      logCallClick(jobAdId);
      // GA4 click_call event (gated on consent inside track.*). This is
      // the funnel's north-star event — opening the contact panel is the
      // strongest "intent to call" signal we can capture client-side.
      track.clickCall(jobAdId, profession ?? null, city ?? null);
    }
    setIsOpen((prev) => !prev);
  }

  const displayName = contactName || companyName;
  const whatsappLink = contactWhatsapp
    ? `https://wa.me/${contactWhatsapp.replace(/[\s.+-]/g, "")}`
    : null;

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {/* Toggle button */}
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-white transition-all duration-200 ease-out hover:bg-primary-dark active:scale-[0.98]"
      >
        <span>{isOpen ? "▲" : "▼"}</span>
        <span>{t("job.contactDetails")}</span>
      </button>

      {/* Collapsible details */}
      {isOpen && (
        <div className="mt-2 rounded-2xl border border-border-light bg-gray-50 p-4 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Name */}
          {displayName && (
            <div className="flex items-center gap-2 text-sm text-text-primary">
              <User size={16} weight="duotone" className="flex-shrink-0 text-text-secondary" />
              <span className="font-medium">{displayName}</span>
            </div>
          )}

          {/* Phone(s) */}
          {phone && phone.split(",").map((p) => p.trim()).filter(Boolean).map((singlePhone, idx) => (
            <a
              key={idx}
              href={`tel:${singlePhone}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Phone size={16} weight="duotone" className="flex-shrink-0" />
              <span>{singlePhone}</span>
            </a>
          ))}

          {/* WhatsApp */}
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ChatCircle size={16} weight="duotone" className="flex-shrink-0" />
              <span>WhatsApp</span>
            </a>
          )}

          {/* Email */}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Envelope size={16} weight="duotone" className="flex-shrink-0" />
              <span>{contactEmail}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
