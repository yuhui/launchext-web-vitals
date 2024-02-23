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

const { WEB_VITALS_METRICS } = require('../../src/lib/constants');
const mockBaseEvent = require('../specHelpers/mockBaseEvent');
const mockBatch = require('../specHelpers/mockBatch');
const mockEvents = require('../specHelpers/mockEvents');
const mockMetricData = require('../specHelpers/mockMetricData');
const mockTurbine = require('../specHelpers/mockTurbine');

describe('controller delegate', function () {
  beforeEach(function () {
    this.batch = mockBatch();
    this.enableWebVitals = jasmine.createSpy().and.resolveTo('foo');
    this.event = mockBaseEvent();
    this.events = mockEvents();
    this.metricData = mockMetricData();
    this.turbine = mockTurbine({ enableBatching: 'yes' });
    this.validateMetric = jasmine.createSpy().and.returnValue(true);
  });

  describe('clearBatch() function', function () {
    beforeEach(function () {
      this.functionName = 'clearBatch';
    });

    describe('when batching is disabled', function () {
      beforeEach(function () {
        this.turbineWithoutBatching = mockTurbine();

        this.delegate = proxyquire(
          '../../src/lib/controller',
          {
            './controllers/batch': this.batch,
            './controllers/turbine': this.turbineWithoutBatching,
            './helpers/enableWebVitals': this.enableWebVitals,
          }
        );
        this.functionDelegate = this.delegate[this.functionName];
      });

      it('throws an error', function () {
        expect(() => {
          this.functionDelegate();
        }).toThrowError(Error, 'Batching has not been enabled. Check your extension settings.');
      });
    });

    describe('when batching is enabled', function () {
      beforeEach(function () {
        this.delegate = proxyquire(
          '../../src/lib/controller',
          {
            './controllers/batch': this.batch,
            './controllers/turbine': this.turbine,
            './helpers/enableWebVitals': this.enableWebVitals,
          }
        );
        this.functionDelegate = this.delegate[this.functionName];
      });

      it('executes to completion', function () {
        this.functionDelegate(this.metricData);

        const { clear: clearBatch } = this.batch;
        expect(clearBatch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('getBatch() function', function () {
    beforeEach(function () {
      this.functionName = 'getBatch';
    });

    describe('when batching is disabled', function () {
      beforeEach(function () {
        this.turbineWithoutBatching = mockTurbine();

        this.delegate = proxyquire(
          '../../src/lib/controller',
          {
            './controllers/batch': this.batch,
            './controllers/turbine': this.turbineWithoutBatching,
            './helpers/enableWebVitals': this.enableWebVitals,
          }
        );
        this.functionDelegate = this.delegate[this.functionName];
      });

      it('throws an error', function () {
        expect(() => {
          this.functionDelegate(this.metricData);
        }).toThrowError(Error, 'Batching has not been enabled. Check your extension settings.');
      });
    });

    describe('when batching is enabled', function () {
      beforeEach(function () {
        this.delegate = proxyquire(
          '../../src/lib/controller',
          {
            './controllers/batch': this.batch,
            './controllers/turbine': this.turbine,
            './helpers/enableWebVitals': this.enableWebVitals,
          }
        );
        this.functionDelegate = this.delegate[this.functionName];
      });

      it('executes to completion', function () {
        const result = this.functionDelegate(this.metricData);

        expect(result).toBeDefined();

        const { get: getBatch } = this.batch;
        expect(getBatch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('getMetricData() function', function () {
    beforeEach(function () {
      this.functionName = 'getMetricData';
      this.metricData = 'id';

      this.delegate = proxyquire(
        '../../src/lib/controller',
        {
          './controllers/turbine': this.turbine,
          './helpers/enableWebVitals': this.enableWebVitals,
        }
      );
      this.functionDelegate = this.delegate[this.functionName];
    });

    describe('with invalid arguments', function () {
      it('throws an error when "metricData" argument is missing', function () {
        expect(() => {
          this.functionDelegate(undefined);
        }).toThrowError(Error, 'Web Vitals metric data not specified.');
      });

      it('throws an error when "event" argument is missing', function () {
        expect(() => {
          this.functionDelegate(this.metricData);
        }).toThrowError(
          Error,
          '"event" argument not specified. Use _satellite.getVar("data element name", event);'
        );
      });

      it('throws an error when "event.webvitals" property is missing', function () {
        delete this.event.webvitals;
        expect(() => {
          this.functionDelegate(this.metricData, this.event);
        }).toThrowError(Error, 'Web Vitals not available.');
      });
    });

    describe('with valid arguments', function () {
      const baseEvent = mockBaseEvent();
      Object.keys(baseEvent.webvitals).forEach((key) => {
        it(`throws an error when "event.webVitals.${key}" is missing`, function () {
          delete this.event.webvitals[key];
          expect(() => {
            this.functionDelegate(key, this.event);
          }).toThrowError(Error, `Metric "${key}" not available.`);
        });

        it(`"${key}" is defined`, function () {
          const result = this.functionDelegate(key, this.event);
          expect(result).toEqual(this.event.webvitals[key]);
        });
      });
    });
  });

  describe('handleEvent() function', function () {
    beforeEach(function () {
      this.functionName = 'handleEvent';
      this.settings = {};
      this.trigger = jasmine.createSpy();

      this.delegate = proxyquire(
        '../../src/lib/controller',
        {
          './controllers/events': this.events,
          './controllers/turbine': this.turbine,
          './helpers/enableWebVitals': this.enableWebVitals,
          './helpers/validateMetric': this.validateMetric,
        }
      );
      this.functionDelegate = this.delegate[this.functionName];
    });

    for (const metric of WEB_VITALS_METRICS) {
      it(
        `executes to completion when "metric" is Web Vitals metric "${metric}"`,
        async function () {
          await this.functionDelegate(metric, this.settings, this.trigger);

          const { register: registerEvent } = this.events;
          expect(registerEvent).toHaveBeenCalledOnceWith(metric, this.settings, this.trigger);
        }
      );
    }
  });
});
