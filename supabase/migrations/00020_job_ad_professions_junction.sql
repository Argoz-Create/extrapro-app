-- =============================================================================
-- Migration: 00020_job_ad_professions_junction
-- Description: Multi-profession support for job ads. Junction table linking
--              job_ads ↔ professions (many-to-many). Existing single-profession
--              ads are backfilled in migration 00022.
-- =============================================================================

CREATE TABLE job_ad_professions (
    job_ad_id     UUID        NOT NULL REFERENCES job_ads(id)     ON DELETE CASCADE,
    profession_id UUID        NOT NULL REFERENCES professions(id) ON DELETE RESTRICT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (job_ad_id, profession_id)
);

CREATE INDEX idx_jap_job_ad     ON job_ad_professions(job_ad_id);
CREATE INDEX idx_jap_profession ON job_ad_professions(profession_id);

-- -----------------------------------------------------------------------------
-- RLS — mirrors job_ads visibility:
--   • Public can read links for ads that are publicly visible.
--   • Employers can write links for their own ads.
-- -----------------------------------------------------------------------------
ALTER TABLE job_ad_professions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_job_ad_professions"
    ON job_ad_professions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM job_ads ja
            WHERE ja.id = job_ad_professions.job_ad_id
              AND ja.status = 'active'
        )
    );

CREATE POLICY "employer_read_own_job_ad_professions"
    ON job_ad_professions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM job_ads ja
            JOIN employers e ON e.id = ja.employer_id
            WHERE ja.id = job_ad_professions.job_ad_id
              AND e.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "employer_insert_own_job_ad_professions"
    ON job_ad_professions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM job_ads ja
            JOIN employers e ON e.id = ja.employer_id
            WHERE ja.id = job_ad_professions.job_ad_id
              AND e.auth_user_id = auth.uid()
        )
    );

CREATE POLICY "employer_delete_own_job_ad_professions"
    ON job_ad_professions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM job_ads ja
            JOIN employers e ON e.id = ja.employer_id
            WHERE ja.id = job_ad_professions.job_ad_id
              AND e.auth_user_id = auth.uid()
        )
    );
