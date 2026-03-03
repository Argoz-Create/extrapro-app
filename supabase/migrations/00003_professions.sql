-- =============================================================================
-- Migration: 00003_professions
-- Description: Create professions table for job categories
-- =============================================================================

CREATE TABLE professions (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_fr       TEXT        NOT NULL,
    name_en       TEXT        NOT NULL,
    category      TEXT        NOT NULL CHECK (category IN (
                      'kitchen', 'service', 'hotel', 'events',
                      'cleaning', 'construction', 'logistics', 'agriculture'
                  )),
    icon          TEXT        NOT NULL,
    display_order INTEGER     NOT NULL DEFAULT 0,
    is_active     BOOLEAN     NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
