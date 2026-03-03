-- =============================================================================
-- Migration: 00006_donations
-- Description: Create donations table - tracks 1 EUR donations per hire
-- =============================================================================

CREATE TABLE donations (
    id             UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id    UUID          NOT NULL REFERENCES employers(id),
    job_ad_id      UUID          REFERENCES job_ads(id),
    amount         NUMERIC(10,2) NOT NULL DEFAULT 1.00,
    currency       TEXT          NOT NULL DEFAULT 'EUR',
    status         TEXT          NOT NULL DEFAULT 'pending' CHECK (status IN (
                       'pending', 'confirmed', 'transferred'
                   )),
    charity_name   TEXT          NOT NULL DEFAULT 'Les Restos du Coeur',
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    confirmed_at   TIMESTAMPTZ,
    transferred_at TIMESTAMPTZ
);

-- Fast lookup of donations by employer
CREATE INDEX idx_donations_employer_id ON donations(employer_id);
