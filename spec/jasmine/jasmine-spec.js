/** @babel */

// jasmine 2.7 tests https://jasmine.github.io/2.7/introduction.html

describe("Jasmine 2.x", function () {
	beforeEach(function () {
		if (jasmine.useRealClock) {
			jasmine.useRealClock();
		}
	});

	describe("A suite", function () {
		it("contains spec with an expectation", function () {
			expect(true).toBe(true);
		});
	});

	describe("A suite is just a function", function () {
		let a;

		it("and so is a spec", function () {
			a = true;

			expect(a).toBe(true);
		});
	});

	describe("The 'toBe' matcher compares with ===", function () {

		it("and has a positive case", function () {
			expect(true).toBe(true);
		});

		it("and can have a negative case", function () {
			expect(false).not.toBe(true);
		});
	});

	describe("Included matchers:", function () {

		it("The 'toBe' matcher compares with ===", function () {
			const a = 12;
			const b = a;

			expect(a).toBe(b);
			expect(a).not.toBe(null);
		});

		describe("The 'toEqual' matcher", function () {

			it("works for simple literals and constiables", function () {
				const a = 12;
				expect(a).toEqual(12);
			});

			it("should work for objects", function () {
				const foo = {
					a: 12,
					b: 34
				};
				const bar = {
					a: 12,
					b: 34
				};
				expect(foo).toEqual(bar);
			});
		});

		it("The 'toMatch' matcher is for regular expressions", function () {
			const message = "foo bar baz";

			expect(message).toMatch(/bar/);
			expect(message).toMatch("bar");
			expect(message).not.toMatch(/quux/);
		});

		it("The 'toBeDefined' matcher compares against `undefined`", function () {
			const a = {
				foo: "foo"
			};

			expect(a.foo).toBeDefined();
			expect(a.bar).not.toBeDefined();
		});

		it("The `toBeUndefined` matcher compares against `undefined`", function () {
			const a = {
				foo: "foo"
			};

			expect(a.foo).not.toBeUndefined();
			expect(a.bar).toBeUndefined();
		});

		it("The 'toBeNull' matcher compares against null", function () {
			const a = null;
			const foo = "foo";

			expect(null).toBeNull();
			expect(a).toBeNull();
			expect(foo).not.toBeNull();
		});

		it("The 'toBeTruthy' matcher is for boolean casting testing", function () {
			const a = null;
			const foo = "foo";

			expect(foo).toBeTruthy();
			expect(a).not.toBeTruthy();
		});

		it("The 'toBeFalsy' matcher is for boolean casting testing", function () {
			const a = null;
			const foo = "foo";

			expect(a).toBeFalsy();
			expect(foo).not.toBeFalsy();
		});

		describe("The 'toContain' matcher", function () {
			it("works for finding an item in an Array", function () {
				const a = ["foo", "bar", "baz"];

				expect(a).toContain("bar");
				expect(a).not.toContain("quux");
			});

			it("also works for finding a substring", function () {
				const a = "foo bar baz";

				expect(a).toContain("bar");
				expect(a).not.toContain("quux");
			});
		});

		it("The 'toBeLessThan' matcher is for mathematical comparisons", function () {
			const pi = 3.1415926,
				e = 2.78;

			expect(e).toBeLessThan(pi);
			expect(pi).not.toBeLessThan(e);
		});

		it("The 'toBeGreaterThan' matcher is for mathematical comparisons", function () {
			const pi = 3.1415926,
				e = 2.78;

			expect(pi).toBeGreaterThan(e);
			expect(e).not.toBeGreaterThan(pi);
		});

		it("The 'toBeCloseTo' matcher is for precision math comparison", function () {
			const pi = 3.1415926,
				e = 2.78;

			expect(pi).not.toBeCloseTo(e, 2);
			expect(pi).toBeCloseTo(e, 0);
		});

		it("The 'toThrow' matcher is for testing if a function throws an exception", function () {
			const foo = function () {
				return 1 + 2;
			};
			const bar = function () {
				// eslint-disable-next-line no-undef
				return a + 1;
			};
			const baz = function () {
				throw "what";
			};

			expect(foo).not.toThrow();
			expect(bar).toThrow();
			expect(baz).toThrow("what");
		});

		it("The 'toThrowError' matcher is for testing a specific thrown exception", function () {
			const foo = function () {
				throw new TypeError("foo bar baz");
			};

			expect(foo).toThrowError("foo bar baz");
			expect(foo).toThrowError(/bar/);
			expect(foo).toThrowError(TypeError);
			expect(foo).toThrowError(TypeError, "foo bar baz");
		});
	});

	describe("A spec using the fail function", function () {
		const foo = function (x, callBack) {
			if (x) {
				callBack();
			}
		};

		it("should not call the callBack", function () {
			foo(false, function () {
				fail("Callback has been called");
			});
		});
	});

	describe("A spec", function () {
		it("is just a function, so it can contain any code", function () {
			let foo = 0;
			foo += 1;

			expect(foo).toEqual(1);
		});

		it("can have more than one expectation", function () {
			let foo = 0;
			foo += 1;

			expect(foo).toEqual(1);
			expect(true).toEqual(true);
		});
	});

	describe("A spec using beforeEach and afterEach", function () {
		let foo = 0;

		beforeEach(function () {
			foo += 1;
		});

		afterEach(function () {
			foo = 0;
		});

		it("is just a function, so it can contain any code", function () {
			expect(foo).toEqual(1);
		});

		it("can have more than one expectation", function () {
			expect(foo).toEqual(1);
			expect(true).toEqual(true);
		});
	});

	describe("A spec using beforeAll and afterAll", function () {
		let foo;

		beforeAll(function () {
			foo = 1;
		});

		afterAll(function () {
			foo = 0;
		});

		it("sets the initial value of foo before specs run", function () {
			expect(foo).toEqual(1);
			foo += 1;
		});

		it("does not reset foo between specs", function () {
			expect(foo).toEqual(2);
		});
	});

	describe("A spec", function () {
		beforeEach(function () {
			this.foo = 0;
		});

		it("can use the `this` to share state", function () {
			expect(this.foo).toEqual(0);
			this.bar = "test pollution?";
		});

		it("prevents test pollution by having an empty `this` created for the next spec", function () {
			expect(this.foo).toEqual(0);
			expect(this.bar).toBeUndefined();
		});
	});

	describe("A spec", function () {
		let foo;

		beforeEach(function () {
			foo = 0;
			foo += 1;
		});

		afterEach(function () {
			foo = 0;
		});

		it("is just a function, so it can contain any code", function () {
			expect(foo).toEqual(1);
		});

		it("can have more than one expectation", function () {
			expect(foo).toEqual(1);
			expect(true).toEqual(true);
		});

		describe("nested inside a second describe", function () {
			let bar;

			beforeEach(function () {
				bar = 1;
			});

			it("can reference both scopes as needed", function () {
				expect(foo).toEqual(bar);
			});
		});
	});

	xdescribe("A spec", function () {
		let foo;

		beforeEach(function () {
			foo = 0;
			foo += 1;
		});

		it("is just a function, so it can contain any code", function () {
			expect(foo).toEqual(1);
		});
	});

	describe("Pending specs", function () {

		xit("can be declared 'xit'", function () {
			expect(true).toBe(false);
		});

		it("can be declared with 'it' but without a function");

		it("can be declared by calling 'pending' in the spec body", function () {
			expect(true).toBe(false);
			pending("this is why it is pending");
		});
	});

	describe("A spy", function () {
		let foo, bar = null;

		beforeEach(function () {
			foo = {
				setBar: function (value) {
					bar = value;
				}
			};

			spyOn(foo, "setBar");

			foo.setBar(123);
			foo.setBar(456, "another param");
		});

		it("tracks that the spy was called", function () {
			expect(foo.setBar).toHaveBeenCalled();
		});

		it("tracks that the spy was called x times", function () {
			expect(foo.setBar).toHaveBeenCalledTimes(2);
		});

		it("tracks all the arguments of its calls", function () {
			expect(foo.setBar).toHaveBeenCalledWith(123);
			expect(foo.setBar).toHaveBeenCalledWith(456, "another param");
		});

		it("stops all execution on a function", function () {
			expect(bar).toBeNull();
		});
	});

	describe("A spy, when configured to call through", function () {
		let foo, bar, fetchedBar;

		beforeEach(function () {
			foo = {
				setBar: function (value) {
					bar = value;
				},
				getBar: function () {
					return bar;
				}
			};

			spyOn(foo, "getBar").and.callThrough();

			foo.setBar(123);
			fetchedBar = foo.getBar();
		});

		it("tracks that the spy was called", function () {
			expect(foo.getBar).toHaveBeenCalled();
		});

		it("should not affect other functions", function () {
			expect(bar).toEqual(123);
		});

		it("when called returns the requested value", function () {
			expect(fetchedBar).toEqual(123);
		});
	});

	describe("A spy, when configured to fake a return value", function () {
		let foo, bar, fetchedBar;

		beforeEach(function () {
			foo = {
				setBar: function (value) {
					bar = value;
				},
				getBar: function () {
					return bar;
				}
			};

			spyOn(foo, "getBar").and.returnValue(745);

			foo.setBar(123);
			fetchedBar = foo.getBar();
		});

		it("tracks that the spy was called", function () {
			expect(foo.getBar).toHaveBeenCalled();
		});

		it("should not affect other functions", function () {
			expect(bar).toEqual(123);
		});

		it("when called returns the requested value", function () {
			expect(fetchedBar).toEqual(745);
		});
	});

	describe("A spy, when configured to fake a series of return values", function () {
		let foo, bar;

		beforeEach(function () {
			foo = {
				setBar: function (value) {
					bar = value;
				},
				getBar: function () {
					return bar;
				}
			};

			spyOn(foo, "getBar").and.returnValues("fetched first", "fetched second");

			foo.setBar(123);
		});

		it("tracks that the spy was called", function () {
			foo.getBar(123);
			expect(foo.getBar).toHaveBeenCalled();
		});

		it("should not affect other functions", function () {
			expect(bar).toEqual(123);
		});

		it("when called multiple times returns the requested values in order", function () {
			expect(foo.getBar()).toEqual("fetched first");
			expect(foo.getBar()).toEqual("fetched second");
			expect(foo.getBar()).toBeUndefined();
		});
	});

	describe("A spy, when configured with an alternate implementation", function () {
		let foo, bar, fetchedBar;

		beforeEach(function () {
			foo = {
				setBar: function (value) {
					bar = value;
				},
				getBar: function () {
					return bar;
				}
			};

			// eslint-disable-next-line no-unused-vars
			spyOn(foo, "getBar").and.callFake(function (args, can, be, received) {
				return 1001;
			});

			foo.setBar(123);
			fetchedBar = foo.getBar();
		});

		it("tracks that the spy was called", function () {
			expect(foo.getBar).toHaveBeenCalled();
		});

		it("should not affect other functions", function () {
			expect(bar).toEqual(123);
		});

		it("when called returns the requested value", function () {
			expect(fetchedBar).toEqual(1001);
		});
	});

	describe("A spy, when configured to throw an error", function () {
		// eslint-disable-next-line no-unused-vars
		let foo, bar;

		beforeEach(function () {
			foo = {
				setBar: function (value) {
					bar = value;
				}
			};

			spyOn(foo, "setBar").and.throwError("quux");
		});

		it("throws the value", function () {
			expect(function () {
				foo.setBar(123);
			}).toThrowError("quux");
		});
	});

	describe("A spy", function () {
		let foo, bar = null;

		beforeEach(function () {
			foo = {
				setBar: function (value) {
					bar = value;
				}
			};

			spyOn(foo, "setBar").and.callThrough();
		});

		it("can call through and then stub in the same spec", function () {
			foo.setBar(123);
			expect(bar).toEqual(123);

			foo.setBar.and.stub();
			bar = null;

			foo.setBar(123);
			expect(bar).toBe(null);
		});
	});

	describe("A spy", function () {
		// eslint-disable-next-line no-unused-vars
		let foo, bar = null;

		beforeEach(function () {
			foo = {
				setBar: function (value) {
					bar = value;
				}
			};

			spyOn(foo, "setBar");
		});

		it("tracks if it was called at all", function () {
			expect(foo.setBar.calls.any()).toEqual(false);

			foo.setBar();

			expect(foo.setBar.calls.any()).toEqual(true);
		});

		it("tracks the number of times it was called", function () {
			expect(foo.setBar.calls.count()).toEqual(0);

			foo.setBar();
			foo.setBar();

			expect(foo.setBar.calls.count()).toEqual(2);
		});

		it("tracks the arguments of each call", function () {
			foo.setBar(123);
			foo.setBar(456, "baz");

			expect(foo.setBar.calls.argsFor(0)).toEqual([123]);
			expect(foo.setBar.calls.argsFor(1)).toEqual([456, "baz"]);
		});

		it("tracks the arguments of all calls", function () {
			foo.setBar(123);
			foo.setBar(456, "baz");

			expect(foo.setBar.calls.allArgs()).toEqual([[123], [456, "baz"]]);
		});

		it("can provide the context and arguments to all calls", function () {
			foo.setBar(123);
			let undef;
			expect(foo.setBar.calls.all()).toEqual([jasmine.objectContaining({ object: foo, args: [123], returnValue: undef })]);
		});

		it("has a shortcut to the most recent call", function () {
			foo.setBar(123);
			foo.setBar(456, "baz");

			let undef;
			expect(foo.setBar.calls.mostRecent()).toEqual(jasmine.objectContaining({ object: foo, args: [456, "baz"], returnValue: undef }));
		});

		it("has a shortcut to the first call", function () {
			foo.setBar(123);
			foo.setBar(456, "baz");

			let undef;
			expect(foo.setBar.calls.first()).toEqual(jasmine.objectContaining({ object: foo, args: [123], returnValue: undef }));
		});

		it("tracks the context", function () {
			const spy = jasmine.createSpy("spy");
			const baz = {
				fn: spy
			};
			const quux = {
				fn: spy
			};
			baz.fn(123);
			quux.fn(456);

			expect(spy.calls.first().object).toBe(baz);
			expect(spy.calls.mostRecent().object).toBe(quux);
		});

		it("can be reset", function () {
			foo.setBar(123);
			foo.setBar(456, "baz");

			expect(foo.setBar.calls.any()).toBe(true);

			foo.setBar.calls.reset();

			expect(foo.setBar.calls.any()).toBe(false);
		});
	});

	describe("A spy, when created manually", function () {
		let whatAmI;

		beforeEach(function () {
			whatAmI = jasmine.createSpy("whatAmI");

			whatAmI("I", "am", "a", "spy");
		});

		it("is named, which helps in error reporting", function () {
			expect(whatAmI.and.identity()).toEqual("whatAmI");
		});

		it("tracks that the spy was called", function () {
			expect(whatAmI).toHaveBeenCalled();
		});

		it("tracks its number of calls", function () {
			expect(whatAmI.calls.count()).toEqual(1);
		});

		it("tracks all the arguments of its calls", function () {
			expect(whatAmI).toHaveBeenCalledWith("I", "am", "a", "spy");
		});

		it("allows access to the most recent call", function () {
			expect(whatAmI.calls.mostRecent().args[0]).toEqual("I");
		});
	});

	describe("Multiple spies, when created manually", function () {
		let tape;

		beforeEach(function () {
			tape = jasmine.createSpyObj("tape", ["play", "pause", "stop", "rewind"]);

			tape.play();
			tape.pause();
			tape.rewind(0);
		});

		it("creates spies for each requested function", function () {
			expect(tape.play).toBeDefined();
			expect(tape.pause).toBeDefined();
			expect(tape.stop).toBeDefined();
			expect(tape.rewind).toBeDefined();
		});

		it("tracks that the spies were called", function () {
			expect(tape.play).toHaveBeenCalled();
			expect(tape.pause).toHaveBeenCalled();
			expect(tape.rewind).toHaveBeenCalled();
			expect(tape.stop).not.toHaveBeenCalled();
		});

		it("tracks all the arguments of its calls", function () {
			expect(tape.rewind).toHaveBeenCalledWith(0);
		});
	});

	describe("jasmine.any", function () {
		it("matches any value", function () {
			expect({}).toEqual(jasmine.any(Object));
			expect(12).toEqual(jasmine.any(Number));
		});

		describe("when used with a spy", function () {
			it("is useful for comparing arguments", function () {
				const foo = jasmine.createSpy("foo");
				foo(12, function () {
					return true;
				});

				expect(foo).toHaveBeenCalledWith(jasmine.any(Number), jasmine.any(Function));
			});
		});
	});

	describe("jasmine.anything", function () {
		it("matches anything", function () {
			expect(1).toEqual(jasmine.anything());
		});

		describe("when used with a spy", function () {
			it("is useful when the argument can be ignored", function () {
				const foo = jasmine.createSpy("foo");
				foo(12, function () {
					return false;
				});

				expect(foo).toHaveBeenCalledWith(12, jasmine.anything());
			});
		});
	});

	describe("jasmine.objectContaining", function () {
		let foo;

		beforeEach(function () {
			foo = {
				a: 1,
				b: 2,
				bar: "baz"
			};
		});

		it("matches objects with the expect key/value pairs", function () {
			expect(foo).toEqual(jasmine.objectContaining({
				bar: "baz"
			}));
			expect(foo).not.toEqual(jasmine.objectContaining({
				c: 37
			}));
		});

		describe("when used with a spy", function () {
			it("is useful for comparing arguments", function () {
				const callback = jasmine.createSpy("callback");

				callback({
					bar: "baz"
				});

				expect(callback).toHaveBeenCalledWith(jasmine.objectContaining({
					bar: "baz"
				}));
				expect(callback).not.toHaveBeenCalledWith(jasmine.objectContaining({
					c: 37
				}));
			});
		});
	});

	describe("jasmine.arrayContaining", function () {
		let foo;

		beforeEach(function () {
			foo = [1, 2, 3, 4];
		});

		it("matches arrays with some of the values", function () {
			expect(foo).toEqual(jasmine.arrayContaining([3, 1]));
			expect(foo).not.toEqual(jasmine.arrayContaining([6]));
		});

		describe("when used with a spy", function () {
			it("is useful when comparing arguments", function () {
				const callback = jasmine.createSpy("callback");

				callback([1, 2, 3, 4]);

				expect(callback).toHaveBeenCalledWith(jasmine.arrayContaining([4, 2, 3]));
				expect(callback).not.toHaveBeenCalledWith(jasmine.arrayContaining([5, 2]));
			});
		});
	});

	describe("jasmine.stringMatching", function () {
		it("matches as a regexp", function () {
			expect({ foo: "bar" }).toEqual({ foo: jasmine.stringMatching(/^bar$/) });
			expect({ foo: "foobarbaz" }).toEqual({ foo: jasmine.stringMatching("bar") });
		});

		describe("when used with a spy", function () {
			it("is useful for comparing arguments", function () {
				const callback = jasmine.createSpy("callback");

				callback("foobarbaz");

				expect(callback).toHaveBeenCalledWith(jasmine.stringMatching("bar"));
				expect(callback).not.toHaveBeenCalledWith(jasmine.stringMatching(/^bar$/));
			});
		});
	});

	describe("custom asymmetry", function () {
		const tester = {
			asymmetricMatch: function (actual) {
				const [, secondValue] = actual.split(",");
				return secondValue === "bar";
			}
		};

		it("dives in deep", function () {
			expect("foo,bar,baz,quux").toEqual(tester);
		});

		describe("when used with a spy", function () {
			it("is useful for comparing arguments", function () {
				const callback = jasmine.createSpy("callback");

				callback("foo,bar,baz");

				expect(callback).toHaveBeenCalledWith(tester);
			});
		});
	});

	describe("Manually ticking the Jasmine Clock", function () {
		let timerCallback;

		beforeEach(function () {
			timerCallback = jasmine.createSpy("timerCallback");
			jasmine.clock().install();
		});

		afterEach(function () {
			jasmine.clock().uninstall();
		});

		it("causes a timeout to be called synchronously", function () {
			setTimeout(function () {
				timerCallback();
			}, 100);

			expect(timerCallback).not.toHaveBeenCalled();

			jasmine.clock().tick(101);

			expect(timerCallback).toHaveBeenCalled();
		});

		it("causes an interval to be called synchronously", function () {
			setInterval(function () {
				timerCallback();
			}, 100);

			expect(timerCallback).not.toHaveBeenCalled();

			jasmine.clock().tick(101);
			expect(timerCallback.calls.count()).toEqual(1);

			jasmine.clock().tick(50);
			expect(timerCallback.calls.count()).toEqual(1);

			jasmine.clock().tick(50);
			expect(timerCallback.calls.count()).toEqual(2);
		});

		describe("Mocking the Date object", function () {
			it("mocks the Date object and sets it to a given time", function () {
				const baseTime = new Date(2013, 9, 23);

				jasmine.clock().mockDate(baseTime);

				jasmine.clock().tick(50);
				expect(new Date().getTime()).toEqual(baseTime.getTime() + 50);
			});
		});
	});

	describe("Asynchronous specs", function () {
		let value;

		beforeEach(function (done) {
			setTimeout(function () {
				value = 0;
				done();
			}, 1);
		});

		it("should support async execution of test preparation and expectations", function (done) {
			value++;
			expect(value).toBeGreaterThan(0);
			done();
		});

		describe("long asynchronous specs", function () {
			beforeEach(function (done) {
				done();
			}, 1000);

			it("takes a long time", function (done) {
				setTimeout(function () {
					done();
				}, 9000);
			}, 10000);

			afterEach(function (done) {
				done();
			}, 1000);
		});

		describe("A spec using done.fail", function () {
			const foo = function (x, callBack1, callBack2) {
				if (x) {
					setTimeout(callBack1, 0);
				} else {
					setTimeout(callBack2, 0);
				}
			};

			it("should not call the second callBack", function (done) {
				foo(true,
					done,
					function () {
						done.fail("Second callback has been called");
					}
				);
			});
		});

		describe("Returning a Promise", function () {
			var all;
			var each;
			var after;

			beforeAll(function () {
				return new Promise(function (resolve) {
					setTimeout(function () {
						all = 0;
						resolve();
					}, 1);
				});
			});

			beforeEach(function () {
				return new Promise(function (resolve) {
					setTimeout(function () {
						each = 0;
						resolve();
					}, 1);
				});
			});

			afterEach(function () {
				return new Promise(function (resolve) {
					setTimeout(function () {
						after = 0;
						resolve();
					}, 1);
				});
			});

			it("waits for returned Promises", function () {
				return new Promise(function (resolve) {
					setTimeout(function () {
						all++;
						each++;
						after = 1;

						expect(all).toBe(1);
						expect(each).toBe(1);
						expect(after).toBe(1);

						resolve();
					}, 1);
				});
			});

			it("waits for async functions as well", async function () {
				await new Promise(function (resolve) {
					setTimeout(function () {
						all++;
						each++;
						after++;

						resolve();
					}, 1);
				});

				expect(all).toBe(2);
				expect(each).toBe(1);
				expect(after).toBe(1);
			});

		});
	});
});
