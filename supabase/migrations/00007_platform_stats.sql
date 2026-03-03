-- =============================================================================
-- Migration: 00007_platform_stats
-- Description: Create platform_stats table for aggregate dashboard metrics
-- =============================================================================

CREATE TABLE platform_stats (
    id                    UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    stat_date             DATE          NOT NULL DEFAULT CURRENT_DATE,
    total_ads_posted      INTEGER       NOT NULL DEFAULT 0,
    total_ads_active      INTEGER       NOT NULL DEFAULT 0,
    total_hires           INTEGER       NOT NULL DEFAULT 0,
    total_donations       INTEGER       NOT NULL DEFAULT 0,
    total_donation_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_employers       INTEGER       NOT NULL DEFAULT 0,
    total_call_clicks     INTEGER       NOT NULL DEFAULT 0,
    created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Insert the initial stats row
INSERT INTO platform_stats (
    stat_date,
    total_ads_posted,
    total_ads_active,
    total_hires,
    total_donations,
    total_donation_amount,
    total_employers,
    total_call_clicks
) VALUES (
    CURRENT_DATE,
    0,
    0,
    0,
    0,
    0,
    0,
    0
);
