/**
 * Copyright 2023-2024 Yuhui. All rights reserved.
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

const { WEB_VITALS_METRICS_NAMES } = require('../../../src/lib/constants');
const mockMetricData = require('../../specHelpers/mockMetricData');

describe('getWebVitalsMetricData helper delegate', function () {
  beforeEach(function () {
    this.data = mockMetricData();
    // delete "fullName" property because it gets set from WEB_VITALS_METRICS_NAMES
    delete this.data.fullName;

    this.helperDelegate = require('../../../src/lib/helpers/getWebVitalsMetricData');
  });

  describe('with invalid arguments', function () {
    it('throws an error when "data" argument is missing', function () {
      expect(() => {
        this.helperDelegate();
      }).toThrowError(Error, 'Web Vitals data not specified');
    });
  });

  describe('with valid arguments', function () {
    it('returns a valid object', function () {
      const result = this.helperDelegate(this.data);

      expect(result).toBeInstanceOf(Object);

      const dataKeys = Object.keys(this.data);
      dataKeys.forEach((key) => {
        expect(result[key]).toEqual(this.data[key]);
      });

      const metricFullName = WEB_VITALS_METRICS_NAMES.get(this.data.name)
      expect(result.fullName).toEqual(metricFullName);
    });
  });
});
