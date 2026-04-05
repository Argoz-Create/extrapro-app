"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { JobAdWithRelations } from "@/lib/types/database";
import { formatDate } from "@/lib/utils/format";
import { confirmHire } from "@/lib/actions/jobs";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/context";

type HireConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  job: JobAdWithRelations | null;
};

export function HireConfirmationModal({
  open,
  onClose,
  job,
}: HireConfirmationModalProps) {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  if (!job) return null;

  function handleConfirm() {
    startTransition(async () => {
      try {
        const result = await confirmHire(job!.id);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success(t("hire.success"));
        onClose();
      } catch {
        toast.error(t("common.error"));
      }
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={t("hire.confirmTitle")}>
      <p className="text-sm text-text-secondary mb-5">
        {t("hire.confirmMessage", {
          profession: job.professions?.name_fr ?? "",
          date: job.work_date ? formatDate(job.work_date) : "",
        })}
      </p>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="default" onClick={onClose}>
          {t("hire.cancel")}
        </Button>
        <Button
          variant="primary"
          size="default"
          onClick={handleConfirm}
          loading={isPending}
        >
          {t("hire.confirm")}
        </Button>
      </div>
    </Modal>
  );
}
