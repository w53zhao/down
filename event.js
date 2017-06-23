const user = require('./api/user');
const User = require('./user');

function Event(data, friends, userId) {
    this.id = data.event_id;

    // status
    if (data.status == 1) {
        if ((data.sender_id == userId && data.sender_vote == null) || (data.receiver_id == userId && data.receiver_vote == null)) {
            this.status = "needToVote";
        } else if ((data.sender_id == userId && data.receiver_vote == null) || (data.receiver_id == userId && data.sender_vote == null)) {
            this.status = "waitingForVote";
        } else {
            this.status = "finalized";
        }
    } else {
        this.status = data.sender_id == userId ? "waitingForResponse" : "needToRespond";
    }

    // other participant
    if (data.sender_id == userId) this.otherParticipant = friends[data.receiver_id];
    else this.otherParticipant = friends[data.sender_id];

    // location
    this.location = data.location;

    // time
    this.time = data.event_time;

    // yelp
    var yelpResults = data.yelp_results;
    if (yelpResults !== null) {
        var yelp = [];
        for (var i = 0; i < yelpResults.length; i++) {
            yelp.push(JSON.parse(yelpResults[i]));
        }
        this.yelpResults = yelp;
    } else {
        this.yelpResults = null;
    }
}

module.exports = Event;