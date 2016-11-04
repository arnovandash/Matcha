module.exports = {
    add: add,
    listAll: users,
    login: login,
    checkUsername: checkUsername,
    checkEmail: checkEmail,
	confirmEmail: confirmEmail,
	sendReset: sendReset,
	confirmReset: confirmReset
};

var apoc = require('apoc');
var util = require('util');
var hash = require('./hashsalt');
var server = require('./database').server;
var email = require('./email');
var mongo = require('./myMongo');

/*******************************************************************************************************************************
 * Adds a new user to the database, all parameters are required                                                                *
 * @param   {string}    username    User's username                                                                            *
 * @param   {string}    firstname   User's firstname                                                                           *
 * @param   {string}    lastname    User's lastname                                                                            *
 * @param   {char}      gender      User's gender, 'M', 'F', 'O' accepted                                                      *
 * @param   {array}     lookingFor  User's sexual attraction, array: {male: true|false, female: true|false, other: true|false} *
 * @param   {array}     birthdate   User's birthdate, array: {day: [1-31], month: [1-12], year: [0-9]{4}}                      *
 * @param   {string}    email       User's email address                                                                       *
 * @param   {string}    password    User's password                                                                            *
 * @param   {Function}  callback    Callback function for when the database returns                                            *
 *******************************************************************************************************************************/
function add(username, firstname, lastname, gender, lookingFor, birthdate, email, password, callback) {
    /******************************************************
     * Checks that all the inputs are of the correct type *
     ******************************************************/
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
    /*****************************************************************
     * Converts birthdate in year, month, date array into epoch time *
     *****************************************************************/
    birthdate = parseInt(new Date(birthdate.year, birthdate.month, birthdate.day).getTime() / 1000);

    /*************************
     * Adds user to database *
     *************************/
    var id = null;
    mongo.insertUser({
        username: username,
        firstname: firstname,
        lastname: lastname,
        birthdate: birthdate,
        email: email,
        password: hash.createHash(password)
    }, function(result) {
        if (result.ok === true) {
			id = result.id;
			/*********************************************************************************
		     * First, the user's node gets created, the relationships to the genders need    *
		     *  to be created                                                                *
		     *                                                                               *
		     * For the SEEKING relationship, a node is first MERGEd (so found if exists or   *
		     *  created if not exists).                                                      *
		     * The node is matched and the relationship created seperately because neo4j     *
		     *  handles a merge specifying a node and a relationship as unique in each case, *
		     *  and a new node is created. Matching separatly solves this issue.             *
		     * Then the relationship is created with another MERGE. The relationships are    *
		     *  made with MERGEs so that there's no accidental possibiility to make multiple *
		     *  relationships of the same kind.                                              *
		     *********************************************************************************/
		    var query = "CREATE (a:Person {id: '`id`'}) MERGE (g:Gender {gender: '`gender`'}) MERGE (a)-[:GENDER]->(g)";
		    if (lookingFor.male === true) {
		        query += " MERGE (m:Gender {gender: 'M'}) MERGE (a)-[:SEEKING]->(m)";
		    }
		    if (lookingFor.female === true) {
		        query += " MERGE (f:Gender {gender: 'F'}) MERGE (a)-[:SEEKING]->(f)";
		    }
		    if (lookingFor.other === true) {
		        query += " MERGE (o:Gender {gender: 'O'}) MERGE (a)-[:SEEKING]->(o)";
		    }
		    apoc.query(query, {}, {
		            id: id,
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
        } else {
			console.log('Error creating user in Mongo: ' + result.err);
		}
    });
}

/**************************************************************************************************
 * Returns full details of all the nodes in the database of type Person (For debug purposes only) *
 * @return {null}                                                                                 *
 **************************************************************************************************/
function users() {
	mongo.find('users', {}, function(result) {
		console.log(util.inspect(result, {depth: null}));
	});
}

/**************************************************************************************
 * Attemps to login with the provided credentials                                     *
 * @param   {string}    username    Username crediential                              *
 * @param   {string}    password    Password crediential                              *
 * @param   {Function}  callback    Callback function called when database returns    *
 * @return  {null}                                                                    *
 **************************************************************************************/
function login(username, password, callback) {
	mongo.find('users', {username: username}, function(result) {
		if (result.length === 1) {
			if (result[0].token.email !== null && hash.checkHash(result[0].password, password)) {
				callback({
					username: result[0].username
				});
			} else {
				callback(null);
			}
		} else {
			callback(null);
		}
	});
}

/*************************************************************************************************************
 * Checks if the username exists in the database                                                             *
 * @param   {string}    username    The username needed checking                                             *
 * @param   {Function}  callback    Function to call when the database returns                               *
 * @return  {int}                   Returns the number of nodes containing the username, should be 1 or 0    *
 *************************************************************************************************************/
function checkUsername(username, callback) {
	mongo.find('users', {username: username}, function(result) {
		callback((result.length === 0));
	});
}

/**********************************************************************************************************
 * Checks if the email address exists in the database                                                     *
 * @param   {string}    email       The email address needed checking                                     *
 * @param   {Function}  callback    Function to call when the database returns                            *
 * @return  {int}                   Returns the number of nodes containing the email, should be 1 or 0    *
 **********************************************************************************************************/
function checkEmail(email, callback) {
	mongo.find('users', {email: email}, function(result) {
		callback((result.length === 0));
	});
}

/*******************************************************************************************
 * Gets the link from the confirmation email and removes the restriction from the database *
 * @method confirmEmail                                                                    *
 * @param  {String}     link     The link sent in the email                                *
 * @param  {Function}   callback Called when the database returns, true|false              *
 * @return {null}                                                                          *
 *******************************************************************************************/
function confirmEmail(link, callback) {
	mongo.update('users', {'token.email': link}, {$set: {'token.email': null}}, callback);
}

/**************************************************************************
 * Sends the password reset email                                         *
 * @method sendReset                                                      *
 * @param  {String}   usernameEmail Username or email address of the user *
 * @param  {Function} callback      Called when the email is sent         *
 **************************************************************************/
function sendReset(usernameEmail, callback) {
	var token = hash.saltGen(16);
	mongo.update('users', {$or: [{username: usernameEmail}, {email: usernameEmail}]}, {$set: {'token.reset': token}}, function(result) {
		if (result) {
			mongo.find('users', {$or: [{username: usernameEmail}, {email: usernameEmail}]}, function(findRes) {
				console.log(findRes);
				email.sendReset(findRes[0].email, findRes[0].username, `http://localhost:8080/reset/${token}`, callback);
			});
		} else {
			callback(false);
		}
	});
}

/*************************************************************************************
 * Confirms the password reset request                                               *
 * @method confirmReset                                                              *
 * @param  {String}     link     Link sent in the email to reset the user's password *
 * @param  {Function}   callback called when the database returns                    *
 *************************************************************************************/
function confirmReset(link, password, callback) {
	mongo.update('users', {'token.reset': link}, {$set: {'token.reset': null, password: hash.createHash(password)}}, callback);
}