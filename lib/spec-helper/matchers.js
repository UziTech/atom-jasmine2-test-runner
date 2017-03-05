"use babel";
/* globals jasmine, beforeEach */

import path from "path";
import fs from "fs";
import _ from "underscore-plus";

beforeEach(function () {

	jasmine.addCustomEqualityTester(function (a, b) {
		// Use underscore's definition of equality for toEqual assertions
		const result = _.isEqual(a, b);
		if (result) {
			return true;
		}
		// return undefined to allow jasmines regular toEqual
	});

	jasmine.addMatchers({
		toBeInstanceOf() {
			return {
				compare: function (actual, expected) {
					let result = {};
					result.passed = actual instanceof expected;
					const beOrNotBe = (result.passed ? "not be" : "be");
					result.message = `Expected ${jasmine.pp(actual)} to ${beOrNotBe} instance of ${expected.name} class`;
					return result;
				}
			};
		},

		toHaveLength() {
			return {
				compare: function (actual, expected) {
					let result = {};
					if (!actual) {
						result.message = `Expected object ${actual} has no length method`;
						result.pass = false;
					} else {
						result.pass = (actual.length === expected);
						const haveOrNotHave = (result.pass ? "not have" : "have");
						result.message = `Expected object with length ${actual.length} to ${haveOrNotHave} length ${expected}`;
					}
					return result;
				}
			};
		},

		toExistOnDisk() {
			return {
				compare: function (actual) {
					let result = {};
					result.pass = fs.existsSync(actual);
					const toOrNotTo = (result.pass ? "not to" : "to");
					result.message = `Expected path '${actual}' ${toOrNotTo} exist.`;
					return result;
				}
			};
		},

		toHaveFocus() {
			return {
				compare: function (actual) {
					let result = {};
					const element = (actual.jquery ? actual.get(0) : actual);
					result.pass = (element === document.activeElement) || element.contains(document.activeElement);
					const toOrNotTo = (result.pass ? "not to" : "to");
					if (!document.hasFocus()) {
						console.error("Specs will fail because the Dev Tools have focus. To fix this close the Dev Tools or click the spec runner.");
					}
					result.message = `Expected element '${actual}' or its descendants ${toOrNotTo} have focus.`;
					return result;
				}
			};
		},

		toShow() {
			return {
				compare: function (actual) {
					let result = {};
					const element = (actual.jquery ? actual.get(0) : actual);
					result.pass = ["block", "inline-block", "static", "fixed"].includes(element.style.display);
					const toOrNotTo = (result.pass ? "not to" : "to");
					result.message = `Expected element '${element}' or its descendants ${toOrNotTo} show.`;
					return result;
				}
			};
		},

		toEqualPath(util, customEqualityTesters) {
			return {
				compare: function (actual, expected) {
					let result = {};
					const actualPath = path.normalize(actual);
					const expectedPath = path.normalize(expected);
					result.pass = actualPath === expectedPath;
					const beOrNotBe = (result.passed ? "not be" : "be");
					result.message = `Expected path '${actualPath}' to ${beOrNotBe} equal to '${expectedPath}'.`;
					return result;
				}
			};
		}
	});
});
