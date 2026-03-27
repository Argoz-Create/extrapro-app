-- =============================================================================
-- Migration: 00012_public_employer_read
-- Description: Allow public read of employer name fields for job listing display
-- =============================================================================

CREATE POLICY "Anyone can view employer public info"
    ON employers FOR SELECT
    USING (true);
