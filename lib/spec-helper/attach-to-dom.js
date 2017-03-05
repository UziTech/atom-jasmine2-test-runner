"use babel";
/* globals jasmine, afterEach */


jasmine.attachToDOM = function (element) {
	const jasmineContent = document.querySelector("#jasmine2-content");
	if (!jasmineContent.contains(element)) {
		return jasmineContent.appendChild(element);
	}
};


afterEach(function () {
	if (!window.debugContent) { document.getElementById("jasmine2-content").innerHTML = ""; }
});
