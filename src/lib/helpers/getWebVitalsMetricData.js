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

const { WEB_VITALS_METRICS_NAMES } = require('../constants');

/**
 * Get data for the current Web Vitals metric.
 *
 * @param {Object} data=null Data reported for the Web Vitals metric.
 *
 * @return {Object} Data about the current Web Vitals metric.
 *
 * @throw {Error} data is not specified.
 */
module.exports = (data = null) => {
  if (!data) {
    throw new Error('Web Vitals data not specified');
  }

  const metric = data.name;
  const metricFullName = WEB_VITALS_METRICS_NAMES.get(metric) || metric;

  const metricData = {
    ...data,
    fullName: metricFullName,
  };

  return metricData;
};
