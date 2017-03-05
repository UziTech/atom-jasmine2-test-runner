"use babel";
/* globals jasmine, describe, it */

// let jasmine;
// if (global.jasmine != null) {
//   ({ jasmine } = global);
//   if (jasmine.TerminalReporter == null) {
//     let path = require('path');
//     let jasmineNodePath = require.resolve('jasmine-node');
//     let reporterPath = path.join(path.dirname(jasmineNodePath), 'reporter');
//     let {jasmineNode} = require(reporterPath);
//     jasmine.TerminalReporter = jasmineNode.TerminalReporter;
//   }
// } else {
//   jasmine = require('jasmine-node');
// }

const env = jasmine.getEnv();

function setGlobalFocusPriority(priority) {
	if (!env.focusPriority) {
		env.focusPriority = 1;
	}
	if (priority > env.focusPriority) {
		return env.focusPriority = priority;
	}
};

const focusMethods = {
	fdescribe(description, specDefinitions, priority) {
		if (!priority) { priority = 1; }
		setGlobalFocusPriority(priority);
		let suite = describe(description, specDefinitions);
		suite.focusPriority = priority;
		return suite;
	},

	ffdescribe(description, specDefinitions) {
		return this.fdescribe(description, specDefinitions, 2);
	},

	fffdescribe(description, specDefinitions) {
		return this.fdescribe(description, specDefinitions, 3);
	},

	fit(description, definition, priority) {
		if (!priority) { priority = 1; }
		setGlobalFocusPriority(priority);
		let spec = it(description, definition);
		spec.focusPriority = priority;
		return spec;
	},

	ffit(description, specDefinitions) {
		return this.fit(description, specDefinitions, 2);
	},

	fffit(description, specDefinitions) {
		return this.fit(description, specDefinitions, 3);
	}
};

for (let methodName in focusMethods) {
	window[methodName] = focusMethods[methodName];
}

const originalFilter = (env.specFilter ? env.specFilter : _ => true);
env.specFilter = function (spec) {
	const globalFocusPriority = env.focusPriority;
	const parent = (spec.parentSuite ? spec.parentSuite : spec.suite);

	let filter = true;
	if (globalFocusPriority && spec.focusPriority < globalFocusPriority) {
		filter = false;
	} else if (parent && !env.specFilter(parent)) {
		filter = false;
	}

	if (filter) {
		return originalFilter(spec);
	}
	return false;
};
