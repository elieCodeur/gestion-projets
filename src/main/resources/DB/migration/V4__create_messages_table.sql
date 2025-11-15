CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT,
    project_id BIGINT,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users (id),
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES users (id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects (id)
);
