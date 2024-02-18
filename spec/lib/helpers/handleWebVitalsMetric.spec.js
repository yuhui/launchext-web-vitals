/**
 * Copyright 2024 Yuhui. All rights reserved.
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

const mockBatch = require('../../specHelpers/mockBatch');
const mockEvents = require('../../specHelpers/mockEvents');
const mockMetricData = require('../../specHelpers/mockMetricData');

describe('handleWebVitalsMetric helper delegate', function() {
  beforeEach(function() {
    this.batch = mockBatch();
    this.data = mockMetricData();
    this.error = new Error('die');
    this.events = mockEvents();
  });

  describe('with invalid arguments', function() {
    beforeEach(function() {
      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/handleWebVitalsMetric',
        {
          '../controllers/batch': this.batch,
          '../controllers/events': this.events,
        }
      );
    });

    it('throws an error when "data" argument is missing', function() {
      expect(() => {
        this.helperDelegate();
      }).toThrowError(Error, 'Web Vitals metric data not specified');
    });
  });

  describe('with valid arguments', function() {
    describe('with broken events', function() {
      beforeEach(function() {
        this.events = mockEvents(true);

        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/handleWebVitalsMetric',
          {
            '../controllers/batch': this.batch,
            '../controllers/events': this.events,
          }
        );
      });

      it('throws an error', function() {
        expect(() => {
          this.helperDelegate(this.data);
        }).toThrowError();
      });
    });

    describe('with broken getWebVitalsMetricData()', function() {
      beforeEach(function() {
        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/handleWebVitalsMetric',
          {
            './getWebVitalsMetricData': jasmine.createSpy().and.throwError(this.error),
            '../controllers/batch': this.batch,
            '../controllers/events': this.events,
          }
        );
      });

      it('throws an error', function() {
        expect(() => {
          this.helperDelegate(this.data);
        }).toThrow(this.error);
      });
    });

    describe('with broken batch', function() {
      beforeEach(function() {
        this.batch = mockBatch(true);

        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/handleWebVitalsMetric',
          {
            '../controllers/batch': this.batch,
            '../controllers/events': this.events,
          }
        );
      });

      it('throws an error', function() {
        expect(() => {
          this.helperDelegate(this.data);
        }).toThrowError();
      });
    });

    describe('with broken processEvent()', function() {
      beforeEach(function() {
        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/handleWebVitalsMetric',
          {
            './processEvent': jasmine.createSpy().and.throwError(this.error),
            '../controllers/batch': this.batch,
            '../controllers/events': this.events,
          }
        );
      });

      it('throws the error message', function() {
        expect(() => {
          this.helperDelegate(this.data);
        }).toThrow(this.error);
      });
    });

    describe('with everything working properly', function() {
      beforeEach(function() {
        this.getWebVitalsMetricData = jasmine.createSpy();
        this.processEvent = jasmine.createSpy();

        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/handleWebVitalsMetric',
          {
            './getWebVitalsMetricData': this.getWebVitalsMetricData.and.returnValue(this.data),
            './processEvent': this.processEvent,
            '../controllers/batch': this.batch,
            '../controllers/events': this.events,
          }
        );
      });

      it('executes to completion', function() {
        const data = { ...this.data };
        delete data.fullName;
        this.helperDelegate(data);

        const { name: metric } = data;
        const { get: getEvents } = this.events;
        expect(getEvents).toHaveBeenCalledOnceWith(metric);

        expect(this.getWebVitalsMetricData).toHaveBeenCalledOnceWith(data);

        const { append: appendToBatch } = this.batch;
        expect(appendToBatch).toHaveBeenCalledOnceWith(this.data);

        const events = getEvents();
        const numEvents = events.length;
        expect(this.processEvent).toHaveBeenCalledTimes(numEvents);
        events.forEach((event) => {
          expect(this.processEvent).toHaveBeenCalledWith(this.data, event);
        });
      });
    });
  });
});
