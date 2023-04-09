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

const { logger } = turbine;

/**
 * Get data for the current Web Vitals metric.
 *
 * @param {Object} data=null Data measured for the Web Vitals metric.
 * @param {String} metricFullName=null The Web Vitals metric full name.
 *
 * @return {Object} Data about the current Web Vitals metric.
 */
module.exports = (data = null, metricFullName = null) => {
  if (!data) {
    logger.error('Web Vitals data not specified.');
    return;
  }

  if (!metricFullName) {
    logger.error('Web Vitals metric full name not specified.');
    return;
  }

  const metricData = Object.assign({}, data, { fullName: metricFullName });

  return metricData;
};
