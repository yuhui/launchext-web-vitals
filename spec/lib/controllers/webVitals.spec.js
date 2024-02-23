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

const { WEB_VITALS_METRICS } = require('../../../src/lib/constants');

const mockWebVitalsObj = require('../../specHelpers/mockWebVitalsObj');

describe('webVitals controller delegate', function () {
  beforeEach(function () {
    this.handleWebVitalsMetric = jasmine.createSpy();
  });

  it('returns the expected object', function () {
    global.webVitals = mockWebVitalsObj();

    this.controllerDelegate = proxyquire(
      '../../../src/lib/controllers/webVitals',
      {
        '../helpers/handleWebVitalsMetric': this.handleWebVitalsMetric,
      }
    );

    const result = this.controllerDelegate;

    expect(result).toBeDefined();

    const { metrics, ratingThresholds } = result;

    expect(metrics).toBeDefined();
    expect(ratingThresholds).toBeDefined();

    const { listen } = metrics;

    expect(listen).toBeInstanceOf(Function);

    const { get } = ratingThresholds;

    expect(get).toBeInstanceOf(Function);

    delete global.webVitals;
  });

  describe('metrics object', function () {
    beforeEach(function () {
      this.objectName = 'metrics';
    });

    describe('listen() function', function () {
      beforeEach(function () {
        this.functionName = 'listen';
      });

      describe('with invalid arguments', function () {
        beforeEach(function () {
          global.webVitals = mockWebVitalsObj();

          this.controllerDelegate = proxyquire(
            '../../../src/lib/controllers/webVitals',
            {
              '../helpers/handleWebVitalsMetric': this.handleWebVitalsMetric,
            }
          );
          this.objectDelegate = this.controllerDelegate[this.objectName];
          this.functionDelegate = this.objectDelegate[this.functionName];
        });

        afterEach(function () {
          delete global.webVitals;
        });

        it('throws an error when "metric" argument is missing', function () {
          expect(() => {
            this.functionDelegate();
          }).toThrow();
        });

        it('throws an error when "metric" argument is not a Web Vitals metric', function () {
          expect(() => {
            this.functionDelegate('foo');
          }).toThrow();
        });
      });

      describe('with valid arguments', function () {
        beforeEach(function () {
          this.metric = 'CLS';
        });

        describe('with missing webVitals object', function () {
          beforeEach(function () {
            delete global.webVitals;

            this.controllerDelegate = proxyquire(
              '../../../src/lib/controllers/webVitals',
              {
                '../helpers/handleWebVitalsMetric': this.handleWebVitalsMetric,
              }
            );
            this.objectDelegate = this.controllerDelegate[this.objectName];
            this.functionDelegate = this.objectDelegate[this.functionName];
          });

          it('throws an error', function () {
            expect(() => {
              this.functionDelegate(this.metric);
            }).toThrow();
          });
        });

        describe('with broken webVitals object', function () {
          beforeEach(function () {
            global.webVitals = mockWebVitalsObj(this.metric);

            this.controllerDelegate = proxyquire(
              '../../../src/lib/controllers/webVitals',
              {
                '../helpers/handleWebVitalsMetric': this.handleWebVitalsMetric,
              }
            );
            this.objectDelegate = this.controllerDelegate[this.objectName];
            this.functionDelegate = this.objectDelegate[this.functionName];
          });

          afterEach(function () {
            delete global.webVitals;
          });

          it('throws an error', function () {
            expect(() => {
              this.functionDelegate(this.metric);
            }).toThrow();
          });
        });

        describe('with everything working properly', function () {
          beforeEach(function () {
            global.webVitals = mockWebVitalsObj();

            this.controllerDelegate = proxyquire(
              '../../../src/lib/controllers/webVitals',
              {
                '../helpers/handleWebVitalsMetric': this.handleWebVitalsMetric,
              }
            );
            this.objectDelegate = this.controllerDelegate[this.objectName];
            this.functionDelegate = this.objectDelegate[this.functionName];
          });

          afterEach(function () {
            delete global.webVitals;
          });

          for (const metric of WEB_VITALS_METRICS) {
            it(`calls "on${metric}()"`, function () {
              const onMetric = global.webVitals[`on${metric}`];

              this.functionDelegate(metric);

              expect(onMetric).toHaveBeenCalledOnceWith(this.handleWebVitalsMetric, {});
            });

            it(`calls "on${metric}()" with options`, function () {
              const options = { foo: 'bar' };
              const onMetric = global.webVitals[`on${metric}`];

              this.functionDelegate(metric, options);

              expect(onMetric).toHaveBeenCalledOnceWith(this.handleWebVitalsMetric, options);
            });
          }
        });
      });
    });
  });

  describe('ratingThresholds object', function () {
    beforeEach(function () {
      this.objectName = 'ratingThresholds';
    });

    describe('get() function', function () {
      beforeEach(function () {
        this.functionName = 'get';
      });

      describe('with invalid arguments', function () {
        beforeEach(function () {
          global.webVitals = mockWebVitalsObj();

          this.controllerDelegate = proxyquire(
            '../../../src/lib/controllers/webVitals',
            {
              '../helpers/handleWebVitalsMetric': this.handleWebVitalsMetric,
            }
          );
          this.objectDelegate = this.controllerDelegate[this.objectName];
          this.functionDelegate = this.objectDelegate[this.functionName];
        });

        afterEach(function () {
          delete global.webVitals;
        });

        it('throws an error when "metric" argument is missing', function () {
          expect(() => {
            this.functionDelegate();
          }).toThrow();
        });

        it('throws an error when "metric" argument is not a Web Vitals metric', function () {
          expect(() => {
            this.functionDelegate('foo');
          }).toThrow();
        });
      });

      describe('with valid arguments', function () {
        beforeEach(function () {
          this.metric = 'CLS';
        });

        describe('with missing webVitals object', function () {
          beforeEach(function () {
            delete global.webVitals;

            this.controllerDelegate = proxyquire(
              '../../../src/lib/controllers/webVitals',
              {
                '../helpers/handleWebVitalsMetric': this.handleWebVitalsMetric,
              }
            );
            this.objectDelegate = this.controllerDelegate[this.objectName];
            this.functionDelegate = this.objectDelegate[this.functionName];
          });

          it('throws an error', function () {
            expect(() => {
              this.functionDelegate(this.metric);
            }).toThrow();
          });
        });

        describe('with broken webVitals object', function () {
          beforeEach(function () {
            this.ratingThresholdsName = `${this.metric}Thresholds`;

            global.webVitals = mockWebVitalsObj('', this.metric);

            this.controllerDelegate = proxyquire(
              '../../../src/lib/controllers/webVitals',
              {
                '../helpers/handleWebVitalsMetric': this.handleWebVitalsMetric,
              }
            );
            this.objectDelegate = this.controllerDelegate[this.objectName];
            this.functionDelegate = this.objectDelegate[this.functionName];
          });

          afterEach(function () {
            delete global.webVitals;
          });

          it('throws an error when the metric rating thresholds are not available', function () {
            expect(() => {
              this.functionDelegate(this.metric);
            }).toThrowError(`Web Vitals "${this.ratingThresholdsName}" not found.`);
          });
        });

        describe('with everything working properly', function () {
          beforeEach(function () {
            global.webVitals = mockWebVitalsObj();

            this.controllerDelegate = proxyquire(
              '../../../src/lib/controllers/webVitals',
              {
                '../helpers/handleWebVitalsMetric': this.handleWebVitalsMetric,
              }
            );
            this.objectDelegate = this.controllerDelegate[this.objectName];
            this.functionDelegate = this.objectDelegate[this.functionName];
          });

          afterEach(function () {
            delete global.webVitals;
          });

          for (const metric of WEB_VITALS_METRICS) {
            it(`returns "${metric}Thresholds" array`, function () {
              const ratingThresholds = global.webVitals[`${metric}Thresholds`];

              const result = this.functionDelegate(metric);

              expect(result).toEqual(ratingThresholds);
              expect(result).toBeInstanceOf(Array);
              expect(result.length).toEqual(2);
            });
          }
        });
      });
    });
  });
});
