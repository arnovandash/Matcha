module.exports = {
    add: add,
    users: users,
    login: login,
    checkUsername: checkUsername,
	checkEmail: checkEmail
};

var apoc = require('apoc');
var util = require('util');
var hash = require('./hashsalt');
var server = require('./database').server;
var email = require('./email');
var mongo = require('mongodb');
var assert = require('assert');

var url= 'mongodb://localhost:27017/test';

/**
 * Adds a new user to the database, all parameters are required
 * @param	{string}	username	User's username
 * @param	{string}	firstname	User's firstname
 * @param	{string}	lastname	User's lastname
 * @param	{char}		gender		User's gender, 'M', 'F', 'O' accepted
 * @param	{array}		lookingFor	User's sexual attraction, array: {male: true|false, female: true|false, other: true|false}
 * @param	{array}		birthdate	User's birthdate, array: {day: [1-31], month: [1-12], year: [0-9]{4}}
 * @param	{string}	email		User's email address
 * @param	{string}	password	User's password
 * @param	{Function}	callback	Callback function for when the database returns
 */
function add(username, firstname, lastname, gender, lookingFor, birthdate, email, password, callback) {
/**
 * Checks that all the inputs are not undefined
 */
    if (typeof username !== 'string' ||
		typeof firstname !== 'string' ||
		typeof lastname !== 'string' ||
		(typeof gender !== 'string' && gender.length() !== 1) ||
		typeof lookingFor !== 'object' ||
		typeof birthdate !== 'object' ||
		typeof email !== 'string' ||
		typeof password !== 'string' ||
		typeof birthdate.day !== 'number' ||
		typeof birthdate.month !== 'number' ||
		typeof birthdate.year !== 'number' ||
		typeof lookingFor.male !== 'boolean' ||
		typeof lookingFor.female !== 'boolean' ||
		typeof lookingFor.other !== 'boolean') {
        callback('field of incorrect type');
        return true;
    }
/**
 * Converts birthdate in year, month, date array into epoch time
 */
    birthdate = parseInt(new Date(birthdate.year, birthdate.month, birthdate.day).getTime() / 1000);
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection('users').insertOne({
			username: username,
			firstname: firstname,
			lastname: lastname,
			birthdate: birthdate,
			email: email,
			password: hash.createHash(password)
		}, function(err, result) {
			assert.equal(null, err);
			console.log('User created mongo: ' + result);
			db.close();
		});
	});
/*    apoc.query("CREATE (n:Person { username: '`user`', firstname: '`first`', lastname: '`last`', birthdate: `birthdate`, email: '`email`', password: '`password`' }) RETURN n", {}, {
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
/**
 * Now that the user's node has been created, the relationships to the genders
 *  need to be created
 *
 * For the SEEKING relationship, a node is first MERGEd (so found if exists or
 *  created if not exists).
 * The node is matched and the relationship created seperately because neo4j
 *  handles a merge specifying a node and a relationship as unique in each case,
 *  and a new node is created. Matching separatly solves this issue.
 * Then the relationship is created with another MERGE. The relationships are
 *  made with MERGEs so that there's no accidental possibiility to make multiple
 *  relationships of the same kind.
 */
/*			var query = "MATCH (a:Person {username: '`username`'}) MERGE (g:Gender {gender: '`gender`'}) MERGE (a)-[:GENDER]->(g)";
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
        }); */
}

/**
 * Returns full details of all the nodes in the database of type Person (For debug purposes only)
 * @return {null}
 */
function users() {
	var result = [];
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		var cursor = db.collection('users').find();
		cursor.forEach(function(doc, err) {
			assert.equal(null, err);
			result.push(doc);
		}, function() {
			db.close();
			console.log(util.inspect(result, {depth: null}));
		});
	});
/*    apoc.query('MATCH (n:Person) RETURN n').exec(server).then(function(result) {
        console.log(util.inspect(result, {
            depth: null
        }));
        console.log(util.inspect(JSON.parse(result[0].data[0].row[0].password, {
            depth: null
        })));
    }, function(fail) {
        console.log(fail);
    }); */
}

/**
 * Attemps to login with the provided credentials
 * @param	{string}	username	Username crediential
 * @param	{string}	password	Password crediential
 * @param	{Function}	callback	Callback function called when database returns
 * @return	{null}
 */
function login(username, password, callback) {
    console.log('Username: ' + username + '\nPassword: ' + password);
    apoc.query("MATCH (n:Person {username: '`username`'}) RETURN n", {}, {
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

/**
 * Checks if the username exists in the database
 * @param	{string}	username	The username needed checking
 * @param	{Function}	callback	Function to call when the database returns
 * @return	{int}					Returns the number of nodes containing the username, should be 1 or 0
 */
function checkUsername(username, callback) {
    apoc.query("MATCH (n:Person {username: '`username`'}) RETURN count(n)", {}, {
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

/**
 * Checks if the email address exists in the database
 * @param	{string}	email		The email address needed checking
 * @param	{Function}	callback	Function to call when the database returns
 * @return	{int}					Returns the number of nodes containing the email, should be 1 or 0
 */
function checkEmail(email, callback) {
	apoc.query("MATCH (n:Person {email: '`email`'}) RETURN count(n)", {}, {
            email: email
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