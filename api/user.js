const db = require('../database/config');
const connection = db.getConnection();

const USER_EXISTS = "SELECT * FROM user_info WHERE user_id = $1";
const ADD_USER = "INSERT INTO user_info VALUES($1, $2, $3, $4)";
const SEND_FRIEND_REQUEST = "INSERT INTO friend_status VALUES($1, $2, $3, $4)";

const STATUS_PENDING = 0;
const STATUS_ACCEPTED = 1;
const STATUS_DECLINED = 2;

module.exports = {
    login: function(id, firstName, lastName, profileImage) {
        return connection.query(USER_EXISTS, [id])
            .then(function(rows) {
                if (rows.length == 0) {
                    connection.query(ADD_USER, [id, firstName, lastName, profileImage]);
                }
            });
    },

    sendFriendRequest: function(senderId, receiverId) {
        var userOneId = Math.min(senderId, receiverId);
        var userTwoId = Math.max(senderId, receiverId);
        return connection.query(SEND_FRIEND_REQUEST, [userOneId, userTwoId, senderId, STATUS_PENDING]);
    }
};