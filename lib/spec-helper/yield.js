afterEach(function (done) {
	// yield to ui thread to make screen update more frequently
	if (jasmine.useRealClock) {
		jasmine.useRealClock();
	}
	setTimeout(done, 0);
});
