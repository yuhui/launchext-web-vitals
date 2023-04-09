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

const proxyquire = require('proxyquire').noCallThru();

const mockProcessTrigger = jasmine.createSpy();
const mockTurbine = require('../../specHelpers/mockTurbine');

describe('processTriggers helper delegate', () => {
  beforeAll(() => {
    global.turbine = mockTurbine;
    this.helperDelegate = proxyquire('../../../src/lib/helpers/processTriggers', {
      './processTrigger': mockProcessTrigger,
    });
  });

  beforeEach(() => {
    this.metricData = jasmine.createSpy();
    this.metricTriggerData = [ jasmine.createSpy(), jasmine.createSpy() ];
  });

  afterAll(() => {
    delete global.turbine;
  });

  describe('with invalid arguments', () => {
    it(
      'should be undefined when "metricData" argument is missing',
      () => {
        const result = this.helperDelegate(null, this.metricTriggerData);
        expect(result).toBeUndefined();

        const logError = turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('Web Vitals metric data not specified.');
      }
    );

    it(
      'should be undefined when "metricTriggerData" argument is missing',
      () => {
        const result = this.helperDelegate(this.metricData, null);
        expect(result).toBeUndefined();

        const logError = turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('Rule events not specified.');
      }
    );

    it(
      'should be undefined when "metricTriggerData" argument is not an array',
      () => {
        const result = this.helperDelegate(this.metricData, 'foo');
        expect(result).toBeUndefined();

        const logError = turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('Rule events not specified.');
      }
    );
  });

  describe('with valid arguments', () => {
    it(
      'should execute to completion',
      () => {
        this.helperDelegate(this.metricData, this.metricTriggerData);

        this.metricTriggerData.forEach((triggerData) => {
          expect(mockProcessTrigger).toHaveBeenCalledWith(this.metricData, triggerData);
        });

        const numTriggerData = this.metricTriggerData.length;
        expect(mockProcessTrigger).toHaveBeenCalledTimes(numTriggerData);
      }
    );
  });

});
