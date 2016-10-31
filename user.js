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


/******************************************************************************/
/*    Adds a new user to the database.                                        */
/*    All feilds are checked not undefined before adding.                     */
/*                                                                            */
/*    returns false on successful addition, true on fail                      */
/******************************************************************************/
function add(username, firstname, lastname, gender, lookingFor, birthdate, email, password, callback) {
    if (username === undefined ||
		firstname === undefined ||
		lastname === undefined ||
		gender === undefined ||
		lookingFor === undefined ||
		birthdate === undefined ||
		email === undefined ||
		password === undefined ||
		birthdate.day === undefined ||
		birthdate.month === undefined ||
		birthdate.year === undefined ||
		lookingFor.male === undefined ||
		lookingFor.female === undefined ||
		lookingFor.other === undefined) {
        callback('undefined field');
        return true;
    }
    birthdate = parseInt(new Date(birthdate.year, birthdate.month, birthdate.day).getTime() / 1000);
    apoc.query("CREATE (n:Person { username: '`user`', firstname: '`first`', lastname: '`last`', birthdate: `birthdate`, email: '`email`', password: '`password`' }) RETURN n", {}, {
            user: username,
            first: firstname,
            last: lastname,
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
			var query = "MATCH (a:Person {username: '`username`'}) MERGE (g:Gender {gender: '`gender`'}) MERGE (a)-[:GENDER]->(g)";
			if (lookingFor.male) {
				query += " MERGE (m:Gender {gender: 'M'}) MERGE (a)-[:SEEKING]->(m)";
			}
			if (lookingFor.female) {
				query += " MERGE (f:Gender {gender: 'F'}) MERGE (a)-[:SEEKING]->(f)";
			}
			if (lookingFor.other) {
				query += " MERGE (o:Gender {gender: 'O'}) MERGE (a)-[:SEEKING]->(o)";
			}
			apoc.query(query, {}, {
				username: username,
				gender: gender
			})
			.exec(server)
			.then(function(result) {
				console.log('"Gender" relationships created');
				callback(false);
				return false;
			}, function(fail) {
				console.log(fail);
				callback(fail);
				return true;
			});
        }, function(fail) {
            console.log(fail);
            callback(fail);
            return true;
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
                        callback({
                            username: user.username
                        });
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
            console.log(util.inspect(fail, {
                depth: null
            }));
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