var Yelp = require('node-yelp-fusion');
var yelp = new Yelp({
    id: 'Fhpp8i_pXmQ_rszyX3ru1Q',
    secret: 'DZgzafJq7iAV5NnTMZCMXTzXNsU47U2RRR8OOsd0OhMnrF2awTfKwnh36TndGyb9'
});
var geolib = require('geolib');

module.exports = {
    search: function(event, venue, latitude, longitude) {
        // query db with event to get sender coordinates
        var locations = [
            {latitude: 43.4717443, longitude: -80.5475369},
            {latitude: latitude, longitude: longitude}
        ];
        var center = geolib.getCenter(locations);

        return yelp.search(
            "categories=" + venue +
            "&latitude=" + center.latitude +
            "&longitude=" + center.longitude +
            "&limit=5" +
            "&sort_by=distance"
        );
    }
};