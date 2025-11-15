CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    
    CONSTRAINT fk_owner FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(255) NOT NULL,
    project_id BIGINT,
    assigned_user_id BIGINT,

    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT fk_assigned_user FOREIGN KEY (assigned_user_id) REFERENCES users (id)
);
