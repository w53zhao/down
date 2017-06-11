const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./api/user');
const yelp = require('./api/yelp');
const Venue = require('./venue');

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.post('/login', function(req, res) {
    var body = req.body;
    var id = body.id;
    var firstName = body.firstName;
    var lastName = body.lastName;
    var profileImage = body.profileImage;

    user.login(id, firstName, lastName, profileImage);
    res.send({'success': true});
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
        });
});

app.listen(process.env.PORT || 5000);


