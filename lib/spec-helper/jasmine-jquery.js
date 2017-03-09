"use babel";

import $ from "jquery";
import _ from "underscore-plus";

jasmine.JQuery = function () {};

jasmine.JQuery.browserTagCaseIndependentHtml = function (html) {
	let div = document.createElement("div");
	div.innerHTML = html;
	return div.innerHTML;
};

jasmine.JQuery.toElement = function (element) {
	if (element instanceof HTMLElement) {
		return element;
	}
	if (element.jquery) {
		if (element.length === 0) {
			throw new Error(`${element.selector} does not match an element`);
		}
		return element[0];
	}
	throw new Error(`${element} is not an element`);
};

jasmine.JQuery.elementToString = function (element) {
	try {
		return jasmine.JQuery.toElement(element).outerHTML;
	} catch (ex) {}
	return element.toString();
};

jasmine.JQuery.elementToTagString = function (element) {
	const matches = jasmine.JQuery.elementToString(element).match(/^<.*?>/);
	if (!matches) {
		return element.toString();
	}
	return matches[0];
};

jasmine.JQuery.matchersClass = {};

const jQueryMatchers = {
	toHaveClass: function (options, actual, className) {
		let result = {};
		if (actual instanceof HTMLElement) {
			result.pass = actual.classList.contains(className);
		} else {
			result.pass = actual.hasClass(className);
		}
		const haveOrNotHave = (result.pass ? "not have" : "have");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' to ${haveOrNotHave} class '${className}'`;
		return result;
	},

	toBeVisible: function (options, actual) {
		let result = {};
		if (actual instanceof HTMLElement) {
			result.pass = actual.offsetWidth !== 0 || actual.offsetHeight !== 0;
		} else {
			result.pass = actual.is(":visible");
		}
		const beOrNotBe = (result.pass ? "not be" : "be");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' to ${beOrNotBe} visible`;
		return result;
	},

	toBeHidden: function (options, actual) {
		let result = {};
		if (actual instanceof HTMLElement) {
			result.pass = actual.offsetWidth === 0 || actual.offsetHeight === 0;
		} else {
			result.pass = actual.is(":hidden");
		}
		const beOrNotBe = (result.pass ? "not be" : "be");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' to ${beOrNotBe} hidden`;
		return result;
	},

	toBeSelected: function (options, actual) {
		let result = {};
		if (actual instanceof HTMLElement) {
			result.pass = actual.selected;
		} else {
			result.pass = actual.is(":selected");
		}
		const beOrNotBe = (result.pass ? "not be" : "be");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' to ${beOrNotBe} selected`;
		return result;
	},

	toBeChecked: function (options, actual) {
		let result = {};
		if (actual instanceof HTMLElement) {
			result.pass = actual.checked;
		} else {
			result.pass = actual.is(":checked");
		}
		const beOrNotBe = (result.pass ? "not be" : "be");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' to ${beOrNotBe} checked`;
		return result;
	},

	toBeEmpty: function (options, actual) {
		let result = {};
		if (actual instanceof HTMLElement) {
			result.pass = actual.innerHTML === "";
		} else {
			result.pass = actual.is(":empty");
		}
		const beOrNotBe = (result.pass ? "not be" : "be");
		const actualString = jasmine.JQuery.elementToString(actual);
		result.message = `Expected '${actualString}' to ${beOrNotBe} empty`;
		return result;
	},

	toExist: function (options, actual) {
		let result = {};
		result.pass = (actual instanceof HTMLElement || actual.length > 0);
		const toOrNotTo = (result.pass ? "not to" : "to");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' ${toOrNotTo} exist`;
		return result;
	},

	toHaveAttr: function (options, actual, attributeName, expectedAttributeValue) {
		let result = {};
		let actualAttributeValue;
		if (actual instanceof HTMLElement) {
			actualAttributeValue = actual.getAttribute(attributeName);
		} else {
			actualAttributeValue = actual.attr(attributeName);
		}
		result.pass = hasProperty(actualAttributeValue, expectedAttributeValue);
		const haveOrNotHave = (result.pass ? "not have" : "have");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		const attrString = attributeName + (typeof expectedAttributeValue !== "undefined" ? `='${expectedAttributeValue.replace("'", "\\'")}'` : "");
		result.message = `Expected '${actualString}' to ${haveOrNotHave} attribute ${attrString}`;
		return result;
	},

	toHaveId: function (options, actual, id) {
		let result = {};
		if (actual instanceof HTMLElement) {
			result.pass = actual.getAttribute("id") === id;
		} else {
			result.pass = actual.attr("id") === id;
		}
		const haveOrNotHave = (result.pass ? "not have" : "have");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' to ${haveOrNotHave} id '${id}'`;
		return result;
	},

	toHaveHtml: function (options, actual, html) {
		let result = {};
		let actualHTML;
		if (actual instanceof HTMLElement) {
			actualHTML = actual.innerHTML;
		} else {
			actualHTML = actual.html();
		}
		result.pass = actualHTML === jasmine.JQuery.browserTagCaseIndependentHtml(html);
		const haveOrNotHave = (result.pass ? "not have" : "have");
		const actualString = jasmine.JQuery.elementToString(actual);
		result.message = `Expected '${actualString}' to ${haveOrNotHave} html '${html}'`;
		return result;
	},

	toHaveText: function (options, actual, text) {
		let result = {};
		let actualText;
		if (actual instanceof HTMLElement) {
			actualText = actual.textContent;
		} else {
			actualText = actual.text();
		}

		if (text && typeof text.test === "function") {
			result.pass = text.test(actualText);
		} else {
			result.pass = actualText === text;
		}
		const haveOrNotHave = (result.pass ? "not have" : "have");
		const actualString = jasmine.JQuery.elementToString(actual);
		result.message = `Expected '${actualString}' to ${haveOrNotHave} text '${text}'`;
		return result;
	},

	toHaveValue: function (options, actual, value) {
		let result = {};
		if (actual instanceof HTMLElement) {
			result.pass = actual.value === value;
		} else {
			result.pass = actual.val() === value;
		}
		const haveOrNotHave = (result.pass ? "not have" : "have");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' to ${haveOrNotHave} value '${value}'`;
		return result;
	},

	toHaveData: function (options, actual, key, expectedValue) {
		let result = {};
		if (actual instanceof HTMLElement) {
			const camelCaseKey = _.camelize(key);
			result.pass = hasProperty(actual.dataset[camelCaseKey], expectedValue);
		} else {
			result.pass = hasProperty(actual.data(key), expectedValue);
		}
		const haveOrNotHave = (result.pass ? "not have" : "have");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		const dataString = key + (typeof expectedValue !== "undefined" ? `='${expectedValue.replace("'", "\\'")}'` : "");
		result.message = `Expected '${actualString}' to ${haveOrNotHave} data ${dataString}`;
		return result;
	},

	toMatchSelector: function (options, actual, selector) {
		let result = {};
		if (actual instanceof HTMLElement) {
			result.pass = actual.matches(selector);
		} else {
			result.pass = actual.is(selector);
		}
		const matchOrNotMatch = (result.pass ? "not match" : "match");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' to ${matchOrNotMatch} selector ${selector}`;
		return result;
	},

	toContain: function (options, actual, contained) {
		let result = {};
		if (actual instanceof HTMLElement) {
			if (typeof contained === "string") {
				result.pass = actual.querySelector(contained);
			} else {
				result.pass = actual.contains(contained);
			}
		} else {
			result.pass = actual.find(contained).length > 0;
		}
		const toOrNotTo = (result.pass ? "not to" : "to");
		const actualString = jasmine.JQuery.elementToString(actual);
		const containedString = (typeof contained === "string" ? contained : jasmine.JQuery.elementToString(contained));
		result.message = `Expected '${actualString}' ${toOrNotTo} contain '${containedString}'`;
		return result;
	},

	toBeDisabled: function (options, actual) {
		let result = {};
		if (actual instanceof HTMLElement) {
			result.pass = actual.disabled;
		} else {
			result.pass = actual.is(":disabled");
		}
		const beOrNotBe = (result.pass ? "not be" : "be");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' to ${beOrNotBe} disabled`;
		return result;
	},

	// tests the existence of a specific event binding
	toHandle: function (options, actual, eventName) {
		let result = {};
		const events = actual.data("events");
		result.pass = events && events[eventName].length > 0;
		const toOrNotTo = (result.pass ? "not to" : "to");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' ${toOrNotTo} handle '${eventName}'`;
		return result;
	},

	// tests the existence of a specific event binding + handler
	toHandleWith: function (options, actual, eventName, eventHandler) {
		let result = {};
		const stack = actual.data("events")[eventName];
		result.pass = false;
		for (let i = 0; i < stack.length; i++) {
			if (stack[i].handler === eventHandler) {
				result.pass = true;
				break;
			}
		}
		const toOrNotTo = (result.pass ? "not to" : "to");
		const actualString = actual.selector ? actual.selector : jasmine.JQuery.elementToTagString(actual);
		result.message = `Expected '${actualString}' ${toOrNotTo} handle '${eventName}' with '${eventHandler.name}'`;
		return result;
	}
};

function hasProperty(actualValue, expectedValue) {
	if (typeof expectedValue === "undefined") {
		return (typeof actualValue !== "undefined" && actualValue !== null);
	}
	// eslint-disable-next-line eqeqeq
	return (actualValue == expectedValue);
};

function bindMatcher(methodName) {
	const builtInMatcher = jasmine.matchers[methodName];
	jasmine.JQuery.matchersClass[methodName] = function (util, customEqualityTesters) {
		return {
			compare: function (actual) {
				if (actual && (actual.jquery || actual instanceof HTMLElement)) {
					const options = {
						util,
						customEqualityTesters
					};
					return jQueryMatchers[methodName].apply(this, [options, ...arguments]);
				}

				if (typeof builtInMatcher === "function") {
					return builtInMatcher(util, customEqualityTesters).compare.apply(this, arguments);
				}

				return {
					pass: false,
					message: `${actual} is not an element`
				};
			}
		};
	};
};

for (const methodName in jQueryMatchers) {
	bindMatcher(methodName);
}

beforeEach(function () {
	jasmine.addMatchers(jasmine.JQuery.matchersClass);
});
