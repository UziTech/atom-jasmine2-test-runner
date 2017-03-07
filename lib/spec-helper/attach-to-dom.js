"use babel";

let jasmine2Content = document.createElement("div");
jasmine2Content.id = "jasmine2-content";
document.body.appendChild(jasmine2Content);

jasmine.attachToDOM = function (element) {
	const jasmineContent = document.querySelector("#jasmine2-content");
	if (!jasmineContent.contains(element)) {
		return jasmineContent.appendChild(element);
	}
};

afterEach(function () {
	if (!window.debugContent) { document.getElementById("jasmine2-content").innerHTML = ""; }
});
