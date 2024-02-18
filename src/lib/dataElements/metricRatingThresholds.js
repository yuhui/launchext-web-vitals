/**
 * Copyright 2023 Yuhui. All rights reserved.
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

const { getMetricRatingThresholds } = require('../helpers/webVitals');

const {
  logger: {
    error: logError,
  },
} = require('../controllers/turbine');
const validateMetric = require('../helpers/validateMetric');

/**
 * Rating Thresholds data element.
 * This data element returns the rating thresholds of the metric.
 *
 * @param {Object} settings The data element settings object.
 * @param {String} settings.metric=null The Web Vitals metric to get rating thresholds.
 * @returns {Array}
 */
module.exports = ({ metric = null }) => {
  try {
    validateMetric(metric);
  } catch (e) {
    logError(e.message);
    return;
  }

  const metricRatingThresholds = getMetricRatingThresholds(metric);

  return metricRatingThresholds;
};
