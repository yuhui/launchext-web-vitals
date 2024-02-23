/**
 * Copyright 2024 Yuhui. All rights reserved.
 *
 * Licensed under the GNU General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const proxyquire = require('proxyquire').noCallThru();

describe('loadWebVitals helper delegate', function () {
  beforeEach(function () {
    this.error = new Error('die');
    this.webVitalsUrl = 'http://www.foo.com/bar';
    this.webVitalsLocation = 'foo';

    this.loadScript = jasmine.createSpy().and.resolveTo(true);
    this.validateWebVitals = jasmine.createSpy().and.resolveTo(true);
    this.getWebVitalsLibrary = jasmine.createSpy().and.returnValue([
      this.webVitalsUrl,
      this.webVitalsLocation,
    ]);
  });

  describe('with broken loadScript', function () {
    beforeEach(function () {
      this.loadScriptWithError = jasmine.createSpy().and.rejectWith('die'),

      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/loadWebVitals',
        {
          '@adobe/reactor-load-script': this.loadScriptWithError,
          './getWebVitalsLibrary': this.getWebVitalsLibrary,
          './validateWebVitals': this.validateWebVitals,
        }
      );
    });

    it('throws an error', async function () {
      await expectAsync(
        this.helperDelegate()
      ).toBeRejectedWithError(Error, `Failed to load Web Vitals from ${this.webVitalsLocation}.`);
    });
  });

  describe('with everything working properly', function () {
    beforeEach(function () {
      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/loadWebVitals',
        {
          '@adobe/reactor-load-script': this.loadScript,
          './getWebVitalsLibrary': this.getWebVitalsLibrary,
          './validateWebVitals': this.validateWebVitals,
        }
      );
    });

    it('returns the Web Vitals script location', async function () {
      const result = await this.helperDelegate();

      expect(this.getWebVitalsLibrary).toHaveBeenCalledTimes(1);

      expect(this.loadScript).toHaveBeenCalledOnceWith(this.webVitalsUrl);

      expect(result).toEqual(this.webVitalsLocation);
    });
  });
});
