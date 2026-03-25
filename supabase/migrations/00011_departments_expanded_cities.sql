-- =============================================================================
-- Migration: 00011_departments_expanded_cities
-- Description: Add departments table, expand to 100 cities, add required_skill
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Update region names to use proper accented characters
-- -----------------------------------------------------------------------------
UPDATE regions SET name = 'Île-de-France' WHERE code = 'IDF';
UPDATE regions SET name = 'Provence-Alpes-Côte d''Azur' WHERE code = 'PACA';
UPDATE regions SET name = 'Auvergne-Rhône-Alpes' WHERE code = 'ARA';
UPDATE regions SET name = 'Occitanie' WHERE code = 'OCC';
UPDATE regions SET name = 'Nouvelle-Aquitaine' WHERE code = 'NAQ';
UPDATE regions SET name = 'Hauts-de-France' WHERE code = 'HDF';
UPDATE regions SET name = 'Grand Est' WHERE code = 'GES';
UPDATE regions SET name = 'Bretagne' WHERE code = 'BRE';
UPDATE regions SET name = 'Normandie' WHERE code = 'NOR';
UPDATE regions SET name = 'Pays de la Loire' WHERE code = 'PDL';
UPDATE regions SET name = 'Centre-Val de Loire' WHERE code = 'CVL';
UPDATE regions SET name = 'Bourgogne-Franche-Comté' WHERE code = 'BFC';
UPDATE regions SET name = 'Corse' WHERE code = 'COR';
UPDATE regions SET name = 'Guadeloupe' WHERE code = 'GUA';
UPDATE regions SET name = 'Martinique' WHERE code = 'MTQ';
UPDATE regions SET name = 'Guyane' WHERE code = 'GUF';
UPDATE regions SET name = 'La Réunion' WHERE code = 'REU';
UPDATE regions SET name = 'Mayotte' WHERE code = 'MAY';

