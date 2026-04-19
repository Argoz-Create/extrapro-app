-- =============================================================================
-- 00019_ad_expiry_hardening.sql
-- -----------------------------------------------------------------------------
-- Bug 3: "Past-date ads stay visible on the homepage."
--
-- Root causes:
--   1. expire_old_ads() existed but used work_date only — multi-day ads
--      were being expired on their START date instead of their END date.
--   2. expire_old_ads() had no schedule (pg_cron not installed) — it never
--      ran automatically.
--   3. The public RLS policy "Anyone can view active job ads" had no date
--      check, so any active row was visible regardless of work_date.
--
-- This migration:
--   A. Rewrites expire_old_ads() to use COALESCE(work_end_date, work_date).
--   B. Tightens the public SELECT policy to require the ad's last relevant
--      day is today or later.
--   C. Attempts to enable pg_cron and schedules expire_old_ads() daily.
--      Wrapped in DO blocks so the migration succeeds on environments where
--      pg_cron isn't available (it can be scheduled manually from the
--      Supabase Dashboard later).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- A. Rewrite expire_old_ads() to respect multi-day ranges
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION expire_old_ads()
RETURNS void AS $$
BEGIN
    UPDATE job_ads
    SET    status = 'expired'
    WHERE  status = 'active'
      AND  hire_confirmed = false
      AND  COALESCE(work_end_date, work_date) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- B. Tighten the public SELECT policy: only show ads whose last relevant day
--    is today or later.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view active job ads" ON job_ads;

CREATE POLICY "Anyone can view active job ads"
    ON job_ads FOR SELECT
    USING (
        status = 'active'
        AND deleted_at IS NULL
        AND COALESCE(work_end_date, work_date) >= CURRENT_DATE
    );

-- -----------------------------------------------------------------------------
-- C. Try to install pg_cron and schedule daily expiry.
--    If pg_cron isn't available in this environment, the block below skips
--    gracefully and the migration still succeeds.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    BEGIN
        CREATE EXTENSION IF NOT EXISTS pg_cron;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'pg_cron extension not available here — skipping schedule.';
        RETURN;
    END;

    -- Unschedule any prior copy of this job to keep the migration idempotent
    BEGIN
        PERFORM cron.unschedule('expire_old_ads_daily');
    EXCEPTION WHEN OTHERS THEN
        -- job didn't exist — that's fine
        NULL;
    END;

    -- Schedule expire_old_ads() to run every day at 02:00 UTC
    BEGIN
        PERFORM cron.schedule(
            'expire_old_ads_daily',
            '0 2 * * *',
            $cron$SELECT expire_old_ads();$cron$
        );
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not schedule expire_old_ads_daily (pg_cron not usable) — skipping.';
    END;
END $$;

-- -----------------------------------------------------------------------------
-- One-time cleanup pass so existing stale ads disappear from the homepage
-- immediately after this migration runs.
-- -----------------------------------------------------------------------------
SELECT expire_old_ads();
