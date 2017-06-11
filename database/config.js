const pg = require('pg-promise')();
var config = {
    ssl: true,
    host: 'ec2-54-197-232-155.compute-1.amazonaws.com',
    port: 5432,
    database: 'da941dm9t6e5qe',
    user: 'exaoschhdzaflc',
    password: '75897da6545807d51cbaf6a509032cbd5804f68a26763ca708bc38fc89ca227b'
}
const db = pg(config);

module.exports = {
    getConnection: function() {
        return db;
    }
}