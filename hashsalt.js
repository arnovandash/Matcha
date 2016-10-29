module.exports = {
    createHash: createHash,
    checkHash: checkHash
};

var crypto = require('crypto');

function saltGen(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length); /** return required number of characters */
}

function sha512(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        hash: value
    };
}

function createHash(password) {
    return sha512(password, saltGen(16));
}

function checkHash(hashSalt, password) {
    return (sha512(password, hashSalt.salt).hash == hashSalt.hash) ? true : false;
}