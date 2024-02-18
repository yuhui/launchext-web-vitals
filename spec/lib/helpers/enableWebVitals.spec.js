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

const { WEB_VITALS_METRICS } = require('../../../src/lib/constants');
const mockTurbine = require('../../specHelpers/mockTurbine');
const mockWebVitals = require('../../specHelpers/mockWebVitals');

describe('enableWebVitals helper delegate', function() {
  beforeEach(function() {
    this.error = new Error('die');
    this.webVitalsLocation = 'bundle';
    this.loadWebVitals = jasmine.createSpy().and.resolveTo(this.webVitalsLocation);
    this.turbine = mockTurbine();
    this.webVitals = mockWebVitals();
  });

  describe('with broken loadWebVitals()', function() {
    beforeEach(function() {
      this.loadWebVitalsWithErrors = jasmine.createSpy().and.rejectWith(this.error);

      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/enableWebVitals',
        {
          './loadWebVitals': this.loadWebVitalsWithErrors,
          '../controllers/turbine': this.turbine,
          '../controllers/webVitals': this.webVitals,
        }
      );
    });

    it('logs an error', async function() {
      await this.helperDelegate();

      const { error: logError } = this.turbine.logger;
      expect(logError).toHaveBeenCalledWith(this.error.message);
    });
  });

  describe('with broken webVitals', function() {
    beforeEach(function() {
      this.webVitalsWithErrors = mockWebVitals(true);

      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/enableWebVitals',
        {
          './loadWebVitals': this.loadWebVitals,
          '../controllers/turbine': this.turbine,
          '../controllers/webVitals': this.webVitalsWithErrors,
        }
      );
    });

    it('logs an error', async function() {
      await this.helperDelegate();

      let metricsWithErrors = [];
      for (const metric of WEB_VITALS_METRICS) {
        metricsWithErrors.push(metric);
      }

      const { error: logError } = this.turbine.logger;
      expect(logError).toHaveBeenCalledWith(
        `Unable to get reports for Web Vitals metrics "${metricsWithErrors.join('", "')}".`
      );
    });
  });

  describe('with everything working properly', function() {
    beforeEach(function() {
      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/enableWebVitals',
        {
          './loadWebVitals': this.loadWebVitals,
          '../controllers/turbine': this.turbine,
          '../controllers/webVitals': this.webVitals,
        }
      );
    });

    it('executes to completion', async function() {
      await this.helperDelegate();

      expect(this.loadWebVitals).toHaveBeenCalledTimes(1);

      let options;
      const { extensionSettings: { durationThresholdINP }, reportAllChanges } = this.turbine;
      const { listen: listenForMetric } = this.webVitals.metrics;
      for (const metric of WEB_VITALS_METRICS) {
        options = {
          reportAllChanges: reportAllChanges[metric],
        };
        if (metric === 'INP') {
          options.durationThreshold = durationThresholdINP;
        }
        expect(listenForMetric).toHaveBeenCalledWith(metric, jasmine.objectContaining(options));
      }

      const { debug: logDebug } = this.turbine.logger;
      expect(logDebug).toHaveBeenCalledWith(
        `Web Vitals was loaded successfully from ${this.webVitalsLocation}.`
      );
    });
  });
});
