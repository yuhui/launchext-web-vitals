/**
 * Copyright 2021-2024 Yuhui. All rights reserved.
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

const mockTurbine = require('../../specHelpers/mockTurbine');

const METRIC = 'CLS';

describe(`"${METRIC}" event delegate`, function() {
  beforeEach(function() {
    this.settings = {};
    this.trigger = jasmine.createSpy();
    this.turbine = mockTurbine();
  });

  describe('with broken handleEvent()', function() {
    beforeEach(function() {
      this.error = new Error('die');
      this.handleEvent = jasmine.createSpy().and.throwError(this.error);

      this.eventDelegate = proxyquire(
        '../../../src/lib/events/cumulativeLayoutShift',
        {
          '../controllers/turbine': this.turbine,
          '../helpers/handleEvent': this.handleEvent,
        }
      );
    });

    it('logs an error', function() {
      this.eventDelegate(this.settings, this.trigger);

      const { error: logError } = this.turbine.logger;
      expect(logError).toHaveBeenCalledOnceWith(this.error.message);
    });
  });

  describe('with everything working properly', function() {
    beforeEach(function() {
      this.handleEvent = jasmine.createSpy();

      this.eventDelegate = proxyquire(
        '../../../src/lib/events/cumulativeLayoutShift',
        {
          '../controllers/turbine': this.turbine,
          '../helpers/handleEvent': this.handleEvent,
        }
      );
    });

    it('sends the trigger to the events helper module once only', function() {
      this.eventDelegate(this.settings, this.trigger);

      expect(this.handleEvent).toHaveBeenCalledOnceWith(
        METRIC,
        this.settings,
        this.trigger
      );
    });
  });
});
