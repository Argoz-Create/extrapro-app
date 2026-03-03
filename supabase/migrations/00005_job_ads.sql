-- =============================================================================
-- Migration: 00005_job_ads
-- Description: Create job_ads table - core of the marketplace
-- =============================================================================

CREATE TABLE job_ads (
    id                 UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id        UUID          NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
    profession_id      UUID          NOT NULL REFERENCES professions(id),
    city_id            UUID          NOT NULL REFERENCES cities(id),
    title              TEXT          NOT NULL,
    description        TEXT,
    work_date          DATE          NOT NULL,
    start_time         TIME          NOT NULL,
    end_time           TIME          NOT NULL,
    hourly_rate        NUMERIC(8,2),
    daily_rate         NUMERIC(8,2),
    contact_phone      TEXT          NOT NULL,
    contact_name       TEXT,
    status             TEXT          NOT NULL DEFAULT 'active' CHECK (status IN (
                           'active', 'inactive', 'filled', 'expired'
                       )),
    is_urgent          BOOLEAN       NOT NULL DEFAULT false,
    view_count         INTEGER       NOT NULL DEFAULT 0,
    call_click_count   INTEGER       NOT NULL DEFAULT 0,
    hire_confirmed     BOOLEAN       NOT NULL DEFAULT false,
    donation_generated BOOLEAN       NOT NULL DEFAULT false,
    published_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    expires_at         TIMESTAMPTZ,
    filled_at          TIMESTAMPTZ,
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX idx_job_ads_status     ON job_ads(status);
CREATE INDEX idx_job_ads_employer   ON job_ads(employer_id);
CREATE INDEX idx_job_ads_profession ON job_ads(profession_id);
CREATE INDEX idx_job_ads_city       ON job_ads(city_id);
CREATE INDEX idx_job_ads_work_date  ON job_ads(work_date);

-- Partial index: only active ads, ordered by newest first
CREATE INDEX idx_job_ads_active     ON job_ads(published_at DESC) WHERE status = 'active';
