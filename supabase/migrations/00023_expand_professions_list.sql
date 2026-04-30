-- =============================================================================
-- Migration: 00023_expand_professions_list
-- Description: Expand professions to Dov's HCR-focused list. NO deactivations.
--              All 29 existing rows kept active. Renames + recategorizations
--              for accent / diacritic consistency, plus 19 net-new entries.
--              Final state: 48 active professions across 5 categories
--              (kitchen, service, hotel, events, support).
-- =============================================================================

-- 1) Allow the new 'support' category. Keep legacy values until all rows have
--    been migrated; this is permissive on purpose so this migration can run
--    out of order without breaking historical data.
ALTER TABLE professions DROP CONSTRAINT IF EXISTS professions_category_check;
ALTER TABLE professions
    ADD CONSTRAINT professions_category_check
    CHECK (category IN (
        'kitchen', 'service', 'hotel', 'events', 'support',
        -- legacy values retained for any historical row that didn't migrate cleanly
        'cleaning', 'construction', 'logistics', 'agriculture'
    ));

-- 2) Renames (accent fixes, naming consistency). Idempotent — guarded by name.
UPDATE professions SET name_fr = 'Pâtissier'                 WHERE name_fr = 'Patissier';
UPDATE professions SET name_fr = 'Maître d''hôtel'           WHERE name_fr = 'Maitre d''hotel';
UPDATE professions SET name_fr = 'Femme / valet de chambre'  WHERE name_fr = 'Femme de chambre';
UPDATE professions SET name_fr = 'Décorateur'                WHERE name_fr = 'Decorateur';
UPDATE professions SET name_fr = 'Équipier polyvalent'       WHERE name_fr = 'Equipier polyvalent';

-- 3) Rebrands + recategorizations of existing rows.

-- "Veilleur de nuit" → "Night auditor" (modern HCR term)
UPDATE professions
   SET name_fr = 'Night auditor',
       name_en = 'Night Auditor',
       icon    = '🌙'
 WHERE name_fr = 'Veilleur de nuit';

-- "Hote d'accueil" (events) → "Hôtesse d'accueil" (hotel)
UPDATE professions
   SET name_fr  = 'Hôtesse d''accueil',
       name_en  = 'Front Desk Host',
       category = 'hotel'
 WHERE name_fr = 'Hote d''accueil';

-- "Agent d'entretien" → "Agent de nettoyage" + recategorize to support
UPDATE professions
   SET name_fr  = 'Agent de nettoyage',
       category = 'support'
 WHERE name_fr = 'Agent d''entretien';

-- 4) Recategorize legacy entries into the 5-category structure.
UPDATE professions SET category = 'kitchen' WHERE name_fr = 'Plongeur';
UPDATE professions SET category = 'support' WHERE name_fr = 'Livreur';
UPDATE professions SET category = 'support' WHERE name_fr = 'Équipier polyvalent';
UPDATE professions SET category = 'support' WHERE name_fr = 'Manutentionnaire';
UPDATE professions SET category = 'support' WHERE name_fr = 'Installateur';
UPDATE professions SET category = 'support' WHERE name_fr = 'Magasinier';
UPDATE professions SET category = 'support' WHERE name_fr = 'Vendangeur';
UPDATE professions SET category = 'support' WHERE name_fr = 'Cueilleur';

-- 5) Insert 19 new HCR entries. No unique constraint on name_fr → use guards.
INSERT INTO professions (name_fr, name_en, category, icon, display_order, is_active)
SELECT v.name_fr, v.name_en, v.category, v.icon, v.display_order, true
FROM (VALUES
    ('Chef cuisinier',          'Head Chef',           'kitchen', '👨‍🍳', 102),
    ('Chef exécutif',           'Executive Chef',      'kitchen', '🎖️',  103),
    ('Sous-chef',               'Sous-chef',           'kitchen', '🥘',  105),
    ('Chef pâtissier',          'Pastry Chef',         'kitchen', '👨‍🍳', 108),
    ('Chocolatier',             'Chocolatier',         'kitchen', '🍫',  110),
    ('Confiseur',               'Confectioner',        'kitchen', '🍬',  111),
    ('Glacier',                 'Ice Cream Maker',     'kitchen', '🍨',  112),
    ('Chef de rang',            'Head Waiter',         'service', '🎩',  115),
    ('Barista',                 'Barista',             'service', '☕',  118),
    ('Gouvernant(e)',           'Housekeeper',         'hotel',   '🧺',  125),
    ('Room service',            'Room Service',        'hotel',   '🛎️', 126),
    ('Directeur d''hôtel',      'Hotel Manager',       'hotel',   '🏨',  127),
    ('Animateur',               'Host / Animator',     'events',  '🎤',  128),
    ('Maître de cérémonie',     'Master of Ceremonies','events',  '🎙️', 129),
    ('DJ',                      'DJ',                  'events',  '🎧',  130),
    ('Banquet manager',         'Banquet Manager',     'events',  '🍽️', 131),
    ('Directeur de restaurant', 'Restaurant Manager',  'support', '🏛️', 133),
    ('Responsable technique',   'Technical Lead',      'support', '🔧',  134),
    ('Agent de maintenance',    'Maintenance Staff',   'support', '🛠️', 135)
) AS v(name_fr, name_en, category, icon, display_order)
WHERE NOT EXISTS (
    SELECT 1 FROM professions p WHERE p.name_fr = v.name_fr
);

-- ✅ Final state after this migration: 48 active professions in 5 active categories.
--    Legacy categories ('cleaning', 'construction', 'logistics', 'agriculture')
--    are no longer referenced by any row, but the CHECK constraint still allows
--    them so historical / out-of-order migrations don't break.
