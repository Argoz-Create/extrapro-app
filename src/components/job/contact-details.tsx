"use client";

import { useState } from "react";
import { User, Phone, MessageCircle, Mail } from "lucide-react";
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
              <User className="h-4 w-4 flex-shrink-0 text-text-secondary" strokeWidth={2} />
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
              <Phone className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
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
              <MessageCircle className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span>WhatsApp</span>
            </a>
          )}

          {/* Email */}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span>{contactEmail}</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
