const db = require('../database/config');
const connection = db.getConnection();

const SEND_EVENT_REQUEST = "INSERT INTO event_status(sender_id, receiver_id, status) VALUES($1, $2, $3) RETURNING event_id";
const UPDATE_EVENT_STATUS = "UPDATE event_status SET status = $1 WHERE event_id = $2";
const UPDATE_SENDER_LOCATION = "INSERT INTO event_details(event_id, sender_latitude, sender_longitude, event_time) VALUES($1, $2, $3, $4)";
const UPDATE_RECEIVER_LOCATION = "UPDATE event_details SET receiver_latitude = $1, receiver_longitude = $2 WHERE event_id = $3";
const DELETE_EVENT_DETAILS = "DELETE FROM event_details WHERE event_id = $1";


const STATUS_PENDING = 0;
const STATUS_ACCEPTED = 1;
const STATUS_DECLINED = 2;

module.exports = {
    sendEventRequest: function(senderId, receiverId, senderLatitude, senderLongitude, eventTime) {
        return connection.query(SEND_EVENT_REQUEST, [senderId, receiverId, STATUS_PENDING])
            .then(function(results) {
                connection.query(UPDATE_SENDER_LOCATION, [results[0].event_id, senderLatitude, senderLongitude, eventTime]);
                return results[0].event_id;
            });
    },

    acceptEvent: function(eventId, latitude, longitude) {
        return connection.query(UPDATE_EVENT_STATUS, [STATUS_ACCEPTED, eventId])
            .then(function() {
                connection.query(UPDATE_RECEIVER_LOCATION, [latitude, longitude, eventId]);
            });
    },

    declineEvent: function(eventId){
        return connection.query(UPDATE_EVENT_STATUS, [STATUS_DECLINED, eventId])
            .then(function() {
                connection.query(DELETE_EVENT_DETAILS, [eventId]);
            });
    }
};