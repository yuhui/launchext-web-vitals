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

const { WEB_VITALS_METRICS } = require('../constants');

/**
 * Validate that the global Web Vitals library is proper.
 *
 * @global webVitals
 *
 * @returns {Boolean} `true` if the Web Vitals library is proper.
 *
 * @throws {Error} webVitals is not set.
 * @throws {Error} webVitals does not have any of the expected `on*` functions.
 */
module.exports = () => {
  let isValidWebVitals = typeof webVitals !== 'undefined' && !!webVitals;

  if (!isValidWebVitals) {
    throw new Error('Web Vitals is not available.');
  }

  let onMetric;
  for (const metric of WEB_VITALS_METRICS) {
    onMetric = webVitals[`on${metric}`];
    isValidWebVitals &= typeof onMetric === 'function';
  }

  if (!isValidWebVitals) {
    throw new Error('Web Vitals is not available.');
  }

  return true;
};
