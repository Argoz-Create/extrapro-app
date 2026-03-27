-- =============================================================================
-- Migration: 00014_fix_donation_trigger
-- Description: Fix generate_donation_on_hire() to use SECURITY DEFINER
--              so it can INSERT into donations and UPDATE employers
--              bypassing RLS policies.
-- =============================================================================

CREATE OR REPLACE FUNCTION generate_donation_on_hire()
RETURNS TRIGGER AS $$
BEGIN
    -- Only fire when hire_confirmed transitions from false to true
    IF NEW.hire_confirmed = true AND OLD.hire_confirmed = false THEN
        -- Create the 1 EUR donation
        INSERT INTO donations (employer_id, job_ad_id, amount, status, charity_name)
        VALUES (NEW.employer_id, NEW.id, 1.00, 'pending', 'Les Restos du Coeur');

        -- Mark the ad as filled with donation generated
        UPDATE job_ads
        SET    donation_generated = true,
               status             = 'filled',
               filled_at          = NOW()
        WHERE  id = NEW.id;

        -- Update employer lifetime counters
        UPDATE employers
        SET    total_hires     = total_hires + 1,
               total_donations = total_donations + 1
        WHERE  id = NEW.employer_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
