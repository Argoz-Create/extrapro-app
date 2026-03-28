-- =============================================================================
-- Migration: 00015_cities_insert_policy
-- Description: Allow authenticated users to insert new cities
-- =============================================================================

CREATE POLICY "Authenticated users can insert cities"
    ON cities FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);
