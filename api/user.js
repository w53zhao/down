const db = require('../database/config');
const connection = db.getConnection();

const USER_EXISTS = "SELECT * FROM user_info WHERE user_id = $1";
const ADD_USER = "INSERT INTO user_info VALUES($1, $2, $3, $4)";
const GET_FRIENDS = "SELECT * FROM user_friends WHERE (user_one_id = $1 OR user_two_id = $1)";
const GET_FRIENDS_INFO = "SELECT * FROM user_info WHERE user_id = ANY($1::BIGINT[])";

module.exports = {
    login: function(id, firstName, lastName, profileImage) {
        return connection.query(USER_EXISTS, [id])
            .then(function(rows) {
                if (rows.length == 0) {
                    connection.query(ADD_USER, [id, firstName, lastName, profileImage]);
                }
            });
    },

    getFriendsList: function(id) {
        return connection.query(GET_FRIENDS, [id])
            .then(function(rows) {
                var list = [];
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].user_one_id == id) list.push(rows[i].user_two_id);
                    else list.push(rows[i].user_one_id);
                }

                return list;
            })
            .then(function(list) {
                return connection.query(GET_FRIENDS_INFO, [list])
            });
    }
};