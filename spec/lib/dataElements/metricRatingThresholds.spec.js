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

const proxyquire = require('proxyquire').noCallThru();

const mockTurbine = require('../../specHelpers/mockTurbine');
const mockWebVitals = require('../../specHelpers/mockWebVitals');

describe('metricRatingThresholds data element delegate', function() {
  beforeEach(function() {
    this.settings = {
      metric: 'CLS',
    };
    this.turbine = mockTurbine();
    this.webVitals = mockWebVitals();
  });

  describe('with invalid "settings" argument', function() {
    beforeEach(function() {
      this.dataElementDelegate = proxyquire(
        '../../../src/lib/dataElements/metricRatingThresholds',
        {
          '../controllers/turbine': this.turbine,
          '../controllers/webVitals': this.webVitals,
        }
      );
    });

    it('logs an error and returns nothing when "metric" property is missing', function() {
      delete this.settings.metric;

      const result = this.dataElementDelegate(this.settings);

      expect(result).toBeUndefined();

      const { error: logError } = this.turbine.logger;
      expect(logError).toHaveBeenCalled();
    });

    it('logs an error and returns nothing when "metric" is not a Web Vitals metric', function() {
      this.settings.metric = 'foo';

      const result = this.dataElementDelegate(this.settings);

      expect(result).toBeUndefined();

      const { error: logError } = this.turbine.logger;
      expect(logError).toHaveBeenCalled();
    });
  });

  describe('with valid "settings" argument', function() {
    describe('with broken webVitals', function() {
      beforeEach(function() {
        this.webVitalsWithErrors = mockWebVitals(true);

        this.dataElementDelegate = proxyquire(
          '../../../src/lib/dataElements/metricRatingThresholds',
          {
            '../controllers/turbine': this.turbine,
            '../controllers/webVitals': this.webVitalsWithErrors,
          }
        );
      });

      it('logs an error and returns nothing', function() {
        const result = this.dataElementDelegate(this.settings);

        expect(result).toBeUndefined();
  
        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalled();
      });
    });

    describe('with everything working properly', function() {
      beforeEach(function() {
        this.dataElementDelegate = proxyquire(
          '../../../src/lib/dataElements/metricRatingThresholds',
          {
            '../controllers/turbine': this.turbine,
            '../controllers/webVitals': this.webVitals,
          }
        );
      });

      it('executes to completion', function() {
        this.dataElementDelegate(this.settings);

        const { get: getMetricRatingThresholds } = this.webVitals.ratingThresholds;
        expect(getMetricRatingThresholds).toHaveBeenCalledOnceWith(this.settings.metric);
      });
    });
  });
});
