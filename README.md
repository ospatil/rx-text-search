# text-search
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]
> Node module to carry out regex searches on files and obtain results as either RxJS observable or promise

## Features
[text-search](https://github.com/ospatil/text-search) carries out regex searches for text in files and returns matched results.
- Accepts regex search patterns for text search in files.
- Searches files under user provided directory(s) or process directory (process.cwd()).
- Returns a promise that eventually resolves to an array. The array contains match objects each having following attributes -
  - line - line number(s) that the matched result was found on.
  - term - the search term.
  - text - the entire line(s) that the matched result was found in.

## Getting Started
Install with [NPM](https://www.npmjs.com) - `npm install --save text-search`

## Usage
```js
var stringSearcher = require('string-search');

stringSearcher.find('This is the string to search text in', 'string')
  .then(function(resultArr) {
    //resultArr => [ {line: 1, term: 'string', text: 'This is the string to search text in'} ]
  });
```

## API
### stringSearcher.find(targetString, regex)

Name         | Type           | Argument     | Description
-------------|----------------|--------------|------------
targetString | `string`       | `<required>` | target string to be searched. Can be multi-line(can contain line breaks).
regex        | `string`       | `<required>` | a string in regular expression format to search.

Returns **promise** that resolves to an array of objects containing following attributes -

Name | Type      | Description
-----|-----------| ------------
line | `integer` | line number that the matched result was found on.
term | `string`  | The search term
text | `string`  | the entire line(s) that the matched result was found in.

The **promise** is rejected in case of missing or invalid arguments.

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## License
Copyright © 2015 [Omkar Patil](https://github.com/ospatil)

Licensed under the MIT license.

[npm-image]: https://badge.fury.io/js/text-search.svg
[npm-url]: https://npmjs.com/package/text-search
[travis-image]: https://travis-ci.org/ospatil/text-search.svg?branch=master
[travis-url]: https://travis-ci.org/ospatil/text-search
[daviddm-image]: https://david-dm.org/ospatil/text-search.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ospatil/text-search
[coveralls-image]: https://img.shields.io/coveralls/ospatil/text-search.svg
[coveralls-url]: https://coveralls.io/github/ospatil/text-search?branch=master
