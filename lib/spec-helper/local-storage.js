"use babel";
/* globals jasmine, spyOn */

window.__realLocalStorageSetItem = window.localStorage.setItem;
window.__realLocalStorageGetItem = window.localStorage.getItem;
window.__realLocalStorageRemoveItem = window.localStorage.removeItem;

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
};

window.unmockLocalStorage = function () {
	window.localStorage.setItem = window.__realLocalStorageSetItem;
	window.localStorage.getItem = window.__realLocalStorageGetItem;
	window.localStorage.removeItem = window.__realLocalStorageRemoveItem;
};
