/**
 * Copyright 2022-2024 Yuhui. All rights reserved.
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

describe('metricAttribution data element delegate', function() {
  beforeEach(function() {
    this.event = mockBaseEvent();
    this.settings = {
      metricAttributionItem: 'loadState',
    };
    this.turbine = mockTurbine();

    this.dataElementDelegate = proxyquire(
      '../../../src/lib/dataElements/metricAttribution',
      {
        '../controllers/turbine': this.turbine,
      }
    );
  });

  describe('with invalid "settings" argument', function() {
    it('logs an error and returns nothing when "settings" argument is missing', function() {
      const result = this.dataElementDelegate(undefined, this.event);

      expect(result).toBeUndefined();

      const { error: logError } = this.turbine.logger;
      expect(logError).toHaveBeenCalledWith('No metric attribution item provided.');
    });

    it(
      'logs an error and returns nothing when "metricAttributionItem" property is missing',
      function() {
        delete this.settings.metricAttributionItem;

        const result = this.dataElementDelegate(this.settings, this.event);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalledWith('No metric attribution item provided.');
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

    it(
      'logs an error and returns nothing when "attribution" property is missing in "webvitals"',
      function() {
        delete this.event.webvitals.attribution;
        const result = this.dataElementDelegate(this.settings, this.event);

        expect(result).toBeUndefined();

        const { warn: logWarn } = this.turbine.logger;
        expect(logWarn).toHaveBeenCalledWith('Metric attribution not available.');
      }
    );

    it(
      'logs an error and returns nothing when "metricAttributionItem" property is missing in "attribution"',
      function() {
        delete this.event.webvitals.attribution[this.settings.metricAttributionItem];
        const result = this.dataElementDelegate(this.settings, this.event);

        expect(result).toBeUndefined();

        const { warn: logWarn } = this.turbine.logger;
        expect(logWarn).toHaveBeenCalledWith(
          `Metric attribution item "${this.settings.metricAttributionItem}" not available.`
        );
      }
    );
  });

  describe('with valid "settings" and "event" arguments', function() {
    it('is defined', function() {
      const result = this.dataElementDelegate(this.settings, this.event);
      expect(result).toBeDefined();
    });
  });
});
