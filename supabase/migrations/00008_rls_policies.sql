-- =============================================================================
-- Migration: 00008_rls_policies
-- Description: Enable Row Level Security and define access policies
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enable RLS on all tables
-- -----------------------------------------------------------------------------
ALTER TABLE regions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities         ENABLE ROW LEVEL SECURITY;
ALTER TABLE professions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE employers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_ads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PUBLIC READ: regions, cities, professions, platform_stats
-- =============================================================================

CREATE POLICY "Anyone can view regions"
    ON regions FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view cities"
    ON cities FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view professions"
    ON professions FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view platform stats"
    ON platform_stats FOR SELECT
    USING (true);

-- =============================================================================
-- EMPLOYERS: owners can read and update their own profile
-- =============================================================================

CREATE POLICY "Employers can view own profile"
    ON employers FOR SELECT
    USING (auth.uid() = auth_user_id);

CREATE POLICY "Employers can update own profile"
    ON employers FOR UPDATE
    USING (auth.uid() = auth_user_id);

-- =============================================================================
-- JOB ADS: public read for active, owner CRUD
-- =============================================================================

CREATE POLICY "Anyone can view active job ads"
    ON job_ads FOR SELECT
    USING (status = 'active');

CREATE POLICY "Employers can view own ads"
    ON job_ads FOR SELECT
    USING (
        employer_id IN (
            SELECT id FROM employers WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Employers can insert own ads"
    ON job_ads FOR INSERT
    WITH CHECK (
        employer_id IN (
            SELECT id FROM employers WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Employers can update own ads"
    ON job_ads FOR UPDATE
    USING (
        employer_id IN (
            SELECT id FROM employers WHERE auth_user_id = auth.uid()
        )
    );

-- =============================================================================
-- DONATIONS: owners can read their own donations
-- =============================================================================

CREATE POLICY "Employers can view own donations"
    ON donations FOR SELECT
    USING (
        employer_id IN (
            SELECT id FROM employers WHERE auth_user_id = auth.uid()
        )
    );
