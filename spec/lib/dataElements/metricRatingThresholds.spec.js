/**
 * Copyright 2023 Yuhui. All rights reserved.
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

const mockTurbine = require('../../specHelpers/mockTurbine');
const mockWebVitals = require('../../specHelpers/mockWebVitals');

describe('metricRatingThresholds data element delegate', () => {
  const webVitals = mockWebVitals();

  beforeAll(() => {
    global.turbine = mockTurbine;
    this.dataElementDelegate = proxyquire('../../../src/lib/dataElements/metricRatingThresholds', {
      '../helpers/webVitals': webVitals,
    });
  });

  beforeEach(() => {
    this.settings = {
      metric: 'Cumulative Layout Shift',
    };
  });

  afterAll(() => {
    delete global.turbine;
  });

  describe('with invalid "settings" argument', () => {
    it(
      'should be undefined when "metric" property is missing',
      () => {
        delete this.settings.metric;
        const result = this.dataElementDelegate(this.settings);
        expect(result).toBeUndefined();

        const logError = turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('Web Vitals metric not specified.');
      }
    );
  });

  describe('with valid "settings" argument', () => {
    it(
      'calls the `getMetricRatingThresholds()` function from the webVitals helper module once only',
      () => {
        this.dataElementDelegate(this.settings);

        const { getMetricRatingThresholds } = webVitals;
        expect(getMetricRatingThresholds).toHaveBeenCalledOnceWith(this.settings.metric);
      }
    );
  });

});
