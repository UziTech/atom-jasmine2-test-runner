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

	currentSpies.push({
		object,
		methodName,
		restore
	});

	return spy;
};

jasmine.unspy = function (object, methodName) {
	for (let i = currentSpies.length - 1; i >= 0; i--) {
		const spy = currentSpies[i];
		if (spy.object === object && spy.methodName === methodName) {
			spy.restore();
			currentSpies.splice(i, 1);
		}
	}
};
