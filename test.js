var compose = require('mw-compose');

var createRouter = require('http-router-fn');

var request = require('supertest');

var assert = require('assert');

var mw = require('./json');


describe('Middleware', function() {
	it('takes a request, response, and next function', function(done) {
		mw({}, {}, done);
	});

	it('adds a json function to res', function() {
		var res = {};
		mw({}, res, function() {});
		assert.equal(typeof res.json, 'function');
	});
});

describe('res.json()', function() {
	var app, stack;

	beforeEach(function() {
		app = createRouter();
		stack = compose(mw, app);
	});

	it('defaults to sending a 200 status', function(done) {
		app.get('/', function(req, res) {
			res.json(0);
		});

		request(stack).get('/').expect(200, '0', done);
	});

	it('defaults to application/json content type', function(done) {
		app.get('/', function(req, res) {
			res.json(0);
		});

		request(stack).get('/').expect('Content-Type', 'application/json', done);
	});

	describe('%body_argument', function() {
		it('takes a body as the first argument', function(done) {
			app.get('/', function(req, res) {
				res.json('"test"');
			});

			request(stack).get('/').expect('"test"', done);
		});

		it('can take a buffer body', function(done) {
			app.get('/', function(req, res) {
				res.json(new Buffer('"test2"'));
			});

			request(stack).get('/').expect('"test2"', done);
		});

		it('can take a number body', function(done) {
			app.get('/', function(req, res) {
				res.json(2.001);
			});

			request(stack).get('/').expect('2.001', done);
		});

		it('can take an array body', function(done) {
			app.get('/', function(req, res) {
				res.json([3, 5, 7]);
			});

			request(stack).get('/').expect(JSON.stringify([3, 5, 7]), done);
		});

		it('can take an object body', function(done) {
			app.get('/', function(req, res) {
				res.json({t: 3});
			});

			request(stack).get('/').expect(JSON.stringify({t: 3}), done);
		});

		it('can take an undefined body', function(done) {
			app.get('/', function(req, res) {
				res.json();
			});

			request(stack).get('/').expect('null', done);
		});
	});

	describe('%options_argument', function() {
		it('can change the status code', function(done) {
			app.get('/', function(req, res) {
				res.json(9, 201);
			});

			request(stack).get('/').expect(201, '9', done);
		});

		it('correctly sets a content length header', function(done) {
			app.get('/', function(req, res) {
				res.json('"testdata"');
			});

			request(stack).get('/')
				.expect('Content-Length', 10)
				.expect(200, '"testdata"', done);
		});
	});
});
