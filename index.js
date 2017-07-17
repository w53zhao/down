const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./api/user');
const event = require('./api/event');
const User = require('./user');
const Event = require('./event');

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.post('/login', function(req, res) {
    var body = req.body;
    var id = body.id;
    var firstName = body.firstName;
    var lastName = body.lastName;
    var friends = body.friends;
    var profileImage = body.profileImage;

    user.login(id, firstName, lastName, profileImage, friends)
        .then(function() {
            res.send({'success': true});
        })
        .catch(function(error) {
            res.send({'success': false, 'error': error});
        });
});

app.get('/friends/:userId', function(req, res) {
    var userId = req.params.userId;

    user.getFriendsList(userId)
        .then(function(results) {
            var friends = [];
            for (var i = 0; i < results.length; i++) {
                friends.push(new User(results[i]));
            }
            res.send(friends);
        })
        .catch(function(error) {
            res.send({'success': false, 'error': error});
        });
});

app.get('/events/:userId', function(req, res) {
    var userId = req.params.userId;

    user.getEvents(userId)
        .then(function(results) {
            var events = results.events;
            var friends = results.friends;
            var results = [];
            for (var i = 0; i < events.length; i++) {
                results.push(new Event(events[i], friends, userId));
            }
            res.send(results);
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
   var venueType = body.venueType;

   event.sendEventRequest(senderId, receiverId, senderLatitude, senderLongitude, eventTime, venueType)
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
        .then(function(results) {
            res.send(results);
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
       .catch(function(error) {
            res.send({'success': false, 'error': error});
       });
});

app.post('/event/vote', function(req, res) {
   var body = req.body;
   var eventId = body.eventId;
   var userId = body.userId;
   var votes = body.votes;

   event.vote(eventId, userId, votes)
       .then(function(results) {
           event.getEventDetails(eventId, userId)
               .then(function(results) {
                   var event = new Event(results.event, results.friend, userId);
                   res.send(event);
               })
               .catch(function(error) {
                   res.send({'success': false, 'error': error});
               })
       })
       .catch(function(error) {
           res.send({'success': false, 'error': error});
       });
});

app.get('/event/:eventId/:userId', function(req, res) {
    var eventId = req.params.eventId;
    var userId = req.params.userId;

    event.getEventDetails(eventId, userId)
        .then(function(results) {
            var event = new Event(results.event, results.friend, userId);
            res.send(event);
        });
});

app.listen(process.env.PORT || 5000);


