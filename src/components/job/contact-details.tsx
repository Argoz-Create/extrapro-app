"use client";

import { useState } from "react";
import { logCallClick } from "@/lib/actions/interactions";
import { useTranslation } from "@/lib/i18n/context";

type ContactDetailsProps = {
  phone: string;
  jobAdId: string;
  contactName?: string | null;
  contactEmail?: string | null;
  contactWhatsapp?: string | null;
  companyName?: string | null;
};

export function ContactDetails({
  phone,
  jobAdId,
  contactName,
  contactEmail,
  contactWhatsapp,
  companyName,
}: ContactDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!isOpen) {
      logCallClick(jobAdId);
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-b from-primary to-primary-dark px-6 py-3 text-base font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(22,163,74,0.3)] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(34,197,94,0.3)] active:scale-[0.98]"
      >
        <span>{isOpen ? "\u25B2" : "\u25BC"}</span>
        <span>{t("job.contactDetails")}</span>
      </button>

      {/* Collapsible details */}
      {isOpen && (
        <div className="mt-2 rounded-[8px] border border-border-light bg-gray-50 p-4 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Name */}
          {displayName && (
            <div className="flex items-center gap-2 text-sm text-text-primary">
              <span className="flex-shrink-0">{"\u{1F464}"}</span>
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
              <span className="flex-shrink-0">{"\u{1F4DE}"}</span>
              <span>{singlePhone}</span>
            </a>
          ))}

          {/* WhatsApp */}
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-green-600 hover:underline"
            >
              <span className="flex-shrink-0">{"\u{1F4AC}"}</span>
              <span>WhatsApp</span>
            </a>
          )}

          {/* Email */}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <span className="flex-shrink-0">{"\u2709\uFE0F"}</span>
              <span>{contactEmail}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
