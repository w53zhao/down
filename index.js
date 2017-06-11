var express = require('express');
var app = express();
var yelp = require('./api/yelp');
var Venue = require('./venue');

app.set('port', (process.env.PORT || 5000));

//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/venues', function(req, res) {
    var query = req.query;
    var venue = query.venue;
    var latitude = query.latitude;
    var longitude = query.longitude;

    yelp.search(venue, latitude, longitude)
        .then(function(results) {
            var venues = [];
            for (var i = 0; i < results.businesses.length; i++) {
                venues.push(new Venue(results.businesses[i]));
            }
            res.send(venues);
        })
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


