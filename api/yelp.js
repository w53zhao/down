const Yelp = require('node-yelp-fusion');
const yelp = new Yelp({
    id: 'Fhpp8i_pXmQ_rszyX3ru1Q',
    secret: 'DZgzafJq7iAV5NnTMZCMXTzXNsU47U2RRR8OOsd0OhMnrF2awTfKwnh36TndGyb9'
});

const geolib = require('geolib');
const db = require('../database/config');
const connection = db.getConnection();

const GET_LOCATIONS = "SELECT sender_latitude, sender_longitude, receiver_latitude, receiver_longitude, venue_type FROM event_details WHERE event_id = $1";

module.exports = {
    search: function(eventId) {
        return connection.query(GET_LOCATIONS, eventId)
            .then(function(row) {
                var locations = [
                    {latitude: row[0].sender_latitude, longitude: row[0].sender_longitude},
                    {latitude: row[0].receiver_latitude, longitude: row[0].receiver_longitude}
                ];
                var center = geolib.getCenter(locations);

                return yelp.search(
                    "categories=" + row[0].venue_type +
                    "&latitude=" + center.latitude +
                    "&longitude=" + center.longitude +
                    "&limit=5" +
                    "&sort_by=distance"
                );
            });
    }
};