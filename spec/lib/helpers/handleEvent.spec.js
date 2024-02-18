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
const mockEvents = require('../../specHelpers/mockEvents');

describe('handleEvent helper delegate', function() {
  beforeEach(function() {
    this.events = mockEvents();
    this.enableWebVitals = jasmine.createSpy().and.resolveTo(true);
  });

  describe('with invalid arguments', function() {
    beforeEach(function() {
      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/handleEvent',
        {
          './enableWebVitals': this.enableWebVitals,
          '../controllers/events': this.events,
        }
      );
    });

    it('throws an error when "metric" argument is missing', async function() {
      await expectAsync(
        this.helperDelegate()
      ).toBeRejected();
    });

    it('throws an error when "metric" argument is not a Web Vitals metric', async function() {
      await expectAsync(
        this.helperDelegate('foo')
      ).toBeRejected();
    });
  });

  describe('with valid arguments', function() {
    beforeEach(function() {
      this.settings = {};
      this.trigger = jasmine.createSpy();
    });

    describe('with broken events', function() {
      beforeEach(function() {
        this.eventsWithErrors = mockEvents(true);

        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/handleEvent',
          {
            './enableWebVitals': this.enableWebVitals,
            '../controllers/events': this.eventsWithErrors,
          }
        );
      });

      it('throws an error', async function() {
        await expectAsync(
          this.helperDelegate('CLS', this.settings, this.trigger)
        ).toBeRejected();
      });
    });

    describe('with broken enableWebVitals()', function() {
      beforeEach(function() {
        this.enableWebVitalsWithErrors = jasmine.createSpy().and.rejectWith('die');

        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/handleEvent',
          {
            './enableWebVitals': this.enableWebVitalsWithErrors,
            '../controllers/events': this.events,
          }
        );
      });

      it('throws an error', async function() {
        await expectAsync(
          this.helperDelegate('CLS', this.settings, this.trigger)
        ).toBeRejected();
      });
    });

    describe('with everything working properly', function() {
      beforeEach(function() {
        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/handleEvent',
          {
            './enableWebVitals': this.enableWebVitals,
            '../controllers/events': this.events,
          }
        );
      });

      for (const metric of WEB_VITALS_METRICS) {
        it(
          `executes to completion when "metric" is Web Vitals metric "${metric}"`,
          async function() {
            await this.helperDelegate(metric, this.settings, this.trigger);

            const { register: registerEvent } = this.events;
            expect(registerEvent).toHaveBeenCalledOnceWith(metric, this.settings, this.trigger);

            expect(this.enableWebVitals).toHaveBeenCalledTimes(1);
          }
        );
      }
    });
  });
});
