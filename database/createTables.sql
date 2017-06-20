CREATE TABLE "user_info" (
    user_id BIGINT PRIMARY KEY NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    profile_image TEXT
);

CREATE TABLE "event_status" (
    event_id SERIAL PRIMARY KEY NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    status INTEGER NOT NULL,
    FOREIGN KEY(sender_id) REFERENCES user_info(user_id) ON DELETE CASCADE,
    FOREIGN KEY(receiver_id) REFERENCES user_info(user_id) ON DELETE CASCADE
);

CREATE TABLE "event_details" (
    event_id INTEGER PRIMARY KEY,
    sender_latitude DOUBLE PRECISION NOT NULL,
    sender_longitude DOUBLE PRECISION NOT NULL,
    receiver_latitude DOUBLE PRECISION,
    receiver_longitude DOUBLE PRECISION,
    sender_vote JSONB,
    receiver_vote JSONB,
    yelp_results JSONB,
    event_time TIMESTAMP,
    location JSONB,
    FOREIGN KEY(event_id) REFERENCES event_status(event_id) ON DELETE CASCADE
);

CREATE TABLE "friend_status" (
    user_one_id BIGINT NOT NULL,
    user_two_id BIGINT NOT NULL,
    action_user_id BIGINT NOT NULL,
    status INTEGER NOT NULL,
    PRIMARY KEY(user_one_id, user_two_id),
    FOREIGN KEY(user_one_id) REFERENCES user_info(user_id) ON DELETE CASCADE,
    FOREIGN KEY(user_two_id) REFERENCES user_info(user_id) ON DELETE CASCADE,
    FOREIGN KEY(action_user_id) REFERENCES user_info(user_id) ON DELETE CASCADE
);