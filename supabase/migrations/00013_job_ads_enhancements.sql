-- =============================================================================
-- Migration: 00013_job_ads_enhancements
-- Description: Add required_skill, work_end_date, flat_rate to job_ads
-- =============================================================================

-- Required skill (free text)
ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS required_skill TEXT;

-- Date range support: work_end_date for multi-day jobs
ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS work_end_date DATE;

-- Flat rate (forfait) for "per job" pricing
ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS flat_rate NUMERIC(8,2);
