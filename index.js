const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./api/user');
const event = require('./api/event');
const yelp = require('./api/yelp');
const Venue = require('./venue');
const User = require('./user');

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

    user.login(id, firstName, lastName, profileImage)
        .then(function() {
            res.send({'success': true});
        })
        .catch(function(error) {
            res.send({'success': false, 'error': error});
        });
});

app.get('/friends/:userId', function(req, res) {
    var userId = req.params.userId;

    user.getFriendList(userId)
        .then(function(results) {
            var friends = [];
            for (var i = 0; i < results.length; i++) {
                friends.push(new User(results[i]));
            }
            res.send(friends);
        });
});

app.post('/friend/add', function(req, res) {
   var body = req.body;
   var senderId = body.senderId;
   var receiverId = body.receiverId;

   user.sendFriendRequest(senderId, receiverId)
       .then(function() {
           res.send({'success': true});
       })
       .catch(function(error) {
           res.send({'success': false, 'error': error});
       });
});

app.post('/event/sendRequest', function(req, res) {
   var body = req.body;
   var senderId = body.senderId;
   var receiverId = body.receiverId;
   var senderLatitude = body.latitude;
   var senderLongitude = body.longitude;
   var eventTime = body.eventTime;

   event.sendEventRequest(senderId, receiverId, senderLatitude, senderLongitude, eventTime)
       .then(function(results) {
           res.send({'success': true, 'eventId': results});
       })
       .catch(function(error) {
           res.send({'success': false, 'error': error});
       });
});

app.post('/event/accept', function(req, res) {
   var body = req.body;
   var eventId = body.eventId;
   var longitude = body.longitude;
   var latitude = body.latitude;

    event.acceptEvent(eventId, latitude, longitude)
        .then(function() {
            res.send({'success': true});
        })
        .catch(function(error) {
            res.send({'success': false, 'error': error});
        });
});

app.post('/event/decline', function(req,res) {
   var body = req.body;
   var eventId = body.eventId;

   event.declineEvent(eventId)
       .then(function(){
            res.send({'success': true});
       })
       .catch(function(error){
            res.send({'success': false, 'error': error});
       });
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


