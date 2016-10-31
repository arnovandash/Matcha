module.exports = {
    add: add,
    users: users,
    login: login,
	checkUsername: checkUsername
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
	console.log('Username: ' + username + '\nPassword: ' + password);
    apoc.query("MATCH (n:Person) WHERE n.username = '`username`' RETURN n", {}, {
            username: username
        }).exec(server)
		.then(function(result) {
			console.log('result: ' + result[0].data[0]);
			if (result[0].data[0] !== undefined) {
				var user = result[0].data[0].row[0];
				console.log('got back: ' + user);
				if (user.password !== undefined) {
					var hashSalt = JSON.parse(user.password);
					if (hash.checkHash(hashSalt, password)) {
						console.log('User: ' + user.username + ' logged in');
						callback({ username: user.username });
					} else {
						callback(null);
					}
				} else {
					callback(null);
				}
			} else {
				callback(null);
			}
		}, function(fail) {
			console.log('Error');
			console.log(util.inspect(fail, { depth: null }));
		});
}

function checkUsername(username, callback) {
	apoc.query("MATCH (n:Person) WHERE n.username='`username`' RETURN count(n)", {}, {
		username: username
	}).exec(server)
	.then(function(result) {
        console.log(util.inspect(result, {
            depth: null
        }));
        console.log(result[0].data[0].row[0]);
		callback(result[0].data[0].row[0]);
    }, function(fail) {
        console.log(fail);
    });
}