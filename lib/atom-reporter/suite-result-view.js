"use babel";

export default class SuiteResultView {
	constructor(suite) {
		this.suite = suite;

		this.element = document.createElement("div");
		this.element.className = "suite";
		this.element.setAttribute("id", `suite-view-${this.suite.id}`);

		this.description = document.createElement("div");
		this.description.className = "description";
		this.description.textContent = this.suite.description;
		this.element.appendChild(this.description);
	}

	attach() {
		this.parentView().appendChild(this.element);
	}

	parentView() {
		if (this.suite.parentSuite && this.suite.parentSuite.parentSuite) {
			let suiteViewElement = document.querySelector(`#suite-view-${this.suite.parentSuite.id}`);
			if (!suiteViewElement) {
				let suiteView = new SuiteResultView(this.suite.parentSuite);
				suiteView.attach();
				suiteViewElement = suiteView.element;
			}

			return suiteViewElement;
		}

		return document.querySelector(".j2-results");
	}
}
