-- =============================================================================
-- Migration: 00021_custom_profession_field
-- Description: Free-text "off-list" profession label on job ads. Used when
--              an employer's needed role isn't in the canonical professions
--              list. The picker can also save zero canonical professions
--              when only a custom one is present, so we relax the NOT NULL
--              on profession_id (junction table is now the source of truth
--              for the structured links; profession_id stays for backfill
--              compatibility until migration 00025 drops it).
-- =============================================================================

-- 1) custom_profession free-text override (max 60 chars at DB level)
ALTER TABLE job_ads
    ADD COLUMN custom_profession TEXT NULL;

ALTER TABLE job_ads
    ADD CONSTRAINT job_ads_custom_profession_length
    CHECK (custom_profession IS NULL OR char_length(custom_profession) <= 60);

COMMENT ON COLUMN job_ads.custom_profession IS
    'Free-text role label, used only when no entry in professions table fits. '
    'Renders as a chip on the ad alongside any standard profession links from '
    'job_ad_professions. Captured to profession_suggestions on submit (00024).';

-- 2) Relax profession_id NOT NULL — junction table is now authoritative.
--    Existing rows keep their value; new rows can be NULL when only a
--    custom_profession is set.
ALTER TABLE job_ads
    ALTER COLUMN profession_id DROP NOT NULL;
