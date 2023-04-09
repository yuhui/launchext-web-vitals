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

describe('processTrigger helper delegate', () => {
  beforeAll(() => {
    global.turbine = mockTurbine;
    global.window = jasmine.createSpy();
    this.helperDelegate = require('../../../src/lib/helpers/processTrigger');
  });

  beforeEach(() => {
    this.metricData = jasmine.createSpy();
    this.triggerData = { trigger: jasmine.createSpy() };
  });

  afterAll(() => {
    delete global.turbine;
    delete global.window;
  });

  describe('with invalid arguments', () => {
    it(
      'should be undefined when "metricData" argument is missing',
      () => {
        const result = this.helperDelegate(null, this.triggerData);
        expect(result).toBeUndefined();

        const logError = turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('Web Vitals metric data not specified.');
      }
    );

    it(
      'should be undefined when "triggerData" argument is missing',
      () => {
        const result = this.helperDelegate(this.metricData, null);
        expect(result).toBeUndefined();

        const logError = turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('Rule event not specified.');
      }
    );

    it(
      'should be undefined when "triggerData.trigger" argument is missing',
      () => {
        const triggerData = jasmine.createSpy();

        const result = this.helperDelegate(this.metricData, triggerData);
        expect(result).toBeUndefined();

        const logError = turbine.logger.error;
        expect(logError).toHaveBeenCalledWith('Rule event not specified.');
      }
    );
  });

  describe('with valid arguments', () => {
    it(
      'should execute to completion',
      () => {
        this.helperDelegate(this.metricData, this.triggerData);

        const { trigger } = this.triggerData;
        expect(trigger).toHaveBeenCalledTimes(1);
      }
    );
  });

});
