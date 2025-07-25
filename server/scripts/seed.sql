-- Se connecter à timezone_db avant d’exécuter

-- Réinitialisation optionnelle
TRUNCATE TABLE pointages, conges, dates_bloquees, users RESTART IDENTITY CASCADE;

-- Utilisateur : Admin
INSERT INTO users (nom, email, mot_de_passe, role)
VALUES 
('Admin User', 'admin@timezone.com', '$2b$10$3zN7hAKqF6OwrZqXz0W5hehsZ7St9a8xK7vT0l0z9jqKdIDT2XUCG', 'admin'); 


-- Utilisateur : Secrétaire
INSERT INTO users (nom, email, mot_de_passe, role)
VALUES 
('Julie Secretaire', 'secretariat@timezone.com', '$2b$10$5kKhl9OIQWBthprcztPI0ekIXacS4oz15TxEK4OWXt.0c6cN3WBQO', 'secretaire'); 


-- Utilisateur : Employé
INSERT INTO users (nom, email, mot_de_passe, role)
VALUES 
('Louis Employé', 'employe@timezone.com', '$2b$10$7vh5ZuY3Uk90lzqC1Wbb2eSxzRjJGheYtzMOkoExFf0h8QQGOzVpu', 'employe'); 


-- Congés de l'employé
INSERT INTO conges (user_id, type, date_debut, date_fin, statut)
VALUES 
(3, 'CP', '2025-08-01', '2025-08-05', 'en_attente'),
(3, 'RTT', '2025-07-15', '2025-07-16', 'valide');

-- Pointages de l'employé
INSERT INTO pointages (user_id, type, horodatage)
VALUES
(3, 'entree', '2025-07-25 08:00:00'),
(3, 'pause', '2025-07-25 12:00:00'),
(3, 'reprise', '2025-07-25 13:00:00'),
(3, 'sortie', '2025-07-25 17:00:00');

-- Dates bloquées (pour tous)
INSERT INTO dates_bloquees (date_debut, date_fin, motif)
VALUES
('2025-12-24', '2025-12-26', 'Période critique fin d’année'),
('2025-08-15', '2025-08-15', 'Jour férié');
