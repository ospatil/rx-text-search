import {
  find, findAsPromise
}
from '../lib';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const expect = chai.expect;

describe('text-search', function () {

  it('should return an throw observer when called without arguments', function (done) {
    find().subscribe(
      () => {}, //onNext
      (error) => {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.be.equal('You must provide at least one search pattern');
        done();
      }
    );
  });

  it('should consider all types of files when no include pattern provided', function (done) {
    const expectedResults = [{
      file: 'dir1/dir11/dir11-file1.log',
      line: 2,
      term: 'ignorant',
      text: 'By ignorant at on wondered relation.'
    }, {
      file: 'dir1/dir1-file1.txt',
      line: 2,
      term: 'ignorant',
      text: 'By ignorant at on wondered relation.'
    }, {
      file: 'dir1/dir11/dir11-file1.txt',
      line: 8,
      term: 'ignorant',
      text: 'By ignorant at on wondered relation.'
    }, {
      file: 'dir2/dir21/dir21-somefile.text',
      line: 7,
      term: 'ignorant',
      text: 'By ignorant at on wondered relation.'
    }];

    find('ignorant', undefined, {
      cwd: 'test/doc'
    })
    .toArray()
    .subscribe(results => {
      expectedResults.forEach(result => {
        expect(results).to.include(result);
      });
      done();
    });
  });

  it('should filter files by type provided in include pattern string', function (done) {
    const expectedResults = [{
      file: 'dir1/dir11/dir11-file1.log',
      line: 2,
      term: 'ignorant',
      text: 'By ignorant at on wondered relation.'
    }];

    find('ignorant', '**/*.log', {
      cwd: 'test/doc'
    })
    .toArray()
    .subscribe(results => {
      expectedResults.forEach(result => {
        expect(results).to.include(result);
      });
      done();
    });
  });

  it('should filter files by name pattern provided in include pattern array', function (done) {
    const expectedResults = [{
      file: 'dir2/dir21/dir21-somefile.text',
      line: 1,
      term: 'shameless',
      text: 'Do commanded an shameless we disposing do.'
    }, {
      file: 'dir2/some-file.txt',
      line: 1,
      term: 'shameless',
      text: 'Do commanded an shameless we disposing do.'
    }];

    find('shameless', ['**/*some*'], {
      cwd: 'test/doc'
    })
    .toArray()
    .subscribe(results => {
      expectedResults.forEach(result => {
        expect(results).to.include(result);
      });
      done();
    });
  });

  it('should accept search patterns array', function (done) {
    const expectedResults = [{
      file: 'dir2/dir21/dir21-somefile.text',
      line: 1,
      term: 'shameless',
      text: 'Do commanded an shameless we disposing do.' },
    { file: 'dir2/dir21/dir21-somefile.text',
      line: 7,
      term: 'ignorant',
      text: 'By ignorant at on wondered relation.' },
    { file: 'dir2/some-file.txt',
      line: 1,
      term: 'shameless',
      text: 'Do commanded an shameless we disposing do.'
    }];

    find(['shameless', 'ignorant'], ['**/*some*'], {
      cwd: 'test/doc'
    })
    .toArray()
    .subscribe(results => {
      expectedResults.forEach(result => {
        expect(results).to.include(result);
      });
      done();
    });
  });

  it('should accept regex search patterns', function (done) {
    const expectedResults = [{
      file: 'dir1/dir1-file1.log',
      line: 3,
      term: 'elinor.$',
      text: 'Sussex on at really ladies in as elinor.'
    }];

    find(['elinor.$'], null, {
      cwd: 'test/doc'
    })
    .toArray()
    .subscribe(results => {
      expectedResults.forEach(result => {
        expect(results).to.include(result);
      });
      done();
    });
  });

  it('should accept null or undefined options object', function (done) {
    find(['qwrty'], '*.html', null)
    .toArray()
    .subscribe(results => {
      expect(results).to.be.empty;
      done();
    });
  });

  it('should use process.cwd as baseDir if it is not provided by the user', function (done) {
    const expectedResults = [{
      file: 'LICENSE',
      line: 17,
      term: 'NONINFRINGEMENT',
      text: 'FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE'
    }];

    find('NONINFRINGEMENT', 'LICENSE', null)
      .toArray()
      .subscribe(results => {
        expectedResults.forEach(result => {
          expect(results).to.include(result);
        });
        done();
      });
  });

  // The following two tests need a file named non-readable in test/doc directory without read permission
  /*it('should return an throw observer in case of any error', function (done) {
    find('qwerty', 'non-readable', {cwd: 'test/doc'}).subscribe(
      () => {}, //onNext
      error => {
        expect(error.message).to.have.string('EACCES: permission denied');
        done();
      }
    );
  });

  it('should return a promise that is rejected due any error', function () {
    return expect(findAsPromise('qwerty', 'non-readable', {cwd: 'test/doc'})).to.be.eventually.rejected;
  });*/

  it('should return a promise that is rejected due to invalid input', function () {
    return expect(findAsPromise()).to.be.eventually.rejected;
  });

  it('should return a promise that is resolved with results array', function () {
    //the results array same as test case 2
    return expect(findAsPromise('ignorant', undefined, {cwd: 'test/doc'})).to.be.eventually.have.length(4);
  });
});
