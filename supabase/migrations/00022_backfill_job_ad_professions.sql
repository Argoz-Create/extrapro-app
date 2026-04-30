-- =============================================================================
-- Migration: 00022_backfill_job_ad_professions
-- Description: Copy existing single profession_id values into the junction
--              table so multi-profession queries work for legacy ads.
--              Idempotent — safe to re-run.
-- =============================================================================

INSERT INTO job_ad_professions (job_ad_id, profession_id, created_at)
SELECT
    id            AS job_ad_id,
    profession_id,
    created_at
FROM job_ads
WHERE profession_id IS NOT NULL
ON CONFLICT (job_ad_id, profession_id) DO NOTHING;

-- Verification (read-only). After running this migration, the row counts
-- should match for ads that had a profession_id before.
--   SELECT
--     (SELECT COUNT(*) FROM job_ads WHERE profession_id IS NOT NULL) AS source_rows,
--     (SELECT COUNT(*) FROM job_ad_professions)                     AS junction_rows;
