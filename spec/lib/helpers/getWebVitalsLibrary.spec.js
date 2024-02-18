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

const {
  WEB_VITALS_CDN_URL,
  WEB_VITALS_VENDOR_SCRIPT_FILENAME,
} = require('../../../src/lib/constants');
const mockTurbine = require('../../specHelpers/mockTurbine');

describe('getWebVitalsLibrary helper delegate', function() {
  describe('with invalid extension settings', function() {
    it('throws an error when "webVitalsLibraryType" setting is invalid', function() {
      this.extensionSettings = {
        webVitalsLibraryType: 'foo',
        webVitalsLibraryUrl: 'default',
      }
      this.turbine = mockTurbine(this.extensionSettings);

      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/getWebVitalsLibrary',
        {
          '../controllers/turbine': this.turbine,
        }
      );

      expect(() => {
        this.helperDelegate();
      }).toThrowError(
        Error,
        `Unknown Web Vitals library type provided: "${this.extensionSettings.webVitalsLibraryType}"`
      );
    });

    it(
      'throws an error when "webVitalsLibraryUrl" setting is "default" for "url" type',
      function() {
        this.extensionSettings = {
          webVitalsLibraryType: 'url',
          webVitalsLibraryUrl: 'default',
        }
        this.turbine = mockTurbine(this.extensionSettings);

        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/getWebVitalsLibrary',
          {
            '../controllers/turbine': this.turbine,
          }
        );

        expect(() => {
          this.helperDelegate();
        }).toThrowError(Error, 'Web Vitals library URL is not set');
      }
    );
  });

  describe('with valid extension settings', function() {
    const extensionSettingsAndExpectedScriptUrl = [
      [undefined, undefined, WEB_VITALS_CDN_URL],
      ['bundle', 'default', 'refer to turbine.getHostedLibFileUrl()'],
      ['cdn', 'default', WEB_VITALS_CDN_URL],
      ['url', 'baz', 'baz'],
    ];
    extensionSettingsAndExpectedScriptUrl.forEach(([ type, url, expectedUrl ]) => {
      it(`returns a valid array for type "${type}"`, function() {
        this.extensionSettings = {
          webVitalsLibraryType: type,
          webVitalsLibraryUrl: url,
        }
        this.turbine = mockTurbine(this.extensionSettings);

        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/getWebVitalsLibrary',
          {
            '../controllers/turbine': this.turbine,
          }
        );

        const [ resultUrl, resultLocation ] = this.helperDelegate();

        if (type === 'bundle') {
          const { getHostedLibFileUrl } = this.turbine;
          expect(getHostedLibFileUrl).toHaveBeenCalledOnceWith(WEB_VITALS_VENDOR_SCRIPT_FILENAME);
          expect(resultUrl).toEqual(getHostedLibFileUrl(WEB_VITALS_VENDOR_SCRIPT_FILENAME));
          expect(resultLocation).toEqual('this extension');
        } else {
          expect(resultUrl).toEqual(expectedUrl);
          expect(resultLocation).toEqual(`"${expectedUrl}"`);
        }
      });
    });
  });
});
