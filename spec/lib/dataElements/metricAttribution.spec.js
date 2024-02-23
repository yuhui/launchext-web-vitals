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
const mockController = require('../../specHelpers/mockController');
const mockTurbine = require('../../specHelpers/mockTurbine');

describe('metricAttribution data element delegate', function () {
  beforeEach(function () {
    this.metricData = 'attribution';
    this.settings = {
      metricAttributionItem: 'loadState',
    };

    this.event = mockBaseEvent();
    this.turbine = mockTurbine();
    this.controller = mockController(this.metricData, this.event.webvitals);
  });

  describe('with invalid "settings" argument', function () {
    beforeEach(function () {
      this.dataElementDelegate = proxyquire(
        '../../../src/lib/dataElements/metricAttribution',
        {
          '../controller': this.controller,
          '../controllers/turbine': this.turbine,
        }
      );
    });

    it('logs an error and returns nothing when "settings" argument is missing', function () {
      const result = this.dataElementDelegate(undefined, this.event);

      expect(result).toBeUndefined();

      const { error: logError } = this.turbine.logger;
      expect(logError).toHaveBeenCalledWith('No metric attribution item provided.');
    });

    it(
      'logs an error and returns nothing when "metricAttributionItem" property is missing',
      function () {
        delete this.settings.metricAttributionItem;

        const result = this.dataElementDelegate(this.settings, this.event);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalledWith('No metric attribution item provided.');
      }
    );
  });

  describe('with invalid "event" argument', function () {
    describe('when "attribution" property is missing', function () {
      beforeEach(function () {
        delete this.event.webvitals[this.metricData];

        this.controllerWithErrors = mockController(this.metricData, this.event.webvitals, true);

        this.dataElementDelegate = proxyquire(
          '../../../src/lib/dataElements/metricAttribution',
          {
            '../controller': this.controllerWithErrors,
            '../controllers/turbine': this.turbine,
          }
        );
      });

      it('logs a warning and returns nothing', function () {
        const result = this.dataElementDelegate(this.settings, this.event);

        expect(result).toBeUndefined();

        const { warn: logWarn } = this.turbine.logger;
        expect(logWarn).toHaveBeenCalled();
      });
    });

    describe('when "metricAttributionItem" property is missing in "attribution"', function () {
      beforeEach(function () {
        delete this.event.webvitals[this.metricData][this.settings.metricAttributionItem];

        this.controllerWithErrors = mockController(this.metricData, this.event.webvitals);

        this.dataElementDelegate = proxyquire(
          '../../../src/lib/dataElements/metricAttribution',
          {
            '../controller': this.controllerWithErrors,
            '../controllers/turbine': this.turbine,
          }
        );
      });

      it('logs a warning and returns nothing', function () {
        const result = this.dataElementDelegate(this.settings, this.event);

        expect(result).toBeUndefined();

        const { warn: logWarn } = this.turbine.logger;
        expect(logWarn).toHaveBeenCalledWith(
          `Metric attribution item "${this.settings.metricAttributionItem}" not available.`
        );
      });
    });
  });

  describe('with valid "settings" and "event" arguments', function () {
    beforeEach(function () {
      this.dataElementDelegate = proxyquire(
        '../../../src/lib/dataElements/metricAttribution',
        {
          '../controller': this.controller,
          '../controllers/turbine': this.turbine,
        }
      );
    });

    it('is defined', function () {
      const result = this.dataElementDelegate(this.settings, this.event);
      expect(result).toBeDefined();
    });
  });
});
