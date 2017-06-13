CREATE TABLE "user_info" (
    user_id BIGINT PRIMARY KEY NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    profile_image TEXT
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