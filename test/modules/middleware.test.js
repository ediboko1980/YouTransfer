
// ------------------------------------------------------------------------------------------ Test Dependencies

var sinon = require('sinon');
var should = require('chai').should();
var middleware = require('../../lib/middleware');

// ------------------------------------------------------------------------------------------ Mock Dependencies

var youtransfer = require('../../lib/youtransfer');
var nunjucks = require('nunjucks');
var nconf = require('nconf');
nconf.argv()
	 .env();
nconf.set('basedir', __dirname);

// ------------------------------------------------------------------------------------------ Test Definition

describe('YouTransfer Middleware module', function() {
	var sandbox;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function() {
		sandbox.restore();
	})

	// -------------------------------------------------------------------------------------- Testing res.redirect

	it('should implement "res.redirect" method', function(done) {
		var location = 'http://github.com/remie/YouTransfer';

		var req = {
			headers: []
		}
		var res = {
			header: function() {},
			send: function() {},
		};

		//Adding stub to avoid test execution getting blocked by Nunjucks fs watch
		sandbox.stub(nunjucks, 'configure').returns(null);

		var resMock = sandbox.mock(res);
		resMock.expects("header").once().withArgs('Location', location);
		resMock.expects("send").once().withArgs(302);

		middleware(req, res, function() {
			should.exist(res.redirect);
			res.redirect(location);
			resMock.verify();
			done();
		});
	});
	
	// -------------------------------------------------------------------------------------- Testing req.isXmlHttpRequest

	it('should add "isXmlHttpRequest" property to response object with value "true"', function(done) {
		var res = {},
			req = {
				headers: {
					'x-requested-with': 'XMLHttpRequest'
				}
			}

		//Adding stub to avoid test execution getting blocked by Nunjucks fs watch
		sandbox.stub(nunjucks, 'configure').returns(null);

		middleware(req, res, function() {
			should.exist(req.isXmlHtppRequest);
			req.isXmlHtppRequest.should.equals(true);
			done();
		});
	});

	it('should add "isXmlHttpRequest" property to response object with value "false"', function(done) {
		var res = {},
			req = {
				headers: {
					'x-requested-with': ''
				}
			}

		//Adding stub to avoid test execution getting blocked by Nunjucks fs watch
		sandbox.stub(nunjucks, 'configure').returns(null);

		middleware(req, res, function() {
			should.exist(req.isXmlHtppRequest);
			req.isXmlHtppRequest.should.equals(false);
			done();
		});
	});	

	// -------------------------------------------------------------------------------------- Testing res.renderTemplate	

	it('should implement "res.renderTemplate" method', function(done) {
		var name = 'MyTemplate',
			settings = {},
			res = {},
			req = {
				params: {},
				headers: []
			},
			context = {
				isXmlHtppRequest: false
			};

		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		//Adding stub to avoid test execution getting blocked by Nunjucks fs watch
		sandbox.stub(nunjucks, 'configure').returns(null);

		sandbox.stub(nunjucks, 'render', function (template, variables, callback) {
			template.should.equals(name);
			variables.isXmlHtppRequest.should.equals(context.isXmlHtppRequest);
			callback();
		});

		middleware(req, res, function() {
			should.exist(res.renderTemplate);
			res.renderTemplate(name, settings, function() {
				done();
			});
		});
	});	

	it('should implement "res.renderTemplate" method with valid host', function(done) {
		var name = 'MyTemplate',
			settings = {
				baseUrl: 'http://myhost'
			},
			res = {},
			req = {
				params: {},
				headers: {
					host: 'myhost'
				},
				socket: {}
			},
			context = {
				baseUrl: 'http://myhost',
				host: 'http://myhost',
				invalidHost: false,
				isXmlHtppRequest: false
			};


		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		//Adding stub to avoid test execution getting blocked by Nunjucks fs watch
		sandbox.stub(nunjucks, 'configure').returns(null);

		sandbox.stub(nunjucks, 'render', function (template, variables, callback) {
			template.should.equals(name);
			variables.baseUrl.should.equals(context.baseUrl);
			variables.host.should.equals(context.host);
			variables.invalidHost.should.equals(context.invalidHost);
			variables.isXmlHtppRequest.should.equals(context.isXmlHtppRequest);
			callback();
		});

		middleware(req, res, function() {
			should.exist(res.renderTemplate);
			res.renderTemplate(name, settings, function() {
				done();
			});
		});
	});	

	it('should implement "res.renderTemplate" method with invalid host', function(done) {
		var name = 'MyTemplate',
			settings = {
				baseUrl: 'http://myhost'
			},
			res = {},
			req = {
				params: {},
				headers: {
					host: 'anotherhost'
				},
				socket: {}
			},
			context = {
				baseUrl: 'http://myhost',
				host: 'http://anotherhost',
				invalidHost: true,				
				isXmlHtppRequest: false
			};


		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		//Adding stub to avoid test execution getting blocked by Nunjucks fs watch
		sandbox.stub(nunjucks, 'configure').returns(null);

		sandbox.stub(nunjucks, 'render', function (template, variables, callback) {
			template.should.equals(name);
			variables.baseUrl.should.equals(context.baseUrl);
			variables.host.should.equals(context.host);
			variables.invalidHost.should.equals(context.invalidHost);
			variables.isXmlHtppRequest.should.equals(context.isXmlHtppRequest);
			callback();
		});

		middleware(req, res, function() {
			should.exist(res.renderTemplate);
			res.renderTemplate(name, settings, function() {
				done();
			});
		});
	});	

	it('should implement "res.renderTemplate" method with invalid host using SSL', function(done) {
		var name = 'MyTemplate',
			settings = {
				baseUrl: 'https://myhost'
			},
			res = {},
			req = {
				params: {},
				headers: {
					host: 'anotherhost'
				},
				socket: {
					encrypted: true
				}
			},
			context = {
				baseUrl: 'https://myhost',
				host: 'https://anotherhost',
				invalidHost: true,				
				isXmlHtppRequest: false
			};


		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		//Adding stub to avoid test execution getting blocked by Nunjucks fs watch
		sandbox.stub(nunjucks, 'configure').returns(null);

		sandbox.stub(nunjucks, 'render', function (template, variables, callback) {
			template.should.equals(name);
			variables.baseUrl.should.equals(context.baseUrl);
			variables.host.should.equals(context.host);
			variables.invalidHost.should.equals(context.invalidHost);
			variables.isXmlHtppRequest.should.equals(context.isXmlHtppRequest);
			callback();
		});

		middleware(req, res, function() {
			should.exist(res.renderTemplate);
			res.renderTemplate(name, settings, function() {
				done();
			});
		});
	});	

	it('should implement "res.renderTemplate" method which does not throw an error if settings are not available', function(done) {
		var name = 'MyTemplate',
			settings = {},
			res = {},
			req = {
				params: {},
				headers: []
			},
			context = {
				isXmlHtppRequest: false
			};

		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback('error', null);
		});

		//Adding stub to avoid test execution getting blocked by Nunjucks fs watch
		sandbox.stub(nunjucks, 'configure').returns(null);

		sandbox.stub(nunjucks, 'render', function (template, variables, callback) {
			template.should.equals(name);
			variables.isXmlHtppRequest.should.equals(context.isXmlHtppRequest);
			callback();
		});

		middleware(req, res, function() {
			should.exist(res.renderTemplate);
			res.renderTemplate(name, settings, function() {
				done();
			});
		});
	});

	// -------------------------------------------------------------------------------------- Testing res.render

	it('should implement "res.render" method', function(done) {
		var name = 'MyTemplate',
			template = {
				path: __dirname + '/views/pages/MyTemplate.html',
				content: 'this is my template'
			},
			settings = {},
			res = {
				setHeader: function() {},
				writeHead: function() {},
				end: function() {}
			},
			req = {
				headers: []
			},
			viewEngine = {
				getTemplate: function() {}
			}

		var resMock = sandbox.mock(res);
		resMock.expects("setHeader").once().withArgs('Server', 'youtransfer.io');
		resMock.expects("setHeader").once().withArgs('Content-type', 'text/html');
		resMock.expects("writeHead").once().withArgs(200);

		var viewEngineMock = sandbox.mock(viewEngine);
		viewEngineMock.expects("getTemplate").once().withArgs(name).returns(template);

		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		sandbox.stub(nunjucks, 'configure', function (files, options) {
			return viewEngine;
		});

		sandbox.stub(nunjucks, 'render', function (name, context, callback) {
			return template.content;
		});

		sandbox.stub(res, 'end', function (content) {
			should.exist(content);
			content.should.equals(template.content);
		});

		middleware(req, res, function() {
			should.exist(res.render);
			res.render(name, settings, null);

			resMock.verify();
			viewEngineMock.verify();
			done();
		});
	});

	it('should implement "res.render" method with valid host', function(done) {
		var name = 'MyTemplate',
			template = {
				path: __dirname + '/views/pages/MyTemplate.html',
				content: 'this is my template'
			},
			settings = {
				baseUrl: 'http://myhost'
			},
			res = {
				setHeader: function() {},
				writeHead: function() {},
				end: function() {}
			},
			req = {
				params: {},
				headers: {
					host: 'myhost'
				},
				socket: {}
			},
			viewEngine = {
				getTemplate: function() {}
			}

		var resMock = sandbox.mock(res);
		resMock.expects("setHeader").once().withArgs('Server', 'youtransfer.io');
		resMock.expects("setHeader").once().withArgs('Content-type', 'text/html');
		resMock.expects("writeHead").once().withArgs(200);

		var viewEngineMock = sandbox.mock(viewEngine);
		viewEngineMock.expects("getTemplate").once().withArgs(name).returns(template);

		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		sandbox.stub(nunjucks, 'configure', function (files, options) {
			return viewEngine;
		});

		sandbox.stub(nunjucks, 'render', function (name, context, callback) {
			context.invalidHost.should.equals(false);
			context.baseUrl.should.equals(settings.baseUrl);
			context.host.should.equals(settings.baseUrl);
			context.isXmlHtppRequest.should.equals(false);
			return template.content;
		});

		sandbox.stub(res, 'end', function (content) {
			should.exist(content);
			content.should.equals(template.content);
		});

		middleware(req, res, function() {
			should.exist(res.render);
			res.render(name, settings, null);

			resMock.verify();
			viewEngineMock.verify();
			done();
		});
	});

	it('should implement "res.render" method with valid host using SSL', function(done) {
		var name = 'MyTemplate',
			template = {
				path: __dirname + '/views/pages/MyTemplate.html',
				content: 'this is my template'
			},
			settings = {
				baseUrl: 'https://myhost'
			},
			res = {
				setHeader: function() {},
				writeHead: function() {},
				end: function() {}
			},
			req = {
				params: {},
				headers: {
					host: 'myhost'
				},
				socket: {
					encrypted: true
				}
			},
			viewEngine = {
				getTemplate: function() {}
			}

		var resMock = sandbox.mock(res);
		resMock.expects("setHeader").once().withArgs('Server', 'youtransfer.io');
		resMock.expects("setHeader").once().withArgs('Content-type', 'text/html');
		resMock.expects("writeHead").once().withArgs(200);

		var viewEngineMock = sandbox.mock(viewEngine);
		viewEngineMock.expects("getTemplate").once().withArgs(name).returns(template);

		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		sandbox.stub(nunjucks, 'configure', function (files, options) {
			return viewEngine;
		});

		sandbox.stub(nunjucks, 'render', function (name, context, callback) {
			context.invalidHost.should.equals(false);
			context.baseUrl.should.equals(settings.baseUrl);
			context.host.should.equals(settings.baseUrl);
			context.isXmlHtppRequest.should.equals(false);
			return template.content;
		});

		sandbox.stub(res, 'end', function (content) {
			should.exist(content);
			content.should.equals(template.content);
		});

		middleware(req, res, function() {
			should.exist(res.render);
			res.render(name, settings, null);

			resMock.verify();
			viewEngineMock.verify();
			done();
		});
	});

	it('should implement "res.render" method with invalid host', function(done) {
		var name = 'MyTemplate',
			template = {
				path: __dirname + '/views/pages/MyTemplate.html',
				content: 'this is my template'
			},
			settings = {
				baseUrl: 'http://myhost'
			},
			res = {
				setHeader: function() {},
				writeHead: function() {},
				end: function() {}
			},
			req = {
				params: {},
				headers: {
					host: 'anotherhost'
				},
				socket: {}
			},
			viewEngine = {
				getTemplate: function() {}
			}

		var resMock = sandbox.mock(res);
		resMock.expects("setHeader").once().withArgs('Server', 'youtransfer.io');
		resMock.expects("setHeader").once().withArgs('Content-type', 'text/html');
		resMock.expects("writeHead").once().withArgs(200);

		var viewEngineMock = sandbox.mock(viewEngine);
		viewEngineMock.expects("getTemplate").once().withArgs(name).returns(template);

		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		sandbox.stub(nunjucks, 'configure', function (files, options) {
			return viewEngine;
		});

		sandbox.stub(nunjucks, 'render', function (name, context, callback) {
			context.invalidHost.should.equals(true);
			context.baseUrl.should.equals(settings.baseUrl);
			context.host.should.equals('http://anotherhost');
			context.isXmlHtppRequest.should.equals(false);
			return template.content;
		});

		sandbox.stub(res, 'end', function (content) {
			should.exist(content);
			content.should.equals(template.content);
		});

		middleware(req, res, function() {
			should.exist(res.render);
			res.render(name, settings, null);

			resMock.verify();
			viewEngineMock.verify();
			done();
		});
	});

	it('should implement "res.render" method which does not break when settings retrieval fails', function(done) {
		var name = 'MyTemplate',
			template = {
				path: __dirname + '/views/pages/MyTemplate.html',
				content: 'this is my template'
			},
			settings = {},
			res = {
				setHeader: function() {},
				writeHead: function() {},
				end: function() {}
			},
			req = {
				headers: [],
				params: {}
			},
			viewEngine = {
				getTemplate: function() {}
			}

		var resMock = sandbox.mock(res);
		resMock.expects("setHeader").once().withArgs('Server', 'youtransfer.io');
		resMock.expects("setHeader").once().withArgs('Content-type', 'text/html');
		resMock.expects("writeHead").once().withArgs(200);

		var viewEngineMock = sandbox.mock(viewEngine);
		viewEngineMock.expects("getTemplate").once().withArgs(name).returns(template);

		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback('this is an error', {});
		});

		sandbox.stub(nunjucks, 'configure', function (files, options) {
			return viewEngine;
		});

		sandbox.stub(nunjucks, 'render', function (name, context, callback) {
			return template.content;
		});

		sandbox.stub(res, 'end', function (content) {
			should.exist(content);
			content.should.equals(template.content);
		});

		middleware(req, res, function() {
			should.exist(res.render);
			res.render(name, settings, null);

			resMock.verify();
			viewEngineMock.verify();
			done();
		});
	});

	it('should implement "res.render" method and return a meaningful 404 if template is not found but error page exists', function(done) {
		var name = 'MyTemplate',
			template = {
				path: __dirname + '/views/partial/MyTemplate.html',
				content: 'this is a 404 page'
			},
			settings = {},
			res = {
				setHeader: function() {},
				writeHead: function() {},
				end: function() {}
			},
			req = {
				headers: []
			},
			viewEngine = {
				getTemplate: function() {}
			}

		var resMock = sandbox.mock(res);
		resMock.expects("setHeader").once().withArgs('Server', 'youtransfer.io');
		resMock.expects("setHeader").once().withArgs('Content-type', 'text/html');
		resMock.expects("writeHead").once().withArgs(404);

		var viewEngineMock = sandbox.mock(viewEngine);
		viewEngineMock.expects("getTemplate").once().withArgs(name).returns(template);

		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		sandbox.stub(nunjucks, 'configure', function (files, options) {
			return viewEngine;
		});

		sandbox.stub(nunjucks, 'render', function (templateName, context, callback) {
			return template.content;
		});

		sandbox.stub(res, 'end', function (content) {
			should.exist(content);
			content.should.equals(template.content);
		});

		middleware(req, res, function() {
			should.exist(res.render);
			res.render(name, settings, null);

			resMock.verify();
			viewEngineMock.verify();
			done();
		});
	});

	it('should implement "res.render" method and return a meaningless 404 if template is not found and error page does not exist', function(done) {
		var name = 'MyTemplate',
			template = {
				path: __dirname + '/views/partial/MyTemplate.html',
				content: 'Resource not found'
			},
			settings = {},
			res = {
				setHeader: function() {},
				writeHead: function() {},
				end: function() {}
			},
			req = {
				headers: []
			},
			viewEngine = {
				getTemplate: function() {}
			}

		var resMock = sandbox.mock(res);
		resMock.expects("setHeader").once().withArgs('Server', 'youtransfer.io');
		resMock.expects("writeHead").once().withArgs(404);

		var viewEngineMock = sandbox.mock(viewEngine);
		viewEngineMock.expects("getTemplate").once().withArgs(name).returns(template);

		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		sandbox.stub(nunjucks, 'configure', function (files, options) {
			return viewEngine;
		});

		sandbox.stub(nunjucks, 'render').throws('some random error');

		sandbox.stub(res, 'end', function (content) {
			should.exist(content);
			content.should.equals(template.content);
		});

		middleware(req, res, function() {
			should.exist(res.render);
			res.render(name, settings, null);

			resMock.verify();
			viewEngineMock.verify();
			done();
		});
	});

	it('should implement "res.render" method and return a 500 error message if things go south', function(done) {
		var name = 'MyTemplate',
			template = {
				path: __dirname + '/views/partial/MyTemplate.html',
				content: 'Resource not found',
				err: new Error('some random error')
			},
			settings = {},
			res = {
				setHeader: function() {},
				writeHead: function() {},
				end: function() {}
			},
			req = {
				headers: []
			},
			viewEngine = {
				getTemplate: function() {}
			}

		var resMock = sandbox.mock(res);
		resMock.expects("setHeader").once().withArgs('Server', 'youtransfer.io');
		resMock.expects("writeHead").once().withArgs(500);

		var viewEngineMock = sandbox.mock(viewEngine);
		viewEngineMock.expects("getTemplate").once().withArgs(name).throws(template.err)

		sandbox.stub(youtransfer.settings, 'get', function (callback) {
			callback(null, settings);
		});

		sandbox.stub(nunjucks, 'configure', function (files, options) {
			return viewEngine;
		});

		sandbox.stub(res, 'end', function (content) {
			should.exist(content);
			content.should.equals(template.err.message);
		});

		middleware(req, res, function() {
			should.exist(res.render);
			res.render(name, settings, null);

			resMock.verify();
			viewEngineMock.verify();
			done();
		});
	});

});
