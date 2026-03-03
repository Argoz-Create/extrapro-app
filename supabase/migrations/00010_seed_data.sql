-- =============================================================================
-- Migration: 00010_seed_data
-- Description: Seed regions, cities, professions, and initial platform stats
-- =============================================================================

-- =============================================================================
-- REGIONS (13 metropolitan + 5 overseas)
-- =============================================================================

INSERT INTO regions (name, code) VALUES
    ('Ile-de-France',             'IDF'),
    ('Provence-Alpes-Cote d''Azur', 'PACA'),
    ('Auvergne-Rhone-Alpes',     'ARA'),
    ('Occitanie',                 'OCC'),
    ('Nouvelle-Aquitaine',        'NAQ'),
    ('Hauts-de-France',           'HDF'),
    ('Grand Est',                 'GES'),
    ('Bretagne',                  'BRE'),
    ('Normandie',                 'NOR'),
    ('Pays de la Loire',          'PDL'),
    ('Centre-Val de Loire',       'CVL'),
    ('Bourgogne-Franche-Comte',   'BFC'),
    ('Corse',                     'COR'),
    ('Guadeloupe',                'GUA'),
    ('Martinique',                'MTQ'),
    ('Guyane',                    'GUF'),
    ('La Reunion',                'REU'),
    ('Mayotte',                   'MAY');

-- =============================================================================
-- CITIES (20 major French cities linked to their region by code)
-- =============================================================================

INSERT INTO cities (name, postal_code, region_id) VALUES
    ('Paris',             '75001', (SELECT id FROM regions WHERE code = 'IDF')),
    ('Lyon',              '69001', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Marseille',         '13001', (SELECT id FROM regions WHERE code = 'PACA')),
    ('Bordeaux',          '33000', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Toulouse',          '31000', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Nice',              '06000', (SELECT id FROM regions WHERE code = 'PACA')),
    ('Nantes',            '44000', (SELECT id FROM regions WHERE code = 'PDL')),
    ('Strasbourg',        '67000', (SELECT id FROM regions WHERE code = 'GES')),
    ('Montpellier',       '34000', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Lille',             '59000', (SELECT id FROM regions WHERE code = 'HDF')),
    ('Rennes',            '35000', (SELECT id FROM regions WHERE code = 'BRE')),
    ('Reims',             '51100', (SELECT id FROM regions WHERE code = 'GES')),
    ('Toulon',            '83000', (SELECT id FROM regions WHERE code = 'PACA')),
    ('Saint-Etienne',     '42000', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Le Havre',          '76600', (SELECT id FROM regions WHERE code = 'NOR')),
    ('Grenoble',          '38000', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Dijon',             '21000', (SELECT id FROM regions WHERE code = 'BFC')),
    ('Angers',            '49000', (SELECT id FROM regions WHERE code = 'PDL')),
    ('Cannes',            '06400', (SELECT id FROM regions WHERE code = 'PACA')),
    ('Aix-en-Provence',   '13100', (SELECT id FROM regions WHERE code = 'PACA'));

-- =============================================================================
-- PROFESSIONS (29 professions across 8 categories)
-- =============================================================================

INSERT INTO professions (name_fr, name_en, category, icon, display_order) VALUES
    -- Kitchen (1-6)
    ('Cuisinier',           'Cook',                'kitchen',       '🍳', 1),
    ('Chef de partie',      'Line Cook',           'kitchen',       '👨‍🍳', 2),
    ('Commis de cuisine',   'Kitchen Assistant',   'kitchen',       '🔪', 3),
    ('Patissier',           'Pastry Chef',         'kitchen',       '🎂', 4),
    ('Boulanger',           'Baker',               'kitchen',       '🍞', 5),
    ('Pizzaiolo',           'Pizza Chef',          'kitchen',       '🍕', 6),

    -- Service (7-11)
    ('Serveur',             'Waiter',              'service',       '🍷', 7),
    ('Barman',              'Bartender',           'service',       '🍸', 8),
    ('Maitre d''hotel',     'Head Waiter',         'service',       '🎩', 9),
    ('Sommelier',           'Sommelier',           'service',       '🍾', 10),
    ('Runner',              'Food Runner',         'service',       '🏃', 11),

    -- Hotel (12-16)
    ('Receptionniste',      'Receptionist',        'hotel',         '🛎️', 12),
    ('Femme de chambre',    'Housekeeper',         'hotel',         '🛏️', 13),
    ('Concierge',           'Concierge',           'hotel',         '🔑', 14),
    ('Bagagiste',           'Bellhop',             'hotel',         '🧳', 15),
    ('Veilleur de nuit',    'Night Auditor',       'hotel',         '🌙', 16),

    -- Events (17-20)
    ('Traiteur',            'Caterer',             'events',        '🎪', 17),
    ('Hote d''accueil',     'Event Host',          'events',        '🎤', 18),
    ('Decorateur',          'Event Decorator',     'events',        '🎨', 19),
    ('Photographe',         'Event Photographer',  'events',        '📸', 20),

    -- Cleaning (21-23)
    ('Plongeur',            'Dishwasher',          'cleaning',      '🧹', 21),
    ('Agent d''entretien',  'Cleaning Staff',      'cleaning',      '🧽', 22),
    ('Equipier polyvalent', 'Multi-task Staff',    'cleaning',      '🔧', 23),

    -- Construction (24-25)
    ('Manutentionnaire',    'Handler',             'construction',  '📦', 24),
    ('Installateur',        'Installer',           'construction',  '🔨', 25),

    -- Logistics (26-27)
    ('Livreur',             'Delivery Driver',     'logistics',     '🚗', 26),
    ('Magasinier',          'Warehouse Staff',     'logistics',     '📋', 27),

    -- Agriculture (28-29)
    ('Vendangeur',          'Grape Picker',        'agriculture',   '🍇', 28),
    ('Cueilleur',           'Fruit Picker',        'agriculture',   '🍎', 29);

-- =============================================================================
-- PLATFORM STATS (initial row with realistic starting values)
-- =============================================================================

UPDATE platform_stats
SET    total_hires           = 2847,
       total_donations       = 2847,
       total_donation_amount = 2847.00,
       updated_at            = NOW()
WHERE  stat_date = CURRENT_DATE;
