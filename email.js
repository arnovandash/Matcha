module.exports = {
	send: sendEmail,
	sendConfirm: sendConfirmEmail,
	sendReset: sendResetEmail
};

var sendmail = require('sendmail')({
//	logger: {
//		debug:	console.log,
//		info:	console.info,
//		warn:	console.warn,
//		error:	console.error
//	},
	silent: true
});

/************************************************************************************************
 * Sends an email from 'No-reply' to the 'to' email address with subject and email body in html *
 * @param   {Srting}    to          Email address of the recipiant                              *
 * @param   {String}    subject     Subject of the email                                        *
 * @param   {String}    html        Body of teh email in html                                   *
 * @param   {Function}  callback    Callback function, called when the email has been sent      *
 * @return  {Null}                                                                              *
 ************************************************************************************************/
function sendEmail(to, subject, html, callback) {
	sendmail({
		from: 'No-reply <no-reply@donotreply.com',
		to: to,
		subject: subject,
		html: html
	}, function(err, reply) {
		if (callback !== undefined) {
			callback((reply.trim() === '221 Bye'));
		}
	});
}

/****************************************************************************************
 * Sends an email to the user to confirm their email address                            *
 * @param   {String}    emailTo     email address of the recipiant                      *
 * @param   {String}    username    username of the recipiant                           *
 * @param   {String}    href        link they need to click on to activate the account  *
 * @param   {Function}  callback    function to call when the email is sent             *
 * @return  {Null}                                                                      *
 ****************************************************************************************/
function sendConfirmEmail(emailTo, username, href, callback) {
	var send = `<body>
			<h2>Welcome to Matcha!</h2>
			<h4>Please click the link below to confirm your email address and activate your account</h4>
			<a href="${href}">Activate</a>
		</body>`;
	sendEmail(emailTo, 'Please confirm your email address for Matcha', send, callback);
}

/***********************************************************************************
 * Sends an email to the user to reset their password                              *
 * @method sendResetEmail                                                          *
 * @param  {String}       emailTo  email address of the recipiant                  *
 * @param  {String}       username username of the recipiant                       *
 * @param  {String}       href     link they need to click to reset their password *
 * @param  {Function}     callback function to call when the email is sent         *
 ***********************************************************************************/
function sendResetEmail(emailTo, username, href, callback) {
	var send = `<body>
			<h2>Matcha password reset</h2>
			<h4>Please click the link below to reset the password on your account</h4>
			<a href="${href}">Reset</a>
		</body>`;
	sendEmail(emailTo, 'Matcha password reset', send, callback);
}