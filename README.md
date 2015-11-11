# rx-text-search
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]
> Node module for recursive directory search for text in files and obtain results as either RxJS observable or promise

## Features
[rx-text-search](https://github.com/ospatil/rx-text-search) carries out regex searches for text in files and returns matched results.
- Accepts regex search patterns for text search in files.
- Searches files under user provided directory(s) or process directory (process.cwd()).
- Returns results either as a RxJS observable or promise;

## Getting Started
Install with [NPM](https://www.npmjs.com) - `npm install --save rx-text-search`

## Usage
### Getting RxJS observable back
```js
var TextSearch = require('rx-text-search');

// Find .txt files containing "sometext" in test/doc and all its sub-directories
TextSearch.find('sometext', '**/*.txt', {cwd: 'test/doc'})
  .subscribe(
    function (result) {
      // do something with result
    },
    function (err) {
      // handle error
    }
  );
```
### Getting promise back
```js
var TextSearch = require('rx-text-search');

// Find .txt files containing "sometext" in test/doc and all its sub-directories
TextSearch.findAsPromise('sometext', '**/*.txt', {cwd: 'test/doc'})
  .then(function (result) {
    // do something with result
  })
  .catch(function (err) {
    // handle error
  });
```

## API
### TextSearch.find(searchTextPattern, filesPattern, options)

Name              | Type             | Argument     | Description
------------------|------------------|--------------|------------
searchTextPattern | `string`/`array` | `<required>` | Text to be searched. Could be literal or **regex** pattern. Provide multiple in form of an array of strings.
filesPattern      | `string`/`array` |              | Files to be considered for search. String in **glob** format. Provide multiple in form of an array of strings. Pass `null` or `undefined` in case you don't want to provide it but need to provide options object. It defaults to '\**' (all files) in such case.
options           | `object`         |              | It uses [node-glob](https://github.com/isaacs/node-glob) underneath and supports its [options](https://github.com/isaacs/node-glob#options). One of the post important options is **cwd**. If provided, the relative file patterns are interpreted relative to it. You might want to use it most of the times.

Returns a RxJS observable that returns result object in following format -

Name | Type      | Description
-----|-----------| ------------
file | `string`  | file name
line | `integer` | line number that the matched result was found on.
term | `string`  | The search term
text | `string`  | the entire line(s) that the matched result was found in.

The returned observable emits an error in case of any exception (like invalid arguments or exception while reading file).

### TextSearch.findAsPromise(searchTextPattern, filesPattern, options)
The input is same as above.

Returns a promise that is resolved with array of result objects with structure mentioned above.
The returned promise is rejected in case any exception (like invalid arguments or exception while reading file).

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## License
Copyright © 2015 [Omkar Patil](https://github.com/ospatil)

Licensed under the MIT license.

[npm-image]: https://badge.fury.io/js/rx-text-search.svg
[npm-url]: https://npmjs.com/package/rx-text-search
[travis-image]: https://travis-ci.org/ospatil/rx-text-search.svg?branch=master
[travis-url]: https://travis-ci.org/ospatil/rx-text-search
[daviddm-image]: https://david-dm.org/ospatil/rx-text-search.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ospatil/rx-text-search
[coveralls-image]: https://img.shields.io/coveralls/ospatil/rx-text-search.svg
[coveralls-url]: https://coveralls.io/github/ospatil/rx-text-search?branch=master
