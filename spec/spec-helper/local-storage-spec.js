/* globals mockLocalStorage, unmockLocalStorage */

describe("local-storage", function () {
	beforeEach(function () {
		this.itemName = "jasmine_2_mockLocalStorage_test";
		mockLocalStorage();
	});
	it("should define mockLocalStorage", function () {
		expect(mockLocalStorage).toEqual(jasmine.any(Function));
	});

	it("should define unmockLocalStorage", function () {
		expect(unmockLocalStorage).toEqual(jasmine.any(Function));
	});

	it("should not affect localStorage", function () {
		localStorage.setItem(this.itemName, 1);
		expect(localStorage[this.itemName]).toBeUndefined();
	});

	it("should spy on setItem", function () {
		expect(jasmine.isSpy(localStorage.setItem)).toBe(true);
	});

	it("should spy on getItem", function () {
		expect(jasmine.isSpy(localStorage.getItem)).toBe(true);
	});

	it("should spy on removeItem", function () {
		expect(jasmine.isSpy(localStorage.removeItem)).toBe(true);
	});

	it("should spy on clear", function () {
		expect(jasmine.isSpy(localStorage.clear)).toBe(true);
	});

	it("should spy on key", function () {
		expect(jasmine.isSpy(localStorage.key)).toBe(true);
	});

	it("should store and get an item as string", function () {
		localStorage.setItem(this.itemName, 1);
		expect(localStorage.getItem(this.itemName)).toBe("1");
	});

	it("should remove an item", function () {
		localStorage.setItem(this.itemName, 1);
		localStorage.removeItem(this.itemName);
		expect(localStorage.getItem(this.itemName)).toBeNull();
	});

	it("should clear item", function () {
		localStorage.setItem(this.itemName, 1);
		localStorage.clear();
		expect(localStorage.getItem(this.itemName)).toBeNull();
	});

	it("should get item by key", function () {
		localStorage.setItem(this.itemName, 1);
		expect(localStorage.key(0)).toBe(this.itemName);
	});

	it("should unmock", function () {
		unmockLocalStorage();
		localStorage.setItem(this.itemName, 1);
		expect(localStorage[this.itemName]).toBe("1");
		localStorage.removeItem(this.itemName);
		expect(localStorage[this.itemName]).toBeUndefined();
	});
});
