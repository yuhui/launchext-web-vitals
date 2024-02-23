/**
 * Copyright 2023-2024 Yuhui. All rights reserved.
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

describe('processEvent helper delegate', function () {
  beforeAll(function () {
    global.window = jasmine.createSpy();
  });

  beforeEach(function () {
    this.error = new Error('die');
    this.metricData = jasmine.createSpy();
    this.event = {
      settings: jasmine.createSpy(),
      trigger: jasmine.createSpy(),
    };
  });

  afterAll(function () {
    delete global.window;
  });

  describe('with invalid arguments', function () {
    beforeEach(function () {
      this.helperDelegate = require('../../../src/lib/helpers/processEvent');
    });

    it('throws an error when "metricData" argument is missing', function () {
      expect(() => {
        this.helperDelegate(null, this.event);
      }).toThrowError(Error, 'Web Vitals metric data not specified.');
    });

    it('throws an error when "event" argument is missing', function () {
      expect(() => {
        this.helperDelegate(this.metricData, null);
      }).toThrowError(Error, 'Rule event not specified.');
    });

    it('throws an error when "event.trigger" argument is missing', function () {
      const event = jasmine.createSpy();

      expect(() => {
        this.helperDelegate(this.metricData, event);
      }).toThrowError(Error, 'Rule event not specified.');
    });
  });

  describe('with valid arguments', function () {
    describe('with broken createGetWebVitalsMetricEvent()', function () {
      beforeEach(function () {
        this.createGetWebVitalsMetricEvent = jasmine.createSpy().and.throwError(this.error);

        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/processEvent',
          {
            './createGetWebVitalsMetricEvent': this.createGetWebVitalsMetricEvent,
          }
        );
      });

      it('throws the error message', function () {
        expect(() => {
          this.helperDelegate(this.metricData, this.event);
        }).toThrow(this.error);
      });
    });

    describe('with everything working properly', function () {
      beforeEach(function () {
        this.createGetWebVitalsMetricEvent = jasmine.createSpy();

        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/processEvent',
          {
            './createGetWebVitalsMetricEvent': this.createGetWebVitalsMetricEvent,
          }
        );
      });

      it('executes to completion', function () {
        this.helperDelegate(this.metricData, this.event);

        const { trigger } = this.event;
        expect(trigger).toHaveBeenCalledTimes(1);
      });
    });
  });
});
