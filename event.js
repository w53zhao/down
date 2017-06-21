const user = require('./api/user');
const User = require('./user');

function Event(data, friends, userId) {
    this.id = data.event_id;

    // status
    if (data.status == 1) {
        this.status = "finalized";
    } else {
        this.status = data.sender_id == userId ? "pending" : "actionRequired";
    }

    // other participant
    if (data.sender_id == userId) this.otherParticipant = friends[data.receiver_id];
    else this.otherParticipant = friends[data.sender_id];

    // location
    this.location = data.location;

    // time
    this.time = data.event_time;
}

module.exports = Event;