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

const NAVIGATION_TYPES = new Set([
  'navigate',
  'reload',
  'back-forward',
  'back-forward-cache',
  'prerender',
]);

describe('metricNavigationType data element delegate', function () {
  beforeEach(function () {
    this.metricData = 'navigationType';
    this.settings = {}; // this data element does not have any custom settings

    this.event = mockBaseEvent();
    this.turbine = mockTurbine();
    this.controller = mockController(this.metricData, this.event.webvitals);
  });

  describe('with invalid "event" argument', function () {
    describe('when "navigationType" property is missing', function () {
      beforeEach(function () {
        delete this.event.webvitals[this.metricData];

        this.controllerWithErrors = mockController(this.metricData, this.event.webvitals, true);

        this.dataElementDelegate = proxyquire(
          '../../../src/lib/dataElements/metricNavigationType',
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

    describe('when "navigationType" property is an invalid value', function () {
      beforeEach(function () {
        this.event.webvitals[this.metricData] = 'foo';

        this.controllerWithErrors = mockController(this.metricData, this.event.webvitals);

        this.dataElementDelegate = proxyquire(
          '../../../src/lib/dataElements/metricNavigationType',
          {
            '../controller': this.controllerWithErrors,
            '../controllers/turbine': this.turbine,
          }
        );
      });

      it('logs an error and returns nothing', function () {
        const result = this.dataElementDelegate(this.settings, this.event);

        expect(result).toBeUndefined();

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalledWith(
          `Invalid metric navigation type: "${this.event.webvitals.navigationType}".`
        );
      });
    });
  });

  describe('with valid "event" argument', function () {
    beforeEach(function () {
      this.dataElementDelegate = proxyquire(
        '../../../src/lib/dataElements/metricNavigationType',
        {
          '../controller': this.controller,
          '../controllers/turbine': this.turbine,
        }
      );
    });

    it('is a string', function () {
      const result = this.dataElementDelegate(this.settings, this.event);

      expect(result).toBeInstanceOf(String);

      expect(NAVIGATION_TYPES.has(result)).toBeTrue();
    });
  });
});
