-- =============================================================================
-- Migration: 00002_regions_cities
-- Description: Create regions and cities tables for French geography
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: regions
-- -----------------------------------------------------------------------------
CREATE TABLE regions (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       TEXT        NOT NULL,
    code       TEXT        NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Table: cities
-- -----------------------------------------------------------------------------
CREATE TABLE cities (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT        NOT NULL,
    postal_code TEXT        NOT NULL,
    region_id   UUID        REFERENCES regions(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigram index for fast fuzzy city name search
CREATE INDEX idx_cities_name_trgm ON cities USING GIN (name gin_trgm_ops);
