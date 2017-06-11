const db = require('../database/config');
const connection = db.getConnection();

const USER_EXISTS = "SELECT * FROM user_info WHERE user_id = $1";
const ADD_USER = "INSERT INTO user_info (user_id, first_name, last_name, profile_image) VALUES ($1, $2, $3, $4)";

module.exports = {
    login: function(id, firstName, lastName, profileImage) {
        connection.query(USER_EXISTS, [id])
            .then(function(rows) {
                if (rows.length == 0) {
                    connection.query(ADD_USER, [id, firstName, lastName, profileImage]);
                }
            });
    }
}