"use babel";
/* globals jasmine */

const env = jasmine.getEnv();

let includeSpecsWithoutTags = true;
env.includeSpecsWithoutTags = function (permit) {
	includeSpecsWithoutTags = permit;
};

let includedTags = [];
env.setIncludedTags = function (tags) {
	if (!Array.isArray(tags)) {
		tags = [tags];
	}
	includedTags = tags;
};



function findTags(spec) {
	const words = spec.getFullName().split(" ");
	let tags = words.filter(word => word.startsWith("#")).map(word => word.substring(1));
	if (!tags) { tags = []; }

	return tags;
};

const originalFilter = (env.specFilter ? env.specFilter : _ => true);
env.specFilter = function (spec) {
	if (!originalFilter(spec)) { return false; }

	const tags = findTags(spec);
	if (includeSpecsWithoutTags && (tags.length === 0)) { return true; }

	return tags.some(tag => includedTags.includes(tag));
};
