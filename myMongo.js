module.exports = {
	insertOne: insertOne,
	find: find,
	findSort: findSort,
	insertUser: insertUser
};

var mongo = require('mongodb');
var assert = require('assert');
var util = require('util');
var email = require('./email');
var url = 'mongodb://localhost:27017/matcha';

/*****************************************************************************************
 * Inserts one item into the database                                                    *
 * @method insertOne                                                                     *
 * @param  {string}   collection    Name of the collection (table) to use                *
 * @param  {array}    data		    Array of information to insert into the database     *
 * @param  {Function} callback      Called when database returns                         *
 * @return {null}                                                                        *
 *****************************************************************************************/
function insertOne(collection, data, callback) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		db.collection(collection).insertOne(data, function(err, result) {
			assert.equal(null, err);
			db.close();
			callback( (result.insertedCount === 1) ? result.insertedId : null );
		});
	});
}

/*******************************************************************************
 * Finds a value in the specified collection with the values in data parameter *
 * @method	find                                                               *
 * @param	{String}	collection	Name of the collection (table) to use      *
 * @param	{Object}		data	Array of parameters to match               *
 * @param	{Function}	callback	Called when the database returns           *
 * @return	{null}                                                             *
 *******************************************************************************/
function find(collection, data, callback) {
	var result = [];
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		var cursor = db.collection(collection).find(data);
		cursor.forEach(function(doc, err) {
			assert.equal(null, err);
			result.push(doc);
		}, function() {
			db.close();
			callback(result);
		});
	});
}

/*********************************************************************************************
 * Finds and sorts results from the database with the values in the find and sort parameters *
 * @method  findSort                                                                         *
 * @param   {string}    collection  Name of the collection (table) to use                    *
 * @param   {Object}    find        Array of parameters to match                             *
 * @param   {Object}    sort        Array of parameters to sort by                           *
 * @param   {Function}  callback    Called when the database returns                         *
 * @return  {null}                                                                           *
 *********************************************************************************************/
function findSort(collection, find, sort, callback) {
	var result = [];
	mongo.connect(url, function(err, db) {
		assert.equal(null, err);
		var cursor = db.collection(collection).find(find).sort(sort);
		cursor.forEach(function(doc, err) {
			assert.equal(null, err);
			result.push(doc);
		}, function() {
			db.close();
			callback(result);
		});
	});
}

/****************************************************************************************************************
 * Makes sure the user to insert does not exist (username and email address) then adds the user to the database *
 * @method  insertUser                                                                                          *
 * @param   {Object}    data        Array of user information to insert into the database                       *
 * @param   {Function}  callback    Called when the database returns                                            *
 * @return  {Object}                ok: {True | False} if insert fails, id: {String}, err: {String}             *
 ****************************************************************************************************************/
function insertUser(data, callback) {
	find('users', {$or: [{username: data.username}, {email: data.email}]}, function(result) {
		if (Object.keys(result).length === 0) {
			insertOne('users', data, function(id) {
				if (id !== null) {
					callback({
						ok: true,
						id: id,
						err: null});
				} else {
					callback({
						ok: false,
						id: null,
						err: 'user not inserted'});
				}
			});
		} else {
			callback({
				ok: false,
				id: null,
				err: 'username or email exists'});
		}
	});
}