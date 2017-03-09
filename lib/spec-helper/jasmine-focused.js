"use babel";

const env = jasmine.getEnv();

function setGlobalFocusPriority(priority) {
	if (!env.focusPriority) {
		env.focusPriority = 0;
	}
	if (priority > env.focusPriority) {
		env.focusPriority = priority;
	}
};
const __realIt = it;
const __realDescribe = describe;

let currentSuitePriority = 0;

let prioritySpecs = {};

function addPrioritySpec(spec, priority) {
	if (currentSuitePriority > priority) {
		priority = currentSuitePriority;
	}
	spec.priority = priority;
	if (!prioritySpecs[priority]) {
		prioritySpecs[priority] = [spec];
	} else {
		prioritySpecs[priority].push(spec);
	}
}

function disableNonPrioritySpecs() {
	for (let i = 0; i < env.focusPriority; i++) {
		if (Array.isArray(prioritySpecs[i])) {
			prioritySpecs[i].forEach(spec => { spec.disable(); });
			delete prioritySpecs[i];
		}
	}
}

function createSuite(description, specDefinitions, priority) {
	const parentSuitePriority = currentSuitePriority;
	setGlobalFocusPriority(priority);
	if (priority > currentSuitePriority) {
		currentSuitePriority = priority;
	}
	disableNonPrioritySpecs();
	const suite = __realDescribe(description, specDefinitions);
	suite.priority = currentSuitePriority;
	currentSuitePriority = parentSuitePriority;
	return suite;
}

function createSpec(description, specDefinition, timeout, priority) {
	setGlobalFocusPriority(priority);
	let spec = __realIt(description, specDefinition, timeout);
	addPrioritySpec(spec, priority);
	disableNonPrioritySpecs();
	return spec;
}

const focusMethods = {
	describe(description, specDefinitions) {
		return createSuite(description, specDefinitions, 0);
	},

	fdescribe(description, specDefinitions) {
		return createSuite(description, specDefinitions, 1);
	},

	ffdescribe(description, specDefinitions) {
		return createSuite(description, specDefinitions, 2);
	},

	fffdescribe(description, specDefinitions) {
		return createSuite(description, specDefinitions, 3);
	},

	it(description, specDefinition, timeout) {
		return createSpec(description, specDefinition, timeout, 0);
	},

	fit(description, specDefinition, timeout) {
		return createSpec(description, specDefinition, timeout, 1);
	},

	ffit(description, specDefinition, timeout) {
		return createSpec(description, specDefinition, timeout, 2);
	},

	fffit(description, specDefinition, timeout) {
		return createSpec(description, specDefinition, timeout, 3);
	}
};

for (let methodName in focusMethods) {
	window[methodName] = focusMethods[methodName];
}
