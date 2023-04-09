/**
 * Copyright 2021-2023 Yuhui. All rights reserved.
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

const mockBaseEvent = require('../../specHelpers/mockBaseEvent');
const mockTurbine = require('../../specHelpers/mockTurbine');

describe('metricDelta data element delegate', () => {
  beforeAll(() => {
    global.turbine = mockTurbine;
    this.dataElementDelegate = require('../../../src/lib/dataElements/metricDelta');
  });

  beforeEach(() => {
    this.event = mockBaseEvent();
    this.settings = {}; // this data element does not have any custom settings
  });

  afterAll(() => {
    delete global.turbine;
  });

  describe('with invalid "event" argument', () => {
    it(
      'should be undefined when "event" argument is missing',
      () => {
        const result = this.dataElementDelegate(this.settings);
        expect(result).toBeUndefined();

        const logWarn = global.turbine.logger.warn;
        expect(logWarn).toHaveBeenCalledWith(
          '"event" argument not specified. Use _satellite.getVar("data element name", event);'
        );
      }
    );

    it(
      'should be undefined when "webvitals" property is missing',
      () => {
        delete this.event.webvitals;
        const result = this.dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();

        const logWarn = global.turbine.logger.warn;
        expect(logWarn).toHaveBeenCalledWith('Web Vitals not available.');
      }
    );

    it(
      'should be undefined when "delta" property is missing',
      () => {
        delete this.event.webvitals.delta;
        const result = this.dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();

        const logWarn = global.turbine.logger.warn;
        expect(logWarn).toHaveBeenCalledWith('Metric delta not available.');
      }
    );
  });

  describe('with valid "event" argument', () => {
    it(
      'should be a float',
      () => {
        const result = this.dataElementDelegate(this.settings, this.event);
        expect(result).toBeInstanceOf(Number);
      }
    );
  });

});
