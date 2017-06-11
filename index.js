var express = require('express');
var app = express();
var yelp = require('./api/yelp');
var Venue = require('./venue');

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/venues', function(req, res) {
    var query = req.query;
    var event = query.event || 0;
    var venue = query.venue;
    var latitude = query.latitude;
    var longitude = query.longitude;

    yelp.search(event, venue, latitude, longitude)
        .then(function(results) {
            var venues = [];
            for (var i = 0; i < results.businesses.length; i++) {
                venues.push(new Venue(results.businesses[i]));
            }
            res.send(venues);
        })
});

app.listen(process.env.PORT || 5000);


