/**
 * Copyright 2022-2023 Yuhui. All rights reserved.
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

const RATINGS = [
  'good',
  'needs-improvement',
  'poor',
];

describe('metricRating data element delegate', () => {
  beforeAll(() => {
    global.turbine = mockTurbine;
    this.dataElementDelegate = require('../../../src/lib/dataElements/metricRating');
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
      'should be undefined when "rating" property is missing',
      () => {
        delete this.event.webvitals.rating;
        const result = this.dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();

        const logWarn = global.turbine.logger.warn;
        expect(logWarn).toHaveBeenCalledWith('Metric rating not available.');
      }
    );

    it(
      'should be undefined when "rating" property is an invalid value',
      () => {
        this.event.webvitals.rating = 'foo';
        const result = this.dataElementDelegate(this.settings, this.event);
        expect(result).toBeUndefined();

        const logError = global.turbine.logger.error;
        expect(logError).toHaveBeenCalledWith(
          `Invalid metric rating: "${this.event.webvitals.rating}".`
        );
      }
    );
  });

  describe('with valid "event" argument', () => {
    it(
      'should be a string',
      () => {
        const result = this.dataElementDelegate(this.settings, this.event);
        expect(result).toBeInstanceOf(String);
        expect(RATINGS).toContain(result);
      }
    );
  });

});
