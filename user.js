module.exports = {
    add: add,
    users: users,
    login: login
};

var apoc = require('apoc');
var util = require('util');
var hash = require('./hashsalt');
var server = require('./database').server;

function add(username, firstname, lastname, gender, lookingFor, birthdate, email, password) {
    apoc.query("CREATE (n:Person { username: '`user`', firstname: '`first`', lastname: '`last`', gender: `gender`, preferance: '`preferance`', birthdate: `birthdate`, email: '`email`', password: '`password`' }) RETURN n", {}, {
            user: username,
            first: firstname,
            last: lastname,
            gender: gender,
            preferance: lookingFor,
            birthdate: birthdate,
            email: email,
            password: JSON.stringify(hash.createHash(password))
        })
        .exec(server)
		.then(function(result) {
            console.log("Node created");
            console.log(util.inspect(result, {
                depth: null
            }));
            //		console.log(util.inspect(result[0], {depth: null}));
        }, function(fail) {
            console.log(fail);
        });
}

function users() {
    apoc.query('MATCH (n:Person) RETURN n').exec(server).then(function(result) {
        console.log(util.inspect(result, {
            depth: null
        }));
        //		console.log(result[0].data[0].row);
        console.log(util.inspect(JSON.parse(result[0].data[0].row[0].password, {
            depth: null
        })));
    }, function(fail) {
        console.log(fail);
    });
}

function login(username, password, callback) {
    apoc.query("MATCH (n:Person) WHERE n.username = '`username`' RETURN n", {}, {
            username: username
        })
        .exec(server)
		.then(function(result) {
			var user = result[0].data[0].row[0];
			var hashSalt = JSON.parse(user.password);
			if (hash.checkHash(hashSalt, password)) {
				console.log('User: ' + user.username + ' logged in');
				callback({ username: user.username });
			} else {
				return callback(false);
			}
		}, function(fail) {
			console.log('Error');
			console.log(util.inspect(fail, { depth: null }));
		});
}