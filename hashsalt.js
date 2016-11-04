module.exports = {
    createHash: createHash,
    checkHash: checkHash,
	saltGen: saltGen
};

var crypto = require('crypto');

/************************************************************
 * Generates a random string in base 16                     *
 * @method saltGen                                          *
 * @param  {Int}    length Number of characters to generate *
 * @return {String}        Random string                    *
 ************************************************************/
function saltGen(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length); /** return required number of characters */
}

/**
 * Generates a sha512 hash
 * @method sha512
 * @param  {String} password String to hash
 * @param  {String} salt     Salt string to hash with password to make hash unique
 * @return {Object}          {salt: {String}, hash: {String}}
 */
function sha512(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        hash: value
    };
}

/**
 * Creates a hash of a password using sha512
 * @method createHash
 * @param  {String}   password Password string to generate hash of
 * @return {Object}            {salt: {String}, hash: {String}}
 */
function createHash(password) {
    return sha512(password, saltGen(16));
}

/**
 * Uses the hashSalt object to hash the password string
 * @method checkHash
 * @param  {Object}   hashSalt Object originally from the createHash function
 * @param  {String}   password Password to check
 * @return {Boolean}           true if password is correct
 */
function checkHash(hashSalt, password) {
    return (sha512(password, hashSalt.salt).hash === hashSalt.hash) ? true : false;
}