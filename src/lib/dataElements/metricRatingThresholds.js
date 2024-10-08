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

const {
  logger: {
    error: logError,
    warn: logWarn,
  },
} = require('../controllers/turbine');
const {
  ratingThresholds: {
    get: getMetricRatingThresholds,
  },
} = require('../controllers/webVitals');
const validateMetric = require('../helpers/validateMetric');

/**
 * Rating Thresholds data element.
 * This data element returns the rating thresholds of the metric.
 *
 * @param {Object} settings The data element settings object.
 * @param {String} settings.metric=null The Web Vitals metric to get rating thresholds.
 *
 * @returns {Array} The Web Vitals metric's rating thresholds.
 */
module.exports = ({ metric = null } = {}) => {
  try {
    validateMetric(metric);
  } catch (e) {
    logError(e.message);
    return;
  }

  let metricRatingThresholds;
  try {
    metricRatingThresholds = getMetricRatingThresholds(metric);
  } catch (e) {
    logError(e.message);
    return;
  }

  if (metric === 'FID') {
    logWarn(
      'Rating Thresholds for FID may be unavailable, because FID has been deprecated in Web Vitals 4.0. See https://github.com/GoogleChrome/web-vitals/pull/435.'
    );
  }

  return metricRatingThresholds;
};
