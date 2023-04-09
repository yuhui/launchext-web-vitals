/**
 * Copyright 2021-2023 Yuhui. All rights reserved.
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

const mockWebVitals = require('../../specHelpers/mockWebVitals');

const METRIC = 'LCP';
const webVitals = mockWebVitals();

describe(`"${METRIC}" event delegate`, () => {
  beforeEach(() => {
    this.eventDelegate = proxyquire('../../../src/lib/events/largestContentfulPaint', {
      '../helpers/webVitals': webVitals,
    });
    this.settings = {};
    this.trigger = jasmine.createSpy();
  });

  it(
    'sends the trigger to the webVitals helper module once only',
    () => {
      this.eventDelegate(this.settings, this.trigger);

      const { registerEventStateTrigger } = webVitals;
      expect(registerEventStateTrigger).toHaveBeenCalledTimes(1);
      expect(registerEventStateTrigger).toHaveBeenCalledWith(
        METRIC,
        this.settings,
        this.trigger
      );
    }
  );
});
