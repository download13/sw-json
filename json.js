function json(body, code) {
	code = code || 200;

	var isString = typeof body === 'string';
	var isBuffer = body instanceof Buffer;

	if(!isString && !isBuffer) {
		if(body === undefined) {
			body = null;
		}

		body = JSON.stringify(body);
	}

	var length = isBuffer ? body.length : Buffer.byteLength(body);

	this.writeHead(code, {'Content-Type': 'application/json', 'Content-Length': length});
	this.end(body);
}


module.exports = function(req, res, next) {
	res.json = json;

	next();
};