-- -----------------------------------------------------------------------------
-- Table: departments
-- -----------------------------------------------------------------------------
CREATE TABLE departments (
    id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name       TEXT        NOT NULL,
    code       TEXT        NOT NULL UNIQUE,
    region_id  UUID        REFERENCES regions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_departments_region ON departments(region_id);

-- -----------------------------------------------------------------------------
-- Add department_id to cities
-- -----------------------------------------------------------------------------
ALTER TABLE cities ADD COLUMN department_id UUID REFERENCES departments(id);

-- -----------------------------------------------------------------------------
-- Add required_skill to job_ads
-- -----------------------------------------------------------------------------
ALTER TABLE job_ads ADD COLUMN required_skill TEXT;

-- -----------------------------------------------------------------------------
-- Insert all departments
-- -----------------------------------------------------------------------------

-- Auvergne-Rhône-Alpes
INSERT INTO departments (name, code, region_id) VALUES
    ('Ain',            '01', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Allier',         '03', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Ardèche',        '07', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Cantal',         '15', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Drôme',          '26', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Isère',          '38', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Loire',          '42', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Haute-Loire',    '43', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Puy-de-Dôme',   '63', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Rhône',          '69', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Savoie',         '73', (SELECT id FROM regions WHERE code = 'ARA')),
    ('Haute-Savoie',   '74', (SELECT id FROM regions WHERE code = 'ARA'));

-- Bourgogne-Franche-Comté
INSERT INTO departments (name, code, region_id) VALUES
    ('Côte-d''Or',           '21', (SELECT id FROM regions WHERE code = 'BFC')),
    ('Doubs',                '25', (SELECT id FROM regions WHERE code = 'BFC')),
    ('Jura',                 '39', (SELECT id FROM regions WHERE code = 'BFC')),
    ('Nièvre',               '58', (SELECT id FROM regions WHERE code = 'BFC')),
    ('Haute-Saône',          '70', (SELECT id FROM regions WHERE code = 'BFC')),
    ('Saône-et-Loire',       '71', (SELECT id FROM regions WHERE code = 'BFC')),
    ('Yonne',                '89', (SELECT id FROM regions WHERE code = 'BFC')),
    ('Territoire de Belfort','90', (SELECT id FROM regions WHERE code = 'BFC'));

-- Bretagne
INSERT INTO departments (name, code, region_id) VALUES
    ('Côtes-d''Armor',  '22', (SELECT id FROM regions WHERE code = 'BRE')),
    ('Finistère',       '29', (SELECT id FROM regions WHERE code = 'BRE')),
    ('Ille-et-Vilaine', '35', (SELECT id FROM regions WHERE code = 'BRE')),
    ('Morbihan',        '56', (SELECT id FROM regions WHERE code = 'BRE'));

-- Centre-Val de Loire
INSERT INTO departments (name, code, region_id) VALUES
    ('Cher',           '18', (SELECT id FROM regions WHERE code = 'CVL')),
    ('Eure-et-Loir',   '28', (SELECT id FROM regions WHERE code = 'CVL')),
    ('Indre',          '36', (SELECT id FROM regions WHERE code = 'CVL')),
    ('Indre-et-Loire', '37', (SELECT id FROM regions WHERE code = 'CVL')),
    ('Loir-et-Cher',   '41', (SELECT id FROM regions WHERE code = 'CVL')),
    ('Loiret',         '45', (SELECT id FROM regions WHERE code = 'CVL'));

-- Corse
INSERT INTO departments (name, code, region_id) VALUES
    ('Corse-du-Sud', '2A', (SELECT id FROM regions WHERE code = 'COR')),
    ('Haute-Corse',  '2B', (SELECT id FROM regions WHERE code = 'COR'));

-- Grand Est
INSERT INTO departments (name, code, region_id) VALUES
    ('Ardennes',            '08', (SELECT id FROM regions WHERE code = 'GES')),
    ('Aube',                '10', (SELECT id FROM regions WHERE code = 'GES')),
    ('Marne',               '51', (SELECT id FROM regions WHERE code = 'GES')),
    ('Haute-Marne',         '52', (SELECT id FROM regions WHERE code = 'GES')),
    ('Meurthe-et-Moselle',  '54', (SELECT id FROM regions WHERE code = 'GES')),
    ('Meuse',               '55', (SELECT id FROM regions WHERE code = 'GES')),
    ('Moselle',             '57', (SELECT id FROM regions WHERE code = 'GES')),
    ('Bas-Rhin',            '67', (SELECT id FROM regions WHERE code = 'GES')),
    ('Haut-Rhin',           '68', (SELECT id FROM regions WHERE code = 'GES')),
    ('Vosges',              '88', (SELECT id FROM regions WHERE code = 'GES'));

-- Hauts-de-France
INSERT INTO departments (name, code, region_id) VALUES
    ('Aisne',         '02', (SELECT id FROM regions WHERE code = 'HDF')),
    ('Nord',          '59', (SELECT id FROM regions WHERE code = 'HDF')),
    ('Oise',          '60', (SELECT id FROM regions WHERE code = 'HDF')),
    ('Pas-de-Calais', '62', (SELECT id FROM regions WHERE code = 'HDF')),
    ('Somme',         '80', (SELECT id FROM regions WHERE code = 'HDF'));

-- Île-de-France
INSERT INTO departments (name, code, region_id) VALUES
    ('Paris',              '75', (SELECT id FROM regions WHERE code = 'IDF')),
    ('Seine-et-Marne',     '77', (SELECT id FROM regions WHERE code = 'IDF')),
    ('Yvelines',           '78', (SELECT id FROM regions WHERE code = 'IDF')),
    ('Essonne',            '91', (SELECT id FROM regions WHERE code = 'IDF')),
    ('Hauts-de-Seine',     '92', (SELECT id FROM regions WHERE code = 'IDF')),
    ('Seine-Saint-Denis',  '93', (SELECT id FROM regions WHERE code = 'IDF')),
    ('Val-de-Marne',       '94', (SELECT id FROM regions WHERE code = 'IDF')),
    ('Val-d''Oise',        '95', (SELECT id FROM regions WHERE code = 'IDF'));

-- Normandie
INSERT INTO departments (name, code, region_id) VALUES
    ('Calvados',        '14', (SELECT id FROM regions WHERE code = 'NOR')),
    ('Eure',            '27', (SELECT id FROM regions WHERE code = 'NOR')),
    ('Manche',          '50', (SELECT id FROM regions WHERE code = 'NOR')),
    ('Orne',            '61', (SELECT id FROM regions WHERE code = 'NOR')),
    ('Seine-Maritime',  '76', (SELECT id FROM regions WHERE code = 'NOR'));

-- Nouvelle-Aquitaine
INSERT INTO departments (name, code, region_id) VALUES
    ('Charente',              '16', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Charente-Maritime',     '17', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Corrèze',              '19', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Creuse',               '23', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Dordogne',             '24', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Gironde',              '33', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Landes',               '40', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Lot-et-Garonne',       '47', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Pyrénées-Atlantiques', '64', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Deux-Sèvres',         '79', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Vienne',               '86', (SELECT id FROM regions WHERE code = 'NAQ')),
    ('Haute-Vienne',         '87', (SELECT id FROM regions WHERE code = 'NAQ'));

-- Occitanie
INSERT INTO departments (name, code, region_id) VALUES
    ('Ariège',                '09', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Aude',                  '11', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Aveyron',               '12', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Gard',                  '30', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Haute-Garonne',         '31', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Gers',                  '32', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Hérault',               '34', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Lot',                   '46', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Lozère',                '48', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Hautes-Pyrénées',       '65', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Pyrénées-Orientales',   '66', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Tarn',                  '81', (SELECT id FROM regions WHERE code = 'OCC')),
    ('Tarn-et-Garonne',       '82', (SELECT id FROM regions WHERE code = 'OCC'));

-- Pays de la Loire
INSERT INTO departments (name, code, region_id) VALUES
    ('Loire-Atlantique', '44', (SELECT id FROM regions WHERE code = 'PDL')),
    ('Maine-et-Loire',   '49', (SELECT id FROM regions WHERE code = 'PDL')),
    ('Mayenne',          '53', (SELECT id FROM regions WHERE code = 'PDL')),
    ('Sarthe',           '72', (SELECT id FROM regions WHERE code = 'PDL')),
    ('Vendée',           '85', (SELECT id FROM regions WHERE code = 'PDL'));

-- Provence-Alpes-Côte d'Azur
INSERT INTO departments (name, code, region_id) VALUES
    ('Alpes-de-Haute-Provence', '04', (SELECT id FROM regions WHERE code = 'PACA')),
    ('Hautes-Alpes',            '05', (SELECT id FROM regions WHERE code = 'PACA')),
    ('Alpes-Maritimes',         '06', (SELECT id FROM regions WHERE code = 'PACA')),
    ('Bouches-du-Rhône',        '13', (SELECT id FROM regions WHERE code = 'PACA')),
    ('Var',                     '83', (SELECT id FROM regions WHERE code = 'PACA')),
    ('Vaucluse',                '84', (SELECT id FROM regions WHERE code = 'PACA'));

-- Overseas departments
INSERT INTO departments (name, code, region_id) VALUES
    ('Guadeloupe',  '971', (SELECT id FROM regions WHERE code = 'GUA')),
    ('Martinique',  '972', (SELECT id FROM regions WHERE code = 'MTQ')),
    ('Guyane',      '973', (SELECT id FROM regions WHERE code = 'GUF')),
    ('La Réunion',  '974', (SELECT id FROM regions WHERE code = 'REU')),
    ('Mayotte',     '976', (SELECT id FROM regions WHERE code = 'MAY'));

-- -----------------------------------------------------------------------------
-- Update existing cities with department_id, then delete and re-insert all 100
-- -----------------------------------------------------------------------------

-- First, update existing cities that match our 100 towns with their department
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '13')
WHERE name = 'Aix-en-Provence';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '69')
WHERE name = 'Lyon';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '13')
WHERE name = 'Marseille';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '33')
WHERE name = 'Bordeaux';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '31')
WHERE name = 'Toulouse';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '06')
WHERE name = 'Nice';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '44')
WHERE name = 'Nantes';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '67')
WHERE name = 'Strasbourg';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '34')
WHERE name = 'Montpellier';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '59')
WHERE name = 'Lille';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '35')
WHERE name = 'Rennes';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '51')
WHERE name = 'Reims';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '83')
WHERE name = 'Toulon';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '42'), name = 'Saint-Étienne'
WHERE name = 'Saint-Etienne';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '76')
WHERE name = 'Le Havre';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '38')
WHERE name = 'Grenoble';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '21')
WHERE name = 'Dijon';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '49')
WHERE name = 'Angers';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '06')
WHERE name = 'Cannes';
UPDATE cities SET department_id = (SELECT id FROM departments WHERE code = '75')
WHERE name = 'Paris';

