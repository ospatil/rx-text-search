import Rx from 'rx';
import globby from 'globby';
import arrify from 'arrify';
import { readFile } from 'fs';
import * as stringSearcher from 'string-search';
import { join } from 'path';
import { Promise } from 'bluebird';

export function find(searchPatterns = [], includePatterns = '**', options = {}) {
  const searchPatternsArr = arrify(searchPatterns);
  const includePatternsArr = arrify(includePatterns || ['**']); //if includePatterns is null or undefined, consider all files
  const opts = options || {}; //needed if user sends in a null
  opts.nodir = true; //needed by node-glob to omit dir match paths
  if (searchPatternsArr.length < 1) {
    //return error observable that sends down an error.
    return Rx.Observable.throw(new TypeError('You must provide at least one search pattern'));
  }

  const filePathsObs = filePathsStream(includePatternsArr, options);
  const filePathObs = filePathStream(filePathsObs);
  const fileContentObs = fileContentStream(filePathObs, opts.cwd);
  const contentAndSearchStringObs = contentAndSearchStringStream(fileContentObs, searchPatternsArr);
  const resultsObs = resultsStream(contentAndSearchStringObs);
  const nonEmptyResultsObs = nonEmptyResultsStream(resultsObs);
  const flatResultObs = flatResultStream(nonEmptyResultsObs);

  return flatResultObs;
}

export function findAsPromise(searchPatterns, includePatterns, options) {
  return new Promise((resolve, reject) => {
    find(searchPatterns, includePatterns, options)
      .toArray()
      .subscribe(
        results => resolve(results),
        err => reject(err)
      );
  });
}

//input - include patterns array, exclude patterns array, and optional base directory
//output - string array of paths observable
function filePathsStream(includePatternsArr, options) {
  const dirPromise = globby(includePatternsArr, options);
  return Rx.Observable.fromPromise(dirPromise);
}

//input - String array of paths observable, output - string paths observable
function filePathStream(filePathsObs) {
  return filePathsObs.flatMap(arr => Rx.Observable.from(arr));
}

//input - string paths observable, output - file content observable
function fileContentStream(filePathObs, baseDir) {
  return filePathObs.flatMap(filePath => {
    const readFileObs = Rx.Observable.fromNodeCallback(readFile);
    let actualFilePath = baseDir ? join(baseDir, filePath) : join(process.cwd(), filePath);
    return readFileObs(actualFilePath, 'utf-8')
      .map(content => {
        return {file: filePath, content: content};
      });
  });
}

//input - file content observable, query string array, output - file content and query string observable
function contentAndSearchStringStream(fileContentObs, searchTerms) {
  return fileContentObs.flatMap(fileObj => {
    return Rx.Observable.for(searchTerms, searchTerm => {
      return Rx.Observable.return({file: fileObj.file, content: fileObj.content, term: searchTerm});
    });
  });
}

//input - content and query string observable, output - results object observable (containing matches and file attributes)
//that could contain empty arrays
function resultsStream(contentAndSearchStringObs) {
  return contentAndSearchStringObs.flatMap(obj => {
    const resultsPromisesObs = Rx.Observable.fromPromise(stringSearcher.find(obj.content, obj.term));
    return resultsPromisesObs.zip(resultsArr => ({matches: resultsArr, file: obj.file}));
  });
}

//input - results array observable that could contain empty arrays, output - results array observable without empty arrays
function nonEmptyResultsStream(resultsObs) {
  return resultsObs.filter(resultObj => resultObj.matches.length > 0);
}

//input - cleaned up results array observable, output - individual flat object results observable
function flatResultStream(nonEmptyResultsObs) {
  return nonEmptyResultsObs.flatMap(obj => {
    return Rx.Observable.for(obj.matches, match => {
      return Rx.Observable.return({file: obj.file, line: match.line, term: match.term, text: match.text});
    });
  });
}
