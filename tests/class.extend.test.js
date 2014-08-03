var Class = require('../index'),

	sinon = require('sinon'),
	chai = require('chai'),
	expect = chai.expect;

describe("Class", function () {

	describe("#extend", function () {
		var Example,
			constructor,
			method;

		beforeEach(function () {
			constructor = sinon.spy();
			method = sinon.spy();

			Example = Class.extend({
				statics: {bla: 1},
				includes: {mixin: true},

				initialize: constructor,
				foo: 5,
				bar: method
			});
		});

		it("creates a class with the given constructor & properties", function () {
			var a = new Example();

			expect(constructor.called).to.be.ok;
			expect(a.foo).to.eql(5);

			a.bar();

			expect(method.called).to.be.ok;
		});

		it("inherits parent classes' constructor & properties", function () {
			var Example2 = Example.extend({baz: 2});

			var b = new Example2();

			expect(b instanceof Example).to.be.ok;
			expect(b instanceof Example2).to.be.ok;

			expect(constructor.called).to.be.ok;
			expect(b.baz).to.eql(2);

			b.bar();

			expect(method.called).to.be.ok;
		});

		it("supports static properties", function () {
			expect(Example.bla).to.eql(1);
		});

		it("inherits parent static properties", function () {
			var Example2 = Example.extend({});

			expect(Example2.bla).to.eql(1);
		});

		it("overrides parent static properties", function () {
			var Example2 = Example.extend({statics: {bla: 2}});

			expect(Example2.bla).to.eql(2);
		});

		it("includes the given mixin", function () {
			var a = new Example();
			expect(a.mixin).to.be.ok;
		});

		it("includes multiple mixins", function () {
			var Example2 = Class.extend({
				includes: [{mixin: true}, {mixin2: true}]
			});
			var a = new Example2();

			expect(a.mixin).to.be.ok;
			expect(a.mixin2).to.be.ok;
		});

		it("grants the ability to include the given mixin", function () {
			Example.include({mixin2: true});

			var a = new Example();
			expect(a.mixin2).to.be.ok;
		});

		it("merges options instead of replacing them", function () {
			var ExampleWithOptions1 = Class.extend({
				options: {
					foo1: 1,
					foo2: 2
				}
			});
			var ExampleWithOptions2 = ExampleWithOptions1.extend({
				options: {
					foo2: 3,
					foo3: 4
				}
			});

			var a = new ExampleWithOptions2();
			expect(a.options.foo1).to.eql(1);
			expect(a.options.foo2).to.eql(3);
			expect(a.options.foo3).to.eql(4);
		});

		it("gives new classes a distinct options object", function () {
			var K1 = Class.extend({options: {}});
			var K2 = K1.extend({});
			expect(K2.prototype.options).not.to.equal(K1.prototype.options);
		});

		it("inherits options prototypally", function () {
			var K1 = Class.extend({options: {}});
			var K2 = K1.extend({options: {}});
			K1.prototype.options.foo = 'bar';
			expect(K2.prototype.options.foo).to.eql('bar');
		});

		it("adds constructor hooks correctly", function () {
			var spy1 = sinon.spy();

			Example.addInitHook(spy1);
			Example.addInitHook('bar', 1, 2, 3);

			var a = new Example();

			expect(spy1.called).to.be.ok;
			expect(method.calledWith(1, 2, 3));
		});

		it("inherits constructor hooks", function () {
			var spy1 = sinon.spy(),
				spy2 = sinon.spy();

			var Example2 = Example.extend({});

			Example.addInitHook(spy1);
			Example2.addInitHook(spy2);

			var a = new Example2();

			expect(spy1.called).to.be.ok;
			expect(spy2.called).to.be.ok;
		});

		it("does not call child constructor hooks", function () {
			var spy1 = sinon.spy(),
				spy2 = sinon.spy();

			var Example2 = Example.extend({});

			Example.addInitHook(spy1);
			Example2.addInitHook(spy2);

			var a = new Example();

			expect(spy1.called).to.be.ok;
			expect(spy2.called).to.eql(false);
		});
	});

});