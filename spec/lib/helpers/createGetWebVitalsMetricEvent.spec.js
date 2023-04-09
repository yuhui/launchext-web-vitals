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

const mockTurbine = require('../../specHelpers/mockTurbine');

describe('createGetWebVitalsMetricEvent helper delegate', () => {
  beforeAll(() => {
    global.turbine = mockTurbine;
    global.window = jasmine.createSpy();
    this.helperDelegate = require('../../../src/lib/helpers/createGetWebVitalsMetricEvent');
  });

  beforeEach(() => {
    this.metricData = jasmine.createSpy();
  });

  afterAll(() => {
    delete global.turbine;
    delete global.window;
  });

  describe('with invalid arguments', () => {
    it(
      'should be undefined when "metricData" argument is missing',
      () => {
        const result = this.helperDelegate();
        expect(result).toBeUndefined();

        const logError = turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('Web Vitals metric not specified.');
      }
    );
  });

  describe('with valid arguments', () => {
    it(
      'should return a valid object',
      () => {
        const result = this.helperDelegate(this.metricData);
        expect(result).toBeInstanceOf(Object);

        const keys = Object.keys(result);
        expect(keys.length).toEqual(3);

        expect(result.window).toEqual(global.window);
        expect(result.target).toEqual(global.window);
        expect(result.webvitals).toEqual(this.metricData);
      }
    );
  });

});
