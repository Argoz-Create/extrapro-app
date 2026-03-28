-- =============================================================================
-- Migration: 00016_draft_support
-- Description: Add draft status support and make fields nullable for drafts
-- =============================================================================

-- Allow draft status
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

-- Drafts should not have published_at set
-- When publishing (changing from draft to active), set published_at
CREATE OR REPLACE FUNCTION set_published_at_on_activate()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status = 'draft' AND NEW.status = 'active' THEN
        NEW.published_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_published_at
    BEFORE UPDATE ON job_ads
    FOR EACH ROW
    EXECUTE FUNCTION set_published_at_on_activate();
