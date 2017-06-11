var Yelp = require('node-yelp-fusion');
var yelp = new Yelp({
    id: 'Fhpp8i_pXmQ_rszyX3ru1Q',
    secret: 'DZgzafJq7iAV5NnTMZCMXTzXNsU47U2RRR8OOsd0OhMnrF2awTfKwnh36TndGyb9'
});

module.exports = {
    search: function(venue, latitude, longitude) {
        return yelp.search(
            "categories=" + venue +
            "&latitude=" + latitude +
            "&longitude=" + longitude +
            "&limit=5" +
            "&sort_by=distance"
        );
    }
};