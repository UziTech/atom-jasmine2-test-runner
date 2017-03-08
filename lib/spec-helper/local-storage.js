"use babel";

const __realLocalStorageSetItem = window.localStorage.setItem;
const __realLocalStorageGetItem = window.localStorage.getItem;
const __realLocalStorageRemoveItem = window.localStorage.removeItem;
const __realLocalStorageClear = window.localStorage.clear;
const __realLocalStorageKey = window.localStorage.key;

window.mockLocalStorage = function () {
	let items = {};
	spyOn(window.localStorage, "setItem").and.callFake(function (key, item) {
		items[key] = item.toString();
	});
	spyOn(window.localStorage, "getItem").and.callFake(function (key) {
		return (items[key] ? items[key] : null);
	});
	spyOn(window.localStorage, "removeItem").and.callFake(function (key) {
		delete items[key];
	});
	spyOn(window.localStorage, "clear").and.callFake(function () {
		items = {};
	});
	spyOn(window.localStorage, "key").and.callFake(function (key) {
		return Object.keys(items)[key];
	});
};

window.unmockLocalStorage = function () {
	window.localStorage.setItem = __realLocalStorageSetItem;
	window.localStorage.getItem = __realLocalStorageGetItem;
	window.localStorage.removeItem = __realLocalStorageRemoveItem;
	window.localStorage.clear = __realLocalStorageClear;
	window.localStorage.key = __realLocalStorageKey;
};
