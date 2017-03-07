"use babel";

function addShouldFailExpectationResult(spec, addExpectationResult) {
	return (passed, data, isError) => addExpectationResult.call(spec, !passed, data, passed);
}

window.zdescribe = function (description, specDefinitions) {
	const suite = describe(description, specDefinitions);
	suite.children.forEach(spec => {
		if (!spec.shouldFail) {
			spec.shouldFail = true;
			spec.addExpectationResult = addShouldFailExpectationResult(spec, spec.addExpectationResult);
		}
	});
	return suite;
};

window.zit = function (description, specDefinition) {
	const spec = it(description, specDefinition);
	spec.shouldFail = true;
	spec.addExpectationResult = addShouldFailExpectationResult(spec, spec.addExpectationResult);
	return spec;
};
