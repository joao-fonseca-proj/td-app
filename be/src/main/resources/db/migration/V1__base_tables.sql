-- -----------------------------
-- Table structure for users
-- -----------------------------
CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    encryption_salt VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UK_encryption_salt (encryption_salt)
) ENGINE=InnoDB;

CREATE TABLE panel (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    name VARCHAR(255),
    user_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT FK_panel_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

CREATE TABLE todo (
    id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    title VARCHAR(255),
    category VARCHAR(50) DEFAULT NULL,
    urgency VARCHAR(20) DEFAULT 'NORMAL',
    due_date DATE DEFAULT NULL,
    completed TINYINT(1) NOT NULL,
    position INT NOT NULL,
    panel_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT FK_todo_panel FOREIGN KEY (panel_id) REFERENCES panel (id)
) ENGINE=InnoDB;
