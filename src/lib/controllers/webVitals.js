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

const handleWebVitalsMetric = require('../helpers/handleWebVitalsMetric');
const validateMetric = require('../helpers/validateMetric');
const validateWebVitals = require('../helpers/validateWebVitals');

module.exports = {
  metrics: {
    /**
     * Listen for a Web Vitals metric.
     *
     * @param {String} metric=null The Web Vitals metric to listen for.
     * @param {Object} options={} Additional configuration options for the Web Vitals metric.
     *
     * @throws {Error} Web Vitals metric function is not found.
     * @throws {Error} error from validateMetric().
     * @throws {Error} error from validateWebVitals().
     */
    listen: function(metric = null, options = {}) {
      try {
        validateMetric(metric);
      } catch (e) {
        throw e;
      }

      try {
        validateWebVitals();
      } catch (e) {
        throw e;
      }

      const onMetricFunctionName = `on${metric}`;
      const onMetric = webVitals[onMetricFunctionName];

      onMetric(handleWebVitalsMetric, options);
    },
  },

  ratingThresholds: {
    /**
     * Get the rating thresholds for the specified Web Vitals metric.
     *
     * @param {String} metric=null The Web Vitals metric.
     *
     * @return {Array} The Web Vitals metric's rating thresholds.
     *
     * @throws {Error} Web Vitals metric rating thresholds is not found.
     * @throws {Error} error from validateMetric().
     * @throws {Error} error from validateWebVitals().
     */
    get: function(metric = null) {
      try {
        validateMetric(metric);
      } catch (e) {
        throw e;
      }

      try {
        validateWebVitals();
      } catch (e) {
        throw e;
      }

      const ratingThresholdsName = `${metric}Thresholds`;
      const ratingThresholds = webVitals[ratingThresholdsName];

      if (
        !ratingThresholds
        || Object.prototype.toString.call(ratingThresholds) !== '[object Array]'
      ) {
        throw new Error(`Web Vitals "${ratingThresholdsName}" not found.`);
      }

      return ratingThresholds;
    },
  },
};
