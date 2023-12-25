CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    chat_id INT NOT NULL,
    photo_id INT,
    send_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (photo_id) REFERENCES photos(id)
);

CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    creation_date DATE NOT NULL,
    creator_user_id INT NOT NULL,
    FOREIGN KEY (creator_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS chat_members (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    chat_id INT NOT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leave_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (chat_id) REFERENCES chats(id)
);

CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    chat_id INT NOT NULL,
    photo_id INT NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES chats(id),
    FOREIGN KEY (photo_id) REFERENCES photos(id)
);