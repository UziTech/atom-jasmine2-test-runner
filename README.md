# Atom Jasmine 2.x Test Runner

By default, Atom runs your tests with Jasmine 1.3 (for more information on testing packages in Atom, please [see the Atom Flight Manual](http://flight-manual.atom.io/hacking-atom/sections/writing-specs/#running-specs)). Atom allows you to specify a custom test runner using the `atomTestRunner` field in your `package.json`, but implementing a custom test runner is not straightforward. This module allows you to transition your specs to Jasmine 2.x with minimal fuss.

![screenshot](./screenshots/atom-jasmine2-test-runner.gif)

## Installation

```
$ apm install [--save-dev] atom-jasmine2-test-runner
```

## Usage

### Transition from Jasmine v1.3

There is legacy support for transitioning to Jasmine 2.x from 1.3.

By default any specs with a file name matching `*-spec-v1.(js|coffee)` will be ran by the default Atom test runner after any new tests are ran.

### Default Test Runner

If you want to use all the default options, simply pass the module name as the `atomTestRunner` value in your `package.json`:

```javascript
{
  "name": "my-package",
  // ...
  "atomTestRunner": "atom-jasmine2-test-runner"
}
```

Note that your `package.json` may be cached by Atom's compile cache when running tests with Atom's GUI test runner, so if adding or changing that field doesn't seem to work, try quitting and restarting Atom.

### Programmatic Usage

If you'd like to perform more customization of your testing environment, you can create a custom runner while still utilizing atom-jasmine2-test-runner for most of the heavy lifting. First, set `atomTestRunner` to a _relative_ path to a file:

```javascript
{
  "name": "my-package",
  // ...
  "atomTestRunner": "./spec/custom-runner"
}
```

Then export a test runner created via the atom-jasmine2-test-runner from `test/custom-runner.js`:

```javascript
const { createRunner}  = require('atom-jasmine2-test-runner');

// optional options to customize the runner
const extraOptions = {
  suffix: "-spec",
  legacySuffix: "-spec-v1"
};

const optionalConfigurationFunction = function(jasmine) {
  // If provided, atom-jasmine2-test-runner will pass the jasmine instance
  // to this function, so you can do whatever you'd like to it.
}

module.exports = createRunner(extraOptions, optionalConfigurationFunction)
```

#### API

**`createRunner([options,] [callback])`**

Returns a test runner created with the given `options` and `callback`. Both parameters are optional. The returned value can be exported from your `atomTestRunner` script for Atom to consume.

- `options` - An object specifying customized options:

  - `reporter [default: the default reporter]` - Which reporter to use on the terminal
  - `suffix [default: "-spec"]` - File extension that indicates that the file contains tests
  - `legacySuffix [default: "-spec-v1"]` - File extension that indicates that the file contains Jasmine v1.x tests
  - `showColors [default: true]` - Whether or not to colorize output on the terminal
  - `htmlTitle [default: '']` - The string to use for the window title in the HTML reporter
  - `showEditor [default: false]` - Whether or not to add a "Show Editor" tab to minimize the specs so you can see the editor behind it
  - `timeReporter [default: false]` - Add a reporter that logs the time for each spec/suite. [TimeReporter](https://github.com/atom/atom/blob/master/spec/time-reporter.coffee)

### Writing Tests

[Jasmine 2.5 documentation](https://jasmine.github.io/2.5/introduction)

```javascript
describe('Testing', function () {
  it('works', function () {
    expect(answerToLifeUniverseAndEverything).toBe(42);
  });
});
```
