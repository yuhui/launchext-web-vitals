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

const mockMetricData = require('../../specHelpers/mockMetricData');
const mockTurbine = require('../../specHelpers/mockTurbine');

describe('getWebVitalsMetricData helper delegate', () => {
  beforeAll(() => {
    global.turbine = mockTurbine;
    this.helperDelegate = require('../../../src/lib/helpers/getWebVitalsMetricData');
  });

  beforeEach(() => {
    this.data = mockMetricData();
    this.metricFullName = this.data.fullName;
    delete this.data.fullName;
  });

  afterAll(() => {
    delete global.turbine;
  });

  describe('with invalid arguments', () => {
    it(
      'should be undefined when "data" argument is missing',
      () => {
        const result = this.helperDelegate(null, this.metricFullName);
        expect(result).toBeUndefined();

        const logError = turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('Web Vitals data not specified.');
      }
    );

    it(
      'should be undefined when "metricFullName" argument is missing',
      () => {
        const result = this.helperDelegate(this.data, null);
        expect(result).toBeUndefined();

        const logError = turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('Web Vitals metric full name not specified.');
      }
    );
  });

  describe('with valid arguments', () => {
    it(
      'should return a valid object',
      () => {
        const result = this.helperDelegate(this.data, this.metricFullName);
        expect(result).toBeInstanceOf(Object);

        const dataKeys = Object.keys(this.data);
        dataKeys.forEach((key) => expect(result[key]).toEqual(this.data[key]));
        expect(result.fullName).toEqual(this.metricFullName);
      }
    );
  });

});
