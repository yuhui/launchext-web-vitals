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

/**
 * Return a `webVitals` spy object for use with event unit testing.
 */
module.exports = function (throwError = false) {
  const webVitals = {
    metrics: {
      listen: jasmine.createSpy(),
    },
    ratingThresholds: {
      get: jasmine.createSpy().and.returnValue([1, 2]),
    },
  };

  const webVitalsWithErrors = {
    metrics: {
      listen: jasmine.createSpy().and.throwError('die'),
    },
    ratingThresholds: {
      get: jasmine.createSpy().and.throwError('die'),
    },
  };

  return throwError ? webVitalsWithErrors : webVitals;
};
