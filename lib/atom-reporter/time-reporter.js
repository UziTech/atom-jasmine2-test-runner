"use babel";
/* globals jasmine */
// converted from https://github.com/atom/atom/blob/master/spec/time-reporter.coffee

import _ from "underscore-plus";

export default class TimeReporter {

	constructor() {
		window.j2timedSpecs = [];
		window.j2timedSuites = {};

		window.j2logLongestSpec = _ => this.logLongestSpecs(1);
		window.j2logLongestSpecs = number => this.logLongestSpecs(number);
		window.j2logLongestSuite = _ => this.logLongestSuites(1);
		window.j2logLongestSuites = number => this.logLongestSuites(number);
	}

	logLongestSuites(number = 10, log) {
		if (Object.keys(window.j2timedSuites).length <= 0) { return; }

		if (!log) { log = line => console.log(line); }
		log("Longest running suites:");
		let suites = _.map(window.j2timedSuites, (key, value) => [value, key]);
		for (let suite of Array.from(_.sortBy(suites, suite => -suite[1]).slice(0, number))) {
			let time = Math.round(suite[1] / 100) / 10;
			log(`  ${suite[0]} (${time}s)`);
		}
	}

	logLongestSpecs(number = 10, log) {
		if (window.j2timedSpecs.length <= 0) { return; }

		if (!log) { log = line => console.log(line); }
		log("Longest running specs:");
		for (let spec of Array.from(_.sortBy(window.j2timedSpecs, spec => -spec.time).slice(0, number))) {
			let time = Math.round(spec.time / 100) / 10;
			log(`${spec.description} (${time}s)`);
		}
	}

	specStarted(spec) {
		spec = this.getSpec(spec);
		let stack = [spec.description];
		let { suite } = spec;
		while (suite.parentSuite) {
			stack.unshift(suite.description);
			this.suite = suite.description;
			suite = suite.parentSuite;
		}

		let reducer = function (memo, description, index) {
			if (index === 0) {
				return `${description}`;
			}
			return `${memo}\n${_.multiplyString("  ", index)}${description}`;

		};
		this.description = _.reduce(stack, reducer, "");
		this.time = Date.now();
	}

	specDone(spec) {
		spec = this.getSpec(spec);
		if (!this.time || !this.description) { return; }

		let duration = Date.now() - this.time;

		if (duration > 0) {
			window.j2timedSpecs.push({
				description: this.description,
				time: duration,
				fullName: spec.fullName
			});

			if (window.j2timedSuites[this.suite]) {
				window.j2timedSuites[this.suite] += duration;
			} else {
				window.j2timedSuites[this.suite] = duration;
			}
		}

		this.time = null;
		this.description = null;
	}

	getSpec(spec) {
		return this.specs[spec.id];
	}

	getSpecs(suite) {
		let specs = [];
		for (let child of suite.children) {
			if (child instanceof jasmine.Spec) {
				child.suite = suite;
				specs.push(child);
			} else {
				specs = specs.concat(this.getSpecs(child));
			}
		}
		return specs;
	}

	jasmineStarted() {
		this.specs = this.getSpecs(jasmine.getEnv().topSuite()).reduce((prev, spec) => {
			prev[spec.id] = spec;
			return prev;
		}, {});
	}

	jasmineDone() {
		// console.log(this.logLongestSpecs);
		// console.log(this.logLongestSuites);
	}

};
