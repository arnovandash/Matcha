module.exports = {
    saveMessege: saveMessege,
    getChat: getChat
};

var mongo = require('./myMongo');

function saveMessege(msg) {
    msg.time = Math.round(new Date().getTime() / 1000.0);
    mongo.insertChat(msg, function (result) {
        console.log(result);
    });
}

function getChat(to, from, callback) {
    mongo.find('chat', {to:to, from:from}, function (result) {
        console.log(result);
        callback(result);
    });
}