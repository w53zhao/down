const db = require('../database/config');
const connection = db.getConnection();

const yelp = require('./yelp');
const Venue = require('../venue');

const SEND_EVENT_REQUEST = "INSERT INTO event_status(sender_id, receiver_id, status) VALUES($1, $2, $3) RETURNING event_id";
const UPDATE_EVENT_STATUS = "UPDATE event_status SET status = $1 WHERE event_id = $2";
const UPDATE_SENDER_LOCATION = "INSERT INTO event_details(event_id, sender_latitude, sender_longitude, event_time, venue_type) VALUES($1, $2, $3, $4, $5)";
const UPDATE_RECEIVER_LOCATION = "UPDATE event_details SET receiver_latitude = $1, receiver_longitude = $2 WHERE event_id = $3";
const UPDATE_YELP_RESULTS = "UPDATE event_details SET yelp_results = $1 WHERE event_id = $2";
const DELETE_EVENT_DETAILS = "DELETE FROM event_details WHERE event_id = $1";
//const TEST = "SELECT yelp_results FROM event_details WHERE event_id = 37";
//const TEST2 = "UPDATE event_details SET location = $1 WHERE event_id = 37";

const STATUS_PENDING = 0;
const STATUS_ACCEPTED = 1;
const STATUS_DECLINED = 2;

module.exports = {
    /*test: function() {
        connection.query(TEST)
            .then(function(rows) {
                console.log(rows[0].yelp_results[0]);

                connection.query(TEST2, [rows[0].yelp_results[0]]);
            });
    },*/

    sendEventRequest: function(senderId, receiverId, senderLatitude, senderLongitude, eventTime, venueType) {
        return connection.query(SEND_EVENT_REQUEST, [senderId, receiverId, STATUS_PENDING])
            .then(function(results) {
                connection.query(UPDATE_SENDER_LOCATION, [results[0].event_id, senderLatitude, senderLongitude, eventTime, venueType]);
                return results[0].event_id;
            });
    },

    acceptEvent: function(eventId, latitude, longitude) {
        return connection.query(UPDATE_EVENT_STATUS, [STATUS_ACCEPTED, eventId])
            .then(function() {
                connection.query(UPDATE_RECEIVER_LOCATION, [latitude, longitude, eventId]);
                yelp.search(eventId)
                    .then(function(results) {
                        var venues = [];
                        for (var i = 0; i <results.businesses.length; i++) {
                            venues.push(new Venue(results.businesses[i]));
                        }
                        connection.query(UPDATE_YELP_RESULTS, [venues, eventId]);
                    });
            });
    },

    declineEvent: function(eventId){
        return connection.query(UPDATE_EVENT_STATUS, [STATUS_DECLINED, eventId])
            .then(function() {
                connection.query(DELETE_EVENT_DETAILS, [eventId]);
            });
    }
};