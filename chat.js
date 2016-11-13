module.exports = {
    saveMessege: saveMessege,
    getChat: getChat
};

var mongo = require('./myMongo');

function saveMessege(msg) {

    msg.time = Math.round(new Date().getTime()/1000.0);
    mongo.insertChat(msg, function (result) {
        console.log(result);
    });
}

function getChat(to, from, callback) {
    mongo.find('chat',{$or: [{to:to, from:from},{to:from, from:to}]} ,function (result) {
        console.log(result);
        callback(result);
    })
}