-- Now insert the remaining 80 cities (not already seeded)
INSERT INTO cities (name, postal_code, region_id, department_id) VALUES
    ('Amiens',                '80000', (SELECT id FROM regions WHERE code = 'HDF'),  (SELECT id FROM departments WHERE code = '80')),
    ('Angoulême',             '16000', (SELECT id FROM regions WHERE code = 'NAQ'),  (SELECT id FROM departments WHERE code = '16')),
    ('Annecy',                '74000', (SELECT id FROM regions WHERE code = 'ARA'),  (SELECT id FROM departments WHERE code = '74')),
    ('Antibes',               '06600', (SELECT id FROM regions WHERE code = 'PACA'), (SELECT id FROM departments WHERE code = '06')),
    ('Argenteuil',            '95100', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '95')),
    ('Asnières-sur-Seine',    '92600', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '92')),
    ('Aubervilliers',         '93300', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '93')),
    ('Avignon',               '84000', (SELECT id FROM regions WHERE code = 'PACA'), (SELECT id FROM departments WHERE code = '84')),
    ('Bayonne',               '64100', (SELECT id FROM regions WHERE code = 'NAQ'),  (SELECT id FROM departments WHERE code = '64')),
    ('Besançon',              '25000', (SELECT id FROM regions WHERE code = 'BFC'),  (SELECT id FROM departments WHERE code = '25')),
    ('Béziers',               '34500', (SELECT id FROM regions WHERE code = 'OCC'),  (SELECT id FROM departments WHERE code = '34')),
    ('Boulogne-Billancourt',  '92100', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '92')),
    ('Bourges',               '18000', (SELECT id FROM regions WHERE code = 'CVL'),  (SELECT id FROM departments WHERE code = '18')),
    ('Brest',                 '29200', (SELECT id FROM regions WHERE code = 'BRE'),  (SELECT id FROM departments WHERE code = '29')),
    ('Caen',                  '14000', (SELECT id FROM regions WHERE code = 'NOR'),  (SELECT id FROM departments WHERE code = '14')),
    ('Cagnes-sur-Mer',        '06800', (SELECT id FROM regions WHERE code = 'PACA'), (SELECT id FROM departments WHERE code = '06')),
    ('Chambéry',              '73000', (SELECT id FROM regions WHERE code = 'ARA'),  (SELECT id FROM departments WHERE code = '73')),
    ('Champigny-sur-Marne',   '94500', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '94')),
    ('Clermont-Ferrand',      '63000', (SELECT id FROM regions WHERE code = 'ARA'),  (SELECT id FROM departments WHERE code = '63')),
    ('Colmar',                '68000', (SELECT id FROM regions WHERE code = 'GES'),  (SELECT id FROM departments WHERE code = '68')),
    ('Colombes',              '92700', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '92')),
    ('Créteil',               '94000', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '94')),
    ('Drancy',                '93700', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '93')),
    ('Dunkerque',             '59140', (SELECT id FROM regions WHERE code = 'HDF'),  (SELECT id FROM departments WHERE code = '59')),
    ('Évry-Courcouronnes',    '91000', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '91')),
    ('Fontenay-sous-Bois',    '94120', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '94')),
    ('Fréjus',                '83600', (SELECT id FROM regions WHERE code = 'PACA'), (SELECT id FROM departments WHERE code = '83')),
    ('Hyères',                '83400', (SELECT id FROM regions WHERE code = 'PACA'), (SELECT id FROM departments WHERE code = '83')),
    ('Issy-les-Moulineaux',   '92130', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '92')),
    ('Ivry-sur-Seine',        '94200', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '94')),
    ('La Rochelle',           '17000', (SELECT id FROM regions WHERE code = 'NAQ'),  (SELECT id FROM departments WHERE code = '17')),
    ('La Seyne-sur-Mer',      '83500', (SELECT id FROM regions WHERE code = 'PACA'), (SELECT id FROM departments WHERE code = '83')),
    ('Le Mans',               '72000', (SELECT id FROM regions WHERE code = 'PDL'),  (SELECT id FROM departments WHERE code = '72')),
    ('Levallois-Perret',      '92300', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '92')),
    ('Limoges',               '87000', (SELECT id FROM regions WHERE code = 'NAQ'),  (SELECT id FROM departments WHERE code = '87')),
    ('Lorient',               '56100', (SELECT id FROM regions WHERE code = 'BRE'),  (SELECT id FROM departments WHERE code = '56')),
    ('Metz',                  '57000', (SELECT id FROM regions WHERE code = 'GES'),  (SELECT id FROM departments WHERE code = '57')),
    ('Montauban',             '82000', (SELECT id FROM regions WHERE code = 'OCC'),  (SELECT id FROM departments WHERE code = '82')),
    ('Montreuil',             '93100', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '93')),
    ('Mulhouse',              '68100', (SELECT id FROM regions WHERE code = 'GES'),  (SELECT id FROM departments WHERE code = '68')),
    ('Nancy',                 '54000', (SELECT id FROM regions WHERE code = 'GES'),  (SELECT id FROM departments WHERE code = '54')),
    ('Nanterre',              '92000', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '92')),
    ('Neuilly-sur-Seine',     '92200', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '92')),
    ('Nîmes',                 '30000', (SELECT id FROM regions WHERE code = 'OCC'),  (SELECT id FROM departments WHERE code = '30')),
    ('Noisy-le-Grand',        '93160', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '93')),
    ('Orléans',               '45000', (SELECT id FROM regions WHERE code = 'CVL'),  (SELECT id FROM departments WHERE code = '45')),
    ('Pau',                   '64000', (SELECT id FROM regions WHERE code = 'NAQ'),  (SELECT id FROM departments WHERE code = '64')),
    ('Perpignan',             '66000', (SELECT id FROM regions WHERE code = 'OCC'),  (SELECT id FROM departments WHERE code = '66')),
    ('Poitiers',              '86000', (SELECT id FROM regions WHERE code = 'NAQ'),  (SELECT id FROM departments WHERE code = '86')),
    ('Quimper',               '29000', (SELECT id FROM regions WHERE code = 'BRE'),  (SELECT id FROM departments WHERE code = '29')),
    ('Roubaix',               '59100', (SELECT id FROM regions WHERE code = 'HDF'),  (SELECT id FROM departments WHERE code = '59')),
    ('Rouen',                 '76000', (SELECT id FROM regions WHERE code = 'NOR'),  (SELECT id FROM departments WHERE code = '76')),
    ('Saint-Denis',           '93200', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '93')),
    ('Saint-Malo',            '35400', (SELECT id FROM regions WHERE code = 'BRE'),  (SELECT id FROM departments WHERE code = '35')),
    ('Saint-Nazaire',         '44600', (SELECT id FROM regions WHERE code = 'PDL'),  (SELECT id FROM departments WHERE code = '44')),
    ('Sarcelles',             '95200', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '95')),
    ('Tarbes',                '65000', (SELECT id FROM regions WHERE code = 'OCC'),  (SELECT id FROM departments WHERE code = '65')),
    ('Tourcoing',             '59200', (SELECT id FROM regions WHERE code = 'HDF'),  (SELECT id FROM departments WHERE code = '59')),
    ('Tours',                 '37000', (SELECT id FROM regions WHERE code = 'CVL'),  (SELECT id FROM departments WHERE code = '37')),
    ('Troyes',                '10000', (SELECT id FROM regions WHERE code = 'GES'),  (SELECT id FROM departments WHERE code = '10')),
    ('Valence',               '26000', (SELECT id FROM regions WHERE code = 'ARA'),  (SELECT id FROM departments WHERE code = '26')),
    ('Vannes',                '56000', (SELECT id FROM regions WHERE code = 'BRE'),  (SELECT id FROM departments WHERE code = '56')),
    ('Versailles',            '78000', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '78')),
    ('Villejuif',             '94800', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '94')),
    ('Villeurbanne',          '69100', (SELECT id FROM regions WHERE code = 'ARA'),  (SELECT id FROM departments WHERE code = '69')),
    ('Villeneuve-d''Ascq',    '59491', (SELECT id FROM regions WHERE code = 'HDF'),  (SELECT id FROM departments WHERE code = '59')),
    ('Vitry-sur-Seine',       '94400', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '94')),
    ('Albi',                  '81000', (SELECT id FROM regions WHERE code = 'OCC'),  (SELECT id FROM departments WHERE code = '81')),
    ('Arles',                 '13200', (SELECT id FROM regions WHERE code = 'PACA'), (SELECT id FROM departments WHERE code = '13')),
    ('Auxerre',               '89000', (SELECT id FROM regions WHERE code = 'BFC'),  (SELECT id FROM departments WHERE code = '89')),
    ('Bastia',                '20200', (SELECT id FROM regions WHERE code = 'COR'),  (SELECT id FROM departments WHERE code = '2B')),
    ('Beauvais',              '60000', (SELECT id FROM regions WHERE code = 'HDF'),  (SELECT id FROM departments WHERE code = '60')),
    ('Blois',                 '41000', (SELECT id FROM regions WHERE code = 'CVL'),  (SELECT id FROM departments WHERE code = '41')),
    ('Brive-la-Gaillarde',    '19100', (SELECT id FROM regions WHERE code = 'NAQ'),  (SELECT id FROM departments WHERE code = '19')),
    ('Carcassonne',           '11000', (SELECT id FROM regions WHERE code = 'OCC'),  (SELECT id FROM departments WHERE code = '11')),
    ('Castres',               '81100', (SELECT id FROM regions WHERE code = 'OCC'),  (SELECT id FROM departments WHERE code = '81')),
    ('Chalon-sur-Saône',      '71100', (SELECT id FROM regions WHERE code = 'BFC'),  (SELECT id FROM departments WHERE code = '71')),
    ('Cholet',                '49300', (SELECT id FROM regions WHERE code = 'PDL'),  (SELECT id FROM departments WHERE code = '49')),
    ('Dieppe',                '76200', (SELECT id FROM regions WHERE code = 'NOR'),  (SELECT id FROM departments WHERE code = '76')),
    ('Épinal',                '88000', (SELECT id FROM regions WHERE code = 'GES'),  (SELECT id FROM departments WHERE code = '88')),
    ('Gap',                   '05000', (SELECT id FROM regions WHERE code = 'PACA'), (SELECT id FROM departments WHERE code = '05')),
    ('Laval',                 '53000', (SELECT id FROM regions WHERE code = 'PDL'),  (SELECT id FROM departments WHERE code = '53')),
    ('Mâcon',                 '71000', (SELECT id FROM regions WHERE code = 'BFC'),  (SELECT id FROM departments WHERE code = '71')),
    ('Meaux',                 '77100', (SELECT id FROM regions WHERE code = 'IDF'),  (SELECT id FROM departments WHERE code = '77')),
    ('Niort',                 '79000', (SELECT id FROM regions WHERE code = 'NAQ'),  (SELECT id FROM departments WHERE code = '79')),
    ('Saint-Brieuc',          '22000', (SELECT id FROM regions WHERE code = 'BRE'),  (SELECT id FROM departments WHERE code = '22')),
    ('Sète',                  '34200', (SELECT id FROM regions WHERE code = 'OCC'),  (SELECT id FROM departments WHERE code = '34'));

-- -----------------------------------------------------------------------------
-- RLS: Allow public read on departments
-- -----------------------------------------------------------------------------
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "departments_public_read" ON departments FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- Index for city filtering by department
-- -----------------------------------------------------------------------------
CREATE INDEX idx_cities_department ON cities(department_id);
