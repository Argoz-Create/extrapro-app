-- =============================================================================
-- Migration: 00009_functions_triggers
-- Description: Database functions and triggers for business logic
-- =============================================================================

-- =============================================================================
-- 1. update_updated_at() - Automatically set updated_at on row modification
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_employers_updated_at
    BEFORE UPDATE ON employers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_job_ads_updated_at
    BEFORE UPDATE ON job_ads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- 2. expire_old_ads() - Mark past-date active ads as expired
-- =============================================================================

CREATE OR REPLACE FUNCTION expire_old_ads()
RETURNS void AS $$
BEGIN
    UPDATE job_ads
    SET    status = 'expired'
    WHERE  status = 'active'
      AND  work_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 3. increment_ad_counter() - Safely increment view or call_click counters
--    Runs as SECURITY DEFINER so anonymous users can call it via RPC
-- =============================================================================

CREATE OR REPLACE FUNCTION increment_ad_counter(ad_id UUID, counter_name TEXT)
RETURNS void AS $$
BEGIN
    IF counter_name = 'view' THEN
        UPDATE job_ads
        SET    view_count = view_count + 1
        WHERE  id = ad_id;
    ELSIF counter_name = 'call_click' THEN
        UPDATE job_ads
        SET    call_click_count = call_click_count + 1
        WHERE  id = ad_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 4. generate_donation_on_hire() - When a hire is confirmed, auto-create a
--    donation record and update related counters
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_donation_on_hire
    AFTER UPDATE ON job_ads
    FOR EACH ROW
    EXECUTE FUNCTION generate_donation_on_hire();

-- =============================================================================
-- 5. handle_new_user() - Auto-create an employer profile when a new user
--    registers via Supabase Auth
-- =============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.employers (
        auth_user_id,
        company_name,
        company_type,
        contact_name,
        email,
        phone
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'company_name',  ''),
        COALESCE(NEW.raw_user_meta_data->>'company_type',  'autre'),
        COALESCE(NEW.raw_user_meta_data->>'contact_name',  ''),
        COALESCE(NEW.email,                                 ''),
        COALESCE(NEW.raw_user_meta_data->>'phone',          '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
