-- =============================================================================
-- COMBINED MIGRATION: Run this in Supabase SQL Editor
-- Adds: required_skill, work_end_date, flat_rate columns + draft status support
-- + cities INSERT policy
-- Safe to run multiple times (uses IF NOT EXISTS / IF EXISTS)
-- =============================================================================

-- 1. Add missing columns to job_ads (from migration 00013)
ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS required_skill TEXT;
ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS work_end_date DATE;
ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS flat_rate NUMERIC(8,2);
ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE job_ads ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT;

-- 2. Allow authenticated users to insert cities (from migration 00015)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'cities' AND policyname = 'Authenticated users can insert cities'
    ) THEN
        CREATE POLICY "Authenticated users can insert cities"
            ON cities FOR INSERT
            WITH CHECK (auth.uid() IS NOT NULL);
    END IF;
END $$;

-- 3. Add draft status support (from migration 00016)
-- Update the CHECK constraint to allow 'draft'
ALTER TABLE job_ads DROP CONSTRAINT IF EXISTS job_ads_status_check;
ALTER TABLE job_ads ADD CONSTRAINT job_ads_status_check
    CHECK (status IN ('active', 'inactive', 'filled', 'expired', 'draft'));

-- Make fields nullable so partial drafts can be saved
ALTER TABLE job_ads ALTER COLUMN profession_id DROP NOT NULL;
ALTER TABLE job_ads ALTER COLUMN city_id DROP NOT NULL;
ALTER TABLE job_ads ALTER COLUMN title DROP NOT NULL;
ALTER TABLE job_ads ALTER COLUMN work_date DROP NOT NULL;
ALTER TABLE job_ads ALTER COLUMN start_time DROP NOT NULL;
ALTER TABLE job_ads ALTER COLUMN end_time DROP NOT NULL;
ALTER TABLE job_ads ALTER COLUMN contact_phone DROP NOT NULL;
ALTER TABLE job_ads ALTER COLUMN published_at DROP NOT NULL;
ALTER TABLE job_ads ALTER COLUMN published_at SET DEFAULT NULL;

-- Trigger: set published_at when publishing a draft
CREATE OR REPLACE FUNCTION set_published_at_on_activate()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'draft' AND NEW.status = 'active' THEN
        NEW.published_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_published_at ON job_ads;
CREATE TRIGGER trg_set_published_at
    BEFORE UPDATE ON job_ads
    FOR EACH ROW
    EXECUTE FUNCTION set_published_at_on_activate();

-- Done!
SELECT 'All migrations applied successfully!' AS result;
