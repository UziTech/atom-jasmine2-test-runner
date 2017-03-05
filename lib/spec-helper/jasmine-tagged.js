"use babel";
/* globals jasmine */

const env = jasmine.getEnv();

let includeSpecsWithoutTags = true;
env.includeSpecsWithoutTags = function (permit) {
	includeSpecsWithoutTags = permit;
};

let includedTags = [];
env.setIncludedTags = function (tags) {
	includedTags = tags;
};

var findTags = function (spec) {
	const words = spec.description.split(" ");
	let tags = (words.filter(word => word.indexOf("#") === 0).map(word => word.substring(1)));
	if (!tags) { tags = []; }

	const parent = (spec.parentSuite ? spec.parentSuite : spec.suite);
	if (parent) {
		tags = tags.concat(findTags(parent));
	}
	return tags;

};

const originalFilter = (env.specFilter ? env.specFilter : _ => true);
env.specFilter = function (spec) {
	if (!originalFilter(spec)) { return false; }

	const tags = findTags(spec);
	if (includeSpecsWithoutTags && (tags.length === 0)) { return true; }

	return tags.some(tag => includedTags.includes(tag));
};
