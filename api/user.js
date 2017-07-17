const db = require('../database/config');
const connection = db.getConnection();
const User = require('../user');
const format = require('pg-format');

const USER_EXISTS = "SELECT * FROM user_info WHERE user_id = $1";
const ADD_USER = "INSERT INTO user_info VALUES($1, $2, $3, $4)";
const GET_FRIENDS = "SELECT * FROM user_friends WHERE (user_one_id = $1 OR user_two_id = $1)";
const GET_FRIENDS_INFO = "SELECT * FROM user_info WHERE user_id = ANY($1::BIGINT[])"
const GET_EVENTS = "SELECT s.event_id, s.sender_id, s.receiver_id, s.status, d.event_time, d.location, d.sender_vote, d.receiver_vote, d.yelp_results FROM event_status s JOIN event_details d ON s.event_id = d.event_id WHERE (s.sender_id = $1 OR s.receiver_id = $1) AND NOT s.status = 2 AND d.event_time >= CURRENT_TIMESTAMP - INTERVAL '1 hour'";
const ADD_FRIENDS = "INSERT INTO user_friends (user_one_id, user_two_id) VALUES %L";

module.exports = {
    login: function(id, firstName, lastName, profileImage, friends) {
        return connection.query(USER_EXISTS, [id])
            .then(function(rows) {
                if (rows.length == 0) {
                    connection.query(ADD_USER, [id, firstName, lastName, profileImage]);
                }

                var rows = [];
                for (var i = 0; i < friends.length; i++) {
                    if (id <= friends[i]) rows.push([id, friends[i]]);
                    else rows.push([friends[i], id]);
                }

                var add = format(ADD_FRIENDS, rows);
                connection.query(add)
                    .catch(function(error) {
                        if (error.code == 23505) return;
                    });
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
    },

    getEvents: function(id) {
        return connection.query(GET_EVENTS, [id])
            .then(function(rows) {
                var list = [];
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].sender_id == id) list.push(rows[i].receiver_id);
                    else list.push(rows[i].sender_id);
                }
                return {
                    'events': rows,
                    'friends': list
                }
            })
            .then(function(results) {
                var events = results.events;
                var friends = results.friends;
                return connection.query(GET_FRIENDS_INFO, [friends])
                    .then(function(rows) {
                        return {
                            'events': events,
                            'friends': rows
                        }
                    })
            })
            .then(function(results) {
                var events = results.events;
                var friends = results.friends;
                var users = {};
                for (var i = 0; i < friends.length; i++) {
                    users[friends[i].user_id] = (new User(friends[i]));
                }
                return {
                    'events': events,
                    'friends': users
                }
            });
    }
};