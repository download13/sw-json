# sw-json

Convenience middleware for sending JSON. Adds a `.json()` method to the `res` object which responds with a JSON body.

## Install

`npm install sw-json`

## Example

```javascript
var json = require('sw-json');

// With express
app.use(json);

var NOTFOUND = JSON.stringify({error: 'NOT_FOUND'});
// or use as inline middleware
app.get('/example/page', json, function(req, res) {
	if(req.query.n) {
		res.json(NOTFOUND, 404);  // Send a pre-serialized string
	} else {
		res.json({data: 'stuff'}); // or a JS object
	}
});
```

## API

`res.json(body, [code])`

* body - JavaScript object or JSON formatted string
* code - Status code, optional, defaults to 200
