-- =============================================================================
-- Migration: 00018_add_contact_fields
-- Description: Add contact_email and contact_whatsapp columns to job_ads
-- =============================================================================

ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT;
