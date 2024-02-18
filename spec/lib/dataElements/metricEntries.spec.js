/**
 * Copyright 2021-2024 Yuhui. All rights reserved.
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

const mockBaseEvent = require('../../specHelpers/mockBaseEvent');
const mockTurbine = require('../../specHelpers/mockTurbine');

describe('metricEntries data element delegate', function() {
  beforeEach(function() {
    this.event = mockBaseEvent(['metricEntries']);
    this.settings = {}; // this data element does not have any custom settings
    this.turbine = mockTurbine();

    this.dataElementDelegate = proxyquire(
      '../../../src/lib/dataElements/metricEntries',
      {
        '../controllers/turbine': this.turbine,
      }
    );
  });

  describe('with invalid "event" argument', function() {
    it('logs an error and returns nothing when "event" argument is missing', function() {
      const result = this.dataElementDelegate(this.settings);

      expect(result).toBeUndefined();

      const { warn: logWarn } = this.turbine.logger;
      expect(logWarn).toHaveBeenCalledWith(
        '"event" argument not specified. Use _satellite.getVar("data element name", event);'
      );
    });

    it('logs an error and returns nothing when "webvitals" property is missing', function() {
      delete this.event.webvitals;

      const result = this.dataElementDelegate(this.settings, this.event);

      expect(result).toBeUndefined();

      const { warn: logWarn } = this.turbine.logger;
      expect(logWarn).toHaveBeenCalledWith('Web Vitals not available.');
    });

    it('logs an error and returns nothing when "entries" property is missing', function() {
      delete this.event.webvitals.entries;

      const result = this.dataElementDelegate(this.settings, this.event);

      expect(result).toBeUndefined();

      const { warn: logWarn } = this.turbine.logger;
      expect(logWarn).toHaveBeenCalledWith('Metric entries not available.');
    });
  });

  describe('with valid "event" argument', function() {
    it('is an array of defined items', function() {
      const result = this.dataElementDelegate(this.settings, this.event);

      const resultEvaluation = result.every((item) => typeof item !== 'undefined');
      expect(resultEvaluation).toBeTrue();
    });
  });
});
