-- Création de la table des sprints
CREATE TABLE sprints (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sprint_number INT NOT NULL,
    start_date DATE,
    end_date DATE,
    status VARCHAR(255) NOT NULL,
    project_id BIGINT NOT NULL,
    
    CONSTRAINT fk_sprint_project FOREIGN KEY (project_id) REFERENCES projects (id)
);

-- Modification de la table des tâches
-- 1. Supprimer l'ancienne contrainte de clé étrangère
ALTER TABLE tasks DROP CONSTRAINT fk_project;

-- 2. Supprimer l'ancienne colonne
ALTER TABLE tasks DROP COLUMN project_id;

-- 3. Ajouter la nouvelle colonne pour le sprint
ALTER TABLE tasks ADD COLUMN sprint_id BIGINT;

-- 4. Ajouter la nouvelle contrainte de clé étrangère
ALTER TABLE tasks ADD CONSTRAINT fk_task_sprint FOREIGN KEY (sprint_id) REFERENCES sprints (id);
