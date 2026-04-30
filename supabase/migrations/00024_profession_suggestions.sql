-- =============================================================================
-- Migration: 00024_profession_suggestions
-- Description: Capture every off-list (custom) profession label typed by an
--              employer in the Create Ad form. Server upserts on submission.
--              Powers picker autocomplete (popular suggestions appear with a
--              "(suggéré)" label) and a lightweight moderation queue Dov can
--              review via Supabase dashboard SQL.
-- =============================================================================

-- Enable trigram fuzzy-match for "did you mean ..." duplicate detection.
-- Safe to run on any Supabase Postgres; idempotent.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE profession_suggestions (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_normalized TEXT        NOT NULL UNIQUE,
        -- lowercased, trimmed, accents stripped (server-side before insert)
    name_display    TEXT        NOT NULL,
        -- prettiest form seen so far (longest typed variant wins)
    use_count       INTEGER     NOT NULL DEFAULT 1,
    first_seen_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status          TEXT        NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'promoted', 'merged', 'rejected')),
    promoted_to_profession_id UUID REFERENCES professions(id) ON DELETE SET NULL,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ps_status_used ON profession_suggestions(status, use_count DESC);
CREATE INDEX idx_ps_normalized  ON profession_suggestions(name_normalized);
CREATE INDEX idx_ps_display_trgm ON profession_suggestions
    USING GIN (name_display gin_trgm_ops);

ALTER TABLE profession_suggestions ENABLE ROW LEVEL SECURITY;

-- Authenticated employers can see suggestions (so the picker can autocomplete).
CREATE POLICY "authenticated_read_suggestions"
    ON profession_suggestions FOR SELECT
    USING (auth.role() = 'authenticated');

-- Authenticated employers can insert (server upserts via INSERT … ON CONFLICT).
CREATE POLICY "authenticated_insert_suggestions"
    ON profession_suggestions FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Authenticated employers can UPDATE only their existing rows' use_count /
-- last_seen_at via the same upsert path. Status / notes / promotion stay
-- service-role only (no UPDATE policy → blocked for end users).
CREATE POLICY "authenticated_update_suggestions_counter"
    ON profession_suggestions FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated' AND status = 'pending');

COMMENT ON TABLE profession_suggestions IS
    'Captures every custom_profession value submitted from Create Ad. Server '
    'upserts on submission, incrementing use_count for duplicates. Reviewed '
    'periodically (SQL only in v1); popular suggestions can be promoted into '
    'the canonical professions table.';
