/** @babel */

import $ from "jquery";

describe("jasmine-jquery", function () {
	beforeEach(function () {
		this.domContainer = $("<div id='jasmine-jquery-specs-container' />").appendTo("body");
		this.tag = (tag) => {
			const $el = $(`<${tag} />`);
			$el.attach = () => {
				return $el.appendTo(this.domContainer);
			};
			return $el;
		};
	});

	afterEach(function () {
		this.domContainer.remove();
	});

	describe("functions", function () {
		it("should define jasmine.JQuery.browserTagCaseIndependentHtml", function () {
			const html = "<DIV></DIV>";
			expect(jasmine.JQuery.browserTagCaseIndependentHtml(html)).toBe("<div></div>");
		});

		it("should define jasmine.JQuery.toElement", function () {
			const $div = $("<div/>");
			const div = jasmine.JQuery.toElement($div);
			expect(div instanceof HTMLElement).toBe(true);
			expect(function () {
				jasmine.JQuery.toElement($(".not-an-element"));
			}).toThrowError();
			expect(function () {
				jasmine.JQuery.toElement(1);
			}).toThrowError();
		});

		it("should define jasmine.JQuery.elementToString", function () {
			const $div = $("<div/>");
			expect(jasmine.JQuery.elementToString($div)).toBe("<div></div>");
			expect(jasmine.JQuery.elementToString(1)).toBe("1");
		});

		it("should define jasmine.JQuery.elementToTagString", function () {
			const $div = $("<div class='test'/>");
			expect(jasmine.JQuery.elementToTagString($div)).toBe("<div class=\"test\">");
			expect(jasmine.JQuery.elementToTagString(1)).toBe("1");
		});
	});

	describe("matchers", function () {
		it("should define toHaveClass", function () {
			const div = this.tag("div").addClass("test");
			expect(div).toHaveClass("test");
			expect(div[0]).toHaveClass("test");
			expect(div).not.toHaveClass("invalid");
			expect(div[0]).not.toHaveClass("invalid");
		});

		it("should define toBeVisible", function () {
			const div = this.tag("div").attach();
			expect(div).toBeVisible();
			expect(div[0]).toBeVisible();
			div.hide();
			expect(div).not.toBeVisible();
			expect(div[0]).not.toBeVisible();
		});

		it("should define toBeHidden", function () {
			const div = this.tag("div").attach();
			div.hide();
			expect(div).toBeHidden();
			expect(div[0]).toBeHidden();
			div.show();
			expect(div).not.toBeHidden();

			// don't ask me why this is needed
			div.text("test");
			expect(div[0]).not.toBeHidden();
		});

		it("should define toBeSelected", function () {
			const option1 = this.tag("option");
			const option2 = this.tag("option");
			this.tag("select").append(option1, option2);
			expect(option1).toBeSelected();
			expect(option1[0]).toBeSelected();
			expect(option2).not.toBeSelected();
			expect(option2[0]).not.toBeSelected();
		});

		it("should define toBeChecked", function () {
			const checkbox = this.tag("input").attr({ type: "checkbox" }).prop({ checked: true });
			expect(checkbox).toBeChecked();
			expect(checkbox[0]).toBeChecked();
			checkbox.prop({ checked: false });
			expect(checkbox).not.toBeChecked();
			expect(checkbox[0]).not.toBeChecked();
		});

		it("should define toBeEmpty", function () {
			const div = this.tag("div");
			expect(div).toBeEmpty();
			expect(div[0]).toBeEmpty();
			div.text("test");
			expect(div).not.toBeEmpty();
			expect(div[0]).not.toBeEmpty();
		});

		it("should define toExist", function () {
			const div = this.tag("div");
			const doesntExist = $(".doesnt-exist");
			expect(div).toExist();
			expect(div[0]).toExist();
			expect(doesntExist).not.toExist();
		});

		it("should define toHaveAttr", function () {
			const div = this.tag("div").attr({ test: "this" });
			expect(div).toHaveAttr("test");
			expect(div).toHaveAttr("test", "this");
			expect(div[0]).toHaveAttr("test");
			expect(div[0]).toHaveAttr("test", "this");
			expect(div).not.toHaveAttr("that");
			expect(div).not.toHaveAttr("test", "that");
			expect(div[0]).not.toHaveAttr("that");
			expect(div[0]).not.toHaveAttr("test", "that");
		});

		it("should define toHaveId", function () {
			const div = this.tag("div");
			expect(div).not.toHaveId("test");
			expect(div[0]).not.toHaveId("test");
			div.attr({ id: "test" });
			expect(div).toHaveId("test");
			expect(div[0]).toHaveId("test");
			expect(div).not.toHaveId("invalid");
			expect(div[0]).not.toHaveId("invalid");
		});

		it("should define toHaveHtml", function () {
			const div = this.tag("div").html("<div></div>");
			expect(div).toHaveHtml("<div></div>");
			expect(div[0]).toHaveHtml("<div></div>");
			expect(div).not.toHaveHtml("<span></span>");
			expect(div[0]).not.toHaveHtml("<span></span>");
		});

		it("should define toHaveText", function () {
			const div = this.tag("div").text("test");
			expect(div).toHaveText("test");
			expect(div[0]).toHaveText("test");
			expect(div).not.toHaveText("invalid");
			expect(div[0]).not.toHaveText("invalid");
		});

		it("should define toHaveValue", function () {
			const input = this.tag("input").val("test");
			expect(input).toHaveValue("test");
			expect(input[0]).toHaveValue("test");
			expect(input).not.toHaveValue("invalid");
			expect(input[0]).not.toHaveValue("invalid");
		});

		it("should define toHaveData", function () {
			const div = this.tag("div");
			div[0].dataset.test = "this";
			expect(div).toHaveData("test");
			expect(div).toHaveData("test", "this");

			// The next two tests will fail if you use div.data({test: "this"})
			// because jQuery does not save the data in dataset on the element
			expect(div[0]).toHaveData("test");
			expect(div[0]).toHaveData("test", "this");
			expect(div).not.toHaveData("that");
			expect(div).not.toHaveData("test", "that");
			expect(div[0]).not.toHaveData("that");
			expect(div[0]).not.toHaveData("test", "that");
		});

		it("should define toMatchSelector", function () {
			const div = this.tag("div").addClass("test");
			expect(div).toMatchSelector(".test");
			expect(div[0]).toMatchSelector(".test");
			expect(div).not.toMatchSelector(".invalid");
			expect(div[0]).not.toMatchSelector(".invalid");
		});

		it("should define toContain", function () {
			const divNotIn = this.tag("div").addClass("test");
			const divInner = this.tag("div").addClass("test");
			const div = this.tag("div").append(divInner);
			expect(div).toContain(divInner);
			expect(div).toContain(".test");
			expect(div[0]).toContain(divInner[0]);
			expect(div[0]).toContain(".test");
			expect(div).not.toContain(divNotIn);
			expect(div).not.toContain(".invalid");
			expect(div[0]).not.toContain(divNotIn[0]);
			expect(div[0]).not.toContain(".invalid");
		});

		it("should define toBeDisabled", function () {
			const input = this.tag("input").prop({ disabled: true });
			expect(input).toBeDisabled();
			expect(input[0]).toBeDisabled();
			input.prop({ disabled: false });
			expect(input).not.toBeDisabled();
			expect(input[0]).not.toBeDisabled();
		});

		it("should define toHandle", function () {
			const div = this.tag("div");
			expect(div).not.toHandle("click");

			// don't ask me why they check .data("events");
			div.data({ events: { "click": [function () {}] } });
			expect(div).toHandle("click");
		});

		it("should define toHandleWith", function () {
			const fn = function () {};
			const div = this.tag("div");
			expect(div).not.toHandle("click", fn);

			// don't ask me why they check .data("events");
			div.data({ events: { "click": [fn] } });
			expect(div).toHandle("click", fn);
		});

		zdescribe("failing", function () {
			it("should define toHaveClass", function () {
				const div = this.tag("div").addClass("test");
				expect(div).not.toHaveClass("test");
				expect(div).toHaveClass("invalid");
			});

			it("should define toBeVisible", function () {
				const div = this.tag("div").attach();
				expect(div).not.toBeVisible();
				div.hide();
				expect(div).toBeVisible();
			});

			it("should define toBeHidden", function () {
				const div = this.tag("div").attach();
				div.hide();
				expect(div).not.toBeHidden();
				div.show();
				expect(div).toBeHidden();
			});

			it("should define toBeSelected", function () {
				const option1 = this.tag("option");
				const option2 = this.tag("option");
				this.tag("select").append(option1, option2);
				expect(option1).not.toBeSelected();
				expect(option2).toBeSelected();
			});

			it("should define toBeChecked", function () {
				const checkbox = this.tag("input").attr({ type: "checkbox" }).prop({ checked: true });
				expect(checkbox).not.toBeChecked();
				checkbox.prop({ checked: false });
				expect(checkbox).toBeChecked();
			});

			it("should define toBeEmpty", function () {
				const div = this.tag("div");
				expect(div).not.toBeEmpty();
				div.text("test");
				expect(div).toBeEmpty();
			});

			it("should define toExist", function () {
				const div = this.tag("div");
				const doesntExist = $(".doesnt-exist");
				expect(div).not.toExist();
				expect(doesntExist).toExist();
			});

			it("should define toHaveAttr", function () {
				const div = this.tag("div").attr({ test: "this" });
				expect(div).not.toHaveAttr("test");
				expect(div).not.toHaveAttr("test", "this");
				expect(div).toHaveAttr("that");
				expect(div).toHaveAttr("test", "that");
			});

			it("should define toHaveId", function () {
				const div = this.tag("div").attr({ id: "test" });
				expect(div).not.toHaveId("test");
				expect(div).toHaveId("invalid");
			});

			it("should define toHaveHtml", function () {
				const div = this.tag("div").html("<div></div>");
				expect(div).not.toHaveHtml("<div></div>");
				expect(div).toHaveHtml("<span></span>");
			});

			it("should define toHaveText", function () {
				const div = this.tag("div").text("test");
				expect(div).not.toHaveText("test");
				expect(div).toHaveText("invalid");
			});

			it("should define toHaveValue", function () {
				const input = this.tag("input").val("test");
				expect(input).not.toHaveValue("test");
				expect(input).toHaveValue("invalid");
			});

			it("should define toHaveData", function () {
				const div = this.tag("div").data({ test: "this" });
				expect(div).not.toHaveData("test");
				expect(div).not.toHaveData("test", "this");
				expect(div).toHaveData("that");
				expect(div).toHaveData("test", "that");
			});

			it("should define toMatchSelector", function () {
				const div = this.tag("div").addClass("test");
				expect(div).not.toMatchSelector(".test");
				expect(div).toMatchSelector(".invalid");
			});

			it("should define toContain", function () {
				const divNotIn = this.tag("div").addClass("test");
				const divInner = this.tag("div").addClass("test");
				const div = this.tag("div").append(divInner);
				expect(div).not.toContain(divInner);
				expect(div).toContain(divNotIn);
			});

			it("should define toBeDisabled", function () {
				const input = this.tag("input");
				expect(input).toBeDisabled();
				input.prop({ disabled: true });
				expect(input).not.toBeDisabled();
			});

			it("should define toHandle", function () {
				const div = this.tag("div");
				expect(div).toHandle("click");

				// don't ask me why they check .data("events");
				div.data({ events: { "click": [function () {}] } });
				expect(div).not.toHandle("click");
			});

			it("should define toHandleWith", function () {
				const fn = function () {};
				const div = this.tag("div");
				expect(div).toHandle("click", fn);

				// don't ask me why they check .data("events");
				div.data({ events: { "click": [fn] } });
				expect(div).not.toHandle("click", fn);
			});
		});
	});
});
