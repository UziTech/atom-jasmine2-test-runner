"use babel";
// TODO: use https://github.com/jasmine/jasmine/pull/1289 when it is merged

const __realSpyOn = spyOn;
let currentSpies = [];

spyOn = function (object, methodName) {
	const originalMethod = object[methodName];
	let restore;
	if (Object.prototype.hasOwnProperty.call(object, methodName)) {
		restore = function () {
			object[methodName] = originalMethod;
		};
	} else {
		restore = function () {
			if (!delete object[methodName]) {
				object[methodName] = originalMethod;
			}
		};
	}

	const spy = __realSpyOn(object, methodName);

	currentSpies.unshift({
		object,
		methodName,
		originalMethod,
		restore
	});

	return spy;
};

jasmine.unspy = function (object, methodName) {
	const spy = currentSpies.find(spy => spy.object === object && spy.methodName === methodName);
	if (spy) {
		spy.restore();
	}
};
