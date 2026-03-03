-- =============================================================================
-- Migration: 00004_employers
-- Description: Create employers table linked to Supabase auth users
-- =============================================================================

CREATE TABLE employers (
    id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id    UUID          UNIQUE NOT NULL,
    company_name    TEXT          NOT NULL,
    company_type    TEXT          NOT NULL CHECK (company_type IN (
                        'restaurant', 'hotel', 'traiteur', 'evenementiel', 'autre'
                    )),
    contact_name    TEXT          NOT NULL,
    email           TEXT          NOT NULL,
    phone           TEXT          NOT NULL,
    city_id         UUID          REFERENCES cities(id),
    address         TEXT,
    siret           TEXT,
    is_verified     BOOLEAN       NOT NULL DEFAULT false,
    total_hires     INTEGER       NOT NULL DEFAULT 0,
    total_donations NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_active       BOOLEAN       NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Fast lookup by Supabase auth user ID
CREATE INDEX idx_employers_auth_user_id ON employers(auth_user_id);
